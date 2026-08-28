# Notifications — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher/notifications`
Purpose: Same notification feed pattern as Platform Admin's (see `platform-admin/notifications/notifications.md` for the full write-up — not duplicated here).

## Navigation path
Sidebar → "Notifications" (eighth item).

## CRUD actions tested
Not re-tested individually (Mark as read / Delete / View already confirmed functional on Platform Admin's identical UI). Visual layout, tabs (All/Unread), and bulk actions (Mark all as read / Delete read) are all present and identical in structure.

## Hidden / secondary UI elements
Identical structure to Platform Admin's Notifications page — same three-button-per-item pattern, same "Load More" pagination.

## States observed
Not independently re-verified.

## Validation & edge cases
N/A.

## Permissions
Personal to the logged-in user, same as Platform Admin.

## Issues / inconsistencies / open questions
- **[FINDING, resolved]** The notification feed content is identical to Platform Admin's — same 51 items, same Job numbers, same "yasmen hosam" technician name. Initially raised as an open question about shared vs. per-user notifications. **Resolved** in `company-dispatcher/notifications/notifications.md`: a Company Dispatcher account shows a genuinely different count (22), confirming notifications are per-user — the two platform-level accounts matching was coincidental (both likely recipients of the same seed events), not evidence of a shared feed.
