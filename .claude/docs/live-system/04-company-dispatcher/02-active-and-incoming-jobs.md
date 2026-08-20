# Company Dispatcher: Active & Incoming Jobs Management

## 1. Page Metadata
- **Routes:**
  - Active Jobs: `/companies.dispatcher/jobs`
  - Incoming Jobs: `/companies.dispatcher/incoming-jobs`
- **Role Permission:** `company_dispatcher`
- **Page Titles:** `JobixFlow - active jobs`, `JobixFlow - incoming jobs`
- **Screenshots:**
  - Active Jobs: [Active Jobs Command View](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-active-jobs.png)
  - Incoming Jobs: [Incoming Jobs Queue](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-incoming-jobs.png)

---

## 2. Business Logic & Constraints

### A. Incoming Jobs Queue & Company Acceptance
1. When a Platform Dispatcher assigns a job to a company, it enters the **Incoming Jobs** queue in `status: Assigned to Company`.
2. Company Dispatcher evaluates the job location, price, and technician availability.
3. Actions:
   - **Accept & Assign Technician:** Transitions job to `Assigned to Technician` and notifies the selected technician.
   - **Refuse Job:** Transitions job to `Company Refused`, returning it to the platform dispatcher queue with refusal justification.

### B. Active Jobs Operational Lifecycle
1. Tracks assigned jobs through real-time field progress:
   - `Technician On The Way` -> `Technician Arrived` -> `Work In Progress` -> `Completed`.
2. Dispatcher can open the direct job chat at any stage to communicate with the field technician or the platform dispatcher.

---

## 3. User Flows & Interactions

### Flow 1: Accept Incoming Job & Dispatch Technician
1. Dispatcher visits `/companies.dispatcher/incoming-jobs`.
2. Inspects new incoming job cards (Customer, Location, Price, Priority).
3. Selects an available technician from the dropdown.
4. Clicks "Accept & Dispatch".
5. Job moves from Incoming queue to `/companies.dispatcher/jobs` in `Assigned to Technician` state.

---

## 4. Component Dependencies & Data Schema
- `App\Models\Job`: `WHERE company_id = {auth->company_id}`
- Lifecycle triggers updating `technician_id`, `status`, and firing push notifications to mobile apps.
