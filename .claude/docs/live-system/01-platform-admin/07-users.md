# Platform Admin: Users Management

## 1. Page Metadata
- **Route:** `/platform/users`
- **Role Permission:** `platform_admin`
- **Page Title:** `JobixFlow - Users`
- **Screenshots:**
  - Users List: [Platform Users List](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-users-list.png)
  - Create User Modal: [Create User Modal](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-create-user-modal.png)

---

## 2. Business Logic & Constraints
1. **Platform User Scoping:**
   - This screen manages internal platform headquarters staff (`platform_admin` and `platform_dispatcher`).
   - Company-level staff (Company Admins, Company Dispatchers, Technicians) are managed under company sub-modules.
2. **User Roles:**
   - `Platform Admin`: Full administrative access to companies, financial reports, audits, settings.
   - `Platform Dispatcher`: Access restricted to intake, job creation, and service catalog.
3. **Creation Validation:**
   - `UserName *` (unique), `Email Address *` (unique, valid format), `Role *` (Platform Admin / Platform Dispatcher), `Initial Password *` matching `Confirm Password *`, `Phone *` (valid telephone format), `Country` (linked country reference).
4. **Primary Admin Protection:**
   - The primary system administrator (`is_primary_admin = 1`) cannot be deleted or demoted.

---

## 3. User Flows & Interactions

### Flow 1: Create New Platform Staff Member
1. Administrator clicks "Create New" on `/platform/users`.
2. Modal opens with fields: First Name, Last Name, UserName, Email, Role selector, Country, Initial Password, Confirm Password, Phone.
3. Administrator fills fields and clicks "Create User".
4. Account is activated and user can immediately sign in.

### Flow 2: Password Reset / Role Edit
1. Administrator clicks "Edit Password" or "Edit" on a specific user row.
2. Form submits updates and refreshes table.

---

## 4. Component Dependencies & Data Schema

### Entity Model (`App\Models\User`):
- `id`, `username`, `email`, `phone`, `role` (`platform_admin`, `platform_dispatcher`), `status`, `country_id`, `last_login`, `password`
