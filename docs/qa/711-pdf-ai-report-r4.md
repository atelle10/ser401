# US 711 — AI-assisted PDF report (R4 evidence)

**SQP §3 metrics:** PDF Report Generation Success Rate; Report Content Completeness.  
**Requirement:** R4.

| Field | Value |
|--------|--------|
| Date | 2026-04-18 |
| Branch | `US-711-AI-assisted-PDF-report-tests` |
| Commit | `6dfaa4c445d019f8f1d67e497510b446f892f423` |
| Environment | Local Docker per root `README` (`just start-clean-all`); frontend `http://localhost:3000` |

## Scope

Export uses the dashboard **Export PDF** flow: modal builds settings from `kpi_dashboard/src/Components/Dashboard/exportConfig.js`, opens `/export-preview` with query params (`region`, `startDate`, `endDate`, `charts`, optional `autoprint=1`). The preview loads chart data, then calls **`POST /api/export/summary`** for the AI block (`ExportPreview.jsx` → `fetchExportSummary`). “PDF” in practice is **browser Print → Save as PDF** on the print layout (not a server-generated binary).

**Evidence split**

1. **API:** `POST /api/export/summary` — automated checks in `backend/api/tests/test_export_summary.py` (mocked OpenAI service).
2. **Browser:** Scenario matrix, example URLs, and checklist — **print-to-PDF** must be confirmed on a running app (Docker + seeded data + signed-in user). Matrix **outcome** column documents expected criteria, not a substitute for an executed run on a specific machine.

---

## Automated evidence — `POST /api/export/summary`

Command (repo root, venv active):

```bash
source .venv/bin/activate   # if using project .venv
PYTHONPATH=. pytest backend/api/tests/test_export_summary.py -v
```

| Result | Value |
|--------|--------|
| Python | 3.12.3 |
| pytest | 9.0.2 |
| Tests | 5 passed, 0 failed |
| Duration | ~0.11s |

Log excerpt:

```
backend/api/tests/test_export_summary.py::test_export_summary_returns_ready_and_builds_datasets PASSED
backend/api/tests/test_export_summary.py::test_export_summary_passes_through_unavailable PASSED
backend/api/tests/test_export_summary.py::test_export_summary_passes_through_error PASSED
backend/api/tests/test_export_summary.py::test_export_summary_accepts_missing_optional_highlights PASSED
backend/api/tests/test_export_summary.py::test_export_summary_rejects_invalid_payload PASSED
```

---

## Scenario matrix (browser — print / PDF)

Chart keys match `exportConfig.js`: `heatmap`, `postal_code`, `type_breakdown`, `unit_hour_utilization`, `call_volume_trend`, `mutual_aid`, `response_time_breakdown`.

Replace `HOST` with `http://localhost:3000` (or deployment origin). Sign in before opening deep links if the app requires auth.

| Scenario | Date range | Region | Charts | Role | Expected if procedure followed | Notes |
|----------|------------|--------|--------|------|-------------------------------|--------|
| Short range, small chart set | 7-day window (align with seed data) | `all` | `heatmap`, `type_breakdown` | Analyst or admin | Preview loads; print dialog can open; no uncaught client error | Minimal chart set + AI summary |
| Longer range, mixed chart set | ~90-day window | `south` | `heatmap`, `postal_code`, `call_volume_trend` | Same | Same | `call_volume_trend` waits for async chart readiness before `autoprint` |
| Full chart selection | Overlaps seed data | `all` | all seven chart keys | Same | Same | Full chart selection |
| Missing date parameters in URL | Missing `startDate` / `endDate` in URL | `all` | any | Same | Error: *Start and end date are required to load chart previews.* (`ExportPreview.jsx`) | No chart PDF until dates set |
| Empty chart selection in URL | Valid dates, no `charts` param | `all` | _(none)_ | Same | No KPI sections; summary pipeline idle when no charts selected | Empty-selection path |

### Example query strings (path `/export-preview`)

Parameters use ISO timestamps in the query string (same as the modal-generated URLs).

- **Short range, small chart set (template):**  
  `?region=all&startDate=<START_ISO>&endDate=<END_ISO>&charts=heatmap,type_breakdown`  
  Example window: `2024-03-01T00:00:00.000Z` … `2024-03-07T23:59:59.999Z` (align with `deployment/db` seed dates).

- **Longer range, mixed chart set (template):**  
  `?region=south&startDate=<START_ISO>&endDate=<END_ISO>&charts=heatmap,postal_code,call_volume_trend`

- **Full chart selection:**  
  `?region=all&startDate=<START_ISO>&endDate=<END_ISO>&charts=heatmap,postal_code,type_breakdown,unit_hour_utilization,call_volume_trend,mutual_aid,response_time_breakdown`

- **Missing date parameters in URL:**  
  `?region=all` (omit date params) — expect date error on preview.

- **Empty chart selection in URL:**  
  `?region=all&startDate=<START_ISO>&endDate=<END_ISO>` (omit `charts`) — empty chart list behavior.

---

## Content checklist (each successful print save — first three scenarios)

| Check | Result (fill on run) |
|-------|----------------------|
| Reporting window matches selected start/end | |
| Region label matches (`All` / South / North) | |
| Selected chart sections present or defensible empty state | |
| AI summary resolved (`ready` / `unavailable` / `error`) matches UI | |
| Key takeaways ≤3 bullets when `ready` | |

Missing date parameters: confirm error string. Empty chart selection: confirm no chart blocks and no misleading “full report” when charts are empty.

---

## Defects / blockers

| ID | Description |
|----|-------------|
| — | None observed for automated API slice; browser runs use local seed data. |

---

## Revision

| Date | Change |
|------|--------|
| 2026-04-18 | Initial scaffold |
| 2026-04-18 | API pytest log, scenario C/D, example URLs, checklist |
