# Dashboard — Company Admin
URL/route: `https://jobixflow.com/companies.admin`
Purpose: Company-scoped landing page — job volume, urgent-jobs banner, revenue trend, job-type mix, recent jobs.

## Navigation path
Default landing page after login for this role.

## CRUD actions tested
Read only. KPI tiles: Active Jobs (4, "+12% from yesterday"), New Jobs (36, "Awaiting assignment"), Completed Today (0, "On track"), Available Technicians (8 of 11 total). An "Urgent Jobs Require Attention" banner ("8 urgent jobs need immediate assignment") sits above the KPI row. Two charts: Revenue Trend (line, Fri–Thu) and Job Types Distribution (pie, legend correctly shows "vehicle"/"door" — this is the **Item Type** field, distinct from the buggy Service Type field, and is fine). "Recent Jobs" list shows Service-Type(Item-Type) • Customer, priority pill, status pill.

## Hidden / secondary UI elements
- Sidebar uses the **same shell pattern as Platform Admin** (role-subtitle under logo, user card pinned to sidebar bottom) — not the top-navbar pattern seen on Platform Dispatcher. This confirms the shell inconsistency is genuinely **per-role-family** (admin roles get the sidebar-card shell; dispatcher roles apparently get the top-navbar shell) rather than random — worth confirming once Company Dispatcher is mapped.
- "Recent Jobs" rows again display as `Shayna Price (Door)` — i.e., **Service Type (Item Type)** — reconfirming the Service Type person-name bug is visible company-wide too, not just on the platform dashboards.

## States observed
- Empty state: Not observed.
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: None found.

## Validation & edge cases
N/A.

## Permissions
Company-scoped: all figures (4 active jobs, 11 technicians) are far smaller than platform-wide totals, confirming tenant isolation is working correctly on this view (`TEN-002`).

## Issues / inconsistencies / open questions
- Reconfirms the Service Type data bug (see `platform-dispatcher/service-types/service-types.md`) is visible on this role's dashboard too.
- Shell pattern matches Platform Admin's (sidebar-pinned user card), not Platform Dispatcher's (top navbar) — supporting the theory that shell differences are admin-vs-dispatcher, not random.
