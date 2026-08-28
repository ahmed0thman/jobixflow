# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **📖 [`.claude/docs/MASTER.md`](.claude/docs/MASTER.md) is the consolidated source of truth** for the JobixFlow business and this project — every actor, rule, flow, financial model, screen, contradiction, open question and live defect in one file, with a table of contents. Read it first for any question about *what the business is* or *what has been decided*. This file (CLAUDE.md) remains the guidance on *how to work here*, and the files under `.claude/rules/`, `.claude/docs/open-questions.md` and `.claude/docs/sources/` remain the authoritative living records that MASTER.md is derived from — see MASTER.md §26 for which file to update when something changes.

## What this workspace is

This is **not a codebase**. There is no build, lint, or test step, and no git repo. It is a **UI/UX design workspace** for JobixFlow — a multi-tenant dispatch platform for automotive locksmith / lockout services operating in the US.

The user is the **UI/UX designer** on the project. They did not build the existing system; they inherited it and met the full-stack developer (Eng. Zeinab) to have the current state explained. Their job is to design the **new features the client requested**. Final UI is produced in Figma or Gemini from **master prompts written here**.

Deliverables are documents and prompts, not code:

| Directory | Purpose |
|---|---|
| `BRDs/` | Business requirement documents — the organized, English-language business logic |
| `design-plans/` | Screen inventories, flows, IA, component specs, state matrices |
| `design-prompts/` | Master prompts fed to Figma / Gemini to generate the actual UI |
| `client/features/` | Raw client requirements (input, do not rewrite) |
| `recorded_meetings/<date>/` | Meeting transcripts, audio, video (input, do not rewrite) |

## Source material and its precedence

1. **`client/features/major-changes.txt`** — the client's own written requirements (Arabic). This is the **highest-authority** statement of what to build. Covers the Twilio masked-calling system and the full financial system.
2. **`recorded_meetings/2026-08-05 17_17/transcript.txt`** — 600 lines of colloquial Egyptian Arabic, auto-transcribed and noisy. This is the only explanation of **how the existing system works today**. Speaker labels are absent; the developer describes screens, the designer asks probing questions.
3. **The "Design system" section below** — distilled from nine screenshots of the existing Figma file that were originally kept in a `figma-current/` folder. That folder has since been **removed from the repo**; the section below is what survives of it and remains the source of truth for the **visual design system** until re-confirmed against the live Figma file.

Sources are Arabic; deliverables should be **English** unless the user asks otherwise. The transcript is lossy — never quote it as precise spec; treat contradictions as open questions rather than resolving them silently.

## Scope discipline

The transcript contains a long technical argument (Blade vs React, native JS, component reusability at the code level, database design, server storage). **All of that is out of the user's role and must be ignored** — with one exception:

> The agreement that the designer will build a **single reusable Filter / DataTable / Actions component in Figma**, containing every variant, state, and permutation, used across all screens so a change happens in one place. This is a **design deliverable** and is in scope. The developer showed a precedent for this in their own Figma library.

## Business domain

### Actors and dashboards

Four web dashboards plus one technician mobile app:

| Actor | Can do | Cannot do |
|---|---|---|
| **Platform Admin** | Adds companies, monitors everything, sees full job details incl. vehicle data & payments, audit log, users | Does not create jobs; **read-only in chat** |
| **Platform Dispatcher** | Receives customer phone calls, creates the job, enters customer data, sets preliminary price & priority, assigns job to a company | Does not add companies or technicians |
| **Company Admin** | Adds technicians, handles Code Requests (buys key codes from providers, logs provider + cost), sees vehicle data, call recordings, company settings | **Read-only in chat** — sees all messages, posts none |
| **Company Dispatcher** | Assigns job to a technician, monitors on map, chats | Does not add technicians |
| **Technician** (mobile app) | Travels, sends location, writes the *real* problem description, sets the **final** price, uploads photos & ownership docs, requests key codes, collects payment | **Never sees the customer's real phone number** |

Chat is **per job**. Allowed pairs: technician ↔ company dispatcher; company dispatcher ↔ the platform dispatcher who created that job; company dispatcher ↔ other dispatchers in the same company (shift handover). Both admins observe only.

### The job lifecycle (existing system)

1. Customer **phones** the platform. There is no customer app, form, or portal.
2. Platform dispatcher creates the job: picks an existing customer by phone number or adds a new one; enters address as **free text** (no geolocation — it's spoken over the phone), country, service type, **preliminary** price, priority.
3. Dispatcher assigns the job to a company in the customer's state. Company receives a notification.
4. Company dispatcher assigns a technician. Selection criteria: technician is in the **same state** and is **currently free** (not on another job). Proximity is not used — nobody knows exact locations.
5. Technician's app tracks their **live location continuously** from acceptance onward.
6. On arrival the technician **sends a location ping**, which becomes the job's recorded location. The map has **two layers**: technicians (live) and jobs (pinned on arrival). The system compares the technician's GPS against the dispatcher-typed address.
7. Technician inspects and overwrites the customer's account of the problem — **the technician's description and final price are authoritative**. Uploads photos and vehicle-ownership documents.
8. Resolution requires a **physical key**, a **key code**, or both:
   - **Key code** = electronic code obtained from the vehicle manufacturer or an authorized provider, using the **VIN / chassis number** the technician reads off the car, plus make, model, year.
   - Technician either generates it on their own device (**technician bore the cost**) or requests it from the company (**company bore the cost**).
   - Physical keys are paid for out of the technician's pocket.
9. Payment. Jobs are expected to complete **within 24 hours** — these are roadside lockouts, not repairs.

### Key Codes & Code Requests

- **Code Requests** (Company Admin): technician asks → company sources the code → logs **provider**, **cost**, notes → sends code to technician.
- **Key Codes**: a searchable history of every code ever obtained. Before buying a new code, the technician searches by **VIN** and retries an old code for the same vehicle; if it fails it is marked **invalid** and a new one is requested. Column *User Obtained* records whether a technician or the company admin acquired it.

### Audit Log

Records CRUD actions across the platform and companies — but **not unconditionally every company action** (confirmed 2026-08-17, see `Q-06`): it certifies operations conducted through the platform's own infrastructure, and excludes anything a company does entirely on its own payment gateway and its own Twilio number, out of respect for that company's independent standing. Today it is missing a **company** column and a **user-type** column, and offers only one global search box. It will reach millions of rows, so it needs dedicated per-column filtering plus date ranges — this was the concrete example the designer used to justify the reusable filter component.

## The new requirements

The summary below is a quick-reference snapshot. For a fully-cited trace of every new requirement — with source tags, rule IDs, and open-question status per item — see [`.claude/docs/NEW-REQUIREMENTS.md`](.claude/docs/NEW-REQUIREMENTS.md). Any task that only needs the new requirements can read that file alone, without pulling in the rest of this file.

### 1. Multi-tenancy — companies get their own book of business

Companies may now add **their own customers and their own jobs**, sourced outside the platform (people who already called the workshop directly). Every job therefore has an **origin**: platform-sourced or company-sourced. Financials and reports must separate the two. The company gets its own admin dashboard for this. The platform's value proposition is monitoring, organization, and financial control — not lead generation.

### 2. Twilio masked calling and SMS

- On job creation, bind: real customer number + real technician number + a **Twilio proxy number** + Job ID.
- Technician calls **only from inside the app**. Customer sees the Twilio number.
- Customer calling the Twilio number back is routed to the assigned technician; the technician sees the **Twilio number, never the customer's**.
- No active job → route to dispatch.
- Binding survives **24 hours** after job close/cancel, then is disabled.
- SMS follows identical rules on the same number.
- **Each company supplies its own Twilio number and subscription** — the platform does not issue it, and it can change when the subscription changes. Call recordings are per company.

### 3. Financial system

Three levels: **Platform Wallet**, **Company Wallet**, **Technician Account**. Company data is fully isolated; no company can see another's.

- **Platform Wallet** — only for companies using the *platform's* gateway. Holds customer payments, platform commission, gateway fees, refunds, disputes/chargebacks, company balances, transfers to companies. Companies on their own gateway never appear here.
- **Company Wallet** — card payments, refunds, disputes, expenses, technician payouts, adjustments, reports. **Expenses** (confirmed 2026-08-17) are job-tied operational costs only — e.g. a key or key-code purchase — deducted from a job's gross before commission math, and tagged by the technician as paid-by-technician or paid-by-company at job close-out. Not a general business-expense ledger.
- **Technician Account** — completed jobs, commission %, cash received, card earnings, dispatch fees, gateway fees, deductions, backcharges, amounts received from the company, final balance (owed to or by).

**Payment math**

- *Cash*: technician keeps the money → compute technician commission → deduct dispatch fee → remainder is owed to the company → record cash-in-hand pending handover.
- *Card*: money lands in the company wallet → deduct gateway fee → compute technician commission → deduct dispatch fee → record net payable to technician.

Per-job fees: dispatch fee, gateway fee (**default 3%, editable**), other deductions. **Every deduction is its own transaction record.**

**Company settings**: commission % per technician, dispatch fee, gateway fee, gateway selection, and whether to use the platform gateway or their own. Up to **three gateways** (Stripe, Square, Authorize.net) — three sets of API credentials. A company with no gateway falls back to the platform's.

**Refunds vs. disputes/chargebacks** (distinguished 2026-08-17) — a **refund** is informal: the customer calls with a complaint, and the company voluntarily returns money (full or partial) as a goodwill gesture, decided verbally with no described request form. A **dispute/chargeback** is bank-initiated: the customer's bank reverses the charge, the company is notified through the payment gateway's own dispute API, and gets a window (client estimate: 30–60 days, unconfirmed) to submit evidence. These are distinct mechanisms and must be tracked as distinct job states.

**Invoicing** (confirmed 2026-08-17, previously an open question) — a real, narrow feature: the **technician decides per job** whether to send an invoice at all. Every invoice is issued under the **company's own name**, never the platform's — no logo required, just the company name, and the platform's branding never appears on it.

**Service Call Fee** (new, 2026-08-17) — a standalone charge, separate from the job price/dispatch fee/gateway fee, covering a technician's wasted trip when a dispatched job doesn't reach completion (customer resolved it themselves, refused to pay, or the job got reassigned mid-trip). There is no legal mechanism to compel payment if the customer refuses. Calculation and assessment mechanics are still unconfirmed.

**Disputes / chargebacks** — always linked to Job + Invoice + Payment + Technician.
- On open: freeze or deduct the amount from the company wallet. Technician unpaid → freeze their share. Technician already paid → create a **Backcharge**.
- Company wins: refund, remove deductions and backcharges, release frozen technician funds.
- Company loses: technician bears **only their commission share**; dispatch and gateway fees are **not** returned to the technician (already-consumed operating costs); the company absorbs the rest per its policy.

**Weekly cycle** — Monday 00:00 → Sunday 23:59. A job belongs to the week it *completed* in. Statements auto-generate at week end.
- *Company statement*: total revenue, total cash, total card, gateway fees, dispatch fees, refunds, disputes, company profit, wallet balance, technician balances.
- *Technician statement*: job count, cash collected, card earnings, total commission, dispatch fees, gateway fees, deductions, backcharges, total paid, final balance. This statement **drives the weekly payout**.

**Financial Transactions ledger** — balances are **never edited manually**. Every operation appends a row. Types: customer payment, refund, dispute/chargeback, gateway fee, dispatch fee, technician commission, technician payout, backcharge, adjustment, transfer to company. Each row carries: transaction number, company, job, invoice, technician (if any), customer (if any), amount, type, datetime, acting user, notes.

### 4. Reports overhaul

The existing Reports page is charts only. The client wants **tables with full search, date ranges, and detail** — for both platform and company. The developer expects the designer to **propose** the report set, since the client's request is vague.

### 5. Payment links

The platform sends a payment link to the customer's mobile. **This has never had a UI** and must be designed.

## Design system (inferred from the original Figma screenshots, since removed from this repo)

Current mocks are branded **"LockAccess Pro"** with the subtitle "Platform Admin" — the project name JobixFlow does not appear. Confirm which name to use before producing final UI.

**Shell** — fixed left sidebar: product name + role subtitle at top, single-level icon+label nav, logged-in user card (circular avatar, name, email) pinned to the bottom. Content area on a very light slate background, page title in bold with a gray one-line subtitle beneath.

**Palette** (reads as Tailwind's default scale — a useful shorthand when writing prompts)

- Primary blue `#3B82F6` / `#2563EB` — buttons, links, active nav, chart bars
- Login hero: blue → violet gradient (`#2563EB` → ~`#6D28D9`)
- Page background `#F8FAFC`; cards white
- Text `#0F172A`; muted `#64748B`
- Success/positive `#22C55E` · warning `#F59E0B` · danger `#EF4444` · accent `#A855F7`
- Active nav item = pale blue fill `#EFF6FF` with blue icon and label

**Components**

- **Cards**: white, ~12px radius, 1px light border, very soft shadow
- **KPI tiles**: tinted square icon chip top-left, delta top-right in green, large bold number, gray label beneath
- **Pastel stat tiles** (inside modals): full pastel-tinted backgrounds — blue, green, yellow, purple
- **Status pills**: In Progress = blue tint · Assigned = purple tint · Completed = green tint
- **Priority pills**: High = red tint · Medium = amber tint · Low = green tint
- **Tables**: gray uppercase-ish header row, thin row dividers, pills in cells, blue "View" text links as row actions
- **Filter bar**: full-width search input with leading magnifier, funnel icon, and **quick-filter chips with counts** ("All Jobs (6)", "High Priority (3)", "Today (5)") — active chip solid blue
- **Modals**: white sheet, large bold title, top-right ✕, divider under the header
- **Charts**: blue bars, green line with circle nodes, dashed gridlines, 4-color pie (blue/green/amber/red)
- **Forms**: labeled inputs, rounded ~10px, 1px gray border, leading icon, gray placeholder, password reveal eye
- **Icons**: consistent outline/line style (Lucide/Feather family)

Exact spacing, radii, and type scale are **not** reliably measurable from PNGs — read them from the Figma file itself before finalizing tokens.

## What already exists vs. what must be designed

**Exists** (per the now-removed `figma-current/` screenshots — captured for the design system above, before deletion): Login, Reset Password (verify email + new password), Dashboard, Companies, Company Details modal, Add Company, Company Areas Management, Jobs, Reports. `Container.png` and `Primitive.div.png` were stray exported nodes, not screens.

**Missing entirely** — every financial screen (platform wallet, company wallet, technician ledger/account, transactions, weekly statements, disputes, payouts), payments & payment links, gateway settings, Twilio number settings, Key Codes, Code Requests, Call Logs detail & recordings, per-job chat, the two-layer map, notifications, company-sourced job/customer creation, the reworked table-based reports, the reusable filter/table/actions component, and all empty / loading / error / permission-denied states. The technician mobile app is also absent from this screenshot set.

## Open questions for the client

A 2026-08-17 follow-up meeting — **with the client directly**, not the developer — worked through most of this list; see [`.claude/docs/open-questions.md`](.claude/docs/open-questions.md) (and its Arabic counterpart) for the living, authoritative version with full citations. That document, not this section, is what to update as questions get answered — this list is kept only as a quick-reference snapshot and may lag.

1. **What is a "wallet"?** ✅ **Resolved.** It's a derived transaction log / source of truth, not a real money-movement account — no technician-to-technician or peer transfers exist. See `Q-01`.
2. **Platform commission** — still open. The follow-up meeting named no commission mechanism, which weakens the case for one, but the client's written file still lists "platform commission" inside the Platform Wallet and this was never explicitly disclaimed. See `Q-02`.
3. **Which three payment gateways** — still open, and now self-contradictory: the written document names Stripe, Square, Authorize.net; the client named Stripe, PayPal, Authorize.net verbally in the follow-up. See `Q-03`.
4. **The Country selector** existed only for a now-cancelled UAE / Middle East branch (Twilio was US-only). Keep or remove? Not addressed in the follow-up — still open. See `Q-04`.
5. **Job priority** — ✅ **Resolved.** Binary Now/Scheduled flag only; no effect on price, category, or technician assignment. See `Q-05`.
6. **Does the platform see company-sourced jobs?** ✅ **Resolved**, with nuance: visibility is gated by whether the company runs entirely on its own payment gateway and its own Twilio number, not by job origin as a standalone flag. See `Q-06`.
7. **Delete vs. archive** — ✅ **Resolved.** No hard delete of live records; the delete action becomes "Archive," gated by a minimum age (client's working figure: one year, meant to be admin-configurable), with periodic export satisfying the underlying 2-year US legal-retrieval requirement. See `Q-07`.
8. **Report definitions** — still the designer's to propose, but filtering requirements are now confirmed (date presets + custom range, condition filters, strict no-cross-company and no-cross-technician visibility). See `Q-08`.

Two new questions surfaced in the follow-up that didn't exist before: `Q-20` (a newly named "Service Call Fee" for jobs that don't complete after dispatch) and `Q-21` (the client promised a full list of job-cancellation reasons that hasn't arrived yet).

## Working conventions

- Read source files fully before writing any BRD or prompt; the transcript's key facts are scattered and the same topic recurs in several places.
- When the transcript and `major-changes.txt` disagree, **the client's written file wins**, and the disagreement goes on the open-questions list.
- Master prompts in `design-prompts/` should carry the design-system section above inline — the generation tool has no access to this workspace.
- Preserve the existing visual language when designing new screens; this is an extension of a live product, not a redesign.
