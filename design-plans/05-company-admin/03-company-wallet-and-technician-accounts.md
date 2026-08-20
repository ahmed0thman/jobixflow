# Company Admin — Company Wallet and Technician Account (new)

No equivalent exists anywhere in the live system. The developer herself confirmed a technician ledger page was planned but never built (`.claude/docs/BRDs/07-finance-wallets-and-payments.md`, "Current behavior"). This is the largest single chunk of genuinely new screen surface in the whole project.

Read `02-shared-components/01-...md` and `03-platform-admin/04-platform-wallet.md` first — same "statement, not console" principle applies here, and the two wallet pages should feel like siblings, not two different products.

---

## 🆕 NEW PAGE: Company Wallet

**Where:** New nav item, `/companies.admin/wallet`, alongside the (undocumented but sidebar-visible) Jobs/Customer/Users items — insert near Reports.

**Why:** `.claude/docs/BRDs/07-finance-wallets-and-payments.md` — one per company, fully isolated (`FIN-W-003`, `TEN-002`).

**What to design:**
1. **Summary strip** — card payments this week, refunds, disputes, expenses, technician payouts due, wallet balance. Same currency/percentage labeling discipline as the Platform Wallet (`Rule 02 · R02-6`).
2. **Transaction ledger table** — every event type from `.claude/docs/CLAUDE.md`'s Financial Transactions ledger list: customer payment, refund, dispute/chargeback, gateway fee, dispatch fee, technician commission, technician payout, backcharge, adjustment. Same column schema discipline as the Platform Wallet: transaction number, job, invoice, technician (if any), customer (if any), amount, type, datetime, acting user, notes.
3. **No editable balance field anywhere** (`FIN-S-003`) — corrections are a separate **Adjustment** entry action (see below), never an inline edit on any figure in this table.
4. This wallet is where the **Expense** deductions from job close-out surface in aggregate (`FIN-W-013`) — make sure the ledger's "type" filter can isolate expenses specifically, since a company admin auditing technician-fronted costs needs to reconcile these against reimbursements.

**Role visibility:** Company Admin only, scoped to their own company (`FIN-W-003`).

---

## 🧩 NEW MODAL: Record Adjustment

**Where:** Triggered from the Company Wallet ledger.

**Why:** `FIN-S-003` — balances are never edited manually; every correction is its own transaction with a reason.

**What to design:** A small form — amount (signed), reason (required free text), linked job/technician (optional). On submit, it appends a new ledger row tagged `Adjustment`, visible immediately in the table above. This is the *only* way any financial figure in this product ever changes after the fact — treat the modal's prominence and the ledger's immutability as directly linked design ideas, not two separate features.

**Role visibility:** Company Admin (who exactly should hold this action is not explicitly stated in any source — default to Company Admin since they're the only role shown Company Wallet at all, but flag this as worth confirming).

---

## 🆕 NEW PAGE: Technician Account

**Where:** `/companies.admin/technicians/{id}/account`, reached from the "View Account" link added to the Technicians roster (`02-technicians-and-financial-fields.md`).

**Why:** `.claude/docs/BRDs/07-finance-wallets-and-payments.md` — the client deliberately calls this an *account*, not a wallet; it's the technician's personal statement, also visible to the technician themselves in the mobile app (`07-technician-mobile-app/04-account-and-invoicing.md`).

**What to design:**
1. **Header** — technician name/avatar, current commission %, and the **signed final balance** (owed-to-them or owed-by-them) rendered with unambiguous directionality — not a bare number with a minus sign (`Rule 02 · R02-6`). Two visually distinct treatments: "Company owes [name] $X" vs. "[name] owes company $X."
2. **This week's figures**, matching the Technician Statement fields from `.claude/docs/CLAUDE.md` §3 exactly: job count, cash collected, card earnings, total commission, dispatch fees, gateway fees, deductions, backcharges, total paid, final balance.
3. **Job-level history table** — every completed job this technician worked, with its individual cash/card split and commission math visible on drill-down (reuse the payment-breakdown pattern from Job Details).
4. **Settlement confirmation control** — per `Q-13`'s partial answer (`[T2:36-53]`), there's no formal approval workflow; settlement is off-platform (cash handover, Zelle, Cash App) and the platform only needs a **confirmed/collected** mark. Design a simple "Mark as Settled" action with a date and optional note — not a payment-processing flow, since no money actually moves through the product here (`FIN-W-012`).
5. **Draft-report adjustment** — the one narrow exception to "nothing is editable": before a weekly report locks, a company admin can correct a line item the system missed (`[T2:36-47]`). Design this as an explicit **edit mode on the current week's draft only** — once the week closes (Sunday 23:59, `FIN-S-001`) and the statement generates, the same figures become permanently read-only, consistent with every other posted-balance rule in the product.

**Role visibility:** Company Admin (full view + the draft-edit and settlement actions). The Technician sees their own account only, read-only except for their own job-level entries (mobile app spec) — never another technician's (`[T2:60-61]`).

**States:** A technician with zero completed jobs yet is a real Empty state, not an error — new hires will hit this immediately after onboarding.
