# Platform Admin: Dashboard Overview

## 1. Page Metadata
- **Route:** `/platform`
- **Role Permission:** `platform_admin`
- **Page Title:** `JobixFlow - Dashboard`
- **Screenshot:** [Platform Admin Dashboard](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-admin-dashboard.png)

---

## 2. Business Logic & Constraints
1. **System Metric Aggregations:**
   - **Number of Companies:** Total registered company accounts on the platform.
   - **Active Companies:** Total companies currently with `status: active`.
   - **Total Jobs:** Total historical count of jobs created on the platform across all companies.
   - **Total Revenue:** Gross monetary value generated across all completed transactions.
   - **Number of Users:** Total registered platform and company staff members.
2. **Weekly Jobs Chart:**
   - Visualizes job volume distribution grouped by day of the current week (Monday through Sunday).
3. **Revenue Trend Chart:**
   - Visualizes revenue over monthly/weekly increments for financial tracking.
4. **Active Jobs Live Stream Table:**
   - Displays real-time jobs currently in active operational statuses (`Assigned to Company`, `Assigned to Technician`, `Technician Arrived`, `company get code`, etc.).
   - Sortable by Job ID, Company, Type, Technician, Status, Priority.
   - Server-side paginated data table.

---

## 3. User Flows & Interactions

### Flow 1: Metric Verification & Anomaly Spotting
1. Administrator navigates to `/platform`.
2. Dashboard fetches top-level KPIs. If any metric displays an abnormal drop (e.g. Total Jobs -100%), administrator inspects underlying operational tables.
3. Administrator reviews weekly throughput on "Jobs This Week" chart.

### Flow 2: Live Active Jobs Monitoring
1. In "Active Jobs" table, administrator reviews ongoing jobs across all partner companies.
2. Column headers allow ascending/descending sorting for triage (e.g. sorting by High Priority).
3. Pagination links allow navigation across all pages of active operations.

---

## 4. Use Cases & Edge Cases

| Case | Scenario | Expected Behavior |
|---|---|---|
| **Happy Path** | Platform has active companies and ongoing jobs | Real-time KPI cards display non-zero numbers, charts render weekly trends, active jobs table lists jobs with live status badges. |
| **No Active Companies** | All companies suspended or new platform installation | Active Companies count shows `0`, Active Jobs table displays empty state without crashing. |
| **Zero Revenue Week** | No paid jobs completed during current 7-day period | Revenue graph renders zero-baseline cleanly. |

---

## 5. Component Dependencies & Data Schema

### Data Sources & Entities:
- `App\Models\Company`: `COUNT(*)`, `WHERE status = 'active'`
- `App\Models\Job`: `COUNT(*)`, `WHERE status NOT IN ('completed', 'cancelled')`
- `App\Models\Payment`: `SUM(amount)` where payment successful
- `App\Models\User`: `COUNT(*)` across all roles

### UI Components:
- `SidebarNavigation`: Persistent navigation for Platform Admin
- `KPICard`: Reusable metric card with delta indicator
- `ApexCharts/ChartJS`: Weekly volume and revenue trend charts
- `DataTable`: Sortable, paginated table with status pills
