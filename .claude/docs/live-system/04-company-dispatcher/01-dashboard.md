# Company Dispatcher: Active Jobs Dashboard

## 1. Page Metadata
- **Route:** `/companies.dispatcher`
- **Role Permission:** `company_dispatcher`
- **Page Title:** `JobixFlow - active jobs`
- **Screenshot:** [Company Dispatcher Dashboard](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-dashboard.png)

---

## 2. Business Logic & Constraints
1. **Dispatcher Command Counters:**
   - **Active (164):** Ongoing jobs in progress across company technicians.
   - **New (0):** Incoming unassigned jobs awaiting dispatcher action.
   - **Today (0):** Jobs completed today.
   - **Available (8):** Real-time count of free locksmith technicians ready for assignment.
2. **Active Job Cards Stream:**
   - Card highlights customer name, live status badge (`Technician On The Way`, `Technician Arrived`, `Assigned to Technician`), address, time, assigned technician initials & full name, and price ($).
3. **Urgent Attention & Available Technicians Panels:**
   - Side widgets highlighting critical jobs and listing immediately dispatchable personnel.

---

## 3. User Flows & Interactions
1. Dispatcher logs into `/companies.dispatcher`.
2. Inspects top KPI cards to balance technician workload against active jobs.
3. Coordinates ongoing dispatches directly from the active cards stream.

---

## 4. Component Dependencies & Data Schema
- `App\Models\Job`: `WHERE company_id = {auth->company_id}`
- Live real-time status broadcasting via WebSockets
