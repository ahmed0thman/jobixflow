# Code Requests — Company Admin
URL/route: `https://jobixflow.com/companies.admin/code_requests` (list) · `/companies.admin/code_requests/{id}` (show)
Purpose: The technician-asks/company-sources key-code fulfillment flow described in `CLAUDE.md`. Confirmed live and functional.

## Navigation path
Sidebar → "Code Requests" (second item).

## CRUD actions tested
- **Read**: List — Code, Requested By, Job ID (linked), Status, Created, Actions. 4 statuses observed: Pending, Approved, Available, Rejected. 29 pages of results.
- **Read (detail)**: Show page — "Request Information" (Status, Requested By) + "Item Asset Details," which is **item-type-dependent**:
  - For a **Door** job: Door Type (e.g. "Metal"), "LockT ype" (typo — see Issues) (e.g. "Mechanical"), Description.
  - For a **Vehicle** job: VIN, Brand, Model, Year, Plate Number, Color, Engine Number — matches `CLAUDE.md`'s description of vehicle key-code data (VIN/make/model/year) exactly, and confirms the flow also covers non-vehicle (door) code/lock requests that aren't mentioned in the BRD at all.
- **Update (fulfillment)**: "Add Code" button → "Adding Code" modal with **Code Value\*, provider\*, cost\*, Notes** — an exact live match for `CLAUDE.md`'s Code Requests description ("company sources the code → logs provider, cost, notes → sends code to technician"). Cancelled without saving.
- Create/Delete: No create action (requests originate from the technician side, not visible to this role/session) and no delete action found.

## Hidden / secondary UI elements
- Status filter dropdown: All Statuses / Pending / Approved / Available / Rejected.
- Search box ("Search by customer, job ID, or technician...").
- The Job ID and Code cells are clickable links to the Job Show page and Key Codes detail respectively, when present.

## States observed
- Empty state: Not observed (29 pages of seed data).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested (Adding Code modal cancelled, not submitted).
- Disabled elements: None found — notably, "Add Code" remains present and clickable even on an **already-Approved** request (see Issues).

## Validation & edge cases
Not tested.

## Permissions
Company Admin only, matching `CLAUDE.md` ("Company Admin: handles Code Requests"). Fully company-scoped (all rows here show technicians belonging to this company, e.g. "Eldora Zulauf").

## Issues / inconsistencies / open questions
- **[FINDING] Real bug/typo: field label reads "LockT ype"** (missing space, likely a template/i18n string concatenation bug: "Lock" + "T ype" or similar) instead of "Lock Type" — small, one-line developer fix, but a genuine live bug.
- **[FINDING] Bug: the "cost" and "Notes" fields in the "Adding Code" modal both show the placeholder text "e.g., 8472-AB"** — copy-pasted from the Code Value field's placeholder without updating for a numeric cost or free-text notes context. Confusing for whoever fills this form (looks like it's asking for a code format in a cost field).
- **[FINDING]** Field labels in the "Adding Code" modal mix casing inconsistently: "Code Value" and "Notes" are Title Case, while "provider" and "cost" are lowercase — small polish gap.
- **[FINDING]** On an already-**Approved** request (e.g., request #1), the "Add Code" button is still present and clickable, and the Show page displays no trace of the code/provider/cost that must have already been recorded to reach "Approved" status. This looks like a real gap: once a code has been added, this screen should show what was recorded, and Add Code likely shouldn't remain available (or should be relabeled "Edit Code"/similar) — worth a developer check on whether this is a display bug (data exists but isn't rendered) or a genuine missing feature.
- **[FINDING] This flow already supports two materially different asset-detail shapes** (Door: Door Type/Lock Type/Description; Vehicle: VIN/Brand/Model/Year/Plate/Color/Engine Number) depending on the job's item type — useful, concrete confirmation for designing the Code Requests / Key Codes screens, since the BRD text only describes the vehicle/VIN case.
