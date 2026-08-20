# Platform Dispatcher: Job History & Management

## 1. Page Metadata
- **Routes:**
  - Index: `/platform.dispatcher/jobs`
  - Edit: `/platform.dispatcher/jobs/{id}/edit`
- **Role Permission:** `platform_dispatcher`
- **Page Titles:** `JobixFlow - Jobs`, `JobixFlow - Edit Job`
- **Screenshots:**
  - Job History: [Platform Dispatcher Job History](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-job-history.png)
  - Edit Job: [Edit Job View](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-edit-job.png)

---

## 2. Business Logic & Constraints
1. **Dispatcher Job Oversight:**
   - Card-based operational layout showing customer contact, dispatch address, assigned company, creation date, price, priority, and current state.
2. **Filtering & Searching:**
   - Text search across job identifiers, customer names, addresses.
   - Status filters (`New Job`, `Assigned to Company`, `Assigned to Technician`, `Technician On The Way`, `Technician Arrived`, `Work In Progress`, `tech request code`, `company get code`, `Completed`, `Cancelled`, `Company Refused`, `Technician Refused`, `Low`, `Medium`, `High`).
3. **Quick Actions per Job Card:**
   - `show chat`: Navigates directly into active job chat room.
   - `edit`: Opens full job modification view.
   - `delete / reassign`: Management triggers for job lifecycle.

---

## 3. User Flows & Interactions
1. Dispatcher visits `/platform.dispatcher/jobs`.
2. Locates an unassigned `New Job` or reviews active jobs in progress.
3. Clicks `show chat` to coordinate directly with the assigned company dispatcher.
4. Clicks `edit` if customer requests a schedule change or address correction.

---

## 4. Component Dependencies & Data Schema
- `App\Models\Job`: Paginated query with eager-loaded `customer`, `company`, `technician`, `serviceType`.
