import pandas as pd
from backend.api.tests.conftest import VALID_DATE_RANGE


def test_response_times_with_data(client, mock_db):
    overall = pd.DataFrame({
        "call_processing_avg": [2.5], "call_processing_p90": [4.1],
        "turnout_avg": [1.8], "turnout_p90": [3.0],
        "travel_avg": [5.2], "travel_p90": [8.7],
    })
    per_unit = pd.DataFrame({
        "unit_id": ["E601", "L602"],
        "calls": [15, 8],
        "call_processing_avg": [2.3, 2.8], "call_processing_p90": [3.9, 4.5],
        "turnout_avg": [1.5, 2.0], "turnout_p90": [2.8, 3.3],
        "travel_avg": [4.9, 5.6], "travel_p90": [8.0, 9.1],
    })
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
    params = {"start_date": "2025-07-01T00:00:00+00:00", "end_date": "2025-07-31T23:59:59+00:00"}
    data = client.get("/api/incidents/response-times", params=params).json()
    assert data["overall"] is None
    assert data["per_unit"] == []
