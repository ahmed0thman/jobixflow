# Key Codes — Company Admin
URL/route: `https://jobixflow.com/companies.admin/key_codes`
Purpose: Searchable history of every key code obtained — confirmed live and matching `CLAUDE.md`'s description closely.

## Navigation path
Sidebar → "Key Codes" (fourth item).

## CRUD actions tested
- Read: Table — Code, Cost, **User Obtained** (name), **User Job** (role: "Technician" or "Company Admin"), Status (Valid/Invalid), Obtained Date, Notes, Actions. This is a direct, confirmed live match for `CLAUDE.md`'s description: *"Column User Obtained records whether a technician or the company admin acquired it"* — verified with real examples of both (Leone D'Amore=Technician, Mr. Colten Gorczany=Company Admin) and both status values present (Invalid, Valid).
- Row kebab menu → **Show / Edit / — separator — / Delete**, same convention as Platform Admin's Companies page. Not opened further in this pass (pattern already well-documented elsewhere in this audit).

## Hidden / secondary UI elements
- Status filter: All Statuses / Invalid / Valid.
- Search box ("Search by code, cost, or user...").
- One seed row has a Code value of literal Arabic text "وووو" — clearly placeholder/testing input, not a real key code, but confirms the field accepts non-Latin/free-text input without issue.

## States observed
- Empty state: Not observed (single page, only 3 rows — this company's actual key-code history, much smaller than the platform-wide seed tables elsewhere).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested.
- Disabled elements: None found.

## Validation & edge cases
Not tested.

## Permissions
Company Admin, fully company-scoped (only 3 rows for this company vs. the huge platform-wide tables seen elsewhere).

## Issues / inconsistencies / open questions
- **[FINDING] Two copy bugs, likely copy-pasted from the Code Requests page**: the page subtitle reads "Manage codes from companies **.**" (stray space before the period), and the table section heading still reads **"All Code Requests"** instead of "All Key Codes." Small, one-line developer fixes, but real live bugs worth flagging.
- **[OPEN]** Did not verify whether searching by **VIN** (the flow `CLAUDE.md` describes — "the technician searches by VIN and retries an old code for the same vehicle") is actually possible from this screen's search box, since VIN isn't a visible column here at all. The search placeholder says "code, cost, or user" — VIN is conspicuously absent. Worth a developer check on whether VIN search is wired in on the backend even though it's not advertised in the placeholder, since this is a stated core requirement of the feature.
