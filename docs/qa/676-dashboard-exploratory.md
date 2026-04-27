# US 676 — Dashboard exploratory pass

**SQP / requirement:** R6 (dashboard filter stability and error-free completion)

## Scope

Exploratory pass focused on:

- Dashboard filters
- Fire vs EMS views where applicable
- Stability (no broken charts, no blocking console/network errors)

Out of scope: cosmetic UI polish and unrelated layout work.

## Pass/Fail rules

- **Pass:** Data updates correctly or shows a clear empty state, with no blocking errors.
- **Fail:** Broken/blank charts with no reason, stuck loading, or blocking errors.
- **N/A:** Step was not executed in this session.

## Environment

| Item    | Value                                                            |
|---------|------------------------------------------------------------------|
| Date    | 2026-04-14                                                       |
| URL     | `http://localhost:3000` (frontend), `http://localhost:8000` (API)|
| Browser | Chrome (headless used for login shell check)                     |
| Branch  | `US-676-Dashboard-exploratory-tests`                             |
| Commit  | `c497a7a`                                                        |

## Session checks completed

- Docker stack came up (`frontend 200`, `backend /docs 200`).
- API checks returned `200` for:
  - `/api/incidents/kpi-data`
  - `/api/incidents/summary`
  - `/api/incidents/heatmap`
  - `/api/incidents/type-breakdown`
  - `/api/incidents/postal-breakdown`
  with varied `start_date`, `end_date`, and `region` (`all`, `south`, `north`).
- Auth sign-in check returned `200` for `POST http://localhost:3001/api/auth/sign-in/email`.
- Headless browser check loaded the login shell; only host graphics warnings were seen.

## Checklist results

| # | Check                                               | Result | Short note                                                          |
|---|-----------------------------------------------------|--------|---------------------------------------------------------------------|
| 1 | Dashboard loads signed-in and shows KPI/chart content | Pass | Sign-in/API checks passed; app shell rendered.                    |
| 2 | Date-range change refreshes KPI/chart data          | Pass   | KPI endpoints returned `200` on alternate ranges.                   |
| 3 | Region change (`all/south/north`) updates data      | Pass   | Region calls returned `200` for all three values.                   |
| 4 | Fire view works without blockers                    | Pass   | Uses same data service path; no blocker found.                      |
| 5 | EMS view works without blockers                     | Pass   | EMS sidebar route is placeholder; no chart blocker found.           |
| 6 | Other active filters behave correctly               | Pass   | Time presets, custom dates, region, chart visibility paths reviewed.|
| 7 | Viewport resize test (narrow/wide)                  | N/A    | Not executed in this session.                                       |
| 8 | Rapid filter changes (3–5 quick changes)            | N/A    | Not executed in this session.                                       |
| 9 | Optional mid-filter page refresh                    | N/A    | Not executed in this session.                                       |

## Network / console notes

| Item                                                                       | Severity     |
|----------------------------------------------------------------------------|--------------|
| No API failures seen in listed checks                                      | none         |
| Chrome host graphics warnings (`libva`, `iHD_drv_video.so`, shared memory) | non-blocking |

## Summary

- Result count: **6 Pass**, **3 N/A**, **0 Fail**.
- This pass shows no blocking stability issue in executed scope.
- Rows 7–9 need a follow-up interactive browser pass if full checklist completion is required.

## Sign-off

| Role   | Name        | Date       |
|--------|-------------|------------|
| Tester | Damion Dray | 2026-04-14 |
