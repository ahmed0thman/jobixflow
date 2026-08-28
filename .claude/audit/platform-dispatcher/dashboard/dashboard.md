# Dispatcher Dashboard — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher`
Purpose: Landing page — job volume KPIs plus a "Recent Jobs" feed, with quick access to job creation.

## Navigation path
Default landing page after login for this role.

## CRUD actions tested
- Create: "New Job" link/button (appears twice: sidebar nav item and a duplicate button top-right of the page header) → `/platform.dispatcher/jobs/create` (see `new-job.md`).
- Read: 4 KPI tiles (Total Jobs 1051, UnCompleted 878, Completed 173, Urgent 370) + a "Recent Jobs" list (not a table — card/list rows) showing customer name, priority pill, status pill, type • address • technician name, price, and relative time.
- Update/Delete: N/A on this page.

## Hidden / secondary UI elements
- **Top-right user menu** (avatar "KR" + "Kailee Reichel" button) — click reveals the same Edit Profile / Log out dropdown pattern seen on Platform Admin, but positioned in a **top navbar**, not the sidebar-pinned user card. This is a materially different shell layout for this role — see Issues.
- **Recent Jobs rows are not clickable** — tested on the first row ("Zienab Y"); no navigation or expansion occurred, matching the same non-interactive-summary-row pattern already seen on Platform Admin's Dashboard.
- **"New Job" appears twice** on this single page (sidebar nav item + page-header button), both pointing to the same route.

## States observed
- Empty state: Not observed (1051 jobs platform-wide).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: None found.

## Validation & edge cases
N/A — no inputs on this page.

## Permissions
Platform Dispatcher's dashboard is job-focused (volume + urgency), unlike Platform Admin's dashboard (company/revenue-focused) — consistent with the different responsibilities in `CLAUDE.md`.

## Issues / inconsistencies / open questions
- **[FINDING] This role uses a visibly different shell than Platform Admin's.** Platform Admin has a sidebar-pinned bottom user card (avatar + name + email) with no separate top bar. Platform Dispatcher instead has a **top-right navbar** containing the notification bell/count and the user avatar+menu, with **no email shown** in the user menu trigger (only name + role). The sidebar itself also lacks the role-subtitle line under the logo that Platform Admin's sidebar has ("JobixFlow" alone, no "Platform Dispatcher" caption under the logo — the role label only appears in the top-right corner instead). This is a real, live layout inconsistency between two dashboards that are supposed to share one design system (`Rule 02 · R02-1`) — worth flagging as a concrete finding for the design-system reconciliation, not just a screenshot artifact.
- No other issues found on this simple landing page.
