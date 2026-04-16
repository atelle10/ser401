from datetime import datetime

import pandas as pd

from backend.api.tests.conftest import VALID_DATE_RANGE


def test_response_times_with_data(client, mock_db):
    overall = pd.DataFrame(
        {
            "call_processing_avg": [2.5],
            "call_processing_p90": [4.1],
            "turnout_avg": [1.8],
            "turnout_p90": [3.0],
            "travel_avg": [5.2],
            "travel_p90": [8.7],
        }
    )
    per_unit = pd.DataFrame(
        {
            "unit_id": ["E601", "L602"],
            "calls": [15, 8],
            "call_processing_avg": [2.3, 2.8],
            "call_processing_p90": [3.9, 4.5],
            "turnout_avg": [1.5, 2.0],
            "turnout_p90": [2.8, 3.3],
            "travel_avg": [4.9, 5.6],
            "travel_p90": [8.0, 9.1],
        }
    )
    mock_db.read_table.side_effect = [overall, per_unit]

    data = client.get("/api/incidents/response-times", params=VALID_DATE_RANGE).json()
    assert data["overall"] is not None
    assert data["overall"]["call_processing"]["avg"] == 2.5
    assert data["overall"]["turnout"]["p90"] == 3.0
    assert data["overall"]["travel"]["avg"] == 5.2
    assert len(data["per_unit"]) == 2
    assert data["per_unit"][0]["unit_id"] == "E601"
    assert data["per_unit"][0]["calls"] == 15


def test_response_times_no_data(client, mock_db):
    mock_db.read_table.side_effect = [pd.DataFrame(), pd.DataFrame()]
    params = {
        "start_date": "2025-07-01T00:00:00+00:00",
        "end_date": "2025-07-31T23:59:59+00:00",
    }
    data = client.get("/api/incidents/response-times", params=params).json()
    assert data["overall"] is None
    assert data["per_unit"] == []


def test_bad_date_returns_400(client):
    params = {"start_date": "jsdakflsdjf", "end_date": "2025-07-01T00:00:00+00:00"}
    assert client.get("/api/incidents/kpi-data", params=params).status_code == 400


def test_kpi_data_groups_units_by_incident(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame(
        {
            "incident_id": [1, 1],
            "timestamp": [datetime(2024, 3, 1, 8, 0), datetime(2024, 3, 1, 8, 0)],
            "postal_code": ["85251", "85251"],
            "incident_type": ["Fire", "Fire"],
            "unit_id": ["E601", "L602"],
            "dispatch_time": [datetime(2024, 3, 1, 8, 1), datetime(2024, 3, 1, 8, 2)],
            "arrival_time": [datetime(2024, 3, 1, 8, 5), datetime(2024, 3, 1, 8, 6)],
            "clear_time": [datetime(2024, 3, 1, 9, 0), datetime(2024, 3, 1, 9, 0)],
        }
    )
    data = client.get("/api/incidents/kpi-data", params=VALID_DATE_RANGE).json()
    assert data["total_count"] == 1
    assert len(data["incidents"][0]["units"]) == 2


def test_summary_returns_metrics(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame(
        {
            "avg_response_time": [4.5],
            "total_incidents": [100],
            "active_units": [12],
            "peak_count": [20],
            "avg_count": [10],
            "peak_hour": [14],
        }
    )
    data = client.get("/api/incidents/summary", params=VALID_DATE_RANGE).json()
    assert data["avg_response_time_minutes"] == 4.5
    assert data["total_incidents"] == 100
    assert data["peak_hour"] == 14
    assert data["peak_load_factor"] == 2.0
