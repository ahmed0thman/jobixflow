# Technician — Role Overview

**Login attempted:** `kyla.dach@example.net` / `12345678` (Eldora Zulauf, User ID `784ZZQJ5`, Company 1 / Ziemann-Satterfield)

## Result: web login explicitly blocked

Submitting valid Technician credentials on the web login form (`https://jobixflow.com/login`) returns a real, well-formed error banner:

> **"This account can only access the mobile application."**

Screenshot: `01-web-login-blocked.png`.

This directly and precisely confirms `CLAUDE.md`'s statement that the Technician role is a **mobile app only** — there is no web dashboard for this role, and the platform actively and correctly rejects Technician credentials at the web login form (a genuine, deliberate restriction with a clear stated reason — a good example of the "absent or disabled with a stated reason" principle from `Rule 02 · R02-4`, applied at the authentication layer rather than post-login).

## Audit scope impact

This session's tools (Playwright browser automation against the web application) **cannot reach the Technician mobile app** — it is a separate client entirely, not a responsive/mobile web view of the same dashboards. Phase 1 of this audit is therefore **complete for all four web-dashboard roles** (Platform Admin, Platform Dispatcher, Company Admin, Company Dispatcher); the Technician mobile experience is **out of scope** for this browser-based mapping exercise and was not — and could not be — mapped.

## What is known about the Technician role from other roles' pages (indirect evidence only)

Not a substitute for direct mobile-app testing, but worth carrying into the design plan as context gathered incidentally elsewhere in this audit:

- Technicians appear extensively as **data subjects** across every admin/dispatcher role's pages (job assignment, Technicians management, Live Map, Key Codes' "User Obtained" column, Code Requests, Call Logs, Audit Log).
- A per-technician **Commission Percentage %** field exists (`company-admin/technicians/technicians.md`).
- Technicians have live GPS coordinates recorded on arrival (`LOC-002`, confirmed via `company-admin/audit-log/audit-log.md`'s real `JobRequest` status-transition rows).
- Technicians have a **`twilio_identity`** field already assigned (`company-admin/audit-log/audit-log.md`) — relevant to any future in-app calling work on the mobile side.
- A four-state technician status model is confirmed live: **Offline / Available / Off Duty / Busy** (`company-dispatcher/live-map/live-map.md`, `company-dispatcher/technicians/technicians.md`).
- Technician-facing chat is **not read-only** — per `CLAUDE.md`, technicians are one side of the technician↔company-dispatcher chat pair, and the composer-enabled pattern confirmed for Company Dispatcher implies technicians can send messages too (not independently verified from the technician side).

## Recommendation

If the technician mobile app needs to be included in this audit's scope, it requires either (a) a native/mobile testing tool this session doesn't have, or (b) the designer's own device/emulator access to the real app. Recommend treating the technician mobile experience as a **separate audit effort**, not a gap in this Phase 1 pass.
