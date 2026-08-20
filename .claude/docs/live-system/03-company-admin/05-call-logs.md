# Company Admin: Call Logs & Settings

## 1. Page Metadata
- **Routes:**
  - Call Logs: `/companies.admin/calls`
  - Settings: `/companies.admin/settings/1/edit`
  - Reports: `/companies.admin/report`
- **Role Permission:** `company_admin`
- **Page Titles:** `JobixFlow - calls`, `JobixFlow - settings`, `JobixFlow - report`
- **Screenshots:**
  - Call Logs: [Company Call Logs](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-calls.png)
  - Settings: [Company Settings](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-settings.png)
  - Reports: [Company Reports](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-reports.png)

---

## 2. Business Logic & Constraints

### A. Call Logs Auditing
- Tracks inbound/outbound telephony operations between customers, dispatchers, and field technicians.
- Captures caller, recipient, call duration, status (Completed, Missed, Voicemail), recording references, and timestamp.

### B. Company Settings & Legal Profile
- Modifies company-level business profile:
  - `Company Name *`, `Business Email *`, `Business Phone *`, `Country *`, `Tax ID / EIN`, `Company Status *` (`Active`, `Pending`, `Suspended`, `Deleted`).
  - Business Address: `Street Address *`, `City *`, `State *`, `ZIP Code *`.

---

## 3. Component Dependencies & Data Schema
- `App\Models\Company`: Update operational profile.
- `App\Models\CallLog`: Telephony audit records.
