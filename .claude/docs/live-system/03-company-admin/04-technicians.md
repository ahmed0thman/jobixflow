# Company Admin: Technicians Fleet Management

## 1. Page Metadata
- **Route:** `/companies.admin/technicians`
- **Role Permission:** `company_admin`
- **Page Title:** `JobixFlow - Technicians Management`
- **Screenshot:** [Company Technicians Management](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-technicians-list.png)

---

## 2. Business Logic & Constraints
1. **Fleet Availability States:**
   - **Available:** Online, currently free and ready for new dispatches.
   - **On Job:** Currently assigned to an active on-site service call.
   - **Offline:** App disconnected or technician off-duty.
2. **Technician Card Metrics:**
   - Direct contact details (Email, Phone number).
   - Geographic Zone attribution (e.g. `Unknown Zone`, or defined territory).
   - Last activity timeframe (e.g. `4 weeks ago`, `N/A`).
   - Job Performance Metrics:
     - `Active Jobs`: Currently assigned load.
     - `Completed Today`: Jobs completed during current day.
     - `Total Jobs`: Lifetime completed jobs.
3. **Modification:**
   - "Edit" action triggers technician profile and zone updates.

---

## 3. User Flows & Interactions
1. Administrator navigates to `/companies.admin/technicians`.
2. Inspects top availability counters (`Available: 8`, `On Job: 0`, `Offline: 3`).
3. Evaluates technician job load balance before approving dispatch distributions.

---

## 4. Component Dependencies & Data Schema
- `App\Models\User`: `WHERE role = 'technician' AND company_id = {company_id}`
