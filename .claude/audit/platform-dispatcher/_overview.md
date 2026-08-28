# Platform Dispatcher — Role Overview

**Login:** `emanuel05@example.com` / `12345678` (Kailee Reichel, User ID `V8WLBBOL`)
**Landing page:** `https://jobixflow.com/platform.dispatcher` (Dispatcher Dashboard)

## Navigation structure

Single-level fixed left sidebar, in this order:

1. Dashboard (`/platform.dispatcher`)
2. New Job (`/platform.dispatcher/jobs/create`)
3. Service Types (`/platform.dispatcher/service_types`)
4. Job History (`/platform.dispatcher/jobs`)
5. Companies (`/platform.dispatcher/companies`)
6. Customers (`/platform.dispatcher/customers`)
7. Audit Log (`/platform.dispatcher/audits`)
8. Notifications (`/platform.dispatcher/notifications`)

Plus, reachable only via a **top-right navbar** (not the sidebar): notification bell/count, user avatar+name+role with an Edit Profile / Log out dropdown, and the shared `/profile` route.

In-page-only routes discovered while drilling in: Job Edit (`/platform.dispatcher/jobs/{id}/edit`, only reachable from "New Job"-status cards), Company Show (`/platform.dispatcher/companies/{id}`), Customer Show (`/platform.dispatcher/customers/{id}`), per-job Chat (`/jobs/{id}/chat`, shared route, same as Platform Admin's).

## Pages mapped (9)

Dashboard, New Job (+ Add Customer modal), Service Types (+ Edit), Job History (+ Edit Job, + Chat), Companies, Customers (+ Show), Audit Log, Notifications, My Profile.

## Role summary

Matches `CLAUDE.md`'s description: creates jobs, manages customers (full CRUD except Update, which is deliberately absent), read-only visibility into Companies, active (non-disabled) chat participant. Job creation, editing, and deletion are all real, working, status-gated flows (edit/delete only permitted while a job is still "New Job") — a genuine implementation of the guided-state-machine principle the redesign needs (`JOB-005`).

## Permission notes

- **Full job intake CRUD**, status-gated: create always available; edit/delete only on "New Job" status jobs, with delete additionally enforced server-side (not just hidden) — confirmed via a real "Job can not Delete after change status!" error.
- **Customers: Create + Read + presumed Delete, explicitly no Update** — the Customer Show page states "Read-only view of customer information" directly in its own subtitle, a good precedent for the redesign to reuse.
- **Companies: fully read-only** — no Add/Edit/Delete anywhere, matching `CLAUDE.md`.
- **Chat composer is enabled** (not disabled) on the per-job chat page, correctly differing from the read-only admin roles, and this role additionally has a "Start New Chat" button not seen on the admin chat view.
- **Unexpectedly has full Audit Log access** (see below) — not documented as a capability of this role anywhere in the existing requirements.

## Cross-cutting findings worth carrying into every other role's audit

- **[Priority] The live product's "Priority" field (Low/Medium/High, used everywhere as a colored pill) directly conflicts with the resolved `Q-05`** ("Binary Now/Scheduled flag only; no effect on price, category, or technician assignment"). This needs a real decision from the client/developer before the redesign touches job priority anywhere — flagged prominently in `new-job.md`.
- **[Service Type data bug — confirmed at the source] The `service_types` table is seeded entirely with person names, not real service categories** (confirmed on the dedicated Service Types admin page, not just as a downstream rendering artifact in Reports or the New Job dropdown). This is a functional blocker for actually using job creation correctly today and should be a priority developer fix, independent of the redesign.
- **[Shell inconsistency] This role's shell uses a top-right navbar for the user menu/notifications, with no role-subtitle under the sidebar logo — a different structural pattern from Platform Admin's sidebar-pinned user card.** Both need reconciling under one design system (`Rule 02 · R02-1`).
- **Row-action UI conventions continue to multiply**: this role adds at least two more variants (unlabeled icon-only Delete buttons with no accessible name, on both Job History and Customers) to the already-long list from Platform Admin's pages. By this point, six-plus distinct row-action patterns have been found live across just two roles.
- **Two more real JS bugs found**: `ReferenceError: $ is not defined` on Edit Job page load, and a value-loading bug where Edit Job doesn't correctly pre-fill the saved Priority.
- **Platform Dispatcher can see the full, unscoped, cross-company Audit Log** — undocumented anywhere as a stated capability of this role. Flagged as a new open question rather than assumed either way.
- **Notification feed content was identical between the Platform Admin and Platform Dispatcher accounts tested** — raises a real question about whether notifications are genuinely per-user or a shared broadcast feed; worth developer confirmation.

## Areas not fully verified for this role

- Did not complete a real New Job submission (avoided creating a persistent, downstream-triggering job record mid-audit) — success/confirmation state and what happens immediately after creation (does it require a separate company-assignment step?) remain unverified.
- Did not test Delete on Job History or Customers to completion (avoided on live seed data, though the Delete-blocked business rule was confirmed on Job History).
- Search boxes on Companies, Customers, Service Types, and Audit Log were not exercised with real queries for this role (behavior assumed consistent with the already-confirmed Jobs/Audit-Log search pattern from Platform Admin).
- Did not open the Add Service / Add Customer forms to completion.
