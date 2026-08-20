# Stitch UI Prompt — Batch 04: Company Admin Portal (`/companies.admin`)

## Context & Role
Generate the major financial and operational screen additions for the **Company Admin Portal** in JobixFlow. Preserve the existing card styling and layout while introducing wallets, settlements, multi-gateway settings, and dispute management.

## Screen References & Required Updates

### 1. Company Dashboard
- **Screenshot Reference:** [company-admin-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-dashboard.png)
- **Requirements:** Retain Urgent Jobs banner, Active Jobs, New Jobs, Completed Today, and Available Technicians (8 of 11). Add quick navigation tiles to Company Wallet and Technician Accounts.

### 2. 🆕 Company-Sourced Job Intake & Customers (`TEN-001`, `Q-18`)
- **Requirements:**
  - Header "New Job" button and "Customers" table.
  - Multi-section form: Customer Search/Add, Item Classification (`Vehicle`/`Door`), State/Country, Service Type, Priority Urgency, Price, Schedule, Address, Description.
  - Directly assigns company technician and silently sets `origin: company`.

### 3. 🆕 Company Wallet (`/companies.admin/wallet`) & Record Adjustment Modal
- **Requirements:**
  - Financial Summary Strip: Weekly Card Payments, Cash Kept by Techs, Gross Expenses, Net Wallet Balance, Pending Tech Payouts.
  - Master Transaction Ledger (`DataTable`): Transaction ID, Job ID, Invoice ID, Tech Name, Customer, Event Type (`Payment`, `Refund`, `Dispute`, `Gateway Fee`, `Dispatch Fee`, `Commission`, `Backcharge`, `Adjustment`), Amount ($), Timestamp.
  - **🧩 Record Adjustment Modal (`FIN-S-003`):** Signed Amount (`+$` / `-$`), Mandatory Reason text, Optional linked Job ID / Technician selector.

### 4. 🆕 Technician Account & Settlement (`/companies.admin/technicians/{id}/account`)
- **Screenshot Reference:** [company-admin-technicians-list.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-technicians-list.png)
- **Requirements:**
  - Header: Technician Name, Avatar, Commission Rate (e.g. `60%`), and **Signed Directional Balance** (e.g. `"Company owes [Name] $450.00"` or `"[Name] owes Company $120.00"`).
  - Weekly Statement: Completed jobs, Cash collected, Card earnings, Commission earned, Deductions, Net Balance.
  - **Mark as Settled Action (`Q-13`, `FIN-W-012`):** Record off-platform settlement (Zelle/Cash/CashApp) with reference note.

### 5. 🆕 Settings: Twilio Masked Calling & Payment Gateways
- **Screenshot Reference:** [company-admin-settings.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-settings.png)
- **Requirements:**
  - **Twilio Card (`COM-001`, `Q-10`):** Account SID, Auth Token (reveal toggle), Assigned Phone Number, Test Call button.
  - **Payment Gateways Card (`FIN-W-007`):** Multi-gateway list (Stripe / Square / Authorize.net), API keys entry, test charge action, and platform-fallback indicator.

### 6. 🆕 Disputes, Refunds & Invoicing (`/companies.admin/disputes`)
- **Requirements:**
  - Tab 1: **Refunds** — Job, Customer, Amount ($), Reason text, Issuer, Date + "Issue Refund" modal.
  - Tab 2: **Disputes (`FIN-F-003`)** — 4-way linked rows (Job, Invoice, Payment, Tech), countdown days remaining, evidence upload action.
  - Tab 3: **Invoices Sent (`FIN-W-014`)** — Log with preview strictly displaying Company Name only (zero platform branding per `FIN-W-015`).

### 7. Code Requests & Expense Integration
- **Screenshot References:** [company-admin-code-requests.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-code-requests.png), [company-admin-add-code-modal.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-add-code-modal.png)
- **Requirements:** In Add Code Modal, add **Expense Payer Selector**: `Paid by Company (Company Account)` vs `Paid by Technician (Technician Expense)` to feed wallet deduction logic.
