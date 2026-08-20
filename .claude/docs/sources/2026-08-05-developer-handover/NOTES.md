# Source notes — Developer handover meeting

**Date:** 2026-08-05, 17:17
**Participants:** the UI/UX designer (project owner of this workspace) and Eng. Zeinab, the full-stack developer who built the existing system.
**Original location:** `recorded_meetings/2026-08-05 17_17/` — `video.mp4` and `audio.m4a` remain there and were not copied.
**Citation tag:** `[T:<line>]`

## What this source is

A screen-by-screen walkthrough of the **existing, already-built system**, given by the developer while sharing her screen, interrupted throughout by the designer's probing questions about business rules. It is the **only** account of current behavior available in this workspace.

## Reliability caveats

Treat every extracted fact as provisional. Specifically:

- **Auto-transcribed colloquial Egyptian Arabic.** Word-level errors are frequent. Technical terms are transliterated inconsistently — "ديسباتشر / دسباتشر / تسباتش" all mean dispatcher; "كي كود" is key code; "في اي ان" is VIN.
- **No speaker labels.** Attribution must be inferred from content. Rough heuristic: questions and QA-framed challenges are the designer; screen descriptions and "this is the page that…" are the developer.
- **Severe corruption in places.** Lines 246, 271, 277, 339, 528, 555 and others have dropped or merged words and are partially unreadable. Do not build requirements on these alone.
- **Screen-sharing dependency.** Much of the walkthrough refers to things visible on screen but never named. Statements like "this one shows…" often have no recoverable referent.
- **The developer speculates.** At `[T:253]` she states outright that parts of the permission model are her own invention rather than client instruction: *"he doesn't talk about these things, all of that is my own authoring."* Flag anything traced to this region as `[ASSUMPTION]`.
- **Two unresolved contradictions** surfaced here and are logged as open questions: the meaning of "wallet", and whether the platform can see company-sourced jobs.

## Section map

| Lines | Content |
|---|---|
| 1–14 | Domain intro — vehicle lockouts, locksmith workshops, extension to safes and automatic doors |
| 15–45 | Platform structure (admin + dispatch), companies hold technicians, platform admin dashboard tour |
| 46–85 | Dispatch flow, per-job chat, who assigns what, technician selection criteria |
| 86–101 | Map, two layers, arrival ping, GPS vs. typed address |
| 102–133 | Technician app, authoritative job data, key code vs. physical key, who bears each cost |
| 134–149 | **New requirements introduced** — full financial system, call sessions, company's own work |
| 150–179 | Multi-tenancy — customer contacting a company directly, company gets its own dashboard |
| 180–220 | Payment gateways, per-company Twilio numbers, commission question, **wallet ambiguity** |
| 221–262 | Company dispatcher dashboard tour |
| 263–300 | Platform admin revisit — reports need tables/search, job deletion |
| 301–348 | Data retention debate, audit log scope, filtering at scale |
| 349–411 | **Reusable component agreement** — Table, Filter, Actions components (in scope for design) |
| 412–424 | Audio dropout, no content |
| 425–476 | Platform dispatcher dashboard — add-job flow, customer lookup, country dropdown, preliminary price |
| 477–548 | Company admin dashboard — code requests, key codes, technicians, technician ledger (never built) |
| 549–580 | Wrap-up, search performance concerns at scale |
| 581–602 | Off-topic discussion of the developer's AI workflow — **out of scope, ignore entirely** |

## Out of scope within this source

Lines 349–411 and scattered remarks elsewhere contain an extended technical argument about Blade vs. React, native JavaScript, component reusability in code, and database design. Per the working agreement this is ignored — **except** the agreement that the designer will build a single reusable Filter / DataTable / Actions component in Figma, which is a design deliverable.
