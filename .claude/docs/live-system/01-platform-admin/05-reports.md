# Platform Admin: Financial & Operational Reports

## 1. Page Metadata
- **Route:** `/platform/reports`
- **Role Permission:** `platform_admin`
- **Page Title:** `JobixFlow - report`
- **Screenshot:** [Platform Reports](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-reports.png)

---

## 2. Business Logic & Constraints
1. **Technician Performance Overview:**
   - Visualizes completed job volume grouped by individual field locksmith technicians.
2. **Jobs & Revenue Trend:**
   - Dual-axis or overlaid trend line comparing daily job counts vs generated revenue over weekly rolling windows.
3. **Revenue by Service Type:**
   - Multi-category pie/doughnut visualization displaying earnings breakdown across catalogued service types (e.g. Lockout, Key Duplication, Rekeying, Ignition Repair).
4. **Key Metrics Summary Card:**
   - **Total Jobs (7 days):** Rolling 7-day job throughput with percentage growth indicator vs preceding 7 days.
   - **Avg Response Time:** Average duration from job intake to technician arrival on site.
   - **Total Revenue (7 days):** Gross revenue generated in the trailing 7 days.
   - **Avg Job Value:** Total Revenue divided by Total Completed Jobs.

---

## 3. User Flows & Interactions

### Flow 1: Financial & Volume Audit
1. Administrator navigates to `/platform/reports`.
2. Administrator reviews the 4 main summary KPI indicators.
3. Administrator analyzes "Revenue by Service Type" to identify highest grossing locksmith service offerings.
4. Administrator evaluates "Technician Performance Overview" to verify technician productivity across all partner companies.

---

## 4. Component Dependencies & Data Schema

### Aggregations & Metrics:
- `App\Models\Job`: `WHERE status = 'completed'`
- `App\Models\JobServiceType`: grouped revenue sums
- `App\Models\User`: technician job completion aggregations
