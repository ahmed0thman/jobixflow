# Design System — Quick Reference

Light-touch visual reference gathered while mapping all four web-dashboard roles. Not a full audit — see `CLAUDE.md`'s existing "Design system" section (from the now-deleted `figma-current/` screenshots) for the more detailed provisional token list; this file only notes what's confirmed or contradicted by the live product.

## Branding

Product is branded **"JobixFlow"** throughout the live site (login page title: "JobixFlow - Super Admin Login"; every sidebar shows "JobixFlow" as the wordmark). This **resolves** the open question in `CLAUDE.md` about whether to use "JobixFlow" or "LockAccess Pro" — the live product uses JobixFlow, not LockAccess Pro.

## Primary and accent colors

Primary blue, consistent with the `CLAUDE.md`-documented `#3B82F6`/`#2563EB` range — used for primary buttons, active nav states, links, and chart bars/lines across every role. Status pills use the expected semantic palette: green for positive/completed/active, amber/yellow for medium priority and pending states, red for high priority and error/danger banners, blue for informational/in-progress states, purple/violet appears on some priority or category tags. Login page uses a plain white card on a neutral background — did not observe the blue→violet gradient hero described in `CLAUDE.md`'s inferred design system in this pass (worth re-confirming, low priority).

## Typography

Clean sans-serif throughout (system UI font stack, no distinctive display face). Page titles are bold, medium-large size, paired with a smaller gray one-line subtitle beneath — this pattern is completely consistent across every role and every page mapped. Body/table text is regular-weight, small-to-medium size, high information density.

## Overall visual style

Dense, data-heavy enterprise dashboard — every list defaults to a real data table or card grid with pagination, not a simplified summary view. Card-based layout throughout (white cards, soft shadow, rounded corners) for both content sections and KPI tiles. Minimal color usage outside of status indicators and the primary blue for actions — the interface reads as utilitarian and operations-focused rather than heavily branded.

## Main recurring UI patterns

- **KPI tile rows** at the top of most landing/list pages (3-5 tiles, bold number + label, sometimes a delta or context line).
- **Modals for almost all Create/Edit actions** — very few full-page forms outside of Add Company, Add New Job/Edit Job, and Settings pages; most CRUD happens in a Bootstrap-style modal dialog.
- **Toast/alert-style validation errors** — dismissible red banners stacked at the top of the page for server-side validation failures (confirmed on New Job, Users Create), rather than inline per-field errors.
- **Status and priority pills** — colored rounded-pill badges used consistently for job status, priority, technician availability, code-request/key-code status.
- **Pagination** — numbered page links (1, 2, 3, …, N, Next) is the dominant pattern for tables; a "Load More" click-to-append pattern is used specifically on Notifications feeds; card-grid pages (Technicians) also use numbered pagination.
- **Search + dropdown filter bars** above nearly every list — richness varies significantly by page (see gap analysis for the inconsistency this creates).
- **Two distinct shell layouts coexist**: "admin" roles (Platform Admin, Company Admin) use a sidebar with a role-subtitle under the logo and a user card pinned to the sidebar bottom; "dispatcher" roles (Platform Dispatcher, Company Dispatcher) use a sidebar with no bottom user card and a separate top-right navbar for notifications/user menu instead. Both are live in the same product today — the redesign should pick one as canonical (see gap analysis).
- **Row-level actions are inconsistent** — at least five distinct conventions were found live across the audited pages: kebab-menu-with-Show/Edit/Delete, plain inline text links, button-row-per-item (Notifications), single unlabeled icon button, and a mixed labeled-link-plus-unlabeled-icon pattern. This is the single strongest piece of evidence for why the reusable Actions master component (`Rule 02 · R02-2`) is needed.
