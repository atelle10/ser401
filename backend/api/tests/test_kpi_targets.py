import json
from pathlib import Path
from unittest.mock import patch

from backend.api.main import (
    DEFAULT_RESPONSE_TIME_TARGETS,
    _merge_response_time_targets_payload,
    _read_response_time_targets,
)


def test_merge_with_valid_overrides():
    result = _merge_response_time_targets_payload({"turnout": {"local": 3.0}})
    assert result["turnout"]["local"] == 3.0
    assert result["call_processing"] == DEFAULT_RESPONSE_TIME_TARGETS["call_processing"]


def test_merge_ignores_bad_values():
    result = _merge_response_time_targets_payload({"travel": {"national": "abc"}})
    assert (
        result["travel"]["national"]
        == DEFAULT_RESPONSE_TIME_TARGETS["travel"]["national"]
    )


def test_merge_rejects_negative():
    result = _merge_response_time_targets_payload({"turnout": {"national": -5}})
    assert (
        result["turnout"]["national"]
        == DEFAULT_RESPONSE_TIME_TARGETS["turnout"]["national"]
    )


def test_merge_empty_payload():
    result = _merge_response_time_targets_payload({})
    assert result == DEFAULT_RESPONSE_TIME_TARGETS


def test_read_targets_from_file(tmp_path):
    fake_file = tmp_path / "targets.json"
    fake_file.write_text(json.dumps({"call_processing": {"national": 9.0, "local": 9.0}}))
    with patch("backend.api.main.RESPONSE_TIME_TARGETS_PATH", fake_file):
        result = _read_response_time_targets()
    assert result["call_processing"]["national"] == 9.0
    assert result["call_processing"]["local"] == 9.0
