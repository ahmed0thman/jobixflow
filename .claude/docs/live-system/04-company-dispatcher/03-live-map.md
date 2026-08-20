# Company Dispatcher: Interactive Live Map Fleet Tracking

## 1. Page Metadata
- **Route:** `/companies.dispatcher/map`
- **Role Permission:** `company_dispatcher`
- **Page Title:** `JobixFlow - technicians`
- **Screenshots:**
  - Live Map View: [Interactive Live Map](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-live-map.png)
  - Technician Inspector: [Selected Technician on Map](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-map-technician-selected.png)

---

## 2. Business Logic & Constraints

### A. Google Maps Real-Time Telemetry
1. Renders interactive vector map centered on active operational territories.
2. Plots live coordinates for:
   - **Technician GPS Pins:** Field locksmiths with color-coded status rings (`Available` = Green, `Busy/On Job` = Blue/Yellow, `Offline` = Grey, `Off Duty` = Red).
   - **Job Location Pins:** Exact customer dispatch coordinates.

### B. Map Layers & View Controls
- **Technicians Layer Toggle:** Checkbox to toggle visibility of technician markers.
- **Job Locations Layer Toggle:** Checkbox to toggle visibility of active job pins.

### C. Live Fleet Telemetry Stats
- Real-time counters:
  - `Available (8)`
  - `Busy (0)`
  - `Offline (3)`
  - `Off Duty (0)`

### D. Technician Inspector Panel & "Available Now" Roster
1. Clicking any map pin or selecting a technician from "Available Now" side list opens the **Technician Info** drawer.
2. Displays phone, active job count, distance to nearby open jobs, and battery/connection telemetry.

---

## 3. User Flows & Interactions

### Flow 1: Proximity Dispatching via Map
1. Dispatcher opens `/companies.dispatcher/map`.
2. Locates an unassigned job pin on the map.
3. Observes nearest green ("Available") technician pin.
4. Clicks technician in "Available Now" list to inspect current capacity and contact details.
5. Dispatches technician to the nearby job.

---

## 4. Component Dependencies & Data Schema
- Google Maps JavaScript SDK v3 (API integration)
- `App\Models\User`: Technician coordinates (`latitude`, `longitude`, `last_location_update`)
- `App\Models\Job`: Dispatch coordinates (`latitude`, `longitude`)
