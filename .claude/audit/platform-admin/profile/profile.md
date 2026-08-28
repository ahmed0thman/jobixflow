# My Profile — Platform Admin
URL/route: `https://jobixflow.com/profile`
Purpose: Self-service profile editing + password change for the logged-in user. Shared route across all roles (not namespaced under `/platform`).

## Navigation path
Sidebar bottom user card → "Edit Profile" dropdown item, or directly via the "EZ" avatar link.

## CRUD actions tested
- Read: Left summary card (avatar initials, name, role, Status: active, User ID) + two forms on the right: "Personal Information" (First Name, Last Name, Phone) / "Account Information" (Email, Username, User ID [disabled]), and a separate "Security" section (Current/New/Confirm Password).
- Update: Not submitted — avoided changing the logged-in seed account's real credentials/profile mid-audit. Two independent "Save Changes" buttons exist (one for Personal/Account Information, one for Security), implying they submit separately.
- Create/Delete: N/A.

## Hidden / secondary UI elements
- **"Log out" button** in the left summary card — same action available via the sidebar user-menu dropdown (a second path to the same action, consistent with the redundancy already noted on the Dashboard between the "EZ" avatar link and the user-card dropdown).
- **User ID field is disabled** (read-only) inside an otherwise-editable form — the one deliberately non-editable field, correctly rendered as disabled rather than just omitted.
- Password section carries an explicit helper line: "Password update is optional. If both password fields are empty, your current password will not be changed" — a good example of an explained, non-silent optional-field pattern worth preserving.

## States observed
- Empty state: **First Name and Last Name fields render empty** despite the account clearly having a full name ("Emily Zboncak II") — see Issues.
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested (no submission attempted).
- Disabled elements: User ID field, disabled with a clear reason (immutable system identifier).

## Validation & edge cases
Not tested — avoided submitting to prevent altering the shared seed admin account's real login state.

## Permissions
Every role reaches this same `/profile` route for self-service editing — role-specific differences (if any) were not compared across roles in this pass, since this page was only tested as Platform Admin so far.

## Issues / inconsistencies / open questions
- **[FINDING] First Name / Last Name fields are empty while the account's full name ("Emily Zboncak II") lives entirely in the "Username" field.** This points to a live data-model quirk: the seed data populated a single combined-name "Username" but never split it into first/last name, so this form currently displays as if the user has no name on file even though they clearly do (visible everywhere else in the product, e.g. sidebar, tables, chat). Worth a developer check on whether First/Last Name are actually used anywhere downstream, or whether Username is the real source of truth and First/Last Name are vestigial fields.
- **[FINDING]** "Username" is used to hold a full display name ("Emily Zboncak II") rather than a traditional short handle — worth keeping in mind for the redesign so a "Username" field/label isn't assumed to mean what it usually means.
