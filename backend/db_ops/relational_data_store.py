import pandas as pd
from sqlalchemy import create_engine, text
from typing import Optional
from backend.ingestion.data_classes import DataSet
from backend.db_ops.migration_script import INCIDENT_COLUMNS, UNIT_RESPONSE_COLUMNS, EMS_RUN_COLUMNS


class RelationalDataStore:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.engine = None
        self.connection = None

    def connect(self):
        self.engine = create_engine(self.database_url)
        self.connection = self.engine.connect()

    def disconnect(self):
        if self.connection:
            self.connection.close()
        if self.engine:
            self.engine.dispose()

    def read_table(self, table_name: str) -> pd.DataFrame:
        query = f"SELECT * FROM {table_name}"
        return pd.read_sql(query, self.connection)

    def write_data(self, dataset: DataSet, is_fire: bool) -> bool:
        try:
            df = dataset.data

            self.connection.execute(text("SET search_path = fire_ems"))

            if is_fire:
                df.to_sql("fire_raw", self.connection, schema="fire_ems", if_exists="append", index=False)

                incident_cols = [c for c in INCIDENT_COLUMNS.keys() if c in df.columns]
                incidents_df = df[incident_cols].drop_duplicates(subset=["Basic Incident Number (FD1)"])
                incidents_df = incidents_df.rename(columns=INCIDENT_COLUMNS)

                incidents_df.to_sql("incident", self.connection, schema="fire_ems", if_exists="append", index=False)

                result = self.connection.execute(text("SELECT incident_id, basic_incident_number FROM fire_ems.incident"))
                incident_map = {row[1]: row[0] for row in result}

                unit_cols = ["Basic Incident Number (FD1)"]
                for c in UNIT_RESPONSE_COLUMNS.keys():
                    if c in df.columns:
                        unit_cols.append(c)
                units_df = df[unit_cols].copy()
                units_df["incident_id"] = units_df["Basic Incident Number (FD1)"].astype(str).map(incident_map)
                units_df = units_df.drop(columns=["Basic Incident Number (FD1)"])
                units_df = units_df.rename(columns=UNIT_RESPONSE_COLUMNS)
                units_df = units_df.dropna(subset=["incident_id"])
                units_df = units_df.drop_duplicates(subset=["incident_id", "apparatus_resource_id"])
                units_df.to_sql("unit_response", self.connection, schema="fire_ems", if_exists="append", index=False)
            else:
                df.to_sql("ems_raw", self.connection, schema="fire_ems", if_exists="append", index=False)

                result = self.connection.execute(text("SELECT incident_id, basic_incident_number FROM fire_ems.incident"))
                incident_map = {row[1]: row[0] for row in result}

                ems_cols = []
                for c in EMS_RUN_COLUMNS.keys():
                    if c in df.columns:
                        ems_cols.append(c)
                ems_runs_df = df[ems_cols].copy()
                ems_runs_df["incident_id"] = df["Response Incident Number (eResponse.03)"].astype(str).map(incident_map)
                ems_runs_df = ems_runs_df.rename(columns=EMS_RUN_COLUMNS)
                ems_runs_df = ems_runs_df.dropna(subset=["incident_id"])
                ems_runs_df = ems_runs_df.drop_duplicates(subset=["response_incident_number", "response_ems_response_number"])
                ems_runs_df.to_sql("ems_run", self.connection, schema="fire_ems", if_exists="append", index=False)

            self.connection.commit()
            return True

        except Exception as e:
            print(e)
            self.connection.rollback()
            return False
