# Company Dispatcher — Role Overview

**Login:** `haven.hirthe@example.org` / `12345678` (Mrs. Andreane Kunze V, User ID `CNBS63VU`, Company 1 / Ziemann-Satterfield)
**Landing page:** `https://jobixflow.com/companies.dispatcher` (Active Jobs Dashboard)

## Navigation structure

Single-level fixed left sidebar (top-navbar shell pattern, matching Platform Dispatcher — avatar/notifications in a top-right bar, not a sidebar-pinned user card), in this order:

1. Dashboard (`/companies.dispatcher`)
2. Active Jobs (`/companies.dispatcher/jobs`)
3. Incoming Jobs (`/companies.dispatcher/incoming-jobs`)
4. Technicians (`/companies.dispatcher/technicians`)
5. Live Map (`/companies.dispatcher/map`)
6. Notifications (`/companies.dispatcher/notifications`)

This is the smallest nav of any role mapped so far (6 items vs. 10-12 for the admin roles) — a genuinely focused, operational role.

## Pages mapped (7)

Dashboard, Active Jobs, Incoming Jobs (+ Assign Technician modal), Technicians, Live Map, Notifications, My Profile. Chat verified via both Active Jobs (populated thread + empty state) and Incoming Jobs.

## Role summary

Matches `CLAUDE.md` closely: assigns jobs to technicians (Incoming Jobs → Assign Technician), monitors on map (Live Map, fully functional), chats (composer confirmed enabled, unlike the admin roles). Does not add technicians (no create/edit action anywhere for this role, confirmed absent from both Technicians and any other page). This role's Live Map page is the single most significant positive finding across the entire audit — a fully working, spec-matching two-layer map that `CLAUDE.md` describes as not yet existing.

## Permission notes

- **Chat composer enabled**, confirmed via both a populated thread and a genuine empty-chat state ("0 active chat," "No Internal Messages," "Select Chat from List," with an active "Start New Chat" button) — a good positive reference for `Rule 02 · R02-3`'s empty-state requirement.
- **Technicians page is read-only** for this role (no Edit action) — Company Admin's equivalent page has Edit; a sensible, consistent permission split.
- **Job assignment (Incoming Jobs → Assign Technician) does not enforce the "same state + currently free" selection criterion** stated in `CLAUDE.md` — offline technicians remain fully selectable with no warning, and no location/state data is shown in the picker itself.

## Cross-cutting findings worth carrying into every other role's audit

- **[Most positive finding in this audit] The Live Map is fully built and working**, matching `LOC-003`'s two-layer spec exactly (Technicians layer + Job Locations layer, both independently toggleable and confirmed functional), with a real Google Maps JS API integration, live technician selection, and a technician→job deep link. This directly contradicts `CLAUDE.md`'s "Missing entirely" list. Recommend this be reviewed as a reference implementation before designing this screen, per `Rule 00 · R00-5`.
- **[Technician-count discrepancy, now a 3-way conflict] This role's Technicians page reports "51 technicians found" for the same company** that Company Admin's Technicians page reported 11 for, and its Users page reported 101 for. Three different numbers, three different screens, one company — a priority data-integrity question for the developer.
- **[Location display inconsistency] This role's Technicians page shows precise live GPS coordinates per technician; Company Admin's equivalent page shows "Unknown Zone" for the same data.** One of the two pages is failing to surface location data that demonstrably exists.
- **[Technician assignment doesn't enforce a stated business rule] The Assign Technician picker lists every technician regardless of availability/location**, contradicting `CLAUDE.md`'s stated same-state + currently-free criterion. Flagged as a real gap for the redesign to close with a proper guided/filtered picker.
- **A fourth technician status, "Off Duty," is now confirmed live in at least three places** (Live Map legend, Technicians filter dropdown here and on Company Admin's equivalent page's Edit form isn't checked, but the filter option itself is present) — the design should treat Available/Offline/Off Duty/Busy as the real four-state model, not the two-state Available/Offline pattern that seemed to be the case from Company Admin's Technicians cards alone.
- **Notifications discrepancy resolved**: this account's distinct 22-notification count (vs. 51/52 on the platform accounts) confirms notifications are genuinely per-user, closing the open question raised earlier in the audit.
- **Ninth confirmed occurrence of the Service Type person-name bug** (Incoming Jobs and Technicians filter panels).

## Areas not fully verified for this role

- Did not complete a real technician assignment (avoided mutating live seed job-assignment state).
- Did not click through individual job markers on the Live Map to confirm their info-window content.
- Did not observe a technician-with-no-location edge case on the map.
- Search/filter boxes on Active Jobs, Incoming Jobs, and Technicians were not exhaustively exercised beyond confirming their presence and option lists.
