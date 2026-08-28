# New Job (Create) — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher/jobs/create`
Purpose: The platform-sourced job-intake form — the core "customer calls, dispatcher creates the job" flow described in `CLAUDE.md`.

## Navigation path
Sidebar → "New Job" (second item), or the duplicate "New Job" button on the Dispatcher Dashboard header.

## CRUD actions tested
- **Create**: Full form tested — see fields below. Empty-form submit tested: produced **real server-side validation** (full page round-trip, not client-side JS) with 5 dismissible red alert banners at the top of the page, one per missing required field: "The service type id field is required," "The customer id field is required," "The location address field is required," "The estimated price field is required," "The scheduled at field is required." This is a genuine, well-formed validation state (not just native browser validation, unlike Companies/Countries) — good precedent to preserve.
- **Customer sub-create**: "Add New" button next to the Customer field opens an "Add New Customer" modal (Full Name*, Phone Number*, Email, Address*) — confirms `CLAUDE.md`'s description of the dispatcher either picking an existing customer or adding a new one inline. Closed via Cancel without submitting.
- Read/Update/Delete: N/A, this is a create-only form.

## Fields on the form
- **Customer*** — a searchable combobox ("Search Customer") plus a hidden paired `<select>`, with "Add New" alongside it for inline customer creation.
- **Item Type*** — Vehicle / Door (only two options — matches the "vehicle"/"door" values seen in the Jobs table Type column on Platform Admin).
- **Country*** — same messy "America Country"/"Middle East Country" seed list found on Companies/Countries/Users, defaulting to "Arab Emirates."
- **Service Type*** — see Issues, this is a major finding.
- **Priority*** — Low / Medium / High — see Issues, conflicts with a resolved open question.
- **Estimate Service Price*** — numeric spinbutton, default value "100."
- **Schedule at*** — a plain textbox with placeholder "100" (see Issues — looks like a misconfigured date/time picker).
- **Location Address*** — free-text field, correctly matching `JOB-004` (address is free text, never geolocation).
- **Description** — optional free-text field.

## Hidden / secondary UI elements
- **"Add New" customer modal** (see above) — a nested modal within the create-job flow.
- **A stray validation-adjacent message**: "Please select a customer first1" appears permanently under the Country field regardless of form state (present even on first load before any interaction) — the trailing "1" looks like a debugging artifact (likely a stray `{{ count }}` or concatenated loop-index leaking into the template) rather than intentional copy. See Issues.
- Country combobox options render literally as `"America Country ( )"` — the parenthetical country-code suffix is empty for every placeholder row, only "Arab Emirates ( AE)" and "USA ( US)" have real codes.

## States observed
- Empty state: N/A (this is a create form, not a list).
- Loading state: Not observed.
- Error state: **Captured** — full-form validation-error state with 5 stacked, dismissible alert banners (see above). Screenshot 03.
- Success/confirmation state: Not tested (did not complete a real submission, to avoid creating persistent live seed data as a job with real downstream effects — company assignment, notifications, etc.).
- Disabled elements: None found.

## Validation & edge cases
Empty submit confirmed to produce 5 distinct required-field errors, each independently dismissible (×). Did not test partial-fill, boundary values (e.g. negative or zero price), or malformed phone/email in the customer sub-form.

## Permissions
Platform Dispatcher only — matches `ROL-003`/`CLAUDE.md` (platform dispatcher creates jobs; platform admin does not, and indeed had no such nav item).

## Issues / inconsistencies / open questions
- **[FINDING — confirms a suspected bug] "Service Type" is populated with the exact same ~55 person names already seen mislabeling the Reports page's "Revenue by Service Type" chart** (e.g. "Glennie Sawayn," "Dr. Craig Larson," "Shayna Price"). Seeing the identical list here, in a required dropdown a dispatcher must use on every single job intake, upgrades this from "maybe a chart-rendering bug" (as flagged in `reports.md`) to a **confirmed live data-model bug**: the `service_types` table is seeded with people's names instead of real service categories (e.g. what should presumably be "Vehicle Lockout," "House Lockout," "Key Duplication," "Ignition Repair," etc.). This is a functional blocker for a dispatcher trying to actually use this form correctly today, not just a cosmetic reporting issue — strongly recommend flagging to the developer as a priority fix independent of the design work.
- **[FINDING — direct conflict with a resolved open question] Priority is a 3-value Low/Medium/High dropdown live in the product**, but `open-questions.md` / `NEW-REQUIREMENTS.md §6` record `Q-05` as **✅ Resolved**: "Binary Now/Scheduled flag only; no effect on price, category, or technician assignment." These are two different fields under the same name doing two different jobs: the live "Priority" (Low/Med/High, visible everywhere as a colored pill — red/amber/green per the design system) versus the client's resolved "Now vs. Scheduled" urgency flag. Either (a) the resolved answer describes a **new, different** field that needs to be added alongside/instead of the existing Priority, or (b) there's a genuine terminology collision that needs resolving with the client before any redesign touches this field. This should be treated as a new open question, not silently reconciled — recommend adding it to `open-questions.md` rather than assuming either reading.
- **[FINDING] The "Schedule at" field renders as a plain textbox with placeholder "100"** — this is almost certainly a misconfigured date/time picker (the "100" placeholder looks like a leftover from the numeric price field's config being copy-pasted). Not fit for purpose as-is; flag to developer, and design a proper date/time picker regardless.
- **[FINDING] Stray template artifact**: "Please select a customer first1" (trailing "1") appears unconditionally near the Country field — looks like a debugging leftover (e.g., an accidentally-concatenated Blade/JS expression), not intentional UI copy. Minor, but worth a one-line developer fix.
- **[OPEN]** Could not verify what happens after a successful submission (redirect target, confirmation state, whether/how the job then needs company assignment as a separate step) without completing a real submission — deferred to avoid creating persistent seed-affecting data mid-audit. Recommend a follow-up pass once a disposable/sandbox job can be safely created.
