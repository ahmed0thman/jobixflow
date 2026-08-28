# JobixFlow — Frontend Prototype

A clickable React prototype of the **new and updated** JobixFlow screens, built to look and behave like the live product. This is not a Figma-prompt deliverable — it's a real app you run and click through.

## What this is (and isn't)

- **Real React + TypeScript + Tailwind**, but **no backend**. All data is in-memory mock data (`src/data/mock.ts`), regenerated fresh on every page reload.
- Actions (Archive, Cancel Job, Advance Status, Create Company, Export...) update local state and show a confirmation toast, so the app *feels* live — nothing persists or hits a server.
- Only screens that are **new** or **changed** by the new requirements are fully built. Screens the new requirements don't touch (Countries, Customers, Users, Notifications for Platform Admin) are lightweight placeholders in the nav, not full rebuilds — see `.claude/audit/gap-analysis.md` at the repo root for the per-screen new-vs-unchanged breakdown that drove this scope.
- Built **role by role**, starting with Platform Admin. Other roles (Platform Dispatcher, Company Admin, Company Dispatcher) are not in this codebase yet.

## Design system

Colors, spacing, and component patterns come straight from Tailwind's default palette (matches the live product's inferred design system almost exactly — see `CLAUDE.md` at the repo root) and from the 88 screenshots captured during the live-system audit (`.claude/audit/*/*/*.png`). The reusable `DataTable`, `FilterBar`, and `ActionsMenu` components (`src/components/ui/`) are the "single master component" mandated by `Rule 02 · R02-2` — every list screen consumes the same three components rather than hand-rolling its own table/filter/actions markup.

## Running it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` (or the next free port). Lands on `/platform-admin`.

```bash
npm run build     # production build + typecheck
npm run preview   # preview the production build
```

## Where things live

```
src/
  types.ts              domain types + the reconciled job status enum
  data/mock.ts           in-memory seed data (companies, jobs, audit log, transactions)
  components/ui/         generic reusable components (Button, DataTable, FilterBar, Modal, Pill, ...)
  components/domain/     JobixFlow-specific composites (StatusStepper, PricingBreakdown, CancelJobModal)
  components/layout/     Sidebar, AppShell, PageHeader
  config/nav.tsx          per-role sidebar nav config, with New/Updated badges
  pages/platform-admin/   one file per screen
```
