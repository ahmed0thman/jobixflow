# Company Admin — Role Overview

**Login:** `uparker@example.net` / `12345678` (Mr. Colten Gorczany, User ID `ZMQGERIR`, Company 1 / Ziemann-Satterfield)
**Landing page:** `https://jobixflow.com/companies.admin` (Dashboard)

## Navigation structure

Single-level fixed left sidebar (same shell pattern as Platform Admin — role subtitle under logo, user card pinned to sidebar bottom), in this order:

1. Dashboard (`/companies.admin`)
2. Code Requests (`/companies.admin/code_requests`)
3. Technicians (`/companies.admin/technicians`)
4. Reports (`/companies.admin/report`)
5. Key Codes (`/companies.admin/key_codes`)
6. Jobs (`/companies.admin/jobs`)
7. Notifications (`/companies.admin/notifications`)
8. Customer (`/companies.admin/customers`)
9. Users (`/companies.admin/users`)
10. Call Logs (`/companies.admin/calls`)
11. Audit Log (`/companies.admin/audits`)
12. Settings (`/companies.admin/settings/{id}/edit`)

Plus the shared `/profile` route via the sidebar user card.

In-page-only routes discovered while drilling in: Code Request Show (`/companies.admin/code_requests/{id}`), Job Show (`/companies.admin/jobs/{id}`), per-job Chat (`/jobs/{id}/chat`), and the **broken** Technician Ledger (`/companies.admin/jobs/{id}/technician_ledger` — 500 error, see below).

## Pages mapped (12)

Dashboard, Code Requests (+ Show, + Add Code modal), Technicians (+ Edit modal), Reports, Key Codes, Jobs (+ Show, + broken Technician Ledger), Notifications, Customers, Users (+ Create modal), Call Logs, Audit Log, Settings, My Profile.

## Role summary

Matches `CLAUDE.md` closely: handles Code Requests, manages technicians (via the Users page, not a dedicated button), sees vehicle data/call recordings/company settings, read-only in chat (composer confirmed disabled). This role's audit log and reports pages, unlike the platform-level equivalents audited earlier, show **real human-attributed activity** rather than seed "System" rows — making this the most information-rich role mapped so far for understanding what's actually live and working in the product.

## Permission notes

- **Chat composer confirmed disabled** for Company Admin, matching `ROL-005`.
- **No job creation, no job Delete** (Jobs page has no Delete action for this role, unlike Platform Admin's).
- **Technician management is Edit-only from the Technicians page**; creation happens via the general Users "Create New" flow with Role=Technician.
- **Fully company-scoped everywhere tested** — Jobs, Customers, Key Codes, Call Logs, Audit Log, Users, Technicians all show only this company's data, and the Audit Log in particular was confirmed to genuinely filter by company (31 pages vs. 1,660 platform-wide) rather than just omitting a company column.

## Cross-cutting findings worth carrying into every other role's audit

- **[Most urgent finding in this audit] A "Technician Ledger" feature already has a linked route and row-action entry point (`/companies.admin/jobs/{id}/technician_ledger`) but crashes with a reproducible 500 Server Error on every job tested.** This is the single clearest piece of evidence that per-job financial ledger work (the core of `NEW-REQUIREMENTS.md §3`) has already been **started** on the backend, not just planned. Recommend this be raised with the developer as the top-priority item from this entire audit, both because it's a live bug and because it should directly inform how the financial screens are scoped and designed (coordinate with existing backend work rather than design in a vacuum).
- **[Twilio infrastructure already partially exists] Call Logs shows real Twilio Call SIDs and a "technician_to_client" call-type field; the Audit Log shows a `twilio_identity` field already assigned per technician** (e.g. `technician_20`). Combined, this is strong evidence that Twilio Client/Voice identity provisioning and basic call logging already exist at the data-model level — the masking/proxy-number/webhook-routing behavior described in `NEW-REQUIREMENTS.md §2` appears to be the genuinely new part, not the entire communications layer. Recommend clarifying this distinction with the developer before scoping the Twilio design work.
- **[Commission % already exists per technician] The Edit Technician modal has a live "Commission Percentage %" field (e.g. 15.00%)** — concrete evidence the technician-level commission mechanism named in `NEW-REQUIREMENTS.md §3.3` is at least partially wired already.
- **[Real GPS confirmed live] The Audit Log shows real latitude/longitude values logged on a `JobRequest` status transition to "in_progress"** — direct confirmation `LOC-002` (location recorded on arrival) is already functioning, not just planned.
- **[Service Type bug — fourth confirmed occurrence] The Technician Edit modal's "Skills" multi-select uses the same broken person-name list.**
- **[Data discrepancy, unresolved] The Users page reports 101 Technicians for this company; the dedicated Technicians Management page lists only 11.** Flagged as a priority data-integrity question — see `users.md` and `technicians.md`.
- **[Shared bug reproduced] The Create User modal's Cancel button throws the same Bootstrap-modal `TypeError` already found on Platform Admin's equivalent screen** — confirms this is one shared component bug, not two separate ones.
- **["Deleted" status conflict — now confirmed in 3+ places]** Company Status includes "Deleted" as a selectable value on Platform Admin's Companies Create/Edit **and** here on Company Admin's own Settings page — the `AUD-002` archive-not-delete fix needs to be a single shared enum change.

## Areas not fully verified for this role

- Did not complete real Create/Edit/Delete submissions anywhere (Code Requests' Add Code, Technicians' Edit, Users' Create) to avoid mutating shared seed data.
- Did not test the second (presumably download) icon in Call Logs' Recording column.
- Did not verify whether the "Internal" chat toggle switches threads (same open question as Platform Admin's chat page).
- Search boxes on Code Requests, Technicians, Key Codes, Customers, and Audit Log were not exercised with real queries.
