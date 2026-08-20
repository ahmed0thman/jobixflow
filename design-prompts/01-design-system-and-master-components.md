# Stitch UI Prompt — Batch 01: Design System & Master Components

## Context & Role
You are generating the foundational Design System and Master Component Library for **JobixFlow**—a multi-tenant operations platform for locksmith businesses.

## Design System Tokens (`R02-1`)
- **Primary Palette:** `#3B82F6` (Primary Blue), `#2563EB` (Active/Hover Blue), `#1D4ED8` (Focus Blue).
- **Backgrounds & Canvas:** Page Background `#F8FAFC` (Slate 50), Card `#FFFFFF`, Sidebar `#FFFFFF` with `#E2E8F0` border.
- **Text Hierarchy:** Primary `#0F172A`, Secondary/Muted `#64748B`, Subtle `#94A3B8`.
- **Semantic Badges:**
  - Success / Completed: Text `#16A34A`, BG `#DCFCE7` (Green).
  - Warning / Pending: Text `#D97706`, BG `#FEF3C7` (Amber).
  - Danger / Urgent / Disputed: Text `#DC2626`, BG `#FEE2E2` (Red).
  - Info / Assigned: Text `#2563EB`, BG `#DBEAFE` (Blue).
  - Hardware / Physical Key: Text `#9333EA`, BG `#F3E8FF` (Purple).
- **Geometry:** Card Radius `12px`, Modal Radius `16px`, Inputs `8px`, Pills `9999px`. Hairline border `1px solid #E2E8F0`.

---

## Master Components to Generate (`R02-2`)

### 1. Master `DataTable`
- **Columns:** Select Checkbox, Text, Status Pill, Priority Pill, Origin Pill (`Platform` vs `Company`), Money (Signed with currency `$`), DateTime, User Avatar + Name, Masked Phone (`COM-001`), Actions cluster.
- **Features:** Sortable indicators, comfortable (`48px`) & compact (`36px`) densities, sticky header, pagination footer with rows-per-page selector (`10`, `25`, `50`) and total count.
- **States:** Sized Skeleton loading rows, No Results message with clear filter button.

### 2. Master `Filter`
- **Elements:** Leading-icon search box, per-column dropdown selectors, preset date range picker (`Today`, `This Week`, `Last Week`, `Custom Range`), quick-filter count chips (e.g. `All (164)`, `High Priority (8)`), active filter tokens bar with individual "x" removal and "Clear all".

### 3. Master `Actions`
- **Cluster:** `Chat`, `WhatsApp/SMS`, `Call`, `Show`, `Edit`, `Archive` (age-gated, replacing delete per `AUD-002`), `...` overflow menu.
- **Disabled-With-Reason State:** Greyed-out icon with descriptive tooltip.

### 4. Five Mandatory States (`R02-3`)
- **Empty:** Clean illustration + message + primary CTA.
- **No Results:** Search illustration + query mention + "Clear Filters".
- **Loading:** Content-matched Skeleton blocks.
- **Error:** Warning icon + description + "Try Again" retry button.
- **Permission Denied / Scoped Out:** Shield icon + explanatory exclusion reason.
