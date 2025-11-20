import pandas as pd
import mysql.connector
from typing import Optional
from ..ingestion.data_classes import DataSet


class RelationalDataStore:
    def __init__(self, host: str, port: int, user: str, password: str, database: str):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

    def connect(self):
        self.connection = mysql.connector.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            database=self.database
        )

    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()

    def read_table(self, table_name: str) -> pd.DataFrame:
        pass

    def write_data(self, dataset: DataSet, table_name: str) -> bool:
        pass
