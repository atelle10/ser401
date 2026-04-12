from unittest.mock import MagicMock, patch


def build_export_summary_payload():
    return {
        "region": "south",
        "start_date": "2026-03-01T00:00:00+00:00",
        "end_date": "2026-03-31T23:59:59+00:00",
        "selected_charts": [
            "heatmap",
            "postal_code",
            "type_breakdown",
            "unit_hour_utilization",
            "call_volume_trend",
            "mutual_aid",
            "response_time_breakdown",
        ],
        "overview": {
            "total_incidents": 42,
            "avg_response_time_minutes": 5.3,
            "active_units": 8,
            "peak_load_factor": 1.7,
            "peak_hour": 14,
        },
        "highlights": {
            "heatmap": {
                "busiest_day": "Mon",
                "busiest_hour": 14,
                "max_incidents_per_cell": 12,
            },
            "postal_code": {
                "top_postal_codes": [
                    {"zip": "85251", "count": 18, "avg_response_minutes": 4.8},
                    {"zip": "85260", "count": 12, "avg_response_minutes": 5.2},
                ]
            },
            "type_breakdown": {
                "top_incident_types": [
                    {"type": "Medical", "count": 20},
                    {"type": "Fire", "count": 10},
                ]
            },
            "unit_hour_utilization": {
                "top_units": [
                    {"unit_id": "E601", "uhu": 0.61},
                    {"unit_id": "L602", "uhu": 0.53},
                ],
                "scottsdale_uhu": 0.48,
                "non_scottsdale_uhu": 0.22,
            },
            "call_volume_trend": {
                "peak_bucket_label": "2026-03-15",
                "peak_bucket_count": 17,
                "average_bucket_count": 8.4,
            },
            "mutual_aid": {
                "scottsdale_units_outside": 4,
                "other_units_in_scottsdale": 7,
            },
            "response_time_breakdown": {
                "overall": {
                    "call_processing": {"avg": 2.5, "p90": 4.0},
                    "turnout": {"avg": 1.8, "p90": 3.2},
                    "travel": {"avg": 5.1, "p90": 8.6},
                }
            },
        },
    }


@patch("backend.api.main.OpenAISummaryService")
def test_export_summary_returns_ready_and_builds_datasets(mock_service_cls, client):
    mock_service = MagicMock()
    mock_service.summarize_dashboard.return_value = {
        "status": "ready",
        "summary": "Demand peaked in the afternoon while response times remained stable.",
    }
    mock_service_cls.return_value = mock_service

    response = client.post("/api/export/summary", json=build_export_summary_payload())

    assert response.status_code == 200
    assert response.json() == {
        "status": "ready",
        "summary": "Demand peaked in the afternoon while response times remained stable.",
    }

    datasets = mock_service.summarize_dashboard.call_args.args[0]
    assert set(datasets) == {
        "overview",
        "heatmap",
        "postal_code",
        "type_breakdown",
        "unit_hour_utilization",
        "call_volume_trend",
        "mutual_aid",
        "response_time_breakdown",
    }
    assert datasets["overview"].iloc[0]["total_incidents"] == 42
    assert list(datasets["postal_code"]["zip"]) == ["85251", "85260"]
    assert datasets["response_time_breakdown"].iloc[0]["call_processing_avg"] == 2.5
    assert datasets["unit_hour_utilization"].iloc[0]["scottsdale_uhu"] == 0.48


@patch("backend.api.main.OpenAISummaryService")
def test_export_summary_passes_through_unavailable(mock_service_cls, client):
    mock_service = MagicMock()
    mock_service.summarize_dashboard.return_value = {
        "status": "unavailable",
        "summary": "",
        "message": "OpenAI API key is not configured.",
    }
    mock_service_cls.return_value = mock_service

    response = client.post("/api/export/summary", json=build_export_summary_payload())

    assert response.status_code == 200
    assert response.json() == {
        "status": "unavailable",
        "summary": "",
        "message": "OpenAI API key is not configured.",
    }


@patch("backend.api.main.OpenAISummaryService")
def test_export_summary_passes_through_error(mock_service_cls, client):
    mock_service = MagicMock()
    mock_service.summarize_dashboard.return_value = {
        "status": "error",
        "summary": "",
        "message": "OpenAI summary request failed: RuntimeError",
    }
    mock_service_cls.return_value = mock_service

    response = client.post("/api/export/summary", json=build_export_summary_payload())

    assert response.status_code == 200
    assert response.json() == {
        "status": "error",
        "summary": "",
        "message": "OpenAI summary request failed: RuntimeError",
    }


@patch("backend.api.main.OpenAISummaryService")
def test_export_summary_accepts_missing_optional_highlights(mock_service_cls, client):
    mock_service = MagicMock()
    mock_service.summarize_dashboard.return_value = {
        "status": "ready",
        "summary": "Overview-only summary.",
    }
    mock_service_cls.return_value = mock_service
    payload = build_export_summary_payload()
    payload["highlights"] = {}

    response = client.post("/api/export/summary", json=payload)

    assert response.status_code == 200
    datasets = mock_service.summarize_dashboard.call_args.args[0]
    assert set(datasets) == {"overview"}


def test_export_summary_rejects_invalid_payload(client):
    payload = build_export_summary_payload()
    del payload["overview"]

    response = client.post("/api/export/summary", json=payload)

    assert response.status_code == 422
