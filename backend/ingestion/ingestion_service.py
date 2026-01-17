from backend.ingestion.data_classes import UploadedFile, DQPolicy
from typing import List
import pandas as pd
from backend.ingestion.data_quality_engine import DQEngine
import os


class IngestionService():
    def __init__(self, accepted_file_types: list[str], max_col_count: int,
                 max_row_count: int, dq_policy: DQPolicy = None):
        self.accepted_file_types = accepted_file_types
        self.max_col_count = max_col_count
        self.max_row_count = max_row_count
        self.dq_policy = dq_policy
        self.dq_engine = DQEngine(policy=dq_policy) if dq_policy else None

    def _get_file_size_mb(self, file_path: str) -> int:
        size_bytes = os.path.getsize(file_path)
        size_mb = size_bytes / (1024 * 1024)
        return int(size_mb)

    def ingest_data(self, file_path: str, is_fire: bool = True) -> UploadedFile:
        if not any(file_path.endswith(extension) for extension in self.accepted_file_types):
            raise ValueError("Unsupported file type.")

        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        if self.dq_engine:
            numeric_columns: List[str] = self.dq_engine.get_numeric_columns(is_fire)
            ok_for_nan_columns: List[str] = self.dq_engine.get_ok_for_nan_columns(is_fire)
            self.dq_engine.run_dq_checks(df, numeric_columns, ok_for_nan_columns)

        return UploadedFile(file_name=file_path.split('.')[0],
                        extension=file_path.split('.')[-1],
                        size_mb=self._get_file_size_mb(file_path),
                        dataframe=df)

    def ingest_dataframe(self, df: pd.DataFrame, file_name: str, is_fire: bool = True) -> UploadedFile:
        if self.dq_engine:
            numeric_columns = self.dq_engine.get_numeric_columns(is_fire)
            ok_for_nan_columns = self.dq_engine.get_ok_for_nan_columns(is_fire)
            self.dq_engine.run_dq_checks(df, numeric_columns, ok_for_nan_columns)

        return UploadedFile(file_name=file_name,
                        extension="dataframe",
                        size_mb=0,
                        dataframe=df)












if __name__ == "__main__":
    from backend.ingestion.data_classes import DQRule, DQPolicy
    from backend.db_ops.relational_data_store import RelationalDataStore
    from backend.ingestion.data_classes import DataSet
    
    policy = DQPolicy(
        policy_id="dq_001",
        name="BASIC_POLICY",
        rules=[DQRule.NAN, DQRule.NON_NUMERIC]
    )

    ingestion_service = IngestionService(
        accepted_file_types=['.csv', '.xlsx'],
        max_col_count=100,
        max_row_count=100000,
        dq_policy=policy
    )
    fire_csv_path = "/Users/michael/Documents/ASU/ser401/notebooks/mock_data/fire_bad.csv"
    try:
        uploaded_file = ingestion_service.ingest_data(
            file_path=fire_csv_path,
            is_fire=True
        )
        print("Fire good.")
    except ValueError as e:
        print(e)

    ems_csv_path = "/Users/michael/Documents/ASU/ser401/notebooks/mock_data/ems_bad.csv"
    try:
        uploaded_file = ingestion_service.ingest_data(
            file_path=ems_csv_path,
            is_fire=False
        )
        print("EMS good.")
    except ValueError as e:
        print(e)

    
    # this section tests the writing of the data to db.
    db_url = "postgresql://michael@localhost:5432/famar_db"
    store = RelationalDataStore(db_url)
    store.connect()

    fire_df = pd.read_csv("/Users/michael/Documents/ASU/ser401/notebooks/fire_test.csv")
    fire_dataset = DataSet(id="fire_data1", name="fire_data", data=fire_df)
    result = store.write_data(fire_dataset, is_fire=True)
    print(f"Fire write_data: {result}")

    ems_df = pd.read_csv("/Users/michael/Documents/ASU/ser401/notebooks/ems_test.csv")
    ems_dataset = DataSet(id="ems_data1", name="ems_data", data=ems_df)
    result = store.write_data(ems_dataset, is_fire=False)
    print(f"EMS write_data: {result}")

    store.disconnect()
