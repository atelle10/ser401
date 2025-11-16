from .data_classes import UploadedFile
import pandas as pd
from .data_quality_engine import DQEngine
import os


class IngestionService():
    """
    This class handles the ingestion of data files and verifying they meet the DQ engine requirements.
    """
    def __init__(self, accepted_file_types: list[str], max_col_count: int,
                 max_row_count: int, dq_policy: str = None):
        self.accepted_file_types = accepted_file_types
        self.max_col_count = max_col_count
        self.max_row_count = max_row_count
        self.dq_policy = dq_policy
        self.dq_engine = DQEngine(policy=dq_policy) if dq_policy else None
    
    
    def _get_file_size_mb(self, file_path: str) -> int:
        size_bytes = os.path.getsize(file_path)
        size_mb = size_bytes / (1024 * 1024)
        return int(size_mb)

    def ingest_data(self, file_path: str) -> UploadedFile:
        if not any(file_path.endswith(extension) for extension in self.accepted_file_types):
            raise ValueError("Unsupported file type.")
        
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        if self.dq_engine and not self.dq_engine.run_dq_checks(df):
            #TODO
            raise ValueError("Data Quality checks failed.")

        return UploadedFile(file_name=file_path.split('.')[0],
                        extension=file_path.split('.')[-1],
                        size_mb=self._get_file_size_mb(file_path),
                        dataframe=df)


















if __name__ == "__main__":
    # test upload file creation
    ingestion_service = IngestionService(accepted_file_types=['.csv', '.xlsx'],
                                         max_col_count=50,
                                         max_row_count=10000,
                                         dq_policy='strict')
    uploaded_file = ingestion_service.ingest_data('/Users/michael/Documents/res_11_8.csv')
    print(uploaded_file)
        
        
            
