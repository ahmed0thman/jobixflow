# Technician Mobile App — Pricing, expenses, and payment collection

Built from `.claude/docs/BRDs/07-finance-wallets-and-payments.md`'s payment-arithmetic section and the Expense/`Q-16` resolution, plus the existing Code Request flow already documented on the company-admin side.

## 🆕 NEW: Final price and vehicle/problem override

**Where:** Job close-out, reached once the technician has inspected the job on site.

**Why:** `JOB-002` — the technician's field description and final price are authoritative, overriding whatever the customer originally reported over the phone.

**What to design:** A clear "your assessment" entry distinct from the customer's original (read-only, clearly attributed) account — final price, vehicle details (VIN, make/model/year, plate — matches the existing `JobVehicle` fields already modeled on the web side, `.claude/docs/live-system/01-platform-admin/04-jobs.md`), and photo upload for both the work performed and (per the proof-of-service material, `[T2:172-182]`) the customer's signed confirmation and ID.

---

## 🆕 NEW: Key/Key-code request

**Where:** Reachable from the active job at the "Work In Progress" step.

**Why:** Already partially specified on the web side — the Company Admin's Code Requests page describes the request as originating "from their mobile interface" (`.claude/docs/live-system/03-company-admin/02-code-requests.md`) — this file is that mobile interface's design.

**What to design:** VIN entry (with a search-existing-codes-first step — `.claude/docs/BRDs/00-glossary.md`'s Key Code definition: before buying a new code, search by VIN and retry an old one), plus a **generate-myself vs. request-from-company** choice, since the technician can either obtain the code on their own device (bearing the cost themselves) or request it from the company (`.claude/docs/CLAUDE.md` §"Job lifecycle"). This choice directly feeds the Expense tagging below.

---

## 🆕 NEW: Expense entry — paid-by-me / paid-by-company

**Where:** Job close-out, alongside final price.

**Why:** `Q-16` resolved, `FIN-W-013` — this is the technician-facing half of the Expense feature the web-side files (`03-platform-admin/02-jobs-and-audit-updates.md`, `05-company-admin/08-code-requests-expense-link.md`) already spec the admin-facing half of.

**What to design:** A simple toggle plus amount and short description, matching the client's own worked example exactly (a $30 key/key-code line item, deducted from the job total before commission math, `[T2:50-54]`). **Do not confuse this with the existing `Paid By: company/customer` field already on the web-side Job Details** (`01-critical-findings-and-conflicts.md`, Finding 5) — this is a different question (did the technician front the cost) with different values (technician/company).

---

## 🆕 NEW: Payment collection

**Where:** Job close-out, final step.

**What to design:** Payment method selection — Cash, Card, or Payment Link (the live system's Job Details payment-method field already includes a "Payment Link" value, `.claude/docs/live-system/01-platform-admin/04-jobs.md`, even though the customer-facing page itself has never been designed — see `08-customer-payment-link.md`). Show the technician a live breakdown as they enter numbers: gross → less expense → (gateway fee if card) → commission split → dispatch fee → net — the same itemized-breakdown principle used everywhere else in the financial system (`Rule 02 · R02-6`), so the technician sees exactly what they're keeping vs. owing before confirming.

**Cash vs. card produce opposite outcomes** (`.claude/docs/BRDs/07-finance-wallets-and-payments.md`'s payment arithmetic) — cash leaves the technician holding money owed to the company; card leaves the company owing the technician. Make this directional difference legible in the confirmation screen, not just implied by which button was tapped.

---

## ➕ NEW SECTION: Invoice decision

**Where:** Final screen of job close-out, after payment is recorded.

**Why:** `Q-12` resolved — sending an invoice is the technician's own per-job decision (`FIN-W-014`).

**What to design:** A simple "Send Invoice to Customer?" toggle at the very end of close-out — if enabled, generates and sends an invoice under the company's name only (`FIN-W-015`, no logo, no platform branding — same constraint as the web-side Invoices view in `05-company-admin/05-disputes-refunds-and-invoicing.md`). Keep this action clearly optional and low-friction — the client was explicit this is a per-job judgment call, not a default-on behavior.
