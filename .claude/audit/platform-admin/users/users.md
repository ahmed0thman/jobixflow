# Users — Platform Admin
URL/route: `https://jobixflow.com/platform/users`
Purpose: Manage platform-level staff accounts (Platform Admin + Platform Dispatcher roles only — not company users).

## Navigation path
Sidebar → "Users" (eighth item).

## CRUD actions tested
- **Create**: "Create New" button → modal "Create User" with fields ending in a Phone Number field (full field list not captured before scrolling, but confirmed a "Create User" / "Cancel" button pair). Clicked Cancel to close — **this triggered a real JS error** (see Issues), did not submit.
- **Read**: Table — Name+Email, Role, Last Login, Status, Actions. 4 KPI tiles above the table: Total Users (6), Admins (1), Dispatchers (5), Active Users (6) — matches `test-users.md` exactly (1 Platform Admin + 5 Platform Dispatchers).
- **Update**: Row "Edit" link → modal "Edit User" pre-filled with Username, Email, Role (Platform Admin/Platform Dispatcher dropdown), **Country** (same messy America/Middle East Country seed list seen on Companies and Countries — a third place this same dropdown appears), Status (Active/Inactive only — **no "Deleted" option here**, unlike Company Status, a positive consistency note). Tested on Kailee Reichel's row, values matched the table row correctly. Closed without saving.
- **Delete**: Row "Delete" link present — not tested, same live-data caution as elsewhere.
- Also present per row: **"Edit Password"** — a separate action from "Edit," implying password reset is a distinct flow from profile editing. Not opened in this pass.

## Hidden / secondary UI elements
- **Row Actions** use the plain-text-links pattern (Edit Password / Edit / Delete), matching Countries' convention rather than Companies' kebab menu or Notifications' button-row style — a fourth data point on the inconsistent row-actions patterns already flagged in `jobs.md` and `countries.md`.
- **Role filter dropdown** — "All Roles" / "Platform Admin" / "Platform Dispatcher" — correctly scoped to only the two platform-level roles that exist on this screen (does not list Company Admin/Dispatcher/Technician, since those live on a different management surface entirely).
- **Search box** ("Search users by name, email...") present, not exercised.
- One row (Dr. Jaron Rutherford III) shows an **empty Last Login cell** — presumably a user who has never logged in; no "Never" placeholder text is shown, the cell is simply blank (see Issues).

## States observed
- Empty state: Not observed (6 seed users, single page).
- Loading state: Not observed.
- Error state: **Found unintentionally** — see Issues (JS TypeError on modal Cancel).
- Success/confirmation state: Not captured (no create/edit/delete completed).
- Disabled elements: Pagination Previous/Next both disabled (single page of results, correct).

## Validation & edge cases
Not tested beyond the accidental error described below.

## Permissions
Platform Admin has full CRUD over platform-level users (Admins + Dispatchers), matching `CLAUDE.md`. This screen is scoped to platform staff only — company staff (Company Admin/Dispatcher/Technician) are managed elsewhere (not yet mapped for this role, since Platform Admin's nav has no link to company user management, confirmed absent from the sidebar).

## Issues / inconsistencies / open questions
- **[FINDING] Real bug: clicking "Cancel" on the Create User modal throws an uncaught JS `TypeError`** (`Cannot read properties of undefined (reading 'backdrop')`, inside the Bootstrap modal vendor bundle, triggered from the Cancel button's click handler). The modal did visually close despite the error, so the user-facing impact may be minimal, but this is a genuine live bug worth flagging to the developer directly — it's outside the designer's remit to fix, but it's the kind of thing that can silently break subsequent modal opens on the same page (stuck backdrop, non-scrolling body) and is worth a heads-up regardless of the design work planned here.
- **[FINDING]** The empty "Last Login" cell for a never-logged-in user renders as literally blank rather than a placeholder like "Never" — small polish gap worth carrying into the redesign's empty-cell conventions.
- **[FINDING]** A user-level Country field exists (via Edit User), independent of the company-level Country fields already found on Companies (two of them) — this is the third distinct place a "Country" value is captured in the live product, all drawing from the same messy "America Country" / "Middle East Country" seed list. Reinforces the `Q-04` recommendation to resolve the Country-selector question centrally rather than screen-by-screen.
- **[OPEN]** Did not open "Edit Password" or complete a real Create/Edit/Delete submission — success/confirmation states and the full Create User field list (beyond what was visible before the phone field) remain unverified.
