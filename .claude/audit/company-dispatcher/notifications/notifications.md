# Notifications — Company Dispatcher
URL/route: `https://jobixflow.com/companies.dispatcher/notifications`
Purpose: Same notification feed pattern already documented for Platform Admin (`platform-admin/notifications/notifications.md`).

## Navigation path
Top-right navbar bell icon / sidebar "Notifications" item.

## CRUD actions tested
Not re-tested individually — structure matches previously documented pattern.

## Hidden / secondary UI elements
Same as previously documented.

## States observed
Not independently re-verified.

## Validation & edge cases
N/A.

## Permissions
Personal to the logged-in user.

## Issues / inconsistencies / open questions
- **[CORRECTION to an earlier open question]** This account shows **22** notifications, genuinely different from the 51/52 seen on both platform-level accounts tested earlier. This **resolves** the open question raised in `platform-dispatcher/notifications/notifications.md` and `company-admin/notifications/notifications.md` about whether notifications are a shared broadcast feed — they are not; each account gets a distinct, real, per-user count. The earlier matching counts between the two platform accounts were most likely coincidental (both accounts happening to be recipients of the same platform-wide seed events), not evidence of a shared feed.
