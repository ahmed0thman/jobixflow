# Company Admin: Code Requests Management

## 1. Page Metadata
- **Routes:**
  - Index: `/companies.admin/code_requests`
  - Show / Fulfill: `/companies.admin/code_requests/{id}`
- **Role Permission:** `company_admin`
- **Page Titles:** `JobixFlow - code requests`, `JobixFlow - code request`
- **Screenshots:**
  - Code Requests List: [Company Code Requests List](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-code-requests.png)
  - Request Details: [Code Request Details View](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-code-request-details.png)
  - Add Code Modal: [Add Code Modal](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-add-code-modal.png)

---

## 2. Business Logic & Constraints

### A. Field Locksmith Code Request Flow
1. When a technician is on site attempting to cut or program a vehicle key without an existing key code, they submit a **Key Code Request** from their mobile interface.
2. Status values: `Pending`, `Approved`, `Available`, `Rejected`.

### B. Request Data & Asset Context
- Company Admin inspects vehicle identification numbers needed to purchase the code:
  - `VIN` (e.g. `ho22542909`)
  - `Brand` (e.g. `Toyota`)
  - `Model` (e.g. `Camry`)
  - `Year` (e.g. `2010`)
  - `Plate Number`
  - `Engine Number`
  - `Color`

### C. Code Fulfillment & Cost Accounting (DEV NOTE Alignment)
- Administrator contacts their external code provider (e.g. NASTF, dealership, third-party broker).
- Clicks "Add Code" to fulfill the request.
- Modal requires:
  - `Code Value *`: The alphanumeric cut/bitting code.
  - `Provider *`: Name of the provider where the code was purchased.
  - `Cost *`: Exact purchase cost ($) paid by the company to acquire the code.
  - `Notes`: Additional provider reference or batch info.
- Upon saving, status transitions to `Available` / `Approved`, and code is instantly made accessible to the requesting field technician.

---

## 3. User Flows & Interactions

### Flow 1: Fulfill Key Code Request
1. Administrator navigates to `/companies.admin/code_requests`.
2. Locates request in `Pending` state and clicks "Show".
3. Reviews vehicle VIN and model details.
4. Procures code from external vendor.
5. Clicks "Add Code" button.
6. Modal opens: Fills Code Value, Provider, Cost ($), and Notes.
7. Clicks "Save Code".
8. System logs key code record, updates request status, and notifies technician.

---

## 4. Component Dependencies & Data Schema

### Entities:
- `App\Models\CodeRequest`: `id`, `job_id`, `technician_id`, `company_id`, `status`, `created_at`
- `App\Models\KeyCode`: `code_request_id`, `job_id`, `code_value`, `provider`, `cost`, `notes`, `obtained_by_user_id`, `status`
- `App\Models\JobVehicle`: `vin`, `brand`, `model`, `year`, `plate_number`, `engine_number`, `color`
