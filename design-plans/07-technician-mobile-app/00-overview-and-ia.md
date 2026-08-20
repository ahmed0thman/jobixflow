# Technician Mobile App — overview

There is nothing to diff here. No live-system doc, no screenshot, no route exists for the technician mobile app — every four documented dashboards are web, and the mobile app is explicitly out of the live-system audit's scope. Everything in this folder is built forward from the BRDs alone, per `Rule 02 · R02-7`, and should be read with that in mind: it's a first design pass, not a gap analysis against something already built.

## Why this is still one of the higher-confidence areas in this whole folder

Even though nothing exists to compare against, the source material for *this specific surface* is unusually strong — `.claude/docs/BRDs/02-jobs-and-lifecycle.md` was written directly from a client walkthrough of the exact step-by-step flow a technician follows, and the financial arithmetic in `.claude/docs/BRDs/07-finance-wallets-and-payments.md` is close to specification-grade. Treat the files in this folder as more load-bearing than most of the web-dashboard gap items, precisely because there's no legacy pattern pulling against the requirement.

## Information architecture

A technician's app is job-centric, not dashboard-centric — there is no multi-widget home screen to speak of in the source material, just a job queue and, per job, a guided sequence. Propose:

1. **Job queue / home** — assigned jobs awaiting action, most urgent first. Entry point into everything else.
2. **Active job screen** — the guided state stepper (`01-job-lifecycle-and-arrival.md`) — this is where a technician spends most of their time on any given job.
3. **Call / message** (`02-masked-calling-and-messaging.md`) — reachable from the active job screen, not a separate tab.
4. **Pricing, expenses, payment collection** (`03-pricing-expenses-and-payment.md`) — reachable at job close-out.
5. **Account / statement, invoicing** (`04-account-and-invoicing.md`) — a persistent tab, since it's checked outside the context of any single job.

## Non-negotiables that apply to every screen in this folder

- **`COM-001`**: the technician never sees the customer's real phone number, anywhere — not in the call screen, not in a notification, not in a job detail field. This has to be true structurally (the value is never sent to the device), not just hidden in the UI.
- **`JOB-002`**: the technician's own description and final price are authoritative and override whatever the customer originally reported — every screen that shows the customer's original account should visually read as "what the customer said," not as fact, with the technician's own entry clearly the record of truth.
- **The fixed state machine (`JOB-005`)**: the active job screen is a guided stepper advancing through the one legal next state, never a free-choice status picker — same principle as the web dashboards' job-status controls (`.claude/rules/01-business-invariants.md`, "Applying these to design").
- **Reuse the established visual language** (`Rule 02 · R02-1`) adapted to mobile scale — same palette, same pill/card language, same icon family — this should read as the same product on a smaller screen, not a different app.
