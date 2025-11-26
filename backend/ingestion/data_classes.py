import pandas as pd
from dataclasses import dataclass
from enum import Enum
from typing import List


class DQRule(Enum):
    NAN = "nan"
    NON_NUMERIC = "non_numeric"


@dataclass
class DQPolicy:
    policy_id: str
    name: str
    rules: List[DQRule]


@dataclass
class UploadedFile:
    file_name: str
    extension: str
    size_mb: int
    dataframe: pd.DataFrame


@dataclass
class DataSet:
    id: str
    name: str
    data: pd.DataFrame

    def get_summary(self):
        return self.data.info()

    def get_shape(self):
        return self.data.shape

    def describe(self):
        return self.data.describe()