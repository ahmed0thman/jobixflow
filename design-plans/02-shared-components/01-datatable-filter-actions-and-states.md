# Shared components: DataTable / Filter / Actions, and the five mandatory states

Read this before any page-level file in this folder. Every table, filter bar, and row-action cluster listed elsewhere assumes these master components exist and just calls out page-specific exceptions.

## Why this is its own task, not part of any one page

`Rule 02 · R02-2` requires **one** master Figma component for each of DataTable, Filter, and Actions — every variant, state, and permutation in one place — agreed directly with the developer in the handover meeting as a design deliverable, not a code concern.

The live system today does **not** do this. Every table documented in `live-system/` is a separately-built pattern per page:

- Platform Companies list, Jobs list, Users list, Customers list, Audit Log — each its own table, each with its own search box, none with per-column filters or quick-filter chips `[LIVE:.claude/docs/live-system/01-platform-admin/*.md]`
- Company Admin's Code Requests, Key Codes, Technicians — same story `[LIVE:.claude/docs/live-system/03-company-admin/*.md]`
- Filtering, where it exists at all, is a single free-text "Search by..." box (Countries: *"Table filters country entries on keyup"*) or a flat list of status filter chips with no visible count badges or removable-token pattern (Platform Dispatcher Job History: *"Status filters (New Job, Assigned to Company, ... Low, Medium, High)"* — note priority values and status values are mixed into one filter list, not separated)

None of this is a criticism of the live build — it works. But it's the opposite of the mandate, and it's also exactly the gap the developer flagged as a real operational risk: the Audit Log is going to reach millions of rows on a single global search box, with no per-column filters, no date range, and no company/user-type columns at all (`.claude/docs/live-system/01-platform-admin/08-audit-log.md` lists only User/Model/Action/Changes/Description/Created At — no company column, no user-type column).

## 🆕 NEW: Master DataTable component

**Where it goes:** Figma component library, not a page. Every table listed across this entire folder consumes it.

**What to design — every variant and state in one place:**
- Column types: text, status pill, priority pill, money (signed, currency-labeled per `Rule 02 · R02-6`), date/time, avatar+name, phone (role-conditional — see the masked-number note below), link/action.
- Sortable and plain (non-sortable) headers.
- Row density: comfortable / compact.
- Row selection (checkbox column) for future bulk actions, even where none exist yet.
- Sticky header on scroll.
- Server-side pagination footer: page size selector, result count ("Showing 1–25 of 4,213"), page jump.
- Row-level status and money cell treatments matching the existing pill language (`Rule 02 · R02-1` palette: status pills blue/purple/green tints, priority pills red/amber/green tints).
- The five mandatory states below, sized to fit a table specifically (skeleton rows, not a generic spinner).

**Phone-column variant — non-negotiable:** the DataTable component must have a **masked-phone cell variant** that renders nothing at all for a technician viewing a customer phone column (`COM-001`) — not a hidden button, not a blurred value, an absent cell. This has to be a first-class column type in the master component, not a per-page workaround, because every jobs table across every dashboard needs it.

## 🆕 NEW: Master Filter component

**What to design — every variant and state in one place, per `Rule 02 · R02-2` and the volume requirements in `Rule 02 · R02-5`:**
- Global search input (leading magnifier), always present but never the *only* filter on a high-volume table.
- Per-column filter controls — text contains, exact match/dropdown (for enums like status, priority, payment method, technician, dispatcher, company), numeric range (for money).
- Date-range control with presets — **today, this week, last week, custom range** — this exact set was named directly by the client for reports (`[T2:59]`, `.claude/docs/open-questions.md` `Q-08`) and should be the same control used everywhere a date filter appears, not a bespoke one per page.
- Quick-filter chips with live counts, matching the pattern already implied by the design-system inference in `Rule 02` ("All Jobs (6)", "High Priority (3)", "Today (5)") — active chip solid blue.
- Applied-filter tokens, individually removable, plus "Clear all."
- A **required or strongly-defaulted scope** control for high-volume tables (company, date window) — per `R02-5`, results should not load unscoped by default once a table can reach millions of rows.
- Saved views (mentioned in `R02-2`'s component contract) — at minimum the variant should exist even if no page uses it yet.

**Tenant- and self-scoping is enforced at this layer, not per page.** `TEN-002` (no cross-company visibility) and the newly-confirmed technician self-scoping rule (`[T2:60-61]`, a technician never sees another technician's data) both mean the Filter component's available filter *options* — not just the results — must already be scoped to what the current user is allowed to see. A technician's filter shouldn't even offer other technicians' names as autocomplete options.

## 🆕 NEW: Master Actions component

**What to design — every variant and overflow behavior in one place:**
- The row-action cluster: chat, WhatsApp/SMS, call, view, edit, archive (see below — never "delete"), and room for whatever the finance modules add (issue refund, view invoice, view dispute).
- Overflow behavior once more than ~3 actions apply to a row (the live system's `...` dropdown pattern is a reasonable starting point — see `platform-companies-action-menu.png`).
- **Disabled-with-reason variant** — mandatory per `R02-4`. An action a role cannot perform must render disabled with a stated reason (tooltip or inline text), never simply absent-without-explanation and never present-but-silently-failing. This is the component-level fix for the read-only-chat requirement (`ROL-004`/`ROL-005`) and for every other role-gated action across the product.

## ✏️ MODIFY: "Delete" becomes "Archive" everywhere it appears on a live record

**The requirement:** `AUD-002` (resolved) — no hard delete of live operational/financial data. The Jobs delete control becomes an archive action, gated until a record is at least a year old (admin-configurable), state reads "Archived" never "Deleted."

**Where this shows up today:** Platform Dispatcher's Job History page has an explicit `delete / reassign` row action (`.claude/docs/live-system/02-platform-dispatcher/03-job-history.md`) that currently — per the original developer transcript — does nothing (`Q-07`'s original framing).

**What to design:**
- Replace the "delete" action in the master Actions component with **"Archive"** for every entity this applies to (confirmed for Jobs; likely also applies to Companies, given Platform Companies already has a `Deleted` status value in its lifecycle — `.claude/docs/live-system/01-platform-admin/02-companies.md` — which should probably be relabeled the same way, flag to confirm scope).
- Age-gated disabled state: if a record is younger than the configured threshold, the action shows disabled with the reason ("Available to archive after [date]").
- A visible **Archived** filter/view alongside the normal list, not a destructive confirmation dialog implying permanent loss.

## The five mandatory states (`Rule 02 · R02-3`)

None of the state coverage below is currently visible or described in any live-system doc — every doc that mentions edge cases (e.g. Platform Dashboard's "No Active Companies" case) describes a **zero-count KPI**, not a designed empty-state illustration/message/CTA. Treat all five states as net-new design work for every table and every page in this folder, using this shared spec rather than reinventing it per page:

| State | When | Design requirement |
|---|---|---|
| **Empty** | Genuinely no data yet (e.g. a brand-new company with zero jobs) | Illustration/icon + message + primary CTA where one makes sense (e.g. "Create your first job") |
| **No results** | Filters/search excluded everything | Distinct from Empty — message references the active filters, plus a "Clear filters" affordance (ties directly to the Filter component's applied-token pattern above) |
| **Loading** | Data fetch in flight | Skeleton rows/cards sized to the real content, not a generic spinner overlay |
| **Error** | Fetch failed | Message + retry action |
| **Permission denied** | Role can reach the route but not this data | Distinct from a 404 — explains *why*, not just that access failed (per `R02-4`, this is where a read-only chat composer, a hidden phone column, or a technician's scoped-out report row all live conceptually) |

Every page-level file in this folder should be read as "the shared table/filter/actions/states above, plus what's specific to this page" — page files below only call out exceptions or page-specific state content (e.g. the exact empty-state copy for an empty Technician Account), not the mechanics.
