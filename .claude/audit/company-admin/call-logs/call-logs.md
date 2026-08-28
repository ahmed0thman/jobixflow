# Call Logs — Company Admin
URL/route: `https://jobixflow.com/companies.admin/calls`
Purpose: Per-call history for the company — a major, unexpected finding for the Twilio masked-calling requirement (see Issues).

## Navigation path
Sidebar → "Call Logs" (tenth item).

## CRUD actions tested
- Read: Table — Call ID, Job (linked), Status, Started At, Ended At, Technician (name + unique ID), Customer (name + **phone number**), Duration, Call Type, Recording (two icon buttons), Actions. 25 total calls for this company, 11 shown per page (single page shown, "Showing 11 of 25 calls").
- Row action kebab → **Delete only** (a separator then Delete, no Show/Edit) — the only action available on a call log row. Not tested to completion.
- **Recording playback tested**: clicked the play-icon button (`fa-circle-play`) on the first row. **Nothing observably happened** — no audio player appeared, no modal opened, no network request fired (checked both the accessibility tree and the network log), no console error either. The button appears to be visually present but **not functionally wired**.

## Hidden / secondary UI elements
- Filter bar: search ("Search by Call ID or Dispatcher..."), a **Date Range** text input (present but its interaction model — picker vs. free text — wasn't tested), a Status dropdown (All/Initiated/In Progress/Completed/Failed/Busy/No Answer), and a Duration dropdown (All Durations/Less than 30 mins/Greater than 30 mins). This is a genuinely richer filter set than most other tables in this audit — closer to what `Rule 02 · R02-5` calls for.
- Recording column shows **two** icon buttons per row (play + presumably download, not individually distinguished by accessible name) — neither tested to completion for the second icon.

## States observed
- Empty state: Not observed (25 seed calls for this company).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: None found.

## Validation & edge cases
Not tested.

## Permissions
Company-scoped (25 calls, all tied to jobs for this company). Matches `CLAUDE.md`'s "Company Admin: sees... call recordings."

## Issues / inconsistencies / open questions
- **[FINDING — major, contradicts a stated premise] This page proves real Twilio call-logging infrastructure already exists in the live product.** Call IDs are genuine-format Twilio Call SIDs (`CA` + 32 hex characters, e.g. `CA2759c72b502c10390b60202d2597d7c6`), and every row carries a `Call Type` value of `technician_to_client` — a literal directional-call-type enum value. `NEW-REQUIREMENTS.md §2` states plainly: *"the entire masked-communication layer — nothing like it exists in the live system today."* That statement needs revisiting: **basic call logging with real Twilio SIDs already exists**, even though the masking/proxy-number/webhook-routing logic described in the requirements clearly does not (the Customer column shows what appears to be the **customer's real phone number**, `+201004065031`, not a masked Twilio proxy number — consistent with no masking being live yet). Recommend flagging this distinction precisely to the developer: the call-logging *data model and UI* have a head start; the *masking/routing behavior* is the actual net-new work. This could materially change scoping/estimation for `NEW-REQUIREMENTS.md §2`.
- **[FINDING] The Recording play button does not appear to be functionally wired** — clicking it produced no player, no modal, no network request, and no error. Either the underlying recording URL is empty for this seed data (plausible, since this may predate real Twilio recording storage) or the button's handler isn't implemented. Worth a developer check before assuming call-recording playback is a solved problem — it may need real implementation work even though the button already exists visually.
- **[OPEN]** Whether the customer phone number shown here (`+201004065031`) is intentionally visible to Company Admin (plausible — Company Admin isn't restricted by `COM-001`/`COM-002`, which govern technician↔customer visibility specifically) or is a sign that masking genuinely isn't implemented at all yet (also plausible, and expected pre-Twilio-integration) should be treated as the same open item as the previous finding, not a separate concern.
- This page's filter set (search + date range + status + duration) is one of the better examples of `Rule 02 · R02-5`-style filtering already live in the product — worth using as a positive reference pattern for the reusable Filter component, alongside the negative examples (Audit Log's single search box) found elsewhere.
