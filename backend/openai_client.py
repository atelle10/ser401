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
        columns = ", ".join(data.columns.tolist())
        stats = data.describe().to_string()
        sample = data.head(5).to_string()

        # will paramaterize this prompt from db later on. Using this default prompt for summaries
        # for now.
        system_prompt = (
            f"Here are the columns used for this dataframe and its explanations: {columns}\n\n"
            f"Endpoint: {endpoint}\n\n"
            f"Statistical summary:\n{stats}\n\n"
            f"Sample data:\n{sample}\n\n"
            f"Summarize this data into a single paragraph of key point metrics from this data."
        )

        return system_prompt  # parse to request as system prompt.

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
