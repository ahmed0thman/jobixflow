# Login — Shared (all roles)
URL/route: `https://jobixflow.com/` (and `/login`)
Purpose: Single login form for every role — no separate URLs or portals per role; the backend determines the redirect destination (`/platform`, `/platform.dispatcher`, `/companies.admin`, `/companies.dispatcher`, or a web-blocked error for Technician) from the account's role after authenticating.

## Navigation path
Entry point — the root URL redirects here when unauthenticated.

## CRUD actions tested
- Read: Simple two-field form (Username, Password), "Sign In" button. Page title reads "JobixFlow - Super Admin Login" regardless of which role eventually logs in — a literal copy leftover (see Issues).
- No create/update/delete actions on this page.

## Hidden / secondary UI elements
- No "Forgot password" or "Remember me" link found on this page (searched explicitly, no match).
- No visible role selector — the same single form routes every role to its correct dashboard automatically based on account type.

## States observed
- **Empty state**: N/A, not a list page.
- **Default state**: Clean two-field form, no pre-filled values.
- **Validation error state (empty submit)**: Native browser required-field handling only — no custom app-level inline error observed.
- **Error state (wrong credentials)**: A real, well-formed dismissible red banner: **"These credentials do not match our records."** Confirmed via two separate failed attempts during this audit (once with genuinely wrong credentials, once transiently while the seed data's email domains were stale — see Project history).
- **Error state (wrong account type — Technician)**: A distinct, more specific banner: **"This account can only access the mobile application."** — confirmed with valid Technician credentials, correctly rejecting web access with a clear, specific reason rather than a generic credentials error. See `technician/_overview.md`.
- **Success state**: Redirects immediately to the role-appropriate dashboard (`/platform`, `/platform.dispatcher`, `/companies.admin`, or `/companies.dispatcher`), confirmed for all four web-accessible roles.
- Loading state: Not observed (fast local response).

## Validation & edge cases
- Empty-form submit → native browser validation only (focuses first empty field), no custom styling.
- Invalid credentials → real server-side rejection with a clear message (see above).
- Correct credentials for a Technician (mobile-only) account → explicitly blocked with a distinct, accurate reason — a good example of `Rule 02 · R02-4`'s "absent or disabled with a stated reason" principle applied at the authentication layer.

## Permissions
N/A — pre-authentication page, same for everyone.

## Issues / inconsistencies / open questions
- **[FINDING]** The page title/heading says "Super Admin Login" for every role, not just Platform Admin — a leftover copy string from what was presumably an earlier, admin-only version of this login page. Minor, one-line fix, but a real inconsistency now that the same form serves five different roles.
- No password-reset entry point was found on this login page in this pass — `CLAUDE.md`'s "What already exists" list mentions a "Reset Password (verify email + new password)" screen, but no link to it was discoverable from the login form itself. Not confirmed missing entirely (it may exist at an undiscovered URL), but it is not reachable from the primary login flow as tested. Flagged as an open item rather than asserted as missing, per `Rule 00 · R00-5`.
