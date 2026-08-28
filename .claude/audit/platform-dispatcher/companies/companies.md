# Companies — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher/companies`
Purpose: Read-only company directory, used to know which companies exist when assigning a job.

## Navigation path
Sidebar → "Companies" (fifth item).

## CRUD actions tested
- Create: No "Add" button — confirmed absent, matching `CLAUDE.md` (dispatcher "does not add companies or technicians").
- Read: Table — Company Name, Company ID (e.g. `COMP_118`), Company Email, Country, Status, Active Technicians, Active Jobs, Actions (Show only). All 5 seed companies shown on one page.
- Update/Delete: No Edit/Delete actions anywhere on this page — **read-only**, unlike Platform Admin's Companies page which has full kebab-menu CRUD. Confirmed by the Actions column containing only a plain "Show" link, no kebab/overflow.

## Hidden / secondary UI elements
- **Two separate filter dropdowns** (Status: All/Active/Pending/Suspended/**Deleted**; Country: same messy seed list as elsewhere) plus a search box — this is actually a **richer filter set than Platform Admin's equivalent Companies page**, which only had a plain search box. Worth noting for the reusable Filter component: different roles currently have inconsistent filter richness on what is conceptually the same list.
- Company Status filter again includes "Deleted" as an option — consistent with the same `AUD-002` conflict already flagged on Platform Admin's Companies page.
- Column sort buttons on every column, not exhaustively tested.

## States observed
- Empty state: Not observed (5 seed companies).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: Pagination Previous/Next both disabled (single page).

## Validation & edge cases
Not tested.

## Permissions
Read-only for Platform Dispatcher — no create/edit/delete, matching `CLAUDE.md`. This is a real, clean example of the same entity (Companies) being **fully read-only for one role and fully CRUD for another**, purely via action-set differences on an otherwise-identical table — a good reference pattern for how the reusable DataTable/Actions components should express per-role permission differences (`Rule 02 · R02-4`).

## Issues / inconsistencies / open questions
- **[FINDING]** Filter richness is inconsistent for the same underlying entity across roles: this page has Status + Country dropdown filters, while Platform Admin's Companies page (`platform-admin/companies/companies.md`) has only a search box. The reusable Filter component should standardize this rather than let it vary by role/screen.
- Same Country-dropdown data-quality issue noted throughout this audit (see `platform-admin/countries/countries.md`).
