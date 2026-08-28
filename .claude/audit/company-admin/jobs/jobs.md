# Jobs Management — Company Admin
URL/route: `https://jobixflow.com/companies.admin/jobs` (list) · `/companies.admin/jobs/{id}` (show) · `/companies.admin/jobs/{id}/technician_ledger` (**broken**, see Issues)
Purpose: Company-scoped job list and detail — same underlying Job entity as Platform Admin's Jobs page, company-filtered.

## Navigation path
Sidebar → "Jobs" (sixth item).

## CRUD actions tested
- Read: Table — Job ID+date, Item, Location (free-text address, confirming `JOB-004`), Assigned To, Amount, Priority, Status, Actions. Filters: search, Status dropdown (same 12-value enum as Platform Admin's), and a **Time** dropdown (All Time/Today/This Week/This Month) not present on Platform Admin's equivalent page.
- Row kebab → **Show / Chat / "technician ledger"** (no Delete here, unlike Platform Admin's Jobs page — company-level role has one fewer destructive action). "Show" opens the same rich job detail page seen from Platform Admin (Job Information, Pricing Details, Payment Details, Customer Details, Vehicle Details, Status Timeline) — not re-documented field-by-field here, see `platform-admin/jobs/jobs.md`.
- **"technician ledger" tested — confirmed broken**: navigating to `/companies.admin/jobs/{id}/technician_ledger` returns a **hard 500 Internal Server Error** on every job tried (tested job IDs 1 and 5, both failed identically). This is a real, reproducible server crash, not a one-off.

## Hidden / secondary UI elements
- Location column text shows odd mid-word line-wrap artifacts (e.g., "Hacke ttfurt" instead of "Hackettfurt") — likely a CSS/JS text-truncation bug rather than real data corruption, but worth a developer check.
- The 500 error page's "Back to Home" link points to `/notifications/unread`, not the dashboard — a small but real broken-link bug on the error page itself.

## States observed
- Empty state: Not observed.
- Loading state: Not observed.
- Error state: **Captured** — the 500 Server Error page for the broken technician ledger route (generic Laravel-style "500 / Server Error" page, no company-specific error handling/branding).
- Success/confirmation state: N/A.
- Disabled elements: None found.

## Validation & edge cases
Not tested.

## Permissions
Company-scoped job list (29 pages here vs. 151 on Platform Admin's cross-company equivalent). No Delete action for Company Admin on jobs (Platform Admin's Jobs page has one) — a real, sensible permission difference.

## Issues / inconsistencies / open questions
- **[FINDING — major, highest-priority developer flag from this entire audit] A per-job "Technician Ledger" feature already exists as a linked route in the UI (`/companies.admin/jobs/{id}/technician_ledger`) but crashes with a hard 500 Server Error on every job tested.** This is direct, concrete evidence that **someone has already started building the per-job financial ledger** described throughout `NEW-REQUIREMENTS.md §3` (Technician Account: commission, cash/card earnings, dispatch fees, deductions, backcharges, final balance) — the link, the route, and presumably a partial controller/view already exist, but it's non-functional. This is enormously relevant to scoping the financial system design: (a) it means the backend team has already started this work and a designer should coordinate rather than design in a vacuum, and (b) it's a live bug blocking real company admins today that should be flagged to the developer **immediately**, independent of and prior to any redesign timeline. Recommend this be the single most urgent item raised from this audit.
- **[FINDING]** Company Admin's row actions lack "Delete" (present on Platform Admin's equivalent Jobs page) — a sensible, real permission difference worth preserving in the redesign.
- **[FINDING]** The "Time" filter dropdown (All Time/Today/This Week/This Month) exists here but not on Platform Admin's Jobs page — another example of inconsistent filter richness across roles for the same underlying entity (see similar finding in `platform-dispatcher/companies/companies.md`).
