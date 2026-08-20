# Rule 02 — Design constraints

Binding constraints on every screen, component and generation prompt produced in this workspace.

## R02-1 · Extend the existing product, do not redesign it

JobixFlow is live and has an established visual language. New work must look like it belongs to the same product. Do not introduce a new palette, type scale, spacing system, icon family, or layout paradigm.

Full reference: [`design-plans/00-design-system-inferred.md`](../../design-plans/00-design-system-inferred.md). That document is **inferred from nine PNG screenshots** and every value in it is provisional until confirmed against the real Figma file.

Working summary — primary blue `#3B82F6`/`#2563EB`; page background `#F8FAFC`; white cards, ~12px radius, hairline border, soft shadow; text `#0F172A`, muted `#64748B`; semantic green `#22C55E`, amber `#F59E0B`, red `#EF4444`, violet `#A855F7`; fixed left sidebar with product name, role subtitle, icon+label nav, user card pinned bottom; page title bold with a gray subtitle line; outline icons throughout.

## R02-2 · The reusable component mandate

Agreed directly with the developer in the handover meeting `[T:349-411]` and reaffirmed at `[T:397]`. This is a **design deliverable, not a code concern**.

Build **one** master component in Figma for each of:

- **DataTable** — every column type, sortable and plain headers, row density, selection, pagination, sticky header, row-level status and money cells
- **Filter** — global search, per-column filters, date ranges, quick-filter chips with counts, applied-filter tokens, clear-all, saved views
- **Actions** — the row-action cluster: chat, WhatsApp, call, view, edit, delete, and any future action, with overflow behavior

Each must contain **every variant, state and permutation** in one place, so a change is made once and propagates. Screens then consume the component and show or hide parts of it — they do not fork it.

Precedent: the developer maintains exactly this in her own Figma library and demonstrated it during the meeting `[T:374-377]`. Match that approach.

Do not design a bespoke table or filter bar on any individual screen. If a screen needs something the master component cannot express, extend the master component.

## R02-3 · Mandatory state coverage

Every screen and every component variant ships with all of:

- **Empty** — never used before, no data yet
- **No results** — filters or search excluded everything (distinct from empty, and needs a clear-filters affordance)
- **Loading** — skeleton or spinner, sized to the real content
- **Error** — failed to load, with a retry path
- **Permission denied** — the role may reach this view but not this data

A design missing these is incomplete, not "to be handled later". Half of the business rules in this project are visibility rules, which means denied and filtered states carry real product meaning here.

## R02-4 · Role visibility is UI state, not omission

Permissions differ sharply across the five actors. Express this **explicitly in the design**:

- Actions a role cannot perform are **absent or disabled with a stated reason** — never present and silently failing
- Read-only chat for both admin roles means the composer is visibly gone or disabled, per `ROL-004` / `ROL-005`
- Data a role must not see is **not rendered at all** — masked phone numbers per `COM-001` must not exist in the DOM, tooltip, export, or notification payload

Annotate every screen with which of the five actors sees it and how it differs per role.

## R02-5 · Design for the real data volume

The developer's explicit concern `[T:344, 564-578]`: the audit log will reach millions of rows, and a single global search across every column will not hold up.

Consequently:

- A lone global search box is **never sufficient** on a high-volume table
- High-volume tables need **per-column filtering, date-range constraints, and a required or strongly defaulted scope** (company, date window) before results load
- Design the pagination, result-count and "narrow your search" affordances explicitly — do not assume infinite scroll
- Show applied filters as removable tokens so users can see why a result set is what it is

## R02-6 · Financial presentation

The financial system carries signed, directional money and this must be unambiguous on screen:

- A technician balance can be **owed to them or owed by them** — direction must be readable without inference from a minus sign alone
- Backcharges, deductions, refunds and disputes are **negative events** and need consistent visual treatment distinct from ordinary earnings
- Frozen or held amounts are a **distinct state** from either debited or available, per `FIN-F-004`
- Every amount displays its currency; every fee shows whether it is a percentage or a flat amount
- No balance field is ever editable, per `FIN-S-003` — corrections are a new adjustment transaction and need their own flow

## R02-7 · Screens are derived from requirements, not from screenshots

Per [Rule 00 · R00-5](00-working-agreement.md), the screen inventory is built forward from the BRDs. Every screen in a design plan cites the requirement IDs it satisfies, so coverage can be checked in both directions. Current-build coverage stays marked **unverified** until confirmed against the real Figma file or the live dashboards.

## R02-8 · Generation prompts must be self-contained

Figma and Gemini cannot read this workspace. Every prompt in `design-prompts/` therefore carries inline: the design-system summary, the specific screen's requirements, the role context, the required states from R02-3, and the component contract from R02-2. A prompt that references a file path or a requirement ID without restating its content will produce generic output.
