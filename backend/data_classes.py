import pandas as pd
from dataclasses import dataclass


@dataclass
class UploadedFile:
    file_name: str
    extension: str
    size_mb: int
    dataframe: pd.DataFrame