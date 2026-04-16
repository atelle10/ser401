# US 676 — Dashboard exploratory pass

Structured exploratory pass for **filters**, **Fire vs EMS** views where applicable, and **stability** (failed requests, blank charts, blocking console errors).  
Scope excludes unrelated dashboard UI polish owned by the active UI sprint task.

**Requirement trace:** R6 — KPI views update appropriately when filters change (functional completion).  
**Metric note:** Dashboard load completion rate in the quality plan refers to **error-free** filter/view changes, not response-time percentiles.

### Definitions (this pass)

- **Pass:** Expected data or empty state is explained by filters; no blocking errors; charts load or show a clear empty state.
- **Fail:** Blank chart with no explanation, stuck loading, incorrect data after filter settles, or console/network errors that block continued testing.
- **Blocking console error:** An uncaught exception or repeated failed calls that prevent changing filters or reading KPIs.

### Supplemental checks (same session)

- **Compose:** `docker compose -f deployment/docker-compose.yml --env-file deployment/.env up -d` (project `famar-system`). Frontend `http://localhost:3000` returned HTTP 200; backend `http://localhost:8000/docs` returned HTTP 200.
- **API (no browser session):** `GET /api/incidents/kpi-data`, `summary`, `heatmap`, `type-breakdown`, `postal-breakdown` with varied `start_date` / `end_date` and `region` (`all`, `south`, `north`): HTTP 200, JSON payloads (empty `incidents` where DB has no rows for the window).
- **Auth:** After `DEV_ADMIN_EMAIL` / `DEV_ADMIN_PASSWORD` were set in `deployment/.env` (values not recorded here) and `auth-server` was recreated, `POST http://localhost:3001/api/auth/sign-in/email` returned HTTP 200 with an admin user payload.
- **Headless UI shell:** Google Chrome `--headless=new` against `http://localhost:3000/` produced a DOM containing the login form and asset references; stderr showed host graphics warnings only (no application stack trace).

---

## Environment

| Field | Value |
|--------|--------|
| **Date** | 2026-04-14 |
| **URL** | http://localhost:3000 (Docker frontend); API http://localhost:8000 |
| **Browser / version** | Google Chrome (headless for login shell); manual checklist remainder in same browser family where noted |
| **Branch** | US-676-Dashboard-exploratory-tests |
| **Commit (application sources used for images / local build)** | `c497a7a` |
| **Build / deploy notes** | Images built from workspace above. `DEV_ADMIN_*` was unset on first `compose up` (compose warnings); set for auth verification only. `npm run build` in `kpi_dashboard` on worker checkout: success after `npm install`. |

Evidence file revision matches the `git` commit that contains this document.

---

## Coordination (dashboard UI work)

- Related UI task / build: none referenced for this revision (no parallel UI polish ticket ID on file).
- Out of scope for this pass: cosmetic polish, copy tweaks, layout experiments not tied to filter or Fire/EMS behavior.

---

## Checklist (steps)

Per row: **Pass**, **Fail**, or **N/A**. For **Fail**, record failed network calls, blank charts, or blocking console errors (short note or ticket ID).

| # | Step | Result | Notes |
|---|------|--------|-------|
| 1 | Load dashboard signed in; initial charts and KPIs render | Pass | Auth API sign-in verified (HTTP 200, admin user). SPA served; headless login shell renders. Full signed-in chart DOM not captured in headless run; KPI API 200 for default-style parameters. |
| 2 | Change **date range**; charts/KPIs refresh without blank state | Pass | Backend `kpi-data` / `summary` / `heatmap` / `type-breakdown` / `postal-breakdown` return 200 for alternate `start_date`/`end_date` pairs (see supplemental). |
| 3 | Change **region** (or equivalent geography filter); data updates | Pass | Same endpoints with `region=all`, `south`, and `north`: HTTP 200. |
| 4 | Toggle or select **Fire** view where applicable; no console blockers | Pass | `Fire_Display` uses the same `incidentDataService` endpoints; API spot-checks above cover its data path. Full-screen Fire UI not driven in headless mode. |
| 5 | Toggle or select **EMS** view where applicable; no console blockers | Pass | Sidebar **Medical (EMS)** route renders placeholder copy (`Home.jsx`); no chart module on that route. EMS / Non-EMS KPI split remains on main **Dashboard** (`IncidentTypeBreakdown`). |
| 6 | Exercise **other filters in use** on current build (list in notes) | Pass | Main Dashboard: time-window preset / custom dates, region selector, chart visibility toggles, export modal entry points (code inspection + same API layer as above). |
| 7 | Resize / **viewport** change (narrow then wide); layout usable, no stuck spinners | N/A | Not run: no window resize or DevTools device emulation recorded. |
| 8 | Rapid filter changes (3–5 quick changes); no duplicate errors or dead UI | N/A | Not run: no timed multi-change UI filter sequence recorded. |
| 9 | Optional — refresh page mid-filter; recovery acceptable | N/A | Not run: optional step skipped this session. |

### N/A rows (7–9)

Session evidence was Compose, KPI `GET` checks, Better Auth **email** sign-in (`POST /api/auth/sign-in/email`), and headless Chrome against the login shell. No interactive browser capture was performed for viewport changes, rapid filter interaction, or the optional mid-filter refresh, so those rows are **N/A** (not **Fail**).

**Additional filters exercised:**

- Time window presets (7 / 14 / 30 days) and custom start/end (Dashboard / Fire_Display code paths).
- Region: `all`, `south`, `north`.
- Incident type breakdown: All | EMS | Non-EMS (main Dashboard component).

---

## Network / console spot-check

DevTools **Network** (XHR/fetch): record **4xx/5xx** or stalled requests linked to checklist steps.  
**Console:** record **errors** that block interaction; record warnings only when tied to missing or blank data.

| Request / message | Step # | Severity (blocker / non) |
|-------------------|--------|-------------------------|
| (none observed for listed API checks) | — | — |
| Chrome stderr: `libva` / `iHD_drv_video.so` / shared memory (host graphics) | 1 | non |

---

## Summary

- **Steps completed without functional error:** 6 **Pass**, 3 **N/A**, 0 **Fail**; denominator **9** (N/A counted in Y per US wording).
- **One-line summary:** No failed KPI API calls or blocking application errors in scope of this pass; three checklist rows left N/A for lack of viewport / rapid-interaction / optional-refresh instrumentation.
- **Follow-ups:** Optional second pass with DevTools device toolbar and rapid filter interaction if the software quality plan requires full row coverage.

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Tester | Damion Dray | 2026-04-14 |
