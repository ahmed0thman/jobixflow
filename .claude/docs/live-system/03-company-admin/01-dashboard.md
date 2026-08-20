# Company Admin: Operations Dashboard

## 1. Page Metadata
- **Route:** `/companies.admin`
- **Role Permission:** `company_admin`
- **Page Title:** `JobixFlow - dashboard`
- **Screenshot:** [Company Admin Dashboard](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-dashboard.png)

---

## 2. Business Logic & Constraints
1. **Urgent Attention Alerts:**
   - Prominent alert banner highlighting urgent jobs requiring immediate allocation (e.g. `8 urgent jobs need immediate assignment`).
2. **Company KPI Metric Cards:**
   - **Active Jobs:** Current jobs in progress handled by company technicians.
   - **New Jobs:** Incoming unassigned jobs awaiting technician allocation.
   - **Completed Today:** Finalized jobs during current calendar day.
   - **Available Technicians:** Ratio of online/free technicians vs total company roster (e.g. `8 of 11 total`).
3. **Revenue Trend Chart:**
   - Visualizes company revenue trajectory over weekly increments (Fri through Thu).
4. **Job Types Distribution:**
   - Interactive breakdown of job volume by asset type (`vehicle` vs `door`).
5. **Recent Jobs Stream:**
   - Shows latest job cards with customer name, item classification, technician assignment, priority, and current status.

---

## 3. User Flows & Interactions
1. Company Administrator logs into `/companies.admin`.
2. Inspects "Urgent Jobs Require Attention" banner and available technician headcount.
3. Analyzes revenue trends and recent technician job progression.

---

## 4. Component Dependencies & Data Schema
- `App\Models\Company`: Eager-loaded company context via authenticated user's `company_id`.
- `App\Models\Job`: `WHERE company_id = {auth->company_id}`.
- `App\Models\User`: Technicians belonging to current company.
