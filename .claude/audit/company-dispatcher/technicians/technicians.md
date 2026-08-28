# Technicians — Company Dispatcher
URL/route: `https://jobixflow.com/companies.dispatcher/technicians`
Purpose: Read-only technician roster with live location and skills, for this dispatcher's own monitoring/reference (not editable — no Edit action found, unlike Company Admin's equivalent page).

## Navigation path
Sidebar → "Technicians" (fourth item).

## CRUD actions tested
- Read only: card grid — avatar, name, status pill, phone, job count, **precise live GPS coordinates** (e.g. "30.05320000, 31.24320000"), and a Skills tag list (same broken person-name source as elsewhere). No Edit/Create/Delete actions anywhere on this page for this role.

## Hidden / secondary UI elements
- **Filters**: Status (Offline/Available/**Off Duty**/Busy — confirms the four-state model seen on Live Map) and Skills (same broken ~55-name list, eighth confirmed occurrence across this audit).

## States observed
- Empty state: Not observed (51 pages... wait, 9 pages of 6 per page = 51 technicians, see Issues).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: None found.

## Validation & edge cases
Not tested.

## Permissions
Read-only for this role (no Edit action, unlike Company Admin's Technicians page which has one) — a sensible permission difference, consistent with `CLAUDE.md` ("Company Dispatcher: does not add technicians").

## Issues / inconsistencies / open questions
- **[FINDING — major, third data point in an ongoing discrepancy] This page reports "51 technicians found" for the same company** that Company Admin's Technicians Management page reported **11** for, and Company Admin's Users page KPI tile reported **101** for. Three different counts (11 / 51 / 101) for "how many technicians does Company 1 have," across three different screens. This needs to be resolved with the developer as a priority data-integrity question before any of these screens' numbers can be trusted for design purposes — recommend explicitly asking which (if any) is authoritative, and whether the others are filtering by some criterion (verification status, activity window, pagination-vs-total-count bug, etc.).
- **[FINDING] This page shows precise live GPS coordinates per technician (e.g. "30.05320000, 31.24320000"), while Company Admin's Technicians Management page showed literally "Unknown Zone" for every technician** (see `company-admin/technicians/technicians.md`) — for what should be the same underlying technicians and the same location data. This is a real, findable inconsistency: one role's technician list surfaces live location data and the other doesn't, for no apparent permission-based reason (if anything, Company Admin has broader access than Company Dispatcher elsewhere in this audit). Worth a developer check on whether Company Admin's page is simply not querying/displaying location data that already exists (as this page proves it does).
- Reinforces the "Off Duty" fourth status already flagged on Live Map — confirmed present in this page's filter dropdown too, so it's a real value in the data model, not a Live-Map-only quirk.
