# Master UI/UX Design & Generation Prompt: JobixFlow 2.0 System Overhaul

> **Role & Objective:** You are a World-Class Principal UI/UX Designer, Design System Architect, and Product Strategist. Your objective is to design the new screens, modal workflows, mobile application, and customer-facing interfaces, and update the existing web dashboards for **JobixFlow**—the mission-critical multi-tenant dispatching and financial operating platform for locksmith businesses.
>
> **Design Philosophy & Governing Rules:**
> 1. **Extend, Never Redesign (`R02-1`):** JobixFlow is live in production. You must strictly preserve the existing visual language, layout paradigms, card styles, and color tokens. Never invent arbitrary palettes or layouts.
> 2. **Master Reusable Components Mandate (`R02-2`):** All tables, filter bars, and action clusters must consume a single master `DataTable`, `Filter`, and `Actions` component contract. Never design bespoke one-off table variations.
> 3. **Mandatory 5-State Coverage (`R02-3`):** Every screen, table, and modal MUST explicitly design all 5 states: `Empty`, `No Results`, `Loading (Skeleton)`, `Error (with Retry)`, and `Permission Denied / Read-Only`.
> 4. **Role Visibility is UI State (`R02-4`):** Features and data not permitted for a role must be visibly disabled with reasons or completely omitted from rendering. Read-only admins must have disabled inputs (e.g., `👁 Only Show`).
> 5. **High-Volume Data Design (`R02-5`):** Tables subject to millions of rows must feature scoped defaults, date presets, and per-column filtering. Never rely on a lone global search box.
> 6. **Strict Financial Presentation (`R02-6`):** Directed signed balances ("Company owes Technician $X" vs "Technician owes Company $X"), itemized running breakdowns (Gross → Expenses → Gateway Fees → Commission Split → Dispatch Fee → Net), and immutable ledgers.
> 7. **Self-Contained Execution (`R02-8`):** All context, business invariants, and screen specifications are fully contained within this prompt.

---

## Part 1: Design System Specifications & Master Component Contracts

### 1.1 Inferred Design System Tokens
- **Color Palette:**
  - **Brand Primary:** `#3B82F6` (Blue 500), `#2563EB` (Blue 600 - Hover/Active), `#1D4ED8` (Blue 700 - Focus).
  - **Canvas & Backgrounds:** Page Background `#F8FAFC` (Slate 50), Card/Surface `#FFFFFF` (White), Sidebar `#FFFFFF` with `#E2E8F0` border.
  - **Typography & Text:** Primary Text `#0F172A` (Slate 900), Secondary/Muted Text `#64748B` (Slate 500), Subtle Text `#94A3B8` (Slate 400).
  - **Borders & Dividers:** Hairline Border `1px solid #E2E8F0` (Slate 200), Subtle Divider `#F1F5F9` (Slate 100).
  - **Semantic Accents:**
    - **Success / Valid / Completed:** Text `#16A34A`, Background `#DCFCE7`, Border `#86EFAC` (Green).
    - **Warning / Pending / Available:** Text `#D97706`, Background `#FEF3C7`, Border `#FDE68A` (Amber/Yellow).
    - **Danger / Urgent / Cancelled / Disputed:** Text `#DC2626`, Background `#FEE2E2`, Border `#FCA5A5` (Red).
    - **Info / In Progress / Assigned:** Text `#2563EB`, Background `#DBEAFE`, Border `#BFDBFE` (Blue).
    - **Special / Physical Key / Twilio:** Text `#9333EA`, Background `#F3E8FF`, Border `#D8B4FE` (Purple/Violet).
- **Typography (Inter / System Sans):**
  - Page Title: `24px / 1.4` Bold (`font-semibold`).
  - Section / Card Header: `16px - 18px / 1.4` SemiBold (`font-medium`).
  - Body Text: `14px / 1.5` Regular (`font-normal`).
  - Small / Helper / Table Text: `12px - 13px / 1.4` Regular / Medium.
  - Badges / Pills: `11px - 12px / 1.2` Medium / SemiBold, uppercase or title case.
- **Card & Layout Elevation:**
  - Border Radius: Cards `12px`, Modals `16px`, Inputs & Buttons `8px`, Badges/Pills `9999px` (Full pill).
  - Box Shadow: Cards `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)`, Modals/Drawers `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`.

---

### 1.2 Master Component Contracts (`R02-2`)

#### A. Master `DataTable` Component
- **Column Types:** Text, Status Pill, Priority Pill, Origin Pill, Money (Signed, currency symbol, directional coloring), DateTime (ISO & relative), Avatar + Full Name, Masked Phone (`COM-001` compliant), Link / Identifier, Actions cluster.
- **Header Features:** Sortable indicators (ascending/descending icons), plain headers, select-all checkbox column.
- **Row Density:** Comfortable (`48px` row height) and Compact (`36px` row height).
- **Sticky Elements:** Sticky table header on scroll; sticky rightmost Actions column.
- **Pagination Footer:** Rows per page selector (`10`, `25`, `50`, `100`), total record counter ("Showing 1 to 25 of 4,213 results"), first/prev/next/last navigation.
- **Masked Phone Variant:** For technicians or unauthorized viewers, the customer phone cell MUST render empty or a masked placeholder—never the raw customer number.

#### B. Master `Filter` Component
- **Search:** Global text input with leading search icon.
- **Per-Column Dropdowns:** Exact match multiselect (Status, Priority, Origin, Company, Technician, Service Type, Payment Method).
- **Date Range Picker Presets:** `Today`, `This Week`, `Last Week`, `Custom Range` (with start and end calendar pickers).
- **Quick-Filter Chips:** Pill buttons with dynamic count counters (e.g., `All (164)`, `High Priority (8)`, `Today (12)`). Active state: Solid `#3B82F6` with white text.
- **Applied Filters Token Bar:** Chips representing active filters with individual "x" removal buttons and a global "Clear all" button.
- **High-Volume Default Scoping:** Automatically mandates a scoped default (e.g., current month or active company) to prevent unindexed queries over millions of rows.

#### C. Master `Actions` Component
- **Standard Action Cluster:** `Chat`, `WhatsApp / SMS`, `Call`, `View / Show`, `Edit`, `Archive` (replacing destructive delete), `Download / Export`.
- **Financial Actions:** `Issue Refund`, `View Invoice`, `Record Adjustment`, `Upload Evidence`, `Mark as Settled`.
- **Overflow Menu:** If row actions exceed 3 items, collapse secondary actions into a `...` dropdown menu.
- **Disabled-With-Reason:** Any unauthorized or unavailable action renders disabled with an explanatory tooltip (e.g., "Archive available after 1 year", "Chat composer read-only for Admin").

---

### 1.3 The Five Mandatory UI States (`R02-3`)
1. **Empty State:** Neutral outline icon + bold title + descriptive subtitle + Primary Action CTA button (e.g., "No jobs created yet. Create your first job to get started.").
2. **No Results State:** Magnifying glass illustration + "No matching results found for '[query]'" + "Clear Filters" secondary button.
3. **Loading State:** Content-sized pulsing skeleton rows and card blocks (matching exact table column widths), never a blocking full-screen spinner.
4. **Error State:** Warning/alert icon in amber/red + error description + "Try Again" retry action button.
5. **Permission Denied / Scoped Out State:** Shield/lock icon + explicit explanation of why data is excluded (e.g., "Company on external gateway—financial data excluded from Platform Wallet per `FIN-W-002`").

---

## Part 2: Screen-by-Screen UI Specifications & Live Screen Updates

---

### Module 01: Platform Admin (`/platform`)

#### Screen 1.1: Platform Dashboard & Active Jobs Stream
- **Current Live Screenshot:** [platform-admin-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-admin-dashboard.png)
- **Modifications & Additions:**
  - **KPI Cards:** Maintain total companies, active companies, total jobs, total revenue, users. Add delta trend indicators.
  - **Active Jobs Table:** Upgrade to Master `DataTable` with `Origin` column (`Platform` vs `Company`), live status pills, priority badges (`High`/`Medium`/`Low`), and scoped date filters.
  - **States:** Ensure zero-revenue and zero-active-jobs render clean zero-state metric tiles without broken sparklines.

#### Screen 1.2: Companies Management & Edit Modal
- **Current Live Screenshots:**
  - List View: [platform-companies-list.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-list.png)
  - Action Menu: [platform-companies-action-menu.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-action-menu.png)
  - Edit Modal: [platform-companies-edit-modal.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-edit-modal.png)
  - Add Company Form: [platform-add-company.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-add-company.png)
  - Company Details: [platform-company-details.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-company-details.png)
- **Modifications & Additions:**
  - **Commission Percentage Reconciled (`Q-02`):** In `platform-add-company.png` and `platform-companies-edit-modal.png`, retain the required `Commission %` field and add an inline helper text: *"Percentage the platform retains from this company's platform-gateway transactions."*
  - **Company Details Gateway & Tenancy Block:** In `platform-company-details.png`, add a **Gateway & Telephony Configuration Status Card**:
    - `Payment Gateway`: "Platform Gateway (Fallback)" or "Company Gateway (Configured: Stripe/Square)".
    - `Twilio Masked Calling`: "Configured (Company Owned)" or "Not Configured".
    - Info Note: *"Companies on their own gateway and Twilio are isolated from platform wallet and central audit log per `FIN-W-002` & `AUD-001`."*

#### Screen 1.3: Jobs Monitoring, Itemized Details & Read-Only Chat
- **Current Live Screenshots:**
  - Jobs List: [platform-jobs-list.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-jobs-list.png)
  - Job Details: [platform-job-details.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-details.png)
  - Read-Only Chat: [platform-job-chat.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-chat.png) & [platform-job-chat-open.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-chat-open.png)
- **Modifications & Additions:**
  - **Expenses Section (`FIN-W-013`, `Q-16`):** In `platform-job-details.png`, introduce a dedicated **Job Expenses Card** distinct from physical keys:
    - Line Items: Item description (e.g. "Key blank + Key code purchase"), amount ($), and **Paid By Tag**: `Paid by Technician` vs `Paid by Company` (distinct visual styling from Customer/Company tags).
  - **Running Mathematical Breakdown:** Render payment summary as an itemized breakdown: `Gross Price` → Less `Expenses` → Less `Gateway Fee` → `Platform/Company Commission Split` → Less `Dispatch Fee` → `Net Payout`.
  - **Service Call Fee Block (`Q-20`):** For cancelled dispatches, display: "Service Call Fee: $[amount] — Collected / Waived / Refused".
  - **Refund vs Dispute Discrete Badges (`FIN-F-003`):**
    - `Refunded`: Amber/Purple badge with refund amount, issuer, and reason text.
    - `Disputed / Chargeback`: Red badge with 4-way link chips (Job, Invoice, Payment, Technician) + countdown days remaining + evidence upload status.
  - **Status Timeline & Cancellation Taxonomy (`JOB-009`, `Q-21`):** Show cancellation reason in the timeline with extendable enum values (`Customer Resolved`, `Customer Did Not Answer`, `Wrong Details`, etc.).
  - **Read-Only Chat Invariant (`ROL-004`):** Retain disabled composer with `👁 Only Show` banner in `platform-job-chat.png`.

#### Screen 1.4: Reports Overhaul (`Q-08`)
- **Current Live Screenshot:** [platform-reports.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-reports.png)
- **Modifications & Additions:**
  - **Summary Tab:** Retain the 4 existing chart widgets (Technician Performance scatter, Jobs/Revenue trend, Revenue by Service Type pie, Key Metrics tiles).
  - **Detailed Reports Tab (New):** Tabular data grids built with Master `DataTable` & `Filter`:
    - `Jobs Report`: Date range preset, company, technician, dispatcher, priority, status, estimate price, final price, net profit.
    - `Financial Transactions Report`: Master transaction ledger with type filtering (Payment, Expense, Commission, Refund, Dispute).
    - `Technician Performance Table`: Tabular conversion of scatter plot, sortable by completed jobs, average ticket size, and response time.
  - **Export Action:** Prominent "Export to CSV / Excel" button supporting date-scoped exports (`AUD-002`).

#### Screen 1.5: Platform Settings & Payment Gateway Fallback
- **Current Live Screenshot:** [platform-settings.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-settings.png)
- **Modifications & Additions:**
  - **Platform Gateway Configuration Card (`FIN-W-007`):** In addition to the logo upload, add a card for platform-level fallback payment processing (Provider selection: Stripe / Authorize.net / Square, API credentials entry, webhook endpoint, test connection button).

#### Screen 1.6: Audit Log Enhancement (`AUD-001`, `R02-5`)
- **Current Live Screenshot:** [platform-audit-log.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-audit-log.png)
- **Modifications & Additions:**
  - **New Columns:** Add `Company` and `User Type` as primary table columns and filter dimensions.
  - **Filter Suite:** Replace single search box with Master Filter (Per-column filters, user actor dropdown, date presets).
  - **Scope Advisory Notice:** Sticky banner at top: *"This log records operations conducted via platform infrastructure. Companies operating on their own payment gateway and Twilio are isolated from platform audit logs per `AUD-001`."*

#### Screen 1.7: 🆕 NEW PAGE — Platform Wallet (`/platform/wallet`)
- **Navigation Placement:** Sidebar item between "Jobs" and "Reports".
- **Layout & Structure:**
  - **Custodial Summary Strip:** Current Custodial Balance, This Week Customer Payments, Platform Commission Retained, Gateway Fees, Total Refunds, Active Disputes.
  - **Company Balances Overview Table:** Breakdown of balances held per partner company.
  - **Transaction Ledger (`DataTable`):** Transaction ID, Date/Time, Company, Job ID, Type (Payment, Commission, Refund, Dispute, Remittance), Amount ($), Acting User, Notes.
  - **Immutability Invariant (`FIN-S-003`):** Strictly read-only statement. No transfer button or balance edit fields.

---

### Module 02: Platform Dispatcher (`/platform.dispatcher`)

#### Screen 2.1: Dispatcher Command Center
- **Current Live Screenshot:** [platform-dispatcher-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-dashboard.png)
- **Modifications & Additions:**
  - Retain top KPI tiles (`Total Jobs`, `Uncompleted`, `Completed`, `Urgent`).
  - Upgrade recent jobs stream with live WebSocket status pills and quick "New Job" intake button.

#### Screen 2.2: Job Intake & Inline Customer Modal
- **Current Live Screenshots:**
  - Create Form: [platform-dispatcher-create-job.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-create-job.png)
  - Customer Modal: [platform-dispatcher-add-customer-modal.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-add-customer-modal.png)
- **Modifications & Additions:**
  - **Implicit Origin (`TEN-001`):** All jobs created here silently set `origin: platform`.
  - **Priority Urgency vs Schedule At (`Q-05`):** Retain `Low`/`Medium`/`High` as operational dispatch urgency, while `Schedule At` handles immediate ASAP vs scheduled appointment timing.
  - **Inline Customer Creation:** Maintain fast modal without navigating away.

#### Screen 2.3: Job History, Cancellation & Reassignment
- **Current Live Screenshots:**
  - Job History: [platform-dispatcher-job-history.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-job-history.png)
  - Edit Job: [platform-dispatcher-edit-job.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-edit-job.png)
  - Start New Chat Modal: [platform-dispatcher-start-new-chat.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-start-new-chat.png)
- **Modifications & Additions:**
  - **Archive Action (`AUD-002`):** Replace "Delete" action with age-gated "Archive".
  - **Cancellation Modal:** Mandate cancellation reason selection from extendable enum.
  - **Interactive Chat Workspace:** Retain interactive messaging for Platform Dispatcher with Company Dispatcher and Technicians.

---

### Module 03: Company Admin (`/companies.admin`)

#### Screen 3.1: Company Dashboard
- **Current Live Screenshot:** [company-admin-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-dashboard.png)
- **Modifications & Additions:**
  - Retain Urgent Jobs alert banner, Active Jobs, New Jobs, Completed Today, and Available Technicians (8 of 11).
  - Add quick navigation to Company Wallet and Technician Accounts.

#### Screen 3.2: 🆕 NEW PAGE — Company-Sourced Job Intake & Customers (`TEN-001`, `Q-18`)
- **Navigation Placement:** "New Job" button in header and new "Customers" management screen.
- **Form Structure (Reusing Platform Intake Reference):**
  - Section 1: Customer Information (Search existing company customers or Add New inline).
  - Section 2: Item Classification (`Vehicle` / `Door`) & State/Country.
  - Section 3: Job Details (Service Type, Urgency Priority, Estimate Price, Schedule Time, Address, Description).
  - **Key Difference from Platform Intake:** Bypasses company assignment step; routes directly to technician assignment. Silently sets `origin: company`.

#### Screen 3.3: 🆕 NEW PAGE — Company Wallet (`/companies.admin/wallet`)
- **Navigation Placement:** Top-level nav item in sidebar.
- **Structure & Features:**
  - **Financial Summary Cards:** Weekly Card Payments, Cash Collected by Techs, Gross Expenses, Net Company Wallet Balance, Payouts Due.
  - **Immutable Transaction Ledger Table:** Transaction ID, Job Reference, Invoice ID, Technician Name, Customer Name, Event Type (`Payment`, `Refund`, `Dispute`, `Gateway Fee`, `Dispatch Fee`, `Technician Commission`, `Backcharge`, `Adjustment`), Amount ($), Timestamp.
  - **Expense Isolation Filter:** Filter to isolate technician-fronted vs company-paid expenses (`FIN-W-013`).

#### Screen 3.4: 🧩 NEW MODAL — Record Adjustment (`FIN-S-003`)
- **Trigger:** "Record Adjustment" button on Company Wallet.
- **Form Elements:** Signed Amount (`+$` or `-$`), Mandatory Reason text, Optional linked Job ID, Optional linked Technician selector. Appends an immutable `Adjustment` transaction row to the ledger.

#### Screen 3.5: 🆕 NEW PAGE — Technician Account & Statement (`/companies.admin/technicians/{id}/account`)
- **Entry Point:** "View Account" link on Technicians roster card (`company-admin-technicians-list.png`).
- **Structure:**
  - **Header Banner:** Technician Name, Avatar, Commission Rate (e.g. `60%`), and **Signed Directional Balance** (rendered boldly as either `"Company owes [Technician] $450.00"` or `"[Technician] owes Company $120.00"`).
  - **Weekly Performance Statement:** Jobs Completed, Total Cash Collected, Card Earnings, Commission Earned, Dispatch Fees Deducted, Gateway Fees, Parts/Key Expenses Reimbursed, Net Balance.
  - **Draft Weekly Report Mode (`FIN-S-001`):** Active week's statement allows line-item corrections before locking Sunday 23:59.
  - **Mark as Settled Action (`Q-13`, `FIN-W-012`):** Button to record off-platform settlement (Zelle, Cash, CashApp) with settlement date and reference note.

#### Screen 3.6: 🆕 NEW SECTIONS in Company Settings (`company-admin-settings.png`)
- **Current Live Screenshot:** [company-admin-settings.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-settings.png)
- **Modifications & Additions:**
  - **Card 3 — Twilio Masked Calling Settings (`COM-001`, `Q-10`):**
    - Twilio Account SID, Auth Token (with reveal toggle), Assigned Twilio Phone Number.
    - Test Connection button + "Change Number" flow.
    - Advisory Note: *"Call recordings and SMS are hosted directly on Twilio. JobixFlow provides links to audit logs."*
  - **Card 4 — Payment Gateway Settings (`FIN-W-007`, `FIN-W-016`):**
    - Multi-gateway card list (Stripe / Square / Authorize.net).
    - API Keys / Secret Key credentials input with test charge action.
    - Fallback State: *"No private gateway configured. Payments currently route through platform gateway."*

#### Screen 3.7: 🆕 NEW PAGE — Disputes, Refunds & Invoices (`/companies.admin/disputes`)
- **Structure:**
  - **Tab 1: Refunds:** Table of company-initiated refunds (Job, Customer, Amount, Reason text, Issued By, Timestamp) + "Issue Refund" modal action.
  - **Tab 2: Disputes / Chargebacks (`FIN-F-003`):** 4-way linked table (Job, Invoice, Payment, Technician) + Countdown Days Remaining badge + Evidence upload action (Customer signed work order, ID, photos).
  - **Outcome Calculation Display:** Won (Reverses deductions) vs Lost (Technician bears only their commission share per `FIN-F-006`; gateway and dispatch fees remain unrefunded per `FIN-F-007`).
  - **Tab 3: Sent Invoices (`FIN-W-014`):** Read-only log of invoices sent by technicians to customers with invoice preview (strictly showing Company Name only, zero platform branding per `FIN-W-015`).

#### Screen 3.8: Code Requests & Expense Integration
- **Current Live Screenshots:**
  - Code Requests: [company-admin-code-requests.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-code-requests.png)
  - Code Request Details: [company-admin-code-request-details.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-code-request-details.png)
  - Add Code Modal: [company-admin-add-code-modal.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-add-code-modal.png)
  - Key Codes List: [company-admin-key-codes.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-key-codes.png)
- **Modifications:**
  - In `company-admin-add-code-modal.png`, retain `Code Value`, `Provider`, `Cost`, `Notes`. Add an **Expense Payer Selector**: `Paid by Company (Company Account)` vs `Paid by Technician (Technician Expense)` to feed downstream wallet deduction logic.

---

### Module 04: Company Dispatcher (`/companies.dispatcher`)

#### Screen 4.1: Active & Incoming Jobs
- **Current Live Screenshots:**
  - Dashboard: [company-dispatcher-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-dashboard.png)
  - Active Jobs: [company-dispatcher-active-jobs.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-active-jobs.png)
  - Incoming Jobs: [company-dispatcher-incoming-jobs.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-incoming-jobs.png)
- **Modifications & Additions:**
  - Add **Origin Pill Column** (`Platform` vs `Company`).
  - Add "New Job" quick intake button for company-sourced dispatches.
  - Retain Accept & Dispatch technician assignment flow for platform incoming jobs.

#### Screen 4.2: Interactive Live Map & Proximity Telemetry
- **Current Live Screenshots:**
  - Live Map: [company-dispatcher-live-map.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-live-map.png)
  - Selected Technician: [company-dispatcher-map-technician-selected.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-map-technician-selected.png)
- **Modifications & Additions:**
  - Retain Google Maps pins for Jobs and Technicians.
  - Maintain Layers control (`Technicians` & `Job Locations` checkboxes).
  - Retain Live Fleet Counters (`Available: 8`, `Busy: 0`, `Offline: 3`, `Off Duty: 0`) and quick proximity dispatching from "Available Now" list.

---

### Module 05: 🆕 Technician Mobile Application (iOS & Android)

#### Screen 5.1: Job Queue & Home Screen
- **Design Specifications:**
  - Clean card list sorted by dispatch urgency (`High`, `Medium`, `Low`) and schedule time ("Now" vs "Scheduled: [Time]").
  - Card elements: Stated problem (clearly labeled *"Customer reported (unverified)"*), location address, distance, and status chip.

#### Screen 5.2: Active Job Guided Stepper (`JOB-005`)
- **Linear Step-by-Step Flow (Only one legal next action active):**
  1. **Assigned:** Prominent `Accept Job` (green) / `Decline` (outline red) buttons.
  2. **Call to Confirm (`COM-003`):** `Call Customer via Secure Line` button. Triggers masked Twilio outbound call. Shows 24-hour session timer banner.
  3. **Start Trip:** `Start Trip` primary button. Begins GPS route tracking.
  4. **Confirm Arrival (`JOB-007`, `LOC-002`):** Explicit `I Have Arrived on Site` button. Captures instantaneous GPS fix and timestamps arrival. Micro-feedback: "Location Verified ✓".
  5. **Work In Progress (`JOB-008`):** Informational state. Houses `Request Key Code` action and camera upload for vehicle VIN / lock disassembly.
  6. **Complete Job / Cancel Job:** Dual terminal triggers.

#### Screen 5.3: In-App Masked Calling & SMS Composer (`COM-001`, `COM-004`)
- **Design Specifications:**
  - Tap-to-call initiates Twilio bridge call without ever displaying customer's actual phone number.
  - In-app SMS composer: Thread shows messages sent via company Twilio business number.
  - 24-hour countdown badge: *"Direct messaging active for 23h 45m after job close."*

#### Screen 5.4: Job Close-Out, Pricing, Expenses & Payment
- **Design Specifications:**
  - **Authoritative Problem Description & Final Price (`JOB-002`):** Technician inputs actual work performed and final agreed price (overriding customer estimate).
  - **Expense Toggle (`Q-16`, `FIN-W-013`):** "Did you purchase parts/key codes out of pocket?" → Input amount ($) + toggle `Paid by Me` (reimbursable) vs `Paid by Company`.
  - **Payment Collection Method:**
    - `Cash Collected`: Calculates cash kept by tech and updates balance owed to company.
    - `Credit/Debit Card`: In-person card entry.
    - `Send Payment Link`: Generates customer SMS checkout link.
  - **Live Breakdown Card:** Gross Price → Less Expenses → Gateway Fee → Commission Split → Net Take-Home.
  - **Invoice Toggle (`FIN-W-014`):** "Send PDF Invoice to Customer via SMS?" toggle (renders company branding only).

#### Screen 5.5: Technician "My Account" Tab (`FIN-W-012`, `[T2:60-61]`)
- **Design Specifications:**
  - Current week statement: Commission rate, Jobs count, Cash collected, Card earnings, Net Balance (`"Company owes you $X"` or `"You owe Company $X"`).
  - Strictly self-scoped: No search or visibility into other technicians.
  - Weekly statement history archive (read-only once week closes).

---

### Module 06: 🆕 Customer Standalone Payment Link (Mobile Web)

#### Screen 6.1: Customer Payment Landing Screen (`JOB-001`, `FIN-W-015`)
- **Design Specifications:**
  - Standalone responsive web page loaded via SMS link without requiring login or app install.
  - **Trust & Brand Header:** Locksmith Company Name and Phone prominently at top. Zero JobixFlow platform branding.
  - **Job Summary Card:** Job Reference ID, Date, Service Description (e.g. "Emergency Vehicle Unlock & Transponder Key Programming"), and Total Amount Due ($).
  - **Secure Card Payment Form:** Clean credit/debit card inputs (Card Number, Expiry, CVC, Postal Code), Apple Pay / Google Pay 1-tap checkout buttons.

#### Screen 6.2: Terminal States Suite
- **A. Success State:** Green checkmark animation + "Payment of $[Amount] Successful" + Download Receipt / PDF Invoice button.
- **B. Failed State:** Red alert banner with specific bank decline reason + "Try Different Card" retry action (preserving form details).
- **C. Expired Link State:** Clock/calendar icon + "This payment link has expired. Please contact [Company Name] at [Phone] for an updated link."
- **D. Already Paid State:** Blue badge + "This service bill has already been paid on [Date/Time] via [Method]. No further action required."

---

## Part 3: Deliverable Checklist for Figma & UI Prototyping

When generating or rendering these designs, verify complete compliance with this checklist:
- [ ] **Visual Language Adherence:** All screens utilize `#3B82F6` primary, `#F8FAFC` background, `12px` card radius, and slate typography (`R02-1`).
- [ ] **Component Reusability:** Every table, filter bar, and action row uses the Master `DataTable`, `Filter`, and `Actions` components (`R02-2`).
- [ ] **Five State Completeness:** `Empty`, `No Results`, `Loading (Skeleton)`, `Error`, and `Permission Denied` are rendered for all modules (`R02-3`).
- [ ] **Masked Phone Protection:** Technician views structurally omit customer phone numbers per `COM-001`.
- [ ] **Financial Directionality:** All technician and company balances clearly state direction ("Owes" / "Owed") rather than bare minus signs (`R02-6`).
- [ ] **Multi-Tenancy Isolation:** Platform vs Company origin pills exist on all job views (`TEN-001`, `TEN-002`).
