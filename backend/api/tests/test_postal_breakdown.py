import pandas as pd
from backend.api.tests.conftest import VALID_DATE_RANGE


def test_postal_breakdown_with_data(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame({
        "postal_code": ["85251", "85260", "85255"],
        "incident_count": [120, 85, 60],
        "avg_response_minutes": [4.3, 5.1, 3.8],
    })
    data = client.get("/api/incidents/postal-breakdown", params=VALID_DATE_RANGE).json()
    assert len(data["postal_data"]) == 3
    assert data["total_postal_codes"] == 3
    first = data["postal_data"][0]
    assert first["zip"] == "85251"
    assert first["count"] == 120
    assert first["avg_response_minutes"] == 4.3


def test_postal_breakdown_no_data(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame()
    params = {"start_date": "2025-06-01T00:00:00+00:00", "end_date": "2025-08-31T23:59:59+00:00"}
    data = client.get("/api/incidents/postal-breakdown", params=params).json()
    assert data["postal_data"] == []
    assert data["total_postal_codes"] == 0


def test_postal_breakdown_has_region(client, mock_db):
    mock_db.read_table.return_value = pd.DataFrame()
    params = {**VALID_DATE_RANGE, "region": "south"}
    data = client.get("/api/incidents/postal-breakdown", params=params).json()
    assert data["region"] == "south"
