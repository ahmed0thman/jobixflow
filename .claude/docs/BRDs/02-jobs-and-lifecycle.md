# 02 · Jobs and lifecycle

**ID namespace:** `JOB`
**Source coverage:** 🟡 **Partial.** The overall shape of intake-to-close was well covered by the 2026-08-05 developer handover, and the 2026-08-17 client follow-up (`[T2:<line>]`, see [`../sources/2026-08-17-client-followup/`](../sources/2026-08-17-client-followup/)) added a direct, step-by-step walkthrough of the state machine and confirmed it as **fixed and company-uniform**. Two concrete gaps remain open: the full cancellation-reason enum (`Q-21`) and the exact mechanics of a new fee type, the Service Call Fee (`Q-20`).

**Related modules:** `01` actors and roles · `07` finance (payment arithmetic, Service Call Fee) · a future Communications module for the full Twilio/masked-calling mechanics (`COM-*` rules currently live only in [`../rules/01-business-invariants.md`](../rules/01-business-invariants.md), not yet in a dedicated BRD)

## Purpose

Defines the single, fixed job lifecycle every company runs on top of — from phone intake to close — the states a job can be in, who can move it between them, and the two newly surfaced financial edge cases (Service Call Fee, job reassignment) that a job's history needs to represent.

---

## Current behavior

This is the existing, already-built flow, corroborated across both meeting transcripts.

- Intake is **by telephone only** — no customer app, portal, or form `[T:50-51]`, `JOB-001`.
- The address is captured as **free text** from what the customer says on the phone, never a geolocation the customer supplies `[T:...]`, `JOB-004`. The client is explicit that this is deliberate, not a limitation to fix: *"I'm not in need of the customer sending me a live location so I can reach him — the moment he tells me, for example, 'I live on this street, this street number, this city,' I know exactly where he is"* `[T2:92-93]`. Addresses can be wrong or approximate (customer not from the area, broken down on the roadside rather than at a fixed address); the technician resolves ambiguity on site `[T2:93-95]`.
- Dispatch (platform or company) assigns the job to the nearest/most suitable **free** technician in the same state; proximity beyond state-matching is not used (`ROL-010`, module `01`).
- The technician's field description and final price are **authoritative**, overriding whatever the customer originally reported (`JOB-002`).
- A job's location is recorded **only** when the technician pings arrival, never from continuous GPS tracking alone (`LOC-002`).

---

## Requested changes / newly confirmed detail

### The state machine is fixed, not company-configurable

The designer directly asked whether each company could define its own custom states or reorder the workflow. The client's answer is unambiguous: **no** — the flow is identical for every company, because it reflects how the business itself works, not a configurable system setting:

> «انا بعطيك الستيتس... ما رح تكون متغيره لانه هو نظام الشغل ثابت لكل الشركات» `[T2:82]`

This resolves what would otherwise have been a significant open design question (a company-level workflow builder) in favor of a **single, fixed status stepper** used identically across every dashboard. See `JOB-005`.

### The canonical flow, step by step `[T2:82-101]`

```
1. Call intake       — dispatch takes the problem description + spoken address
2. Assigned          — dispatch sends the job to the nearest/suitable free technician
3. Accepted/Rejected — technician responds; accept-click timestamp is tracked
4. Confirmed by call — technician calls the customer (only from inside the app,
                        per COM-003) and confirms address + genuine need
5. Started            — technician begins the trip ("Start Job"/"Start Trip")
6. Arrived            — technician manually confirms arrival; this single action
                        both advances the state AND captures GPS lat/long
7. Completed          — job finished, payment collected
      — or —
7. Cancelled          — with a mandatory reason (see below)
```

**Arrival is a manual confirm, not automatic GPS detection — by design.** The client explicitly rejected relying on automatic geofencing: *"we made it so the GPS isn't relied on, because I read the requirements that said GPS isn't accurate the first time — the technician is the one who goes, and when he arrives he confirms the location he's arrived at"* `[T2:89]`. The confirm action and the GPS capture happen together, in one step — the app already works this way: *"the application already does this — the technician confirms he's arrived, so pressing 'arrived' sends the location along with it"* `[T2:101]`. This adds mechanism detail to `LOC-002` without changing the rule itself.

**"Updated" is not a closing signal.** Only **Cancelled** and **Completed** close a job; any other status label (e.g. "In Progress") is informational and doesn't imply the job could reopen or is finished `[T2:115-119]`. Free-text notes and in-app chat carry most of the incidental detail; the tracked state transitions stay coarse and few `[T2:119]`.

### Cancellation reasons — partial list, more promised

The client named three reasons in passing and explicitly promised the **complete list** separately, not yet delivered — see `Q-21`:

- Customer resolved the problem themselves ("Customer Resolved")
- Customer did not answer the callback ("Customer Did Not Answer")
- Wrong or incorrect details captured at intake, e.g. a mistyped phone number ("Wrong Details")

Every cancellation requires a reason to be recorded before the cancel action completes `[T2:112-113]`.

### Job reassignment between technicians

A job can move from one technician to another mid-flow — the client's example is **price shopping**, where the customer is negotiating with multiple companies/technicians simultaneously and dispatch tries to renegotiate `[T2:120-122]`. From the *system's* perspective the job continues normally under the new technician. From the *original* technician's perspective, the client describes it as functionally a cancellation for them — they made the trip but didn't get to close it out `[T2:122]`. Whether that technician is still owed a Service Call Fee for the trip depends on whether the customer already paid it or refused, tracked via free-text update notes rather than a defined field `[T2:120-124]` `[ASSUMPTION]` on the exact data model — the client's own account here is loose, not a specified mechanism.

### Service Call Fee — a new, distinct charge

When a technician is dispatched and travels to a job that doesn't reach completion — customer resolved it before arrival, customer refuses to pay, or the job gets reassigned mid-trip — a standalone fee may apply to cover the wasted trip, separate from the job price, dispatch fee and gateway fee `[T2:105]`. The client's own description of enforcement is genuinely loose, not a gap in this document:

> «اذا العميل بده يدفع بناخذ منه الفلوس اذا العميل ما بده يدفع نطلب من الفن يطلع من المكان وخلاص» `[T2:107]`

> «فانا ما فعليا ما بقدر اجبره بالقانون الامريكي ما في شيء يجبره... الشرطه تحكي لي ما بده يدفع لك خلص» `[T2:123]`

There is no legal mechanism to compel payment, and the client is candid that the outcome is genuinely binary — collected or not. Full financial modeling (calculation, transaction type) lives in module `07`; see `Q-20`.

### 24-hour callback routing, refined

The masked-calling binding (`COM-004`) follows whichever technician **currently** holds the job — a reassignment moves the binding to the new technician, not the original assignee `[T2:129]`. After 24 hours, routing depends on job origin: a **company-relevant** job routes to the company dispatcher, a **platform-sourced** job routes back to the platform itself `[T2:131-137]` — refining `COM-005`, which previously only said "routes to dispatch" without specifying which one.

---

## Business rules

| ID | Rule | Source |
|---|---|---|
| `JOB-001` | Job intake is by telephone only — no customer app, portal, or self-service form. | `[T:50-51]` |
| `JOB-002` | The technician's field description and final price are authoritative, overriding the customer's original account. | `[T:102-133]` |
| `JOB-004` | The job address is free text captured from the phone call — never a customer-supplied geolocation. | `[T2:92-93]` |
| `JOB-005` | The job status/state machine is fixed and identical for every company; it is not configurable per company, per dashboard, or by any admin role. | `[T2:82]` |
| `JOB-006` | A job that has entered the system must run to completion or receive an explicit cancellation with a stated reason — it is never simply deleted mid-flight. | `[T2:72-75]` |
| `JOB-007` | Arrival is confirmed manually by the technician; that single action also captures the GPS coordinates used as the job's recorded location. GPS-only automatic arrival detection is explicitly rejected. | `[T2:89-101]` |
| `JOB-008` | Only "Cancelled" and "Completed" close a job. Any other status update is informational and does not imply closure or reopening. | `[T2:115-119]` |
| `JOB-009` | Every job cancellation requires a recorded reason before the cancellation completes. | `[T2:112-113]` |

---

## Entities and key data

**Job** — origin (`TEN-001`), customer, address (free text), service type, priority (Now/Scheduled), preliminary price, final price, current state, assigned technician (current, which may differ from original on reassignment), state-transition timestamps (at minimum: accepted, call-confirmed, started, arrived, closed), cancellation reason (if cancelled), linked Service Call Fee transaction (if any).

**Cancellation reason** — an enum value tagged to a cancelled job. Only three confirmed members so far; see `Q-21`.

**Service Call Fee** — see module `07` for the financial entity; here it is simply a job-level flag/link marking that a fee was assessed and its outcome (collected, waived, refused).

---

## States and transitions

```
Created → Assigned → Accepted ─┬─→ Confirmed (call) → Started → Arrived → Completed
                                │
                                └─→ Rejected → (reassigned to another technician)

Any state → Cancelled (reason required)
Any state → Reassigned (binding + current-technician pointer move; original
            technician's leg closes out, possibly with a Service Call Fee)
```

This is the fullest state picture the sources support. What is **not** specified: whether "Rejected" auto-reassigns or requires a dispatcher action, the exact list of cancellation reasons beyond the three given (`Q-21`), and whether "Reassigned" is a job-level state or a per-assignment sub-record with the job itself staying in its normal flow. Do not invent finer-grained states beyond what's listed here.

---

## Open questions

- `Q-20` 🟠 — Service Call Fee calculation and assessment mechanics
- `Q-21` 🟠 — the complete cancellation-reason enum, promised by the client but not yet delivered
- `Q-05` ✅ — resolved: priority is a binary Now/Scheduled flag with no effect on price or routing
- `Q-17` ✅ — resolved: the customer-facing 24-hour SMS session is a separate surface from per-job dispatcher chat

---

## UX implications

**The status control is a guided stepper, not a dropdown.** Because the state machine is fixed and company-uniform (`JOB-005`), every dashboard's job-detail screen should expose only the single legal next transition (or Cancel), never a free-choice list of all possible states — this also directly serves the developer's own concern about filtering/tracing jobs reliably by state at scale (`Rule 02 · R02-5`).

**Arrival confirmation is one explicit action, not a passive map event.** Design it as a clear, deliberate "Confirm Arrival" control in the technician app that visibly also captures location — not a background GPS trigger the technician doesn't see happening (`JOB-007`).

**Cancellation always opens a reason picker.** No cancel action should complete without a reason selected (`JOB-009`); until the full enum arrives (`Q-21`), design the picker to be easily extendable rather than hardcoding three options as if they were final.

**Reassignment needs its own visual treatment, distinct from cancellation.** A reassigned job is not cancelled from the system's point of view, but reads that way from the original technician's history — the job-detail timeline and the technician's own job list need to represent this transition clearly (e.g. "Reassigned to [technician]" rather than silently vanishing from the original technician's list).

**The Service Call Fee needs a place in the payment breakdown for incomplete jobs.** Every job that closes as Cancelled should be able to show whether a Service Call Fee was assessed and its outcome, consistent with the itemized-breakdown principle already established for completed jobs (`Rule 02 · R02-6`, module `07`).
