# Notifications — Platform Admin
URL/route: `https://jobixflow.com/platform/notifications`
Purpose: Feed of system-generated notifications (job lifecycle events) for the logged-in Platform Admin.

## Navigation path
Sidebar → "Notifications" (sixth item), which also carries a live unread-count badge visible from every page.

## CRUD actions tested
- Create: N/A — notifications are system-generated, not user-authored.
- Read: Feed list, each item showing an emoji-tagged title (e.g. "Work in Progress ⚙️", "Technician Arrived 🙋‍♂️", "Job Cancelled ⛔", "Job Completed ✔️", "Technician Assigned"), a one-line description naming the technician and Job # or job event, a relative timestamp ("52 days ago"), and a small status-label chip.
- Update: "Mark as read" tested on the first item — confirmed functional: the "Unread (52)" tab count and the sidebar "Notifications 52" badge both dropped to 51 immediately, in sync, without a page reload.
- Delete: "Delete" button present per item plus a bulk "Delete read" button — **not tested**, avoided per the same live-data caution applied elsewhere (though notification deletion is lower-stakes than company/job deletion, so this is a softer avoidance than those cases).

## Hidden / secondary UI elements
- **Two view tabs**: "All (52)" / "Unread (52)" — count-bearing tabs, functioning like the quick-filter chip pattern seen on Jobs but with real live counts (unlike the Jobs chips, which show no counts — see `jobs.md` Issues).
- **Bulk actions**: "Mark all as read" and "Delete read" buttons, top-right, apply to the whole feed rather than a per-row selection model (no checkboxes were present — this is an all-or-nothing bulk action, not a select-then-act pattern).
- **Per-item action row**: "Mark as read" / "Delete" / "View" — three text buttons per notification, no kebab/overflow menu (a third row-action pattern, distinct from both Companies' kebab and Countries' inline-link style — three different row-action conventions now observed across three pages).
- **"View" button** navigates directly to the referenced job's Show page (`/platform/jobs/{id}`) — confirmed by testing on the first notification ("yasmen hosam started working on Job #22618" → navigated to `/platform/jobs/125`, i.e., the internal job ID, not the display Job # shown in the notification text — worth noting the notification shows a different job-number scheme than the URL/internal ID).
- **"Load More" button** at the bottom of the feed — pagination is click-to-load-more, not numbered pages (a third pagination pattern in this audit, alongside numbered pagination on Companies/Jobs/Countries and none needed here at only 52 items). Not clicked through to see if it appends or replaces.

## States observed
- Empty state: Not observed (52 seeded notifications).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: "Mark as read" produced an immediate, silent state change (badge counts updated) with no toast/confirmation message observed — unclear if a toast fired and was missed, or if this action is genuinely silent.
- Disabled elements: None found.

## Validation & edge cases
N/A — no form inputs on this page.

## Permissions
Notifications are personal to the logged-in user (Platform Admin sees platform-level events: technician/job status changes across all companies, consistent with the monitoring role). Not tested whether notification content itself is company-scoped or genuinely platform-wide (the sample technician name "yasmen hosam" recurred across nearly every visible notification, suggesting this may be dominated by one seed technician rather than being a representative cross-company sample).

## Issues / inconsistencies / open questions
- **[FINDING] A third distinct row-actions convention** (plain text buttons: Mark as read / Delete / View) appears here, adding to the Companies-kebab and Countries-inline-link patterns already found. Three different conventions across three pages so far — strong, concrete evidence for why the reusable Actions master component (`Rule 02 · R02-2`) is needed, and a reminder that "extend the existing product" (`R02-1`) will require picking **one** of these existing patterns as canonical rather than inventing a fourth.
- **[FINDING]** "Mark as read" updates both the tab count and the sidebar badge live and in sync — a good, working example of state propagation the redesign should preserve.
- **[OPEN]** No toast or confirmation message was observed after marking a notification as read — unclear if this is by design (silent, ambient state change) or if a toast exists but wasn't caught. Relevant to `Rule 02 · R02-3`'s mandatory success/confirmation state — flag for developer confirmation before assuming "silent" is intentional.
- **[OPEN]** The notification's displayed "Job #" (e.g. "#22618") does not match the internal job ID used in its URL (`/platform/jobs/125`) — worth understanding which number is customer/company-facing before designing any screen that shows both.
- Did not test Delete, Delete read, or Load More's pagination behavior (append vs. replace) in this pass.
