# Company Dispatcher: Technicians Roster

## 1. Page Metadata
- **Route:** `/companies.dispatcher/technicians`
- **Role Permission:** `company_dispatcher`
- **Page Title:** `JobixFlow - Technicians`
- **Screenshot:** [Company Dispatcher Technicians](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-technicians.png)

---

## 2. Business Logic & Constraints
1. **Fleet Dispatch View:**
   - Provides company dispatchers with a streamlined view of all field technicians registered under the company.
2. **Technician Attributes:**
   - Full Name and Avatar Initials.
   - Status Indicator (`Available`, `Busy`, `Offline`).
   - Direct phone dial action.
   - Active Jobs count.

---

## 3. Component Dependencies & Data Schema
- `App\Models\User`: `WHERE role = 'technician' AND company_id = {auth->company_id}`
