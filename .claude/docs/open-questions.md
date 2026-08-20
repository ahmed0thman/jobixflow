# Open questions

> Arabic version: [`open-questions.ar.md`](open-questions.ar.md). `Q-nn` IDs are identical across both — **when a question is answered, update both files under the same ID.**

The agenda for the next client meeting, and the record of what the design cannot yet commit to.

Every `[OPEN]` marker in a BRD points at a `Q-nn` here. Nothing on this list may be silently resolved by assumption — per [Rule 00 · R00-4](../rules/00-working-agreement.md), gaps are marked, not filled.

**Status legend** — 🔴 Blocking (design cannot proceed) · 🟠 Important (design proceeds but will need rework) · 🟡 Clarifying (affects detail, not structure) · ✅ Resolved (kept for traceability; IDs are never reused per `R00-7`)

**2026-08-17 update.** A follow-up meeting with **the client directly** (not the developer) worked through most of this list. New source: [`sources/2026-08-17-client-followup/`](sources/2026-08-17-client-followup/), tag `[T2:<line>]`. Eight questions below moved to Resolved; several others gained partial answers and stayed open. Two new questions surfaced (`Q-20`, `Q-21`) that didn't exist before this meeting.

---

## ✅ Resolved

### ✅ Q-01 · What is a "wallet"?

**Answer.** A wallet is fundamentally a **transaction log — a source of truth**, not an account with money moving freely in and out `[T2:11-16]`. There are two: a platform-as-provider wallet (used only by companies without their own payment method, tracking card payments, disputes/backcharges, and evidence submission) and a per-company wallet (same idea, scoped to one company, tracking its own card payments, disputes, and bank deposits) `[T2:6]`. An engineer once proposed technician-to-technician transfers; the client rejected the idea outright — technicians never control their own wallet balance, and card money is never routed to a technician, only to the company, which then owes the technician `[T2:8]`. The wallet resets weekly at Sunday midnight, matching the existing financial week (`FIN-S-001`) `[T2:10]`. This settles the question in favor of **candidate answer (a)** from the original framing: a read-only/derived ledger, not a real internal-transfer wallet.

**Applied to:** [`BRDs/07-finance-wallets-and-payments.md`](BRDs/07-finance-wallets-and-payments.md), [`BRDs/00-glossary.md`](BRDs/00-glossary.md).

---

### ✅ Q-05 · Does priority affect price?

**Answer.** No. Priority is a **binary flag only** — "Now" (ASAP) or "Scheduled" (a later day) `[T2:141]`. It has no effect on price, job category, or which technician receives the job; all of that stays a manual dispatcher decision `[T2:142-143]`.

**Applied to:** [`BRDs/00-glossary.md`](BRDs/00-glossary.md).

---

### ✅ Q-06 · Can the platform see company-sourced jobs?

**Answer.** Scoped by infrastructure, not by a blanket rule. The platform's audit log only certifies operations that ran **through the platform's own systems**. Anything a company does entirely on its own payment gateway and its own Twilio number is excluded — pulling it into the platform's log would, in the client's words, be "stealing information that belongs to them" `[T2:32]`. As long as a company holds its own gateway and Twilio subscription, the platform respects that company's independent standing and only touches records that concern the platform itself `[T2:34]`. This is **candidate answer (a)** — hidden by default — but the actual gate is "company self-sufficient on gateway + Twilio," not job origin as a standalone flag. A company still relying on the platform's fallback gateway or lacking its own Twilio likely remains visible; that edge case was not asked directly.

**Applied to:** [`rules/01-business-invariants.md`](../rules/01-business-invariants.md) (`AUD-001`), a new BRD module for the audit log when one exists.

---

### ✅ Q-07 · Delete, or archive?

**Answer.** No hard delete of live records, but not the pure "never delete" the designer proposed either. The client's operative concern is the **2-year US legal-retrieval requirement** for the software they use `[T2:67]` — satisfied as long as a backup exists. Concretely: the Jobs delete button becomes an **archive** action, blocked until a record is at least a stated age — the client's working number is **one year**, and he agrees this threshold should be admin-configurable from the dashboard rather than hardcoded `[T2:68-77]`. Periodic (quarterly or annual) full export to Excel/CSV, followed by clearing the live copy, is acceptable once that backup exists `[T2:67]`. Terminology matters to the client: the state must read **"Archived," never "Deleted."** Separately, once a job has entered the system it must run its process to completion or receive an explicit cancellation with a reason — it is never simply deleted mid-flight `[T2:72-75]`.

**Applied to:** [`rules/01-business-invariants.md`](../rules/01-business-invariants.md) (`AUD-002`).

---

### ✅ Q-10 · Who owns the Twilio number, and what happens when it changes?

**Answer.** Each company owns and can change its own number **at any time it chooses** — not fixed to a one-year cycle as previously assumed; that was this meeting's own imprecise framing of the question, corrected in the answer `[T2:146]`. Regardless of number changes, the platform only needs to retain **call/message logs generally** — records are not required to be versioned against a specific number `[T2:143-144]`. Not addressed: whether a company can hold more than one number concurrently.

**Applied to:** [`BRDs/00-glossary.md`](BRDs/00-glossary.md).

---

### ✅ Q-12 · Is there an invoicing feature?

**Answer.** Yes — **candidate answer (a)**, a real feature, but narrowly scoped. The **technician decides per job** whether to send an invoice at all `[T2:205]`. Every invoice is issued under the **company's** name, never the platform's — each company owns its own payment relationship and is responsible for its own invoices `[T2:206]`. No logo is required, just the company name `[T2:208]`. The platform's name or branding never appears on an invoice at all `[T2:210]`.

**Applied to:** [`BRDs/07-finance-wallets-and-payments.md`](BRDs/07-finance-wallets-and-payments.md).

---

### ✅ Q-16 · What is an "expense"?

**Answer.** **Candidate answer (b)** — job-tied operational costs only, concretely illustrated with a key/key-code purchase `[T2:47-54]`. Worked example: a $100 job requires a $30 key code; the $30 is deducted before commission math, leaving $70 to split. The technician tags the cost as **"paid by me"** (reimbursed to the technician) or **"paid by company"** (the cost simply returns to the company) at job close-out via a "Contains Technician" style entry `[T2:52]`. This is a per-job field, not a general business-expense ledger.

**Applied to:** [`BRDs/07-finance-wallets-and-payments.md`](BRDs/07-finance-wallets-and-payments.md).

---

### ✅ Q-17 · Does the 24-hour session appear in chat?

**Answer.** It's a separate surface from the per-job dispatcher chat, not the same thread. The technician sends messages **from inside the app**, using the same masked channel as calls; those messages leave as an ordinary SMS from the Twilio number and land in the customer's native phone messaging app — the customer needs no app or login `[T2:187-191]`. Call and SMS recordings for that session live in **Twilio itself**; the platform stores and displays a **link** to them, not the raw file `[T2:196-200]`.

**Applied to:** [`BRDs/00-glossary.md`](BRDs/00-glossary.md), [`rules/01-business-invariants.md`](../rules/01-business-invariants.md).

---

## 🔴 Q-02 · Does the platform take a commission, and on what?

**Still open, but weakened.** Nothing in the 2026-08-17 meeting names a platform commission mechanism anywhere — the entire wallet discussion `[T2:5-18]` describes tracking and fee pass-through (gateway fees, dispute handling) but never a platform cut. The designer treats this as implicitly answering the question and drops it from the live agenda `[T2:17]`. That is not the same as the client explicitly disclaiming a commission, and the written file still lists **"platform commission" (عمولة المنصة)** as a component of the Platform Wallet `[C:§Financial/PlatformWallet]` — a real, unresolved conflict between the client's own written doc and their verbal account. Do not close this from inference alone; ask directly.

**Blocks.** Platform wallet, platform financial reports, company statement layout.

**Related.** `Q-11` — whether the platform earns anything on company-sourced jobs (see below, also gained a partial answer).

---

## 🔴 Q-19 · Has the client ever approved the permission model?

**Still open on the chat matrix specifically.** This meeting reconfirmed the org hierarchy and naming — Platform Admin, then "Platform Dispatch" (internally still called "First Line"), Company Admin, Company Dispatcher, Technician `[T2:25-29]` — but that is structural corroboration, not sign-off on the fine-grained chat permission rules (`ROL-004`, `ROL-005`, `ROL-007`, `ROL-009`), which were never raised in this meeting. Still present the current model as an explicit proposal.

---

## 🟠 Q-11 · Does the platform earn on company-sourced jobs?

**Partial answer.** Currently **no in-product mechanism exists**. Platform revenue from a company's subscription is handled entirely **outside the system** today — demo, manual deal, manual billing — with no billing screen or logic `[T2:35]`. The client is open to building an in-product subscription/membership feature once the client base scales (his own estimate: 50–100 companies), but that is future scope, not current `[T2:36]`. Still unresolved: whether the platform takes anything from company-sourced job *revenue itself* (vs. subscription fees), which depends on `Q-02`.

**Depends on.** `Q-02`.

---

## 🟠 Q-13 · How does a technician actually get paid?

**Partial answer.** No formal "approval" step was described — payout is closer to informal reconciliation than an approval workflow. At week end the system nets each technician's cash-collected against card-collected automatically; a manual adjustment path exists so a dispatcher/admin can edit a line item on the technician's weekly **report** if the system missed something (e.g. an unrecorded expense), but this edits report inputs before finalization — it does not edit a posted balance, so it does not conflict with `FIN-S-003` `[T2:36-47]`. Actual settlement — technician owing the company, or company owing the technician — happens **off-platform**: in-person cash handover at the office, or an external app transfer (Zelle, Cash App, Venmo) `[T2:52-53]`. The platform's only job is to record that the amount was **confirmed/collected**, without tracking payment-method granularity. Still unknown: who exactly performs that confirmation, and what happens when a technician's balance is negative for multiple consecutive weeks.

**Depends on.** `Q-01` (resolved above).

---

## 🟠 Q-08 · What reports does the client actually want?

**Partial answer — filtering requirements confirmed, report set still to be proposed.** Reports need same-day, same-week, previous-week, and **custom date-range** filters `[T2:59]`, plus condition filters on fields such as customer, technician, dispatcher, and payment method (cash/card) `[T2:62]`. Two hard constraints were restated as "most important": reports must **never** show another company's data, and a technician must **never** see another technician's activity `[T2:60-61]` — this directly reinforces `TEN-002` at the report level and adds a new technician-level self-scoping rule not previously stated this explicitly. The actual report *set* is still the designer's to propose, per the original note.

---

## 🟠 Q-15 · Who can issue a refund?

**Partial answer — refund and dispute are now clearly distinct mechanisms, but no role/approval path is named for either.** A **refund** is informal: the customer calls with a complaint, and the company voluntarily returns money (full or partial, e.g. $10–20 out of $100) as a goodwill gesture, decided verbally with no described request form `[T2:159-163]`. A **dispute/chargeback** is bank-initiated: the customer's bank reverses the charge, the company is notified through the **payment gateway's own dispute API**, and gets a window (client estimate: 30–60 days, unconfirmed) to submit evidence — invoice, call records `[T2:165-169]`. Both must be tagged to the job as distinct states so the job's history reads correctly (`FIN-F-003`). Still open: which role actually clicks "issue refund," and whether any approval gate exists above the person who decides.

---

## 🟠 Q-20 · What is the "Service Call Fee," and how does it get assessed? *(new — 2026-08-17)*

**The gap.** A previously unnamed fee surfaced for the first time in this meeting: when a technician is dispatched and travels but the job doesn't complete — the customer already fixed it, refuses to pay, or the job gets reassigned mid-trip — the technician (or company) may still charge a standalone **"Service Call Fee"** covering the wasted trip `[T2:105-124]`. The client's own account of the mechanics is loose: *"if the customer wants to pay, we take the money; if the customer doesn't want to pay, we ask the technician to leave the location, that's it"* `[T2:107]` — and if the customer still refuses, there is no legal recourse beyond calling the police, who typically cannot compel payment `[T2:123]`. On reassignment between technicians (e.g. a price-shopping scenario), whether the *original* technician still collects this fee appears to depend on whether the customer already paid it, tracked via free-text update notes rather than a defined field `[T2:120-124]`.

**Why it matters.** This is a new, real fee type never named in the financial BRD — separate from the job price, the dispatch fee, and the gateway fee. It needs its own line in the payment-arithmetic model and its own transaction type in the ledger (per `FIN-F-002`, every deduction/charge is its own row).

**Blocks.** The job-cancellation flow's financial tie-in, and the payment breakdown UI for any job that doesn't reach a normal completion.

---

## 🟠 Q-21 · What is the complete list of job cancellation / no-contact reasons? *(new — 2026-08-17)*

**The gap.** The client named three reasons in passing — customer resolved it themselves, customer did not answer, wrong/incorrect details at intake `[T2:102]` — and explicitly promised to send the **full list** separately via the project group chat: *"let me picture it for you and send it to you on the group"* `[T2:102]`. That follow-up has not yet landed in this workspace.

**Why it matters.** Every state in the cancellation flow needs a defined reason enum for the UI dropdown; three examples are not enough to design the full picker, and per `Rule 00 · R00-4` the gap should stay marked, not filled by invention.

**Candidate handling.** Track this as a literal to-do: check the project group chat / add a new source entry the moment the client sends the list, rather than guessing at the remaining reasons.

---

## 🟡 Q-03 · Which three payment gateways?

**Partially answered — and now conflicting with itself.** The client's written file names Stripe, Square, and Authorize.net `[C:§Financial/PlatformWallet]`. In this meeting, verbally, the client instead named **Stripe, PayPal, Authorize.net** `[T2:148]` — Square replaced by PayPal, unprompted. Also newly stated: there is **no hard cap of exactly three** — the client used "two or three" loosely and said more could be added `[T2:151]`. Per source precedence the written file still wins on the literal name list, but this is a genuine self-contradiction from the same person at two different times, not a transcription artifact to resolve silently. Ask the client to confirm the exact set in writing.

**New detail, not previously known:** each company must obtain and hold its **own** API credentials directly with the gateway and with Twilio — the platform performs the connection but never re-sells or co-signs access, because both gateway and Twilio providers require KYC/background checks on the account holder, and the client does not want to carry that liability on a company's behalf `[T2:154-157]`.

---

## 🟡 Q-04 · Keep the Country selector?

Not addressed in the 2026-08-17 meeting. Still open — see prior framing below.

The country dropdown on job creation exists only because a UAE / Middle East branch was planned; Twilio's lack of UAE support meant jobs had to be tagged by country `[T:440-444]`. That branch was cancelled `[T:41]`. Confirm whether country stays, and whether the platform is now US-only.

---

## 🟡 Q-09 · LockAccess Pro or JobixFlow?

Not addressed in the 2026-08-17 meeting. Still open.

The existing screens are branded "LockAccess Pro" `[FIG:Dashboard]`; the project is called JobixFlow `[T:157]`. Confirm the product name before any final UI is generated.

---

## 🟡 Q-14 · Currency and locale

Not addressed in the 2026-08-17 meeting. Still open — see `Q-04`, which it depends on.

---

## 🟡 Q-18 · Who does intake for company-sourced jobs?

Not addressed in the 2026-08-17 meeting. Still open.

For platform-sourced work the platform dispatcher creates the job and the company dispatcher assigns a technician `[T:50-64]`. For a company's own customers, confirm whether the company dispatcher does both, or the company admin, or a new role.
