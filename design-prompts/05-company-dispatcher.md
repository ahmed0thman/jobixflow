# Stitch UI Prompt — Batch 05: Company Dispatcher Portal (`/companies.dispatcher`)

## Context & Role
Generate the UI updates for the **Company Dispatcher Operations Hub** in JobixFlow. Focus on dual-source job queues (Platform vs Company) and interactive live map dispatching.

## Screen References & Required Updates

### 1. Active & Incoming Jobs
- **Screenshot References:** [company-dispatcher-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-dashboard.png), [company-dispatcher-active-jobs.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-active-jobs.png), [company-dispatcher-incoming-jobs.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-incoming-jobs.png)
- **Requirements:**
  - Add **Origin Pill Column** (`Platform` vs `Company`).
  - Add "New Job" quick intake button for company-sourced dispatches.
  - Retain Accept & Dispatch technician assignment flow for platform incoming jobs.

### 2. Interactive Live Map & Proximity Dispatching
- **Screenshot References:** [company-dispatcher-live-map.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-live-map.png), [company-dispatcher-map-technician-selected.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-map-technician-selected.png)
- **Requirements:**
  - Google Map canvas with custom pin markers for Technicians and Job Locations.
  - Map Layers filter toggle (`Technicians` & `Job Locations`).
  - Fleet Telemetry Counters (`Available: 8`, `Busy: 0`, `Offline: 3`, `Off Duty: 0`).
  - Slide-out Technician Card on marker click: Status, current job assignment, and direct 1-tap "Assign to Selected Job" action.
