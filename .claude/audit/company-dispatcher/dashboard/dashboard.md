# Active Jobs Dashboard — Company Dispatcher
URL/route: `https://jobixflow.com/companies.dispatcher`
Purpose: Landing page — job-status KPIs plus a live feed of active job cards, oriented around what this dispatcher needs to act on right now.

## Navigation path
Default landing page after login for this role.

## CRUD actions tested
Read only. 4 KPI tiles: Active (164, "Jobs in progress"), New (0, "Awaiting assignment"), Today (0, "Completed jobs"), Available (8, "Free technicians"). Below that, an "Active Jobs" card list (title, status pill, description or "No description"/"no info" placeholder, customer name, address, time, assigned technician avatar+name, service-type-ish label, price) with a "View All" link to Active Jobs. Below that, an "Urgent Attention Required" section (rendered empty in this pass — no urgent jobs at the moment) and an "Available Technicians" panel with its own "View All" link.

## Hidden / secondary UI elements
- Job cards are **not clickable** — tested on the first card ("Shayna Price"), no navigation occurred, consistent with the same non-interactive-summary-row pattern seen on every other role's dashboard in this audit.
- **The "Available Technicians" panel's "View All" link points to a literal `"#"` anchor** — a dead placeholder link, not wired to any real destination. Real, findable bug.
- Sidebar shell matches Platform Dispatcher's pattern (top-right navbar with avatar/notifications, no user card pinned to sidebar, no role-subtitle text visible the same way — though a role-subtitle line does appear here under the logo, worth re-confirming against Platform Dispatcher's exact layout since this detail seemed to vary slightly).

## States observed
- Empty state: "Urgent Attention Required" renders with no visible content when there's nothing urgent — worth checking if this is an intentional empty state or literally renders nothing (blank heading with no content and no "nothing urgent" message is a borderline-invisible empty state, arguably violating `Rule 02 · R02-3`'s mandatory empty-state requirement if there's truly no fallback copy).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: None found.

## Validation & edge cases
N/A.

## Permissions
Company + role scoped — this dispatcher sees only jobs/technicians for their own company, consistent with `TEN-002`.

## Issues / inconsistencies / open questions
- **[FINDING]** "View All" under Available Technicians links to `#`, a dead anchor — should route to a real technician list (possibly the same URL as the sidebar's "Technicians" item, `/companies.dispatcher/technicians`, but not wired here).
- **[FINDING]** "Urgent Attention Required" section shows no visible fallback/empty-state message when there's nothing urgent — worth confirming with a real urgent job present before concluding the section is broken vs. correctly quiet.
