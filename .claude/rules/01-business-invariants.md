# Rule 01 — Business invariants

Non-negotiable constraints. A design that violates one of these is wrong regardless of how good it looks.

Each line is the enforceable form only. The explanation, provenance and edge cases live in the BRD section named at the end — **explanations are not duplicated here**, so that there is exactly one place to correct when a rule changes.

## Identity and privacy

- The technician **never** sees the customer's real phone number, in any screen, notification, export or report → `COM-001`
- The customer **never** sees the technician's real number; they see the Twilio number only → `COM-002`
- The technician originates calls and SMS **only from inside the app**, never by dialling directly → `COM-003`
- The masked number binding stays live for **24 hours** after a job closes or is cancelled, then is disabled → `COM-004`
- The binding follows **whichever technician currently holds the job** — if a job is reassigned, callbacks route to the new technician, not the original one → `COM-004`
- An inbound call or message with **no active job** routes to dispatch, never to a technician — the **company dispatcher** for a company-linked job, or **back to the platform** for a platform-sourced job → `COM-005`

## Roles and authority

- Platform admin and company admin are **read-only in chat** — they see every message and post none → `ROL-004`, `ROL-005`
- The platform admin **does not create jobs**; that is the platform dispatcher's function → `ROL-003`
- Technicians are created by the **company admin**, not the company dispatcher → `ROL-006`
- The platform has **no direct channel to technicians**; technicians belong to companies → `ROL-002`
- The technician's problem description and **final price override** whatever the customer reported → `JOB-002`

## Jobs and location

- Job intake is **by telephone only**. There is no customer app, portal, or self-service form → `JOB-001`
- The job address is **free text** captured over the phone — never a customer-supplied geolocation → `JOB-004`
- A job's location is recorded **only when the technician pings on arrival** → `LOC-002`
- The map carries exactly **two layers**: live technicians and pinned jobs → `LOC-003`
- The **job status/state machine is fixed and identical for every company** — no company admin or dashboard control may add, remove, reorder or rename states → `JOB-005`
- A job that has entered the system **must reach completion or receive an explicit cancellation with a stated reason** — it is never simply deleted mid-flight → `JOB-006`

## Tenancy

- Every job carries an **origin** — platform-sourced or company-sourced — and it is never absent → `TEN-001`
- Company data is **fully isolated**. No company may see any other company's jobs, customers, technicians or finances, in any view including search results, exports and aggregate counts → `TEN-002`

## Money

- **Balances are never edited manually.** Every financial event appends a new row to the transactions ledger → `FIN-S-003`
- **Every deduction is its own transaction record** — never folded into another amount → `FIN-F-002`
- A job is counted in the week it **completed**, not the week it was created → `FIN-S-002`
- The financial week runs **Monday 00:00 → Sunday 23:59** → `FIN-S-001`
- Companies using **their own payment gateway never appear in the platform wallet** → `FIN-W-002`
- On cash payment the technician **holds the money**; the system records cash-in-hand owed to the company → `FIN-W-004`
- Every dispute links to **Job + Invoice + Payment + Technician** — all four, always → `FIN-F-003`
- On a **lost** dispute the technician bears **only their commission share** → `FIN-F-006`
- On a **lost** dispute the dispatch fee and gateway fee are **never returned** to the technician — they are consumed operating costs → `FIN-F-007`
- A **wallet is a derived transaction log**, never a movable-funds account — no technician-to-technician or peer transfer exists anywhere in the product → `FIN-W-012`
- Any job-tied expense is deducted **before** gateway fee, commission and dispatch fee → `FIN-W-013`
- An invoice carries the **company's name only** — it never carries the platform's name, logo or branding → `FIN-W-015`
- A refund (company-initiated goodwill) and a dispute/chargeback (bank-initiated) are **distinct mechanisms** and must be tracked as distinct job states, never merged → *(new, `[T2:159-169]`, module `07`)*

## Data retention

- The audit log certifies operations conducted **through the platform's own infrastructure**. A company running entirely on its own payment gateway and its own Twilio subscription is **excluded** from it — the platform does not pull in records that belong solely to a self-sufficient company → `AUD-001` *(refined 2026-08-17, see `Q-06`)*
- Live operational and financial data is **not hard-deleted**. The Jobs delete control becomes an **archive** action, gated until a record reaches a minimum age (client's working figure: **one year**, meant to be admin-configurable, not hardcoded). Periodic full export (quarterly or annual) before any purge satisfies the underlying 2-year US legal-retrieval requirement. The state must read **"Archived," never "Deleted."** → `AUD-002` *(resolved 2026-08-17, see `Q-07`)*

## Applying these to design

These invariants have direct UI consequences and are the first thing to check on any screen:

- A masked number means **no screen, tooltip, table cell, CSV export or notification may surface a real phone number** to the wrong party. Phone columns need role-conditional rendering, not just hidden actions.
- Read-only chat means the composer must be **visibly absent or explicitly disabled with a reason** for admins — never present-but-broken.
- No manual balance editing means financial screens carry **no editable balance field anywhere**. Corrections are modelled as a new adjustment transaction, which needs its own entry flow.
- Full tenant isolation means every list, filter, search, count and chart is **scoped to one company**, and cross-tenant views exist only for platform roles.
- A fixed job state machine means the status control on any job screen is a **guided, sequential action** (advance to the one legal next state), never a free-choice dropdown over every possible state — regardless of role or company.
- Archive, not delete, means the Jobs list needs an **age-gated action label that reads "Archive,"** a disabled/explained state for records too young to archive, and a separate archived-records view — never a destructive confirmation dialog implying permanent loss.
