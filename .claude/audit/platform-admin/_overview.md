# Platform Admin — Role Overview

**Login:** `hickle.deon@example.com` / `12345678` (Emily Zboncak II, User ID `EB9DXADT`)
**Landing page:** `https://jobixflow.com/platform` (Dashboard)
**Sidebar branding:** "JobixFlow" + subtitle "Platform Admin" — confirms the live product is branded **JobixFlow**, not "LockAccess Pro" as the now-deleted screenshot set suggested (`CLAUDE.md` flagged this as needing confirmation — now resolved by direct observation).

## Navigation structure

Single-level fixed left sidebar, in this order:

1. Dashboard (`/platform`)
2. Companies (`/platform/companies`)
3. Countries (`/platform/countries`)
4. Reports (`/platform/reports`)
5. Jobs (`/platform/jobs`)
6. Notifications (`/platform/notifications`) — carries a live unread-count badge
7. Customer (`/platform/customers`) — note: singular label, inconsistent with siblings
8. Users (`/platform/users`)
9. Audit Log (`/platform/audits`)
10. Settings (`/platform/settings/{id}/edit`)

Plus, reachable only via the bottom user card (not in the main nav list): **My Profile** (`/profile`, shared route across roles) and **Log out**.

In-page-only routes discovered while drilling into Jobs (not in the sidebar): Company Show (`/platform/companies/{id}`), Job Show (`/platform/jobs/{id}`), per-job Chat (`/jobs/{id}/chat` — notably **not** namespaced under `/platform`).

## Pages mapped (11)

Dashboard, Companies (+ Show/Create/Edit), Countries (+ Add/Edit), Reports, Jobs (+ Show, + Chat), Notifications, Customers, Users (+ Create/Edit), Audit Log, Settings, My Profile.

## Role summary

Matches `CLAUDE.md`'s description closely: full cross-company monitoring (companies, jobs, customers, users, audit log), no job-creation ability, read-only chat (composer confirmed disabled, not just absent). Platform Admin sees real customer PII (phone, email, address, vehicle data, full payment detail) with no masking — consistent with the stated role, since `COM-001`/`COM-002` only restrict technician↔customer visibility, not Platform Admin.

## Permission notes

- **No job creation** — confirmed no create action anywhere on Jobs (`ROL-003`).
- **Chat is read-only** — composer textbox and send button both render `disabled` on the per-job chat page, a good concrete example of the "visibly absent or explicitly disabled" pattern `Rule 02 · R02-4` calls for (`ROL-004`).
- **Full cross-tenant visibility** — Companies, Jobs, Customers, and Audit Log are all platform-wide with no per-company scoping filter exposed in the UI (this is expected/correct for this role, per `CLAUDE.md`).
- **Financial/Twilio/gateway settings do not exist anywhere reachable by this role** — confirmed empirically across Companies (Show/Edit/Create), Settings, and every other page: no wallet, no gateway config, no Twilio number field anywhere. Matches `CLAUDE.md`'s "missing entirely" list exactly.

## Cross-cutting findings worth carrying into every other role's audit

- **At least four different row-action UI conventions coexist live**: kebab-menu-with-Show/Edit/Delete (Companies, Jobs), inline plain-text-links (Countries, Users), button-row-per-item (Notifications), single-link (Audit Log). The reusable Actions master component (`Rule 02 · R02-2`) needs to pick one canonical pattern, not preserve all four.
- **"Country" as a field/concept appears in at least three unrelated places** (Company create/edit, User edit, and the standalone Countries admin module) all drawing from the same messy, mostly-placeholder ("America Country"/"Middle East Country") seed list — strengthens the case for resolving `Q-04` centrally.
- **Company Status includes a "Deleted"/"deleted" option** in both the Companies Edit modal and Create form — a direct live conflict with the archive-not-delete requirement (`AUD-002`) that the redesign must resolve, not just design around.
- **KPI week-over-week deltas look systemically broken** — both the Dashboard and Reports pages show suspicious `0%`/`+100%`/`-100%` deltas on live data, suggesting one shared calculation bug rather than two separate issues. Worth a developer heads-up.
- **A real JS bug** was found on Users → Create User → Cancel (uncaught `TypeError` in the Bootstrap modal bundle) — flagged for the developer, out of scope for design but worth surfacing.
- **Live job status enum (12 values) does not cleanly map to the canonical flow** confirmed in the 2026-08-17 client follow-up — needs reconciling before finalizing any status-pill or state-machine design.

## Areas not fully verified for this role

- Delete actions (Companies, Countries, Jobs, Users, Audit Log) were **never executed** — blocked by this session's safety controls in one case (Companies) and deliberately avoided elsewhere to protect shared seed data. Post-delete states, confirmation-dialog content, and whether any of them read "Archive" instead of "Delete" remain unverified.
- Create submissions (Companies, Countries, Users) were opened and inspected but never completed, to avoid permanently mutating shared seed data — success/confirmation states are unverified.
- Search boxes on Companies, Countries, and Customers were not exercised with real queries (only Jobs and Audit Log search were tested and confirmed functional).
- Whether the per-job chat's "Internal" toggle genuinely switches between distinct threads was inconclusive on the one job tested.
