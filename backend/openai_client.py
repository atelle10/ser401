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
    "You are drafting the narrative summary section of a KPI analytics report for operations stakeholders. "
    "Use only the supplied report facts. "
    "Write one readable paragraph and up to three concise highlight bullets. "
    "You may add moderate interpretation, likely operational implications, and soft recommendations when they are clearly grounded in the data. "
    "Use cautious language for inference, such as 'may indicate', 'could reflect', or 'suggests'. "
    "Do not present speculation as fact, do not invent unsupported causes, and do not exhaustively list every metric."
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
            "Create the narrative summary content for this KPI dashboard export. "
            "Prioritize the most important operational themes rather than listing every metric. "
            "If you include a recommendation, keep it cautious and grounded in the observed patterns.\n\n"
            f"{sections}"
        )

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
                self._format_decimal(row.get("peak_load_factor"), digits=2),
            ),
            self._fact_line("Peak hour", self._format_hour(row.get("peak_hour"))),
        ]
        return self._section_block("Overview", facts)

    def _format_heatmap_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        facts = [
            self._fact_line("Busiest day", row.get("busiest_day")),
            self._fact_line("Busiest hour", self._format_hour(row.get("busiest_hour"))),
            self._fact_line(
                "Max incidents in a day-hour cell",
                self._format_int(row.get("max_incidents_per_cell")),
            ),
        ]
        return self._section_block("Heat map", facts)

    def _format_postal_code_section(self, data: pd.DataFrame) -> str:
        rows = []
        for _, row in data.head(3).iterrows():
            zip_code = row.get("zip")
            count = self._format_int(row.get("count"))
            avg_response = self._format_minutes(row.get("avg_response_minutes"))
            parts = [part for part in [f"{zip_code}", f"{count} incidents" if count else None] if part]
            detail = ", ".join(parts)
            if avg_response:
                detail = f"{detail}, avg response {avg_response}" if detail else f"Avg response {avg_response}"
            if detail:
                rows.append(detail)

        return self._section_block("Postal code hotspots", rows)

    def _format_type_breakdown_section(self, data: pd.DataFrame) -> str:
        rows = []
        for _, row in data.head(3).iterrows():
            incident_type = row.get("type")
            count = self._format_int(row.get("count"))
            if incident_type and count:
                rows.append(f"{incident_type}: {count}")

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

        top_units = []
        for _, row in data.head(3).iterrows():
            unit_id = row.get("unit_id")
            uhu = self._format_percentage(row.get("uhu"))
            if unit_id and uhu:
                top_units.append(f"{unit_id}: {uhu}")

        if top_units:
            facts.append(f"Top units: {', '.join(top_units)}")

        return self._section_block("Unit hour utilization", facts)

    def _format_call_volume_trend_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        facts = [
            self._fact_line(
                "Peak bucket",
                self._format_date_label(row.get("peak_bucket_label")),
            ),
            self._fact_line(
                "Peak bucket incident count",
                self._format_int(row.get("peak_bucket_count")),
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
        return self._section_block("Mutual aid", facts)

    def _format_response_time_section(self, data: pd.DataFrame) -> str:
        row = data.iloc[0]
        metrics = {
            "Call processing": ("call_processing_avg", "call_processing_p90"),
            "Turnout": ("turnout_avg", "turnout_p90"),
            "Travel": ("travel_avg", "travel_p90"),
        }
        facts = []
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

    def _format_hour(self, value) -> str | None:
        if value is None or pd.isna(value):
            return None
        try:
            hour = int(float(value))
        except (TypeError, ValueError):
            return None
        if hour < 0 or hour > 23:
            return str(hour)
        return f"{hour:02d}:00"

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

        return parsed.strftime("%b %-d, %Y")


if __name__ == "__main__":
    service = OpenAISummaryService()

    sample_df = pd.DataFrame({"incidents": [12, 45, 30], "response_time": [4, 6, 5]})
    print(service.summarize_dashboard({"test-endpoint": sample_df}))
