from abc import ABC, abstractmethod
from typing import Literal, TypedDict

import pandas as pd


class SummaryResult(TypedDict, total=False):
    status: Literal["ready", "unavailable", "error"]
    summary: str
    message: str


# Defines the interface for the OpenAI integration for pdf summary generation.
class OpenAISummaryClient(ABC):
    @abstractmethod
    def generate_summary_prompt(self, data: pd.DataFrame, endpoint: str) -> str:
        pass

    @abstractmethod
    def get_char_count(self, text: str) -> int:
        pass

    @abstractmethod
    def process_data_input(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @abstractmethod
    def request_summary(self, prompt: str) -> str:
        pass

    @abstractmethod
    def summarize_dashboard(self, data: dict[str, pd.DataFrame]) -> SummaryResult:
        pass
