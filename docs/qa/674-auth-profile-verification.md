# US 674 — Auth, profile, verification, routes

**SQP:** R7, R8, R9 (metrics in Section 3 per flows exercised).

| Field | Value |
|--------|--------|
| Date | 2026-04-08 |
| Branch | — |
| Commit | — |
| Reference | `kpi_dashboard/src/App.jsx` (`RequireAuth`, `RequireGuest`) |
| Base URL | Set at run time (local or deployed SPA) |

## Expected behavior (from source)

| Flow | Condition | Expected |
|------|-----------|----------|
| Protected route, no session | Open `/home` or `/export-preview` | Redirect to `/` (`Navigate`, `state.from` may be set) |
| Protected route, stale client session flag | `hasAuthenticatedSession()` true, no server session | Redirect `/session-expired` |
| Incomplete profile | `needsProfileCompletion(user)` true, path not `/complete-profile` | Redirect `/complete-profile` |
| Unverified | `verified === false`, path not `/complete-profile` or `/awaiting-access` | Redirect `/awaiting-access` |
| Guest routes with session | Open `/` or `/register` while signed in, profile complete + verified | Redirect `/home` |
| Eligible user | Complete profile + verified | `/home` (and `/export-preview`) render app shell |

`/awaiting-access` and `/session-expired` are **not** wrapped in `RequireAuth`; they render without a session (splash screens).

## Manual execution

Use team test accounts on the target environment. Record **pass/fail** (no passwords or tokens in this file).

| Step | Action | Expected | Pass |
|------|--------|----------|------|
| 1 | Logged out, navigate to `/home` | Land on `/` (login), not dashboard | — |
| 2 | Logged out, navigate to `/export-preview` | Land on `/` | — |
| 3 | Incomplete-profile account, open `/home` | Redirect to `/complete-profile` | — |
| 4 | Unverified account (profile complete), open `/home` | Redirect to `/awaiting-access` | — |
| 5 | Verified + complete account, sign in | Reach `/home` without error | — |

**Defects:** —
