# Job History — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher/jobs` (list) · `/platform.dispatcher/jobs/{id}/edit` (edit) · `/jobs/{id}/chat` (chat)
Purpose: This role's view of all jobs (platform-wide, same 1051 total as Platform Admin's Jobs page) — but rendered as a **card list**, not a table, and with a materially different action set (Edit, not Show).

## Navigation path
Sidebar → "Job History" (fourth item).

## CRUD actions tested
- Create: N/A here (see `new-job.md`).
- Read: Card-per-job layout: name/priority-pill/status-pill header, Customer Phone / Address / Company / Created meta lines, item-type tag, price, and a "show chat" link. **1051 Jobs, showing 15 per page**, 71 pages total.
- **Update**: An "edit" link (pencil icon, lowercase label) appears **only on cards whose status is "New Job"** (confirmed: present on "Flo Tromp" and "Kacie Keebler," both status "New Job"; absent on every other status observed) — this is a real, working example of `JOB-005`'s "guided, sequential action" principle in practice: once a job leaves the New Job state, the dispatcher can no longer freely edit its core fields. Opened the Edit Job form for job 1044 (Flo Tromp) — same field set as Create (`new-job.md`), pre-filled with existing values. **Found a real value-loading bug**: the job-history card shows priority "High" for this job, but the Edit form loads with Priority defaulted to "Low" — the saved priority is not being read into the edit form correctly (see Issues).
- **Delete**: An unlabeled icon button (no accessible name) is present per card. Testing it on the first card ("Zienab Y," status "Technician On The Way") triggered a real server-side rejection: **"Job can not Delete after change status!"** — confirmed this is the Delete action, and confirmed it is **status-gated**: a job can only be deleted while still "New Job." This is a live, working example of business logic close to the spirit of `JOB-006` ("must reach completion or receive an explicit cancellation... never simply deleted mid-flight") — worth noting to the developer as an existing partial implementation to build on, not something the redesign needs to invent from scratch. Did not test deleting an actual "New Job"-status record, to avoid destroying real seed data.

## Hidden / secondary UI elements
- **Status filter dropdown unexpectedly mixes two dimensions**: "All Status" plus the 11 job-status values, **followed directly by "Low," "Medium," "High"** (the Priority values) in the same combobox. This is either a genuine UI bug (two filter axes merged into one control) or an intentional-but-confusing combined filter — needs developer clarification, but as observed it reads as broken design, not a deliberate compound filter (no visual grouping/separator distinguishes the two value families).
- **"show chat" link** per card, going to `/jobs/{id}/chat` (shared route, same as Platform Admin's).
- Cards missing a Company value show a blank "Company:" line (e.g., "Zoey Hand," "Donny Schumm") rather than a placeholder like "Unassigned" — a minor empty-value polish gap, similar to the blank Last Login cell found on Platform Admin's Users page.

## States observed
- Empty state: Not observed (1051 seed jobs).
- Loading state: Not observed.
- Error state: **Captured** — the Delete-blocked business-rule error ("Job can not Delete after change status!") renders as a dismissible red banner, same visual pattern as the New Job form's validation errors.
- Success/confirmation state: Not captured.
- Disabled elements: The Delete button is not visually disabled for non-"New Job" cards — it's present and clickable, and only fails after a server round-trip, rather than being disabled/hidden upfront with a reason. This is a **violation of the spirit of `Rule 02 · R02-4`** ("actions a role cannot perform are absent or disabled with a stated reason — never present and silently failing") — here it's present and *does* eventually state a reason, but only after a wasted click and full request round-trip, not proactively.

## Validation & edge cases
Confirmed the Delete-status-gate business rule live (see above). Did not test Edit form submission.

## Permissions
Platform Dispatcher has read + conditional edit + conditional delete on jobs (edit/delete only available pre-assignment, i.e., "New Job" status) — a real, useful business rule to carry into the redesign's guided-status-transition model (`JOB-005`).

## Issues / inconsistencies / open questions
- **[FINDING] Real bug: Edit Job form does not correctly load the job's saved Priority value.** Job 1044 ("Flo Tromp") shows "High" priority on the card list but the Edit form opens with "Low" pre-selected. This would silently downgrade the job's priority to Low if the dispatcher saved the form without noticing and re-selecting High. Recommend flagging to the developer as a data-integrity risk, separate from the design work.
- **[FINDING] Real bug: `ReferenceError: $ is not defined` fires on every Edit Job page load** (jQuery not loaded/available at the point some inline script runs) — an uncaught JS error on page load. Functional impact on this specific page wasn't otherwise obvious (the form rendered and was fillable), but worth a developer heads-up regardless.
- **[FINDING]** Delete is present-and-clickable on every job regardless of status, only failing with a business-rule error after a full request round-trip — the redesign should proactively disable/hide Delete once a job leaves "New Job" status (consistent with `Rule 02 · R02-4`'s "absent or disabled with a stated reason" principle) rather than reproducing the current present-then-fail pattern.
- **[FINDING]** The combined Status+Priority filter dropdown is a real UI oddity worth flagging — recommend the reusable Filter component (`Rule 02 · R02-2`) treat these as two clearly separate filter dimensions, not one merged list.
- **[FINDING]** This page uses a **card-list layout** for the same underlying "Jobs" entity that Platform Admin renders as a **table** — a third distinct list-presentation pattern in this audit (table vs. card-list vs. Notifications' feed-list). Worth a deliberate decision in the redesign about whether Jobs should look the same across roles or intentionally differ by role's information needs.
- Confirmed: chat composer is **enabled** (not disabled) for Platform Dispatcher on the per-job chat page — correctly differentiates from the read-only Platform Admin/Company Admin roles per `ROL-004`/`ROL-005`. A "Start New Chat" button also exists here (not seen on the Platform Admin chat view), suggesting the dispatcher can initiate additional threads beyond the default one.
