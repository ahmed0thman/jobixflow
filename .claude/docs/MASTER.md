# JobixFlow — Master Reference

**The single source of truth for this project.** Consolidated from every document, source transcript, live-system audit, design plan, and the React prototype's own implemented data model, as of **2026-08-28**.

This file is written to answer any question about the JobixFlow business or this project without opening another file. Where the underlying sources genuinely disagree, this document does **not** invent a reconciliation — it names the conflict, states the governing precedence rule, gives the current working answer, and points at the register entry (§20) where the conflict is tracked. That is the honest form of "no contradictions": exactly one place where each disagreement is adjudicated.

---

## Table of contents

**Orientation**
1. [How to use this document](#1-how-to-use-this-document)
2. [The product in one page](#2-the-product-in-one-page)
3. [Glossary — canonical vocabulary](#3-glossary--canonical-vocabulary)

**The business**

4. [Actors, roles and permissions](#4-actors-roles-and-permissions)
5. [Multi-tenancy and data isolation](#5-multi-tenancy-and-data-isolation)
6. [The job lifecycle](#6-the-job-lifecycle)
7. [Key codes and code requests](#7-key-codes-and-code-requests)
8. [Communications — masked calling, SMS, chat, call logs](#8-communications--masked-calling-sms-chat-call-logs)
9. [Location and the live map](#9-location-and-the-live-map)
10. [The financial system](#10-the-financial-system)
11. [Post-completion financial resolution](#11-post-completion-financial-resolution)
12. [Invoicing and payment links](#12-invoicing-and-payment-links)
13. [Weekly cycle, statements and the ledger](#13-weekly-cycle-statements-and-the-ledger)
14. [Reports](#14-reports)
15. [Audit log and data retention](#15-audit-log-and-data-retention)
16. [Notifications](#16-notifications)

**The design and the build**

17. [Design system and UI constraints](#17-design-system-and-ui-constraints)
18. [Screen inventory by role](#18-screen-inventory-by-role)
19. [The React prototype](#19-the-react-prototype)

**Registers — the parts that change**

20. [Contradiction register](#20-contradiction-register)
21. [Open questions register](#21-open-questions-register)
22. [Live-system defect register](#22-live-system-defect-register)
23. [Complete business-rule index](#23-complete-business-rule-index)

**Reference**

24. [Sources, provenance and precedence](#24-sources-provenance-and-precedence)
25. [Test accounts and environments](#25-test-accounts-and-environments)
26. [Maintaining this document](#26-maintaining-this-document)

---

## 1. How to use this document

### Citation tags

Every non-obvious factual claim carries its origin. This is mandatory in this workspace (`Rule 00 · R00-3`) and inherited here.

| Tag | Meaning | Authority |
|---|---|---|
| `[C:§…]` | The client's own written requirements file (`client/features/major-changes.txt`) | **Highest** — deliberate, authored prose |
| `[T2:<line>]` | 2026-08-17 client follow-up meeting transcript | High — the client speaking directly |
| `[T:<line>]` | 2026-08-05 developer handover transcript | Medium — the developer's secondhand account |
| `[USER:2026-08-28]` | The designer speaking in-session with the client's authority | High for this project's working decisions; **not** a client-sourced quote |
| `[AUDIT:<path>]` | The 2026-08 live-system browser audit under `.claude/audit/` | Behavioral evidence of the current build |
| `[FIG:<screen>]` | A now-deleted Figma screenshot | Visual appearance only, never behavior |
| `[ASSUMPTION]` | A marked inference | Must be plausible and confirmable |
| `[OPEN]` | Unresolved — has a matching `Q-nn` in §21 | Blocks or narrows design |

### Precedence when sources disagree

1. **Client written requirements** `[C:]`
2. **Client follow-up meeting** `[T2:]` — outranks the developer handover on any direct conflict, since it is the client speaking about their own business
3. **Developer handover** `[T:]`
4. **Screenshots** `[FIG:]` — appearance only

`[AUDIT:]` sits outside this ladder: it is evidence of **what the current build does**, never evidence of what the business requires. A live behavior that contradicts a stated requirement is a finding, not an override.

`[USER:2026-08-28]` also sits outside the ladder. The designer is speaking with the client's authority on project decisions, so it governs **this project's working direction**, but it is not a client quote and cannot silently overrule the client's own written file. Where it does conflict with `[C:]`, that conflict is registered in §20.

**A conflict is never resolved silently.** It goes in §20 with both readings recorded.

### Status legend, used throughout

🔴 Blocking · 🟠 Important · 🟡 Clarifying · ✅ Resolved · ⚠️ Contradiction

---

## 2. The product in one page

**JobixFlow** is a multi-tenant SaaS dispatch platform for **automotive locksmith / lockout services in the United States**. It also covers doors and safes, not only vehicles `[T:1-14]`.

The live product is branded **"JobixFlow"** throughout — login page title, every sidebar wordmark `[AUDIT:design-system/basics.md]`. This resolves the long-standing "LockAccess Pro or JobixFlow?" question (`Q-09`).

### The commercial model

The platform **onboards companies** — independent locksmith workshops, each a tenant. Companies **employ technicians**. There is no direct relationship between the platform and any technician `[T:19-30]`.

The platform's value proposition is **monitoring, organization and financial control** — not lead generation. Companies bring their own book of business; the platform organizes it.

Platform revenue today is handled **entirely outside the product**: demo → manual deal → manual billing. There is no billing screen, no subscription logic. The client is open to building in-product subscriptions once the client base reaches roughly 50–100 companies, but that is explicitly future scope `[T2:35-36]`. Whether the platform also takes a cut of job revenue is **still open** (`Q-02`, §21).

### How a job actually happens

```
Customer's car is locked. Customer PHONES the platform.
        │  (there is no customer app, portal, or form — JOB-001)
        ▼
Platform Dispatcher answers, creates the job, enters the address as
free text from what the customer says, sets a preliminary price,
assigns the job to a company operating in the customer's state.
        ▼
Company Dispatcher assigns the job to one of the company's technicians.
        ▼
Technician accepts, calls the customer from inside the app (masked
number), confirms the address is real, starts the trip.
        ▼
Technician manually confirms arrival — that one tap also captures GPS.
        ▼
Technician inspects, overwrites the customer's account of the problem
with the real one, sets the FINAL price, resolves the lockout using a
physical key and/or an electronic key code, uploads photos and
ownership documents.
        ▼
Payment collected. Job completed. Expected to close within 24 hours —
these are roadside lockouts, not repairs.
```

**Two things about this flow are unusual and drive most of the design:**

- **Nobody knows where anyone is.** The address is spoken over a phone call. The technician's own location isn't tracked until they accept. The job's real location is only recorded on arrival. Technician assignment is therefore by **state + availability**, not proximity.
- **The technician's word is authoritative.** Whatever the customer said on the phone is provisional; the technician's on-site description and final price override it (`JOB-002`).

### What is being added

Five bodies of new work, in rough order of size:

| # | Area | Size | Coverage |
|---|---|---|---|
| 3 | **Financial system** — three wallet levels, payment arithmetic, fees, gateways, disputes, statements, ledger | Largest by far; almost entirely greenfield | 🟢 Strong — the client's written file is near specification-grade |
| 2 | **Twilio masked calling & SMS** | Medium; partial infrastructure already exists | 🟢 Strong — the client's own written spec |
| 1 | **Multi-tenancy** — companies get their own customers and jobs | Structural; touches everything | 🔴 Thin — one BRD mention, resolved mostly by designer decision |
| 4 | **Reports overhaul** — charts-only becomes tables with search and date ranges | Medium | 🔴 Thin — the report set is the designer's to propose |
| 5 | **Data retention** — delete becomes archive | Small but touches a shared enum | ✅ Resolved by the client |

Plus a sixth that isn't a new feature but a set of newly-confirmed details: the **job lifecycle** (§6), locked down step-by-step by the client on 2026-08-17.

---

## 3. Glossary — canonical vocabulary

Every section below uses these terms exactly as defined here.

### Two words that mean two different things — read this first

These cause more misreading of the Arabic sources than anything else.

**العميل — "customer" *or* "client"**

| Meaning | Who | Example |
|---|---|---|
| **Customer** | The end customer — a stranded motorist who phones for a lockout | `[T:51]` |
| **Client** | The system owner who commissioned JobixFlow and pays for this work | `[T:200]`, `[T:438]` |

In this workspace these are **never** conflated. "Customer" always means the end customer. "Client" always means the system owner.

**الشركة — "company" *or* "manufacturer"**

| Meaning | Who |
|---|---|
| **Company** | A locksmith workshop operating on the platform — a tenant. The default meaning throughout. |
| **Manufacturer** | The vehicle manufacturer or an authorized code provider that issues key codes. Only in key-code contexts `[T:108]`. |

The tenant is always **Company**; the code source is always **Provider** or **Manufacturer**.

### Actors

| Term | Arabic | Definition |
|---|---|---|
| **Platform** | المنصة | The JobixFlow system and the business operating it |
| **Platform Admin** | الادمن بتاع المنصة | Oversees the platform, onboards companies, monitors everything. Does not create jobs. |
| **Platform Dispatcher** | الديسباتشر بتاع المنصة | Answers customer calls, creates jobs, assigns them to companies. The client's own term is **"Platform Dispatch"**; internally also called **"First Line"** `[T2:26-27]`. |
| **Company** | الشركة / الورشة | A locksmith workshop operating as a tenant. Also *workshop*. |
| **Company Admin** | الادمن بتاع الشركة | Runs one company. Creates staff including technicians, sources key codes, holds company settings. |
| **Company Dispatcher** | الديسباتشر بتاع الشركة | Assigns jobs to technicians within one company, monitors them, holds the highest operational control over a job. |
| **Technician** | الفني | Field worker employed by a company. Mobile app only. |
| **Customer** | العميل | The end customer. No app, no portal, no login — phone only. |
| **Client** | العميل | The system owner. Never a system user role. |

### Work

| Term | Arabic | Definition |
|---|---|---|
| **Job** | الوظيفة | One service request from intake to payment. The central entity. |
| **Service type** | السيرفس تايب | The category of work — emergency lockout, lock installation, key duplication, safe opening, rekey. ⚠️ **The live `service_types` table is seeded with people's names, not categories** — see §22 #2. |
| **Item type** | — | Vehicle or Door. A separate, working field from Service Type. |
| **Priority / Urgency** | الاولوية | ⚠️ Two different things share this name — see §20 #3. The client's resolved concept (`Q-05`) is a **binary Now / Scheduled** flag with no effect on price, category, or routing `[T2:139-143]`. The live product has a three-value **Low / Medium / High** urgency scale driving badges and an "Urgent" dashboard counter. |
| **Origin** | — | Whether a job came from the platform or from the company's own customers. Coined in this workspace; the sources describe the concept without naming it (`TEN-001`). |
| **Preliminary / estimate price** | سعر مبدئي | Indicative price entered by the dispatcher from the phone description. **Not binding.** |
| **Final price** | — | Set by the technician after inspecting the job. **Authoritative** (`JOB-002`). |
| **Service Call Fee** | — | A standalone charge covering a technician's wasted trip when a dispatched job doesn't complete. Distinct from job price, dispatch fee and gateway fee. New concept `[T2:105-124]`. |
| **Cancellation reason** | سبب الإلغاء | A required tagged reason on any cancellation. Only three confirmed; full list promised but never delivered (`Q-21`). |
| **Reassignment** | — | A job moving from one technician to another mid-flow. From the system's view the job continues; from the original technician's view their leg closes like a cancellation `[T2:120-124]`. |

### Vehicle access

| Term | Arabic | Definition |
|---|---|---|
| **Key code** | الكي كود | An electronic code that opens a vehicle, obtained from the manufacturer or an authorized provider using the vehicle's identifying data |
| **Physical key** | فيزيكال كي | A conventional cut key produced on site. Paid out of the technician's own pocket. |
| **VIN / chassis number** | رقم الشاسيه | The vehicle identification number the technician reads off the car. Required to request a key code, and the search key for reusing an old one. |
| **Code Request** | كود ريكويست | A technician's request to the company for a key code. Records provider, cost, notes. |
| **Provider** | البروفايدر | The party supplying a key code — the manufacturer, or a third party they authorized `[T:492]` |

### Money

| Term | Arabic | Definition |
|---|---|---|
| **Wallet** | المحفظة | ✅ A **derived transaction log / source of truth**, not an account with transferable balances (`Q-01`, `FIN-W-012`). No peer transfers exist anywhere in the product. |
| **Platform Wallet** | محفظة المنصة | Belongs to the platform owner. Covers **only** companies using the platform's gateway. |
| **Company Wallet** | محفظة الشركة | One per company, fully isolated. |
| **Technician Account** | الحساب المالي للفني | A technician's financial standing with their company. The client deliberately calls this an *account*, not a wallet. |
| **Commission** | نسبة العمولة | The technician's percentage share of a job, configured **per technician** by the company. ⚠️ Distinct from the per-**company** Commission field that already exists live on Add Company — see §20 #5. |
| **Dispatch fee** | رسوم الديسباتش | A per-job fee deducted from the technician's earnings. Flat. |
| **Gateway fee** | رسوم بوابة الدفع | Payment processing fee. **Default 3%, editable** `[C:§Financial/Fees]`. |
| **Expense** | المصروفات | ✅ A **job-tied operational cost only** (e.g. a key or key-code purchase), deducted from the job's gross **before** all other math, tagged paid-by-technician or paid-by-company (`Q-16`, `FIN-W-013`). Not a general business-expense ledger. |
| **Invoice** | الفاتورة | ✅ A real, per-job, **technician-triggered** document issued under the **company's own name only** — never the platform's (`Q-12`, `FIN-W-015`). |
| **Backcharge** | — | A debt raised against a technician. Two origins — see §11.4. |
| **Dispute / Chargeback** | النزاع | A **bank-initiated** challenge to a payment, arriving through the gateway's own dispute API with an evidence window. Always linked to Job + Invoice + Payment + Technician. |
| **Refund** | المبالغ المسترجعة | A **company-initiated** goodwill return of money (full or partial) after a customer complaint. Distinct from a dispute `[T2:159-169]`. |
| **Adjustment** | تعديل مالي | A manual financial correction, recorded as its own transaction because balances are never edited directly. |
| **Financial Transaction** | العمليات المالية | One immutable row in the append-only ledger. Every financial event creates one. |
| **Weekly statement** | الكشف الأسبوعي | An automatic end-of-week summary, per company and per technician. Drives technician payouts. |
| **Financial week** | — | Monday 00:00 → Sunday 23:59. A job belongs to the week it **completed** in. |
| **Cash in hand** | — | Money a technician collected in cash and still owes the company. ⚠️ Whether cash exists at all is contested — see §20 #1. |

### Communications

| Term | Definition |
|---|---|
| **Twilio number** | A proxy phone number masking the real numbers of both customer and technician. **Each company supplies its own** and can change it **at any time it chooses** — not tied to any renewal cycle `[T2:146]`. Only call/message *logs* are retained across a change; records are not versioned against a number. |
| **Binding / Session** | The link between customer number + technician number + Twilio number + Job ID. Survives **24 hours** past job close, then is disabled. Follows whichever technician **currently** holds the job `[T2:129]`. After 24 hours, routing depends on origin `[T2:131-137]`. |
| **Chat** | Per-job messaging between dispatchers and technicians, inside the platform's own UI. Both admin roles observe without posting. **Distinct** from the customer-facing SMS session. |
| **24-hour SMS session** | The technician's customer-facing messaging, sent from inside the app over the masked number, received by the customer as an ordinary SMS in their native phone app — no customer app or login `[T2:187-191]`. Recordings/logs live in **Twilio itself**; the platform stores and displays a **link**, not the file `[T2:196-200]`. |

### System

| Term | Definition |
|---|---|
| **Tenant** | One company's fully isolated data domain |
| **Audit log** | An immutable record of create/update/delete actions. **Scoped by infrastructure, not blanket-wide** — see §15. |
| **Dashboard** | One of the four web interfaces. The technician's mobile app is **not** called a dashboard. |

---

## 4. Actors, roles and permissions

**ID namespace:** `ROL` · **Source coverage:** 🟢 Strong on structure · 🔴 Weak provenance on the fine-grained permission model

### ⚠️ Provenance warning on the permission model

At `[T:253]`, immediately after explaining the chat permission rules, the developer states plainly:

> *"He doesn't talk about these things, by the way — all of this is my own authoring."*

— and at `[T:254]`, that the client never commented on wanting it that way. She adds at `[T:255]` that changing it is trivial: *"it's a line of code."*

**Consequence.** The role **structure** — five actors, four dashboards, who employs whom — is solid, repeatedly corroborated, and independently reconfirmed by the client directly in the 2026-08-17 follow-up `[T2:25-29]`. The fine-grained **permission rules**, especially the chat matrix, remain the developer's design choices and were never touched in that meeting. Present them to the client as **proposals to confirm**, not inherited requirements (`Q-19`).

### Organisational structure

```
Platform
├── Platform Admin        ── onboards companies, oversees everything
├── Platform Dispatcher   ── answers customer calls, creates jobs
└── Company (tenant)
    ├── Company Admin       ── employs staff, sources key codes, company settings
    ├── Company Dispatcher  ── assigns jobs to technicians, holds job control
    └── Technician          ── mobile app only, field work
```

Four web dashboards `[T:2, 221]` plus a separate **technician mobile app** `[T:102]`, which is explicitly not a dashboard. The web login form actively rejects technician credentials with a specific message — *"This account can only access the mobile application"* `[AUDIT:technician/_overview.md]`.

### What each actor does

**Platform Admin** — adds companies `[T:19]`; adds platform users, both admins and dispatchers `[T:289]`; monitors jobs, status and priority with full job detail `[T:45]` including vehicle data, status timeline and payment detail `[T:271-277]`; views customers `[T:287]` and the audit log `[T:326]`.
- **Does not create jobs** `[T:45]` → `ROL-003`. Confirmed live — no create action anywhere on Jobs `[AUDIT:platform-admin/jobs/jobs.md]`.
- **Read-only in chat** `[T:49]` → `ROL-004`. Confirmed live — composer textbox and send button both render `disabled`, not merely absent.
- **No inline job editing.** Live audit: *"Platform Admin appears to be pure read + delete only for jobs, no edit"* `[AUDIT:platform-admin/jobs/jobs.md]`. Status changes belong to dispatchers and the technician.

**Platform Dispatcher** — the **only** customer-call intake point `[T:50-51]`; creates the job, picking an existing customer by phone number or adding a new one inline `[T:428-430]`; enters customer data, service type, country and a preliminary price `[T:432, 439, 448]`; assigns the job to a company operating in the customer's area `[T:52-53, 451-453]`; views companies read-only, cannot add them `[T:455]`; sees customer phone numbers `[T:456]`.
- **Retains full control of a job even after the company has accepted it and assigned a technician** `[USER:2026-08-28]`. Authority is not time-limited to pre-acceptance.
- Customers: Create + Read + Delete, **explicitly no Update** — the live Customer Show page states *"Read-only view of customer information"* in its own subtitle `[AUDIT:platform-dispatcher/customers/customers.md]`.
- Job edit/delete are **status-gated** to "New Job" only, enforced server-side `[AUDIT:platform-dispatcher/job-history/job-history.md]`.
- ⚠️ **Has full, unscoped, cross-company Audit Log access** — undocumented as a capability of this role anywhere. See §20 #8.

**Company Admin** — adds technicians `[T:78]` → `ROL-006`; handles Code Requests and is the party who actually obtains the key code, recording provider and cost `[T:280-285, 487-489]`; sees vehicle data `[T:280]`; is the **only** role able to access call recordings `[T:542]` → `ROL-009`; manages company settings and profile; views jobs with the same detail as the platform admin `[T:526]`; adds company users `[T:535]`.
- **Sees every chat message but posts none** `[T:245]` → `ROL-005`. Confirmed live.
- **No job Delete** — a real, sensible permission difference from Platform Admin `[AUDIT:company-admin/jobs/jobs.md]`.
- **Technician creation happens on the Users page**, not the Technicians page — the Create User modal's Role dropdown includes "Technician" `[AUDIT:company-admin/users/users.md]`. `ROL-006` is satisfied, just not where you'd expect.
- **Audit-log-only for refund/dispute decisions** — no action buttons anywhere in this domain `[USER:2026-08-28]`, see §11.

**Company Dispatcher** — receives jobs assigned to the company `[T:74]`; assigns each to a technician, seeing availability at the point of assignment `[T:82]`; monitors technicians and jobs on the map `[T:86, 227]`; chats with an **enabled** composer `[T:227-250]`, `[AUDIT:company-dispatcher/active-jobs/active-jobs.md]`; views and searches the company's technician list `[T:258-260]`.
- **Does not add technicians** `[T:78]`. Technicians page is read-only for this role `[AUDIT:company-dispatcher/technicians/technicians.md]`.
- **Creates the company's own jobs** — resolves `Q-18` `[USER:2026-08-28]`. See §5.
- **Holds the highest control over a job**, including the entire post-completion financial-resolution domain — refund request and decision, dispute Settle/Lost, and standalone backcharge `[USER:2026-08-28]`. No second approver exists above them.

**Technician** — mobile app only. Receives assigned jobs, travels, is tracked, records the authoritative job data and final price, requests key codes, collects payment. Receives **only the data the system pushes to the app** `[T:458]` — deliberately restricted because *"he is the one who must be monitored, and he must have no relationship with the customer"* `[T:459]` → `ROL-008`.
- **Never sees the customer's real phone number**, anywhere → `COM-001`.
- **Must never see another technician's activity** — restated by the client as one of the "most important" constraints `[T2:60-61]`. This is a general visibility rule for the role, not a report-specific one.

### Technician assignment criteria

The company dispatcher selects on **same state** as the job `[T:68]` and **currently free**, not on another job `[T:69-71]`. Proximity is explicitly **not** a criterion, because exact locations are unknown — *"the whole relationship is a phone relationship"* `[T:66]` → `ROL-010`. Availability is shown inline during assignment `[T:82]`.

⚠️ **The live product does not enforce this.** The Assign Technician dropdown lists **every** technician at the company, offline ones fully selectable alongside available ones, with no state/location data shown at all `[AUDIT:company-dispatcher/incoming-jobs/incoming-jobs.md]`. The redesign should build a genuinely guided, disabled-with-reason picker, not reproduce this.

⚠️ A separate, older claim that the live map performs proximity dispatch is registered in §20 #7 — its evidence base is a deleted document and the current audit does not corroborate it.

### Technician availability — four states, confirmed

**Offline / Available / Off Duty / Busy**, confirmed live in the map legend, the Live Stats panel, and the Technicians filter dropdowns on two separate pages `[AUDIT:company-dispatcher/live-map/live-map.md, company-dispatcher/technicians/technicians.md]`. This supersedes the two-state Available/Offline impression given by Company Admin's technician cards alone, and the earlier `[ASSUMPTION]` that availability might be binary.

### Chat participants

Per-job chat `[T:47]`. Permitted pairs `[T:227-250]`:

| From | To | Why |
|---|---|---|
| Technician | Company dispatcher (the one who assigned the job) | Normal coordination |
| Company dispatcher | Assigned technician | Normal coordination |
| Company dispatcher | Other dispatchers in the same company | **Shift handover** — *"the job may have been delayed, so it fell in a different shift"* `[T:241]` |
| Company dispatcher | The platform dispatcher who created that job | Cross-tenant coordination on a platform-sourced job |

Both admin roles observe and post nothing `[T:49, 245]`.

Chat is **always its own route** (`/jobs/{id}/chat`), reached from a "Chat" row action or an "Open Chat" link — never a panel embedded on the Job Show page `[AUDIT:platform-admin/jobs/jobs.md]`. Note the route is **not** namespaced under a role prefix — it is shared across roles.

### Role capability matrix

| Capability | Platform Admin | Platform Dispatcher | Company Admin | Company Dispatcher | Technician |
|---|:--:|:--:|:--:|:--:|:--:|
| Create company | ✅ | — | — | — | — |
| Create platform users | ✅ | — | — | — | — |
| Create company staff (incl. technicians) | — | — | ✅ | — | — |
| Create job (platform-sourced) | — | ✅ | — | — | — |
| Create job (company-sourced) | — | — | — | ✅ | — |
| Assign job to company | — | ✅ | — | — | — |
| Accept / refuse a platform-routed job | — | — | — | ✅ | — |
| Assign job to technician | — | — | — | ✅ | — |
| Transfer job between technicians | — | — | — | ✅ | — |
| Advance job status | — | ✅ | — | ✅ (accept/assign only) | ✅ (field steps) |
| Cancel job | — | ✅ | — | ✅ (once in control) | ✅ (from app) |
| Archive job | ✅ | ✅ | — | — | — |
| Set final price | — | — | — | — | ✅ |
| Enter expense (paid-by tag) | — | — | — | — | ✅ |
| Decide to send an invoice | — | — | — | — | ✅ |
| Request / decide a refund | — | — | — | ✅ | — |
| Resolve a dispute (Settled / Lost) | — | — | — | ✅ | — |
| Create a standalone backcharge | — | — | — | ✅ | — |
| Source a key code (record provider + cost) | — | — | ✅ | — | — |
| Request a key code | — | — | — | — | ✅ |
| Access call recordings | — | — | ✅ | — | — |
| Post in chat | ❌ read-only | ✅ | ❌ read-only | ✅ | ✅ |
| See customer's real phone | ✅ | ✅ | ✅ | ⚠️ open | ❌ **never** |
| See other companies' data | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configure own Twilio / gateway | — | — | ✅ | — | — |
| See the audit log | ✅ | ⚠️ yes, live, undocumented | ✅ company-scoped | — | — |

---

## 5. Multi-tenancy and data isolation

**ID namespace:** `TEN` · **Source coverage:** 🔴 Thin in the original sources; substantially decided by the designer in-session

### The requirement

Companies may now add **their own customers and their own jobs**, sourced entirely outside the platform — people who already called the workshop directly `[T:172-176]`. Every job therefore carries an **origin**.

- Every job carries an origin — platform-sourced or company-sourced — **never absent** → `TEN-001`
- Company data (jobs, customers, technicians, finances) is **fully isolated**; no company sees another's in any list, filter, search, export or aggregate count → `TEN-002`
- Financials and reports must **separate** the two origins

### Who performs company-sourced intake — ✅ resolved

`Q-18` was open through both client meetings. Resolved by the designer in-session:

> *"company dispatcher can create the company own jobs with the same data the platform dispatcher enter + he can directly search for a technician or select on map in the same job creation page."* `[USER:2026-08-28]`

The **Company Dispatcher**, not the Company Admin. Same field set as the platform dispatcher's intake form, plus an inline optional technician picker at creation time.

**Consequence for the state machine:** a company-sourced job has **no `new_job` state** — the company has already "received" its own job; there is no platform-assignment step to wait through. If a technician is picked at creation it starts at `assigned_to_technician`; otherwise at `assigned_to_company`.

### Origin-gated intake actions — proposed `JOB-010`

A company-sourced job has **no accept/refuse ceremony**. A company cannot refuse a job it created for its own customer — that would be nonsensical. The equivalent action is Cancel.

| Origin | Status | Available actions | Never available |
|---|---|---|---|
| `platform` | `assigned_to_company` | **Accept & Assign to Technician** · **Refuse** (returns it to the platform) | — |
| `company` | `assigned_to_company` | **Assign to Technician** only | Accept, Refuse |

The underlying status enum needs no new value — the fix is entirely in **which actions the UI offers**, gated by `job.origin` in addition to `job.status`.

### Customer isolation

A company's customers are its own. `Customer.companyId` is present for a company-sourced customer and absent for the platform's shared customer book. A Company Dispatcher's customer picker searches **only its own company's customers** — it cannot reach the platform's global list `[USER:2026-08-28]`.

### Company-scoped lists never show a Company column

> *"there is no need for the company column in the jobs — all jobs here is for that company. just the source might be the platform."* `[USER:2026-08-28]`

A Company Dispatcher/Admin's job list is scoped to their own company by definition, so a per-row Company name is redundant noise. **Origin still matters and stays**, since it distinguishes platform-referred work from the company's own book.

### ⚠️ The unresolved scope of isolation

This is the single most consequential unsettled point in the project. Three positions exist:

1. **`Q-06`'s narrow rule** (client, `[T2:32-34]`): the platform's *audit log* excludes only companies fully self-sufficient on their **own gateway and own Twilio**. The gate is infrastructure self-sufficiency, not job origin. Pulling in a self-sufficient company's records would be, in the client's words, "stealing information that belongs to them."
2. **`CLAUDE.md`'s role description**: Platform Admin "monitors everything," sees full job details including vehicle data and payments.
3. **The designer's 2026-08-28 restatement**, framed as *the* most important new requirement: *"treat the company as a tenant so the company can create its own job and this is scoped only to it and no one else can see its own jobs and its own customers and its own revenue even the platform admin him self."* `[USER:2026-08-28]`

Position 3 is materially stronger than position 1 — full invisibility of company-sourced jobs, customers and revenue to platform roles, **regardless** of gateway/Twilio status.

**Current state: not retrofitted.** Platform Admin's Jobs/Dashboard/Reports/CompanyDetail and Platform Dispatcher's Job History/Dashboard still mix both origins. This is registered as §20 #2 and must be scoped explicitly — which screens, and whether the Origin badge disappears entirely from platform-role screens once company-sourced jobs never appear there — before touching already-signed-off screens.

### Isolation as currently built (a positive finding)

Tenant isolation is **already enforced server-side** for every company-scoped page tested. The clearest evidence: Company Admin's Audit Log shows **31 pages** versus **1,660 platform-wide**, and the filtering is genuine, not just an omitted column `[AUDIT:company-admin/audit-log/audit-log.md]`. Jobs, Customers, Key Codes, Call Logs, Users and Technicians are all correctly company-scoped. Preserve this property in every new financial and reports screen.

---

## 6. The job lifecycle

**ID namespace:** `JOB` · **Source coverage:** 🟡 Partial — the shape is well covered; the full cancellation-reason enum and Service Call Fee mechanics remain open

### The state machine is fixed and company-uniform

The designer asked directly whether each company could define its own states or reorder the workflow. The client's answer was unambiguous:

> «انا بعطيك الستيتس... ما رح تكون متغيره لانه هو نظام الشغل ثابت لكل الشركات» `[T2:82]`
> *"I'll give you the statuses… they won't be changeable, because the way the work operates is fixed for every company."*

→ `JOB-005`. This closes what would otherwise have been a significant open design question (a per-company workflow builder) in favor of a **single fixed status stepper** used identically across every dashboard.

**Design consequence:** the status control on any job screen is a **guided, sequential action** — advance to the one legal next state, or cancel — never a free-choice dropdown over every possible state, regardless of role or company.

### The canonical flow, step by step `[T2:82-101]`

```
1. Call intake        — dispatch takes the problem description + spoken address
2. Assigned            — dispatch sends the job to a suitable free technician
3. Accepted / Rejected — technician responds; accept-click timestamp tracked
4. Confirmed by call   — technician calls the customer (only from inside the
                          app, COM-003) and confirms address + genuine need
5. Started             — technician begins the trip
6. Arrived             — technician MANUALLY confirms arrival; this single
                          action both advances the state AND captures GPS
7. Completed           — job finished, payment collected
      — or —
7. Cancelled           — with a mandatory reason
```

### Arrival is a manual confirm, by deliberate design

The client explicitly rejected automatic geofencing:

> *"we made it so the GPS isn't relied on, because I read the requirements that said GPS isn't accurate the first time — the technician is the one who goes, and when he arrives he confirms the location he's arrived at"* `[T2:89]`

And the app already works this way: *"the technician confirms he's arrived, so pressing 'arrived' sends the location along with it"* `[T2:101]` → `JOB-007`.

**This is confirmed working live.** Real latitude/longitude values are logged on `JobRequest` status transitions to `in_progress` `[AUDIT:company-admin/audit-log/audit-log.md]`.

**Design consequence:** one explicit, unmissable "Confirm Arrival" primary button with a visible "location captured" confirmation — never a background GPS trigger the technician doesn't consciously perform.

### Only two states close a job

Only **Cancelled** and **Completed** close a job. Any other status label — "In Progress", "Updated" — is informational and implies neither closure nor the possibility of reopening `[T2:115-119]` → `JOB-008`. Free-text notes and in-app chat carry most incidental detail; tracked state transitions stay coarse and few `[T2:119]`.

### A job is never deleted mid-flight

Once a job has entered the system it must run to completion or receive an explicit cancellation with a stated reason `[T2:72-75]` → `JOB-006`.

**Partially enforced live already**: Platform Dispatcher's Job History blocks deletion server-side once a job leaves "New Job" status, with a real error — *"Job can not Delete after change status!"* `[AUDIT:platform-dispatcher/job-history/job-history.md]`. The redesign should **proactively disable** the action with a stated reason rather than reproducing today's present-then-fail-after-a-round-trip pattern (`Rule 02 · R02-4`).

### Cancellation requires a reason — enum incomplete

Every cancellation requires a recorded reason before the action completes `[T2:112-113]` → `JOB-009`.

Three reasons are confirmed `[T2:102]`:
- Customer resolved the problem themselves
- Customer did not answer the callback
- Wrong / incorrect details captured at intake (e.g. a mistyped phone number)

The client explicitly promised the **complete list** separately via the project group chat — *"let me picture it for you and send it to you on the group"* — and it has never arrived (`Q-21`).

**Scope relaxed for the prototype** `[USER:2026-08-28]`: *"as this is just a prototype the dev can decide the list of reasons and also if there are other fees fields to add… same thing for any status that have reasons and fees."* A dev-authored placeholder list is explicitly authorized so the build isn't blocked. This does **not** close the business question.

**Design the picker to be extendable** — never hardcode three options as if they were final.

### Cancel is gated by actual control, not merely by non-terminal status

> *"the company dispatcher who didn't accept an incoming job assigned to him from the platform dispatcher can't cancel the job, he can just accept or reject. if he accepted then he got the full control, both he and the platform dispatcher who originally created it."* `[USER:2026-08-28]`

Formally: `canCancel = !terminalStatus && !canAcceptOrRefuse`.

The company dispatcher gains Cancel **only once they've taken ownership** — immediately for a company-sourced job (always theirs), or from `assigned_to_technician` onward for an accepted platform-sourced job. Once accepted, control is **shared** with the platform dispatcher who created it; both hold full control. Terminal statuses (`completed`, `cancelled`, `archived`) can never be cancelled — a completed job is handled by the refund/dispute tracks in §11, never by reopening it into `cancelled`. → proposed `JOB-011`.

### Job reassignment between technicians

A job can move from one technician to another mid-flow. The client's example is **price shopping** — the customer is negotiating with multiple companies simultaneously and dispatch tries to renegotiate `[T2:120-122]`.

- From the **system's** perspective the job continues normally under the new technician.
- From the **original technician's** perspective it functions like a cancellation for their leg — they made the trip but didn't close it `[T2:122]`.
- Whether that technician is still owed a Service Call Fee depends on whether the customer already paid it, tracked via **free-text update notes** rather than a defined field `[T2:120-124]` `[ASSUMPTION]` on the data model — the client's own account here is loose.

**Design requirement** `[USER:2026-08-28]`: *"the job can be transferred from a technician to another so both status timeline and the chat should reflect this."* A reassignment must never be a silent disappearance from the original technician's list. It needs its own visual treatment distinct from cancellation — "Reassigned from X to Y — reason" in the Status Timeline, and a system divider in the chat separating messages attributed to the old versus the new technician.

The transfer action is available **whenever a technician is assigned and the job isn't closed** — not gated narrowly to `technician_refused`. Reasons include refusal, unavailability, or any other `[USER:2026-08-28]`.

### The reconciled status enum

The prototype implements this set (`frontend/src/types.ts`):

```
new_job · assigned_to_company · assigned_to_technician · company_refused
technician_refused · confirmed_by_call · technician_on_the_way
technician_arrived · work_in_progress · completed · cancelled · archived
```

with the linear happy path being:

```
new_job → assigned_to_company → assigned_to_technician → confirmed_by_call
  → technician_on_the_way → technician_arrived → work_in_progress → completed
```

⚠️ **This does not match the live product's 12-value enum.** See §20 #4 — a real structural mismatch requiring a developer decision, not a copy fix.

### The job entity

| Field | Notes |
|---|---|
| `origin` | platform / company — never absent (`TEN-001`) |
| `customer`, `customerPhone` | Real number; **role-conditional rendering required** (`COM-001`) |
| `address` | **Free text** captured over the phone — never a customer-supplied geolocation (`JOB-004`) |
| `itemType` | Vehicle / Door |
| `serviceCategory` | ⚠️ see §22 #2 |
| `urgency` | ⚠️ see §20 #3 |
| `status` | Fixed enum above |
| `dispatcherName` | The Platform Dispatcher (platform-sourced) or Company Dispatcher (company-sourced) who handled intake |
| `technicianName` | **Current** holder, which may differ from the original on reassignment. Must be absent for `new_job` / `assigned_to_company` / `company_refused`. |
| `reassignment` | `{ fromTechnicianName, toTechnicianName, reason, at }` |
| `estimatePrice` / `finalPrice` | Preliminary (not binding) vs. authoritative (`JOB-002`) |
| `paymentMethod` | ⚠️ see §20 #1 |
| `pricingLines[]` | Itemized costs, each with a `paidBy` tag |
| `serviceCallFee` | Amount + the generated payment link |
| `financialFlag` + detail objects | See §11 |
| `cancellationReason` / `cancellationNotes` | Required on cancel (`JOB-009`) |
| `vehicle` | VIN, make, model, year, plate, color |
| `location` | Recorded **only** on the technician's arrival ping (`LOC-002`) |
| `timeline[]` | Every transition with actor name and role |

### The address is free text — deliberately

The client is explicit this is a design choice, not a limitation to fix:

> *"I'm not in need of the customer sending me a live location so I can reach him — the moment he tells me, for example, 'I live on this street, this street number, this city,' I know exactly where he is"* `[T2:92-93]`

Addresses can be wrong or approximate (customer not from the area, broken down on a roadside rather than at a fixed address); the technician resolves ambiguity on site `[T2:93-95]` → `JOB-004`. Confirmed live — the Location column on Company Admin's Jobs and every incoming-job card show free-text addresses.

---

## 7. Key codes and code requests

**Source coverage:** 🟡 Partial — described in the developer handover, and confirmed in detail by the live audit

### Resolution requires a physical key, a key code, or both

- A **key code** is an electronic code obtained from the vehicle manufacturer or an authorized provider, using the **VIN / chassis number** the technician reads off the car, plus make, model, year.
- The technician either generates it on their own device (**the technician bore the cost**) or requests it from the company (**the company bore the cost**).
- **Physical keys are paid for out of the technician's own pocket.**

### Code Requests — the fulfillment flow

Technician asks → company sources the code → logs **provider**, **cost**, **notes** → sends the code to the technician `[T:280-285, 487-489]` → `ROL-012`.

Confirmed live and functional `[AUDIT:company-admin/code-requests/code-requests.md]`. Statuses: **Pending / Approved / Available / Rejected**. The "Add Code" modal captures exactly Code Value*, provider*, cost*, Notes — an exact match for the described flow.

**The asset shape is item-type-dependent** — a real finding the BRDs never mention:

| Item type | Fields captured |
|---|---|
| **Vehicle** | VIN, Brand, Model, Year, Plate Number, Color, Engine Number |
| **Door** | Door Type (e.g. Metal), Lock Type (e.g. Mechanical), Description |

So this flow covers non-vehicle door/lock requests too, not only vehicles.

### Key Codes — the searchable history

A record of every code ever obtained. Columns confirmed live: **Code, Cost, User Obtained (name), User Job (role: Technician or Company Admin), Status (Valid / Invalid), Obtained Date, Notes** `[AUDIT:company-admin/key-codes/key-codes.md]`.

The *User Obtained* / *User Job* pair is a direct live match for the documented behavior — recording whether a technician or the company admin acquired the code.

**The intended reuse flow:** before buying a new code, the technician searches by **VIN** and retries an old code for the same vehicle; if it fails it is marked **invalid** and a new one is requested.

⚠️ **VIN is not a visible column or search term on the live Key Codes page** — the search placeholder reads "code, cost, or user." Whether VIN search is wired on the backend but unadvertised, or genuinely absent, is unconfirmed (§21, candidate question).

### The link to Expenses — a real gap

A key-code purchase is the client's own worked example of a job-tied **Expense** (`Q-16`, `[T2:50-54]`). But today the Code Request / Key Code flow captures the cost the **company** pays a provider, and nothing connects that cost back to the job's payment breakdown or tags who ultimately bears it (technician vs. company, `FIN-W-013`).

`KeyCode.cost` and the job's pricing breakdown live in **completely separate models with no visible link**. Closing that link is the design task — offer the paid-by-technician / paid-by-company tag at fulfillment time, and make sure whoever builds the wallet's expense ledger can trace a row back to its Key Code provenance.

---

## 8. Communications — masked calling, SMS, chat, call logs

**ID namespace:** `COM` · **Source coverage:** 🟢 Strong — the client's own written spec

### ⚠️ The starting point is not zero

`NEW-REQUIREMENTS.md §2` states *"the entire masked-communication layer — nothing like it exists in the live system today."* **That statement needs revising.** The live audit found:

- **Real Twilio Call SIDs** in Company Admin's Call Logs — genuine format, `CA` + 32 hex characters `[AUDIT:company-admin/call-logs/call-logs.md]`
- A literal **`technician_to_client`** call-type enum value on every row
- A **`twilio_identity`** field already assigned per technician (e.g. `technician_20`), visible as a real field update in the audit log `[AUDIT:company-admin/audit-log/audit-log.md]`
- **`fcm_token`** field updates on User records — Firebase push infrastructure already exists

Basic call logging and per-technician Twilio identity provisioning **already exist at the data-model level**. The genuinely new part is the **masking / proxy-number / webhook-routing behavior** — the Customer column currently shows the customer's **real** phone number, consistent with no masking being live yet.

**Get the developer to confirm exactly what's already wired before scoping this work.** It could change estimation materially.

### Calls

On job creation, bind four things `[C:§1]`:

```
real customer number + real technician number + Twilio proxy number + Job ID
```

- The technician calls **only from inside the app** — never dials directly → `COM-003`
- Twilio calls the technician first, then bridges to the customer
- The customer sees the **Twilio number**, never the technician's real number → `COM-002`
- If the customer calls the Twilio number back: the server receives a webhook containing From and To, looks up the active job for that customer + number pair, and routes the call to the currently assigned technician `[C:§1]`
- On a routed callback the technician sees **only the Twilio number**, never the customer's real number → `COM-001`
- **No active job → route to dispatch**, never to any technician → `COM-005`
- Preferred implementation: a Twilio **Proxy Session** per job, or a custom system keyed on `From + To + Active Job + Assigned Technician` `[C:§1]`

### SMS — identical rules, same number

- The technician sends SMS **only from inside the app** and never sees the customer's real number
- The customer receives from the Twilio number only
- On reply, the message reaches Twilio, which webhooks the server; the server identifies the active job and routes it back to the technician in-app (or to their real number, still masking the customer's) `[C:§1]`
- After job close, messaging stays live for the same fixed window, then routing stops or diverts to dispatch

**The 24-hour SMS session is a separate surface from per-job dispatcher chat** (`Q-17` ✅). The technician's message leaves as an **ordinary SMS from the Twilio number** and lands in the customer's **native phone messaging app** — the customer needs no app and no login `[T2:187-191]`. Do not merge this thread with any internal chat-with-dispatcher thread; they serve different parties.

### Binding lifecycle

- Stays active for **24 hours** after job close or cancel, then is disabled → `COM-004`
- **Follows whichever technician currently holds the job** — a reassignment moves the binding to the new technician, not the original assignee `[T2:129]` → `COM-004`
- **After the 24-hour window, routing depends on job origin** `[T2:131-137]` → refines `COM-005`:
  - company-relevant job → the **company dispatcher**
  - platform-sourced job → **back to the platform**

### Ownership — each company brings its own

- **Each company supplies its own Twilio number and subscription.** The platform does not issue it `[T2:143-146]` → resolves `Q-10`.
- The number can change **at any time the company chooses** — not on a fixed cycle, correcting an earlier assumption `[T2:146]`.
- Only call/message **logs** are retained across a number change; records are **not versioned** against a specific number.
- Each company must hold its **own Twilio API credentials directly with the provider** — both Twilio and payment gateways require KYC/background checks on the account holder, and the client does not want that liability. The platform **performs the connection but never re-sells or co-signs access** `[T2:154-157]` → `FIN-W-016`.

**Design consequence:** the Twilio settings block is "bring your own credentials," not an in-product signup wizard the platform mediates.

### Recordings live in Twilio

Call and SMS recordings for a session are stored **by Twilio itself**. The platform stores and displays a **link**, not the raw file `[T2:196-200]`.

⚠️ Live: a Recording column with two icon buttons already exists on Company Admin's Call Logs, but the play button is **not functionally wired** — clicking produces no player, no modal, no network request, and no error `[AUDIT:company-admin/call-logs/call-logs.md]`. The design should specify what a working link/player state looks like; the developer needs to say whether the URL is empty in seed data or the handler is simply unimplemented.

The technician app **does not** need a recording-playback UI — that is a Company Admin surface only (`ROL-009`).

### ⚠️ Legacy per-country provider config

Platform Admin's **Countries** page carries per-**country** `Call Provider` and `Whatsapp Provider` fields, seeded entirely with placeholder "America Country" / "Middle East Country" rows `[AUDIT:platform-admin/countries/countries.md]`. This is a remnant of the cancelled UAE/Middle East expansion.

This is an **architectural mismatch, not a cosmetic one**: country-level fields answer *"which gateway vendor does this country use"*; the requirement needs *"which Twilio number does this specific company hold."* If still wired to anything, it directly conflicts with the per-company ownership model. Do not build the new per-company Twilio settings alongside an unreconciled legacy per-country one. Blocked on `Q-04`.

### Phone-number visibility is a field-level, role-conditional rule

Every actor sees customer numbers except the technician `[T:456-459]`. This is a **hidden value, not a hidden action** — it must hold across tables, detail panes, tooltips, CSV exports and notification payloads. The masked-phone cell must be a **first-class column type** in the master DataTable component, rendering **nothing at all** for a technician — not a hidden button, not a blurred value, an absent cell.

⚠️ **Open**: Company Dispatcher's Active Jobs table shows the real customer phone today `[AUDIT:company-dispatcher/active-jobs/active-jobs.md]`. Nothing in the requirements says whether that survives the masking rollout. Registered in §21 as a candidate question.

---

## 9. Location and the live map

**ID namespace:** `LOC`

- The technician's app tracks their **live location continuously from acceptance onward**
- A job's location is recorded **only when the technician pings on arrival** → `LOC-002`. Confirmed live via real lat/long in audit-log rows.
- The map carries **exactly two layers**: live technicians and pinned jobs → `LOC-003`
- The system compares the technician's GPS against the dispatcher-typed address

### ✅ The two-layer map is built and working — a major positive finding

`CLAUDE.md`'s "Missing entirely" list names the two-layer map as something to design from scratch. **It exists and works** `[AUDIT:company-dispatcher/live-map/live-map.md]`:

- A real embedded **Google Maps JS API** integration — live API key, real "Open in Google Maps" deep link and attribution, not a placeholder image
- **Two independently toggleable layer checkboxes**: "Technicians" and "Job Locations", both checked by default — exactly matching `LOC-003`. Unchecking "Job Locations" visibly removed all job markers while technician markers remained: a real, working toggle.
- Clicking a technician (map marker or sidebar chip) opens a Maps info-window **and** populates a Technician Info side panel with avatar, name, status pill, raw coordinates, and a **"View Job" deep link** to that technician's current job
- A four-state status legend (Offline / Available / Off Duty / Busy) and a Live Stats count panel

**Review this as a reference implementation before designing this screen.** Per `Rule 00 · R00-5` this is not "the map is done, skip it" — screen inventories are still derived forward from requirements — but designing it from a blank page would be wasteful.

### A location display inconsistency

Company Dispatcher's Technicians page shows **precise live GPS coordinates** per technician; Company Admin's equivalent page shows literally **"Unknown Zone"** for the same underlying data and technicians `[AUDIT:company-dispatcher/technicians/technicians.md]` vs `[AUDIT:company-admin/technicians/technicians.md]`. One page is failing to surface data the other proves exists. No permission rationale explains it.

### An honesty constraint on any assignment map

At assignment time, **there is nothing real to plot for the job itself** — a job's location isn't known until the arrival ping (`LOC-002`). A technician-picker map view can show technician positions and status; it must **not** fabricate a "closest technician" distance metric or a job pin `[USER:2026-08-28]`.

---

## 10. The financial system

**ID namespace:** `FIN-W` (wallets/payments), `FIN-F` (fees/disputes), `FIN-S` (statements/ledger)
**Source coverage:** 🟢 Strong — the client's written file is close to specification-grade

### Current state: almost nothing exists

> *"we never reached the payment stage at all"* `[T:216]` · *"we haven't done anything to do with payment"* `[T:218]`

- The payment link was intended but *"no UI was ever made for it from the start"* `[T:182]`
- The old plan was a **single** platform gateway; the client now wants several `[T:218]`
- A technician ledger page was planned but never built — *"I was going to make him a dedicated page, but I had no UI for it at all"* `[T:528]`

Confirmed live by direct inspection: **zero** financial fields exist on Platform Settings (a logo uploader is the entire page), on Company Settings (name/contact/address/status only), or anywhere in the Companies module `[AUDIT:platform-admin/settings/settings.md, company-admin/settings/settings.md]`.

**With three exceptions that are real head starts:**

1. 🔴 **A per-job "Technician Ledger" route already exists and crashes.** `/companies.admin/jobs/{id}/technician_ledger` is a live linked row action that returns a hard **500 Server Error** on every job tested `[AUDIT:company-admin/jobs/jobs.md]`. This is the clearest evidence that backend financial-ledger work has **already started**. Coordinate with the developer before designing the Technician Account screens — there may be a partial data model and view to build on, not a blank slate. Flag the bug immediately, independent of any design timeline.
2. **A per-technician `Commission Percentage %` field exists live**, pre-filled (e.g. 15.00%) in the Edit Technician modal `[AUDIT:company-admin/technicians/technicians.md]`. The mechanism named in the new requirements is at least partially wired already.
3. **A per-company `Commission` field exists live** and is required on the Add Company form `[AUDIT:platform-admin/companies/companies.md]` — bearing directly on `Q-02`. See §20 #5.

### What a wallet actually is — ✅ `Q-01` resolved

A wallet is a **transaction log — a source of truth** for money that moved elsewhere. It is **not** an account that technicians or companies move money through `[T2:11-16]`.

- An engineer once proposed technician-to-technician transfers; **the client rejected it outright.** Technicians never control their own wallet balance — card payments route directly to the **company**, never to the technician, and the technician's dues are computed and settled from there `[T2:8]`.
- Each wallet resets on the existing financial-week boundary `[T2:10]`.
- The client's mental model is explicitly **evidentiary**: it records where money came from, which job closed it out, which technician worked it, whether a chargeback landed on it, and what evidence was submitted `[T2:12]`.

→ `FIN-W-012`.

**Design consequence, non-negotiable:** wallet screens are **statements and drill-down ledgers, never send/receive interfaces**. No transfer flow, no sender/recipient picker, no pending/settled confirmation state for wallet-to-wallet movement, because that movement does not exist in this product.

### The three financial levels

```
Platform Wallet      owner only · covers platform-gateway companies ONLY
        │
        ├── transfers to companies
        ▼
Company Wallet       one per company · fully isolated
        │
        ├── technician payouts
        ▼
Technician Account   one per technician · relationship with their company only
```

**Platform Wallet** `[C:§Financial/PlatformWallet]` — belongs to the system owner alone. Used **only** for companies that adopt the platform's gateway. If a company uses its own gateway, **none of its money appears here at all** → `FIN-W-002`.

Contains: customer payments · platform commission · gateway fees · refunds · disputes and chargebacks · company balances · transfers to companies.

> ⚠️ Two of those entries — *company balances* and *transfers to companies* — mean the platform holds money **custodially on behalf of companies** and later remits it. That implies a platform → company payout flow with its own approval, scheduling and confirmation states, which **no source describes** `[ASSUMPTION]` on the mechanics; the same gap one level down is `Q-13`. New color, not a resolution: the client describes the *third-party* payment software the business uses today as requiring a manual "cash out" step to move money from the processor's wallet to a real bank account, same-day or end-of-week at the user's choice `[T2:16]`. Whether JobixFlow should mirror that manual-trigger pattern is open.

**Company Wallet** `[C:§Financial/CompanyWallet]` — one per company, completely independent → `FIN-W-003`. Manages card payments · refunds · disputes · expenses · technician payouts · financial adjustments · financial reports. *"No company may view another company's data."*

**Technician Account** `[C:§Financial/TechnicianAccount]` — one per technician, showing **only** their financial relationship with their company → `FIN-W-009`. Note the deliberate wording: the client calls this an *account*, not a wallet.

Contains: completed jobs · commission percentage · cash amounts received · card-operation earnings · dispatch fees · gateway fees · deductions · backcharges · amounts received from the company · **final balance, owed either to them or by them** → `FIN-W-010`.

### Payment arithmetic

Both flows are specified step-by-step in `[C:§Financial/PaymentCalc]`. They run in **opposite directions** — the central design insight of this module. The 2026-08-17 follow-up inserts a **job-tied expense deduction ahead of every other deduction** `[T2:50-54]`: a $100 job with a $30 key-code expense nets to $70 before gateway fee, commission or dispatch fee are ever calculated.

**Card — the company ends up owing the technician**

```
1. Customer pays by card
2. Money enters the COMPANY WALLET
3. Job-tied expense deducted from gross first          → FIN-W-013
4. Gateway fee deducted from the post-expense amount   (default 3%, editable)
5. Technician's commission share calculated
6. Dispatch fee deducted
7. Net technician dues recorded, to be paid later      → FIN-W-005
```

**Cash — the technician ends up owing the company** ⚠️ *contested, see §20 #1*

```
1. Customer pays the technician in cash
2. Job-tied expense deducted from gross first
3. Technician keeps the remaining money
4. Commission calculated on the post-expense amount
5. Dispatch fee deducted
6. Remainder is DUE TO THE COMPANY
7. System records the cash held by the technician that must be handed over  → FIN-W-004
```

The deduction order on card is **fixed**: expense → gateway fee → commission → dispatch fee → `FIN-W-006`.

**Every deduction is its own transaction record** — never folded into another amount → `FIN-F-002`.

A **Service Call Fee** sits entirely outside this arithmetic — it applies *instead of* a completed job's payment breakdown, not alongside it, since it only arises when a job doesn't reach normal completion.

### Expenses — ✅ `Q-16` resolved

Job-tied **operational costs only**, not a general business-expense ledger. The client's worked example: a job needs a $30 key or key code; that $30 is deducted from the job's gross **before** commission math `[T2:50]`.

At job close-out the **technician** tags the cost as **paid by me** (the technician fronted it and is reimbursed) or **paid by company** (the cost simply returns to the company) `[T2:52]` → `FIN-W-013`.

This is a per-job entry made by the technician, not a standing feature.

⚠️ **Do not repurpose the existing live `Paid By` field.** Job Details already has itemized cost lines with a `Paid By` field whose live values are **`company` / `customer`** `[AUDIT:platform-admin/jobs/jobs.md]` — that answers *who ultimately bears the cost, the workshop or the end customer*. The new Expense tag is a different, narrower question — *did the technician front the cash*, with values **technician / company**. Design them as two separate tags that can coexist without conflation. Needs developer confirmation (§21, candidate question).

### Fees

Per job `[C:§Financial/Fees]`:

| Fee | Shape | Default | Configured at |
|---|---|---|---|
| **Dispatch fee** | Flat | — | Company level |
| **Gateway fee** | Percentage | **3%, editable** | Company level |
| **Commission** | Percentage | e.g. 15% seen live | **Per technician** |
| **Service Call Fee** | Flat, manually entered | — | Per cancellation `[USER:2026-08-28]` |
| Other deductions | — | — | Per job |

Every amount displays its currency; **every fee shows whether it is a percentage or a flat amount** (`Rule 02 · R02-6`).

### Company settings

Per company `[C:§Financial/CompanySettings]`: commission % per technician · dispatch fee · gateway fee · gateway selection · whether to use the platform gateway or their own.

### Payment gateways

- The platform configures its own gateway `[T:184]`
- A company **may** configure its own by entering API credentials `[T:186-187]`
- A company with **no** gateway falls back to the platform's, and its customers pay into the platform account `[T:184]` → `FIN-W-007`
- The moment a company has its own gateway, payments route there — *"her money, there it is"* `[T:186]`
- Up to **three** gateways with three credential sets `[T:218]` — softened in the follow-up to **no fixed cap**, "two or three" as a starting point with room to add more `[T2:151]` → `FIN-W-008`
- ⚠️ **Which gateways is unresolved and self-contradictory** — the written file names Stripe, **Square**, Authorize.net; the client verbally named Stripe, **PayPal**, Authorize.net `[T2:148]`. See §20 #6.
- Each company obtains and holds its **own credentials directly** — the platform connects but never re-sells or co-signs → `FIN-W-016`

**Design consequence:** a list-with-add pattern (one row per configured gateway: provider, masked credential summary, active/fallback indicator, connection test, remove), not a single form. And an explicit **"No gateway configured"** state that clearly explains the fallback: *"Your customers' payments will go through the platform's own gateway until you connect one here."* That state should be the **default rendering**, not an edge case.

### UX implications for this whole module

- **The direction split is the organising idea.** A technician's balance nets two opposing flows and can land on either side of zero. Direction must be readable at a glance and **never inferred from a minus sign alone** (`Rule 02 · R02-6`). "Cash in hand to hand over" and "net dues awaiting payout" are distinct quantities and must never be merged into one figure.
- **Three levels means three distinct screen families**, not one wallet screen reskinned. They differ in owner, scope and permitted actions.
- **Every deduction is separately visible.** A job's payment detail is a **breakdown, not a total**: gross → less expense → less gateway fee → commission split → less dispatch fee → net.
- **Nothing is editable.** No balance field anywhere is writable → `FIN-S-003`. Corrections are a new **Adjustment** transaction with its own entry flow, reason, and audit trail. The one narrow exception the client confirmed is a **pre-finalization edit to a line item on a technician's *draft* weekly report** `[T2:36-47]` — an input correction before the report locks, not a rewrite of a posted balance.
- **Frozen or held amounts are a distinct state** from either debited or available → `FIN-F-004`.

---

## 11. Post-completion financial resolution

Fully modeled and implemented on 2026-08-28. `job.status` **never leaves `completed`** during any of this — refund, dispute and backcharge are **overlays**, never alternate job statuses.

### 11.1 Refund vs. dispute — distinct mechanisms, never merged

Previously conflated in the sources; explicitly separated `[T2:159-169]`:

| | **Refund** | **Dispute / Chargeback** |
|---|---|---|
| **Who starts it** | The **company**, voluntarily | The customer's **bank** |
| **Trigger** | Customer phones with a complaint | Customer contacts their bank and denies the charge |
| **Nature** | Informal goodwill gesture, full or partial | Formal reversal; the bank refunds the customer and disputes the charge |
| **Arrives via** | A phone call | The payment gateway's own **dispute API** |
| **Time pressure** | None described | An evidence window — client estimate **30–60 days**, unconfirmed |
| **Opening in-product** | A dispatcher action | **System-automated.** Never a manual "start dispute" button. |

They **must be tracked as distinct job states**, never merged. Both are `financialFlag` overlays on a `completed` job.

### 11.2 The refund flow — dispatcher-driven, three steps

> *"when the job is completed the dispatcher can update to a refund as the user can ask for a refund after everything is completed. the dispatcher can update the job status to request a refund (entering the reasons, selection from a list options and optional description) then he can update it again to refunded (specify full refund or partial and insert the amount), or refund rejected with selecting reasons."* `[USER:2026-08-28]`

```
completed (no refund)
        │  Company Dispatcher: "Request Refund"
        │  — reasonCode (from a list) + optional free-text description
        ▼
completed · refund: REQUESTED
        │
        ├─ "Approve Refund" — full | partial; amount required if partial
        │                     (full auto-fills to the amount owed)
        ▼
completed · refund: REFUNDED         → appends one negative `refund` ledger row
        │
        ├─ "Reject Refund" — rejectionReasonCode (from a list)
        ▼
completed · refund: REJECTED         → no ledger row; no money moved
```

**Authority:** the **Company Dispatcher** holds *both* the request and the decision. No second approver exists above them `[USER:2026-08-28]` → resolves `Q-15`.

**Ledger implications:** the request step moves no money → no row. Approve appends one `refund` transaction, signed negative. Reject moves no money → no row.

**Keep `financialFlag: 'refund'` even on rejection** rather than reverting to `'none'`, so reporting can distinguish "refund never raised" from "refund raised and denied." The fine-grained truth lives in `refundDetail.status`.

**Reason codes are dev-authored placeholders** (`Q-22`, scope relaxed for the prototype):
- *Request*: Service Not Satisfactory · Customer Was Overcharged · Duplicate Charge · Goodwill Gesture · Other
- *Rejection*: Outside Refund Policy Window · Service Was Fully Delivered · Insufficient Evidence Of An Issue · Other

These are **not client-sourced** and must be swapped for the real list the moment it arrives.

### 11.3 The dispute flow — bank-initiated, partly automated

> *"this dispute is actually done by the customer contact the bank and deny the payment action, then the bank refund him the amount and disputed the action while giving the payment issuer (platform or the company) a period to give proof documents to charge it back again. the dispute could be partial or full. this dispute should be automated so when the bank made it the gateway should give a feedback with the transaction and the system should update the relevant job automatically. Now when the tenant solve the dispute issue it could update it to settled with the amount they got back again."* `[USER:2026-08-28]`

```
completed (no dispute)
        │  [AUTOMATED] Payment gateway webhook — bank filed a chargeback
        │  system resolves Job + Invoice + Payment + Technician  (FIN-F-003)
        │  captures: disputedAmount, isPartial, gatewayTransactionRef, openedAt
        ▼
completed · dispute: OPENED
        │  → technician already paid?  → create a BACKCHARGE for their
        │                                 COMMISSION SHARE ONLY (FIN-F-006/007)
        │  → technician not yet paid?  → FREEZE their share (a distinct state)
        │  → freeze/deduct the disputed amount in the relevant wallet
        │  → evidence window opens
        │
        │  Evidence submission happens OUTSIDE JobixFlow, through the gateway's
        │  own dispute portal. There is no in-app "submit evidence" action.
        │  [ASSUMPTION, low-risk — consistent with both accounts]
        │
        ├─ Company Dispatcher: "Mark Settled" + settledAmount actually recovered
        ▼                                        (may be less than disputedAmount)
completed · dispute: SETTLED
        → release frozen funds · reverse any backcharge created above
        │
        ├─ Company Dispatcher: "Mark Lost"     [trigger mechanism OPEN — Q-24]
        ▼
completed · dispute: LOST
        → frozen funds permanently deducted; any backcharge stands;
          technician bears ONLY their commission share (FIN-F-006);
          dispatch and gateway fees are NEVER returned (FIN-F-007) —
          they are already-consumed operating costs;
          the company absorbs the rest per its own policy
```

**Every dispute links to Job + Invoice + Payment + Technician — all four, always** → `FIN-F-003`.

**Who is on the hook** — *"payment issuer (platform or the company)"* confirms `gatewayMode` governs who receives and answers the chargeback, not just who sees the money: own gateway → the company is merchant of record; platform gateway → the platform is.

**In a prototype with no real gateway,** "opened" can only ever appear as **seed data** — correctly, no button opens a dispute. Only Settle/Lost are real clickable actions.

**Proof of service** — technicians keep physical paper logbooks, get the customer's signature, and photograph the signed page plus the customer's ID; these photos are uploaded to the platform as dispute evidence after job close `[T2:172-182]`.

### 11.4 Backcharge — two distinct origins

A backcharge is a debt raised against a technician. **Two independent origins exist**, and they must not be conflated in copy or capped identically:

| Origin | Trigger | Cap | Created by |
|---|---|---|---|
| **Dispute-driven** | A dispute lands on a job the technician was **already paid** for | **Their commission share only** — never the full job amount (`FIN-F-006`). Dispatch and gateway fees are never clawed back (`FIN-F-007`). | System, on dispute open |
| **Standalone cost recovery** | The **company fronted a cost** (typically a key-code purchase) that was actually the **technician's** responsibility | The fronted amount | **Company Dispatcher**, manually |

The standalone origin was added 2026-08-28 at the designer's direction. The data model already supported it — `BackchargeDetail.linkedDisputeId` was always optional — but no UI had ever exercised that path, and the one place that displayed a backcharge hard-coded dispute-origin language regardless of provenance. Display copy now branches on whether `linkedDisputeId` is present, so the commission-share cap is stated **only where it is actually true**.

**Note:** the technician *self-funding* a cost is the normal, uneventful case (`FIN-W-013` handles it as a `paidBy: 'technician'` pricing line) and needs **no** backcharge. The backcharge is for the **inverted** case.

### 11.5 Service Call Fee — 🟠 partially resolved

A standalone charge covering a technician's **wasted trip** when a dispatched job doesn't reach completion — the customer resolved it themselves, refused to pay, or the job got reassigned mid-trip `[T2:105-124]`. Separate from job price, dispatch fee and gateway fee.

The client's own account of enforcement is candid and loose:

> «اذا العميل بده يدفع بناخذ منه الفلوس اذا العميل ما بده يدفع نطلب من الفني يطلع من المكان وخلاص» `[T2:107]`
> *"If the customer wants to pay, we take the money; if he doesn't, we ask the technician to leave the location, and that's it."*

> «فانا فعليا ما بقدر اجبره بالقانون الامريكي ما في شيء يجبره... الشرطه تحكي لي ما بده يدفع لك خلص» `[T2:123]`
> *"I genuinely can't compel him — under US law nothing compels him… the police tell me he doesn't want to pay you, that's that."*

There is **no legal mechanism to compel payment**. The outcome is genuinely binary — collected or not.

**The mechanism, newly concrete** `[USER:2026-08-28]`:

> *"when cancelling a job, if the reason was customer is not available or any other reason, enter a fee amount and generate [a] payment link that is sent as a message to the customer number."*

The dispatcher **manually enters** a fee amount at cancellation time; the system **generates a payment link and SMSs it** to the customer's number. This is the **first real trigger point for the payment-link feature** — a cancellation fee, not a normal job payment.

**Still open (`Q-20`):** whether *every* cancellation reason permits a fee or only some ("this reason or any other reason" reads as broad, not an exhaustive gate), and whether any calculation logic exists beyond manual entry.

**Design guidance:** keep this minimal. A labeled fee line on cancelled jobs showing amount and outcome (Collected / Sent, awaiting payment / Expired, unpaid / Not applicable). Do **not** invent a rate card or calculation formula.

### 11.6 Reporting implications

- A completed job's row can no longer be summarized by a single flag. Refund and dispute are **independent tracks**, each with its own status, so a report can answer "how many jobs had a refund *requested* vs. actually *paid out*" separately from "how many are under an open dispute vs. settled vs. lost."
- The technician statement's backcharge line needs **both directions** — created (dispute opened, technician already paid) and **reversed** (dispute settled). Only the creation direction currently has a modeled transaction type.
- ⚠️ `financialFlag` as a single coarse enum (`none | refund | dispute | backcharge`) **cannot represent "both at once."** A single completed job can legitimately carry both a refund and a dispute over its lifetime. Recommendation: derive any coarse "flagged" filter/badge from the detail objects rather than treating the flag as the source of truth. Flagged, not silently changed (`Q-25`).

### 11.7 Scenario matrix

Every combination the model must support:

| # | Origin | Path | Outcome |
|---|---|---|---|
| 1 | Company | Created, technician picked immediately | Straight to `assigned_to_technician`, no intake ceremony |
| 2 | Company | Created, no technician picked | `assigned_to_company`, only action = Assign to Technician |
| 3 | Platform | Routed to company | `assigned_to_company`, actions = Accept & Assign / Refuse |
| 4 | Platform | Company refuses | `company_refused` |
| 5 | Either | Cancelled while `assigned_to_technician` | `cancelled` + reason |
| 6 | Either | Cancelled after dispatch (on the way / arrived) | `cancelled` + reason, optional Service Call Fee → payment link |
| 7 | Either | Normal completion | `completed`, no refund, no dispute |
| 8 | Either | Refund requested → approved, full | `refund: refunded`, type `full` |
| 9 | Either | Refund requested → approved, partial | `refund: refunded`, type `partial`, amount < finalPrice |
| 10 | Either | Refund requested → rejected | `refund: rejected`, no ledger entry |
| 11 | Either | Dispute opens automatically, full, technician not yet paid | `dispute: opened`, share frozen, no backcharge |
| 12 | Either | Dispute opens, technician already paid | `dispute: opened` **and** auto-backcharge for the commission share |
| 13 | Either | Dispute → Settled | `dispute: settled`, `settledAmount` recorded, frozen funds released, backcharge from #12 reversed |
| 14 | Either | Dispute → Lost | `dispute: lost`, funds stay deducted, backcharge stands |
| 15 | Either | Partial bank dispute | `isPartial: true`, `disputedAmount` < finalPrice |
| 16 | Either | Refund rejected, then a bank dispute opens on the same job | Both detail objects populated — see §11.6 |
| 17 | Either | Company fronted a technician-responsibility cost | Standalone backcharge, no dispute involved |

---

## 12. Invoicing and payment links

### Invoicing — ✅ `Q-12` resolved

A real feature, narrowly scoped:

- The **technician decides per job** whether to send an invoice at all `[T2:205]` → `FIN-W-014`. Not automatic, not default-on — an explicit per-job judgment call.
- Every invoice is issued under the **company's own name**, never the platform's, because each company owns its own payment relationship `[T2:206]`
- **No logo required**, just the company name `[T2:208]`
- **The platform's name or branding never appears on an invoice at all** `[T2:210]` → `FIN-W-015`

**Design warning:** this is an easy thing to get wrong by reusing a shared page-header component without thinking. The invoice preview must visibly **not** carry the product identity that's on every other screen.

**Still unconfirmed:** numbering scheme, delivery mechanism to the customer, and whether invoices get their own list/detail screens or live entirely inside the job record. Do not invent these.

### Payment links — the only customer-facing surface in the product

The platform sends a payment link to the customer's mobile `[T:182]`. The customer has no app or portal (`JOB-001`), so this link is the **only customer-facing surface in the entire product** and must work standalone on a phone browser with no login → `FIN-W-011`.

**Two real triggers exist:**

1. **Job payment** — sent once a job reaches `completed` and the customer pays by link rather than card in person
2. **Service Call Fee** — generated when a company dispatcher cancels a dispatched job and assesses a fee (§11.5). This is the first *concretely specified* trigger.

Both funnel through one page template driven by a `purpose` field — not two bespoke pages.

**The data shape** (as implemented):

```ts
interface PaymentLink {
  url: string
  amount: number
  purpose: string     // "Job Payment — JOB-30012" | "Service Call Fee — JOB-30045"
  status: 'sent' | 'paid' | 'expired'
  sentAt: string
  sentBy: string
}
```

**Required states** — all explicitly designed, none a generic error page:

| State | Content |
|---|---|
| **Payment request** (`sent`) | Trust header (company name + phone, never the platform's), charge context, amount, wallet buttons, gateway-agnostic card form, pay button with the amount in its label |
| **Processing** | Transient overlay, not a persisted status |
| **Declined** | Transient; inline danger banner; form stays populated **except CVC**, which always clears |
| **Success** (`paid`) | Confirmation, amount, date, company name. **A deliberate dead end** — no navigation, because there is nothing else this customer can reach |
| **Expired** (`expired`) | No form at all. One next step: tap-to-call the company for a fresh link |
| **Already paid** | Blue info state, amount restated, no form |

**Branding rule** `[ASSUMPTION, extending FIN-W-015 by direct analogy]`: no platform logo, wordmark or "powered by" credit anywhere. The invoice rule applies identically here — same kind of company-branded, customer-facing financial artifact.

**Gateway-agnostic** — no vendor logo or vendor-specific widget, since `Q-03` is unresolved.

**Two honest data gaps** to state rather than paper over:
- `PaymentLink` carries no `paidAt`, so an exact "paid on [date]" line **cannot be shown truthfully** on the already-paid state. Degrade gracefully; flag that a `paidAt` field would close it.
- Currency stays a plain `$` — `Q-14` (currency and locale) is unaddressed.
- Do **not** add a "Download Receipt / Invoice" button as if it always exists — invoicing is a per-job technician decision (`FIN-W-014`), not guaranteed for every payment-link transaction.

⚠️ **One data point of uncertainty:** `Payment Method: "Payment Link"` **already appears as a live value** on a real job's Payment Details, with a Transaction ID and Reference Number recorded `[AUDIT:platform-admin/jobs/jobs.md]`. Worth a developer check on whether this is real infrastructure or seed-data flavor text — it would change the scoping.

---

## 13. Weekly cycle, statements and the ledger

**ID namespace:** `FIN-S`

### The financial week

**Monday 00:00 → Sunday 23:59** → `FIN-S-001`. A job is counted in the week it **completed**, not the week it was created → `FIN-S-002`. Statements auto-generate at week end `[C:§Financial/WeeklyCycle]`.

### Company weekly statement `[C:§Financial/Statements]`

Total revenue · total cash · total card · gateway fees · dispatch fees · refunds · disputes · company profit · company wallet balance · technician balances.

### Technician weekly statement `[C:§Financial/Statements]`

Job count · total cash collected · total card earnings · total commission · dispatch fees · gateway fees · deductions · backcharges · total paid to them · **final balance (owed to or by)**.

**This statement drives the weekly technician payout.**

### How a technician actually gets paid — 🟠 `Q-13` partially answered

No formal approval workflow was described; payout is closer to **informal reconciliation** `[T2:36-53]`:

- The technician is a **commissioned contractor, not an employee**
- At week end the system automatically nets each technician's cash-collected against card-collected
- A **manual adjustment path** exists so a dispatcher/admin can correct a line item on the technician's weekly **report** if the system missed something (e.g. an unrecorded expense). This edits **report inputs before finalization** — it does not edit a posted balance, so it does not conflict with `FIN-S-003`.
- **Actual settlement happens off-platform** — in-person cash handover at the office, or an external app transfer (Zelle, Cash App, Venmo). The platform's only job is to record that the amount was **confirmed / collected**, without tracking payment-method granularity.

**Still unknown:** who exactly performs that confirmation, and what happens when a technician's balance stays negative for multiple consecutive weeks.

**Design consequence:** a simple "Mark as Settled" action with a date and optional note — **not** a payment-processing flow, since no money moves through the product here (`FIN-W-012`).

### The Financial Transactions ledger

**Balances are never edited manually.** Every operation appends a new row → `FIN-S-003`.

**Types** `[C:§Financial/Transactions]`:

```
customer_payment · refund · dispute · gateway_fee · dispatch_fee
technician_commission · technician_payout · backcharge · adjustment
transfer_to_company
```

**Every row carries:** transaction number · company · job · invoice · technician (if any) · customer (if any) · amount · type · datetime · acting user · notes.

### 🟠 The ledger's biggest gap — `Q-23`

The client's type list has **exactly one** dispute-related type, and it is modeled as **always negative**. That was sufficient when a dispute only ever *cost* money. It no longer is:

- **Dispute opened** → append a `dispute` row, negative, `amount = disputedAmount`, actor = System / Payment Gateway. ✅ Covered.
- **Dispute settled** → **money comes back.** Reusing the same `dispute` type with a positive sign breaks `FIN-F-002`'s spirit if a report ever sums `dispute` expecting one sign. **Recommendation: a new `dispute_recovery` type**, not a sign flip.
- **Backcharge reversal on settle** → same gap. `backcharge` is always-negative too. Needs either a `backcharge_reversal` type or a **defined** reuse of `adjustment` (whose meaning today is narrowly "manual correction to a draft weekly line item" — reusing it here broadens it).

**This is the single most consequential open point for the accountancy/reporting goal**, and it blocks correct Company Wallet and Financial Transactions screens for a settled dispute. It needs the client's sign-off before touching the ledger.

### Ledger UI requirements

The closest live analogue is the Audit Log — **not** a financial ledger, but the closest existing "append-only event table with filtering needs at scale" pattern, and a deliberate **negative** reference: its single global-search-only filter bar is exactly what must not be repeated.

The transactions table needs **per-column filters + date range + a required or strongly-defaulted scope from day one**. Company Admin's Call Logs page (search + date range + status + duration dropdowns) is the **positive** live reference pattern to follow instead `[AUDIT:company-admin/call-logs/call-logs.md]`.

---

## 14. Reports

**ID namespace:** `RPT` — declared in `Rule 00 · R00-7` but **currently has zero populated rules**
**Source coverage:** 🔴 Thin — the report set is explicitly the designer's to propose

### Current state

Both Reports pages (Platform Admin and Company Admin) are **charts-only**: Technician Performance Overview (bar), Jobs & Revenue Trend (line), Revenue by Service Type (pie), and a 4-tile Key Metrics Summary. **Zero filters, zero export**, despite the page subtitle reading *"Generate and download detailed reports"* — a promise the page doesn't keep `[AUDIT:platform-admin/reports/reports.md, company-admin/reports/reports.md]`.

Two live bugs make the current pages actively misleading — see §22 #3 and #9.

### What the client wants

**Tables** with full search, date ranges and per-row detail, for both platform and company scope.

**Filtering requirements, confirmed** `[T2:55-62]`:
- Date presets: **same-day / same-week / previous-week / custom range**
- Condition filters: **customer, technician, dispatcher, payment method**

**Two hard constraints, restated by the client as "most important"** `[T2:60-61]`:
1. Reports must **never** cross company boundaries → reinforces `TEN-002`
2. A **technician must never see another technician's activity** → a new technician-level self-scoping rule, stated more explicitly here than anywhere else

### Field sets named by the client

**Company report** `[C:§Financial/Reports]`: total revenue · cash revenue · card revenue · funds held by technicians · company wallet balance · technician balances · expenses · gateway fees · refunds · disputes · net profit.

**Technician report** `[C:§Financial/Reports]`: completed jobs · cash collected · card earnings · dispatch fees · gateway fees · total deductions · total amounts received · final balance.

### The report set — the designer's to propose (🟠 `Q-08`)

Beyond the two field lists above, the inventory is undecided. Proposed direction:

1. **Keep the four chart widgets as a Summary tab** — nothing asks to remove charts, only to add the table layer
2. Add a **Detailed Reports** section using the master DataTable + Filter, with at minimum a **Jobs report**, a **Financial report** (every ledger row), and a **Technician performance report**
3. Every report table defaults to a **scoped, non-empty date window** rather than loading unscoped — the client explicitly cares about server load at scale
4. **Export to CSV/Excel** — the same mechanism the archive requirement needs (`AUD-002`)
5. Add an **Origin** dimension to every company-facing report — financials must separate platform-sourced from company-sourced revenue

### Two tab structures, as built

- **Platform Admin**: Companies · Dispatchers · Jobs
- **Company Admin**: Technicians · Dispatchers · Jobs

The Jobs tab includes a Dispatcher column. Where a cell holds multiple names, a single name renders as a link and multiple names collapse to an "N dispatchers"/"N technicians" trigger opening a hover popover of individual links, each navigating to a pre-filtered Jobs list.

### The blocker below the blocker

`Q-08` is not the only constraint. **Service Type cannot be used as a real report/filter dimension until the seed-data bug is fixed** (§22 #2) — the `service_types` table is populated with people's names.

---

## 15. Audit log and data retention

**ID namespace:** `AUD`

### What the audit log records

CRUD actions across the platform and companies. Live columns: **User, Model, Action, Changes, Description, Created At, Actions** `[AUDIT:platform-admin/audit-log/audit-log.md]`.

The **Changes** column is genuinely useful and populated for Update actions with a real before→after diff string (e.g. `final_price : 103 → 446.6025`), showing `-` for Create actions. Preserve this — but a raw string diff won't scale to complex objects.

### ✅ Scoped by infrastructure, not blanket-wide — `Q-06` resolved

The platform's log only certifies operations conducted **through the platform's own infrastructure**. Anything a company does entirely on **its own payment gateway and its own Twilio number** is excluded — pulling it in would be, in the client's words, *"stealing information that belongs to them"* `[T2:32]`. As long as a company holds its own gateway and Twilio subscription, the platform respects that company's independent standing (كيان) and only touches records concerning the platform itself `[T2:34]` → `AUD-001`.

A company still on the platform's fallback gateway or lacking its own Twilio **likely remains visible**; that edge case was never asked directly.

**Design consequence:** the Audit Log needs a **persistent, non-dismissible scope note** explaining this. It's a genuinely surprising rule to an admin scanning for "everything" — the UI should say so up front rather than let them discover the gap by absence.

⚠️ There is **no company column** on the live page at all, so it's impossible to tell from the UI whether this exclusion is even applied server-side today. Needs developer confirmation.

### The scale problem — the origin of the reusable-component mandate

This page is the **direct, live confirmation** of the developer's stated concern: **1,660 pages** of results in seed data alone, with **one global search box** and no per-column filters, no date range, no company column, no user-type column `[T:344, 564-578]`, `[AUDIT:platform-admin/audit-log/audit-log.md]`.

This was the concrete example the designer used to justify the reusable Filter component (`Rule 02 · R02-2`, `R02-5`).

**Required:** Company and User Type as first-class columns and filter dimensions; per-column filtering plus the today/this-week/last-week/custom-range preset set; removable applied-filter tokens; explicit pagination and result-count affordances.

### ⚠️ Should audit rows be deletable at all?

A **"Delete" row action exists** on Platform Admin's Audit Log, despite an audit log's entire purpose being tamper-evidence `[AUDIT:platform-admin/audit-log/audit-log.md]`. This is a genuine product question, not something to silently carry forward. *(The prototype removed it as a documented design decision.)*

Platform Dispatcher's version of the same page has **no Actions column at all** — read-only.

### ✅ Delete becomes Archive — `Q-07` resolved

The client's operative concern is the **2-year US legal-retrieval requirement** for the software they use `[T2:67]` — satisfied as long as a backup exists.

- No hard delete of live operational or financial records
- The Jobs delete control becomes an **Archive** action, **blocked until a record reaches a minimum age**. The client's working figure is **one year**, and he agrees it should be **admin-configurable from the dashboard**, not hardcoded `[T2:68-77]`
- **Periodic full export** (quarterly or annual) to Excel/CSV before any purge satisfies the retention requirement `[T2:67]`
- **Terminology matters to the client: the state must read "Archived," never "Deleted."**

→ `AUD-002`.

**Design consequence:** an age-gated action labeled "Archive"; a disabled/explained state for records too young ("Available to archive after [date]"); a separate archived-records view. **Never a destructive confirmation dialog implying permanent loss.**

### ⚠️ A live conflict in at least three places

**Company Status includes a selectable "Deleted" value** — on Platform Admin's Companies **Create** form, on the **Edit** modal, and on Company Admin's own **Settings** page `[AUDIT:platform-admin/companies/companies.md, company-admin/settings/settings.md]`. It also appears in Platform Dispatcher's Companies status filter.

This is **one shared status-enum change**, not three separate screen edits. Flag it to the developer as a data-model change, not cosmetic.

*(Positive note: User Status has only Active/Inactive — no "Deleted" — so this is scoped to the Company enum.)*

---

## 16. Notifications

Not a stated new requirement, but real, working infrastructure that every new feature has to plug into.

**Confirmed live** `[AUDIT:platform-admin/notifications/notifications.md]`:

- A feed of system-generated job-lifecycle events with emoji-tagged titles ("Work in Progress ⚙️", "Technician Arrived 🙋‍♂️", "Job Cancelled ⛔", "Job Completed ✔️", "Technician Assigned"), a one-line description naming the technician and job, a relative timestamp, and a status chip
- **Two count-bearing tabs**: All (52) / Unread (52)
- **Bulk actions**: "Mark all as read", "Delete read" — all-or-nothing, no per-row selection model
- **Per-item actions**: Mark as read / Delete / View
- **"Mark as read" updates both the tab count and the sidebar badge live and in sync** — a good working example of state propagation to preserve
- **"Load More"** click-to-append pagination, distinct from the numbered pagination used on tables
- ✅ **Notifications are genuinely per-user**, not a shared broadcast feed — confirmed by a Company Dispatcher account showing 22 against the platform accounts' 51/52

**Implicit requirement:** every new financial feature needs its own event types — dispute opened, refund issued/decided, weekly statement ready, archive-eligible reminder, invoice sent, payment link paid. The notification centre's own UI is existing infrastructure and out of scope to redesign.

**Two small open items:** no toast or confirmation was observed after marking a notification read (silent by design, or missed?); and the displayed "Job #22618" does not match the internal ID in its URL (`/platform/jobs/125`) — worth knowing which number is customer/company-facing before designing a screen showing both.

---

## 17. Design system and UI constraints

### The eight binding constraints (`Rule 02`)

| # | Constraint |
|---|---|
| **R02-1** | **Extend the existing product, do not redesign it.** No new palette, type scale, spacing system, icon family, or layout paradigm. |
| **R02-2** | **The reusable component mandate.** One master Figma component each for DataTable, Filter, and Actions — every variant, state and permutation in one place. Screens consume; they never fork. |
| **R02-3** | **Mandatory state coverage.** Every screen and variant ships with Empty, No results, Loading, Error, and Permission denied. |
| **R02-4** | **Role visibility is UI state, not omission.** Actions a role can't perform are absent or disabled **with a stated reason** — never present and silently failing. |
| **R02-5** | **Design for the real data volume.** A lone global search box is never sufficient on a high-volume table. |
| **R02-6** | **Financial presentation.** Signed direction readable without inferring from a minus sign; negative events visually distinct; frozen ≠ debited ≠ available; currency always shown; percentage-vs-flat always stated; **no editable balance fields**. |
| **R02-7** | **Screens derive from requirements, not screenshots.** Every screen cites the requirement IDs it satisfies. |
| **R02-8** | **Generation prompts are self-contained.** Figma/Gemini cannot read this workspace — every prompt carries the design system, requirements, role context, states and component contract inline. |

### Tokens

Confirmed against the live product `[AUDIT:design-system/basics.md]` where noted; the rest inferred from the now-deleted screenshot set and **provisional until checked against the real Figma file**.

| Token | Value | Confirmed live? |
|---|---|---|
| Primary blue | `#3B82F6` | ✅ |
| Active / hover blue | `#2563EB` | ✅ |
| Focus blue | `#1D4ED8` | inferred |
| Page background | `#F8FAFC` (slate-50) | inferred |
| Card | `#FFFFFF` | ✅ |
| Border hairline | `1px solid #E2E8F0` | inferred |
| Text primary | `#0F172A` | inferred |
| Text muted | `#64748B` | inferred |
| Text subtle | `#94A3B8` | inferred |
| Success | `#22C55E` / text `#16A34A` on `#DCFCE7` | ✅ (green = completed/active) |
| Warning | `#F59E0B` / text `#D97706` on `#FEF3C7` | ✅ (amber = medium/pending) |
| Danger | `#EF4444` / text `#DC2626` on `#FEE2E2` | ✅ (red = high/error) |
| Info | text `#2563EB` on `#DBEAFE` | ✅ (blue = in-progress) |
| Accent / hardware | `#A855F7` / text `#9333EA` on `#F3E8FF` | ✅ (purple on some tags) |
| Card radius | `12px` | inferred |
| Modal radius | `16px` | inferred |
| Input radius | `8–10px` | inferred |
| Pill radius | `9999px` | ✅ |
| Typography | System UI sans-serif stack, **no distinctive display face** | ✅ |
| Icons | Outline / line style (Lucide / Feather family) | ✅ |

**Login page:** a plain white card on a neutral background. The blue→violet gradient hero described in the inferred design system was **not observed live** — worth re-confirming, low priority.

**Overall character:** a dense, data-heavy enterprise dashboard. Every list defaults to a real table or card grid with pagination, never a simplified summary. Minimal color outside status indicators and the primary blue. Utilitarian and operations-focused rather than heavily branded.

**Exact spacing, radii and the type scale are not reliably measurable from PNGs** — read them from the Figma file itself before finalizing tokens.

### Recurring patterns confirmed live

- **KPI tile rows** at the top of most landing/list pages (3–5 tiles, bold number + label, sometimes a delta)
- **Modals for almost all Create/Edit actions** — very few full-page forms outside Add Company, Add/Edit Job and Settings
- **Toast/alert-style validation** — dismissible red banners stacked at the top for server-side failures, rather than inline per-field errors
- **Status and priority pills** used consistently across job status, priority, technician availability, code-request and key-code status
- **Pagination**: numbered page links dominate; "Load More" is used specifically on Notifications feeds
- **Page title bold, with a gray one-line subtitle beneath** — completely consistent across every role and page

### ⚠️ Five cross-cutting inconsistencies the design system must resolve

These are the concrete justification for the reusable-component mandate.

1. **At least five distinct row-action conventions coexist live** — kebab-with-Show/Edit/Delete (Companies, Jobs, Key Codes); plain inline text links (Countries, Users, Service Types); button-row-per-item (Notifications); single unlabeled icon button (Job History, Platform Dispatcher's Customers); mixed labeled-link-plus-icon. **Pick one canonical pattern; don't preserve all five.** Additionally, **every icon-only action button found in this audit lacked an accessible name** — fix as part of the same component.
2. **Two shell layouts coexist, split by role family.** Admin roles (Platform Admin, Company Admin): sidebar-pinned user card, role subtitle under the logo. Dispatcher roles (Platform Dispatcher, Company Dispatcher): top-right navbar, no user card, no role subtitle. **Pick one canonical shell.**
3. **Filter richness varies wildly for the same entity across roles.** Companies has only a search box for Platform Admin but Status + Country dropdowns for Platform Dispatcher. Jobs has a Time filter for Company Admin but not Platform Admin. **The master Filter should carry the richest version and let screens show/hide by permission**, not perpetuate today's inconsistent subsets.
4. **List presentation varies by role for the same entity.** Jobs is a table (Platform Admin), a card list (Platform Dispatcher's Job History), and a card grid (Technicians). Needs a deliberate decision: does the DataTable support a card variant, or does every role converge?
5. **Search behavior is submit-on-Enter, not live-filtered**, with no visible search button. Confirm this is intentional before treating it as canonical.

### Positive live patterns worth preserving

- **Read-only chat is already correctly implemented** — composer textbox and send button both render `disabled` for both admin roles, not just visually hidden. This is the reference for `R02-4`.
- **A working empty state exists** — Company Dispatcher's chat with no messages shows "0 active chat" / "No Internal Messages" / "Select Chat from List" with an enabled "Start New Chat" button.
- **Status-gated actions already work** — Platform Dispatcher's Job History shows the Edit action only on New Job cards. A real, live example of the guided-stepper principle.
- **A role limit stated in-product** — Platform Dispatcher's Customer Show page says *"Read-only view of customer information"* in its own subtitle rather than silently omitting an Edit button.
- **The technician web-login block** — *"This account can only access the mobile application"* — is `R02-4`'s "absent or disabled with a stated reason" principle applied at the authentication layer.
- **Explained optional fields** — the profile page's *"Password update is optional. If both password fields are empty, your current password will not be changed."*

### ⚠️ One borderline-missing empty state

"Urgent Attention Required" on the Company Dispatcher dashboard renders with **no visible fallback copy** when nothing is urgent — a blank heading with no content. Arguably an `R02-3` violation; confirm with a real urgent job present before concluding it's broken.

### Never render design-process artifacts in the UI

A standing correction `[USER:2026-08-27]`. No "Visible to: …" role banners; no rule-ID or `Q-nn` citations in any subtitle, banner, tooltip or copy; no "New"/"Updated" scope badges; no toast admitting nothing is persisted. Business-rule *reasoning* in plain language is welcome ("The technician bears only their commission share") — never with the citation attached.

---

## 18. Screen inventory by role

Per `Rule 00 · R00-5`, nothing here asserts a screen "is missing" absolutely — only that it was **not found live** during the 2026-08 audit pass, which covered all four web dashboards (47 files, 88 screenshots). The technician mobile app could not be reached by browser automation and is **out of that audit's scope**, not a gap in it.

**Change types:** 🆕 New page · ➕ New section · 🧩 New modal · ✏️ Modify · ⚠️ Conflict · ✅ No change

### Shared

| Screen | Route | Status |
|---|---|---|
| Login | `/`, `/login` | ✏️ One form for every role; backend routes by role. Page title reads "Super Admin Login" for everyone — a copy leftover. No password-reset entry point discoverable from it. |
| My Profile | `/profile` | ✅ Shared across all roles. ⚠️ First/Last Name render empty while the full name lives in "Username". |
| Per-job Chat | `/jobs/{id}/chat` | ✅ Shared route, **not** role-namespaced. Composer disabled for both admin roles. |

### Platform Admin — `/platform` (11 pages mapped)

| Screen | Change | Notes |
|---|---|---|
| Dashboard | ✏️ | KPI deltas systemically broken (§22 #9) |
| Companies (+ Show / Create / Edit) | ✏️ | Create is a **full page** with ~15 fields in 3 sections; Edit is a lightweight **modal** (Status + Generate Password only). Remove "Deleted" status. Clarify the Commission field. |
| Company Details | ➕ | Add a **Gateway & Tenancy status** block — read-only, explains why a company may be absent from the Platform Wallet |
| Countries | ⚠️ | Legacy per-country Call/WhatsApp Provider config. Blocked on `Q-04`. |
| Reports | ✏️→🆕 | Effectively a rebuild: charts stay as a Summary; add tabbed tables (Companies / Dispatchers / Jobs) |
| Jobs (+ Show + Chat) | ✏️ | Add Origin; Delete → Archive (age-gated); expenses block; Service Call Fee block; refund/dispute as distinct states; cancellation reason inline in the timeline; reassignment timeline entry |
| **Platform Wallet** | 🆕 | Statement, not console. Summary strip + ledger + company balances panel + a visible scope note. `Q-02` caps the commission line. |
| **Financial Transactions** | 🆕 | Full per-column + date-range filtering from day one |
| Notifications | ✅ | Existing infrastructure |
| Customers | ✏️ | No company column, no detail view |
| Users | ✅ | |
| Audit Log | ✏️ | Add Company + User Type columns and filters; add the `AUD-001` scope note; **remove the Delete row action** |
| Settings | ➕ | Today it is a **logo uploader only**. Add archive-age config and the platform fallback gateway. |

### Platform Dispatcher — `/platform.dispatcher` (9 pages mapped)

| Screen | Change | Notes |
|---|---|---|
| Dashboard | ✅ | |
| New Job | ✏️ | Origin implicit. ⚠️ Priority conflict (§20 #3); ⚠️ Service Type bug; "Schedule at" is a misconfigured picker |
| Service Types | ⚠️ | The **source** of the person-name seed bug |
| Job History | ✏️ | Card-list layout. Delete → Archive; proactively disable rather than fail after a round-trip; extendable cancellation reason; separate the merged Status+Priority filter |
| Job Detail / Edit | ✏️ | Edit only on New Job status. ⚠️ Priority not pre-filling |
| Companies | ✅ | Read-only. Richer filters than Platform Admin's equivalent. |
| Customers (+ Show) | ✅ | Create + Read + Delete, explicitly no Update |
| Audit Log | ⚠️ | Full cross-company read access — **undocumented as a capability of this role** |
| Notifications | ✅ | |

### Company Admin — `/companies.admin` (12 pages mapped)

| Screen | Change | Notes |
|---|---|---|
| Dashboard | ✅ | Company-scoped, correct |
| Code Requests (+ Show + Add Code) | ➕ | Add the paid-by-technician/company expense tag at fulfillment. ⚠️ On an already-Approved request, Add Code stays clickable and the recorded code isn't shown. |
| Technicians (+ Edit) | ➕ | Surface Commission % on the roster; add a "View Account" link with the signed balance. ⚠️ 11 vs. 101 count discrepancy. |
| Reports | ✏️→🆕 | Tabbed tables (Technicians / Dispatchers / Jobs) + Origin dimension |
| Key Codes | ✏️ | ⚠️ VIN not searchable/visible; two copy bugs |
| Jobs (+ Show + Chat) | ✏️ | No Delete for this role. 🔴 **Technician Ledger route returns 500 on every job.** |
| **Company Wallet** | 🆕 | Statement + ledger + Record Adjustment modal |
| **Financial Transactions** | 🆕 | Company-scoped ledger |
| **Technician Account** | 🆕 | Signed balance with unambiguous direction; weekly figures; job history; "Mark as Settled"; draft-week edit only. **Coordinate with the developer first** — see the 500 above. |
| **Weekly Statements** | 🆕 | Current-week card + immutable past-week archive |
| **Disputes & Refunds** | 🆕 | Two clearly separate lists — merging them defeats the distinction the client drew |
| **Invoices (view)** | ➕ | Oversight only; sending lives in the mobile app |
| Notifications | ✅ | |
| Customers | ✏️ | Read-only today; company-scoped |
| Users | ✅ | Full CRUD including technician creation (`ROL-006`) |
| Call Logs | ✏️ | Wire the Recording play button. Good existing filter set. |
| Audit Log | ✏️ | Company-scoped correctly; needs per-column filters |
| Settings | ➕ | 🆕 **Twilio** section · 🆕 **Payment Gateway** list-with-add · 🆕 **Financial Defaults**. Remove "Deleted" status. |

### Company Dispatcher — `/companies.dispatcher` (7 pages mapped)

The smallest nav of any role — 6 items, a genuinely focused operational role.

| Screen | Change | Notes |
|---|---|---|
| Dashboard | ✏️ | ⚠️ "Urgent Attention Required" has no empty state; ⚠️ "View All" under Available Technicians is a dead `#` anchor |
| **New Job (company-sourced)** | 🆕 | Resolves `Q-18`. Same fields as the platform form + an inline technician picker |
| Active Jobs | ✏️ | Origin badge; no Company column; cancel action; transfer action. ⚠️ Real customer phone shown — open question post-masking |
| Incoming Jobs | ✏️ | Origin-gated actions (`JOB-010`). ⚠️ The assignment picker doesn't filter to eligible technicians |
| **Job Detail — financial resolution** | ➕ | Refund request/decision, dispute Settle/Lost, standalone Backcharge, control-gated Cancel |
| Technicians | ✅ | Read-only. Shows precise GPS (unlike Company Admin's page) |
| Live Map | ✅ | **Already fully built and matching `LOC-003`** — review as a reference implementation |
| Notifications | ✅ | |

### Technician mobile app — entirely unbuilt, nothing to diff against

Built forward from the BRDs alone. Higher-confidence than most web items **because** there is no legacy pattern pulling against the requirement — the client walked through this flow step by step.

| Screen | Notes |
|---|---|
| Job queue / home | Assigned jobs, most urgent first. Customer's stated problem framed as *unconfirmed*, not fact. |
| **Active job — guided stepper** | Accept/Reject → Call to confirm → Start Trip → **Confirm Arrival** (the single most important interaction: one deliberate tap that advances state *and* captures GPS) → Work In Progress → Completed/Cancelled |
| Call / Message customer | Masked only. **No phone-number field may exist anywhere on this surface** — true at the data layer, not just visually hidden. A 24-hour window indicator once the job closes. |
| Key/key-code request | VIN entry with a **search-existing-codes-first** step; generate-myself vs. request-from-company (which drives the expense tag) |
| Pricing, expenses, payment | Final price + authoritative description override; expense paid-by-me/paid-by-company toggle; payment method; a **live breakdown** as numbers are entered |
| Invoice decision | A single optional per-job toggle at the very end of close-out |
| Cancellation | Required reason + the Service Call Fee decision |
| Account / statement | Signed balance with directional copy ("You owe X" vs. "X owes you"); weekly figures; **strictly self-scoped — no navigation path to any other technician's data at all** |

### The customer payment page — the only customer-facing surface

One standalone mobile-web page (375px), no login, no navigation, six states. See §12.

---

## 19. The React prototype

### What it is

On 2026-08-27 the deliverable model changed: **stop producing Figma master prompts, build a real React project** in `frontend/` `[USER:2026-08-27]`. The user wants to click through the new/updated screens directly rather than hand prompts to Figma/Gemini.

This supersedes `CLAUDE.md`'s "this is not a codebase" framing **for the `frontend/` subtree only**. The rest of the workspace still governs what the UI must reflect.

### Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 (default palette — it already matches the design system) · React Router v7 · lucide-react (outline family) · clsx. In-memory mock data with a seeded PRNG. **No backend, no persistence, no API layer.**

```bash
cd frontend && npm install && npm run dev     # → http://localhost:5173
npm run build                                  # production build + typecheck
```

### Standing rules for this phase

1. **Use the established design system** — not an idealized generic UI kit
2. **Replicate the live product's actual component patterns**, per the audit files, which are the ground truth reference (not the deleted Figma screenshots)
3. **Scope discipline** — build only screens that are genuinely new or genuinely changed. Unaffected screens are lightweight nav placeholders for click-through realism.
4. **Role by role**, stopping for confirmation between roles
5. **Everything is a mock** — it should *feel* live (real navigation, responsive modals, realistic data) without wiring an API
6. **All business invariants still constrain the UI** — masked phones, disabled admin composers, no editable balances, Archive never Delete, guided status stepper
7. **`.claude/audit/gap-analysis.md` is the screen-selection source of truth**

### Ten fidelity corrections — standing rules

Learned the hard way across review passes; these apply to every future screen:

1. **Never grant a role CRUD it doesn't have.** Grep the matching audit file's "Permissions" and "CRUD actions tested" sections first. When a component serves both an interactive and a view-only role, make the callbacks optional and render read-only when omitted.
2. **Match the live field/column structure exactly** — column-for-column, field-for-field. If the audit says "full page, not a modal," build a full page. Depart only where a new requirement explicitly calls for it.
3. **New fields attach contextually**, not as a mystery column. Origin folds into the Job ID cell rather than becoming a top-level column.
4. **Chat is always its own route**, never embedded inline.
5. **Refund/dispute/backcharge each need a structured detail card**, not just a pill — plus their own timeline entries.
6. **Never render design-process artifacts** — no rule IDs, no `Q-nn`, no scope badges, no "this is fake" disclaimers. See §17.
7. **Use `AdvancedFilter`, not the older `FilterBar`**, for any new list screen.
8. **Read `.claude/audit/<role>/` before building a role.** Don't replicate confirmed live *bugs*, but don't silently normalize away a genuine inconsistency finding either.
9. **Check for sidebar nav prefix collisions** — `/jobs` vs `/jobs/create` both light up unless `end` is computed per item.
10. **Build multi-tenancy in from the start** of a company-scoped role, not after: no Company column on a single-company table, give the tenant its own creation flows, search-and-map pickers for company-owned resources, transfer actions alongside initial-assign actions, and tag owned sub-records with `companyId` from the moment the type is defined.
11. **`data/mock.ts` declaration order matters** — it is one sequentially-evaluated module. Referencing a `const` declared below code that runs earlier is a real TDZ `ReferenceError`, not a lint nit.

### What has shipped

**All four web roles are built.** Platform Admin (2026-08-27), Platform Dispatcher (2026-08-27), Company Dispatcher (2026-08-28), Company Admin (2026-08-28).

Key shared infrastructure:

| Component | Purpose |
|---|---|
| `components/ui/DataTable` | Sortable, paginated, `footerRow` totals |
| `components/ui/AdvancedFilter` | **Schema-driven**: `lib/autoFilter.ts` infers filter controls from the actual record shape (nested paths included) rather than per-page hand-picked fields. Modal-based grouped layout, quick-filter chips, applied-filter tokens, saved views persisted to localStorage. |
| `components/ui/ActionsMenu` | The one canonical kebab pattern, chosen over the live product's 5+ competing conventions |
| `components/ui/States` | Empty / NoResults / Loading / Error / PermissionDenied (`R02-3`) |
| `components/ui/MoneyAmount` | Signed direction indicator (`R02-6`) |
| `components/ui/NameLinks` | Single name → link; multiple → "N technicians" hover popover of individual links |
| `components/domain/JobsTable` | **One shared jobs table across every role** — pages pass only `jobs` and a `getActions(job)` callback. `showCompanyColumn` off for company-scoped roles. |
| `components/domain/StatusStepper` | Guided single-next-state control; read-only when callbacks are omitted |
| `components/domain/PricingBreakdown` | Itemized gross → expense → gateway fee → commission → dispatch fee → net |
| `components/domain/AssignTechnicianModal` | Search + List/Map toggle, `excludeTechnicianId` and `requireReason` props so the same component powers both assign and transfer |
| `components/domain/FinancialFlagDetail` | Per-type structured cards for refund / dispute / backcharge |
| `RefundRequestModal` · `RefundDecisionModal` · `DisputeResolutionModal` · `BackchargeModal` · `CancelJobModal` | The financial-resolution action set |
| `TwilioConfigCard` · `PaymentGatewaySettings` | Shared Settings-page blocks |

### Deliberate divergences from the live product, and why

| Divergence | Reason |
|---|---|
| Binary Now/Scheduled urgency, not Low/Med/High | Builds to the **resolved** `Q-05`, not the live state — §20 #3 |
| Canonical 7-step status flow; key-code sub-states folded into job fields | Reconciles the 12-value live enum — §20 #4 |
| Audit Log has **no** Delete row action | Documented design decision: tamper-evidence |
| Generic "Gateway 1/2/3" placeholders | `Q-03` unresolved — don't silently pick a set |
| Technician counts derived from one roster | **Fixes** the live 11/51/101 discrepancy by construction |
| `technicianName` absent for `new_job`/`assigned_to_company`/`company_refused` | Fixes a real mock-data bug where jobs in the Incoming queue showed an already-assigned technician |
| Guided, disabled-with-reason technician picker | Deliberately fixes the live unrestricted dropdown |
| Live Map is a schematic CSS panel, not Google Maps | No API key in the prototype. The live map is the reference implementation. |
| No cash payment path | §20 #1 — follows the user's direct correction |

### Not built

- The **Technician mobile app** — entirely unbuilt
- The **customer payment page** — specified (§12), not built
- **Company Wallet / Technician Ledger** were deliberately deferred pending the developer conversation about the existing broken 500 route
- Countries, Customers, Users, Notifications for Platform Admin are lightweight placeholders

---

## 20. Contradiction register

Every place the sources genuinely disagree. **This is the only section where a conflict is adjudicated** — every other section points here rather than restating both sides.

---

### ⚠️ #1 — Does cash payment exist at all? 🔴

| Source | Position |
|---|---|
| **Client written file** `[C:§Financial/PaymentCalc]` — *highest authority* | Cash is a **fully specified flow** with its own seven-step arithmetic, its own direction (technician owes the company), and its own tracked quantity (cash in hand). `FIN-W-004` is derived from it. The weekly statements name "total cash" and "cash collected" as required fields. The company report names "funds held by technicians." |
| **Designer, in-session** `[USER:2026-08-28]` | *"there is no cash payment. all are from the gateway."* |

**Why this matters more than any other conflict here:** cash is not a detail. It is one of the two directions the whole financial model is built around — *"the cash/card direction split is the organising idea"* of the finance BRD. Removing it deletes `FIN-W-004`, the cash-in-hand concept, half of the technician statement's fields, and the "funds held by technicians" report line.

**Current working state:** the prototype implements **no cash**. `PaymentMethod` is `'card' | 'payment_link' | 'unpaid'`. Reports collapsed to a single Revenue column for this reason.

**Precedence says the written client file wins.** The correction came from the designer mid-build, not from a re-read of the client file or a new client meeting.

**Action required:** confirm directly with the client. If cash is genuinely gone, `major-changes.txt`'s payment-calculation section, `FIN-W-004`, both statement field lists, and the company report field list are all stale and need re-issuing. If cash is not gone, the prototype needs a cash path restored. **Do not build both interpretations.**

---

### ⚠️ #2 — How far does tenant isolation actually go? 🔴

Three positions, in the order they were stated:

1. **`CLAUDE.md` / `[T:45]`** — Platform Admin "monitors everything," sees full job details including vehicle data and payments.
2. **`Q-06` / `AUD-001`** `[T2:32-34]` — the platform excludes only companies **fully self-sufficient on their own gateway *and* their own Twilio**, and only from the *audit log*. The gate is infrastructure, not origin.
3. **The designer, 2026-08-28**, framed as *the most important new requirement* `[USER:2026-08-28]` — *"no one else can see its own jobs and its own customers and its own revenue even the platform admin him self."* Full invisibility, regardless of gateway/Twilio status.

Position 3 is far broader than position 2 and directly contradicts position 1.

**Complicating history:** earlier in the same build the user said *"the platform user either admin or dispatcher can only see platform jobs, but not jobs company got themselves"* — then immediately said *"wait keep it"* about the **Jobs list** Origin badge/filter specifically, leaving Dashboard/Reports/CompanyDetail unresolved. The 2026-08-28 restatement is much more forceful and did not repeat that carve-out.

**Current working state: not retrofitted.** Platform Admin's Jobs/Dashboard/Reports/CompanyDetail and Platform Dispatcher's Job History/Dashboard **still mix both origins**.

**Action required:** settle scope explicitly before touching signed-off screens — which screens, and whether the Origin badge disappears entirely from platform-role screens once company-sourced jobs never appear there anyway. Then decide whether `AUD-001`'s narrower gateway/Twilio gate survives as a separate rule for the audit log specifically, or is absorbed.

---

### ⚠️ #3 — "Priority" is two different fields wearing one name 🟠

| Source | Position |
|---|---|
| **`Q-05`, resolved** `[T2:139-143]` | Priority is a **binary flag** — "Now" or "Scheduled" — with **no effect** on price, category, or which technician receives the job |
| **The live product** `[AUDIT:platform-dispatcher/new-job/new-job.md]` | A three-value **Low / Medium / High** dropdown, required on every intake, rendered as a colored pill everywhere, driving a dedicated "Urgent" dashboard counter keyed off `priority = 'high'` |

**The likely reading:** these are two different fields doing two different jobs, not one field to be redefined. The live job-creation form *also* has a separate **`Schedule At`** datetime field described as "Immediate ASAP vs Scheduled" — which maps far more closely to the client's Now/Scheduled concept than the priority scale does.

**Recommended handling** (from `design-plans/01-critical-findings-and-conflicts.md`, Finding 4): **keep** Low/Medium/High as an internal dispatch-urgency indicator — it's operationally useful and already wired into badges and counters — and **map** the client's Now/Scheduled concept onto the existing `Schedule At` field. **Do not silently collapse the 3-value field into the 2-value concept**; that would delete a working feature to satisfy a requirement describing something else.

**Current working state:** the prototype implements the **binary Now/Scheduled only**, on the grounds that this phase builds the new requirements rather than cloning the live product. That is a defensible choice but it is *not* the recommended handling above, and the two need reconciling.

**Action required:** a client/developer decision before any redesign touches job priority anywhere.

---

### ⚠️ #4 — The job status enum doesn't match the canonical flow 🟠

| Source | Position |
|---|---|
| **Client, `[T2:82-101]`** | A **7-step canonical flow**: Call intake → Assigned → Accepted/Rejected → Confirmed by call → Started → Arrived → Completed/Cancelled |
| **The live product** `[AUDIT:platform-admin/jobs/jobs.md]` | **12 distinct status values**: New Job · Assigned to Company · Company Refused · Assigned to Technician · Technician Refused · Technician On The Way · Technician Arrived · Work In Progress · **tech request code** · **company get code** · Completed · Cancelled |

**Two structural mismatches, not copy differences:**
1. **Two key-code states are modeled as top-level job statuses**, not as a separate Code Request sub-flow
2. **There is no explicit "Confirmed by call" state** live, even though the client walked through it as a real step

**Current working state:** the prototype implements the canonical flow as the primary state machine and folds the key-code sub-states into job-level fields.

**Action required:** does the canonical flow replace the live enum 1:1, fold the key-code states into a sub-flow, or coexist alongside it? This needs a developer conversation. **Do not silently pick one** — the guided status stepper cannot be finalized until it's settled.

---

### ⚠️ #5 — Two different "Commission" fields at two tenancy levels 🟡 (and it bears on 🔴 `Q-02`)

| Field | Level | Evidence |
|---|---|---|
| **Commission %** | Per **technician** | `[C:§Financial/CompanySettings]` — the company sets each technician's share. Confirmed live in the Edit Technician modal, pre-filled at 15.00% `[AUDIT:company-admin/technicians/technicians.md]` |
| **Commission** | Per **company** | A required free-text/number field on the live Add Company form `[AUDIT:platform-admin/companies/companies.md]`, which no requirement document describes |

The per-company field is **the strongest live evidence bearing on `Q-02`** (does the platform take a commission at all). A now-deleted live-system doc recorded its documented behavior as: *"Zero Commission Value — Company created with 0% commission → Platform logs 0 commission for platform on jobs handled by this company"* — about as direct as evidence gets that this is the platform's own cut.

**But:** the client's own written file lists "platform commission" without a rate or calculation, and the 2026-08-17 meeting **named no commission mechanism at all** `[T2:5-18]`. It's also possible this `commission_rate` is dead/legacy or means something else.

**Handling:** don't treat `Q-02` as closed, but **reserve space for a platform-commission line** on every platform financial screen rather than assuming zero. Never conflate the two commissions in design or copy — they are two different percentages at two different tenancy levels.

**Ask the client directly:** *"you already have a per-company Commission field on the Add Company form — is this the platform's cut? If so, where should it be visible?"*

---

### ⚠️ #6 — Which payment gateways? 🟡

| Source | Named |
|---|---|
| **Client written file** `[C:§Financial/PlatformWallet]` | Stripe · **Square** · Authorize.net |
| **Client, verbally** `[T2:148]` | Stripe · **PayPal** · Authorize.net |

Square replaced by PayPal, unprompted. A genuine self-contradiction from the same person at two different times — **not** a transcription artifact.

Also newly stated: **there is no hard cap of exactly three** — "two or three" was used loosely, with room to add more `[T2:151]`.

Separately, Stripe was named as the gateway that "runs all these operations" for the platform-provider wallet `[T2:18]`.

**Precedence says the written file wins** on the literal name list. **But do not silently pick one.** Use generic "Gateway 1/2/3" placeholders in any mockup until the client confirms the exact set **in writing**.

---

### ⚠️ #7 — Does the live map do proximity dispatch? 🟡

| Source | Position |
|---|---|
| **`ROL-010`** `[T:66-71]` | Assignment is filtered by **same-state and currently-free** only. *"Proximity is explicitly not used, because exact locations are unknown."* |
| **`design-plans/01-critical-findings-and-conflicts.md`, Finding 3** | Quotes a now-deleted live-system doc describing an explicit **"Proximity Dispatching via Map"** flow: *"Locates an unassigned job pin → Observes nearest green ('Available') technician pin → Dispatches technician to the nearby job."* |

**Important caveat on the evidence:** the document that quote came from (`.claude/docs/live-system/`) was **deleted from the repo** in commit `bfbad33`. The design-plans file still cites it via `[LIVE:...]` tags pointing at files that no longer exist on disk. Recoverable from git history, but treat every such claim as one step further from the source than its citation implies.

**The current, first-hand audit does not corroborate it.** The 2026-08 audit found the Assign Technician modal shows **no location or state data at all** `[AUDIT:company-dispatcher/incoming-jobs/incoming-jobs.md]`, and the Live Map's documented interactions are technician selection and a technician→job deep link — not a dispatch action `[AUDIT:company-dispatcher/live-map/live-map.md]`.

**Handling:** don't remove the map's proximity affordance and don't endorse it as the new source of truth either. Ask the client directly. Treat `ROL-010`'s text as provisional until answered.

**A milder relative of the same issue:** `LOC-002` says a job's location is recorded only on the arrival ping, but the map appears to plot job pins from creation — which would be consistent if the map shows a *geocoded approximate* pin pre-arrival and a *confirmed* pin post-arrival. Verify before treating `LOC-002` as either violated or already handled.

---

### ⚠️ #8 — Platform Dispatcher's undocumented Audit Log access 🟡

The live product gives Platform Dispatcher **full read access to the platform-wide, cross-company Audit Log**, via a normal sidebar nav item, showing the identical unscoped 1,660-page dataset Platform Admin sees. The only difference: no Delete row action `[AUDIT:platform-dispatcher/audit-log/audit-log.md]`.

**This is not listed as a capability of this role anywhere** — `CLAUDE.md`'s actors table assigns the audit log to Platform Admin only.

Intentional, or scope creep the redesign should correct? Ask rather than designing around either assumption.

---

### ⚠️ #9 — The existing "Paid By" field vs. the new Expense tag 🟡

| Field | Values | Question it answers |
|---|---|---|
| **Live** `Paid By` on Job Details pricing lines | `company` / `customer` | Who ultimately **bears** the line-item cost — the workshop or the end customer |
| **New** Expense tag (`FIN-W-013`) | `technician` / `company` | Who **fronted the cash** at job close-out |

These are different questions with different values. **Do not repurpose the existing field.** Design the new expense entry as an additional, separate tag, and make sure the job payment breakdown can show both distinctions without conflating them.

Needs developer confirmation on whether the live field is being repurposed or whether two distinct fields will coexist.

---

### ⚠️ #10 — `financialFlag` can't represent two concurrent tracks 🟡

`FinancialFlag` is a single coarse enum (`none | refund | dispute | backcharge`), but a single completed job can legitimately carry **both** a refund and a dispute over its lifetime — e.g. the company voluntarily refunds part of a charge, and separately the customer's bank later disputes the remainder. Nothing in the rules forbids it.

**Recommendation:** stop treating `financialFlag` as the source of truth. Derive any coarse "flagged" filter/badge from `refundDetail`/`disputeDetail` presence, and keep the detail objects as the actual state. Flagged as a design decision to confirm (`Q-25`), not silently made.

---

### ⚠️ #11 — Three different technician counts for one company 🟠

| Screen | Count |
|---|---|
| Company Admin → Technicians Management | **11** |
| Company Dispatcher → Technicians | **51** |
| Company Admin → Users (KPI tile) | **101** |

Same company, three screens, three numbers — roughly a 9× spread `[AUDIT:company-admin/technicians/technicians.md, company-admin/users/users.md, company-dispatcher/technicians/technicians.md]`.

Either one page is filtering by an invisible criterion, or there's a genuine counting/scoping bug. **Until resolved, no technician-count figure from any live screen should be trusted as a design reference.**

*(The prototype sidesteps this by deriving every count from one roster.)*

---

## 21. Open questions register

The agenda for the next client meeting, and the record of what the design cannot yet commit to. **IDs are never reused.** Every `[OPEN]` marker anywhere in this workspace points at an entry here.

### ✅ Resolved

| ID | Question | Answer |
|---|---|---|
| **Q-01** | What is a "wallet"? | A **derived transaction log / source of truth**, not an account with transferable balances. No peer transfers exist anywhere — an engineer proposed technician-to-technician transfers and the client rejected it outright. Weekly reset on the Sunday-midnight boundary `[T2:6-16]` → `FIN-W-012` |
| **Q-05** | Does priority affect price? | **No.** A binary Now/Scheduled flag only, with no effect on price, category, or technician assignment `[T2:141-143]`. ⚠️ But see §20 #3 |
| **Q-06** | Can the platform see company-sourced jobs? | Gated by **infrastructure self-sufficiency**, not job origin: a company running entirely on its own gateway *and* its own Twilio is excluded from the platform audit log `[T2:32-34]` → `AUD-001`. ⚠️ But see §20 #2 |
| **Q-07** | Delete, or archive? | **Archive**, age-gated (client's working figure: one year, admin-configurable). Periodic export before any purge satisfies the 2-year US legal-retrieval requirement. The state must read "Archived," never "Deleted" `[T2:63-77]` → `AUD-002` |
| **Q-09** | LockAccess Pro or JobixFlow? | **JobixFlow** — confirmed by direct observation of the live product's login title and every sidebar wordmark `[AUDIT:design-system/basics.md]` |
| **Q-10** | Who owns the Twilio number? | **Each company**, and it can change **at any time they choose** — not tied to a renewal cycle. Only logs are retained; records are not versioned against a number `[T2:143-146]`. *Not addressed: whether a company can hold more than one number concurrently.* |
| **Q-12** | Is there an invoicing feature? | **Yes**, narrowly scoped: the technician decides **per job**; the invoice carries the **company's name only**, no logo required, and the platform's branding never appears `[T2:205-210]` → `FIN-W-014`, `FIN-W-015` |
| **Q-15** | Who can issue a refund? | The **Company Dispatcher**, for the entire post-completion domain — refund request *and* decision, and dispute Settle/Lost. Both admin roles are **observers only**, audit-log visibility, no action buttons. No second approver `[USER:2026-08-28]` |
| **Q-16** | What is an "expense"? | A **job-tied operational cost only** (worked example: a $30 key code deducted from a $100 job before commission math), tagged by the technician at close-out as paid-by-me or paid-by-company. Not a general expense ledger `[T2:47-54]` → `FIN-W-013` |
| **Q-17** | Does the 24-hour session appear in chat? | **No** — a separate surface. The technician sends from inside the app; it lands as an ordinary SMS in the customer's native messaging app. Recordings live in Twilio; the platform stores a **link** `[T2:187-200]` |
| **Q-18** | Who does intake for company-sourced jobs? | The **Company Dispatcher**, using the same field set as the platform dispatcher plus an inline technician picker `[USER:2026-08-28]`. Note the provenance: a designer decision, not a client-confirmed answer from a transcript. |

### 🔴 Blocking

**Q-02 · Does the platform take a commission, and on what?**
Nothing in the 2026-08-17 meeting names a platform commission mechanism — the entire wallet discussion `[T2:5-18]` describes tracking and fee pass-through but never a platform cut, and the designer treated that as implicitly answering it `[T2:17]`. **That is not the same as the client disclaiming one**, and the written file still lists "platform commission" (عمولة المنصة) as a Platform Wallet component. A live per-company Commission field also exists (§20 #5). A real, unresolved conflict between the client's own written doc and their verbal account. **Do not close this from inference. Ask directly.**
*Blocks:* platform wallet, platform financial reports, company statement layout.

**Q-19 · Has the client ever approved the permission model?**
The 2026-08-17 meeting reconfirmed the org hierarchy and naming `[T2:25-29]` — structural corroboration, **not** sign-off on the fine-grained chat permission rules (`ROL-004`, `ROL-005`, `ROL-007`, `ROL-009`), which were never raised. The developer herself said parts of the model are her own authoring `[T:253]`. **Present the current model as an explicit proposal.**

### 🟠 Important

**Q-08 · What reports does the client actually want?**
*Partial.* Filtering requirements are confirmed (date presets + custom range; condition filters on customer/technician/dispatcher/payment method; strict no-cross-company and no-cross-technician visibility) `[T2:55-62]`. The report **set** itself is still the designer's to propose. Further blocked in practice by the Service Type data bug.

**Q-11 · Does the platform earn on company-sourced jobs?**
*Partial.* **No in-product mechanism exists today** — platform revenue from subscriptions is handled entirely outside the system (demo → manual deal → manual billing), with no billing screen or logic `[T2:35]`. The client is open to an in-product subscription feature once the base reaches ~50–100 companies, but that is future scope `[T2:36]`. Whether the platform takes anything from company-sourced *job revenue* depends on `Q-02`.

**Q-13 · How does a technician actually get paid?**
*Partial.* No formal approval step; settlement happens **off-platform** (in-person cash, Zelle, Cash App) and the platform only records a confirmed/collected mark `[T2:36-53]`. **Still unknown:** who performs that confirmation, and what happens when a technician's balance stays negative for multiple consecutive weeks.

**Q-20 · What is the Service Call Fee, and how is it assessed?**
*Partial.* The **mechanism** is now concrete `[USER:2026-08-28]` — the dispatcher manually enters a fee at cancellation and the system SMSs a payment link. **Still open:** whether every cancellation reason permits a fee or only some ("this reason or any other reason" reads as broad, not an exhaustive gate), and whether any calculation logic exists beyond manual entry. Also unresolved from `[T2:120-124]`: on a reassignment, whether the *original* technician still collects, which appears to depend on whether the customer already paid, tracked via free-text notes.

**Q-21 · What is the complete list of cancellation reasons?**
The client named three in passing and **explicitly promised the full list** via the project group chat — *"let me picture it for you and send it to you on the group"* `[T2:102]`. It has never arrived. Track this as a literal to-do: check the group chat and add a source entry the moment it lands. Prototype-unblocked by `Q-22`'s scope relaxation, but the business question stands.

**Q-22 · What are the refund request/rejection reason-code lists?**
The designer described picking a reason "from a list" for both the request and the rejection, but supplied neither list `[USER:2026-08-28]`. **Scope relaxed for the prototype** — a dev-authored placeholder set is explicitly authorized so the build isn't blocked. **This does not close the business question**; a real client-approved list is still needed before this leaves prototype status.

**Q-23 · What ledger types cover a dispute recovery and a backcharge reversal?**
**The single most consequential open point for the accountancy/reporting goal.** The client's type list has one dispute type, modeled as always-negative. A settled dispute needs money flowing back in, and a backcharge created on dispute-open needs reversing on settle. Neither direction exists. Needs either two new types (`dispute_recovery`, a reversal type) or a **defined** reuse of `adjustment`.
*Blocks:* Company Wallet, Financial Transactions ledger, and the weekly statements' backcharge lines.

**Q-24 · How does a dispute reach "Lost," and who marks it?**
The **role** half is resolved by `Q-15` (Company Dispatcher). **The trigger mechanism remains open**: manually marked, symmetric to Settled — or auto-detected when the evidence deadline passes with nothing submitted? `FIN-F-006`/`FIN-F-007` already define what happens financially once lost; what's missing is purely the mechanism that gets it there.

### 🟡 Clarifying

**Q-03 · Which payment gateways?** — see §20 #6.

**Q-04 · Keep the Country selector?** The country dropdown exists only because a UAE / Middle East branch was planned; Twilio's lack of UAE support meant jobs had to be tagged by country `[T:440-444]`. **That branch was cancelled** `[T:41]`. Confirm whether country stays and whether the platform is now US-only. Live, "Country" appears in **at least four** unrelated places (Company create top-level, Company business address, User edit, and the standalone Countries module), all drawing from the same placeholder seed list. Resolve centrally, not screen by screen. Blocks a clean answer on the legacy per-country Call/WhatsApp Provider config.

**Q-14 · Currency and locale.** Unaddressed in either meeting. Depends on `Q-04`.

**Q-25 · Can a resolved refund or dispute cycle reopen?** Can a `rejected` or already-`refunded` cycle reopen if the customer asks again on the same job? Can a `settled`/`lost` dispute reopen on a second chargeback attempt? Neither addressed. Lower urgency — an edge case, not the core flow. Related to §20 #10.

### Candidate questions not yet formally added

Surfaced by the 2026-08 audit and recommended for formal addition:

1. **Priority field collision** — see §20 #3
2. **Technician-count discrepancy** — see §20 #11
3. **Platform Dispatcher's undocumented Audit Log access** — see §20 #8
4. **Existing "Paid By" vs. the new Expense tag** — see §20 #9
5. **Company Dispatcher's real-customer-phone visibility** — does it survive the masking rollout, or does that role also become Twilio-only?
6. **VIN search on Key Codes** — described as core to the flow, but VIN isn't a visible column or search term. Wired but unadvertised, or genuinely absent?
7. **Legacy per-country Call/WhatsApp Provider config** — still read anywhere live, or a dead remnant?
8. **Job status enum reconciliation** — see §20 #4
9. **Should audit log entries be user-deletable at all?** A Delete row action exists despite tamper-evidence being the log's purpose.
10. **Should Platform Admin get a Customer detail view?** Platform Dispatcher's is materially richer, despite Platform Admin nominally having broader access.

### 📌 Translation debt

`open-questions.ar.md` — the Arabic client-facing counterpart — is **not** updated for the `Q-15` addendum or the new `Q-22`–`Q-25` entries. There is no genuine Arabic-source quote to cite for them: that input came from the designer directly in English. Back-translating an English paraphrase into Arabic would violate `Rule 00 · R00-6` by silently changing what the client said. **Tracked debt, not an oversight — flag it if this list goes into a client meeting.**

---

## 22. Live-system defect register

Found during the 2026-08 audit. **Out of design scope**, but they materially change what "current behavior" means, and several block design work downstream. Listed by priority.

| # | Severity | Defect | Design impact |
|---|---|---|---|
| 1 | 🔴 | **Technician Ledger crashes with a 500 on every job.** `/companies.admin/jobs/{id}/technician_ledger` — a live linked row action, reproducible on every job tested | The clearest evidence financial-ledger work has **already started** on the backend. Coordinate before designing Technician Account screens. Flag immediately, independent of any design timeline. |
| 2 | 🔴 | **The `service_types` table is seeded entirely with people's names**, not service categories — confirmed at the source on the dedicated admin page, not just as a downstream rendering artifact. Surfaces in **at least nine places**: Reports chart, New Job dropdown, Edit Job, technician "Skills" multi-select, Incoming Jobs filter, Active Jobs "Service" column, Company Admin dashboard, and more | A **functional blocker for job intake today**. Service Type cannot be used as a real report/filter dimension until fixed — which directly blocks the Reports overhaul's condition filters. |
| 3 | 🟠 | **Create User modal's Cancel button throws an uncaught `TypeError`** (`Cannot read properties of undefined (reading 'backdrop')`, Bootstrap modal bundle). Reproduced identically on Platform Admin's and Company Admin's modals — **one shared component bug** | Can silently break subsequent modal opens on the same page (stuck backdrop, non-scrolling body) |
| 4 | 🟠 | **Edit Job doesn't load the saved Priority value** — a job showing "High" on its card opens with "Low" pre-selected | A real **data-integrity risk**: would silently downgrade priority if saved without noticing |
| 5 | 🟠 | **`ReferenceError: $ is not defined` on every Edit Job page load** (Platform Dispatcher) — jQuery unavailable when an inline script runs | |
| 6 | 🟠 | **Three-way technician-count discrepancy** — 11 / 51 / 101 for the same company | See §20 #11. No live count is trustworthy as a design reference. |
| 7 | 🟠 | **Location display inconsistency** — Company Dispatcher's Technicians page shows precise live GPS; Company Admin's shows "Unknown Zone" for the same data | One page fails to surface data the other proves exists |
| 8 | 🟡 | **Call recording Play button is not functionally wired** — no player, no request, no error | Blocks knowing whether recording playback needs real implementation |
| 9 | 🟡 | **KPI / report week-over-week deltas are systemically broken** — `0%` / `+100%` / `-100%` regardless of underlying data; "Total Jobs (7 days): 0" against 1,051 real jobs. Appears on Dashboard **and** Reports for at least two roles | **One shared root cause**, not several issues |
| 10 | 🟡 | **Company Status includes a "Deleted" option** in at least 3 places | A single shared **enum** change, not three screen edits (§15) |
| 11 | 🟡 | **On an already-Approved Code Request, "Add Code" stays clickable** and shows no trace of the previously-recorded code/provider/cost | Display bug, or genuine gap? Needs a developer check |
| 12 | 🟡 | **"View All" under Available Technicians is a dead `#` anchor** (Company Dispatcher dashboard) | |
| 13 | 🟡 | **Select2 technician dropdown intercepts pointer events** after selection, blocking the modal's own Cancel button until Escape is pressed | May affect real dispatcher usage, not just the audit session |
| 14 | 🟡 | **Assorted copy bugs**: "LockT ype" (missing space) · Key Codes page heading still reads "All Code Requests" and its subtitle has a stray space · "Please select a customer first**1**" (stray digit, renders unconditionally) · "Schedule at" field shows placeholder "100" (a misconfigured date/time picker) · Login page title says "Super Admin Login" for every role · nav item reads "Customer" singular among plural siblings · blank Last Login cell instead of a "Never" placeholder · "Adding Code" modal's cost and Notes fields both show a code-format placeholder · mid-word line-wrap artifacts in the Location column | Individually trivial, collectively a polish pass |

---

## 23. Complete business-rule index

Every rule ID that exists anywhere in this workspace. IDs are **never renumbered or reused** (`Rule 00 · R00-7`). Where a rule is contested, the contradiction is named.

### `ROL` — Actors, roles and permissions

| ID | Rule | Source |
|---|---|---|
| `ROL-001` | Five actors exist: Platform Admin, Platform Dispatcher, Company Admin, Company Dispatcher, Technician. Four web dashboards plus one mobile app. | `[T:2, 15, 221]` |
| `ROL-002` | The platform has no direct channel to technicians. Technicians belong exclusively to their company. | `[T:28-30]` |
| `ROL-003` | The platform admin does not create jobs. Job creation belongs to the platform dispatcher. | `[T:45]` |
| `ROL-004` | The platform admin is read-only in chat — sees all, posts none. | `[T:49]` `[ASSUMPTION]` |
| `ROL-005` | The company admin is read-only in chat — sees all, posts none. | `[T:245]` `[ASSUMPTION]` |
| `ROL-006` | Technicians are created by the company admin, never by the company dispatcher. | `[T:78]` |
| `ROL-007` | Chat is permitted only between the four listed pairs. | `[T:227-250]` `[ASSUMPTION]` |
| `ROL-008` | The technician receives only data the system explicitly pushes to the app; customer contact details are withheld by design. | `[T:456-459]` |
| `ROL-009` | Only the company admin can access call recordings. | `[T:542]` |
| `ROL-010` | Technician assignment is filtered by same-state and currently-free. Proximity is not a criterion. ⚠️ §20 #7 | `[T:66-71]` |
| `ROL-011` | Platform users (admins and dispatchers) are created by the platform admin only. | `[T:289]` |
| `ROL-012` | The company admin obtains key codes; the technician requests them. | `[T:280-285]` |

### `JOB` — Jobs and lifecycle

| ID | Rule | Source |
|---|---|---|
| `JOB-001` | Job intake is by telephone only — no customer app, portal, or self-service form. | `[T:50-51]` |
| `JOB-002` | The technician's field description and final price are authoritative, overriding the customer's original account. | `[T:102-133]` |
| *`JOB-003`* | **Never defined.** The number is not in use anywhere. | — |
| `JOB-004` | The job address is free text captured from the phone call — never a customer-supplied geolocation. | `[T2:92-93]` |
| `JOB-005` | The job status/state machine is fixed and identical for every company; not configurable per company, per dashboard, or by any admin role. | `[T2:82]` |
| `JOB-006` | A job that has entered the system must run to completion or receive an explicit cancellation with a stated reason — never simply deleted mid-flight. | `[T2:72-75]` |
| `JOB-007` | Arrival is confirmed manually by the technician; that single action also captures the GPS used as the job's recorded location. GPS-only automatic detection is explicitly rejected. | `[T2:89-101]` |
| `JOB-008` | Only "Cancelled" and "Completed" close a job. Any other status update is informational. | `[T2:115-119]` |
| `JOB-009` | Every job cancellation requires a recorded reason before the cancellation completes. | `[T2:112-113]` |
| `JOB-010` *(proposed)* | Intake actions are gated by **origin** as well as status: a platform-sourced job at `assigned_to_company` offers Accept & Assign / Refuse; a company-sourced job offers Assign to Technician only. A company can never refuse its own job. | `[USER:2026-08-28]` |
| `JOB-011` *(proposed)* | Cancel is gated by actual control: `canCancel = !terminalStatus && !canAcceptOrRefuse`. Once accepted, control is shared between the company dispatcher and the originating platform dispatcher. | `[USER:2026-08-28]` |

### `TEN` — Tenancy

| ID | Rule | Source |
|---|---|---|
| `TEN-001` | Every job carries an origin — platform-sourced or company-sourced — and it is never absent. | `[T:172-176]` |
| `TEN-002` | Company data is fully isolated. No company may see another's jobs, customers, technicians or finances, in any view including search results, exports and aggregate counts. ⚠️ scope contested, §20 #2 | `[C:§Financial/Overview]` |

### `COM` — Communications

| ID | Rule | Source |
|---|---|---|
| `COM-001` | The technician **never** sees the customer's real phone number, in any screen, notification, export or report. | `[C:§Twilio]` |
| `COM-002` | The customer **never** sees the technician's real number; they see the Twilio number only. | `[C:§Twilio]` |
| `COM-003` | The technician originates calls and SMS **only from inside the app**, never by dialling directly. | `[C:§Twilio]` |
| `COM-004` | The masked binding stays live for 24 hours after a job closes or is cancelled, then is disabled — and follows **whichever technician currently holds the job**, not the original assignee. | `[C:§Twilio]`, `[T2:129]` |
| `COM-005` | An inbound call or message with no active job routes to dispatch, never to a technician — the company dispatcher for a company-linked job, or back to the platform for a platform-sourced job. | `[C:§Twilio]`, `[T2:131-137]` |

### `LOC` — Location

| ID | Rule | Source |
|---|---|---|
| *`LOC-001`* | **Never defined.** The number is not in use anywhere. | — |
| `LOC-002` | A job's location is recorded **only** when the technician pings on arrival. | `[T:86-101]` |
| `LOC-003` | The map carries exactly **two layers**: live technicians and pinned jobs. | `[T:86-101]` |

### `FIN-W` — Wallets and payments

| ID | Rule | Source |
|---|---|---|
| `FIN-W-001` | Three financial levels exist: Platform Wallet, Company Wallet, Technician Account. | `[C:§Financial/Overview]` |
| `FIN-W-002` | The platform wallet covers only companies using the platform's gateway. A company on its own gateway has no money represented in it. | `[C:§Financial/PlatformWallet]` |
| `FIN-W-003` | Company financial data is fully isolated; no company can see another's. | `[C:§Financial/CompanyWallet]` |
| `FIN-W-004` | On cash payment the technician retains the money, and the system records cash-in-hand owed to the company. ⚠️ **contested — §20 #1** | `[C:§Financial/PaymentCalc]` |
| `FIN-W-005` | On card payment funds enter the company wallet, and the system records net dues owed to the technician. | `[C:§Financial/PaymentCalc]` |
| `FIN-W-006` | Deduction order on card is fixed: job-tied expense → gateway fee → commission → dispatch fee. | `[C:§Financial/PaymentCalc]`, `[T2:50-54]` |
| `FIN-W-007` | A company with no configured gateway falls back to the platform's gateway. | `[T:184]` |
| `FIN-W-008` | A company may configure multiple gateways (two or three to start, no hard cap) with independent, company-obtained credentials — not a platform-mediated marketplace. | `[T:218]`, `[T2:151, 157]` |
| `FIN-W-009` | The technician account is scoped to one company and shows no platform-level data. | `[C:§Financial/TechnicianAccount]` |
| `FIN-W-010` | A technician's final balance is signed — it may be owed to them or by them. | `[C:§Financial/TechnicianAccount]` |
| `FIN-W-011` | The payment link is delivered to the customer's mobile and is the only customer-facing surface in the product. | `[T:182]` |
| `FIN-W-012` | A wallet is a derived transaction log, never a movable-funds account; no technician-to-technician or peer transfer exists anywhere. | `[T2:6-16]` |
| `FIN-W-013` | A job-tied expense is deducted from the job's gross **before any other deduction**, and is tagged paid-by-technician or paid-by-company. | `[T2:50-52]` |
| `FIN-W-014` | Sending an invoice for a job is the **technician's per-job decision**, not automatic. | `[T2:205]` |
| `FIN-W-015` | Every invoice carries the **company's name only** — never the platform's name, logo or branding. | `[T2:206-210]` |
| `FIN-W-016` | Each company holds its own gateway and Twilio API credentials directly with the provider; the platform performs the connection but never re-sells or co-signs access. | `[T2:157]` |

### `FIN-F` — Fees and disputes

| ID | Rule | Source |
|---|---|---|
| *`FIN-F-001`* | **Never defined.** Referenced nowhere; the number is unused. | — |
| `FIN-F-002` | **Every deduction is its own transaction record** — never folded into another amount. | `[C:§Financial/Fees]` |
| `FIN-F-003` | Every dispute links to **Job + Invoice + Payment + Technician** — all four, always. | `[C:§Financial/Disputes]` |
| `FIN-F-004` | A frozen or held amount is a **distinct state** from either debited or available. | `[C:§Financial/Disputes]` |
| *`FIN-F-005`* | **Never defined.** Referenced nowhere; the number is unused. | — |
| `FIN-F-006` | On a **lost** dispute the technician bears **only their commission share**. | `[C:§Financial/Disputes]` |
| `FIN-F-007` | On a **lost** dispute the dispatch fee and gateway fee are **never returned** to the technician — they are consumed operating costs. | `[C:§Financial/Disputes]` |

### `FIN-S` — Statements and ledger

| ID | Rule | Source |
|---|---|---|
| `FIN-S-001` | The financial week runs **Monday 00:00 → Sunday 23:59**. | `[C:§Financial/WeeklyCycle]` |
| `FIN-S-002` | A job is counted in the week it **completed**, not the week it was created. | `[C:§Financial/WeeklyCycle]` |
| `FIN-S-003` | **Balances are never edited manually.** Every financial event appends a new row to the transactions ledger. | `[C:§Financial/Transactions]` |

### `AUD` — Audit and retention

| ID | Rule | Source |
|---|---|---|
| `AUD-001` | The audit log certifies operations conducted **through the platform's own infrastructure**. A company running entirely on its own payment gateway *and* its own Twilio subscription is excluded. | `[T2:32-34]` |
| `AUD-002` | Live operational and financial data is **not hard-deleted**. Delete becomes **Archive**, gated by a minimum record age (working figure: one year, admin-configurable). Periodic full export before any purge satisfies the 2-year US retrieval requirement. The state must read **"Archived," never "Deleted."** | `[T2:63-77]` |

### Unpopulated namespaces

`Rule 00 · R00-7` declares these namespaces, but **no rules have been written under them**:

| Namespace | Intended scope | Status |
|---|---|---|
| `KEY` | Key codes and code requests | No rules — the domain is covered narratively (§7) but never formalized |
| `RPT` | Reports | No rules — coverage is thin by design (`Q-08` is the designer's to propose) |
| `SET` | Settings | No rules — settings requirements live inside `FIN-W-008`/`FIN-W-016` and `AUD-002` instead |

### One invariant with no ID yet

> A **refund** (company-initiated goodwill) and a **dispute/chargeback** (bank-initiated) are **distinct mechanisms** and must be tracked as distinct job states, never merged. `[T2:159-169]`

Listed in `.claude/rules/01-business-invariants.md` under the Money heading but never assigned a `FIN-F-nnn` number. **Recommend assigning it `FIN-F-008`** on the next rules pass.

---

## 24. Sources, provenance and precedence

### The catalog

| Date | Source | Tag | Authority | Covers |
|---|---|---|---|---|
| ≤ 2026-08-05 | `client/features/major-changes.txt` (copy at `.claude/docs/sources/2026-08-05-client-major-changes/`) | `[C:§…]` | **Highest** | Twilio masked calls & SMS; the complete financial system |
| 2026-08-17 | `.claude/docs/sources/2026-08-17-client-followup/` | `[T2:<line>]` | High — direct client meeting | Wallet definition, audit-log scope, delete/archive, the job state machine, priority, Twilio lifecycle, gateways, refunds vs. disputes, expenses, invoicing |
| 2026-08-05 | `.claude/docs/sources/2026-08-05-developer-handover/` | `[T:<line>]` | Medium — the developer's account | Current system behavior, all four dashboards, job lifecycle, roles |
| 2026-08 | `.claude/audit/` — 47 files, 88 screenshots, all four web roles mapped live via browser | `[AUDIT:<path>]` | Behavioral evidence of the current build | What the product actually does today |
| 2026-08-27/28 | The designer, in-session | `[USER:2026-08-28]` | High for project direction | Tenant isolation, company-sourced intake, cancel gating, refund/dispute model, no-cash correction |
| — | `figma-current/` — **removed from repo** | `[FIG:<screen>]` | Visual only | The distilled palette/component summary in `CLAUDE.md` is what survives |
| 2026-08-20→23 | `.claude/docs/live-system/` — **removed from repo** | `[LIVE:<path>]` | Behavioral, but no longer verifiable in-repo | Superseded by `.claude/audit/` |

### The two removals, and why they matter

**`figma-current/`** held **nine sample screens** supplied to infer the visual design system. It was never an inventory of the current build and carried no information about what exists. That limitation **outlives the folder**: no document may claim a screen exists, is missing, or is incomplete on the basis of these now-gone files, nor on the basis of the summary that survives in `CLAUDE.md`.

**`.claude/docs/live-system/`** is the more consequential removal. Commit `b65fba0` (2026-08-20) added a genuine screen-by-screen audit of the *actual running build* — real field names, edge-case behavior, and data-model hints (an existing Commission % field on Add Company, a `Paid By: company/customer` cost field, a live proximity-dispatch map flow). Commit `bfbad33` (2026-08-23) **deleted the entire folder**, screenshots included.

Unlike the Figma removal, this was **not accounted for elsewhere**: `design-plans/00-overview.md` and `design-plans/01-critical-findings-and-conflicts.md` were built by diffing the BRDs against this audit and **still cite it via `[LIVE:<path>]` tags pointing at files that no longer exist on disk**. The content is recoverable from git history (`git show b65fba0:.claude/docs/live-system/<path>`), so nothing is lost — but until it's restored or the citing files are re-verified, **treat every `[LIVE:...]` claim in `design-plans/01-critical-findings-and-conflicts.md` as one step further from the source than its citation implies**. This applies specifically to the six numbered findings there, including the `Q-02` commission evidence and the `ROL-010` proximity contradiction (§20 #5, §20 #7).

`.claude/audit/` (2026-08, 47 files, 88 screenshots) is the current, first-hand, in-repo replacement and should be preferred wherever the two overlap.

### Reliability caveats per source

**The client's written file** is unusually specific for a client document — the financial section is close to specification-grade, naming exact fee defaults, dispute win/loss outcomes, weekly cycle boundaries, and a required transaction-record schema. Where it is detailed, be detailed. Where it is silent, no amount of transcript reading substitutes.
- ⚠️ **The Twilio section appears twice**, byte-for-byte at lines 1–37 and again at 305–341, differing only in bullet glyphs. **Cite the first occurrence.**
- Silent on the platform's commercial terms — lists "platform commission" but never a rate or calculation.
- Silent on all non-financial UI: chat, notifications, the map, key codes, the audit log, reporting screens.
- Uses "wallet" without defining it — the single largest ambiguity in the project, since resolved.

**The 2026-08-17 client follow-up** has already been through a transcript-correction pass. Still auto-transcribed colloquial Arabic with **no speaker diarization** — turn boundaries are inferred from content (short acknowledgements are almost always the designer; long explanatory answers are the client). Line 173 is a garbled fragment, likely "link" mis-transcribed; treat as `[ASSUMPTION]` if ever cited. **Two topics were explicitly deferred to a follow-up group-chat message that never arrived**: the full cancellation-reason list, and dispute-evidence specifics via the provider's API docs. Their absence is a promised-but-undelivered artifact, not a gap in the client's intent.

**The 2026-08-05 developer handover** is the only account of current behavior in the source set, and the most fragile. Auto-transcribed colloquial Egyptian Arabic, frequent word-level errors, inconsistent transliteration ("ديسباتشر / دسباتشر / تسباتش" all mean dispatcher). **No speaker labels.** Severe corruption at lines 246, 271, 277, 339, 528, 555 and others. Much of the walkthrough refers to on-screen content never named aloud. And **the developer speculates** — at `[T:253]` she states outright that parts of the permission model are her own invention.
- **Lines 349–411 and scattered remarks elsewhere are an extended technical argument** (Blade vs. React, native JavaScript, code-level component reuse, database design, server storage costs). **Ignore all of it** — one exception: the agreement that the designer builds a single reusable Filter/DataTable/Actions component in Figma, which is a design deliverable and squarely in scope.
- **Lines 581–602** are off-topic discussion of the developer's own AI workflow. Ignore entirely.

**Media not copied:** `recorded_meetings/2026-08-05 17_17/` retains `video.mp4` and `audio.m4a`. Only the transcript was copied. The recording is worth revisiting for the passages flagged as corrupted and for the screen-share segments where on-screen content was described but never named.

### Adding a new source

1. Create `.claude/docs/sources/<YYYY-MM-DD>-<short-slug>/`
2. Copy text material in; leave large media at its origin and note where it lives
3. Write a `NOTES.md` — what it is, what it covers, how far to trust it, a section map
4. Add a row to the catalog with its citation tag
5. **Re-check affected modules and the registers** — a new source may close an open question *or open a new contradiction*. Re-check, don't only append.

### Language rules

Deliverables are in **English**. Sources are Arabic and are **never rewritten or translated in place** — cite them by line or section. Preserve the original Arabic term in parentheses where a translation is genuinely ambiguous or where the developer and client use a specific word.

**Exception — client-facing artifacts.** Anything taken into a meeting with the client or developer gets an Arabic counterpart named `<file>.ar.md`. Currently: `open-questions.ar.md`, plus Arabic counterparts of all three rules files.

Rules for a `.ar.md` counterpart:
- **IDs are identical** across both versions. Answering `Q-02` means updating `Q-02` in both files, never one alone.
- **Quote the sources in their original Arabic**, verbatim. **Never back-translate an English paraphrase into Arabic** — it silently changes what the client said.
- It is a **parallel deliverable, not a translation artifact**. Keep it in sync.

See the translation debt note at the end of §21.

---

## 25. Test accounts and environments

**Live system:** `https://jobixflow.com` — one login form for every role at `/` and `/login`; the backend routes by role.
**Global password for every seed account:** `12345678`

| Role | Company | Name | Email | Lands on |
|---|---|---|---|---|
| Platform Admin | Platform | Emily Zboncak II | `hickle.deon@example.com` | `/platform` |
| Platform Dispatcher | Platform | Kailee Reichel | `emanuel05@example.com` | `/platform.dispatcher` |
| Company Admin | Company 1 | Mr. Colten Gorczany | `uparker@example.net` | `/companies.admin` |
| Company Dispatcher | Company 1 | Mrs. Andreane Kunze V | `haven.hirthe@example.org` | `/companies.dispatcher` |
| Technician | Company 1 | Eldora Zulauf | `kyla.dach@example.net` | ❌ **web blocked** — *"This account can only access the mobile application"* |
| Company Admin | Company 2 | Dr. Royce Jaskolski | `isom67@example.net` | `/companies.admin` |
| Company Dispatcher | Company 2 | Dr. Chauncey Kertzmann DVM | `paucek.nathanael@example.net` | `/companies.dispatcher` |
| Technician | Company 2 | Mr. Michael Tillman I | `sjerde@example.org` | ❌ web blocked |

**Seed data scale** (useful for judging whether a design holds at volume): 5 companies · 1,051 jobs · 151 pages of customers · 1,660 pages of audit-log entries platform-wide (31 pages for Company 1) · 6 platform users · 123 Company 1 users · 25 call logs for Company 1 · 29 pages of code requests · 8 pages of service types.

The full roster of all 30 seed users with their unique IDs and phone numbers is in `.claude/docs/test-users.md`.

**The prototype:** `cd frontend && npm run dev` → `http://localhost:5173`. No login — it lands directly on `/platform-admin`, and role switching is by URL (`/platform-dispatcher`, `/company-admin`, `/company-dispatcher`).

---

## 26. Maintaining this document

### What this file is, and is not

**It is** the consolidated answer to "what do we know about this business and this project." It is derived from every other document in the workspace and is meant to make opening those documents unnecessary for day-to-day work.

**It is not** a replacement for the source-of-record files where those are living deliverables:

| Living file | Why it stays authoritative |
|---|---|
| `.claude/docs/open-questions.md` (+ `.ar.md`) | The **agenda for the client meeting**. §21 here is a synchronized snapshot; that file is what gets updated when a question is answered, and it has the Arabic counterpart obligation. |
| `.claude/rules/*.md` (+ `.ar.md`) | The enforceable rule text. §23 here indexes them; those files are what a design gets checked against. |
| `.claude/docs/sources/**` | The raw material. Never edited. |
| `client/features/major-changes.txt` | The client's own words. Never rewritten. |
| `.claude/audit/**` | First-hand evidence of the current build. Never revised after the fact. |

### When to update this file

- **A new source arrives** → follow §24's procedure first, then re-check §20, §21, §23 here rather than only appending to a section
- **An open question is answered** → update `open-questions.md`, its Arabic counterpart, **and** §21 here. If the answer resolves a contradiction, move the §20 entry to resolved with the answer recorded.
- **A contradiction is settled** → §20 is the only place the resolution is written. Every other section points here.
- **A new business rule is agreed** → add it to `.claude/rules/01-business-invariants.md` (both languages) **and** §23 here, with a new never-reused ID from its namespace
- **A live defect is fixed** → strike it in §22 rather than deleting it; the register is also the record of what "current behavior" meant at a point in time

### The five discipline rules that govern every edit

1. **Provenance is mandatory.** An untagged non-obvious claim is treated as fabrication and removed on review.
2. **Do not fill gaps.** Source depth is genuinely uneven — the financial text is specification-grade; chat, the map, key codes and the audit log survive only as fragments of lossy speech. **Write to the depth the sources support and no further.** A thin section is a finding, not a failure; padding it converts invention into apparent fact.
3. **Never assert build coverage.** Screen inventories are derived **forward** from requirements. Current coverage stays *unverified* until confirmed against the real Figma file or the live dashboards. `[AUDIT:]` evidence says what a screen *did* on a given day, never that a requirement is satisfied.
4. **Separate what is from what is asked for.** The client is buying a change to an existing system; conflating current behavior with requested change makes it impossible to scope, and impossible to tell the developer what is new.
5. **Never resolve a conflict silently.** Record both readings, name the governing precedence, and put it in §20.

---

*Last consolidated: 2026-08-28.*
