import pandas as pd
from datetime import datetime
from backend.api.tests.conftest import VALID_DATE_RANGE


def test_unit_origin_with_data(client, mock_db):
    units_df = pd.DataFrame({
        "unit_id": ["E601", "E601", "MES1"],
        "dispatch_time": [datetime(2024, 1, 1, 8), datetime(2024, 1, 1, 10), datetime(2024, 1, 1, 9)],
        "clear_time": [datetime(2024, 1, 1, 9), datetime(2024, 1, 1, 11), datetime(2024, 1, 1, 10)],
    })
    scottsdale_ref = pd.DataFrame({"unit_id": ["E601"]})
    mock_db.read_table.side_effect = [units_df, scottsdale_ref]

    resp = client.get("/api/incidents/unit-origin", params=VALID_DATE_RANGE)
    assert resp.status_code == 200
    data = resp.json()

    assert len(data["units"]) == 2
    assert "scottsdale_uhu" in data and "non_scottsdale_uhu" in data
    top_unit = data["units"][0]
    assert top_unit["unit_id"] == "E601"
    assert top_unit["is_scottsdale_unit"] is True
    assert top_unit["response_count"] == 2


def test_unit_origin_no_data(client, mock_db):
    mock_db.read_table.side_effect = [pd.DataFrame(), pd.DataFrame()]
    params = {"start_date": "2025-05-01T00:00:00+00:00", "end_date": "2025-07-31T23:59:59+00:00"}
    data = client.get("/api/incidents/unit-origin", params=params).json()
    assert data["units"] == []
    assert data["scottsdale_uhu"] == 0
