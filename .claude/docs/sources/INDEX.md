# Source catalog

Every piece of raw material this project's business logic is derived from. Nothing in `BRDs/` may assert a fact that cannot be traced back to an entry here.

## Precedence

When two sources disagree, the higher entry wins and the disagreement is logged in [`../open-questions.md`](../open-questions.md) rather than silently resolved.

1. **Client written requirements** — deliberate, authored by the system owner
2. **Meeting transcripts** — spoken, auto-transcribed, lossy. Between the two transcripts, the **client follow-up** (2026-08-17) generally outranks the **developer handover** (2026-08-05) on points of direct conflict, since it is the client speaking about their own business rather than the developer's secondhand account — see that source's `NOTES.md` for the one exception (gateway naming, which conflicts with the written file instead and is not silently picked).
3. **Screenshots** — visual evidence of appearance only, never of behavior or completeness

## Catalog

| Date | Source | Tag | Authority | Covers |
|---|---|---|---|---|
| ≤ 2026-08-05 | [`2026-08-05-client-major-changes/`](2026-08-05-client-major-changes/) | `[C:§…]` | Highest | Twilio masked calls & SMS; the complete financial system |
| 2026-08-17 | [`2026-08-17-client-followup/`](2026-08-17-client-followup/) | `[T2:<line>]` | High — direct client meeting | Resolves most of `open-questions.md`: wallet definition, audit log scope, delete/archive, job state machine, priority, Twilio number lifecycle, gateways, refunds vs. disputes, expenses, invoicing |
| 2026-08-05 | [`2026-08-05-developer-handover/`](2026-08-05-developer-handover/) | `[T:<line>]` | Medium | Current system behavior, all four dashboards, job lifecycle, roles |
| — | `../../../figma-current/` (**removed from repo** — see Critical limitation below) | `[FIG:<screen>]` | Visual only | Design system: palette, components, layout patterns (surviving summary: `CLAUDE.md` § Design system) |

Each folder carries a `NOTES.md` with a section map and reliability caveats. **Read the NOTES before the source.**

## Media not copied

`recorded_meetings/2026-08-05 17_17/` retains `video.mp4` and `audio.m4a`. Only the transcript was copied. The recording is worth revisiting for the passages flagged as corrupted in that folder's `NOTES.md`, and for the screen-share segments where on-screen content was described but never named.

## Critical limitation

`figma-current/` contained **nine sample screens**, supplied to infer the visual design system, and has since been **deleted from the repo**. It was never an inventory of the current build and carried no information about what does or does not exist — that limitation outlives the folder itself: no document in this workspace may claim a screen exists, is missing, or is incomplete on the basis of these now-gone files, nor on the basis of the distilled summary that survives in `CLAUDE.md`. Screen inventories are derived forward from business requirements, with current coverage marked unverified until confirmed against the real Figma file or the live dashboards. Any `[FIG:<screen>]` citation already made in a BRD or design plan refers to a screenshot that is no longer in this repo and can only be re-verified against the live Figma file, not against a local copy.

## Adding a new source

1. Create `<YYYY-MM-DD>-<short-slug>/` here
2. Copy text material in; leave large media at its origin and note where it lives
3. Write a `NOTES.md` — what it is, what it covers, how far to trust it, a section map
4. Add a row to the catalog above with its citation tag
5. Re-check affected BRD modules and `open-questions.md`; a new source may close an open question or open a new contradiction
