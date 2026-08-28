# Customers — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher/customers` (list) · `/platform.dispatcher/customers/{id}` (show)
Purpose: Full customer directory with create/read/delete access — this role is the one that actually originates customer records (matches `CLAUDE.md`: dispatcher "picks an existing customer by phone number or adds a new one").

## Navigation path
Sidebar → "Customers" (sixth item).

## CRUD actions tested
- **Create**: "Add New" button present (same modal shape presumably as the inline one on New Job — not re-opened here to avoid duplicate testing).
- **Read**: List table (Name, Email, Phone, Address, Jobs count, Actions) + a genuine **Show detail page**, explicitly subtitled **"Read-only view of customer information"** — sections: Basic Information (name), Contact Information (phone/email/address), Job History (Total Jobs, Last Job Date). This is a real, working detail view that Platform Admin's Customers page (`platform-admin/customers/customers.md`) lacks entirely.
- **Update**: No Edit action found — the Show page is explicitly labeled read-only, and no Edit link exists on the list rows either.
- **Delete**: An unlabeled icon button (no accessible name, same pattern as Job History's Delete) sits next to each row's "Show" link — presumed Delete based on positioning, not clicked (avoided per live-data caution).

## Hidden / secondary UI elements
- Row actions here use a **mixed pattern**: one labeled text link ("Show") plus one unlabeled icon button — yet another variation on the by-now-familiar inconsistent row-actions problem (at least 5 distinct conventions found across this audit so far).
- Search box ("Search by name,address,phone,..") present, not exercised.

## States observed
- Empty state: Not observed (151 pages of seed customers).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested.
- Disabled elements: Pagination Previous disabled on page 1.

## Validation & edge cases
Not tested in this pass.

## Permissions
Platform Dispatcher has Create + Read (+ presumed Delete) on Customers, but explicitly **no Update** (the Show page states this outright in its own subtitle, a good example of a role limit stated in-product rather than silently enforced) — a real, clean precedent for how the redesign should communicate read-only views (`Rule 02 · R02-4`).

## Issues / inconsistencies / open questions
- **[FINDING]** Platform Dispatcher's Customer Show page is materially richer than Platform Admin's (which has no detail view at all, see `platform-admin/customers/customers.md`) despite Platform Admin nominally having broader visibility overall — worth deciding in the design plan whether Platform Admin should also get a customer detail view, since today it's the more restricted role that has the better read experience for this entity.
- Unlabeled Delete-style icon button (no accessible name) is a minor a11y gap worth fixing regardless of the redesign — every icon-only action button found in this audit so far has lacked an accessible name.
