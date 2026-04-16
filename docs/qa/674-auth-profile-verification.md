# US 674 — Auth, profile, verification, routes

**SQP:** R7, R8, R9 (metrics in Section 3 per flows exercised).

| Field | Value |
|--------|--------|
| Date | 2026-04-15 |
| Branch | `US-674-Verify-Authentication` |
| Reference | `kpi_dashboard/src/App.jsx` (`RequireAuth`, `RequireGuest`) |
| Base URL | `http://localhost:3000` |

## Setup used for this run

- Frontend and auth/backend services running on `http://localhost:3000`.
- Private/incognito browser window used for logged-out route checks.
- Site data for `http://localhost:3000` cleared in dev tools storage before logged-out checks (`/home`, `/export-preview`).

## Test results

| Step | Action | Expected | Actual | Result |
|------|--------|----------|--------|--------|
| 1 | Logged out, navigate to `/home` | Land on `/` (login), not dashboard | Redirected to `http://localhost:3000/` login page | Pass |
| 2 | Logged out, navigate to `/export-preview` | Land on `/` | Redirected to `http://localhost:3000/` login page | Pass |
| 3 | Incomplete-profile path check | Incomplete data path is blocked before protected route access | Incomplete/missing field input did not allow login session | Pass |
| 4 | Unverified account (profile complete), open `/home` | Redirect to `/awaiting-access` | Redirected to `/awaiting-access` (pending approval screen shown) | Pass |
| 5 | Verified + complete account, sign in | Reach `/home` without error | `/home` rendered; `/export-preview` also rendered while signed in | Pass |

**Defects:** None in executed steps.


