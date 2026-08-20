# Platform Admin — Platform Wallet (new)

No equivalent exists anywhere in the live system — there is no financial screen at all under `/platform` beyond the read-only payment fields already inside Job Details. This is entirely new.

## 🆕 NEW PAGE: Platform Wallet

**Where:** New top-level nav item, `/platform/wallet` (sits naturally between "Jobs" and "Reports" in the existing sidebar order — `Dashboard, Companies, Countries, Reports, Jobs, Customer, Users, Audit Log, Settings` per the live sidebar; insert after Jobs).

**Why:** `.claude/docs/BRDs/07-finance-wallets-and-payments.md` — the Platform Wallet is one of three financial levels, owner-only, covering companies on the platform's own gateway.

**What to design — read `07-finance-wallets-and-payments.md`'s "What a wallet actually is" section first:** this is a **statement, not a console**. `Q-01` is resolved — the wallet is a derived, read-only transaction log (`FIN-W-012`). Design it as a ledger with drill-down, never as a send/receive interface — no transfer button, no recipient picker exists anywhere in this product.

1. **Summary strip** — current balance (custodial, on behalf of companies — see the note below), this week's customer payments, this week's platform commission (see Finding 1 in the critical-findings doc — reserve this line even though `Q-02` isn't fully closed), gateway fees, refunds, disputes. Every amount currency-labeled, every fee shows percentage-vs-flat (`Rule 02 · R02-6`).
2. **Transaction ledger table** (master DataTable + Filter) — one row per financial event: customer payment, platform commission, gateway fee, refund, dispute/chargeback, transfer to company. Columns: transaction number, company, job, invoice, amount, type, datetime, acting user, notes — matches the ledger schema in `FIN-*` rules exactly, so build the columns directly off `.claude/docs/BRDs/07-finance-wallets-and-payments.md`'s Business Rules table rather than improvising a schema.
3. **Company balances panel** — since the Platform Wallet holds money custodially on behalf of companies (per the BRD's own flagged ambiguity), show a per-company balance breakdown. The mechanics of *remitting* that balance to a company (approval, scheduling) are unconfirmed (`Q-13`'s twin gap one level up) — design the balance display only; do not design a "Transfer to Company" action flow until that's answered.
4. **Scope filter**: only companies on the platform's own gateway appear here at all (`FIN-W-002`) — surface a visible note (same pattern as the Audit Log's scope note) explaining that companies on their own gateway are intentionally absent, not missing data: *"Companies using their own payment gateway don't appear here — see their Company Details page for gateway status."* Cross-reference `03-platform-admin/01-companies-and-settings-updates.md`'s new Gateway status block, which is exactly what explains the absence.

**Role visibility:** Platform Admin only, per `FIN-W-001`.

**States:** Empty (a brand-new platform with no gateway-routed companies yet) is a real, likely-common state here — don't treat it as an edge case.
