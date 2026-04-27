# US 714 — Dashboard filter stability (R6)

**SQP metrics:** Dashboard Filter Response Time; Dashboard Load Completion Rate.  
**Requirement:** R6.

| Field        | Value                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- |
| Date         | 2026-04-24                                                                            |
| Branch       | `US-714-Dashboard-filter-stability`                                                   |
| Commit       | `3f2abfd00910a63e39a7883a2bde1cbf9fe15b2f`                                            |
| Environment  | Local Docker per root `README` (`http://localhost:3000`, API `http://localhost:8000`) |
| Baseline doc | [676-dashboard-exploratory.md](676-dashboard-exploratory.md)                          |

## Purpose

This file **extends** US 676. It adds:

1. **Automated KPI API smoke** after rebasing onto current `staging` (same endpoints the dashboard uses for filters and charts).
2. **Manual extension steps** for the rows that were **N/A** in US 676 (viewport resize, rapid filter changes, optional mid-filter refresh).
3. A clear note on **formal timing** (95th percentile under 1000 ms): not measured here.

---

## Automated evidence (API, post-rebase)

Command (repo root, venv active):

```bash
source .venv/bin/activate
PYTHONPATH=. pytest backend/api/tests/test_kpi_data.py \
  backend/api/tests/test_heatmap.py \
  backend/api/tests/test_postal_breakdown.py \
  backend/api/tests/test_type_breakdown.py -q
```

| Result   | Value                   |
| -------- | ----------------------- |
| Outcome  | **14 passed**, 0 failed |
| Duration | ~0.18s                  |

Interpretation: KPI read paths used by dashboard filtering remain **green** in automated tests on this commit. This supports **R6** data refresh behavior at the API layer; it does not replace a full browser timing study.

---

## Manual extension (fills US 676 gaps)

Use the same **Pass / Fail / N/A** rules as [676-dashboard-exploratory.md](676-dashboard-exploratory.md).  
Run on a live stack (Docker per root `README`). After each numbered block, write **Pass**, **Fail**, or **N/A** in the summary table and add short notes for any **Fail**.

### Step 7 — Viewport resize (US 676 row 7)

1. Start Docker and open the app in a normal browser window (not headless).
2. Sign in with an account that can open `/home` and see the main **Dashboard** with KPIs/charts.
3. Open DevTools and turn on **device toolbar** (or manually shrink the window) to a **narrow** width (phone-sized).
4. Confirm charts and filters stay usable: no endless spinners, no blank charts without a clear empty reason.
5. Switch to a **wide** window again.
6. Confirm the same: data or explained empty state, no stuck UI.

| Block | Result | Notes                                                                         |
| ----- | ------ | ----------------------------------------------------------------------------- |
| 7     | Pass   | Resized narrow/wide; no loading spinners observed; chart data stayed visible. |

### Step 8 — Rapid filter changes (US 676 row 8)

1. Stay on the main **Dashboard** (not the EMS placeholder screen unless you intentionally test there).
2. Perform **five** filter changes **as fast as you can click**, waiting only until each change visibly settles (or shows a clear empty state). Use any mix of:
   - **Region**, **time window**, **start/end dates**
   - **Charts displayed** multiselect (turn chart types on or off there)
   - **Per-chart X / +** on dashboard tiles (X hides a chart, + brings it back), instead of the multiselect if you prefer
   Suggested order (repeat or swap as needed):
   1. Change **start date** or **end date** once.
   2. Change **region** once (for example `all` → `south`).
   3. Turn **one chart** off then on — either in **Charts displayed** or with the chart tile **X / +**.
   4. Change the **date range** again (different window).
   5. Change **region** again or toggle **another** chart the same way.
   
3. After the sequence, watch **Network** (optional) for repeated failed KPI calls and **Console** for red errors that block use.
4. Record **Pass** only if there is no dead UI, no unexplained blank charts, and no blocking errors.

| Block | Result | Notes |
|-------|--------|-------|
| 8     | Fail   | Rapid chart toggle flow throws uncaught console errors. |

Details:

- `TypeError: a is not a function` from charts displayed multiselect (`onSelect/onRemove`).
- `ReferenceError: setSelectedCharts is not defined` from tile `X/+` handlers.
- Charts still toggle off/on, but errors repeat during the flow.
- Response time breakdown may not restore from tile `+` like other charts.

### Step 9 — Refresh mid-filter (US 676 row 9, optional)

1. Set a **non-default** date range and/or region so the URL or UI state is clearly not “fresh load defaults” if the app reflects that.
2. Press the browser **Reload** (or `Ctrl+R` / `Cmd+R`).
3. After reload, confirm either: filters and data **recover** to match what you expect, or the app shows a **clear empty state** with no broken charts.

| Block | Result | Notes                                                                    |
| ----- | ------ | ------------------------------------------------------------------------ |
| 9     | Pass   | Refresh resets filters to defaults; app recovers cleanly; charts render. |


## Formal response-time metric (R6)

**Not run in this document.** A full “95th percentile under 1000 ms” study needs a fixed browser, machine class, dataset size, and many timed runs. Record that separately if the course requires it.

---

## Defects

| ID     | Description                                                                                                                                                                |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D714-1 | Rapid chart toggle flow (multiselect and tile X/+) throws uncaught client errors: `TypeError: a is not a function` and `ReferenceError: setSelectedCharts is not defined`. |


