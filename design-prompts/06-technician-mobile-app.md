# Stitch UI Prompt — Batch 06: Technician Mobile App (Native iOS & Android)

## Context & Role
Generate the native mobile application screens for **Locksmith Technicians** in JobixFlow. Emphasize high-contrast outdoor visibility, large touch targets, guided step-by-step state transitions, and strict multi-tenant privacy.

## Mobile Screens to Generate

### 1. Job Queue & Home Screen
- Clean card list sorted by urgency (`High`/`Medium`/`Low`) and timing ("Now" vs "Scheduled: [Time]").
- Card Elements: Customer stated problem (marked *"Customer reported - unverified"*), address, distance (miles), and status chip.

### 2. Active Job Guided Stepper (`JOB-005`)
- **Linear Step Flow (Only one legal next action active):**
  1. **Assigned:** `Accept Job` (solid green) / `Decline` (outline red).
  2. **Call Customer (`COM-003`):** `Call via Secure Line` (masked Twilio bridge). Shows 24h session timer.
  3. **Start Trip:** `Start Trip` primary button. Triggers GPS telemetry.
  4. **Confirm Arrival (`JOB-007`, `LOC-002`):** `I Have Arrived on Site` button. Deliberate tap captures GPS fix and confirms arrival timestamp.
  5. **Work In Progress (`JOB-008`):** Informational state. Houses `Request Key Code` action and camera upload for VIN/Locks.
  6. **Complete / Cancel:** Terminal action triggers.

### 3. In-App Masked Calling & SMS Composer (`COM-001`)
- Outbound call button initiates Twilio call without displaying customer's actual number.
- In-app SMS composer: Thread shows messages sent via company Twilio business number.
- 24-hour countdown banner: *"Messaging active for 23h 45m after job close."*

### 4. Job Close-Out, Pricing, Expenses & Payment Collection
- **Field Problem Override & Final Price (`JOB-002`):** Authoritative price & service description entry.
- **Expense Toggle (`FIN-W-013`, `Q-16`):** "Purchased parts/codes out of pocket?" → Amount ($) + `Paid by Me` (reimbursable) vs `Paid by Company`.
- **Payment Method:**
  - `Cash`: Calculates cash kept by tech and records debt owed to company.
  - `Credit Card`: Card entry form.
  - `Send Payment Link`: Generates customer SMS checkout link.
- **Live Net Take-Home Breakdown:** Gross → Less Expenses → Gateway Fee → Commission Split → Net.
- **Invoice Toggle (`FIN-W-014`):** "Send PDF Invoice to Customer via SMS?" (Company branding only per `FIN-W-015`).

### 5. Technician "My Account" Tab (`FIN-W-012`)
- Current week statement: Commission rate, Jobs count, Cash collected, Card earnings, Net Balance (`"Company owes you $X"` or `"You owe Company $X"`).
- Strictly self-scoped (zero visibility into other technicians).
- Weekly statement history archive (read-only once week closes).
