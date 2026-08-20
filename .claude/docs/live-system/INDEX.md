# Live System Audit & Architecture Documentation

## Overview

Comprehensive architectural, UI, and business logic audit conducted across all four web dashboards of **JobixFlow** via live Playwright MCP automation on `https://jobixflow.com`.

---

## Role Portals & Route Map

| Portal | Role Code | Base URL | Primary Responsibility |
|---|---|---|---|
| **Platform Admin** | `platform_admin` | `/platform` | Global system oversight, company onboarding, country/provider configurations, financial reports, system audits, user management. |
| **Platform Dispatcher** | `platform_dispatcher` | `/platform.dispatcher` | Direct customer intake, job creation & preliminary pricing, company allocation, service types catalog, customer communications. |
| **Company Admin** | `company_admin` | `/companies.admin` | Company operations, locksmith technician management, key code procurement & cost tracking, call logs, performance reports. |
| **Company Dispatcher** | `company_dispatcher` | `/companies.dispatcher` | Live fleet monitoring, technician dispatching, real-time Google Maps tracking, job assignment, operational chat. |

---

## Documentation Modules

### 1. Platform Admin (`/01-platform-admin/`)
- [01-dashboard.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/01-dashboard.md) — Metrics overview, revenue trend, active jobs overview table.
- [02-companies.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/02-companies.md) — Company listing, status modal (active/pending/suspended/deleted), company creation form, company metrics breakdown.
- [03-countries.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/03-countries.md) — Country codes, call provider & WhatsApp provider bindings, add country modal.
- [04-jobs.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/04-jobs.md) — Cross-company job monitoring, full job details view (pricing breakdown, physical keys, payments, vehicle info, status timeline), read-only chat audit.
- [05-reports.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/05-reports.md) — Technician performance overview, revenue by service type, key metrics summary.
- [06-customers.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/06-customers.md) — Master customer directory and job associations.
- [07-users.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/07-users.md) — Platform users management, role assignment, user creation modal.
- [08-audit-log.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/08-audit-log.md) — System entity mutation history, audit logging.
- [09-settings.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/09-settings.md) — Platform branding and logo configuration.

### 2. Platform Dispatcher (`/02-platform-dispatcher/`)
- [01-dashboard.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/01-dashboard.md) — Dispatcher intake overview, urgent jobs counters, recent jobs stream.
- [02-create-job.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/02-create-job.md) — Full customer intake workflow, add customer inline modal, item classification (vehicle/door), preliminary price & schedule.
- [03-job-history.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/03-job-history.md) — Comprehensive job search, status filters, edit job form.
- [04-service-types.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/04-service-types.md) — Service catalog management and add service modal.
- [05-chat-and-dispatch.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/05-chat-and-dispatch.md) — Internal chat threads per job, participant communication flows.

### 3. Company Admin (`/03-company-admin/`)
- [01-dashboard.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/01-dashboard.md) — Company operational dashboard, urgent attention cards, technician availability widget.
- [02-code-requests.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/02-code-requests.md) — Key code requests from field technicians, VIN details, code fulfillment modal with provider & cost logging.
- [03-key-codes.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/03-key-codes.md) — Historical key code repository, validity tracking, cost auditing.
- [04-technicians.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/04-technicians.md) — Technician roster, availability states (Available/On Job/Offline), job load statistics.
- [05-call-logs.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/05-call-logs.md) — Telephony call logs and communication auditing.
- [06-reports-and-settings.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/06-reports-and-settings.md) — Company performance metrics, business address & license settings.

### 4. Company Dispatcher (`/04-company-dispatcher/`)
- [01-dashboard.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/01-dashboard.md) — Active jobs command center, free technicians tracker, quick status stream.
- [02-active-and-incoming-jobs.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/02-active-and-incoming-jobs.md) — Incoming platform job queue, job acceptance & technician allocation.
- [03-live-map.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/03-live-map.md) — Interactive Google Maps fleet tracking, layers control (Technicians/Job locations), live stats panel, technician profile inspector.
- [04-technicians.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/04-technicians.md) — Fleet roster, contact details, status management.

---

## Live Screenshots Index

All screenshots captured during the live system walkthrough are organized under:
`file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/`
