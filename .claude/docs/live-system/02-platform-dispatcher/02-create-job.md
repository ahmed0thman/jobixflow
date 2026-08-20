# Platform Dispatcher: Job Creation & Customer Intake

## 1. Page Metadata
- **Route:** `/platform.dispatcher/jobs/create`
- **Role Permission:** `platform_dispatcher`
- **Page Title:** `JobixFlow - Dashboard`
- **Screenshots:**
  - Create Job Form: [Create New Job Form](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-create-job.png)
  - Add Customer Modal: [Add Customer Inline Modal](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-add-customer-modal.png)

---

## 2. Business Logic & Constraints

### A. Customer Selection & Quick Onboarding
1. **Search & Select Customer:**
   - Searchable combobox looks up existing registered customers by phone number or name.
2. **Inline Customer Registration:**
   - If customer is new, dispatcher clicks "Add New" button without leaving the intake flow.
   - Modal requires: `Full Name *`, `Phone Number *`, `Email` (optional), `Address *`.
   - Upon submission, customer record is persisted and immediately pre-selected in the intake form.

### B. Item Classification Rules
1. **Item Type:** `Vehicle` or `Door`.
   - **Vehicle:** Requires vehicle metadata (VIN, Make, Model, Year, Plate) during or after initial dispatch.
   - **Door:** Requires residential/commercial door hardware metadata.
2. **Country Binding:**
   - Determines geopolitical area, phone dialing codes, and eligible service providers.

### C. Service Specifications & Preliminary Pricing
1. **Service Type *:** Dropdown populated from platform catalog of locksmith services.
2. **Priority *:** `Low`, `Medium`, or `High` (High priority triggers immediate urgency visual badges).
3. **Estimate Service Price *:** Preliminary price quote agreed with customer over telephony call.
4. **Schedule At *:** Timestamp / datetime when service is required (Immediate ASAP vs Scheduled).
5. **Location Address *:** Precise dispatch address for locksmith navigation.
6. **Description:** Call notes and specific customer instructions.

---

## 3. User Flows & Interactions

### Complete Customer Intake Flow:
1. Dispatcher receives telephony call from customer.
2. Navigates to `/platform.dispatcher/jobs/create`.
3. In "Customer Information", searches customer by phone number:
   - If found: Selects customer from list.
   - If not found: Clicks "Add New", fills customer name, phone, address in modal, and clicks "Add Customer".
4. In "Item Information", selects Item Type (`Vehicle` or `Door`) and Country.
5. In "Job Details", selects Service Type, sets Priority (`High`/`Medium`/`Low`), inputs Estimate Service Price, Schedule time, and Location Address.
6. Clicks "Create Job".
7. System creates the job in `status: New Job` and redirects to Job History for company allocation.

---

## 4. Use Cases & Edge Cases

| Case | Scenario | Expected Behavior |
|---|---|---|
| **New Customer Intake** | First-time customer calling for lockout | Customer created seamlessly via inline modal; form preserves all already-entered data. |
| **Missing Price Quote** | Form submitted without estimate price | Form highlights `Estimate Service Price *` required validation error. |
| **Scheduled Future Job** | Customer books appointment for next week | `scheduled_at` stored with future datetime; job flagged as scheduled rather than immediate. |

---

## 5. Component Dependencies & Data Schema

### Entities:
- `App\Models\Job`: `customer_id`, `item_type`, `country_id`, `service_type_id`, `priority`, `estimated_price`, `scheduled_at`, `location_address`, `description`, `status = 'New Job'`
- `App\Models\Customer`: `name`, `phone`, `email`, `address`
