# Company Admin — Own Jobs and Customers (new multi-tenancy intake)

The single biggest structural gap in the entire live system relative to the new requirements. Everything else in this folder extends an existing flow; this one doesn't exist in any form.

## The gap

`.claude/docs/CLAUDE.md` §1 and `TEN-001`: companies may now add **their own customers and their own jobs**, sourced outside the platform. The live system has no path for this anywhere:

- Company Admin's documented pages are Dashboard, Code Requests, Key Codes, Technicians, Call Logs/Settings/Reports — no job-creation flow, no customer-creation flow `[LIVE:.claude/docs/live-system/03-company-admin/*.md]`.
- Company Dispatcher's documented pages are Dashboard, Active/Incoming Jobs, Live Map, Technicians — the *only* way a job enters this dashboard today is `Assigned to Company` from the Platform Dispatcher (`.claude/docs/live-system/04-company-dispatcher/02-active-and-incoming-jobs.md`, "Incoming Jobs Queue & Company Acceptance"). There is no "New Job" button anywhere in this dashboard's documentation, unlike the Platform Dispatcher dashboard which has one front and center.
- The Company Admin sidebar (visible in `company-admin-settings.png`) does show a **Customer** nav item — but it's undocumented (see `01-critical-findings-and-conflicts.md`, Finding 6). Verify what it actually contains before assuming it already supports company-sourced customer creation; the most likely current state, by analogy with every other undocumented item, is a read-only directory mirroring the Platform Admin's Customers page, scoped to jobs this company has touched — not a creation flow.

## Open question this depends on

`Q-18` (open): who performs intake for company-sourced jobs — the company dispatcher, the company admin, or a new role. The BRD notes the platform-sourced pattern splits this across two actors (platform dispatcher creates, company dispatcher assigns-to-technician); it's unconfirmed whether company-sourced work keeps that split internally or collapses it to one role. **Design for both roles being able to reach this flow** until confirmed — don't hard-code the entry point to only one dashboard.

---

## 🆕 NEW PAGE: Create Job (company-sourced)

**Where:** New "New Job" entry point on both **Company Admin** and **Company Dispatcher** dashboards (pending `Q-18`), reusing the Platform Dispatcher's Create Job form as the reference pattern (`.claude/docs/live-system/02-platform-dispatcher/02-create-job.md`) — same three-section structure (Customer Information → Item Information → Job Details), same inline "Add New Customer" modal pattern.

**What's different from the platform version:**
- **No company-assignment step** — the job is implicitly this company's own, skip straight to technician assignment (reuse the existing Company Dispatcher "Accept & Assign Technician" pattern from Incoming Jobs).
- **Origin is set silently to company-sourced** (`TEN-001`), same principle as the platform form's implicit platform-sourced origin.
- Every other field (Item Type, Country, Service Type, Priority, Estimate Price, Schedule At, Location Address, Description) carries over unchanged — this is a strong reuse case, not a from-scratch design.

**Role visibility:** Company Admin and/or Company Dispatcher per `Q-18`. Never Platform Admin or Platform Dispatcher (`TEN-002` — this is the company's own book of business).

---

## 🆕 NEW PAGE (or ➕ NEW SECTION on the undocumented existing "Customer" page): Company Customers

**Where:** Company Admin's existing (undocumented) **Customer** nav item — verify first, per the note above, whether this needs to become a full create/edit page or already is one.

**What to design:** A company-scoped customer directory with **create** capability — reuse the Platform Admin Customers page pattern (`.claude/docs/live-system/01-platform-admin/06-customers.md`: Name, Email, Phone, Address, lifetime Jobs count) plus an "Add Customer" action, matching the inline-modal pattern already proven on the Platform Dispatcher's Create Job form.

**Role visibility:** Company Admin (and Company Dispatcher, pending `Q-18`) — scoped strictly to that company's own customers, `TEN-002`.

---

## ➕ NEW SECTION: Every company-facing jobs table gets an Origin column/filter

**Where:** Company Admin's (undocumented) Jobs page, Company Dispatcher's Active/Incoming Jobs.

**Why:** `TEN-001` — origin is never absent, and `.claude/docs/CLAUDE.md` requires financials and reports to separate the two. A company running both platform-sourced and company-sourced work needs to tell them apart at a glance everywhere jobs are listed.

**What to design:** An **Origin** column (Platform / Company badge, small and consistent, similar visual weight to the existing Priority pill) on every job table this company sees, plus an Origin quick-filter chip in the shared Filter component. This is a small, mechanical addition but it needs to land on every relevant table, not just one — treat it as a checklist item for whoever builds each table: Active Jobs, Incoming Jobs (platform-sourced only by definition, so the column may be redundant there — confirm), Company Reports (`07-reports-overhaul.md`).
