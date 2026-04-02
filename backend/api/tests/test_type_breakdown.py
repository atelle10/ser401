import pandas as pd
from backend.api.tests.conftest import VALID_DATE_RANGE


def test_type_breakdown_structure(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame({
        "incident_type": ["Fire", "EMS"],
        "incident_count": [50, 30],
        "percentage": [62.5, 37.5],
    })
    resp = client.get("/api/incidents/type-breakdown", params=VALID_DATE_RANGE)
    assert resp.status_code == 200
    data = resp.json()
    assert "types" in data and "total_displayed" in data
    assert data["total_displayed"] == 80
    first = data["types"][0]
    assert first["type"] == "Fire"
    assert first["count"] == 50
    assert first["percentage"] == 62.5


def test_type_breakdown_no_data(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame()
    params = {"start_date": "2025-06-01T00:00:00+00:00", "end_date": "2025-08-31T23:59:59+00:00"}
    data = client.get("/api/incidents/type-breakdown", params=params).json()
    assert data["types"] == []
    assert data["total_displayed"] == 0
