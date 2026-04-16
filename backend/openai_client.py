import os
from datetime import datetime

import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field
from pandas.api.types import is_datetime64_any_dtype

try:
    from backend.openai_interface import OpenAISummaryClient, SummaryResult
except ImportError:
    from openai_interface import OpenAISummaryClient, SummaryResult

load_dotenv()
MAX_ROWS = 500
DEFAULT_OPENAI_MODEL = "gpt-5-nano"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL)
SUMMARY_INSTRUCTIONS = (
    "You are drafting the AI-generated summary section of a KPI analytics report for operations stakeholders. "
    "Use only the supplied report facts. "
    "Write one readable summary paragraph of three to five sentences followed by up to three concise highlight bullets. "
    "Start with the big picture: demand, response performance, resource pressure, and any notable coverage or mutual-aid themes. "
    "Then emphasize only the most decision-relevant findings rather than listing every metric. "
    "You may add moderate interpretation, likely operational implications, and short, grounded recommendations when they are clearly supported by the data. "
    "Use cautious language for inference, such as 'may indicate', 'could reflect', or 'suggests'. "
    "Do not present speculation as fact, do not invent unsupported causes, and do not restate the report as a metric dump. "
    "Each highlight bullet should be a takeaway, not a raw statistic list."
)


class StructuredExportSummary(BaseModel):
    summary_paragraph: str = Field(
        description="A polished report summary paragraph of three to five sentences."
    )
    summary_highlights: list[str] = Field(
        default_factory=list,
        max_length=3,
        description="Up to three concise bullet-style highlights grounded in the report data.",
    )


class OpenAISummaryService(OpenAISummaryClient):
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or OPENAI_API_KEY
        self.model = OPENAI_MODEL

    def generate_summary_prompt(self, data: pd.DataFrame, endpoint: str) -> str:
        formatter = {
            "export_context": self._format_export_context_section,
            "overview": self._format_overview_section,
            "heatmap": self._format_heatmap_section,
            "postal_code": self._format_postal_code_section,
            "type_breakdown": self._format_type_breakdown_section,
            "unit_hour_utilization": self._format_unit_hour_utilization_section,
            "call_volume_trend": self._format_call_volume_trend_section,
            "mutual_aid": self._format_mutual_aid_section,
            "response_time_breakdown": self._format_response_time_section,
        }.get(endpoint, self._format_generic_section)

        return formatter(data)

    def get_char_count(self, text: str) -> int:
        return len(text)

    def process_data_input(self, df: pd.DataFrame) -> pd.DataFrame:
        cleaned = df.dropna(how="all").copy()
        cleaned = cleaned.reset_index(drop=True)

        if len(cleaned) > MAX_ROWS:
            cleaned = cleaned.head(MAX_ROWS)

        for col in cleaned.columns:
            if is_datetime64_any_dtype(cleaned[col]):
                cleaned[col] = cleaned[col].astype(str)

        return cleaned

    def request_summary(self, prompt: str) -> str:
        return self._request_structured_summary(prompt).summary_paragraph

    def _request_structured_summary(self, prompt: str) -> StructuredExportSummary:
        if not self.api_key:
            raise ValueError("OpenAI API key is not configured.")

        client = OpenAI(api_key=self.api_key)
        response = client.responses.parse(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": SUMMARY_INSTRUCTIONS,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            text_format=StructuredExportSummary,
            store=False,
        )
        parsed = getattr(response, "output_parsed", None)
        if not parsed or not parsed.summary_paragraph.strip():
            raise RuntimeError("OpenAI returned an empty structured summary.")
        return parsed

    def summarize_dashboard(self, data: dict[str, pd.DataFrame]) -> SummaryResult:
        if not self.api_key:
            return {
                "status": "unavailable",
                "summary": "",
                "summary_paragraph": "",
                "summary_highlights": [],
                "message": "OpenAI API key is not configured.",
            }

        sections = []
        for endpoint, df in data.items():
            if df is None or df.empty:
                continue
            cleaned = self.process_data_input(df)
            if cleaned.empty:
                continue
            sections.append(self.generate_summary_prompt(cleaned, endpoint))

        if not sections:
            return {
                "status": "ready",
                "summary": "No report data was available to summarize for this export.",
                "summary_paragraph": "No report data was available to summarize for this export.",
                "summary_highlights": [],
            }

        prompt = self._build_dashboard_prompt(sections)

        try:
            structured_summary = self._request_structured_summary(prompt)
        except Exception as exc:
            return {
                "status": "error",
                "summary": "",
                "summary_paragraph": "",
                "summary_highlights": [],
                "message": f"OpenAI summary request failed: {exc.__class__.__name__}",
            }

        summary_paragraph = structured_summary.summary_paragraph.strip()
        summary_highlights = [
            bullet.strip()
            for bullet in structured_summary.summary_highlights
            if bullet and bullet.strip()
        ][:3]

        return {
            "status": "ready",
            "summary": summary_paragraph,
            "summary_paragraph": summary_paragraph,
            "summary_highlights": summary_highlights,
        }

    def _build_dashboard_prompt(self, dataset_sections: list[str]) -> str:
        sections = "\n\n---\n\n".join(dataset_sections)
        return (
            "Create the AI-generated summary content for this KPI dashboard export. "
            "Synthesize themes instead of listing every input. "
            "Mention only the most decision-relevant facts, explain what the patterns may indicate operationally, "
            "and keep any recommendation short, cautious, and directly tied to the report facts. "
            "Use the report context to anchor the narrative to the selected region, time window, and charts.\n\n"
            f"{sections}"
        )

    def _format_export_context_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        facts = [
            self._fact_line("Region", self._format_region(row.get("region"))),
            self._fact_line(
                "Reporting window",
                self._format_date_range(row.get("start_date"), row.get("end_date")),
            ),
            self._fact_line(
                "Charts included",
                self._format_chart_list(row.get("selected_charts"), row.get("selected_chart_count")),
            ),
        ]
        return self._section_block("Report context", facts)

    def _format_overview_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        facts = [
            self._fact_line("Total incidents", self._format_int(row.get("total_incidents"))),
            self._fact_line(
                "Average response time",
                self._format_minutes(row.get("avg_response_time_minutes")),
            ),
            self._fact_line("Active units", self._format_int(row.get("active_units"))),
            self._fact_line(
                "Peak load factor",
                self._format_ratio(row.get("peak_load_factor")),
            ),
            self._fact_line("Peak hour", self._format_hour(row.get("peak_hour"))),
        ]
        return self._section_block("Overview", facts)

    def _format_heatmap_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        facts = [
            self._fact_line(
                "Busiest period",
                self._format_day_hour(row.get("busiest_day"), row.get("busiest_hour")),
            ),
            self._fact_line(
                "Max incidents in a day-hour cell",
                self._format_int(row.get("max_incidents_per_cell")),
            ),
        ]
        return self._section_block("Heat map", facts)

    def _format_postal_code_section(self, data: pd.DataFrame) -> str:
        rows = []
        for index, (_, row) in enumerate(data.head(3).iterrows()):
            zip_code = row.get("zip")
            count = self._format_int(row.get("count"))
            avg_response = self._format_minutes(row.get("avg_response_minutes"))
            if not zip_code or not count:
                continue

            lead_in = "Highest volume area" if index == 0 else "Additional hotspot"
            detail = f"{lead_in}: {zip_code} with {count} incidents"
            if avg_response:
                detail = f"{detail} and average response {avg_response}"
            if detail:
                rows.append(detail)

        return self._section_block("Postal code hotspots", rows)

    def _format_type_breakdown_section(self, data: pd.DataFrame) -> str:
        rows = []
        for index, (_, row) in enumerate(data.head(3).iterrows()):
            incident_type = row.get("type")
            count = self._format_int(row.get("count"))
            if incident_type and count:
                lead_in = "Most common type" if index == 0 else "Additional high-volume type"
                rows.append(f"{lead_in}: {incident_type} with {count} incidents")

        return self._section_block("Incident type breakdown", rows)

    def _format_unit_hour_utilization_section(self, data: pd.DataFrame) -> str:
        first_row = data.iloc[0]
        facts = [
            self._fact_line(
                "Scottsdale UHU",
                self._format_percentage(first_row.get("scottsdale_uhu")),
            ),
            self._fact_line(
                "Non-Scottsdale UHU",
                self._format_percentage(first_row.get("non_scottsdale_uhu")),
            ),
        ]

        gap = self._format_uhu_gap(
            first_row.get("scottsdale_uhu"), first_row.get("non_scottsdale_uhu")
        )
        if gap:
            facts.append(gap)

        top_units = []
        for _, row in data.head(3).iterrows():
            unit_id = row.get("unit_id")
            uhu = self._format_percentage(row.get("uhu"))
            if unit_id and uhu:
                top_units.append(f"{unit_id}: {uhu}")

        if top_units:
            facts.append(f"Highest-utilization units: {', '.join(top_units)}")

        return self._section_block("Unit hour utilization", facts)

    def _format_call_volume_trend_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        facts = [
            self._fact_line(
                "Peak demand period",
                self._format_peak_bucket(
                    row.get("peak_bucket_label"),
                    row.get("peak_bucket_count"),
                ),
            ),
            self._fact_line(
                "Average incidents per bucket",
                self._format_decimal(row.get("average_bucket_count")),
            ),
        ]
        return self._section_block("Call volume trend", facts)

    def _format_mutual_aid_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        facts = [
            self._fact_line(
                "Scottsdale units outside coverage area",
                self._format_int(row.get("scottsdale_units_outside")),
            ),
            self._fact_line(
                "Other units in Scottsdale",
                self._format_int(row.get("other_units_in_scottsdale")),
            ),
        ]

        balance = self._format_mutual_aid_balance(
            row.get("scottsdale_units_outside"), row.get("other_units_in_scottsdale")
        )
        if balance:
            facts.append(balance)

        return self._section_block("Mutual aid", facts)

    def _format_response_time_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        metrics = {
            "Call processing": ("call_processing_avg", "call_processing_p90"),
            "Turnout": ("turnout_avg", "turnout_p90"),
            "Travel": ("travel_avg", "travel_p90"),
        }
        facts = []
        slowest = self._find_slowest_response_phase(row, metrics)
        if slowest:
            facts.append(slowest)

        for label, (avg_key, p90_key) in metrics.items():
            avg = self._format_minutes(row.get(avg_key))
            p90 = self._format_minutes(row.get(p90_key))
            if avg or p90:
                facts.append(f"{label}: avg {avg or 'n/a'}, P90 {p90 or 'n/a'}")

        return self._section_block("Response time breakdown", facts)

    def _format_generic_section(self, data: pd.DataFrame) -> str:
        rows = []
        for _, row in data.head(3).iterrows():
            formatted = ", ".join(
                f"{column}: {self._normalize_value(row[column])}"
                for column in data.columns
                if self._normalize_value(row[column]) is not None
            )
            if formatted:
                rows.append(formatted)

        return self._section_block("Additional report data", rows)

    def _section_block(self, title: str, facts: list[str]) -> str:
        content = [fact for fact in facts if fact]
        if not content:
            return f"{title}:\n- No material data available."

        lines = "\n".join(f"- {fact}" for fact in content)
        return f"{title}:\n{lines}"

    def _fact_line(self, label: str, value: str | None) -> str | None:
        if not value:
            return None
        return f"{label}: {value}"

    def _normalize_value(self, value) -> str | None:
        if value is None or pd.isna(value):
            return None
        if isinstance(value, str):
            return value
        if isinstance(value, (int,)):
            return self._format_int(value)
        if isinstance(value, float):
            return self._format_decimal(value)
        return str(value)

    def _format_int(self, value) -> str | None:
        if value is None or pd.isna(value):
            return None
        try:
            return f"{int(round(float(value))):,}"
        except (TypeError, ValueError):
            return None

    def _format_decimal(self, value, digits: int = 1) -> str | None:
        if value is None or pd.isna(value):
            return None
        try:
            number = float(value)
        except (TypeError, ValueError):
            return None

        formatted = f"{number:.{digits}f}"
        if "." in formatted:
            formatted = formatted.rstrip("0").rstrip(".")
        return formatted

    def _format_minutes(self, value) -> str | None:
        formatted = self._format_decimal(value, digits=1)
        return f"{formatted} min" if formatted else None

    def _format_percentage(self, value) -> str | None:
        formatted = self._format_decimal(value, digits=1)
        return f"{formatted}%" if formatted else None

    def _format_ratio(self, value) -> str | None:
        formatted = self._format_decimal(value, digits=2)
        return f"{formatted}x average demand" if formatted else None

    def _format_hour(self, value) -> str | None:
        if value is None or pd.isna(value):
            return None
        try:
            hour = int(float(value))
        except (TypeError, ValueError):
            return None
        if hour < 0 or hour > 23:
            return str(hour)
        display_hour = hour % 12 or 12
        meridiem = "AM" if hour < 12 else "PM"
        return f"{display_hour} {meridiem}"

    def _format_date_label(self, value) -> str | None:
        if value is None or pd.isna(value):
            return None
        if isinstance(value, datetime):
            parsed = value
        else:
            try:
                parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
            except ValueError:
                return str(value)

        if parsed.hour or parsed.minute:
            return parsed.strftime("%b %-d, %Y %-I:%M %p")
        return parsed.strftime("%b %-d, %Y")

    def _format_date_range(self, start_value, end_value) -> str | None:
        start = self._format_date_label(start_value)
        end = self._format_date_label(end_value)
        if start and end:
            return f"{start} to {end}"
        return start or end

    def _format_chart_list(self, value, count_value) -> str | None:
        if value is None or pd.isna(value):
            return None
        chart_labels = [
            self._format_chart_name(chart_name.strip())
            for chart_name in str(value).split(",")
            if chart_name and chart_name.strip()
        ]
        if not chart_labels:
            return None
        count = self._format_int(count_value) or str(len(chart_labels))
        return f"{count} ({', '.join(chart_labels)})"

    def _format_chart_name(self, value: str) -> str:
        return value.replace("_", " ").title()

    def _format_region(self, value) -> str | None:
        if value is None or pd.isna(value):
            return None
        region = str(value).strip().lower()
        if region == "all":
            return "All regions"
        return str(value).replace("_", " ").title()

    def _format_day_hour(self, day_value, hour_value) -> str | None:
        day = None if day_value is None or pd.isna(day_value) else str(day_value)
        hour = self._format_hour(hour_value)
        if day and hour:
            return f"{day} around {hour}"
        return day or hour

    def _format_peak_bucket(self, label_value, count_value) -> str | None:
        label = self._format_date_label(label_value)
        count = self._format_int(count_value)
        if label and count:
            return f"{label} with {count} incidents"
        return label or count

    def _format_uhu_gap(self, scottsdale_value, non_scottsdale_value) -> str | None:
        if scottsdale_value is None or non_scottsdale_value is None:
            return None
        try:
            gap = float(scottsdale_value) - float(non_scottsdale_value)
        except (TypeError, ValueError):
            return None
        formatted_gap = self._format_percentage(abs(gap))
        if not formatted_gap:
            return None
        direction = "higher" if gap >= 0 else "lower"
        return f"Utilization gap: Scottsdale averaged {formatted_gap} {direction} than non-Scottsdale units"

    def _format_mutual_aid_balance(self, outside_value, inbound_value) -> str | None:
        if outside_value is None or inbound_value is None:
            return None
        try:
            outside = int(round(float(outside_value)))
            inbound = int(round(float(inbound_value)))
        except (TypeError, ValueError):
            return None
        if outside == inbound:
            return "Mutual-aid activity was balanced between outbound and inbound support"
        if inbound > outside:
            return "Inbound mutual-aid support exceeded outbound support"
        return "Outbound mutual-aid activity exceeded inbound support"

    def _find_slowest_response_phase(self, row, metrics: dict[str, tuple[str, str]]) -> str | None:
        slowest_label = None
        slowest_avg = None
        slowest_p90 = None
        for label, (avg_key, p90_key) in metrics.items():
            avg_value = row.get(avg_key)
            if avg_value is None or pd.isna(avg_value):
                continue
            try:
                avg_number = float(avg_value)
            except (TypeError, ValueError):
                continue
            if slowest_avg is None or avg_number > slowest_avg:
                slowest_label = label
                slowest_avg = avg_number
                slowest_p90 = row.get(p90_key)

        if slowest_label is None:
            return None

        avg = self._format_minutes(slowest_avg)
        p90 = self._format_minutes(slowest_p90)
        if avg and p90:
            return f"Longest average phase: {slowest_label} at {avg} (P90 {p90})"
        if avg:
            return f"Longest average phase: {slowest_label} at {avg}"
        return None


if __name__ == "__main__":
    service = OpenAISummaryService()

    sample_df = pd.DataFrame({"incidents": [12, 45, 30], "response_time": [4, 6, 5]})
    print(service.summarize_dashboard({"test-endpoint": sample_df}))
