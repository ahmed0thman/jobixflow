# Company Admin — Disputes, Refunds, and Invoicing (new)

None of the three exist in any form in the live system. Job Details today tracks only a flat `Payment Status: Paid/Pending/Failed` — no refund, no dispute, no invoice anywhere (`.claude/docs/live-system/01-platform-admin/04-jobs.md`).

---

## 🆕 NEW PAGE: Disputes & Refunds

**Where:** New nav item under Company Admin, `/companies.admin/disputes` — or, if the eventual page count stays small, a tab inside the Company Wallet rather than a fully separate nav item (designer's call; either is defensible, just be consistent with how the Platform Wallet handles the same content).

**Why:** The refund/dispute invariant (`.claude/rules/01-business-invariants.md`) — these are **distinct mechanisms**, must be tracked as distinct job states, never merged. `FIN-F-003` — every dispute links to Job + Invoice + Payment + Technician, all four, always.

**What to design:**
1. **Two clearly separate lists** (tabs or a type filter, not two visually identical rows in one table) — Refunds and Disputes/Chargebacks. Mixing them defeats the entire point of the distinction the client drew.
2. **Refund row**: job, customer, amount (full or partial), reason (free text — there's no formal request form, per `[T2:159-163]`), issued-by, date. **Issue Refund** action — full or partial amount entry, reason required. Who exactly is allowed to click this is still open (`Q-15`); default to Company Admin for this pass since no other role has been shown Company Wallet-adjacent screens, and flag for confirmation.
3. **Dispute/chargeback row**: job, invoice, payment, technician (`FIN-F-003`'s four-way link, shown as inline chips/links, each clickable through to its own record), status (Open / Evidence Submitted / Won / Lost), the evidence window countdown (client estimate 30–60 days, unconfirmed — show it as an estimate, not a hard deadline, per `Q-...` on this figure), and an **Upload Evidence** action (invoice, call records — matches the proof-of-service materials the technician already uploads, `[T2:172-182]`, see the mobile app spec).
4. **Outcome states drive downstream money automatically, per the fixed rules** — don't let the UI imply these are freely editable outcomes:
   - **Won**: refund reversed, deductions/backcharges removed, frozen technician funds released.
   - **Lost**: technician bears only their commission share (`FIN-F-006`); dispatch fee and gateway fee are never returned to the technician (`FIN-F-007`); show this breakdown explicitly on the Lost state so the "why" is visible, not just the final number.
   - A dispute still open with an unpaid technician should visibly show the technician's share as **Frozen** — a distinct visual state from both "available" and "deducted" (`R02-6`, `FIN-F-004`).

**Role visibility:** Company Admin. Not shown to Company Dispatcher (financial action, consistent with the existing division where only Company Admin touches money-adjacent screens like Code Requests' cost logging).

---

## ➕ NEW SECTION: Invoices (view)

**Where:** Either a small tab on the Company Wallet, or a column/link surfaced directly on the Jobs list — the *sending* decision belongs to the Technician per job (`FIN-W-014`, mobile app spec), so Company Admin's role here is oversight, not creation.

**Why:** `Q-12` resolved — invoicing is real, technician-triggered, and every invoice carries the company's own name only, never the platform's (`FIN-W-015`).

**What to design:** A simple list — job, customer, amount, sent date, and a preview action showing exactly what the customer received: company name only, no logo required, no platform branding anywhere (`[T2:206-210]`). This is a good place to double-check the design system's own branding doesn't leak in by default — the invoice preview should visibly *not* carry the JobixFlow/LockAccess Pro identity that's on every other screen in this product, which is an easy thing to get wrong by reusing a shared page-header component without thinking about it.

**Role visibility:** Company Admin (view only — no "send" action here, that lives in the mobile app).
