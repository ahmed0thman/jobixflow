# Notifications — Company Admin
URL/route: `https://jobixflow.com/companies.admin/notifications`
Purpose: Same notification feed pattern already fully documented for Platform Admin/Platform Dispatcher (see `platform-admin/notifications/notifications.md`).

## Navigation path
Sidebar → "Notifications."

## CRUD actions tested
Not re-tested individually — visual structure identical (All/Unread tabs, Mark all as read/Delete read bulk actions, per-item Mark as read/Delete/View).

## Hidden / secondary UI elements
Same as previously documented.

## States observed
Not independently re-verified.

## Validation & edge cases
N/A.

## Permissions
Personal to the logged-in user.

## Issues / inconsistencies / open questions
Same 51-count feed observed again here, matching the two platform-level accounts. **Resolved** by `company-dispatcher/notifications/notifications.md`: a Company Dispatcher account shows a genuinely different count (22), confirming notifications are per-user, not a shared broadcast feed — the platform-level matches were coincidental.
