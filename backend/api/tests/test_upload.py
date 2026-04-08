import pandas as pd
from unittest.mock import patch

from backend.ingestion.data_classes import UploadedFile


def test_upload_missing_data_type_422(client):
    r = client.post(
        "/api/upload",
        files={"file": ("f.csv", b"a\n1", "text/csv")},
    )
    assert r.status_code == 422


def test_upload_invalid_data_type_422(client):
    r = client.post(
        "/api/upload",
        files={"file": ("f.csv", b"a\n1", "text/csv")},
        params={"data_type": "water"},
    )
    assert r.status_code == 422


def test_upload_unsupported_extension_400(client):
    r = client.post(
        "/api/upload",
        files={"file": ("report.pdf", b"%PDF-1.4 minimal", "application/pdf")},
        params={"data_type": "fire"},
    )
    assert r.status_code == 400
    assert "Unsupported file type" in r.json()["detail"]


def test_upload_empty_csv_400(client):
    r = client.post(
        "/api/upload",
        files={"file": ("empty.csv", b"", "text/csv")},
        params={"data_type": "fire"},
    )
    assert r.status_code == 400


def test_upload_garbage_csv_400(client):
    r = client.post(
        "/api/upload",
        files={"file": ("bad.csv", b"\x00\x01\x02\xff\xfe", "text/csv")},
        params={"data_type": "fire"},
    )
    assert r.status_code == 400


@patch("backend.api.main.UPLOAD_INGESTION_SERVICE.ingest_data")
def test_upload_fire_success(mock_ingest, client, mock_db):
    mock_ingest.return_value = UploadedFile(
        file_name="minimal",
        extension="csv",
        size_mb=1,
        dataframe=pd.DataFrame({"k": [1, 2]}),
    )
    mock_db.write_data.return_value = True

    r = client.post(
        "/api/upload",
        files={"file": ("minimal.csv", b"x\n1", "text/csv")},
        params={"data_type": "fire"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["rows"] == 2
    mock_db.write_data.assert_called_once()


@patch("backend.api.main.UPLOAD_INGESTION_SERVICE.ingest_data")
def test_upload_ems_success(mock_ingest, client, mock_db):
    mock_ingest.return_value = UploadedFile(
        file_name="ems",
        extension="csv",
        size_mb=1,
        dataframe=pd.DataFrame({"a": [1]}),
    )
    mock_db.write_data.return_value = True

    r = client.post(
        "/api/upload",
        files={"file": ("ems.csv", b"x\n1", "text/csv")},
        params={"data_type": "ems"},
    )
    assert r.status_code == 200
    assert r.json()["rows"] == 1
    mock_db.write_data.assert_called_once()
    _, kwargs = mock_db.write_data.call_args
    assert kwargs.get("is_fire") is False


@patch("backend.api.main.UPLOAD_INGESTION_SERVICE.ingest_data")
def test_upload_db_write_fails_500(mock_ingest, client, mock_db):
    mock_ingest.return_value = UploadedFile(
        file_name="minimal",
        extension="csv",
        size_mb=1,
        dataframe=pd.DataFrame({"k": [1]}),
    )
    mock_db.write_data.return_value = False

    r = client.post(
        "/api/upload",
        files={"file": ("minimal.csv", b"x\n1", "text/csv")},
        params={"data_type": "fire"},
    )
    assert r.status_code == 500
    assert "Failed to write" in r.json()["detail"]
