# Platform Dispatcher: Real-Time Operational Chat & Dispatch

## 1. Page Metadata
- **Route:** `/jobs/{id}/chat`
- **Role Permissions:** `platform_dispatcher`, `company_dispatcher`, `technician` (interactive); `platform_admin` (read-only audit).
- **Page Title:** `JobixFlow - job_chat #{id}`
- **Screenshot:** [Start New Chat Modal](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-start-new-chat.png)

---

## 2. Business Logic & Constraints
1. **Job-Scoped Communication Channels:**
   - Every job has a dedicated chat workspace.
   - Enables direct coordination between the intake Platform Dispatcher, the partner Company Dispatcher, and the field Technician.
2. **Interactive Messaging:**
   - Platform Dispatchers can send operational text messages, updates, customer ETA inquiries, and address directions directly into the active job thread.
3. **Start New Chat Flow:**
   - When initiating a conversation with a new participant for the job, dispatcher opens "Start New Chat" modal.
   - Dropdown displays eligible job participants (`User` dropdown).
   - Clicking "Start Chat" creates the direct thread channel.

---

## 3. User Flows & Interactions
1. Dispatcher clicks `show chat` on any active job card.
2. Navigates to `/jobs/{id}/chat`.
3. If thread does not exist yet: Clicks "Start New Chat", selects target participant, and clicks "Start Chat".
4. Types operational update into message composer and presses Enter / Send.

---

## 4. Component Dependencies & Data Schema
- `App\Models\ChatMessage`: `job_id`, `sender_id`, `recipient_id`, `message`, `type`, `created_at`
- Real-time broadcasting via Laravel Echo / Pusher WebSocket events
