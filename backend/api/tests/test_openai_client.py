from unittest.mock import MagicMock, patch

import pandas as pd

import backend.openai_client as openai_client


def test_process_data_input_truncates_and_serializes_datetimes():
    service = openai_client.OpenAISummaryService(api_key="test-key")
    frame = pd.DataFrame(
        {
            "timestamp": pd.date_range("2024-01-01", periods=510, freq="h", tz="UTC"),
            "value": range(510),
        }
    )

    processed = service.process_data_input(frame)

    assert len(processed) == openai_client.MAX_ROWS
    assert isinstance(processed.loc[0, "timestamp"], str)


def test_summarize_dashboard_returns_unavailable_without_api_key(monkeypatch):
    monkeypatch.setattr(openai_client, "OPENAI_API_KEY", None)
    service = openai_client.OpenAISummaryService()

    result = service.summarize_dashboard({"heatmap": pd.DataFrame({"count": [1, 2, 3]})})

    assert result == {
        "status": "unavailable",
        "summary": "",
        "summary_paragraph": "",
        "summary_highlights": [],
        "message": "OpenAI API key is not configured.",
    }


@patch("backend.openai_client.OpenAI")
def test_summarize_dashboard_returns_ready_with_summary(mock_openai):
    response = MagicMock()
    response.output_parsed = openai_client.StructuredExportSummary(
        summary_paragraph="Incident activity remained steady with peak demand in the afternoon and soft staffing pressure in the late day window.",
        summary_highlights=[
            "Afternoon demand may warrant closer staffing attention.",
            "Response times remained comparatively stable despite peak activity.",
        ],
    )
    mock_client = MagicMock()
    mock_client.responses.parse.return_value = response
    mock_openai.return_value = mock_client
    service = openai_client.OpenAISummaryService(api_key="test-key")

    result = service.summarize_dashboard(
        {
            "export_context": pd.DataFrame(
                {
                    "region": ["south"],
                    "start_date": ["2026-03-01T00:00:00+00:00"],
                    "end_date": ["2026-03-31T23:59:59+00:00"],
                    "selected_charts": ["heatmap, response_time_breakdown"],
                    "selected_chart_count": [2],
                }
            ),
            "heatmap": pd.DataFrame(
                {
                    "busiest_day": ["Mon"],
                    "busiest_hour": [14],
                    "max_incidents_per_cell": [18],
                }
            ),
            "empty": pd.DataFrame(),
        }
    )

    assert result == {
        "status": "ready",
        "summary": "Incident activity remained steady with peak demand in the afternoon and soft staffing pressure in the late day window.",
        "summary_paragraph": "Incident activity remained steady with peak demand in the afternoon and soft staffing pressure in the late day window.",
        "summary_highlights": [
            "Afternoon demand may warrant closer staffing attention.",
            "Response times remained comparatively stable despite peak activity.",
        ],
    }

    kwargs = mock_client.responses.parse.call_args.kwargs
    assert kwargs["model"] == "gpt-5-nano"
    assert kwargs["store"] is False
    assert "big picture" in kwargs["input"][0]["content"].lower()
    assert "decision-relevant" in kwargs["input"][0]["content"].lower()
    prompt = kwargs["input"][1]["content"]
    assert "Report context:" in prompt
    assert "- Region: South" in prompt
    assert "Heat map:" in prompt
    assert "Descriptive summary:" not in prompt
    assert "Sample rows:" not in prompt
    assert "Heat map:\n- Busiest period:" in prompt


@patch("backend.openai_client.OpenAI")
def test_summarize_dashboard_returns_ready_when_all_inputs_empty(mock_openai):
    service = openai_client.OpenAISummaryService(api_key="test-key")

    result = service.summarize_dashboard(
        {"heatmap": pd.DataFrame(), "response_times": pd.DataFrame()}
    )

    assert result == {
        "status": "ready",
        "summary": "No report data was available to summarize for this export.",
        "summary_paragraph": "No report data was available to summarize for this export.",
        "summary_highlights": [],
    }
    mock_openai.assert_not_called()


@patch("backend.openai_client.OpenAI")
def test_summarize_dashboard_returns_error_on_openai_failure(mock_openai):
    mock_client = MagicMock()
    mock_client.responses.parse.side_effect = RuntimeError("boom")
    mock_openai.return_value = mock_client
    service = openai_client.OpenAISummaryService(api_key="test-key")

    result = service.summarize_dashboard({"heatmap": pd.DataFrame({"count": [1, 2, 3]})})

    assert result == {
        "status": "error",
        "summary": "",
        "summary_paragraph": "",
        "summary_highlights": [],
        "message": "OpenAI summary request failed: RuntimeError",
    }
