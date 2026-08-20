# Stitch UI Prompt — Batch 02: Platform Admin Portal (`/platform`)

## Context & Role
Generate the UI updates and new financial screens for the **Platform Admin Portal** in JobixFlow. Preserve existing sidebar structure, cards, and primary blue palette (`#3B82F6`).

## Screen References & Required Updates

### 1. Platform Dashboard & Active Jobs Stream
- **Screenshot Reference:** [platform-admin-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-admin-dashboard.png)
- **Requirements:**
  - KPI Cards: Total Companies, Active Companies, Total Jobs, Total Revenue ($), Platform Users. Include positive/negative delta trend indicators.
  - Active Jobs Table: Use Master `DataTable`. Include `Origin` pill (`Platform` vs `Company`), live status pill, priority badge (`High`/`Medium`/`Low`), estimate price, and scoped date filter.

### 2. Companies Edit Modal & Gateway Config Status
- **Screenshot References:** [platform-companies-list.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-list.png), [platform-companies-edit-modal.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-companies-edit-modal.png), [platform-company-details.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-company-details.png)
- **Requirements:**
  - In Edit Modal: Retain mandatory `Commission %` with inline helper text: *"Percentage the platform retains from this company's platform-gateway transactions (`Q-02`)."*
  - In Company Details: Add **Gateway & Telephony Configuration Card**:
    - `Payment Gateway`: "Platform Gateway (Fallback)" or "Company Gateway (Stripe/Square)".
    - `Twilio Masked Calling`: "Configured (Company Owned)" or "Not Configured".
    - Isolation Note: *"Companies on own gateway & Twilio are isolated from platform wallet and central audit logs per `FIN-W-002` & `AUD-001`."*

### 3. Job Details — Expenses, Itemized Arithmetic & Refund/Dispute Badges
- **Screenshot References:** [platform-job-details.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-details.png), [platform-job-chat.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-chat.png)
- **Requirements:**
  - **Job Expenses Card (`FIN-W-013`, `Q-16`):** Dedicated card with item description, cost ($), and **Paid By Tag**: `Paid by Technician` vs `Paid by Company` (distinct styling from Customer/Company).
  - **Running Mathematical Breakdown (`R02-6`):** Itemized block: `Gross Price` → Less `Expenses` → Less `Gateway Fee` → `Platform/Company Commission Split` → Less `Dispatch Fee` → `Net Payout`.
  - **Service Call Fee Block (`Q-20`):** "Service Call Fee: $[amount] — Collected / Refused / Waived".
  - **Refund vs Dispute Status Badges (`FIN-F-003`):**
    - `Refunded`: Amber badge with refund amount, issuer, and reason text.
    - `Dispute / Chargeback`: Red badge with 4-way links (Job, Invoice, Payment, Technician) + countdown days remaining.
  - **Read-Only Chat Invariant (`ROL-004`):** Disabled composer with `👁 Only Show` banner in chat drawer.

### 4. Reports Overhaul (`Q-08`)
- **Screenshot Reference:** [platform-reports.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-reports.png)
- **Requirements:**
  - Tab 1: **Summary Charts** (Technician scatter plot, Jobs/Revenue trend line, Service type pie, Key metric tiles).
  - Tab 2: **Detailed Reports Grid** (Master `DataTable` with date presets, export to CSV/Excel button):
    - Jobs Report table, Financial Transactions ledger, and Technician performance table.

### 5. Audit Log Enhancement (`AUD-001`)
- **Screenshot Reference:** [platform-audit-log.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-audit-log.png)
- **Requirements:** Add `Company` and `User Type` columns, per-column filters, and top advisory banner regarding private-gateway company data isolation.

### 6. 🆕 New Page: Platform Wallet (`/platform/wallet`)
- **Requirements:**
  - Custodial balance summary cards: Current Custodial Balance, This Week Customer Payments, Platform Commission Retained, Gateway Fees, Total Refunds, Active Disputes.
  - Partner Company Balances breakdown table.
  - Master Transaction Ledger (`DataTable`): Transaction ID, Date/Time, Company, Job ID, Type, Amount ($), Acting User, Notes. Strictly read-only statement (`FIN-S-003`).
