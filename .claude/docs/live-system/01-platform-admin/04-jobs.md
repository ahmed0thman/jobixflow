# Platform Admin: Jobs Monitoring & Auditing

## 1. Page Metadata
- **Routes:**
  - Jobs Index: `/platform/jobs`
  - Job Details: `/platform/jobs/{id}`
  - Job Chat Audit: `/jobs/{id}/chat`
- **Role Permission:** `platform_admin`
- **Page Titles:** `JobixFlow - jobs`, `JobixFlow - job_chat #{id}`
- **Screenshots:**
  - Jobs List: [Platform Jobs List](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-jobs-list.png)
  - Job Details: [Job Details View](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-details.png)
  - Job Chat (Read-Only): [Job Chat Audit](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-chat.png)
  - Chat Thread Open: [Open Chat Thread](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-chat-open.png)

---

## 2. Business Logic & Constraints

### A. Lifecycle State Machine
Jobs advance across defined states:
`New Job` -> `Assigned to Company` -> `Assigned to Technician` -> `Technician On The Way` -> `Technician Arrived` -> `Work In Progress` -> (`tech request code` / `company get code`) -> `Completed` (or `Cancelled` / `Company Refused` / `Technician Refused`).

### B. Pricing Breakdown Model
Each job tracks multi-layered monetary components:
1. **Estimate Price:** Initial approximate pricing provided during customer dispatch intake.
2. **Physical Keys / Extra Parts:** Line items with:
   - Item type (e.g. `Physical Key`, `Remote Fob`, `Lock Hardware`)
   - Cost amount ($)
   - `Paid By`: `company` or `customer`
   - `Payment Status`: `Paid` or `Unpaid`
   - Operational Notes
3. **Final Price:** Calculated total balance including labor, service price, and billable physical materials.

### C. Payment Details Tracking
- Tracks `Subtotal`, `Total Amount`, `Payment Date`, `Payment Method` (`Payment Link`, `Cash`, `Card`), `Transaction ID`, `Reference Number` (e.g. `REF-92043`), and `Payment Status` (`Paid`, `Pending`, `Failed`).

### D. Chat Auditing (ROL-004 Enforcement)
- Platform Admin has global read access across all job communications.
- **Strict Read-Only:** Message input is disabled with placeholder `👁 Only Show`, and send button is disabled. Platform Admin can inspect full communication histories between Platform Dispatchers, Company Dispatchers, and Technicians without posting messages.

---

## 3. User Flows & Interactions

### Flow 1: Filter & Inspect Job Record
1. Administrator navigates to `/platform/jobs`.
2. Administrator filters by status (e.g., `Cancelled`, `High Priority`, `Today`) or searches by Job ID / Customer.
3. Administrator clicks row action `...` -> "Show" (`/platform/jobs/{id}`).
4. Administrator reviews:
   - General Info: Platform Dispatcher, Company Dispatcher, Assigned Company, Technician, Schedule, Needs Key, Needs Code.
   - Pricing & Parts: Line-item breakdown of hardware costs and payer attribution.
   - Payment Details: Gateway transaction ID, payment status.
   - Customer Details: Name, address, phone number, email.
   - Vehicle Details: VIN, Brand, Model, Year, Plate Number, Engine Number, Color.
   - Status Timeline: Exact historical audit trail with timestamps, old/new states, and modifying user identifier + role.

### Flow 2: Communication & Chat Audit
1. In Job Details view, administrator clicks "Open Chat" (or row action "Chat").
2. Navigates to `/jobs/{id}/chat`.
3. Left pane shows participant threads (e.g., `Kailee Reichel - Platform Dispatcher`, `Mrs. Andreane Kunze V - Company Dispatcher`).
4. Administrator clicks thread to review timestamped messages in full chronological sequence.

---

## 4. Use Cases & Edge Cases

| Case | Scenario | Expected Behavior |
|---|---|---|
| **Dispute Resolution** | Customer disputes extra key cost charged on site | Administrator inspects "Pricing Details" line items to verify if part was marked `Paid By: customer` with technician notes, cross-referenced with "Status Timeline". |
| **Failed Transaction** | Payment gateway returns failed status on Payment Link | Payment Details badge displays `Failed` in red; job remains in pending financial state. |
| **Read-Only Chat Enforcement** | Admin attempts to type in chat window | Textbox is explicitly disabled (`disabled` attribute) with visual `👁 Only Show` banner. |

---

## 5. Component Dependencies & Data Schema

### Entities:
- `App\Models\Job`: `id`, `company_id`, `technician_id`, `platform_dispatcher_id`, `company_dispatcher_id`, `customer_id`, `status`, `priority`, `estimated_price`, `final_price`, `needs_key`, `needs_code`, `scheduled_at`
- `App\Models\JobCost`: `job_id`, `cost_type`, `cost`, `paid_by`, `payment_status`, `notes`
- `App\Models\Payment`: `job_id`, `amount`, `subtotal`, `payment_method`, `transaction_id`, `reference_number`, `status`
- `App\Models\JobVehicle`: `job_id`, `vin`, `brand`, `model`, `year`, `plate_number`, `engine_number`, `color`
- `App\Models\JobStatusLog`: `job_id`, `user_id`, `from_status`, `to_status`, `created_at`
- `App\Models\ChatMessage`: `job_id`, `sender_id`, `recipient_id`, `message`, `type`, `created_at`
