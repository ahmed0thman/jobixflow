# Platform Dispatcher: Command Dashboard

## 1. Page Metadata
- **Route:** `/platform.dispatcher`
- **Role Permission:** `platform_dispatcher`
- **Page Title:** `JobixFlow - Dashboard`
- **Screenshot:** [Platform Dispatcher Dashboard](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-dashboard.png)

---

## 2. Business Logic & Constraints
1. **Intake Queue & Operational Metrics:**
   - **Total Jobs:** Global count of jobs dispatched through the platform.
   - **UnCompleted:** Count of active jobs awaiting completion across partner companies.
   - **Completed:** Count of fully finalized jobs.
   - **Urgent:** Jobs flagged with `High` priority requiring immediate attention and allocation.
2. **Recent Jobs Stream:**
   - Real-time feed showing customer name, priority badge, current status, item classification (e.g. `Vehicle • 123 • Mr. Celestino Green`), estimated price, and creation timeframe.
   - Direct button "New Job" linking to customer intake workflow.

---

## 3. User Flows & Interactions
1. Dispatcher logs into `/platform.dispatcher`.
2. Reviews urgent counter cards (`Urgent: 371`).
3. Monitors incoming stream of recent jobs and initiates new customer intakes by clicking "New Job".

---

## 4. Component Dependencies & Data Schema
- `App\Models\Job`: `WHERE priority = 'high'`, `WHERE status NOT IN ('completed', 'cancelled')`
- Real-time stream powered by WebSocket / polling updates
