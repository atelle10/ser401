# US 711 — AI-assisted PDF report (R4 evidence)

**SQP §3 metrics:** PDF Report Generation Success Rate; Report Content Completeness.  
**Requirement:** R4.

| Field | Value |
|--------|--------|
| Date | 2026-04-18 |
| Branch | _(feature branch for US 711)_ |
| Commit | _(after run: `git rev-parse HEAD`)_ |
| Environment | Local Docker per root `README` (`just start-clean-all`); frontend `http://localhost:3000` |

## Scope

Export uses the dashboard **Export PDF** flow: modal builds settings from `kpi_dashboard/src/Components/Dashboard/exportConfig.js`, opens `/export-preview` with query params (`region`, `startDate`, `endDate`, `charts`, optional `autoprint=1`). The preview loads chart data, then calls **`POST /api/export/summary`** for the AI block (`ExportPreview.jsx` → `fetchExportSummary`). “PDF” in practice is **browser Print → Save as PDF** on the print layout (not a server-generated binary).

**Progress (this increment):** scenario matrix, reproduction steps, and content checklist template are documented. **Scenarios C–D are left for a follow-up increment** (execution + checklist rows to be filled when run).

---

## Scenario matrix

Chart keys match `chartOptions` in `exportConfig.js`: `heatmap`, `postal_code`, `type_breakdown`, `unit_hour_utilization`, `call_volume_trend`, `mutual_aid`, `response_time_breakdown`.

| ID | Date range | Region | Charts selected | Role | PDF generation pass/fail | Notes |
|----|------------|--------|-----------------|------|--------------------------|--------|
| A | Short (e.g. 7 consecutive days within seeded data) | `all` | Minimal: `heatmap`, `type_breakdown` | Analyst or admin (export allowed) | **Pending** | Baseline: shared preview data + AI summary path |
| B | Longer (e.g. 90+ days within seeded data) | `south` or `north` | `heatmap`, `postal_code`, `call_volume_trend` | Same | **Pending** | Stresses range + async print-ready charts (`call_volume_trend` waits on chart ready) |
| C | Same as A or B | `all` | **All seven** chart toggles on in modal | Same | **Planned — next increment** | “Many selections” / full layout |
| D | Edge: invalid or empty window | `all` | Any | Same | **Planned — next increment** | Expect user-visible error or empty state before print; document actual behavior |

---

## Reproduction (manual)

1. Sign in with an account that can reach `/home` and open the KPI dashboard.
2. Set **date** and **region** and show the charts needed for the scenario.
3. Open **Export PDF** (`ExportPdfModal`), confirm selections match the scenario row.
4. Continue to **export preview** (URL `/export-preview?...`; `autoprint=1` may trigger `window.print()` after summary + async charts are ready).
5. Use **Print → Save as PDF** (or print preview) and confirm no hard failure before/during print.
6. For **AI block**: wait until the summary is not stuck on “Generating…” and status is resolved (`ready`, `unavailable`, or `error` per client handling).

---

## Content checklist (per successful PDF save)

Apply after scenarios A–B are executed (C–D when run).

| Check | Pass / Fail |
|-------|-------------|
| Reporting window matches selected start/end (see preview header or title) | |
| Region label matches selection (`All`, `South Scottsdale`, `North Scottsdale`) | |
| Each selected chart section appears (or explicit empty state for that chart) | |
| AI summary section present when status `ready`; if `unavailable`/`error`, documented behavior matches UI | |
| “Key Takeaways” list (if shown) has ≤3 bullets per client | |

---

## Defects / blockers

| ID | Description |
|----|-------------|
| — | _(none yet)_ |

---

## Follow-up (remaining US 711 work)

- Execute scenarios **A** and **B**; fill pass/fail and checklist table.
- Execute **C** and **D**; update matrix and defects.
- Re-run `git rev-parse HEAD` and paste commit into the table at top.
