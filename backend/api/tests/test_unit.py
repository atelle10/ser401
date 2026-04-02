import pandas as pd

from backend.api.tests.conftest import VALID_DATE_RANGE


def test_missing_required_params(client):
    assert client.get("/api/incidents/kpi-data").status_code == 422
    assert client.get("/api/incidents/summary").status_code == 422


def test_bad_time_filter_rejected(client):
    params = {**VALID_DATE_RANGE, "granularity": "hourly"}
    assert client.get("/api/incidents/call-volume", params=params).status_code == 422


def test_region_defaults_to_all(client, mock_db):
    data = client.get("/api/incidents/heatmap", params=VALID_DATE_RANGE).json()
    assert data["region"] == "all"


def test_region_filters(client, mock_db):
    params = {**VALID_DATE_RANGE, "region": "south"}
    data = client.get("/api/incidents/type-breakdown", params=params).json()
    assert data["region"] == "south"


def test_empty_df_returns_empty(client, mock_db):
    data = client.get("/api/incidents/heatmap", params=VALID_DATE_RANGE).json()
    assert data["heatmap_data"] == []
    assert data["total_incidents"] == 0


def test_empty_response_times(client, mock_db):
    mock_db.read_table.side_effect = [pd.DataFrame(), pd.DataFrame()]
    data = client.get("/api/incidents/response-times", params=VALID_DATE_RANGE).json()
    assert data["overall"] is None
    assert data["per_unit"] == []
