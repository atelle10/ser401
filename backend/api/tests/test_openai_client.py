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
        "message": "OpenAI API key is not configured.",
    }


@patch("backend.openai_client.OpenAI")
def test_summarize_dashboard_returns_ready_with_summary(mock_openai):
    response = MagicMock()
    response.output_text = "Incident activity remained steady with peak demand in the afternoon."
    mock_client = MagicMock()
    mock_client.responses.create.return_value = response
    mock_openai.return_value = mock_client
    service = openai_client.OpenAISummaryService(api_key="test-key")

    result = service.summarize_dashboard(
        {
            "heatmap": pd.DataFrame(
                {
                    "timestamp": pd.to_datetime(["2024-01-01T00:00:00Z", "2024-01-01T01:00:00Z"]),
                    "incident_count": [12, 18],
                }
            ),
            "empty": pd.DataFrame(),
        }
    )

    assert result == {
        "status": "ready",
        "summary": "Incident activity remained steady with peak demand in the afternoon.",
    }

    kwargs = mock_client.responses.create.call_args.kwargs
    assert kwargs["model"] == "gpt-5-nano"
    assert kwargs["store"] is False
    assert "Dataset: heatmap" in kwargs["input"]
    assert "Dataset: empty" not in kwargs["input"]


@patch("backend.openai_client.OpenAI")
def test_summarize_dashboard_returns_ready_when_all_inputs_empty(mock_openai):
    service = openai_client.OpenAISummaryService(api_key="test-key")

    result = service.summarize_dashboard(
        {"heatmap": pd.DataFrame(), "response_times": pd.DataFrame()}
    )

    assert result == {
        "status": "ready",
        "summary": "No report data was available to summarize for this export.",
    }
    mock_openai.assert_not_called()


@patch("backend.openai_client.OpenAI")
def test_summarize_dashboard_returns_error_on_openai_failure(mock_openai):
    mock_client = MagicMock()
    mock_client.responses.create.side_effect = RuntimeError("boom")
    mock_openai.return_value = mock_client
    service = openai_client.OpenAISummaryService(api_key="test-key")

    result = service.summarize_dashboard({"heatmap": pd.DataFrame({"count": [1, 2, 3]})})

    assert result == {
        "status": "error",
        "summary": "",
        "message": "OpenAI summary request failed: RuntimeError",
    }
