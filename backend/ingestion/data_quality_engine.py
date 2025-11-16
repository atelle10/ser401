import pandas as pd


class DQEngine():
    """
    Data Quality Engine to validate dataframes against a given policy.
    """
    #TODO ADD POLICY DQPolicy type
    def __init__(self, policy=None):
        self.policy = policy

    
    def run_dq_checks(self, data_set: pd.DataFrame) -> bool:
        is_ok: bool = False
        if self._check_nans(data_set):
            is_ok = True
        
        return is_ok
        
    
    
    def _check_nans(self, data_set: pd.DataFrame) -> bool:
        return not data_set.isnull().values.any()