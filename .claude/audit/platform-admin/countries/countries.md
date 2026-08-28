# Countries — Platform Admin
URL/route: `https://jobixflow.com/platform/countries`
Purpose: Manage a predefined list of "Countries" used as a lookup value across company creation and (per its subtitle) jobs. Per-country config for a call and WhatsApp provider.

## Navigation path
Sidebar → "Countries" (third item, between Companies and Reports).

## CRUD actions tested
- **Create**: "Add Country" button → modal "Add New Country" with fields: Country Name* (text, not a real ISO country picker), Country Code, Call Provider (free text), Whatsapp Provider (free text). Cancelled without submitting.
- **Read**: List table — columns Code, Country Name, Call Provider, Whatsapp Provider, Companies (count), Jobs (count), Users (count), Actions. 9 pages of results (not just a handful) — seed data has many rows.
- **Update**: Row "Edit" link → modal "Edit Country" with the same 4 fields (Name, Code, Call Provider, Whatsapp Provider) pre-filled from the row. Tested on the first "Middle East Country" row — Call Provider and Whatsapp Provider were both empty despite the column existing. Closed without saving.
- **Delete**: Row "Delete" link present — not tested (destructive, avoided per the same reasoning as Companies).

## Hidden / secondary UI elements
- **Row-level Edit/Delete** are plain text links directly in the Actions cell (not a kebab menu here, unlike Companies) — an inconsistency in the row-actions pattern between this table and the Companies table, worth resolving in the reusable Actions component (`Rule 02 · R02-2`).
- **Search box** ("Search by name") — present, not exercised with a query.
- **Column sort buttons** on all 7 data columns — not exhaustively tested.
- 9-page pagination confirms this is a substantial seed list, not a short handful of real countries — consistent with it being auto-generated placeholder data (see Issues).

## States observed
- Empty state: Not observed (9 pages of seed rows present).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not captured (no real Create/Edit/Delete submitted).
- Disabled elements: Pagination "Previous" disabled on page 1 (correct).

## Validation & edge cases
Not tested — avoided submitting to prevent mutating shared seed data. Country Name is marked required (*) on Add; Code/Call Provider/Whatsapp Provider are optional.

## Permissions
Platform Admin only — no other role's sidebar exposes a Countries link (confirmed while mapping other roles' navs).

## Issues / inconsistencies / open questions
- **[FINDING] This entire module is the live remnant of the cancelled UAE/Middle East expansion referenced by `Q-04`.** Every seeded row is literally named "America Country" or "Middle East Country" (placeholder labels, not real country names), and the schema carries a **per-country** Call Provider and WhatsApp Provider field. This is a materially different communications model than the one described in the new requirements: `CLAUDE.md` and `NEW-REQUIREMENTS.md §2` are explicit that **each company** supplies its own Twilio number/subscription/credentials directly — nothing is configured at country level. If this Countries → Call/WhatsApp Provider config is still wired to anything live, it directly conflicts with the new per-company Twilio ownership model and should be flagged to the developer, not just designed around. Strengthens the case for resolving `Q-04` (recommend: remove or repurpose this screen once the country selector question is settled) rather than leaving it as a dangling legacy admin page.
- **[FINDING]** Row actions on this table are plain inline text links (Edit / Delete), not the kebab/overflow pattern used on Companies. Both patterns exist live in the current product — the reusable Actions master component (`R02-2`) will need to normalize this, and the designer should decide which pattern is canonical rather than preserving both.
- **[OPEN]** Could not determine whether "Call Provider" / "Whatsapp Provider" are still read anywhere in the live product (e.g., during job/company creation) or are dead fields from the cancelled UAE plan — would need developer confirmation before deciding whether this screen carries forward into the new design at all.
- No financial or Twilio-number fields here beyond the two provider-name text boxes — consistent with "missing entirely" list in `CLAUDE.md`.
