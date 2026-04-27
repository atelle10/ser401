import pandas as pd
from backend.api.tests.conftest import VALID_DATE_RANGE

ENDPOINT = "/api/incidents/heatmap"
EMPTY_DATES = {"start_date": "2027-01-01T00:00:00+00:00", "end_date": "2027-12-31T23:59:59+00:00"}

SAMPLE_DF = pd.DataFrame({
    "day_index": [0, 1, 2],
    "hour": [8, 14, 20],
    "incident_count": [5, 12, 3],
})


def test_heatmap_response_keys(client, mock_db):
    mock_db.read_table.return_value = SAMPLE_DF
    resp = client.get(ENDPOINT, params=VALID_DATE_RANGE)
    data = resp.json()
    assert resp.status_code == 200
    for key in ["heatmap_data", "total_incidents", "max_count", "region", "time_window"]:
        assert key in data


def test_heatmap_entry_fields(client, mock_db):
    mock_db.read_table.return_value = SAMPLE_DF
    entry = client.get(ENDPOINT, params=VALID_DATE_RANGE).json()["heatmap_data"][0]
    assert set(entry.keys()) == {"day_index", "hour", "count"}


def test_heatmap_totals(client, mock_db):
    mock_db.read_table.return_value = SAMPLE_DF
    data = client.get(ENDPOINT, params=VALID_DATE_RANGE).json()
    assert data["total_incidents"] == 20
    assert data["max_count"] == 12


def test_heatmap_empty(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame()
    data = client.get(ENDPOINT, params=EMPTY_DATES).json()
    assert data["heatmap_data"] == []
    assert data["total_incidents"] == 0
    assert data["max_count"] == 0
