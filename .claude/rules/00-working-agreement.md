# Rule 00 — Working agreement

How work is produced in this workspace. Read before writing any BRD, design plan, or prompt.

## R00-1 · Role and scope

The user is the **UI/UX designer**. They do not own the backend, the frontend, the database, or the infrastructure. Deliverables are business analysis, design plans, and generation prompts — never code.

The handover transcript contains a long technical argument (Blade vs. React, native JavaScript, code-level reusability, database schema, server storage costs). **Ignore all of it.** One exception, which is squarely in scope:

> The agreement that the designer builds a **single reusable Filter / DataTable / Actions component in Figma**, containing every variant, state and permutation, so that one edit propagates everywhere. See [Rule 02](02-design-constraints.md).

## R00-2 · Source precedence

1. Client written requirements — `docs/sources/2026-08-05-client-major-changes/`
2. Meeting transcript — `docs/sources/2026-08-05-developer-handover/`
3. Screenshots — `figma-current/`, **visual evidence only**

Higher beats lower. A conflict is never resolved silently: record both readings and open a `Q-nn` entry in [`../docs/open-questions.md`](../docs/open-questions.md).

## R00-3 · Provenance is mandatory

Every non-obvious factual claim carries a tag:

| Tag | Meaning |
|---|---|
| `[T:172]` | Transcript line number |
| `[C:§Financial/Disputes]` | Client file section |
| `[FIG:Jobs]` | Screenshot — appearance only |
| `[ASSUMPTION]` | Inference. Must be plausible, confirmable, and marked |
| `[OPEN]` | Unresolved. Must have a matching `Q-nn` in `open-questions.md` |

An untagged claim is treated as fabrication and removed on review.

## R00-4 · Do not fill gaps

Source depth is genuinely uneven. The client's financial text is specification-grade; chat, the map, key codes and the audit log survive only as fragments of lossy speech.

**Write to the depth the sources support and no further.** A thin section is a finding, not a failure — it marks where design risk lives. Padding it to match the depth of the financial modules destroys the signal and converts invention into apparent fact. Every module declares its **Source coverage** as Strong, Partial, or Thin at the top.

## R00-5 · Never assert build coverage

`figma-current/` holds nine sample screens supplied to infer the design system. It says nothing about what exists in the product.

No document may state that a screen exists, is missing, is incomplete, or was already built. Screen inventories are derived **forward** from business requirements. Current coverage is marked *unverified* until the designer confirms it against the real Figma file or the live dashboards.

## R00-6 · Language

Deliverables in **English**. Sources are Arabic and are never rewritten or translated in place — cite them by line or section instead. Preserve the original Arabic term in parentheses where a translation is genuinely ambiguous or where the developer and client use a specific word.

**Exception — client-facing artifacts.** Anything taken into a meeting with the client or the developer gets an **Arabic counterpart** alongside the English, named `<file>.ar.md`. Currently: [`../docs/open-questions.ar.md`](../docs/open-questions.ar.md).

Rules for a `.ar.md` counterpart:

- **IDs are identical** across both versions. Answering `Q-02` means updating `Q-02` in both files, never one alone.
- **Quote the sources in their original Arabic**, taken verbatim from the transcript or the client file. Never back-translate an English paraphrase into Arabic — it silently changes what the client said.
- It is a **parallel deliverable, not a translation artifact**. Keep it in sync as questions are answered or added.

## R00-7 · Stable requirement IDs

Every business rule gets a permanent ID from its module's namespace — `ROL`, `JOB`, `TEN`, `KEY`, `COM`, `LOC`, `FIN-W`, `FIN-F`, `FIN-S`, `RPT`, `AUD`, `SET`.

IDs are **never renumbered or reused**. Design plans and generation prompts cite them, so traceability runs requirement → screen → prompt in both directions. When a rule is withdrawn, mark it struck rather than deleting the number.

## R00-8 · Separate what is from what is asked for

Every module keeps **Current behavior** and **Requested changes** apart. The client is buying a change to an existing system; conflating the two makes it impossible to scope, and makes it impossible to tell the developer what is new.

## R00-9 · When a new source arrives

Follow the procedure in [`../docs/sources/INDEX.md`](../docs/sources/INDEX.md). A new source may close open questions or create new contradictions — re-check affected modules rather than only appending.

## R00-10 · The open-questions list is a deliverable

It is not scratch. It is the agenda for the client meeting and the record of what the design cannot yet commit to. Keep it sharp: each entry states what is unknown, why it matters, what it blocks, and the candidate answers.
