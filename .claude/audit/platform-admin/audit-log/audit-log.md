# Audit Log — Platform Admin
URL/route: `https://jobixflow.com/platform/audits`
Purpose: Global CRUD activity log across the platform.

## Navigation path
Sidebar → "Audit Log" (ninth item).

## CRUD actions tested
- Create: N/A — system-generated log entries only.
- Read: Table — User, Model, Action, Changes, Description, Created At, Actions. **1,660 pages** of results at default (no filter), confirming this dataset is already large in seed form and will only grow, matching the developer's stated concern (`Rule 02 · R02-5`).
- Update: N/A — log entries are immutable records.
- Delete: Row "Delete" link present per entry — not tested, same live-data caution as elsewhere (deleting audit records is also conceptually questionable regardless — an audit log arguably shouldn't be user-deletable at all, see Issues).

## Hidden / secondary UI elements
- **Single global search box** ("Search by model,user,action,..") — confirmed this is the **only** filtering mechanism on the page. No per-column filters, no date range, no company filter, no user-type filter anywhere on screen — this is the live confirmation of exactly the gap `CLAUDE.md` and `Rule 02 · R02-5` describe.
- **"Changes" column** is genuinely populated for Update actions with a real before→after diff string (e.g. `final_price : 103 → 446.6025`), and shows `-` for Create actions. Confirmed by searching "Updated" (filtered 1,660 pages down to 170). This is a working, useful field the redesign should preserve, just needs better presentation at scale (a raw string diff won't scale to complex objects).
- Row Actions column contains only "Delete" (no View/Edit, which makes sense for an immutable log) — yet another distinct row-action convention (single-link, not even a pair) for the growing tally of inconsistent action patterns across this audit.

## States observed
- Empty state: Not observed (1,660 pages of seed data).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: Pagination Previous disabled on page 1 (correct).

## Validation & edge cases
Search-then-Enter behavior confirmed functional (same pattern as Jobs — not live-filtered, requires Enter).

## Permissions
Platform Admin only — no other role's sidebar exposes an Audit Log link (confirmed while mapping other roles).

## Issues / inconsistencies / open questions
- **[FINDING] This page is the direct, live confirmation of the exact problem statement in `CLAUDE.md` and `Rule 02 · R02-5`**: one global search box, no company column, no user-type column, no date range, already at massive scale (1,660 pages) in seed data alone. No new information beyond what the requirements docs already state, but useful as ground truth for the redesign brief.
- **[FINDING]** Every visible row shows `User: System` — the seed data appears to be entirely system-attributed (bulk-seeded records), not real human actions. This made it impossible to observe what a genuinely human-attributed row looks like (would it show the acting user's name, role, and company inline?) — worth flagging as an audit gap: a representative "real user" audit row was not found in this pass, needs re-verification against non-seed data before finalizing the redesign of the User/Actor column.
- **[FINDING]** "Delete" exists as a row action on individual audit log entries. This is worth flagging as a genuine design/product question independent of the redesign: should an audit log — whose entire purpose is tamper-evidence — be user-deletable at all? Not something to silently carry forward without asking; recommend raising with the developer/client rather than assuming it's intentional.
- **[OPEN]** `AUD-001`'s new scope rule (excluding companies fully self-sufficient on their own gateway + Twilio) has no visible representation on this screen at all — there's no company column to scope by in the first place, so it's impossible to tell from the UI today whether any exclusion logic is already applied server-side. Would need developer confirmation.
