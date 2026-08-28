# Audit Log — Company Admin
URL/route: `https://jobixflow.com/companies.admin/audits`
Purpose: Same columns as the platform-level Audit Log (User, Model, Action, Changes, Description, Created At, Actions) — but here scoped to **real, human-attributed activity for this company**, not seed-generated "System" rows. Much more informative than the platform-level version audited earlier.

## Navigation path
Sidebar → "Audit Log" (ninth item).

## CRUD actions tested
- Read: Confirmed **company-scoped** — 31 pages here vs. 1,660 platform-wide, and every row is attributed to a real actor (e.g. "Leone D'Amore," a technician at this company), not "System."
- Row action button present (same kebab-with-Delete pattern presumed, not re-opened here — already well documented at the platform level).

## Hidden / secondary UI elements
Same single global search box as the platform-level version — same lack of per-column filters/date range (see `platform-admin/audit-log/audit-log.md` for the full critique, not repeated here).

## States observed
- Empty state: Not observed.
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: Pagination Previous disabled on page 1.

## Validation & edge cases
Not tested.

## Permissions
**Confirmed company-scoped in practice** — this is good, concrete evidence that `TEN-002`-style tenant isolation is already enforced for the Audit Log, at least for the "which company's rows are visible" dimension (still no per-company **column** exists in the table itself, matching `CLAUDE.md`'s stated gap — but the underlying query is already scoped correctly for this role).

## Issues / inconsistencies / open questions
- **[FINDING — significant, corroborates the Call Logs finding] Real audit rows reveal a `twilio_identity` field already assigned per technician** (e.g. `"twilio_identity : → technician_20"`, recorded as a field update on a User record). Combined with the real Twilio Call SIDs found in `company-admin/call-logs/call-logs.md`, this is strong evidence that **Twilio Client/Voice SDK identity provisioning already exists at the user/technician level** in the live product — not just call logging, but actual per-technician Twilio identity assignment. This further strengthens the recommendation to have the developer clarify exactly how much of the masked-calling infrastructure (`NEW-REQUIREMENTS.md §2`) already exists vs. needs building, since it appears to be more than "nothing" at the data-model level even though the customer-facing masking/routing behavior isn't there yet.
- **[FINDING] Real audit rows also show `fcm_token` field updates on User records** — confirms push-notification infrastructure (Firebase Cloud Messaging) already exists at the user level, relevant context for the Notifications feature even though not a stated new requirement.
- **[FINDING] Real GPS coordinates are logged on `JobRequest` status transitions** (e.g. `"status : arrived → in_progress - latitude : → 31.0645206 - longitude : → 31.4039651"`) — direct, concrete confirmation that `LOC-002` (location recorded on technician arrival ping) is already live and working, not just a planned behavior. Good positive reference point for the map/location design work.
- **[FINDING]** `KeyCode` and `KeyCodeUsage` both appear as distinct tracked model types in the real audit trail — confirms the Key Codes feature (already documented in `company-admin/key-codes/key-codes.md`) has real, structured backing data beyond just the list screen.
