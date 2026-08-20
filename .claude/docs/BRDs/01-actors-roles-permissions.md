# 01 · Actors, roles and permissions

**ID namespace:** `ROL`
**Source coverage:** 🟢 **Strong** for role structure and who-does-what. 🔴 **Weak provenance** on the permission model itself — see the warning below.

## Purpose

Defines the five actors, the four dashboards, and who may do and see what. Every other module depends on this one; permission rules are the single largest driver of UI variation in this product.

---

## ⚠️ Provenance warning — the permission model is the developer's invention

At `[T:253]`, immediately after explaining the chat permission rules, the developer states plainly:

> *"He doesn't talk about these things, by the way — all of this is my own authoring."*
> — and at `[T:254]`, that the client never commented on wanting it this way.

She adds at `[T:255]` that changing it is trivial: *"it's a line of code, it'll change if the permissions change."*

**Consequence.** The role *structure* — five actors, four dashboards, who employs whom — is solid and repeatedly corroborated, and was independently reconfirmed by the client directly in the 2026-08-17 follow-up: Platform Admin → Platform Dispatcher (the client's own term is "Platform Dispatch," internally also called "First Line") → Company Admin → Company Dispatcher → Technician `[T2:25-29]`. The fine-grained *permission rules*, especially the chat matrix, remain the developer's design choices — that same follow-up meeting never touched them, so they are still unreviewed by the client. They should be presented to the client as proposals to confirm, not as inherited requirements. See `Q-19`.

---

## Current behavior

### Organisational structure

The platform onboards **companies** (locksmith workshops); companies employ **technicians** `[T:19-26]`. There is **no direct relationship between the platform and technicians** — technicians sit entirely under their company `[T:28-30]`.

```
Platform
├── Platform Admin        ── onboards companies, oversees everything
├── Platform Dispatcher   ── answers customer calls, creates jobs
└── Company (tenant)
    ├── Company Admin       ── employs technicians, sources key codes
    ├── Company Dispatcher  ── assigns jobs to technicians
    └── Technician          ── mobile app only, field work
```

### The four dashboards

Four web dashboards `[T:2, 221]`, plus a separate technician mobile app `[T:102]` which is explicitly *not* called a dashboard.

| Dashboard | Primary function |
|---|---|
| Platform Admin | Oversight, company onboarding, platform users, audit log |
| Platform Dispatcher | Call intake, job creation, company assignment |
| Company Admin | Technician management, key code sourcing, company settings, call recordings |
| Company Dispatcher | Technician assignment, live monitoring, chat |

### What each actor does

**Platform Admin** — adds companies `[T:19]`; adds other platform users, both admins and dispatchers `[T:289]`; monitors jobs and their status and priority, seeing full job detail `[T:45]` including vehicle data, status timeline and payment detail `[T:271-277]`; views customers `[T:287]` and the audit log `[T:326]`. Explicitly **does not create jobs** `[T:45]`. Explicitly **does not post in chat** — observation only `[T:49]`.

**Platform Dispatcher** — receives customer calls and is the only intake point `[T:50-51]`; creates the job, selecting an existing customer by phone number or adding a new one `[T:428-430]`; enters customer data, service type, country and a preliminary price `[T:432, 439, 448]`; assigns the job to a company operating in the customer's area `[T:52-53, 451-453]`; views companies but cannot add them `[T:455]`; sees customer phone numbers `[T:456]`.

**Company Admin** — adds technicians `[T:78]`; handles code requests and is the party who actually obtains the key code, recording provider and cost `[T:280-285, 487-489]`; sees vehicle data `[T:280]`; is the **only** role able to access call recordings `[T:542]`; manages company settings and profile `[T:542]`; views jobs with the same detail as the platform admin `[T:526]`; adds company users, including technicians beyond what the platform admin can `[T:535]`. **Sees every chat message but posts none** `[T:245]`.

**Company Dispatcher** — receives jobs assigned to the company `[T:74]`; assigns each to a technician, seeing the technician's current availability at the point of assignment `[T:82]`; monitors technicians and jobs on the map `[T:86, 227]`; chats `[T:227-250]`; views the company's technician list `[T:258]` and searches it `[T:260]`. **Does not add technicians** `[T:78]`.

**Technician** — mobile app only. Receives assigned jobs, travels, is tracked, records the authoritative job data and final price, requests key codes, collects payment. Receives **only the data the system pushes to the app** `[T:458]` — deliberately restricted because *"he is the one who must be monitored, and he must have no relationship with the customer"* `[T:459]`.

### Technician assignment criteria

The company dispatcher selects on: technician in the **same state** as the job `[T:68]`, and technician **currently free**, not on another job `[T:69-71]`. Proximity is explicitly **not** used, because exact locations are unknown — *"the whole relationship is a phone relationship"* `[T:66]`. Availability is shown inline during assignment `[T:82]`.

### Chat participants

Per-job chat `[T:47]`. Permitted pairs `[T:227-250]`:

| From | To | Source |
|---|---|---|
| Technician | Company dispatcher (the one who assigned the job) | `[T:227-228]` |
| Company dispatcher | Assigned technician | `[T:237]` |
| Company dispatcher | Other dispatchers in the same company | `[T:239]` |
| Company dispatcher | The platform dispatcher who created that job | `[T:250]` |

The other-dispatcher case exists for shift handover — *"the job may have been delayed, so it fell in a different shift than his"* `[T:241]`.

Both admin roles are observers: they see everything, post nothing `[T:49, 245]`.

---

## Requested changes

The client's written requirements do not address roles directly. Two changes follow indirectly:

- **Company-sourced work** `[T:172-176]` gives companies their own customers and jobs, which raises an unanswered question about who performs intake on that side — see `Q-18` and module `03`.
- **The financial system** `[C:§Financial]` introduces financial data with no stated role model at all: who approves a weekly statement, who issues a refund, who records an expense. See `Q-13`, `Q-15`, `Q-16`.

---

## Business rules

| ID | Rule | Source |
|---|---|---|
| `ROL-001` | Five actors exist: Platform Admin, Platform Dispatcher, Company Admin, Company Dispatcher, Technician. Four web dashboards plus one mobile app. | `[T:2, 15, 221]` |
| `ROL-002` | The platform has no direct channel to technicians. Technicians belong exclusively to their company. | `[T:28-30]` |
| `ROL-003` | The platform admin does not create jobs. Job creation belongs to the platform dispatcher. | `[T:45]` |
| `ROL-004` | The platform admin is read-only in chat — sees all, posts none. | `[T:49]` `[ASSUMPTION]` per warning above |
| `ROL-005` | The company admin is read-only in chat — sees all, posts none. | `[T:245]` `[ASSUMPTION]` per warning above |
| `ROL-006` | Technicians are created by the company admin, never by the company dispatcher. | `[T:78]` |
| `ROL-007` | Chat is permitted only between the four pairs listed above. | `[T:227-250]` `[ASSUMPTION]` per warning above |
| `ROL-008` | The technician receives only data the system explicitly pushes to the app; customer contact details are withheld by design. | `[T:456-459]` |
| `ROL-009` | Only the company admin can access call recordings. | `[T:542]` |
| `ROL-010` | Technician assignment is filtered by same-state and currently-free. Proximity is not a criterion. | `[T:66-71]` |
| `ROL-011` | Platform users (admins and dispatchers) are created by the platform admin only. | `[T:289]` |
| `ROL-012` | The company admin obtains key codes; the technician requests them. | `[T:280-285]` |

---

## Entities and key data

**User** — belongs to either the platform or exactly one company; carries a role from the five above. Username is unique across the whole system `[T:341]`.

**Technician** — a user with field attributes: availability status, state/region, and the company employing them. Availability is surfaced during assignment `[T:82]` and appears to update automatically when a job is accepted `[T:521]`, though that line is corrupted and the mechanism is unconfirmed `[ASSUMPTION]`.

---

## States and transitions

**Technician availability** — the sources describe a binary: free / currently working `[T:69-71]`. A third state, *unavailable*, appears in a dashboard alert `[FIG:Dashboard]` ("Technician Mike Davis marked unavailable"), implying a manual off-shift state. Whether availability is two-state or three-state, and whether it is manual, automatic, or both, is **unconfirmed** `[ASSUMPTION]`.

---

## Open questions

- `Q-19` — the permission model's chat matrix is still unvalidated by the client (see warning above); the role structure itself was reconfirmed 2026-08-17
- `Q-18` — who performs intake for company-sourced jobs
- `Q-13`, `Q-15` — no role model exists for financial actions (partial answers as of 2026-08-17, see module `07`)
- `Q-06` — **resolved** 2026-08-17: platform visibility is gated by whether the company is self-sufficient on gateway + Twilio, not by job origin alone; see `AUD-001`

---

## UX implications

**A role matrix belongs on every screen annotation.** With five actors and heavily divergent permissions, each screen in `design-plans/` must state which actors reach it and what differs between them. This is the highest-variation dimension in the product.

**Read-only chat needs a real design, not an omission.** Two of five actors see a full conversation they cannot join. The composer must be visibly absent or disabled with a stated reason `[Rule 02 · R02-4]`. An observer viewing a live conversation is an unusual pattern and deserves deliberate treatment — read-only banners, no typing indicator, no draft state.

**Technician self-scoping extends beyond chat.** The 2026-08-17 client follow-up restates, as one of the "most important" report constraints, that a technician must never see another technician's activity — reports, not just chat and jobs, are per-technician-scoped `[T2:61]`. Treat this as a general visibility rule for the technician role, not a chat-specific or report-specific one.

**Phone number visibility is role-conditional at the field level.** Every actor sees customer numbers except the technician `[T:456-459]`. This is not a hidden action but a hidden value, and it must hold across tables, detail panes, exports and notifications `[Rule 01 · COM-001]`.

**Assignment needs availability inline.** The company dispatcher picks a technician while seeing status `[T:82]`, filtered by state and availability `[ROL-010]`. The picker is a filtered, status-aware selection component, not a plain dropdown.

**Four dashboards will share most components.** The screens differ mainly by scope and permission, not by structure — reinforcing the single reusable DataTable / Filter / Actions component mandate `[Rule 02 · R02-2]`.

**The technician app is a separate design surface.** It is not in the current screenshot set and is governed by the strictest data rules in the product. It is out of scope for the four dashboards but must be designed before the masked-calling and job-data flows can be considered complete.
