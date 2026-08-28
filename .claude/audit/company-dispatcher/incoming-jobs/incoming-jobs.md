# Incoming Jobs — Company Dispatcher
URL/route: `https://jobixflow.com/companies.dispatcher/incoming-jobs`
Purpose: The core technician-assignment queue — jobs assigned to this company but not yet assigned to a technician. Confirmed live and functional.

## Navigation path
Sidebar → "Incoming Jobs" (third item).

## CRUD actions tested
- **Update (the core action)**: "Assign Technician" link per card → "Assign Job To Technician" modal with a single **Technician** searchable dropdown (Select2-style), listing **every technician at this company regardless of status** — each option shows the technician's name plus a live "Available" / "Offline" tag (e.g. "Eldora Zulauf Offline," "Claud Boyle II Available"). Cancelled without submitting (navigated away instead, since the modal's own Cancel button was obscured by the still-open Select2 dropdown — see Issues).
- Create/Delete: N/A on this page.

## Hidden / secondary UI elements
- **Filter panel**: Priority (All/Low/Medium/High), **Service Type** (the same broken ~55-person-name list, sixth confirmed occurrence of this bug across the audit), Date (All/Today/Last Week/Last Month), with explicit "Filter" and "Reset" actions (Reset is a real link back to the unfiltered URL, a good pattern).
- Each incoming job card shows: title (which is actually the buggy Service Type value, e.g. "Elvera Boyer"), priority pill, description or "No description available" placeholder, customer name, address (free text, confirming `JOB-004`), time, price, and the Assign Technician action.

## States observed
- Empty state: Not observed (5 incoming jobs present, "5 new jobs waiting for assignment" stated in the page subtitle).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested (assignment not completed).
- Disabled elements: None found — notably, **Offline technicians are not disabled or excluded from the assignment dropdown**, only labeled.

## Validation & edge cases
Not tested.

## Permissions
Company + role scoped (this dispatcher's own company's incoming jobs only).

## Issues / inconsistencies / open questions
- **[FINDING — contradicts a stated business rule] The technician-assignment dropdown does not filter or restrict selection to currently-free technicians.** `CLAUDE.md` states the assignment criterion explicitly: "technician is in the same state and is currently free (not on another job)." Live behavior: the dropdown lists **every** technician at the company, "Offline" ones fully selectable right alongside "Available" ones, with no visible state/location information at all to verify the same-state criterion either. This means a dispatcher can currently assign a job to an offline technician with no warning or block. Recommend the redesign make this a genuinely guided/filtered picker (hide or clearly disable ineligible technicians, matching `Rule 02 · R02-4`'s "absent or disabled with a stated reason" principle) rather than reproducing today's unrestricted dropdown.
- **[FINDING]** No location/state information is shown anywhere in the Assign Technician modal, so even if a dispatcher wanted to manually apply the same-state rule, they have no data to do it with from this screen. Relevant context for the Live Map / two-layer map design work.
- **[FINDING] Sixth confirmed occurrence of the Service Type person-name bug**, this time in the Incoming Jobs filter panel.
- **[UI bug]** The Select2 technician dropdown stayed visually "open" and intercepted pointer events even after a selection was made, blocking the modal's own Cancel button until Escape was pressed and the page was reloaded. Worth a developer check — this select2/Bootstrap-modal interaction issue may affect real dispatcher usage, not just this audit session.
