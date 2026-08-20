# Company Dispatcher — Own-job intake entry point, and map findings

Current pages: `/companies.dispatcher` (`.claude/docs/live-system/04-company-dispatcher/01-dashboard.md`), Active/Incoming Jobs (`02-active-and-incoming-jobs.md`), Live Map (`03-live-map.md`), Technicians (`04-technicians.md`). This dashboard needs comparatively little new surface — most of its structure already matches the requirements — but it's the likely second home (alongside Company Admin) for company-sourced job intake, and it's where the proximity-dispatch conflict from the critical-findings doc lives.

---

## 🆕 NEW PAGE (conditional on `Q-18`): "New Job" entry point

**Where:** The Company Dispatcher dashboard has no "New Job" button today, unlike the Platform Dispatcher dashboard which has one front and center (`.claude/docs/live-system/02-platform-dispatcher/01-dashboard.md`).

**What to design:** If `Q-18` resolves toward the Company Dispatcher performing company-sourced intake (rather than, or in addition to, the Company Admin), add the same "New Job" entry point to this dashboard, wired to the shared Create Job (company-sourced) form specified in `05-company-admin/01-own-jobs-and-customers.md`. Don't build a second, divergent version of that form — one flow, reachable from up to two dashboards depending on the answer.

**Role visibility:** Company Dispatcher, pending confirmation.

---

## ⚠️ CONFLICT — decision needed: Live Map proximity dispatch vs. `ROL-010`

See `01-critical-findings-and-conflicts.md`, Finding 3, in full — this file just marks where it lands. The Live Map's entire "Proximity Dispatching via Map" flow (`.claude/docs/live-system/04-company-dispatcher/03-live-map.md`) is a real, working, documented feature that contradicts the stated same-state-and-free-only assignment rule. **Do not modify the map to remove this pattern**, and do not extend it further until the client confirms which account of "how assignment works" is correct. If you're picking up map-related work from this folder, flag Finding 3 to the client/dev before touching the assignment logic in either direction.

---

## ✅ NO CHANGE: Map's two-layer requirement

**Checked against:** `LOC-003` — the map carries exactly two layers, live technicians and pinned jobs.

**Live system status:** Already compliant. The Live Map's documented "Technicians Layer Toggle" and "Job Locations Layer Toggle" (`.claude/docs/live-system/04-company-dispatcher/03-live-map.md`) are exactly the two layers the requirement describes, with independent visibility checkboxes for each. No design change needed here — listed so nobody re-designs a feature that already matches spec.

**One thing worth a light touch, not a redesign:** `LOC-002` says a job's location is recorded only when the technician pings arrival — but the live map already plots "Job Location Pins: Exact customer dispatch coordinates" seemingly from the moment a job is created, which reads as geocoding the dispatcher-typed address immediately rather than waiting for an arrival ping. This is a milder version of Finding 3 (a live feature slightly ahead of what the transcript-derived rule describes) rather than a hard contradiction — plausibly the map shows a geocoded *approximate* pin pre-arrival and a *confirmed* pin post-arrival, which would be entirely consistent with the requirement. Verify which is actually true before treating `LOC-002` as either violated or already handled.

---

## ✏️ MODIFY: Active/Incoming Jobs — Origin column, cancellation reason, archive

Same three changes described for the Platform Dispatcher's Job History (`04-platform-dispatcher/01-job-intake-and-history-updates.md`) apply here: an Origin badge once company-sourced jobs exist (`05-company-admin/01-own-jobs-and-customers.md`), the extendable cancellation-reason picker (`Q-21`), and the delete-to-archive rename (`02-shared-components/`). Reuse those specs rather than re-deriving them — this page's job cards are structurally the same entity, just filtered to one company's active/incoming queue.
