import os

import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI
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
    "You summarize KPI dashboard export data for operations stakeholders. "
    "Write exactly one concise paragraph using only the provided data. "
    "Do not speculate, recommend actions, or invent causes. "
    "If the data is sparse, say that briefly."
)


class OpenAISummaryService(OpenAISummaryClient):
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or OPENAI_API_KEY
        self.model = OPENAI_MODEL

    def generate_summary_prompt(self, data: pd.DataFrame, endpoint: str) -> str:
        columns = ", ".join(data.columns.tolist())
        stats = self._describe_dataframe(data)
        sample = data.head(5).to_string(index=False)

        return (
            f"Dataset: {endpoint}\n"
            f"Rows: {len(data)}\n"
            f"Columns: {columns}\n"
            f"Descriptive summary:\n{stats}\n\n"
            f"Sample rows:\n{sample}"
        )

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
        if not self.api_key:
            raise ValueError("OpenAI API key is not configured.")

        client = OpenAI(api_key=self.api_key)
        response = client.responses.create(
            model=self.model,
            instructions=SUMMARY_INSTRUCTIONS,
            input=prompt,
            store=False,
        )
        summary = (response.output_text or "").strip()
        if not summary:
            raise RuntimeError("OpenAI returned an empty summary.")
        return summary

    def summarize_dashboard(self, data: dict[str, pd.DataFrame]) -> SummaryResult:
        if not self.api_key:
            return {
                "status": "unavailable",
                "summary": "",
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
            }

        prompt = self._build_dashboard_prompt(sections)

        try:
            summary = self.request_summary(prompt)
        except Exception as exc:
            return {
                "status": "error",
                "summary": "",
                "message": f"OpenAI summary request failed: {exc.__class__.__name__}",
            }

        return {"status": "ready", "summary": summary}

    def _describe_dataframe(self, data: pd.DataFrame) -> str:
        try:
            described = data.describe(include="all")
        except ValueError:
            return "No descriptive statistics available."

        if described.empty:
            return "No descriptive statistics available."

        return described.to_string()

    def _build_dashboard_prompt(self, dataset_sections: list[str]) -> str:
        sections = "\n\n---\n\n".join(dataset_sections)
        return (
            "Generate a concise operational summary for this KPI dashboard export. "
            "Use only the supplied datasets and keep the output to one short paragraph.\n\n"
            f"{sections}"
        )


if __name__ == "__main__":
    service = OpenAISummaryService()

    sample_df = pd.DataFrame({"incidents": [12, 45, 30], "response_time": [4, 6, 5]})
    print(service.summarize_dashboard({"test-endpoint": sample_df}))
