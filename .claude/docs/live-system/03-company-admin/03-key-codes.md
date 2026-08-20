# Company Admin: Key Codes Repository & Cost Audit

## 1. Page Metadata
- **Route:** `/companies.admin/key_codes`
- **Role Permission:** `company_admin`
- **Page Title:** `JobixFlow - key Codes`
- **Screenshot:** [Company Key Codes List](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-key-codes.png)

---

## 2. Business Logic & Constraints
1. **Historical Key Code Inventory:**
   - Permanent repository of all purchased mechanical and transponder key codes.
2. **Auditing Columns:**
   - `Code`: The alphanumeric key code value.
   - `Cost`: Monetary acquisition expense incurred by the company.
   - `User Obtained`: Staff member or technician who registered the code.
   - `User Job`: Role of the obtaining user (`Technician`, `Company Admin`).
   - `Status`: `Valid` (successful cut) or `Invalid` (bad bitting code from provider).
   - `Obtained Date`: Exact timestamp of acquisition.
   - `Notes`: Operational annotations.

---

## 3. User Flows & Interactions
1. Administrator visits `/companies.admin/key_codes`.
2. Searches historical codes by code value, cost, or technician name.
3. Filters by status (`Valid` vs `Invalid`) to audit supplier accuracy and track expense write-offs.

---

## 4. Component Dependencies & Data Schema
- `App\Models\KeyCode`: `id`, `code_value`, `cost`, `obtained_by_user_id`, `status`, `notes`, `created_at`
