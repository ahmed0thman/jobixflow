# Platform Admin: Audit Logging & System Settings

## 1. Page Metadata
- **Routes:**
  - Audit Log: `/platform/audits`
  - Settings: `/platform/settings/1/edit`
- **Role Permission:** `platform_admin`
- **Page Titles:** `JobixFlow - audits`, `JobixFlow - Settings`
- **Screenshots:**
  - Audit Log: [Platform Audit Log](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-audit-log.png)
  - Settings: [Platform Settings](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-settings.png)

---

## 2. Business Logic & Constraints

### A. Audit Logging System
1. **Entity Change Tracking:**
   - Logs every mutation (Created, Updated, Deleted) across all critical models (`Country`, `ServiceType`, `Company`, `Job`, `User`, `Payment`).
2. **Audit Attributes:**
   - `User`: Actor who triggered the change (e.g. `System`, `Emily Zboncak II`, dispatcher name).
   - `Model`: Target entity class name.
   - `Action`: Operation type (`Created`, `Updated`, `Deleted`).
   - `Changes`: JSON / diff of modified attributes.
   - `Description`: Human-readable summary (e.g. `User System created Country #1`).
   - `Created At`: Exact ISO timestamp.

### B. Platform Settings
1. **Branding Management:**
   - Platform Admin uploads and updates the official platform logo used on login screens, navigation headers, and exported PDF invoices.

---

## 3. Component Dependencies & Data Schema

### Entity Model (`App\Models\Audit` / `OwenIt\Auditing`):
- `id`, `user_type`, `user_id`, `event`, `auditable_type`, `auditable_id`, `old_values`, `new_values`, `url`, `ip_address`, `user_agent`, `created_at`
