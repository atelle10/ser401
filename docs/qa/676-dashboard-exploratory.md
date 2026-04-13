# US 676 — Dashboard exploratory pass

Structured exploratory pass for **filters**, **Fire vs EMS** views where applicable, and **stability** (failed requests, blank charts, blocking console errors).  
Scope excludes unrelated dashboard UI polish owned by the active UI sprint task.

**Requirement trace:** R6 — KPI views update appropriately when filters change (functional completion).  
**Metric note:** Dashboard load completion rate in the quality plan refers to **error-free** filter/view changes, not response-time percentiles.

### Definitions (this pass)

- **Pass:** Expected data or empty state is explained by filters; no blocking errors; charts load or show a clear empty state.
- **Fail:** Blank chart with no explanation, stuck loading, incorrect data after filter settles, or console/network errors that block continued testing.
- **Blocking console error:** An uncaught exception or repeated failed calls that prevent changing filters or reading KPIs.

---

## Environment

| Field | Value |
|--------|--------|
| **Date** | |
| **URL** | |
| **Browser / version** | |
| **Branch** | |
| **Commit** | |
| **Build / deploy notes** | |

---

## Coordination (dashboard UI work)

- Related UI task / build:
- Out of scope for this pass: cosmetic polish, copy tweaks, layout experiments not tied to filter or Fire/EMS behavior.

---

## Checklist (steps)

Per row: **Pass**, **Fail**, or **N/A**. For **Fail**, record failed network calls, blank charts, or blocking console errors (short note or ticket ID).

| # | Step | Result | Notes |
|---|------|--------|-------|
| 1 | Load dashboard signed in; initial charts and KPIs render | | |
| 2 | Change **date range**; charts/KPIs refresh without blank state | | |
| 3 | Change **region** (or equivalent geography filter); data updates | | |
| 4 | Toggle or select **Fire** view where applicable; no console blockers | | |
| 5 | Toggle or select **EMS** view where applicable; no console blockers | | |
| 6 | Exercise **other filters in use** on current build (list in notes) | | |
| 7 | Resize / **viewport** change (narrow then wide); layout usable, no stuck spinners | | |
| 8 | Rapid filter changes (3–5 quick changes); no duplicate errors or dead UI | | |
| 9 | Optional — refresh page mid-filter; recovery acceptable | | |

**Additional filters exercised:**

---

## Network / console spot-check

DevTools **Network** (XHR/fetch): record **4xx/5xx** or stalled requests linked to checklist steps.  
**Console:** record **errors** that block interaction; record warnings only when tied to missing or blank data.

| Request / message | Step # | Severity (blocker / non) |
|-------------------|--------|-------------------------|
| | | |

---

## Summary

- **Steps completed without functional error:** _X / Y_ (state whether **N/A** rows are excluded from _Y_.)
- **One-line summary:**
- **Follow-ups:**

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Tester | | |
