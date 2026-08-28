# Customers — Platform Admin
URL/route: `https://jobixflow.com/platform/customers`
Purpose: Flat, cross-company directory of every customer who has had a job created for them.

## Navigation path
Sidebar → "Customer" (seventh item — singular label, inconsistent with the plural "Companies"/"Jobs"/nav item naming convention elsewhere, see Issues).

## CRUD actions tested
- Create: No "Add" button anywhere on this page — consistent with `CLAUDE.md` (customers are added as part of job creation by a dispatcher, not directly by Platform Admin).
- Read: Table only — Customer Name, Email, Phone, Address, Jobs (count). No detail/show view: clicking a row does nothing (tested on the first row, "Abbie Witting" — no navigation, no expansion).
- Update: None available.
- Delete: None available.

## Hidden / secondary UI elements
- **No Actions column at all** — the only page mapped so far with zero row-level actions of any kind (not even a "View"), a stronger version of the pattern already seen on the Dashboard's Active Jobs table.
- **Search box** ("Search by name,address,phone,..") present, not exercised with input in this pass.
- Column sort buttons present on all 5 columns, not exhaustively tested.

## States observed
- Empty state: Not observed (151 pages of seed customers).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: Pagination Previous disabled on page 1 (correct).

## Validation & edge cases
N/A — no inputs beyond search, not tested.

## Permissions
Platform Admin sees every customer across every company, with real phone/email/address — consistent with the cross-tenant monitoring role described in `CLAUDE.md`. No company-scoping/filter column is visible on this table, so it isn't possible from this screen alone to tell which company a given customer's job(s) belong to — a real limitation once company-sourced customers (multi-tenancy requirement) exist, since origin/company would become essential context here.

## Issues / inconsistencies / open questions
- **[FINDING]** This table has no way to see which company a customer belongs to, or filter by company — a gap that will matter once company-sourced customers exist (`TEN-001`/`TEN-002`): a Platform Admin reviewing this list won't be able to tell platform-sourced customers from company-sourced ones, or scope the view to one company, without design changes here.
- Nav label reads "Customer" (singular) while every sibling nav item is plural ("Companies," "Jobs," "Countries") — small copy inconsistency worth a one-line fix regardless of the redesign.
- No detail view exists for an individual customer (e.g., to see their full job history in one place) — the "Jobs" column shows only a count, not a link. Worth considering for the design plan even though it's not a stated new requirement.
