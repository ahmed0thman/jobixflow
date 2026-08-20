# Platform Dispatcher — Job intake and history updates

Current pages: `/platform.dispatcher/jobs/create` (`.claude/docs/live-system/02-platform-dispatcher/02-create-job.md`), `/platform.dispatcher/jobs` and `/edit` (`.claude/docs/live-system/02-platform-dispatcher/03-job-history.md`). This dashboard needs the least new surface area of the four — it's the best-covered flow in the live system and most of the client's new requirements land in Company Admin's financial screens instead. What's here is mostly reconciliation and reuse of components built elsewhere.

---

## ✅ NO CHANGE (with a flag): Priority field

Per `01-critical-findings-and-conflicts.md`, Finding 4 — **do not** collapse the existing `Low`/`Medium`/`High` priority selector into a Now/Scheduled binary. Leave the field exactly as it is on the Create Job form. The client's Now/Scheduled concept maps onto the *already-existing* `Schedule At` field's Immediate-vs-Scheduled distinction — no design change needed there either, it already does what `Q-05` describes. Confirm this reading with the client before treating it as settled.

---

## ✏️ MODIFY: Create Job — Origin is implicit here, make sure it stays that way

**Where:** `/platform.dispatcher/jobs/create`.

**Why:** `TEN-001` — every job carries an origin, platform-sourced or company-sourced, and it's never absent.

**What to design:** Nothing needs to change on this form — every job created here is by definition platform-sourced, so origin can be set silently on creation with no user-facing field. This note exists only so the designer building the new **company-sourced** equivalent (`05-company-admin/01-own-jobs-and-customers.md`) knows this form is the reference pattern to reuse, minus the origin ambiguity.

---

## ✏️ MODIFY: Job History — Cancellation reason + reassignment actions

**Where:** `/platform.dispatcher/jobs`, the existing `delete / reassign` row action.

**Why:** `JOB-009` (reason required on cancel), `.claude/docs/BRDs/02-jobs-and-lifecycle.md` (reassignment as a distinct action from cancellation).

**What to design:**
- The existing `reassign` action already exists as a label in the live system but its flow isn't documented — verify its current behavior before designing on top of it. At minimum, it needs to trigger the same reason-and-fee bookkeeping described in `.claude/docs/BRDs/02-jobs-and-lifecycle.md` ("Job reassignment between technicians") — even though that flow is initiated by the Company Dispatcher in practice, the Platform Dispatcher's job history view should reflect a reassignment happened (see the Status Timeline update in `03-platform-admin/02-jobs-and-audit-updates.md`, same underlying data).
- Cancel action needs the same extendable reason-picker described there — reuse that spec rather than re-deriving it here.

**Role visibility:** Platform Dispatcher (act), same reason taxonomy visible to Platform Admin (view only) on the Jobs page.

---

## ✏️ MODIFY: Job History — Archive action

Same shared-component change as the Platform Admin Jobs list (`02-shared-components/`) — the row action becomes Archive, age-gated, with a separate Archived view.
