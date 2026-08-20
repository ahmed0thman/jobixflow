# Google Stitch UI Generation Catalog — JobixFlow 2.0

> **Project Name:** `JobixFlow 2.0 Locksmith Dispatch & Financial Operations`  
> **Stitch Project ID:** `18011601986285730615` (`projects/18011601986285730615`)  
> **Model Engine:** Google Gemini 3.1 Pro (`GEMINI_3_1_PRO`) via Stitch MCP  
> **Design System Asset ID:** `assets/fc352c0ceebd4e469af502d82432d7a5`

---

## 🎨 Generated Screens & Modules Overview

### 1. Master Design System & Master Components (`Batch 01`)
| Screen Title | Device | Screen ID | Description & Compliance |
|---|---|---|---|
| **Master Components: Data & Filters** | `DESKTOP` | `41feace57a0b4887a4a06062052b0dc9` | Unified `DataTable` with masked customer phone (`COM-001`), sticky headers, server pagination, per-column `Filter` bar, and `Actions` cluster. |
| **Master Components: System States** | `DESKTOP` | `2132186af54044d2b8ecc48d6fbba3a0` | All 5 mandatory UI states (`Empty`, `No Results`, `Loading Skeleton`, `Error with Retry`, and `Permission Denied / Scoped Out`). |

---

### 2. Platform Admin Portal (`Batch 02`)
| Screen Title | Device | Screen ID | Description & Compliance |
|---|---|---|---|
| **Platform Dashboard & Active Jobs** | `DESKTOP` | `5401bf7004be457cbbfb0bcb93824e91` | Live jobs stream with `Origin` pill (`Platform` vs `Company`), live WebSocket status pills, and KPI summary tiles. |
| **Company Details & Config** | `DESKTOP` | `135db660e7774fd7b1f0e8efe1546a0f` | Company commission clarification (`Q-02`), fallback gateway status card, and telephony isolation indicator (`AUD-001`). |
| **Job Details & Financial Breakdown** | `DESKTOP` | `2f563e6f3b90484bb78b8a0ff2ca1853` | Dedicated Job Expenses card (`Paid by Tech` vs `Paid by Company`), running payment breakdown, Service Call Fee block (`Q-20`), discrete Refund/Dispute badges (`FIN-F-003`), and read-only chat (`ROL-004`). |
| **Platform Reports & Analytics** | `DESKTOP` | `e94b01a42995454b8827c101666296f3` | Summary charts tab and tabular detailed reports grid with CSV/Excel export (`AUD-002`, `Q-08`). |
| **System Audit Logs** | `DESKTOP` | `da8c182372f14d79ab8a25cf655e0aa0` | Enhanced with `Company` and `User Type` columns, per-column filter dropdowns, and isolation banner (`AUD-001`). |
| **Platform Wallet & Transactions** | `DESKTOP` | `a85cb1e467ed44c386599a61e1d4e01b` | 🆕 Custodial balance summary cards, company balances breakdown, and immutable read-only ledger (`FIN-S-003`). |

---

### 3. Platform Dispatcher Portal (`Batch 03`)
| Screen Title | Device | Screen ID | Description & Compliance |
|---|---|---|---|
| **Dispatcher Command Center** | `DESKTOP` | `86b0e24ef04f444d9537064c6af0eed2` | Fast dispatch operations stream with real-time urgency badges and active counters. |
| **Job Creation & Customer Intake** | `DESKTOP` | `44bf145f3e054b12b6c25935cdb4fb13` | Implicit `origin: platform` intake (`TEN-001`), urgency priority selector (`Low`/`Med`/`High`) separated from `Schedule At` (`Q-05`), and inline customer modal. |
| **Job History & Cancellation Workflow** | `DESKTOP` | `c2c1c1643e964d138e1bcd45eb250443` | Cancellation taxonomy modal (`JOB-009`, `Q-21`), age-gated Archive action (`AUD-002`), and interactive dispatch chat drawer. |

---

### 4. Company Admin Portal (`Batch 04`)
| Screen Title | Device | Screen ID | Description & Compliance |
|---|---|---|---|
| **Job Intake & Customers** | `DESKTOP` | `826886412edb43cc9b0c174c8720af2e` | 🆕 Company-sourced intake setting `origin: company` (`TEN-001`, `Q-18`), direct technician routing, and customer directory. |
| **Company Wallet & Adjustments** | `DESKTOP` | `e2fd0c617bfd48668b56f45872b294ab` | 🆕 Financial summary cards, immutable transaction ledger, and **Record Adjustment Modal** (`FIN-S-003`). |
| **Technician Account & Settlement** | `DESKTOP` | `678f66d540274fe383d5cd8af25c58b5` | 🆕 Technician statement header with **Signed Directional Balance** (`"Company owes Tech $X"` vs `"Tech owes Company $X"`), weekly report draft mode (`FIN-S-001`), and **Mark as Settled Action** (`Q-13`, `FIN-W-012`). |
| **Twilio & Gateway Settings** | `DESKTOP` | `00dcc80dd9d540fcaf20bd7e952b7183` | 🆕 Twilio SID & Token configuration card (`COM-001`, `Q-10`) and multi-gateway card setup (Stripe / Square / Authorize.net). |
| **Disputes, Refunds & Invoicing** | `DESKTOP` | `c4ca28ff70db44b3a309d768b11a48d3` | 🆕 Separate Refunds and Disputes tabs (`FIN-F-003`), 4-way linked rows, evidence uploader, and sent invoice log (showing Company Name only per `FIN-W-015`). |
| **Code Requests & Expenses** | `DESKTOP` | `3f1e3779cdb6417383b72bba95b843ca` | Key code request details with `Paid by Company` vs `Paid by Tech` expense tagging feeding wallet calculations. |
| **Company Reports Overhaul** | `DESKTOP` | `9562a22ab58641f386b1a6b1d389e604` | Tabular financial transactions report and technician performance metrics grid. |

---

### 5. Company Dispatcher Portal (`Batch 05`)
| Screen Title | Device | Screen ID | Description & Compliance |
|---|---|---|---|
| **Company Dispatcher Operations Hub** | `DESKTOP` | `8de5a8786a354fa784ab0681f499fa2d` | Dual-source queue (Platform vs Company dispatches) and live incoming job acceptance. |
| **Live Map & Proximity Telemetry** | `DESKTOP` | `ac5ee130dafe4572b107973d8a9dd65c` | Google Maps pin telemetry, fleet counters (`Available: 8`, `Busy: 0`, `Offline: 3`), and 1-tap nearest available technician dispatching. |

---

### 6. Technician Mobile Application (`Batch 06`)
| Screen Title | Device | Screen ID | Description & Compliance |
|---|---|---|---|
| **Job Queue & Home Screen** | `MOBILE` | `a27919df01824af980aceb9da2c8e460` | Cards sorted by operational urgency (`High`/`Med`/`Low`) and timing ("Now" vs "Scheduled"). High contrast outdoor design. |
| **Technician: Masked Communication** | `MOBILE` | `b258f6c728de44be8d5e984e3cce07e8` | Tap-to-call masked bridge without customer phone exposure (`COM-001`), in-app Twilio SMS composer, and 24h countdown banner (`COM-004`). |
| **Technician: Active Job Stepper** | `MOBILE` | `b11f03633baf4c21b6d74898f4465a96` | 6-state guided stepper (`Assigned` → `Call Customer` → `Start Trip` → `Confirm Arrival with GPS capture` → `Work In Progress` → `Complete/Cancel`). |
| **Job Close-out, Pricing & Expenses** | `MOBILE` | `b2c31ff748e443709cd12485d4d0ad53` | Authoritative problem & final price override (`JOB-002`), expense reimbursable toggle (`Q-16`), Cash vs Card net math, and Invoice SMS trigger (`FIN-W-014`). |
| **Technician: My Account** | `MOBILE` | `8a10f848780d4cacba968be1cab643f1` | Strictly self-scoped weekly statement, directional balance, and past statement archive (`FIN-W-012`, `[T2:60-61]`). |

---

### 7. Customer Standalone Payment Link (`Batch 07`)
| Screen Title | Device | Screen ID | Description & Compliance |
|---|---|---|---|
| **Customer Payment Checkout & States** | `MOBILE` | *Session Output* | Standalone responsive SMS landing checkout with Locksmith Company branding only (`FIN-W-015`), secure card entry, Apple/Google Pay, and 4 terminal states (`Success`, `Failure`, `Expired`, `Already Paid`). |
