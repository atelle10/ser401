import pandas as pd
from backend.api.tests.conftest import VALID_DATE_RANGE


def test_mutual_aid_counts(client, mock_db):
    responses = pd.DataFrame({
        "postal_code": ["85255", "85255", "85004"],
        "unit_id": ["E601", "MES1", "E601"],
    })
    scottsdale_ref = pd.DataFrame({"unit_id": ["E601"]})
    mock_db.read_table.side_effect = [responses, scottsdale_ref]

    data = client.get("/api/incidents/mutual-aid", params=VALID_DATE_RANGE).json()
    assert data["scottsdale_units_outside"] == 1
    assert data["other_units_in_scottsdale"] == 1
    assert "region" in data
    assert "time_window" in data


def test_mutual_aid_no_data(client, mock_db):
    mock_db.read_table.side_effect = [pd.DataFrame(), pd.DataFrame()]
    params = {"start_date": "2025-06-15T00:00:00+00:00", "end_date": "2025-09-15T23:59:59+00:00"}
    data = client.get("/api/incidents/mutual-aid", params=params).json()
    assert data["scottsdale_units_outside"] == 0
    assert data["other_units_in_scottsdale"] == 0
