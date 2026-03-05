import pandas as pd
from openai import OpenAISummaryClient

MAX_ROWS = 500
MODEL_NAME = (
    "gpt-4o-mini"  # we will stick with this model (cheapest) for the pdf summary.
)


class OpenAISummaryService(OpenAISummaryClient):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = MODEL_NAME

    def generate_summary_prompt(self, data: pd.DataFrame, endpoint: str) -> str:
        pass

    def get_char_count(self, text: str) -> int:
        return len(text)

    def process_data_input(self, df: pd.DataFrame) -> pd.DataFrame:
        cleaned = df.dropna(how="all")
        cleaned = cleaned.reset_index(drop=True)

        if len(cleaned) > MAX_ROWS:
            cleaned = cleaned.head(MAX_ROWS)

        for col in cleaned.select_dtypes(include=["datetime64"]):
            cleaned[col] = cleaned[col].astype(str)

        return cleaned

    def request_summary(self, prompt: str) -> str:
        pass

    def summarize_dashboard(self, data: dict[str, pd.DataFrame]) -> str:
        pass
