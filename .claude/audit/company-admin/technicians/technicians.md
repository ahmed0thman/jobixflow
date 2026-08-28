# Technicians Management — Company Admin
URL/route: `https://jobixflow.com/companies.admin/technicians`
Purpose: Card-grid roster of this company's technicians with live status, job counts, and a per-technician settings edit.

## Navigation path
Sidebar → "Technicians" (third item).

## CRUD actions tested
- **Create**: **No "Add Technician" button found anywhere on this page** (confirmed via a full-text search, not just visual scan). This directly contradicts `CLAUDE.md`/`ROL-006` ("Technicians are created by the company admin"). Did not find an alternate entry point in this pass — see Issues and Open Questions.
- **Read**: 3 summary tiles (Available 8, On Job 0, Offline 3) + a card grid (11 technicians, 8 shown per page). Each card: avatar initials, name, status pill (Available/Offline, twice — once in the header, once as a duplicate badge, see Issues), email, phone, "Unknown Zone" (location placeholder — see Issues), last-seen relative time or "N/A", and three stat fields (Active Jobs, Completed Today, Total Jobs).
- **Update**: "Edit" link per card → "Edit Technician" modal with **Commission Percentage %\*** (pre-filled, e.g. "15.00"), **License Number**, and a **multi-select "Skills"** field. Closed without saving.
- Delete: No delete action found on this page.

## Hidden / secondary UI elements
- Search box ("Search technicians...").
- Status pill appears to render **twice per card** (once next to the name in the header, once again lower in the card body) — same value both times, likely a redundant/duplicated template element rather than two distinct pieces of information. Worth a developer check.
- Every technician's location shows literally "Unknown Zone" — consistent with `CLAUDE.md`'s description that live GPS is only recorded from acceptance onward and pinned on arrival (`LOC-002`); this static list view has no live location to show, which is expected, but the placeholder text itself ("Unknown Zone" vs. something like "No location yet") is a minor copy concern.

## States observed
- Empty state: Not observed (11 seed technicians).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested (Edit modal cancelled).
- Disabled elements: None found.

## Validation & edge cases
Not tested.

## Permissions
Company-scoped (11 technicians, matching `test-users.md`'s Company 1 roster). Company Admin can apparently Edit but — contrary to `CLAUDE.md` — could not be confirmed to Create technicians from this screen.

## Issues / inconsistencies / open questions
- **[RESOLVED] No "Add Technician" button on this page, but technician creation does exist** — confirmed via `company-admin/users/users.md`: the Users page's "Create New User" modal has a Role dropdown that includes "Technician." So `ROL-006` is satisfied, just not from this screen — technician creation is bundled into the general Users flow, not a dedicated action here. Worth a deliberate design decision either way: keep it bundled (current live pattern) or add a shortcut "Add Technician" action directly on this page, since a Company Admin managing technicians day-to-day may not think to look under "Users" for it.
- **[FINDING — major discrepancy, see `company-admin/users/users.md`] This page shows only 11 technicians, but the Users page's own KPI tile reports 101 Technicians for this same company.** This is a significant, unresolved data/scoping discrepancy — flagged in full in `users.md`, not re-detailed here to avoid duplication.
- **[FINDING] A per-technician "Commission Percentage %" field already exists live** (Edit Technician modal, pre-filled at 15.00%). This is strong, concrete evidence supporting the new financial requirement's "commission % per technician" company setting (`NEW-REQUIREMENTS.md §3.3`) — the mechanism may already be partially wired at the technician level even though the wallet/payout math that consumes it doesn't exist yet anywhere in the product. Important context for scoping the financial screens: this field likely doesn't need to be invented from scratch, just surfaced/integrated properly.
- **[FINDING — third occurrence of the Service Type bug] The "Skills" multi-select in Edit Technician is populated with the exact same ~55 person-name list** already found broken in Reports, New Job, and Edit Job. This confirms the underlying `service_types` table is being reused (or its bad seed data is being reused) as a generic "Skills" tag source for technicians too — a third distinct surface for the same root-cause bug, reinforcing the priority-fix recommendation already made in `platform-dispatcher/service-types/service-types.md`.
- **[FINDING]** Status pill appears duplicated within each card (same value shown twice) — minor but worth a developer/template check.
