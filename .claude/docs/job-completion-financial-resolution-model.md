# Job-completion financial resolution model

**Status:** design model, not yet implemented in the prototype. This document is the deliverable requested directly by the designer in this session — analysis first, code second.

**Source tag used throughout:** `[USER:2026-08-28]` marks a claim taken verbatim/near-verbatim from the designer's own message this session. It is a new tag alongside the four defined in [`Rule 00 · R00-3`](../rules/00-working-agreement.md) (`[T:]`, `[C:]`, `[FIG:]`, `[ASSUMPTION]`, `[OPEN]`) — the designer is speaking with the client's authority in this exchange, not citing a transcript, so it gets its own tag rather than being folded into `[T2:]`. Everything not tagged `[USER:2026-08-28]` is either an existing rule (cited by ID) or an explicit `[ASSUMPTION]`/`[OPEN]` on my part.

This model touches three things the designer corrected/extended in one message:

1. The company dispatcher's first action on any job is always **Assign to Technician** — there is no "assign to company" step for them `[USER:2026-08-28]`.
2. The company dispatcher can **cancel a job at any point** before it closes `[USER:2026-08-28]`.
3. A **completed** job can subsequently carry a **refund** track and/or a **dispute** track, each with its own multi-step sub-state-machine, and the dispute track is partly **automated** (gateway-driven) `[USER:2026-08-28]`.

---

## Part A — Job intake: no "assign to company" step for the company dispatcher

**The rule, as stated:** *"the company dispatcher shouldn't have an option 'assign to company' because he is in the company. whether he got the job from the platform or created the job. the first step for him is to assign to a technician."* `[USER:2026-08-28]`

**What this doesn't change:** the live product's confirmed behavior is already a single "Assign Technician" action with no separate acceptance ceremony (`.claude/audit/company-dispatcher/incoming-jobs/incoming-jobs.md`). The `assigned_to_company` job status itself is still real and necessary — it's how the platform dispatcher hands a job to a company, and how the system tracks "this job is with the company, no technician yet." The correction is about **who takes an action against that status, and what the action is called** — not about deleting the status.

**The actual bug this catches:** in `company-dispatcher/NewJob.tsx`, a company-created job with no technician picked at creation time was given `status: 'assigned_to_company'` — the exact same status a platform-routed job gets before the company has looked at it. Because `JobDetail.tsx` gates the Accept/Refuse buttons purely on `job.status === 'assigned_to_company'` with no origin check, a company dispatcher looking at **their own job** currently sees **Accept & Assign to Technician** and **Refuse** — and "refuse" a job you created yourself for your own customer is nonsensical.

**Corrected rule (proposed `JOB-010`):**

| Origin | Status | Available action(s) | Never available |
|---|---|---|---|
| `platform` | `assigned_to_company` | **Accept & Assign to Technician** (combined — matches the confirmed-live single-action pattern) · **Refuse** (sends it back to the platform, unchanged) | — |
| `company` | `assigned_to_company` | **Assign to Technician** only | Accept, Refuse — a company cannot refuse its own job; the equivalent action is **Cancel** (Part B) |

The underlying `JobStatus` enum and `JOB_STATUS_FLOW` array need no new value — the fix is entirely in **which actions the UI offers**, gated by `job.origin` in addition to `job.status`. `AssignTechnicianModal` already supports being invoked with different copy per context (`title`/`confirmLabel` props exist for this from the transfer-flow work); the same modal serves both origins, just under a plain "Assign to Technician" label for company-sourced jobs instead of "Accept & Assign."

**Secondary consideration, not a rule change:** the `StatusStepper` shown on Job Detail renders all 8 `JOB_STATUS_FLOW` steps including "Assigned to Company," even for a company-sourced job. This is a read-only historical/pipeline view (not an action), so it isn't wrong the way the Accept/Refuse buttons were — but showing "Assigned to Company" as a milestone on a job the company created itself may still read oddly to that dispatcher. Recommendation: leave the data model and step list as-is (it stays useful for Platform Admin/Dispatcher's own read-only view of the same job, where "assigned to company" is a genuinely meaningful platform-side event), and treat this purely as copy/display polish if the designer wants it addressed — not a new open question, not blocking.

---

## Part B — Cancel at any time

**The rule, as stated:** *"also he can update the job status to cancled in any time."* `[USER:2026-08-28]`

Today the company dispatcher has **no cancel action at all** — `StatusStepper` is invoked read-only (`<StatusStepper status={job.status} />`, no `onCancel`) on `company-dispatcher/JobDetail.tsx`. This is a net-new capability, not a correction to an existing one.

**Corrected rule (proposed `JOB-011`), refined 2026-08-28:** *"the company dispatcher who didn't accept an incoming job assigned to him from the platform dispatcher can't cancel the job, he can just accept or reject. if he accepted then he got the full control, both he and the platform dispatcher who originally created it."* `[USER:2026-08-28]` Cancel is **not** available the moment a platform-sourced job lands in `assigned_to_company` — at that point the only two choices are Accept (& assign to technician) or Refuse, exactly as Part A already describes. The dispatcher only gains Cancel once they've taken ownership: immediately for a company-sourced job (it was always theirs, no accept step exists per Part A), or from `assigned_to_technician` onward for a platform-sourced job that's been accepted. Once accepted, control is **shared** — the platform dispatcher who originally created the job retains full control too (already true and unchanged: Platform Dispatcher's Job Detail has always had unconditional advance/cancel per the earlier fidelity corrections).

Concretely: `canCancel = !terminalStatus && !canAcceptOrRefuse`, where `canAcceptOrRefuse` is exactly Part A's platform-sourced-and-not-yet-accepted condition. Terminal statuses (`completed`, `cancelled`, `archived`) can never be cancelled either way — a completed job is handled by the refund/dispute tracks in Parts C–D instead, never by reopening it into `cancelled`. Reason still required from the existing `CancellationReason` enum (still incomplete pending the client's promised full list, `Q-21`).

**Service Call Fee mechanics — partially resolved 2026-08-28.** *"for reason lists, actually this doesn't matter a lot — for example when cancelling a job, if the reason was customer is not available or any other reason, enter a fee amount and generate [a] payment link that is sent as a message to the customer number."* `[USER:2026-08-28]` This gives `Q-20` a concrete mechanism for the first time: cancelling with certain reasons (not necessarily all — "customer is not available or any other reason" reads as "this reason and, generally, others too," not an exhaustive gate) lets the dispatcher **enter a fee amount** and the system **generates a payment link and sends it by SMS to the customer's number**. This is the first concrete design of the previously-undesigned **payment link** feature (`NEW-REQUIREMENTS.md §3.10`) — its first real trigger point is a cancellation fee, not a normal job payment.

**Reason-list scope, clarified 2026-08-28.** *"as this is just a prototype the dev can decide the list of reasons and also if there are other fees fields to add. here we clear the main example in the prototype as we can't design the flow for each specific reason here. same thing for any status that have re[a]sons and fees."* `[USER:2026-08-28]` This relaxes `Rule 00 · R00-4` specifically for **reason-code enum values** in this prototype (not for the surrounding business logic, which stays as analyzed): the designer has explicitly authorized picking a plausible placeholder list rather than blocking on the client. Applies to every reason-carrying transition in this model — cancellation reasons, refund request/rejection reasons alike. The instruction is equally explicit about scope discipline: build **one representative flow well** (cancel → fee → payment link → SMS), not bespoke branching logic per individual reason value.

**Implementation note (updated):** `CancelJobModal` (built for Platform Dispatcher) is extended with an optional fee-amount field, not replaced — same reason-required contract, now wired to Company Dispatcher (which had no cancel path at all) plus the new optional fee/payment-link step.

---

## Part C — Refund sub-flow (post-completion, dispatcher-driven)

**The rule, as stated:** *"when the job is completed the dispathcer can update to a refund as the user can ask for a refund after every thing is completed. the the dispatcher can update the job status to request a refund (entering the reasons, selection from a list options and optional description) then he can update it again to refunded (specify full refund or partial and insert the the amount), or refund rejected with selecting reasons."* `[USER:2026-08-28]`

This is new, specific detail on top of `Q-15`'s previously-vague "refund is informal, no described request form" — it now has a real three-step shape, and it names the acting role explicitly: **the company dispatcher**, for both the request step and the decision step. There is still no second approver described (nobody countersigns above the dispatcher) — same open point `Q-15` had, just now attached to a defined workflow instead of a vague one.

### State machine

```
completed (financialFlag: none, refundStatus: none)
        │
        │  Company Dispatcher: "Request Refund"
        │  — reasonCode (from a list) + optional free-text description
        ▼
completed (financialFlag: refund, refundStatus: requested)
        │
        ├─ Company Dispatcher: "Approve Refund"
        │  — type: full | partial; amount required if partial
        │      (full auto-fills to the amount owed / finalPrice)
        ▼
completed (financialFlag: refund, refundStatus: refunded)

        ├─ Company Dispatcher: "Reject Refund"
        │  — rejectionReasonCode (from a list)
        ▼
completed (financialFlag: refund, refundStatus: rejected)
```

`job.status` itself **never leaves `completed`** during this whole track — the job is done; the refund track is an overlay, exactly like the existing `financialFlag`/`*Detail` pattern already used for the current mock data's refund/dispute/backcharge fields.

### Data fields needed

```ts
type RefundStatus = 'none' | 'requested' | 'refunded' | 'rejected'

interface RefundRequest {
  reasonCode: string        // [OPEN] Q-22 — enum values not given
  description?: string      // optional free text, confirmed [USER:2026-08-28]
  requestedAt: string
  requestedBy: string       // Company Dispatcher name
}

interface RefundResolution {
  outcome: 'refunded' | 'rejected'
  type?: 'full' | 'partial'         // only when outcome === 'refunded'
  amount?: number                    // only when outcome === 'refunded'
  rejectionReasonCode?: string       // only when outcome === 'rejected'; [OPEN] Q-22
  decidedAt: string
  decidedBy: string
}

interface RefundDetail {
  status: RefundStatus
  request?: RefundRequest
  resolution?: RefundResolution
}
```

This **replaces** the current flat `RefundDetail` (`{ amount, reason, issuedBy, issuedAt }`), which only modeled the after-the-fact record of an already-issued refund and has no request/decision split.

### Ledger implications (`FIN-S-003`, `FIN-F-002`)

- **Request** step moves no money → no transaction row.
- **Approve** step appends one `refund` transaction, signed negative, `amount` = the entered full/partial amount — same `TransactionType` already in the ledger, no new type needed.
- **Reject** step moves no money → no transaction row. (Recommendation: keep `financialFlag: 'refund'` even on rejection rather than reverting to `'none'`, so reporting can distinguish "refund never raised" from "refund raised and denied" — the fine-grained truth lives in `refundDetail.status`, not in `financialFlag` alone.)

### Open points this section raises (see Part I)

- `Q-22` (new) — the actual reason-code lists for request and rejection are undefined; the designer said "selection from a list" but didn't supply the list.
- `Q-25` (new) — can a `rejected` (or `refunded`) cycle be reopened if the customer asks again? Not stated either way.

---

## Part D — Dispute sub-flow (bank-initiated, partly automated)

**The rule, as stated:** *"this dispute is actually done by the customer contact the bank and deny the payment action, then the bank refund him the amount and disputed the action while giving the payment issuer (platform or the company) a period to give proof documents to charge it back again. the dispute could be partial or full. this dispute should be automated so when the back made it the gateway should give a feedback with the transaction and the system should update the relevent job automatically. Now when the tenant solve the dispute issue it could update it to setled with the amout the got back again."* `[USER:2026-08-28]`

This is meaningfully more precise than the previous state of `Q-15`/the financial BRD summary, which only had "bank-initiated, notified via the gateway's dispute API, 30–60 day evidence window (unconfirmed)." Two new facts:

1. **The dispute's *opening* must be system-automated**, not a manual entry by any dispatcher/admin: the payment gateway calls back into JobixFlow with the transaction reference when the bank files the chargeback, and the system locates and updates the linked job on its own.
2. **The dispute's *resolution* (win case) is a manual action** by "the tenant" — after resolving the chargeback with the bank/gateway externally, a human comes back into JobixFlow and marks it **Settled**, entering the amount actually recovered.

"Payment issuer (platform or the company)" confirms the existing `gatewayMode` split still governs who's on the hook: if the company runs its own gateway, the company is the merchant of record and the company's own wallet/wallet-visible role handles it; if on the platform's gateway, the platform is the merchant of record. This is not new — it's `FIN-W-002` applied to disputes specifically, now confirmed to extend to who receives and answers the chargeback, not just who sees the money.

### State machine

```
completed (financialFlag: none, disputeStatus: none)
        │
        │  [AUTOMATED] Payment gateway webhook — bank filed a chargeback
        │  system resolves Job + Invoice + Payment + Technician (FIN-F-003)
        │  captures: disputedAmount, isPartial, gatewayTransactionRef, openedAt
        ▼
completed (financialFlag: dispute, disputeStatus: opened)
        │  → if technician was already paid out for this job: auto-create a
        │    Backcharge for their commission share only (FIN-F-006/007,
        │    existing rule — unchanged)
        │  → freeze/deduct the disputed amount in the relevant wallet
        │    (platform or company, per gatewayMode)
        │  → evidence window opens (length still unconfirmed, see below)
        │
        │  Evidence submission itself happens OUTSIDE JobixFlow, through the
        │  gateway's own dispute-resolution portal — there is no described
        │  in-app "submit evidence" action [ASSUMPTION, low-risk: consistent
        │  with both this session's wording and the original BRD note that
        │  the gateway's own dispute API is the notification channel]
        │
        ├─ [MANUAL] Company Admin or Platform Admin (per gatewayMode)
        │  — "Mark Settled", enters settledAmount (what was actually
        │    recovered — may be less than disputedAmount)
        ▼
completed (financialFlag: dispute, disputeStatus: settled)
        → release frozen funds, reverse/remove any backcharge created above
          (existing rule, unchanged: "company wins → refund, remove
          deductions and backcharges, release frozen technician funds")

        ├─ [OPEN — Q-24] "Lost" branch — not addressed this session.
        │  Carried forward from the earlier model as a necessary branch
        │  (a window + evidence requirement implies a losing outcome is
        │  possible), but neither its trigger (manual mark vs. automatic
        │  deadline expiry) nor its acting role was reconfirmed today.
        ▼
completed (financialFlag: dispute, disputeStatus: lost)
        → frozen funds permanently deducted; any backcharge stands;
          technician bears only their commission share, dispatch/gateway
          fees never returned (FIN-F-006/007, unchanged)
```

**Who marks "Settled"? Resolved 2026-08-28.** *"currently let we say the company dispatcher is the one who have highest control on the job so can decide to refund or reject, the admin can only see the audit logs."* `[USER:2026-08-28]` — the **Company Dispatcher** holds both the refund decision (Part C, already established) and the dispute-resolution decision (Settled/Lost). Both admin roles (Company Admin, Platform Admin) are **observers only** for this entire domain — audit-log visibility, no action buttons — regardless of `gatewayMode`. This supersedes the earlier `[ASSUMPTION]` in this section, which had guessed Company Admin / Platform Admin.

### Data fields needed

```ts
type DisputeStatus = 'none' | 'opened' | 'settled' | 'lost'

interface DisputeDetail {
  status: DisputeStatus
  disputedAmount: number
  isPartial: boolean              // "the dispute could be partial or full" [USER:2026-08-28]
  gatewayTransactionRef: string   // what the webhook payload keys off of
  openedAt: string                // system-set, from the gateway webhook — never hand-entered
  evidenceDeadlineDays?: number   // still [OPEN], see Q-15's existing 30–60 day estimate
  technicianAlreadyPaid: boolean  // existing field, drives the auto-backcharge branch
  settledAmount?: number          // only once status === 'settled'
  settledAt?: string
  settledBy?: string              // Company Admin / Platform Admin name
}
```

This **replaces** the current flat `DisputeDetail` (`{ amount, reason, status: 'open'|'won'|'lost', openedAt, evidenceDeadlineDays, technicianAlreadyPaid }`) — renaming `'open'/'won'` to `'opened'/'settled'` to match the designer's own terminology this session, adding `disputedAmount`/`isPartial`/`gatewayTransactionRef`/`settledAmount`/`settledAt`/`settledBy`, and dropping the free-text `reason` field (a chargeback doesn't come with a dispatcher-entered reason — it comes from the bank via the gateway).

### Ledger implications — the part that most needs a decision

The client's original transaction-type list (`customer_payment`, `refund`, `dispute`, `gateway_fee`, `dispatch_fee`, `technician_commission`, `technician_payout`, `backcharge`, `adjustment`, `transfer_to_company`) has exactly **one** dispute-related type, and the current mock implementation (`signedAmountFor` in `data/mock.ts`) hardcodes `dispute` as always-negative. That was sufficient when a dispute only ever *cost* money. It no longer is:

- **Opened** → append a `dispute` transaction, signed negative, `amount = disputedAmount`, `actingUser`/actor = `System` / `Payment Gateway` (this pattern already exists in the current mock timeline entries — the automation intent was anticipated there even before this model formalized it).
- **Settled** → money comes back. Reusing the same `dispute` type with a positive sign breaks the "every deduction is its own transaction record, never folded into another amount" spirit (`FIN-F-002`) if a report ever sums `dispute` expecting one sign. **Recommendation:** add a new transaction type — `dispute_recovery` — rather than flipping the sign on the existing type. This is a genuinely new addition to the client's original ledger-type list, not something already covered.
- **Backcharge reversal on Settled** → same gap: `backcharge` is currently always-negative too. A reversing entry needs either a new `backcharge_reversal` type or a generic `adjustment` (the type already used for "manual correction to a draft weekly line item" — reusing it here would broaden its meaning beyond that one described case).

Both are flagged as `Q-23` (Part I) rather than decided here, because this is exactly the kind of change that needs the client's sign-off before touching the ledger — per the designer's own framing, this is "very critical to accountancy and reporting."

---

## Part E — Consolidated status model

`job.status` (the operational lifecycle) is unaffected by any of this — refund and dispute are strictly post-`completed` overlays, never alternate values of `job.status` itself. The full mental model:

```
job.status         : new_job → assigned_to_company → assigned_to_technician → confirmed_by_call
                      → technician_on_the_way → technician_arrived → work_in_progress → completed
                      (branches: company_refused, technician_refused, cancelled)

job.refundDetail    : none → requested → { refunded | rejected }     [only reachable from completed]
job.disputeDetail   : none → opened    → { settled   | lost     }    [only reachable from completed]
```

A single completed job can carry **both** a refund and a dispute over its lifetime (e.g., company voluntarily refunds part of the charge, and separately/later the customer's bank also disputes the remainder) — the designer didn't say these are mutually exclusive, and nothing in the existing rules forbids it. `financialFlag` as a single coarse enum (`'none' | 'refund' | 'dispute' | 'backcharge'`) can't represent "both at once." **Recommendation:** stop treating `financialFlag` as the source of truth once this ships — derive any coarse "flagged" filter/badge from `refundDetail.status !== 'none' || disputeDetail.status !== 'none'`, and keep the two detail objects as the actual state. Flagged as a design decision to confirm, not silently made — see `Q-25`.

---

## Part F — Scenario matrix

Every combination this model needs to support, for building test/demo data and for the eventual UI:

| # | Origin | Path | Outcome |
|---|---|---|---|
| 1 | Company | Created, tech picked immediately | → straight to `assigned_to_technician`, no intake ceremony at all |
| 2 | Company | Created, no tech picked | → `assigned_to_company`, only action = Assign to Technician (Part A) |
| 3 | Platform | Routed to company | → `assigned_to_company`, actions = Accept & Assign / Refuse (unchanged) |
| 4 | Platform | Routed, company refuses | → `company_refused` (unchanged) |
| 5 | Either | Cancelled while `assigned_to_technician` | → `cancelled`, reason required (Part B, new capability) |
| 6 | Either | Cancelled while `technician_on_the_way`/`arrived` (tech already dispatched) | → `cancelled`, reason required; Service Call Fee linkage noted but not resolved (`Q-20`) |
| 7 | Either | Normal completion, no refund/dispute ever | → `completed`, `refundDetail.status: none`, `disputeDetail.status: none` |
| 8 | Either | Completed → refund requested → approved, full | → `refundDetail.status: refunded`, `type: full` |
| 9 | Either | Completed → refund requested → approved, partial | → `refundDetail.status: refunded`, `type: partial`, `amount` < finalPrice |
| 10 | Either | Completed → refund requested → rejected | → `refundDetail.status: rejected`, no ledger entry |
| 11 | Either | Completed, no refund → bank dispute opens automatically, full, technician not yet paid | → `disputeDetail.status: opened`, `isPartial: false`, no backcharge (nothing to reverse) |
| 12 | Either | Completed, technician already paid → bank dispute opens automatically | → `disputeDetail.status: opened` **and** an auto-created `backcharge` for the technician's commission share |
| 13 | Either | Dispute opened → tenant marks Settled | → `disputeDetail.status: settled`, `settledAmount` recorded, frozen funds released, any backcharge from #12 reversed |
| 14 | Either | Dispute opened → [OPEN, `Q-24`] Lost | → `disputeDetail.status: lost`, funds stay deducted, backcharge (if any) stands |
| 15 | Either | Completed, partial bank dispute (not the full charge) | → `disputeDetail.isPartial: true`, `disputedAmount` < finalPrice |
| 16 | Either | Refund rejected on a job, *then* a bank dispute opens on the same job later | → both `refundDetail` and `disputeDetail` populated on one job — see Part E's `financialFlag` note |

---

## Part G — Actor / action summary

| Actor | Action | Precondition | Result |
|---|---|---|---|
| Company Dispatcher | Assign to Technician (own job) | `origin: company`, `status: assigned_to_company` | `status: assigned_to_technician` |
| Company Dispatcher | Accept & Assign to Technician (platform job) | `origin: platform`, `status: assigned_to_company` | `status: assigned_to_technician` |
| Company Dispatcher | Refuse (platform job only) | `origin: platform`, `status: assigned_to_company` | `status: company_refused` |
| Company Dispatcher | Cancel Job | any non-terminal status | `status: cancelled` + reason |
| Company Dispatcher | Request Refund | `status: completed`, `refundDetail.status: none` | `refundDetail.status: requested` |
| Company Dispatcher | Approve Refund | `refundDetail.status: requested` | `refundDetail.status: refunded` + ledger `refund` row |
| Company Dispatcher | Reject Refund | `refundDetail.status: requested` | `refundDetail.status: rejected` |
| **System** (gateway webhook) | Open Dispute | `status: completed` | `disputeDetail.status: opened` + ledger `dispute` row + conditional backcharge |
| Company Dispatcher | Mark Settled | `disputeDetail.status: opened` | `disputeDetail.status: settled` + ledger `dispute_recovery` row *(new type, `Q-23`)* + backcharge reversal |
| Company Dispatcher *(trigger mechanism still `[OPEN]`, `Q-24`)* | Mark Lost | `disputeDetail.status: opened` | `disputeDetail.status: lost` |
| Company Admin / Platform Admin | *(no action — audit-log visibility only, confirmed 2026-08-28)* | — | — |

---

## Part H — Reporting implications

The designer explicitly framed this as "critical to accountancy and reporting for all relevant stakeholders" — concretely, this model changes what the Company/Technician weekly statements (`NEW-REQUIREMENTS.md §3.8`) and the Financial Transactions ledger need to show:

- A completed job's row in any report can no longer be summarized by a single "flag" — it needs to show refund and dispute as **independent tracks**, each with its own status, so a report answers "how many jobs had a refund requested vs. actually paid out" separately from "how many jobs are under an open dispute vs. settled vs. lost."
- The technician statement's `backcharges` line needs both directions: backcharges *created* (dispute opened, technician already paid) and backcharges *reversed* (dispute settled) — currently only the creation direction has a modeled transaction type.
- The two new/ambiguous ledger types (`dispute_recovery`, and whatever handles backcharge reversal) are the concrete blocker for building an accurate Company Wallet / Financial Transactions screen for this flow — see `Q-23`.

---

## Part I — Open questions raised or updated by this session

New entries needed in [`open-questions.md`](open-questions.md) (English canonical file updated alongside this document; the Arabic counterpart, `open-questions.ar.md`, is **not** updated for the `Q-15` addendum or the new `Q-22`–`Q-25` entries in this pass — there is no genuine Arabic-source quote to cite for them per `Rule 00 · R00-6`, since this input came from the designer directly in English this session rather than from a transcript. This is a tracked translation debt, not an oversight):

- **`Q-15` — resolved 2026-08-28.** Company Dispatcher holds both the refund decision and the dispute-resolution decision; both admin roles are audit-log-only observers, no approval gate above the dispatcher for either. See the addendum in Part D above.
- **`Q-20` — partially resolved 2026-08-28.** Cancellation can carry a dispatcher-entered fee amount, delivered to the customer as an SMS'd payment link. Still open: whether *every* cancellation reason permits this or only some, and the exact fee-calculation logic (if any beyond manual entry) — the designer's own account of the trigger is "if the reason was X or any other reason," which reads as broad rather than an exhaustive enumerated gate.
- **`Q-22` — scope relaxed 2026-08-28 for prototype purposes.** The designer explicitly authorized the prototype to use a dev-authored placeholder reason-code list rather than blocking on the client for exact values — see the addendum in Part B above. This is **not** the same as the business question being closed; a real client-approved list is still needed before this leaves prototype status, just no longer a build-blocker here.
- **`Q-23` (new, still open)** — the client's original Financial Transactions type list has no entry for a dispute *recovery* (money coming back after Settled) or a backcharge *reversal*. Needs either two new transaction types or a defined reuse of an existing one (e.g. `adjustment`) — this is the single most consequential open point for the accountancy/reporting goal stated this session, and reason-list relaxation doesn't touch it.
- **`Q-24` (new, still open)** — the dispute "Lost" outcome: is it manually marked (symmetric to Settled) or auto-detected when the evidence deadline passes with nothing submitted? Not addressed this session; carried forward from the pre-existing model as a structurally necessary branch. (The *role* half of this question is now resolved — Company Dispatcher, per `Q-15` above — only the trigger mechanism remains open.)
- **`Q-25` (new, still open)** — can a resolved refund cycle (`refunded` or `rejected`) be reopened, or a second refund requested later on the same completed job? Can a settled/lost dispute reopen (e.g. a second chargeback attempt on the same transaction)? Neither addressed.

---

## Part J — Implementation notes (deferred — not built yet)

Kept short deliberately; this document's job was the model, not the build.

1. `types.ts` — replace flat `RefundDetail`/`DisputeDetail` with the request/resolution and status-carrying shapes in Parts C/D. `dispute_recovery`/backcharge-reversal ledger types deferred until `Q-23` is answered — the prototype's `Transaction` ledger itself isn't being extended in this pass, only the job-level detail objects.
2. `AssignTechnicianModal` already supports per-context copy (`title`/`confirmLabel`) — reused directly for the origin-gated Part A fix, no new component needed.
3. `CancelJobModal` extended (not replaced) with an optional fee-amount field; confirming with a fee > 0 generates a mock `PaymentLink` and records it as "sent" — no real SMS/gateway integration exists, this is a seed/mock representation only.
4. New components: a combined refund request/decision modal set, and dispute Settle/Lost actions surfaced directly on the Dispute detail card — all gated to Company Dispatcher only, per the resolved `Q-15`.
5. Since there is no real payment gateway in this prototype, "the gateway sends feedback automatically" can't be a live webhook — the honest prototype equivalent is a **seed-data-only** automated-looking dispute (already how the current mock data's `actor: 'Payment Gateway', role: 'System'` timeline entries work), not a button a human clicks to "open" a dispute. Only the Settle/Lost transition is a real clickable action in the UI.
6. Reason-code enums (cancellation, refund request, refund rejection) are dev-authored placeholders per the 2026-08-28 scope relaxation — plausible, not client-sourced, and should be swapped for the real list the moment the client supplies one.

**Implemented 2026-08-28** — see [[jobixflow-refund-dispute-model]] in memory for the final list of files touched.
