# Companies — Platform Admin
URL/route: `https://jobixflow.com/platform/companies` (list) · `/platform/companies/create` (add) · `/platform/companies/{id}` (show)
Purpose: Platform-wide roster of tenant companies, with per-company summary metrics and full CRUD.

## Navigation path
Sidebar → "Companies" (second item, after Dashboard).

## CRUD actions tested
- **Create**: "Add New" link → full-page form at `/platform/companies/create` (not a modal). Fields: Company Name*, Business Email*, Business Phone*, Business License Number, Country* (dropdown), **Commission*** (free text/number), Tax ID/EIN, Company Status* (active/pending/suspended/**deleted**), then a separate "Business Address" block (Street*, City*, State*, ZIP*, Country* — a **second, separate** country field from the one above), then "Company Administrator" sub-form (Admin Username*, Admin Email*, Admin Phone*) which creates the company's primary admin user in the same submission. Empty submit → native browser required-field validation (focuses first empty required field, "Company Name"); no custom inline error styling observed. Did not complete a real submission (would create live seed data) — see Open Questions.
- **Read**: List table + row "Show" action → full-page detail view at `/platform/companies/{id}` (not a modal, contradicting the "Company Details modal" noted in the old design-system screenshots — see Issues).
- **Update**: Row "Edit" action → in-place **modal** (unlike Show, which is a full page) with only two fields: Status (Active/Pending/Suspended/**Deleted**) and a "Generate Password" checkbox (checked by default). Did not save changes — closed via the × button.
- **Delete**: Row "Delete" action exists in the kebab menu (with a separator above it, visually distinguishing it as destructive). **Not tested** — this session's tool-use classifier blocked the click before any confirmation dialog could even render, correctly treating it as a live destructive action on shared seed data. Whether it triggers a confirmation dialog, and whether it performs a hard delete or something else, is unconfirmed.

## Hidden / secondary UI elements
- **Row kebab/overflow button** (rightmost "Actions" column) — click reveals a dropdown: Show / Edit / — separator — / Delete. Tested on the Ziemann-Satterfield row; not repeated on all 5 rows, but the DataTable is clearly the same reusable component per row (see `Rule 02 · R02-2`).
- **Search box** ("Search companies...") — present but not exercised with input in this pass (see Open Questions).
- **Column sort buttons** — every column header (Company, Status, Dispatchers, Technicians, Active Jobs, Completed, Revenue) is independently sortable ("Activate to sort" / "Activate to invert sorting"). Not clicked through individually here.
- **Country dropdown (Add Company form)** — over 50 options, almost all literally labeled "America Country" or "Middle East Country" (placeholder/seed values, not real country names), plus "Arab Emirates" (pre-selected by default) and "USA". This is seed/placeholder data quality, not a real country list — see Issues.

## States observed
- Empty state: Not observed — 5 seeded companies present, single page (Previous/Next both effectively inert — Previous disabled, Next disabled since there's only 1 page).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not captured — did not complete a real Create/Edit/Delete submission.
- Disabled elements: Pagination Previous/Next both disabled (only 1 page of results). Company Status combobox on the Create form opens with a disabled blank option pre-selected (forces an explicit choice, no default status).

## Validation & edge cases
- Empty-form submit on Create → native HTML5 required-field validation only (browser default), no custom app-level inline error UI observed for this form.
- Did not test duplicate company name/email, since submission was avoided to prevent creating persistent live seed data — see Open Questions.

## Permissions
Platform Admin has full CRUD here per `CLAUDE.md` ("Adds companies, monitors everything"). No permission-denied state to observe for this role on this page — Platform Admin is the only role with access to `/platform/companies*` (other roles' nav do not expose it, confirmed while mapping their sidebars).

## Issues / inconsistencies / open questions
- **[FINDING] A per-company "Commission" field already exists live** on the Add Company form, required, freestanding at the company level (not scoped to a specific technician or job). This is strong live-system evidence bearing directly on `Q-02` (platform commission, still 🔴 open) — worth flagging to the client/developer that a commission field already exists in the schema even though the mechanism it drives was never named in the 2026-08-17 follow-up. `[ASSUMPTION]` this is the same commission referenced by `FIN-W` rules; not confirmed by a developer.
- **[FINDING] Company Status includes a "deleted" option** in both the Create form dropdown and the Edit modal dropdown (as "Deleted"). This is a direct live-system conflict with `AUD-002` (delete → archive, state must read "Archived" not "Deleted"). The new archive requirement will need this status value renamed/reworked, not just a new screen bolted on.
- **[FINDING] Company Details "Show" is a full page, not a modal**, contradicting the inferred design system in `CLAUDE.md` (`design-plans/00-design-system-inferred.md` lists a "Company Details modal" as an existing screen). The design-system doc is explicitly provisional (`[FIG:...]`, pre-deletion PNGs) — this live observation supersedes it. Note for design-plans update.
- **[FINDING] Edit uses a lightweight modal (Status + password regen only) while Show is a full read page** — asymmetric pattern: you cannot edit most company fields (name, email, phone, address, commission, gateway) from this screen at all. Unclear if full-field editing exists elsewhere (not found in this pass) — flagged as open question.
- **[OPEN]** Two separate "Country" fields on the Add Company form (top-level Company Information vs. Business Address) — unclear if these are meant to hold the same value or genuinely differ (e.g., incorporation country vs. operating address country). Relevant to `Q-04` (whether the Country selector should be kept at all).
- **[OPEN]** Country dropdown data quality — the options are almost entirely placeholder strings ("America Country" / "Middle East Country" repeated 50+ times) rather than real country names. This may be seed-data noise rather than a real product issue, but it makes the field unusable as tested and should be re-verified against non-seed data before design decisions are made from it.
- **[OPEN]** Did not test Delete (blocked by session safety controls) or complete a real Create/Edit submission (to avoid permanently mutating shared seed data) — success/confirmation states, post-delete state, and real validation-error styling (vs. native browser validation) remain unverified for this page.
- **[OPEN]** No visible financial fields (wallet, gateway selection, Twilio number) anywhere on Create, Edit, or Show — consistent with `CLAUDE.md`'s "missing entirely" list, but confirms it live: company-level financial/Twilio settings do not exist yet on this screen.
- Search box present but not exercised with a query in this pass — behavior (live filter vs. submit-triggered, per-column vs. global) not verified.
