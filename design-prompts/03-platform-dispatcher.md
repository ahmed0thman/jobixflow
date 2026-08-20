# Stitch UI Prompt — Batch 03: Platform Dispatcher Portal (`/platform.dispatcher`)

## Context & Role
Generate the UI updates for the **Platform Dispatcher Command Center** in JobixFlow. Focus on rapid intake ergonomics, clear status signals, and cancellation taxonomy.

## Screen References & Required Updates

### 1. Dispatcher Command Center
- **Screenshot Reference:** [platform-dispatcher-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-dashboard.png)
- **Requirements:**
  - KPI Tiles: `Total Jobs`, `Uncompleted`, `Completed`, `Urgent`.
  - Active Stream Table: Upgraded to Master `DataTable` with real-time status pills and quick "New Job" button.

### 2. Job Creation & Inline Customer Intake Modal
- **Screenshot References:** [platform-dispatcher-create-job.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-create-job.png), [platform-dispatcher-add-customer-modal.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-add-customer-modal.png)
- **Requirements:**
  - **Implicit Origin (`TEN-001`):** All jobs created here silently set `origin: platform`.
  - **Priority Urgency vs Schedule At (`Q-05`):** Retain `Low`/`Medium`/`High` operational urgency pill selector, while `Schedule At` handles immediate vs future appointment time.
  - **Inline Customer Modal:** Maintain fast modal to create a new customer on-the-fly without navigating away.

### 3. Job History, Cancellation & Reassignment
- **Screenshot References:** [platform-dispatcher-job-history.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-job-history.png), [platform-dispatcher-edit-job.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-edit-job.png), [platform-dispatcher-start-new-chat.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-start-new-chat.png)
- **Requirements:**
  - **Archive Action (`AUD-002`):** Replace destructive "Delete" action with age-gated "Archive" action.
  - **Cancellation Flow (`JOB-009`):** Cancellation modal mandating selection of extendable enum reasons (`Customer Resolved`, `Customer Did Not Answer`, `Wrong Details`, etc.).
  - **Interactive Chat Workspace:** Retain interactive real-time dispatch chat drawer with Company Dispatcher and Technicians.
