# Live Map — Company Dispatcher
URL/route: `https://jobixflow.com/companies.dispatcher/map`
Purpose: Real-time technician + job location map. **Confirmed fully functional and matching `LOC-003`'s two-layer spec exactly** — a major finding for the gap analysis, since `CLAUDE.md`'s "Missing entirely" list names "the two-layer map" as something that must be designed from scratch.

## Navigation path
Sidebar → "Live Map" (fifth item).

## CRUD actions tested
- Read only, as expected for a monitoring view. Real embedded Google Maps (via iframe, live API key, real "Open in Google Maps" deep link and attribution footer — this is a genuine Google Maps JS API integration, not a placeholder image).
- **Layer toggles tested and confirmed functional**: two checkboxes, "Technicians" and "Job Locations," both checked by default — **exactly matching `LOC-003`'s "exactly two layers: live technicians and pinned jobs."** Unchecking "Job Locations" visibly removed all job markers from the map while technician markers remained (screenshot 04) — a real, working toggle, not just a static UI element.
- **Technician marker/list-item interaction tested**: clicking a technician (either the map marker or the "Available Now" sidebar chip) opens a Google Maps info-window (name, status, lat/long) **and** populates a "Technician Info" side panel with avatar, name, status pill, a **"View Job" link** (routing to `/companies.dispatcher/jobs/{id}`, the technician's currently assigned job), and the raw coordinates. Confirmed working end-to-end.

## Hidden / secondary UI elements
- **Status legend**: Offline / Available / **Off Duty** / Busy — four states. "Off Duty" is a status value not previously seen anywhere else in this audit (Technicians Management showed only Available/Offline) — worth reconciling as a possible fourth technician availability state the design should account for.
- **"Live Stats" panel**: Available (8) / Busy (0) / Offline (3) / Off Duty (0) — a real-time count summary alongside the map.
- **Job markers on the map** (buttons labeled "Job #28773," "Job #JOB-1051," etc.) were present but not individually clicked through in this pass — worth a follow-up to confirm they show equivalent job-detail info-windows.
- **"Available Now" sidebar list** — clickable technician chips, functioning as an alternate selection method to clicking the map marker directly.

## States observed
- Empty state: Not observed (8 technicians, multiple jobs pinned).
- Loading state: Not observed (map/markers appeared to load synchronously in this session, though a real network delay might reveal one).
- Error state: Not tested (e.g., a technician with no location yet — `LOC-002` says location is only recorded on arrival ping, so newly-assigned technicians presumably have no marker; this edge case wasn't directly observed).
- Success/confirmation state: N/A (read-only monitoring view).
- Disabled elements: None found.

## Validation & edge cases
Not applicable — no form inputs.

## Permissions
Company-scoped (only this company's technicians and jobs are plotted).

## Issues / inconsistencies / open questions
- **[FINDING — major, corrects a premise in `CLAUDE.md`] The two-layer live map is not "missing entirely" — it is fully built and functional today**, using a real Google Maps JS API integration with working layer toggles, technician selection, and a technician-to-job deep link. This directly contradicts `CLAUDE.md`'s "What already exists vs. what must be designed" section, which lists "the two-layer map" under "Missing entirely." Per `Rule 00 · R00-5` (screen inventories must be derived forward from requirements, never asserted from prior screenshots), this finding should not be read as "the map is done, skip it" — but it is strong, direct evidence that a live reference implementation exists and should be reviewed before designing this screen from scratch. Recommend flagging to the design-plans owner as a priority correction.
- **[FINDING]** A fourth technician status, **"Off Duty,"** appears in this map's legend/stats but was not observed anywhere else in the audit (Technicians Management showed only Available/Offline as live values). Worth reconciling — either the third status exists but wasn't represented in the current seed data elsewhere, or this map's legend is ahead of/inconsistent with the rest of the product's status model.
- **[OPEN]** Did not click through individual job markers to confirm they show equivalent per-job info (address, status, assigned technician) — worth a follow-up pass.
- **[OPEN]** Did not observe what a technician with no recorded location looks like (e.g., a job just assigned, before the technician's first location ping) — relevant to designing the map's handling of `LOC-002`'s "location recorded only on arrival" rule for technicians who haven't arrived yet.
