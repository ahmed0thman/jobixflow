# Users — Company Admin
URL/route: `https://jobixflow.com/companies.admin/users`
Purpose: Manage all company staff — Admins, Dispatchers, **and Technicians all in one place**. This resolves the "where does technician creation happen" open question from `technicians.md`.

## Navigation path
Sidebar → "Users" (eighth item).

## CRUD actions tested
- **Create**: "Create New" button → "Create New User" modal: First Name, Last Name, UserName\*, Email Address\*, **Role\*** (Company Admin / Company Dispatcher / **Technician**), Country (same messy seed list as elsewhere), Initial Password\*, confirm Password\*, phone\*. Confirms technician accounts are created here, satisfying `ROL-006`. Cancelled without submitting — this also **reproduced the same "Cancel throws a JS TypeError" bug** already found on Platform Admin's equivalent Create User modal (`platform-admin/users/users.md`) — same Bootstrap-modal-backdrop error, same trigger (Cancel button).
- **Read**: Table — Name+Email, Role, Last Login, Status, Actions. 4 KPI tiles: **Total Users 123, Admins 2, Dispatchers 20, Technicians 101**, Active Users 123. 18 pages of results.
- **Update**: Row "Edit"/"Edit Password" links present (same pattern as Platform Admin's Users page) — not re-opened in this pass.
- **Delete**: Row "Delete" link present — not tested.

## Hidden / secondary UI elements
- Role filter dropdown: All Roles / Company Admin / Company Dispatcher / Technician.
- Row actions use the plain-text-link pattern (Edit Password / Edit / Delete), same as Platform Admin's Users page.
- One row (Eldora Zulauf, Technician) shows an empty "Last Login" cell, same blank-not-placeholder pattern already flagged on Platform Admin's Users page.

## States observed
- Empty state: Not observed (123 seed users).
- Loading state: Not observed.
- Error state: **Reproduced** — the same Bootstrap modal `TypeError` on Cancel already found on Platform Admin's Create User modal (see `platform-admin/users/users.md`) fires here too. Confirms this is a shared, systemic frontend bug (same modal component/JS), not a one-off.
- Success/confirmation state: Not tested.
- Disabled elements: Pagination Previous disabled on page 1.

## Validation & edge cases
Not tested.

## Permissions
Company Admin has full CRUD over all three company-level roles (Admin/Dispatcher/Technician) from one unified screen, satisfying `ROL-006` for technician creation specifically.

## Issues / inconsistencies / open questions
- **[FINDING — resolves an open question from `technicians.md`] Technician accounts are created here, via the generic "Create New User" flow with Role=Technician** — not from a dedicated action on the Technicians Management page. Worth a deliberate design decision on whether to keep this bundled pattern or add a shortcut directly on the Technicians page.
- **[FINDING — major, unresolved data discrepancy] This page's KPI tile reports "Technicians: 101" for this company, but the dedicated Technicians Management page (`company-admin/technicians/technicians.md`) only lists **11** technicians total** ("Showing 1 to 8 of 11 results"). This is either: (a) the Technicians Management page is filtering out ~90 technicians by some criterion not visible in its UI (e.g., only showing technicians with recorded job-stats, or only those in some "active/verified" sub-state), or (b) a genuine counting/scoping bug in one of the two pages. This is a significant enough discrepancy (11 vs. 101, roughly 9x) that it should be raised with the developer directly rather than assumed away — it would materially affect how a Company Admin perceives their own workforce size depending on which screen they're looking at. Flag as a priority data-integrity question for the gap analysis.
- **[FINDING — bug reproduced]** The Create User modal's Cancel button throws the same JS `TypeError` already found on Platform Admin's equivalent screen — confirms this is a shared component bug affecting every "Create User" modal across the product, not role-specific. Worth flagging to the developer as one fix that resolves it everywhere.
