# Platform Admin — Jobs and Audit Log updates

Current pages: `/platform/jobs` and `/platform/jobs/{id}` (`.claude/docs/live-system/01-platform-admin/04-jobs.md`), `/platform/audits` (`.claude/docs/live-system/01-platform-admin/08-audit-log.md`, part A).

This is the richest single page in the live system already — full pricing breakdown, payment details, vehicle info, status timeline, read-only chat audit. Most of the new financial and lifecycle detail slots into its existing structure rather than needing new pages.

---

## ➕ NEW SECTION: Job Details — Expenses (distinct from the existing Physical Keys/Parts block)

**Where:** `/platform/jobs/{id}`, near the existing "Pricing & Parts" block.

**Why:** `Q-16` resolved, `FIN-W-013`. See `01-critical-findings-and-conflicts.md`, Finding 5 — the existing `Physical Keys / Extra Parts` line items already have a `Paid By: company/customer` field, but that answers a different question than the new Expense concept (`paid-by-technician` vs `paid-by-company`).

**What to design:**
- A new, clearly-separated line-item list: description (e.g. "Key + key code"), amount, **Paid By: Technician / Company** tag (visually distinct pill style from the existing customer/company tag so the two are never confused at a glance).
- This block feeds the job's payment breakdown math directly — per `FIN-W-006`, expense deduction happens *before* gateway fee, commission, and dispatch fee. Design the breakdown as a running itemized statement (gross → less expense → less gateway fee → commission split → less dispatch fee → net), per the existing "breakdown, not a total" principle already used for Pricing & Parts.

**Role visibility:** Platform Admin (view only, consistent with the page's existing read-only financial detail). Entered by the Technician at job close-out (`07-technician-mobile-app/03-pricing-expenses-and-payment.md`), editable by Company Admin per the weekly-report adjustment mechanic (`05-company-admin/03-company-wallet-and-technician-accounts.md`).

---

## ➕ NEW SECTION: Job Details — Service Call Fee

**Where:** `/platform/jobs/{id}`, visible only when the job's outcome involves an incomplete dispatch.

**Why:** `Q-20` (new, open) — a standalone fee covering a technician's wasted trip when a dispatched job doesn't reach completion. Calculation mechanics are still unconfirmed, but the job needs to be able to *represent* that one was assessed.

**What to design:**
- A small status block on Cancelled jobs (see the Cancellation update below): "Service Call Fee: $[amount] — Collected / Waived / Refused" or "Not applicable" when the job wasn't dispatched far enough to trigger one.
- Keep this minimal and clearly marked as evolving — `Q-20` is open, so don't invent a fuller breakdown (rate card, calculation formula) than the source supports (`Rule 00 · R00-4`).

**Role visibility:** Platform Admin, Company Admin (view). Assessed/recorded by the Technician or Company Dispatcher at cancellation time — see `07-technician-mobile-app/`.

---

## ✏️ MODIFY: Job Details — Refund vs. Dispute, as distinct states

**Where:** `/platform/jobs/{id}` — Payment Details currently tracks only `Payment Status: Paid/Pending/Failed` `[LIVE:.claude/docs/live-system/01-platform-admin/04-jobs.md]`. There is no refund or dispute representation at all today.

**Why:** Confirmed distinct mechanisms, must never be merged (`.claude/rules/01-business-invariants.md`, the refund/dispute invariant; `FIN-F-003`; `Q-15`).

**What to design:**
- Two new, visually distinct badges/states on the Payment Details block: **Refunded** (full/partial, company-initiated, shows amount + free-text reason since there's no formal request form) and **Disputed** (bank-initiated, shows the dispute window countdown and an evidence-submission status — linked to Job + Invoice + Payment + Technician per `FIN-F-003`).
- Since a Service Call Fee, a refund, and a dispute are all "negative/exception" events, give them a consistent visual family distinct from ordinary payment success (`Rule 02 · R02-6`) — but keep the three individually legible, they are not interchangeable.

**Role visibility:** Platform Admin (view). Who can *issue* a refund is still open (`Q-15`) — don't design an "Issue Refund" action on this page yet; only the read-only representation.

---

## ✏️ MODIFY: Cancellation — full reason enum + reassignment history

**Where:** `/platform/jobs/{id}`'s Status Timeline, and the status filter set on `/platform/jobs`.

**Why:** `JOB-009` — every cancellation requires a recorded reason. `Q-21` (open) — only three reasons are confirmed so far (Customer Resolved, Customer Did Not Answer, Wrong Details); the full list is promised but not delivered.

**What to design:**
- The Status Timeline entry for a Cancelled job should show the recorded reason inline, not just the old/new state pair it shows today.
- Design the reason **taxonomy as an extendable enum**, not a hardcoded 3-item list — leave visible room for more values once `Q-21`'s answer arrives, per the shared component's filter-value pattern.
- Add a timeline representation for **Reassigned** (job moved between technicians — `.claude/docs/BRDs/02-jobs-and-lifecycle.md`) distinct from Cancelled, since a reassignment is not a job-level cancellation even though it may functionally end one technician's involvement.

**Role visibility:** Platform Admin (view). Reason is selected by whoever cancels — Company Dispatcher or Technician, depending on stage (see respective dashboard files).

---

## ✏️ MODIFY: Jobs list — Archive action

Per the shared-component spec (`02-shared-components/01-...md`), the existing `delete / reassign` action pattern (documented on the Platform Dispatcher's job cards, but the same list/action pattern applies here) becomes **Archive**, age-gated. Add an "Archived" view/filter to `/platform/jobs` alongside the existing status filters.

---

## ✏️ MODIFY: Audit Log — columns, filters, and scope note

**Where:** `/platform/audits` (`.claude/docs/live-system/01-platform-admin/08-audit-log.md`).

**Why:** This is the exact scenario the developer used to justify the reusable filter mandate (`Rule 02 · R02-5`) — today's columns are User / Model / Action / Changes / Description / Created At, with a single global search box and no company or user-type column.

**What to design:**
- Add **Company** and **User Type** as first-class columns (and filter dimensions) — currently entirely absent.
- Replace the single search box with the master Filter component: per-column filters plus the today/this-week/last-week/custom-range date preset set (`02-shared-components/`).
- Add a persistent, non-dismissible **scope note** near the top of the page explaining `AUD-001`'s refined rule: *"This log certifies operations conducted through the platform's own infrastructure. Companies fully self-sufficient on their own payment gateway and Twilio number are not represented here."* This is a genuinely surprising rule to a Platform Admin scanning for "everything" — the UI should say so up front rather than let the admin discover the gap by absence.

**Role visibility:** Platform Admin only, unchanged.
