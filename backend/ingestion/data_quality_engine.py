import pandas as pd
import yaml
import os
from typing import List
from .data_classes import DQPolicy, DQRule


class DQEngine():
    def __init__(self, policy: DQPolicy = None, config_path: str = None):
        self.policy = policy
        self.config = self._load_config(config_path)

    def _load_config(self, config_path: str) -> dict:
        if config_path is None:
            config_path = os.path.join(os.path.dirname(__file__), 'dq_config.yaml')

        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        return {}

    def get_numeric_columns(self, is_fire: bool) -> List[str]:
        data_type = 'fire' if is_fire else 'ems'
        if data_type in self.config:
            return self.config[data_type].get('numeric_columns', [])
        return []

    def get_ok_for_nan_columns(self, is_fire: bool) -> List[str]:
        data_type = 'fire' if is_fire else 'ems'
        if data_type in self.config:
            return self.config[data_type].get('ok_for_nan_columns', [])
        return []

    def run_dq_checks(self, data_set: pd.DataFrame, numeric_columns: List[str] = None, ok_for_nan_columns: List[str] = None) -> bool:
        if not self.policy:
            return True
        errors: List[str] = []

        for rule in self.policy.rules:
            if rule == DQRule.NAN:
                if not self._check_nans(data_set, ok_for_nan_columns):
                    errors.append("Data contains NaN/empty values")
                    
            elif rule == DQRule.NON_NUMERIC:
                if numeric_columns:
                    non_numeric_errors = self._check_non_numeric(data_set, numeric_columns)
                    if non_numeric_errors:
                        errors.extend(non_numeric_errors)

        if errors:
            raise ValueError(f"Data Quality checks failed: {'; '.join(errors)}")

        return True

    def _check_nans(self, data_set: pd.DataFrame, ok_for_nan_columns: List[str] = None) -> bool:
        if ok_for_nan_columns:
            columns_to_check = [col for col in data_set.columns if col not in ok_for_nan_columns]
            
            for col in columns_to_check:
                if data_set[col].isnull().any():
                    print(f"Column with NaN: '{col}'")
            return not data_set[columns_to_check].isnull().values.any()
        
        return not data_set.isnull().values.any()

    def _check_non_numeric(self, data_set: pd.DataFrame, numeric_columns: List[str]) -> List[str]:
        errors: List[str] = []

        for col in numeric_columns:
            if col not in data_set.columns:
                errors.append(f"Column '{col}' not found in dataset")
                continue

            for idx, value in data_set[col].items():
                if pd.isna(value):
                    continue
                try:
                    float(value)
                except (ValueError, TypeError):
                    errors.append(f"Non-numeric value '{value}' found in column '{col}' at row {idx}")

        return errors