# Active Jobs (Jobs Management) — Company Dispatcher
URL/route: `https://jobixflow.com/companies.dispatcher/jobs` (list) · `/companies.dispatcher/jobs/{id}` (show, presumed) · `/jobs/{id}/chat` (chat)
Purpose: This company's full job table (already-assigned-to-company jobs, i.e. everything past the Incoming Jobs stage), for monitoring and per-job chat.

## Navigation path
Sidebar → "Active Jobs" (second item).

## CRUD actions tested
- Read: Table — Job ID+date, **Customer Phone** (real number, e.g. `+1-469-868-6988`), Technician, Service (the buggy Service-Type field, showing person names again), Amount, Priority, Status, Actions. Filters: search, Status dropdown (a shorter list than other roles' Jobs pages — starts at "Assigned to Company," correctly excluding "New Job" since those live on Incoming Jobs instead), Priority dropdown.
- Row kebab → Show / Chat / (separator, list likely continues below the fold — not fully captured). Same kebab-with-Show/Chat pattern as other Jobs pages in this audit.

## Hidden / secondary UI elements
Filter set (search + Status + Priority) — a third status-dropdown scope variant across the three Jobs pages mapped so far (Platform Admin's full 12-value list, Company Admin's full 12-value list, this role's shorter 8-value list starting post-"New Job").

## States observed
- Empty state: Not observed (19 pages of results).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: None found.

## Validation & edge cases
Not tested.

## Permissions
Company-scoped. Status filter correctly starts from "Assigned to Company" rather than including "New Job," consistent with this being the post-intake job list (New Job-status jobs live on Incoming Jobs instead) — a sensible, working example of role-appropriate status scoping.

## Chat — empty state (bonus finding)
Opened the chat for a different job (`#47377`, "company get code" status) and found a genuine **chat empty state**: "0 active chat," a `paragraph`-level "No Internal Messages," and "Select Chat from List" placeholder text, with a "Start New Chat" button still present and enabled. Confirms (a) Company Dispatcher can actively initiate chats — matching the allowed-pairs list in `CLAUDE.md` — and (b) a real, working empty state exists for chat, satisfying `Rule 02 · R02-3`'s mandatory empty-state requirement for this surface. Screenshot 03.

## Issues / inconsistencies / open questions
- **[FINDING]** The **Customer Phone** column shows the real customer phone number directly in this table. This doesn't violate any stated invariant today (`COM-001`/`COM-002` govern technician↔customer visibility specifically, not Company Dispatcher), but it's worth flagging as an open design question: once Twilio masking ships, should Company Dispatcher continue to see the real number here, or should this column show the masked/Twilio number too? `CLAUDE.md` doesn't explicitly say either way for this role — recommend adding as a new open question rather than assuming.
- **Seventh confirmed occurrence of the Service Type bug**, this time in the "Service" column of this table.
- Row-actions kebab pattern is consistent with the Show/Chat/(more) convention already seen on Platform Admin's and Company Admin's Jobs pages — a positive consistency note, unlike the fragmented patterns found on other entity types in this audit.
