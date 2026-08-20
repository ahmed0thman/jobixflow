# 07 · Finance — wallets and payments

**ID namespace:** `FIN-W`
**Source coverage:** 🟢 **Strong** — the client's written file is close to specification-grade here, and the 2026-08-17 client follow-up (`[T2:<line>]`, see [`../sources/2026-08-17-client-followup/`](../sources/2026-08-17-client-followup/)) closed the module's central ambiguity: `Q-01`, the meaning of "wallet," is now **resolved**, along with invoicing (`Q-12`) and expenses (`Q-16`). Remaining gaps are narrower — platform commission (`Q-02`), gateway naming (`Q-03`), and a newly surfaced Service Call Fee concept (`Q-20`).

**Related modules:** `08` fees, commissions and disputes · `09` statements and ledger · `12` settings

## Purpose

Defines the three financial levels, how money moves through them for cash and card payments, and how payment gateways are configured. This is the largest single piece of new work in the project.

---

## Current behavior

**Almost nothing exists.** This is close to greenfield, and the design should be planned as such.

- The payment stage was never built: *"we never reached the payment stage at all"* `[T:216]`, *"we haven't done anything to do with payment"* `[T:218]`.
- The platform was intended to send a **payment link to the customer's mobile**, but *"no UI was ever made for it from the start"* `[T:182]`.
- The old plan was a **single** gateway on the platform; the client now wants three `[T:218]`.
- A technician ledger page was planned by the developer but never designed or built — *"I was going to make him a dedicated page, but I had no UI for it at all"* `[T:528]`.

Everything below is therefore **new design**, not modification.

---

## Requested changes

### What a wallet actually is — `Q-01` resolved

The client's own account, given directly in the 2026-08-17 follow-up, settles the module's central ambiguity: a wallet is a **transaction log — a source of truth** for money that moved elsewhere, not an account technicians or companies actively move money through `[T2:11-16]`. Concretely:

- An engineer once proposed technician-to-technician transfers inside the wallet; the client rejected it outright. Technicians never control their own wallet balance — card payments route directly to the **company**, never to the technician, and the technician's dues are computed and settled from there `[T2:8]`.
- Each wallet resets on the existing financial week boundary, Sunday 00:00 (`FIN-S-001`) `[T2:10]`.
- The client's mental model of the wallet's job is explicitly evidentiary: it records *where money came from, which job closed it out, which technician worked it, whether a chargeback landed on it, and what evidence was submitted* `[T2:12]` — a ledger view, not a movable-funds account.

This closes `Q-01` in favor of the original **candidate answer (a)** — read-only, derived from the transaction history. Design the wallet screens as statements and drill-down ledgers, not as send/receive interfaces. No transfer flow, no sender/recipient picker, no pending/settled confirmation state needs designing for wallet-to-wallet movement, because that movement doesn't exist in this product.

### The three financial levels

`[C:§Financial/Overview]` — a multi-tenant SaaS in which every company's financial data is completely isolated from every other company's.

```
Platform Wallet      owner only · covers platform-gateway companies only
        │
        ├── transfers to companies
        ▼
Company Wallet       one per company · fully isolated
        │
        ├── technician payouts
        ▼
Technician Account   one per technician · relationship with their company only
```

### Platform Wallet

Belongs to the system owner alone `[C:§Financial/PlatformWallet]`.

Used **only** for companies that adopt the platform's payment gateway. If a company uses its own gateway — Stripe, Square, Authorize.net or another — **none of its money appears in the platform wallet at all**.

Contains: customer payments · platform commission · gateway fees · refunds · disputes and chargebacks · company balances · transfers to companies.

> Two of those entries — *company balances* and *transfers to companies* — mean the platform holds money **custodially on behalf of companies** and later remits it. That implies a platform → company payout flow with its own approval, scheduling and confirmation states, which no source describes. `[ASSUMPTION]` on the mechanics; see `Q-13`, which raises the identical gap one level down. **New color, not a resolution:** the client describes the *third-party* payment software the business currently uses as requiring a manual "cash out" step to move money from the processor's wallet to an actual bank account — same-day or end-of-week, at the user's choice `[T2:16]`. Whether JobixFlow's own platform → company remittance should mirror that manual-trigger pattern is still open; it's current-tool color, not a stated requirement for the new system.

### Company Wallet

One per company, completely independent `[C:§Financial/CompanyWallet]`. Manages: card payments · refunds · disputes · expenses · technician payouts · financial adjustments · financial reports.

*"No company may view another company's data."*

**Expenses, defined — `Q-16` resolved.** Job-tied operational costs only, not a general business-expense ledger. Worked example from the client: a job needs a $30 key or key code; that $30 is deducted from the job's gross before commission math `[T2:50]`. At job close-out the technician tags the cost as **paid by me** (the technician fronted it and is reimbursed) or **paid by company** (the cost is simply returned to the company) `[T2:52]`. This is a per-job entry made by the technician, not a standing expense-tracking feature — see the updated payment arithmetic below for where it sits in the deduction order.

**Invoicing, confirmed — `Q-12` resolved.** Invoicing is a real, narrowly-scoped feature: the **technician decides per job** whether to send an invoice at all `[T2:205]`. Every invoice is issued under the **company's own name**, never the platform's — no logo required, just the company name, and the platform's branding never appears on it in any form `[T2:206-210]`. Design the invoice as a simple, per-company-branded document triggered from the technician's job close-out flow, not a platform-branded generated artifact.

**Service Call Fee — new concept, `Q-20` open.** When a technician is dispatched and travels to a job that doesn't reach completion — customer resolved it themselves, customer refuses to pay, or the job gets reassigned mid-trip — a standalone fee covering the wasted trip may apply, separate from the job price, dispatch fee, and gateway fee `[T2:105-124]`. The client's own account of when it's collected and how it's enforced is loose (no legal mechanism to compel payment if the customer refuses `[T2:123]`), and its exact calculation and role-driven assessment are unconfirmed — see `Q-20`. Do not design its transaction/UI details beyond a recognized fee *type* until answered.

### Technician Account

One per technician, showing **only** their financial relationship with their company `[C:§Financial/TechnicianAccount]`. Note the deliberate wording — the client calls this an *account*, not a wallet.

Contains: completed jobs · commission percentage · cash amounts received · card-operation earnings · dispatch fees · gateway fees · deductions · backcharges · amounts received from the company · **final balance, owed either to them or by them**.

### Payment arithmetic

Both flows are specified step-by-step in `[C:§Financial/PaymentCalc]`. They run in **opposite directions**, which is the central design insight of this module. The 2026-08-17 follow-up adds a worked example that inserts a **job-tied expense deduction ahead of every other deduction** `[T2:50-54]` — a $100 job with a $30 key-code expense nets to $70 before gateway fee, commission or dispatch fee are ever calculated. The sequence below folds that in; where no expense applies, step 2 is a no-op.

**Cash — the technician ends up owing the company**

1. Customer pays the technician in cash
2. Any job-tied expense (`Q-16`) is deducted from the gross first, tagged paid-by-technician or paid-by-company `[T2:50]`
3. Technician keeps the remaining money
4. System calculates the technician's commission share on the post-expense amount
5. Dispatch fee is deducted
6. The remainder is **due to the company**
7. System records the cash held by the technician that must be handed over

**Card — the company ends up owing the technician**

1. Customer pays by card
2. Money enters the **company wallet**
3. Any job-tied expense (`Q-16`) is deducted from the gross first
4. Gateway fee is deducted from the post-expense amount `[T2:54]`
5. System calculates the technician's commission share
6. Dispatch fee is deducted
7. Net technician dues are recorded, **to be paid by the company later**

A **Service Call Fee** (`Q-20`, above) is a separate charge outside this arithmetic entirely — it applies instead of a completed job's payment breakdown, not alongside it, since it only arises when a job doesn't reach normal completion.

### Payment gateways

- The platform configures its own gateway `[T:184]`
- A company **may** configure its own by entering API credentials `[T:186-187]`
- A company with **no** gateway of its own falls back to the platform's, and its customers pay into the platform account `[T:184]`
- The moment a company has its own gateway, payments route there — *"her money, there it is"* `[T:186]`
- Up to **three** gateways per company, with three sets of API credentials `[T:218]` — the 2026-08-17 follow-up softens this to "no fixed number," with two or three offered as a starting point and room to add more `[T2:151]`
- Named in the written file as Stripe, Square and Authorize.net `[C:§Financial/PlatformWallet]`; named verbally in the follow-up as **Stripe, PayPal and Authorize.net** — Square swapped for PayPal, unprompted `[T2:148]`. A genuine, unresolved self-contradiction — see `Q-03`. Do not pick one silently.
- **New:** each company must obtain and hold its own API credentials directly with the gateway and with Twilio; the platform only performs the connection and never re-sells or co-signs access, because both providers require KYC/background checks on the account holder and the client does not want that liability `[T2:157]`. This shapes the gateway-settings screen as "bring your own credentials," not a marketplace the platform mediates.

### Payment links

The platform sends a payment link to the customer's mobile `[T:182]`. The customer has no app or portal `[JOB-001]`, so this link is the **only customer-facing surface in the entire product** and must work standalone on a phone browser. It has never been designed.

---

## Business rules

| ID | Rule | Source |
|---|---|---|
| `FIN-W-001` | Three financial levels exist: Platform Wallet, Company Wallet, Technician Account. | `[C:§Financial/Overview]` |
| `FIN-W-002` | The platform wallet covers only companies using the platform's gateway. A company on its own gateway has no money represented in it. | `[C:§Financial/PlatformWallet]` |
| `FIN-W-003` | Company financial data is fully isolated; no company can see another's. | `[C:§Financial/CompanyWallet]` |
| `FIN-W-004` | On cash payment the technician retains the money, and the system records cash-in-hand owed to the company. | `[C:§Financial/PaymentCalc]` |
| `FIN-W-005` | On card payment funds enter the company wallet, and the system records net dues owed to the technician. | `[C:§Financial/PaymentCalc]` |
| `FIN-W-006` | Deduction order on card is fixed: job-tied expense, then gateway fee, then commission calculation, then dispatch fee. | `[C:§Financial/PaymentCalc]` `[T2:50-54]` |
| `FIN-W-007` | A company with no configured gateway falls back to the platform's gateway. | `[T:184]` |
| `FIN-W-008` | A company may configure multiple gateways (two or three to start) with independent, company-obtained API credentials — not a platform-mediated marketplace. | `[T:218]` `[T2:151, 157]` |
| `FIN-W-009` | The technician account is scoped to one company and shows no platform-level data. | `[C:§Financial/TechnicianAccount]` |
| `FIN-W-010` | A technician's final balance is signed — it may be owed to them or by them. | `[C:§Financial/TechnicianAccount]` |
| `FIN-W-011` | The payment link is delivered to the customer's mobile and is the only customer-facing surface in the product. | `[T:182]` |
| `FIN-W-012` | A wallet is a derived transaction log, never a movable-funds account; no technician-to-technician or peer transfer exists anywhere in the product. | `[T2:6-16]` |
| `FIN-W-013` | A job-tied expense (e.g. a key/key-code purchase) is deducted from the job's gross before any other deduction, and is tagged paid-by-technician or paid-by-company. | `[T2:50-52]` |
| `FIN-W-014` | Sending an invoice for a job is the technician's per-job decision, not automatic. | `[T2:205]` |
| `FIN-W-015` | Every invoice is branded with the company's name only — never the platform's name, logo or branding. | `[T2:206-210]` |
| `FIN-W-016` | Each company holds its own gateway and Twilio API credentials directly with the provider; the platform performs the connection but never re-sells or co-signs access. | `[T2:157]` |

---

## Entities and key data

**Wallet** — owner (platform or company), a **derived read-only ledger view**, not a stored transferable balance (`Q-01` resolved, `[T2:11-16]`).

**Technician Account** — technician, company, commission rate, cash in hand, net dues, backcharge total, final signed balance.

**Payment** — job, method (cash or card), amount, job-tied expense (if any) and its payer tag, gateway used, status, timestamp. Referenced by disputes `[C:§Financial/Disputes]` and by every ledger row `[C:§Financial/Transactions]`.

**Gateway configuration** — company, provider, API credentials (obtained directly by the company, per `FIN-W-016`), active flag, and whether it supersedes the platform fallback. Lives in module `12`.

**Invoice** — `Q-12` resolved: a real entity, technician-triggered per job, company-branded (name only, no logo, no platform branding). Still unconfirmed: numbering scheme, delivery mechanism to the customer, and whether it has its own list/detail screens or lives entirely inside the job record.

**Expense** — job, amount, description (e.g. "key + key code"), payer tag (technician or company). Entered by the technician at job close-out. `Q-16` resolved; see `FIN-W-013`.

**Service Call Fee** — a standalone charge tied to a job that didn't reach completion, covering a technician's wasted trip. Calculation, trigger conditions and role assessment are unconfirmed — see `Q-20`. Do not model this as a full entity yet; treat it as a recognized fee *type* pending detail.

---

## States and transitions

No source describes payment states. At minimum the design will need pending, paid, failed, refunded and disputed, but **none of these are specified** and inventing a state machine here would violate `[Rule 00 · R00-4]`. Treat payment status as an open design proposal to validate with the client alongside `Q-08`.

The one state that *is* specified is dispute-related freezing `[FIN-F-004]`, covered in module `08`. The 2026-08-17 follow-up adds that refunds and disputes/chargebacks are **distinct states**, not one mechanism: a refund is an informal, company-initiated goodwill gesture after a phone complaint, while a dispute/chargeback is bank-initiated and arrives through the payment gateway's own dispute API with an evidence-submission window `[T2:159-169]` — see `Q-15`.

---

## Open questions

- `Q-02` 🔴 — whether platform commission exists at all (weakened by `[T2:17]`, not closed)
- `Q-13` 🟠 — how technicians are actually paid, and who approves it (partially answered — settlement is off-platform and informally confirmed, `[T2:36-53]`)
- `Q-15` 🟡 — who may issue a refund (refund vs. dispute now distinguished, `[T2:159-169]`, but no role named)
- `Q-03` 🟡 — which three gateways (now conflicts with itself — written file says Stripe/Square/Authorize.net, client said Stripe/PayPal/Authorize.net verbally, `[T2:148]`)
- `Q-14` 🟡 — currency and locale
- `Q-20` 🟠 — Service Call Fee calculation and assessment *(new)*

Resolved this pass, see [`../open-questions.md`](../open-questions.md): `Q-01` (wallet definition), `Q-12` (invoicing), `Q-16` (expenses).

---

## UX implications

**The cash/card direction split is the organising idea.** Cash leaves the technician owing the company; card leaves the company owing the technician. A technician's balance therefore nets two opposing flows and can land on either side of zero. Direction must be readable at a glance and never inferred from a minus sign alone `[Rule 02 · R02-6]`. "Cash in hand to hand over" and "net dues awaiting payout" are distinct quantities and should never be merged into one figure.

**Three levels means three distinct screen families**, not one wallet screen reskinned. They differ in owner, scope and permitted actions: the platform wallet is custodial and cross-company; the company wallet is operational and single-tenant; the technician account is a personal statement the technician also sees in the mobile app.

**Gateway configuration is conditional, branching UI.** Platform-gateway versus own-gateway changes where money lands, whether the platform wallet shows the company at all `[FIN-W-002]`, and which fees apply. Up to three gateways per company means a list-with-add pattern plus credential entry, connection testing, and an active/fallback indicator — not a single settings form.

**The payment link is a standalone mobile page.** It is the only screen a customer ever sees, it arrives cold by SMS with no login and no app, and it carries the product's payment credibility entirely on its own. It needs its own design treatment: trust signalling, amount and job context, a card form, and success, failure, expired and already-paid states.

**Every deduction is separately visible.** Because each is its own transaction `[FIN-F-002]`, a job's payment detail is a **breakdown, not a total** — gross, gateway fee, commission, dispatch fee, net. Design it as an itemised statement.

**Nothing is editable.** No balance field anywhere is writable `[FIN-S-003]`. Corrections happen through an adjustment transaction, which needs its own deliberate entry flow with reason and audit trail. The one narrow exception confirmed by the client is a pre-finalization edit to a line item on a technician's *draft* weekly report `[T2:36-47]` — that's an input correction before the report locks, not a rewrite of a posted balance, and should be designed as part of the report-review step, not as a generally-editable field.

**Wallets are statements, not consoles.** With `Q-01` resolved, design every wallet screen as a read-only ledger with drill-down, filtering and export — no send/receive action, no recipient picker, no transfer confirmation state, because none of that exists in this product `[FIN-W-012]`.

**Expenses and invoices are job-level actions, not standing features.** The expense entry is a small paid-by-me/paid-by-company toggle plus amount inside the technician's job close-out flow, not a general ledger; invoice sending is a single per-job decision the technician makes, rendered under the company's own name only `[FIN-W-013, 014, 015]`.

**Sequencing risk, narrowed.** With `Q-01` resolved, the main remaining blocker is `Q-02` (platform commission) for platform-side wallet screens specifically. Company wallet, technician account, expenses, invoicing, and the payment link can now be designed in detail. Hold off only on: the exact platform-revenue line item, the Service Call Fee's transaction shape (`Q-20`), and the final gateway name set (`Q-03`).
