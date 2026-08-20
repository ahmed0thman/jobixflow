# Platform Dispatcher: Service Types Catalog

## 1. Page Metadata
- **Route:** `/platform.dispatcher/service_types`
- **Role Permission:** `platform_dispatcher`
- **Page Title:** `JobixFlow - services`
- **Screenshots:**
  - Services List: [Platform Service Types](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-service-types.png)
  - Add Service Modal: [Add Service Modal](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-add-service-modal.png)

---

## 2. Business Logic & Constraints
1. **Service Definition:**
   - Predefined locksmith job types used across dispatch intake and reporting (e.g. Car Lockout, Residential Lock Replacement, Transponder Key Programming).
2. **Usage Tracking:**
   - Computes live count of:
     - `Jobs`: Total jobs categorized under this service.
     - `Technicians`: Total certified technicians mapped to this capability.
3. **Creation & Modification:**
   - `Service Name *`: Unique name identifier.

---

## 3. User Flows & Interactions
1. Dispatcher visits `/platform.dispatcher/service_types`.
2. Clicks "Add Service" to define a new service capability in the system.
3. Input `Service Name *` in modal and clicks "Create Service".

---

## 4. Component Dependencies & Data Schema
- `App\Models\ServiceType`: `id`, `name`, `created_at`, relationships: `hasMany(Job::class)`
