# Customers — Company Admin
URL/route: `https://jobixflow.com/companies.admin/customers`
Purpose: Company-scoped, fully read-only customer directory.

## Navigation path
Sidebar → "Customer" (seventh item — same singular-label inconsistency already flagged for Platform Admin).

## CRUD actions tested
- Create: No "Add" button — read-only for this role, same as Platform Admin's Customers page (not the fuller Create/Read/Delete access Platform Dispatcher has).
- Read: Table — Customer Name, Email, Phone, Address, Jobs (count). No Actions column at all, same as Platform Admin's version. 29 pages, company-scoped.
- Update/Delete: Not available.

## Hidden / secondary UI elements
Search box present, not exercised. No row actions or detail view of any kind.

## States observed
- Empty state: Not observed.
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: Pagination Previous disabled on page 1.

## Validation & edge cases
N/A.

## Permissions
Fully read-only, company-scoped, matching the pattern already documented for Platform Admin's Customers page rather than Platform Dispatcher's fuller-access version.

## Issues / inconsistencies / open questions
Same "Customer" singular-label inconsistency and lack of a detail view already flagged in `platform-admin/customers/customers.md` — not re-detailed here.
