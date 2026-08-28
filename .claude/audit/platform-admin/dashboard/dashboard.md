# Dashboard — Platform Admin
URL/route: `https://jobixflow.com/platform`
Purpose: Landing page after login. High-level KPI summary + two charts + a live "Active Jobs" table.

## Navigation path
Default landing page immediately after login (also reachable via "Dashboard" in the left sidebar, always the first nav item).

## CRUD actions tested
- Create: N/A — this page has no create action.
- Read: KPI tiles and Active Jobs table read live data. Table is sortable per column (see below) and paginated (5 pages shown, up to 100).
- Update: N/A.
- Delete: N/A.

## Hidden / secondary UI elements
- **User card (bottom of sidebar, "Emily Zboncak II")** — click toggles a dropdown with two items: "Edit Profile" (→ `/profile`) and "Log out". See screenshot 02. Confirmed by clicking; did not test Log out itself here (tested in a later flow) — see Open Questions.
- **"EZ" circular avatar** (separate element next to the user card) — is itself a link straight to `/profile`, independent of the dropdown toggle button beside it. Two different controls do the same navigation.
- **Table column headers** (Job ID, Company, Type, Technician, Status, Priority) — each is a sort button ("Activate to sort" / "Activate to invert sorting" per accessibility label). Not clicked through every column in this pass; behavior assumed to match the standard DataTable pattern confirmed on the Jobs page.
- **Table rows** — clicking a row does **nothing** (no navigation, no row-detail expansion). There is no "View" link or action column on this dashboard table, unlike the pattern described for other list screens. This table is read-only summary data only.
- **Pagination control** — Previous/1/2/3/4/5/…/100/Next. "Previous" is disabled on page 1 (correctly reflects state). Not paged through further here since this is a dashboard summary, not the primary Jobs list.
- **Notifications nav item** carries a live unread-count badge ("52") directly in the sidebar — the only sidebar item with a badge.

## States observed
- Empty state: Not observed — seed data is present (5 companies, 1051 jobs). Cannot confirm empty-dashboard rendering.
- Loading state: Not observed (page loaded fast enough that no skeleton/spinner was caught).
- Error state: Not tested (no way to force a load failure without dev tools).
- Success/confirmation state: N/A, no mutating actions on this page.
- Disabled elements: Pagination "Previous" link is disabled on page 1 — the only disabled element found.

## Validation & edge cases
N/A — no form inputs on this page.

## Permissions
Platform Admin sees platform-wide KPIs (all 5 companies aggregated) and a cross-company Active Jobs table (all rows show company "Ziemann-Satterfield" in this sample — cannot yet confirm multiple companies appear in the same table without paging further, flagged as open question). Matches `CLAUDE.md`: Platform Admin "monitors everything."

## Issues / inconsistencies / open questions
- [OPEN] KPI deltas all show "0%" except "Num of users" which shows "-100%" — unclear if this is a real week-over-week signal or a data/formatting bug (a -100% change on user count would mean users dropped to zero, which contradicts the "134" figure shown). Needs developer confirmation.
- [OPEN] Could not determine whether the Active Jobs table on the dashboard is scoped only to a subset of companies or genuinely happens to show only "Ziemann-Satterfield" jobs in the sampled rows — did not page through to confirm cross-company rows appear (relevant to `TEN-002` verification, though Platform Admin is explicitly a cross-tenant role so this may be expected).
- Dashboard table has no row-level actions at all (no View/chat/call icons) — worth flagging for the reusable Actions-component design since other tables (e.g. Jobs) do have row actions; this one deliberately doesn't.
