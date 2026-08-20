# Technician Mobile App — Job lifecycle and arrival

Built from `.claude/docs/BRDs/02-jobs-and-lifecycle.md` in full — read that BRD alongside this file, it has the complete step-by-step source material and business-rule citations this spec is derived from.

## 🆕 NEW: Job queue / home screen

**What to design:** A list of assigned jobs, most urgent (dispatch urgency, `Low/Medium/High` — see `01-critical-findings-and-conflicts.md`, Finding 4, this is the operational field, not the client's Now/Scheduled concept) first. Each entry shows customer's stated problem (clearly framed as unconfirmed until the technician calls), address (free text, `JOB-004`), scheduled time or "Now," and a state badge. Tapping a job opens the Active Job screen.

**Note on Priority:** display the existing 3-value urgency badge here, and separately the Now/Scheduled timing — don't merge them into one field, per Finding 4.

---

## 🆕 NEW: Active Job screen — the guided stepper

**What to design**, following the canonical flow exactly as confirmed by the client (`.claude/docs/BRDs/02-jobs-and-lifecycle.md`, "The canonical flow, step by step"):

1. **Assigned** — Accept / Reject buttons. Accepting timestamps immediately (tracked per `JOB-005`'s source material); Rejecting returns the job to dispatch.
2. **Call to confirm** — a single prominent "Call Customer" action (never a raw dial-out — `COM-003`), which triggers the masked-calling flow (`02-masked-calling-and-messaging.md`). After the call, the technician confirms details (address, genuine need) with a simple confirm action, advancing the state.
3. **Start Trip** — one button, advances state and (implicitly) begins location tracking for the map's live technician layer.
4. **Confirm Arrival** — this is the single most important interaction in the whole app: **one explicit, deliberate action** that both advances the state *and* silently captures GPS coordinates as the job's recorded location (`JOB-007`, `LOC-002`). Design this as a clear, unmissable primary button — not a background/passive geofence trigger the technician doesn't consciously do. The client was explicit that automatic GPS-only detection was rejected because first-fix GPS accuracy can't be trusted (`[T2:89]`) — the manual confirm is the deliberate fix for that, and the design should make the moment of confirmation feel intentional, e.g., a brief "Location captured" confirmation micro-state right after the tap.
5. **Work In Progress** — informational state, not a closing one (`JOB-008`). This is where key-code requests happen if needed (`03-pricing-expenses-and-payment.md` / the existing Code Request flow the technician already triggers today per `.claude/docs/live-system/03-company-admin/02-code-requests.md`, "when a technician is on site attempting to cut or program a vehicle key without an existing key code, they submit a Key Code Request from their mobile interface" — so a code-request entry point already has an assumed mobile surface in the source material; treat this screen as where it lives).
6. **Completed** or **Cancelled** — the only two states that actually close a job (`JOB-008`). Completed leads into the pricing/payment flow. Cancelled opens the reason picker below.

**Design principle throughout:** at every step, only the single legal next action is available — never a dropdown of all possible states (`JOB-005`'s design implication, same principle as every web-dashboard job screen in this folder).

---

## 🆕 NEW: Cancellation flow

**What to design:** A reason picker, required before the cancel completes (`JOB-009`). Use the same extendable-enum treatment described for the web dashboards (`03-platform-admin/02-jobs-and-audit-updates.md`) — only three reasons are confirmed (Customer Resolved, Customer Did Not Answer, Wrong Details, `Q-21` open) so the picker's layout shouldn't visually assume exactly three options forever.

Immediately following a cancellation past the "Started" step, surface the **Service Call Fee** decision (`Q-20`, open) — the client's own description is that this resolves to a simple binary in practice: the customer either pays it or the technician leaves (`[T2:107]`). Design a minimal "Collected $[amount] / Customer refused / Not applicable" control here rather than a fuller fee-calculation UI, since the calculation mechanics themselves are still unconfirmed — don't over-build this control ahead of the answer (`Rule 00 · R00-4`).

---

## 🆕 NEW: Reassignment — technician-side view

**What to design:** When a job is reassigned away from this technician mid-flow (e.g. a price-shopping scenario the dispatcher couldn't close, `.claude/docs/BRDs/02-jobs-and-lifecycle.md`), the technician's job queue should clearly show the job left their list with a "Reassigned" marker — not silently vanish, which would read as a bug. If a Service Call Fee outcome applies to their now-closed leg of the job, it should be visible on that same marker/history entry.
