# Design plans — overview

This folder is a **gap analysis**: everything the client's new requirements demand that the live system (`.claude/docs/live-system/`) does not yet do, organized as actionable design tasks. It exists so a second designer can open a single file for their assigned area and start working without re-deriving the business logic themselves.

## What was compared

- **What the client wants:** `.claude/docs/BRDs/*.md`, `.claude/rules/*.md`, `.claude/docs/open-questions.md`, `CLAUDE.md`
- **What already exists:** `.claude/docs/live-system/**/*.md` (English only) plus a handful of screenshots opened directly where the written docs were thin — `.claude/docs/live-system/screenshots/`

Every finding below cites both sides: the requirement (a rule ID, a `Q-nn`, or a BRD section) and the current-build evidence (a live-system doc path, quoted where useful). Nothing here is invented — where the live system's actual behavior is genuinely unknown (undocumented nav items, pages the audit didn't capture), that is stated explicitly rather than guessed at. This follows the same provenance discipline as the rest of the workspace (`[Rule 00 · R00-3, R00-4]`), extended to a new citation form: `[LIVE:<path>]` for a claim about the current build.

## Read this first

**[`01-critical-findings-and-conflicts.md`](01-critical-findings-and-conflicts.md)** — six things discovered while diffing the two sides that change the shape of the work: one very likely resolves a 🔴 blocking open question, three are direct contradictions between a stated business rule and what the live system actually does today, and two are gaps in the live-system audit itself (real screens that exist but were never documented). Read this before touching any individual dashboard folder — several page-level tasks below depend on how these get resolved.

## How the rest of this folder is organized

Mirrors the four live-system dashboards, plus two areas that don't exist in the live system at all:

| Folder | Scope |
|---|---|
| [`02-shared-components/`](02-shared-components/) | The cross-cutting work: the reusable DataTable/Filter/Actions master component (`Rule 02 · R02-2`) and the mandatory empty/no-results/loading/error/permission-denied state set (`R02-3`). **Read before any page-level file** — every page below assumes these exist and just calls out page-specific exceptions. |
| [`03-platform-admin/`](03-platform-admin/) | Changes and additions to `/platform` |
| [`04-platform-dispatcher/`](04-platform-dispatcher/) | Changes and additions to `/platform.dispatcher` |
| [`05-company-admin/`](05-company-admin/) | Changes and additions to `/companies.admin` — the largest single area, since most of the new financial system lives here |
| [`06-company-dispatcher/`](06-company-dispatcher/) | Changes and additions to `/companies.dispatcher` |
| [`07-technician-mobile-app/`](07-technician-mobile-app/) | **Entirely new** — no live-system doc, no screenshot, nothing to diff against. Built forward from the BRDs alone. |
| [`08-customer-payment-link.md`](08-customer-payment-link.md) | One standalone file — the only customer-facing surface in the product, and it has never existed in any form |

## How to read one task

Every task in every file uses the same tag so you can scan a file and know what kind of work it is before reading the description:

| Tag | Meaning |
|---|---|
| 🆕 **NEW PAGE** | A route that doesn't exist today. Full screen design from scratch, but reusing the established shell/nav/card/table language — never a new visual system (`Rule 02 · R02-1`). |
| ➕ **NEW SECTION** | A new tab, panel, or block added to a page that already exists. |
| 🧩 **NEW MODAL** | A new modal/drawer, usually triggered from an existing page's action row. |
| ✏️ **MODIFY** | A field, column, action, or flow that exists today but needs to change shape, values, or behavior. |
| ⚠️ **CONFLICT — decision needed** | The live system's actual behavior contradicts a stated business requirement. Do not design either direction until this is called out to the client/dev — see `01-critical-findings-and-conflicts.md`. |
| ✅ **NO CHANGE** | Checked against the requirement and it already complies. Listed so nobody re-designs it by accident. |

Each task states: where it lives (dashboard → nav → page, or new nav item), which requirement drives it (rule ID / `Q-nn` / BRD section), what currently exists (or "nothing" with a `[LIVE:...]` citation), what to design (fields, layout, interactions), which of the five actors can see it (`Rule 02 · R02-4`), which of the five mandatory states need special handling beyond the shared-component default (`R02-3`), and any open question that still caps how far the design can go.

## What this folder is *not*

- Not a redesign — every task assumes the existing visual language (`Rule 02 · R02-1`) and the existing information architecture unless a task explicitly says otherwise.
- Not final-answer UI — these are specs for a designer to work from, not Figma files or generation prompts (those belong in `design-prompts/` once a task here is picked up, per the root `CLAUDE.md`).
- Not a place to re-litigate open questions — where a task depends on an unresolved `Q-nn`, it says so and designs only the part that holds regardless of the answer, exactly as the affected BRD modules already do.

## Known limitation of the source material

The live-system audit is thorough but not exhaustive. Both admin dashboards' sidebars show a **Notifications** nav item (visible in the `platform-settings.png` and `company-admin-settings.png` screenshots) that has no corresponding `.md` file anywhere in `live-system/`. The Company Admin sidebar also shows **Jobs**, **Customer**, **Users**, and **Audit Log** nav items with no corresponding docs (only `01-dashboard` through `05-call-logs` were written up, covering Dashboard, Code Requests, Key Codes, Technicians, and Call Logs/Settings/Reports). Where a task below touches one of these undocumented pages, it says so explicitly and reasons only from the equivalent Platform Admin page plus general product consistency — treat that reasoning as a starting hypothesis to verify against the real screen, not as confirmed current behavior.
