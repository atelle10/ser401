import pytest
import pandas as pd
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.api.main import app


VALID_DATE_RANGE = {
    "start_date": "2024-01-01T00:00:00+00:00",
    "end_date": "2024-12-31T23:59:59+00:00",
}

REGIONS = ["all", "south", "north"]


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_db():
    with patch("backend.api.main.RelationalDataStore") as mock_cls:
        instance = MagicMock()
        mock_cls.return_value = instance
        instance.connect.return_value = None
        instance.disconnect.return_value = None
        instance.read_table.return_value = pd.DataFrame()
        yield instance


@pytest.fixture
def date_params():
    return VALID_DATE_RANGE.copy()
