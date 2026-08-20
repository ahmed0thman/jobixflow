# Platform Admin: Companies Management

## 1. Page Metadata
- **Routes:**
  - Index / List: `/platform/companies`
  - Create: `/platform/companies/create`
  - Show / Details: `/platform/companies/{id}`
- **Role Permission:** `platform_admin`
- **Page Titles:** `JobixFlow - companies`, `JobixFlow - companies create`, `JobixFlow - company show`
- **Screenshots:**
  - List View: [Platform Companies List](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-list.png)
  - Action Dropdown: [Company Action Menu](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-action-menu.png)
  - Edit Modal: [Edit Company Modal](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-edit-modal.png)
  - Add New Form: [Add New Company Form](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-add-company.png)
  - Details View: [Company Details](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-company-details.png)

---

## 2. Business Logic & Constraints
1. **Company Status Lifecycle:**
   - Supported status values: `Active`, `Pending`, `Suspended`, `Deleted`.
   - Modifying a company to `Suspended` prevents its dispatchers from accepting new incoming jobs.
   - Status modal includes a `Generate Password` trigger to reset primary company admin credentials securely.
2. **Company Registration Rules:**
   - **Company Information:** `Company Name` (required), `Business Email` (required, unique), `Business Phone` (required), `Business License Number` (optional), `Country` (required, dropdown bound to active platform countries), `Commission` percentage (required), `Tax ID / EIN` (optional), `Company Status` (required).
   - **Business Address:** `Street Address` (required), `City` (required), `State` (required), `ZIP Code` (required), `Country` (required).
   - **Company Administrator:** `Admin Username` (required), `Admin Email` (required, unique across system), `Admin Phone` (required). Automatically creates an associated primary `company_admin` user.
3. **Company Metrics & Revenue Visibility:**
   - Platform Admin monitors each company's headcount: Number of Dispatchers, Technicians.
   - Live job metrics: Active Jobs, Completed Jobs, Total Revenue ($).

---

## 3. User Flows & Interactions

### Flow 1: Create New Locksmith Company
1. Administrator clicks "Add New" button on `/platform/companies`.
2. Administrator fills out the 3-section registration form:
   - Section 1: Company Information (Name, Email, Phone, License, Country, Commission, Tax ID, Status).
   - Section 2: Business Address (Street, City, State, Zip, Country).
   - Section 3: Primary Company Administrator credentials (Username, Email, Phone).
3. Clicks "Create Company".
4. System validates inputs, seeds company record, creates primary admin account, and redirects to companies index with success alert.

### Flow 2: Quick Status Modification
1. Administrator clicks row action button `...` on a target company.
2. Clicks "Edit".
3. "Edit Company" modal pops up without navigating away.
4. Administrator changes Status (e.g. from `Active` to `Suspended`) and toggles `Generate Password` if required.
5. Clicks "Save Change". Modal closes, and table updates in place.

### Flow 3: View Full Company Profile & Metrics
1. Administrator clicks row action `...` -> "Show" (or navigates to `/platform/companies/{id}`).
2. Administrator views KPI cards (Dispatchers, Technicians, Active Jobs, Total Revenue) and Performance Metrics with full address breakdown.

---

## 4. Use Cases & Edge Cases

| Case | Scenario | Expected Behavior |
|---|---|---|
| **Duplicate Admin Email** | Submitting company creation with an email already taken by another user | Validation error returned, form preserves input data, offending field highlighted. |
| **Zero Commission Value** | Company created with 0% commission | Platform logs 0 commission for platform on jobs handled by this company. |
| **Suspended Company Access** | Company status set to `Suspended` | Company dispatchers receive account restriction notice on login. |

---

## 5. Component Dependencies & Data Schema

### Entities:
- `App\Models\Company`: `id`, `name`, `email`, `phone`, `license_number`, `country_id`, `commission_rate`, `tax_id`, `status`, `address_line1`, `city`, `state`, `zip_code`
- `App\Models\User`: primary company admin linked via `company_id` and `role = 'company_admin'`
