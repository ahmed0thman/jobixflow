# New requirements — traced from CLAUDE.md

This document answers one question: **what is actually new**, as opposed to how the existing system already works. It was produced by tracing the citation chain the workspace itself defines, starting at `CLAUDE.md`:

```
CLAUDE.md
 ├─ "The new requirements" section (the summary)
 ├─→ .claude/docs/sources/INDEX.md            (source catalog + precedence rules)
 │    ├─→ client/features/major-changes.txt   (client's own words — highest authority)
 │    └─→ .claude/docs/sources/2026-08-17-client-followup/NOTES.md  (client, live Q&A)
 ├─→ .claude/docs/BRDs/*.md                   (synthesized, each with its own
 │                                              "Requested changes" section)
 ├─→ .claude/docs/open-questions.md           (what's resolved vs. still blocking)
 └─→ .claude/rules/01-business-invariants.md  (the enforceable rule IDs)
```

Per this workspace's own conventions (`Rule 00`), every claim below carries a tag: `[C:§…]` = client's written file, `[T2:<line>]` = 2026-08-17 client follow-up meeting, `[T:<line>]` = 2026-08-05 developer handover, `Q-nn` = open question, rule IDs (`TEN-*`, `COM-*`, `FIN-*`, `JOB-*`, `AUD-*`) = enforceable business invariants. Only four BRD modules currently exist in English (`00` glossary, `01` roles, `02` jobs, `07` finance) — items below with no matching BRD module are traced directly from `CLAUDE.md` + the source transcripts and marked as such.

**What's excluded:** the reusable Figma DataTable/Filter/Actions master component is a *design-process agreement*, not a client-requested feature — it's how the designer builds things, not a thing the client asked for. Not listed as a requirement here; see `Rule 02 · R02-2` if relevant.

---

## 1. Multi-tenancy — companies get their own book of business

**What's new:** companies may now add customers and jobs sourced entirely outside the platform (people who called the workshop directly), not just platform-dispatched work.

- Every job carries an **origin** field — platform-sourced or company-sourced — never absent → `TEN-001`
- Company data (jobs, customers, technicians, finances) is **fully isolated** — no company sees another's, in any list, filter, search, export, or aggregate count → `TEN-002`
- Financials and reports must **separate** platform-sourced from company-sourced revenue
- The company gets its **own admin dashboard flow** for this — the platform's value proposition shifts to monitoring/organization/financial control, not lead generation

**Source:** `[T:172-176]` (developer handover); synthesized in `CLAUDE.md` §"1. Multi-tenancy". No dedicated BRD module exists yet — `BRDs/01-actors-roles-permissions.md` flags it only in passing under "Requested changes".

**Open / blocking:**
- **`Q-18`** 🟡 — who performs intake for a company-sourced job? (Company dispatcher? Company admin? A new role?) Not addressed even in the 2026-08-17 follow-up.
- **`Q-06`** ✅ *resolved* — platform visibility into company-sourced jobs is gated by whether the company is fully self-sufficient on its own payment gateway *and* its own Twilio number, not by origin as a standalone flag `[T2:32-34]`.

---

## 2. Twilio masked calling & SMS

**What's new:** the entire masked-communication layer — nothing like it exists in the live system today.

**Calls**

- On job creation, bind: real customer number + real technician number + a Twilio proxy number + Job ID `[C:§1]`
- Technician calls **only from inside the app** — never dials directly → `COM-003`
- Customer sees the Twilio number, never the technician's real number → `COM-002`
- If the customer calls the Twilio number back: server receives a webhook (From/To), looks up the active job for that customer+number pair, and routes the call to the currently assigned technician `[C:§1]`
- The technician sees **only the Twilio number**, never the customer's real number, even when receiving a routed callback → `COM-001`
- No active job → route to dispatch (not to any technician) → `COM-005`
- Preferred implementation: a Twilio Proxy Session per job, or a custom system keyed on From + To + Active Job + Assigned Technician `[C:§1]`

**SMS** — identical rules, same Twilio number as the job's call binding:

- Technician sends SMS only from inside the app, never sees the customer's real number `[C:§1]`
- Customer receives/replies via the Twilio number only; replies arrive via webhook and get routed back to the technician in-app (or to their real number while still masking the customer's) `[C:§1]`

**Binding lifecycle**

- Stays active for **24 hours** after job close/cancel, then disabled → `COM-004`
- Follows **whichever technician currently holds the job** — a reassignment moves the binding to the new technician, not the original one → `COM-004`, refined `[T2:129]`
- After the 24-hour window, routing depends on job **origin**: company-relevant jobs → company dispatcher; platform-sourced jobs → back to the platform → refines `COM-005` `[T2:131-137]`

**Newly clarified mechanics (2026-08-17):**
- The 24-hour SMS session is a **separate surface** from per-job dispatcher chat — the technician's in-app SMS lands as an ordinary SMS in the customer's native phone messaging app; the customer needs no app or login `[T2:187-191]` — resolves `Q-17`
- Call/SMS recordings live in **Twilio itself**; the platform stores and displays a **link**, not the raw file `[T2:196-200]`
- **Each company supplies its own Twilio number and subscription** — the platform does not issue it, and the number can change **at any time** the company chooses (not on a fixed cycle, as earlier assumed) → resolves `Q-10` `[T2:143-146]`. Only call/message *logs* are retained regardless of number changes — records aren't versioned against a specific number.
- Each company must hold its **own Twilio API credentials directly with the provider** (KYC/liability reasons) — the platform only performs the connection, never re-sells or co-signs access `[T2:154-157]`

**Source:** `[C:§1]` (client's written file, highest authority) + `[T2:125-146]`. Rule IDs live in `.claude/rules/01-business-invariants.md`; no dedicated Communications BRD module exists yet (noted as a gap in `BRDs/02-jobs-and-lifecycle.md`).

---

## 3. Financial system — the largest single piece of new work

**Current state: almost nothing exists.** *"We never reached the payment stage at all"* `[T:216]`; *"we haven't done anything to do with payment"* `[T:218]`. Everything below is new design, not modification (`BRDs/07-finance-wallets-and-payments.md`).

### 3.1 Three financial levels

```
Platform Wallet  → owner only, covers ONLY platform-gateway companies → FIN-W-001, FIN-W-002
Company Wallet   → one per company, fully isolated                    → FIN-W-003
Technician Account → one per technician, company-scoped only          → FIN-W-009
```

- **Platform Wallet** — customer payments, platform commission, gateway fees, refunds, disputes/chargebacks, company balances, transfers to companies `[C:§2.I]`. Companies on their own gateway never appear here → `FIN-W-002`.
- **Company Wallet** — card payments, refunds, disputes, expenses, technician payouts, adjustments, reports `[C:§2.II]`.
- **Technician Account** (deliberately called an *account*, not a wallet) — completed jobs, commission %, cash received, card earnings, dispatch fees, gateway fees, deductions, backcharges, amounts received from company, **final signed balance** (owed to or by) `[C:§2.III]` → `FIN-W-010`.

**Newly resolved (2026-08-17) — what a "wallet" actually is:** a **derived transaction log / source of truth**, not a movable-funds account. No technician-to-technician or peer transfer exists anywhere in the product — an engineer once proposed this and the client rejected it outright `[T2:6-16]` → `FIN-W-012`. Resolves `Q-01` ✅. Design implication: wallet screens are statements/ledgers with drill-down, never send/receive interfaces.

### 3.2 Payment arithmetic

Two flows run in **opposite directions**:

**Cash** (technician ends up owing the company):
1. Customer pays technician in cash
2. Job-tied expense deducted from gross first, if any (tagged paid-by-technician/paid-by-company)
3. Technician keeps the remainder
4. Commission computed on the post-expense amount
5. Dispatch fee deducted
6. Remainder is **due to the company**; system records cash-in-hand owed → `FIN-W-004`

**Card** (company ends up owing the technician):
1. Customer pays by card → money enters the **company wallet**
2. Job-tied expense deducted from gross first
3. Gateway fee deducted (default **3%**, editable)
4. Commission computed
5. Dispatch fee deducted
6. Net technician dues recorded, to be paid later → `FIN-W-005`, `FIN-W-006`

**Every deduction is its own transaction record** — never folded into another amount → `FIN-F-002`. Fixed deduction order on card: expense → gateway fee → commission → dispatch fee → `FIN-W-006` (confirmed `[T2:50-54]`).

### 3.3 Company settings

Per-company configurable: commission % per technician, dispatch fee, gateway fee (3% default, editable), gateway selection, platform-vs-own gateway toggle `[C:§2.Settings]`. Up to **three gateways** with independent API credentials — softened 2026-08-17 to "no fixed cap," two-or-three as a starting point `[T2:151]` → `FIN-W-008`. **New:** each company must obtain its **own** gateway API credentials directly from the provider — the platform connects but never re-sells/co-signs `[T2:154-157]` → `FIN-W-016`.

### 3.4 Disputes vs. refunds — now distinct mechanisms (2026-08-17)

Previously conflated; now explicitly separated `[T2:159-169]`, and must be tracked as **distinct job states**, never merged:

- **Refund** — informal. Customer calls with a complaint; company voluntarily returns money (full or partial) as a goodwill gesture. No formal request workflow described.
- **Dispute/chargeback** — bank-initiated. Customer's bank reverses the charge; company is notified via the payment gateway's own dispute API; gets an estimated (unconfirmed) 30–60 day window to submit evidence.

Every dispute links to **Job + Invoice + Payment + Technician**, all four, always → `FIN-F-003`. On open: freeze or deduct from company wallet; unpaid technician → freeze their share; already-paid technician → create a **Backcharge**. Company wins → refund, remove deductions/backcharges, release frozen funds. Company loses → technician bears **only their commission share**; dispatch/gateway fees are **never returned** to the technician → `FIN-F-006`, `FIN-F-007`.

**Open:** `Q-15` 🟠 — no role/approval path named for who issues a refund or approves a dispute response.

### 3.5 Expenses — newly defined (2026-08-17)

Job-tied **operational costs only** (e.g. a $30 key/key-code purchase) — **not** a general business-expense ledger. Deducted from the job's gross **before** commission math. Tagged by the technician at job close-out as paid-by-technician (reimbursed) or paid-by-company `[T2:47-54]` → `FIN-W-013`. Resolves `Q-16` ✅.

### 3.6 Invoicing — confirmed as real, narrowly scoped (2026-08-17)

The **technician decides per job** whether to send an invoice at all. Every invoice carries the **company's own name only** — no logo required, and the platform's branding **never** appears on it → `FIN-W-014`, `FIN-W-015` `[T2:205-210]`. Resolves `Q-12` ✅.

### 3.7 Service Call Fee — brand-new concept, first named 2026-08-17

A standalone charge, separate from job price/dispatch fee/gateway fee, covering a technician's wasted trip when a dispatched job doesn't reach completion (customer self-resolved, refused to pay, or job reassigned mid-trip) `[T2:105-124]`. No legal mechanism compels payment if the customer refuses — the client's own account is genuinely binary (collected or not) `[T2:107, 123]`.

**Open:** `Q-20` 🟠 — calculation and assessment mechanics entirely unconfirmed. Do not design transaction/UI details beyond recognizing it as a fee *type* until answered.

### 3.8 Weekly financial cycle

Fixed week: **Monday 00:00 → Sunday 23:59** → `FIN-S-001`. A job counts in the week it **completed**, not the week it was created → `FIN-S-002`. Auto-generates at week end:

- **Company statement:** total revenue, cash, card, gateway fees, dispatch fees, refunds, disputes, company profit, wallet balance, technician balances `[C:§WeeklyCycle]`
- **Technician statement:** job count, cash collected, card earnings, total commission, dispatch fees, gateway fees, deductions, backcharges, total paid, final balance — **drives the weekly payout** `[C:§WeeklyCycle]`

**Newly clarified (2026-08-17):** no formal "approval" step — a manual adjustment path exists to correct a *draft* report line item before it finalizes (not a rewrite of a posted balance, so it doesn't violate `FIN-S-003`). Actual settlement (technician↔company) happens **off-platform** (in-person cash, Zelle, Cash App); the platform only records that it was confirmed/collected `[T2:36-53]`. Partial answer to `Q-13` 🟠 — still unknown who performs that confirmation.

### 3.9 Financial Transactions ledger

**Balances are never edited manually** — every operation appends a new row → `FIN-S-003`. Types: customer payment, refund, dispute/chargeback, gateway fee, dispatch fee, technician commission, technician payout, backcharge, adjustment, transfer to company `[C:§Transactions]`. Each row carries: transaction number, company, job, invoice, technician (if any), customer (if any), amount, type, datetime, acting user, notes.

### 3.10 Payment links

The platform sends a payment link to the customer's mobile. **No UI has ever existed for this** `[T:182]` — it is the **only customer-facing surface in the entire product**, must work standalone on a phone browser with no login, and needs its own design (trust signaling, amount/job context, card form, success/failure/expired/already-paid states) → `FIN-W-011`.

**Still open, blocking platform-side wallet screens specifically:**
- **`Q-02`** 🔴 — does the platform take a commission, and on what? Weakened but not closed by `[T2:5-18]` (no commission mechanism named verbally, but the written file still lists "platform commission" as a Platform Wallet component — a real, unresolved conflict).
- **`Q-11`** 🟠 — platform revenue on company-sourced jobs is currently handled entirely **off-platform** (manual billing); an in-product subscription feature is future scope, not current, per the client `[T2:35-36]`.
- **`Q-03`** 🟡 — gateway names conflict: written file says Stripe/Square/Authorize.net; client said Stripe/PayPal/Authorize.net verbally `[T2:148]`. Not silently picked.
- **`Q-14`** 🟡 — currency and locale, unaddressed.

---

## 4. Reports overhaul

**What's new:** the existing Reports page is charts-only; the client wants **tables** with full search, date ranges, and per-row detail, for both platform and company scope.

- Filtering requirements confirmed 2026-08-17 `[T2:55-62]`: same-day / same-week / previous-week / **custom date range**, plus condition filters (customer, technician, dispatcher, payment method)
- Hard constraints restated as "most important": reports must **never** cross company boundaries, and a **technician must never see another technician's activity** — reinforces `TEN-002` and adds a new technician-level self-scoping rule
- The **report set itself is still the designer's to propose** — the client's request is deliberately vague; both `CLAUDE.md` and `BRDs/07` say so explicitly

**Company report fields named in the client's written file** `[C:§Reports/Company]`: total revenue, cash revenue, card revenue, funds held by technicians, company wallet balance, technician balances, expenses, gateway fees, refunds, disputes, net profit.

**Technician report fields named** `[C:§Reports/Technician]`: completed jobs, cash collected, card earnings, dispatch fees, gateway fees, total deductions, total amounts received, final balance.

**Source:** `[C:§Reports]` + `[T2:55-62]` + `CLAUDE.md` §"4. Reports overhaul". No dedicated BRD module (`RPT` namespace exists in `Rule 00` but has no populated rules yet) — thin coverage per `Rule 00 · R00-4`, do not pad.

**Open:** `Q-08` 🟠 — partial answer only (filtering confirmed); the actual report inventory beyond the client's two named lists above is still undecided.

---

## 5. Data retention — delete becomes archive

**What's new:** the client explicitly rejected hard deletion of live records.

- The Jobs list's delete control becomes an **Archive** action, gated until a record reaches a minimum age (client's working figure: **one year**, meant to be **admin-configurable**, not hardcoded) → `AUD-002`
- Periodic full export (quarterly/annual) to Excel/CSV before any purge satisfies the underlying US 2-year legal-retrieval requirement
- UI state must read **"Archived,"** never "Deleted" — this wording matters to the client
- A job that has entered the system must reach completion or receive an explicit cancellation with a stated reason — never simply deleted mid-flight → `JOB-006`

**Source:** `[T2:63-77]`. Resolves `Q-07` ✅ 2026-08-17.

**Related — audit log scope, also newly clarified:** the audit log certifies only operations run through the platform's **own** infrastructure. A company fully self-sufficient on its own payment gateway *and* Twilio subscription is **excluded** — pulling in its records would be, in the client's words, "stealing information that belongs to them" `[T2:32-34]` → `AUD-001`. Resolves `Q-06` ✅.

---

## 6. Job lifecycle — newly confirmed / changed detail

Not a wholesale new module (intake-to-close already existed), but the 2026-08-17 follow-up locked down several points that were previously open or assumed, per `BRDs/02-jobs-and-lifecycle.md`'s own "Requested changes" framing:

- **The state machine is fixed and company-uniform** — no company admin or dashboard may add/remove/reorder/rename states. The client was direct: *"the flow is identical for every company, because it reflects how the business itself works"* `[T2:82]` → `JOB-005`. This closes what would otherwise have been an open question about a per-company workflow builder.
- **Canonical flow, confirmed step by step** `[T2:82-101]`: Call intake → Assigned → Accepted/Rejected → Confirmed by call → Started → Arrived → Completed (or Cancelled with reason).
- **Arrival is a manual confirm, not automatic GPS geofencing — by design.** The client explicitly rejected auto-detection, citing GPS inaccuracy on first fix; the technician's single "Confirm Arrival" action both advances state and captures GPS `[T2:89-101]` → `JOB-007`.
- Only **Cancelled** and **Completed** close a job; every other status is informational → `JOB-008`.
- **Cancellation requires a recorded reason** before the action completes → `JOB-009`. Only three reasons confirmed so far (Customer Resolved, Customer Did Not Answer, Wrong Details) — the client promised the **full list** separately via group chat; not yet delivered → `Q-21` 🟠, still open.
- **Job reassignment between technicians** (e.g. price-shopping) is new terrain: from the system's view the job continues normally under the new technician; from the original technician's view it functions like a cancellation for their leg of the job, and may or may not carry a Service Call Fee depending on whether the customer already paid it — tracked loosely via free-text notes, not a defined field `[T2:120-124]`.
- **24-hour callback routing refined** — see §2 above (`COM-004`/`COM-005`).

---

## Summary table

| # | Area | Source coverage | Key blocking/open questions |
|---|---|---|---|
| 1 | Multi-tenancy (company-sourced jobs/customers) | Thin — one BRD mention only | `Q-18` (who does intake) |
| 2 | Twilio masked calling & SMS | Strong — client's own written spec | none blocking; mechanics fully specified |
| 3 | Financial system | Strong (client written file is spec-grade) + several 2026-08-17 resolutions | `Q-02` 🔴 (platform commission), `Q-20` 🟠 (Service Call Fee), `Q-03` 🟡 (gateway names), `Q-15` 🟠 (refund approver), `Q-13` 🟠 (payout confirmation role) |
| 4 | Reports overhaul | Thin — report set undefined | `Q-08` 🟠 |
| 5 | Data retention (archive not delete) | Resolved | — (✅ `Q-07`, `Q-06`) |
| 6 | Job lifecycle refinements | Partial | `Q-21` 🟠 (cancellation reasons), `Q-20` 🟠 (Service Call Fee, shared with #3) |

For the living, authoritative version of every open question (including ones not yet blocking any of the above), see [`.claude/docs/open-questions.md`](.claude/docs/open-questions.md) — this file is a point-in-time trace, not a replacement for it.
