# Settings — Company Admin
URL/route: `https://jobixflow.com/companies.admin/settings/1/edit`
Purpose: Company profile editing — name, contact, address, status. **No financial, gateway, or Twilio settings anywhere.**

## Navigation path
Sidebar → "Settings" (last item).

## CRUD actions tested
- Read/Update: Single form, pre-filled with this company's real data — "Company Information" (Company Name\*, Business Email\*, Business Phone\*, Country\* [same messy seed list], Tax ID/EIN, Company Status\* [Active/Pending/Suspended/**Deleted**]) and "Business Address" (Street\*, City\*, State\*, ZIP\*). One "Save Changes" button for the whole form. Not submitted, to avoid altering live seed company data.
- Create/Delete: N/A.

## Hidden / secondary UI elements
None found — single flat form, no tabs or sub-sections.

## States observed
- Empty state: N/A — always pre-filled with the company's existing data.
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested.
- Disabled elements: None found (the Country dropdown's blank first option is disabled, matching the Create Company pattern from Platform Admin).

## Validation & edge cases
Not tested.

## Permissions
Company Admin can edit their own company's profile only (this is the company-scoped equivalent of Platform Admin's Company Edit modal, but as a full page with more fields, not a lightweight Status-only modal).

## Issues / inconsistencies / open questions
- **[FINDING — confirms the biggest gap in the new requirements] This is the entirety of Company Settings today: no gateway selection, no Twilio number/subscription field, no commission %/dispatch fee/gateway fee defaults, no data-retention/archive-age configuration.** Every financial and communications setting named in `NEW-REQUIREMENTS.md §3.3` (commission %, dispatch fee, gateway fee, gateway selection, platform-vs-own-gateway toggle, own Twilio credentials) is completely absent — confirming, first-hand, that this is genuinely greenfield design work with no existing screen to extend. This matches `CLAUDE.md`'s "missing entirely" list but is now confirmed by direct inspection rather than inference.
- **[FINDING]** Company Status again includes "Deleted" as a selectable value here too — the same live conflict with `AUD-002` (archive, not delete) already flagged multiple times in this audit (Platform Admin's Companies Create/Edit). This is now confirmed present in **at least three** separate places (Platform Admin Companies Create, Platform Admin Companies Edit, and here) — strong signal that fixing this requires a single shared status-enum change, not three separate screen edits.
