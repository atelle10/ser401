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
        cursor = self.connection.cursor()
        
        query = f"SELECT * FROM {table_name}"
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        
        cursor.close()
        return pd.DataFrame(rows, columns=columns)


    def write_data(self, dataset: DataSet, table_name: str) -> bool:
        try:
            cursor = self.connection.cursor()
            df = dataset.data
            
            columns = ', '.join(df.columns)
            placeholders = ', '.join(['%s'] * len(df.columns))
            
            query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
            rows = df.values.tolist()
            cursor.executemany(query, rows)
            self.connection.commit()
            
            cursor.close()
            return True
        
        except Exception:
            return False
