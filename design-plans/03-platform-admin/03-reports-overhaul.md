# Platform Admin — Reports overhaul

Current page: `/platform/reports` (`.claude/docs/live-system/01-platform-admin/05-reports.md`).

## ✏️ MODIFY → 🆕 effectively a rebuild: charts-only to tables-with-search

**Why:** `Q-08` — the client wants reports with full search and detail, replacing the current chart-only pages; the designer is expected to propose the actual report set. The 2026-08-17 follow-up confirmed the filtering requirements that should govern *every* report table built here: date presets (today/this week/last week) plus custom range, condition filters (customer, technician, dispatcher, payment method), and two hard constraints — never show another company's data, never let a technician see another technician's activity (`[T2:59-61]`).

**What exists today** (verified directly against the live screenshot, `platform-reports.png`, since the written doc was thin): four static widgets — a Technician Performance Overview scatter, a Jobs & Revenue Trend line chart, a Revenue by Service Type pie chart, and a 4-tile Key Metrics Summary (Total Jobs 7d, Avg Response Time, Total Revenue 7d, Avg Job Value). No table anywhere, no search, no date control beyond the implicit "7 days" baked into the tiles.

**What to design:**
1. **Keep the four existing chart widgets as a "Summary" tab or top-of-page overview** — they're genuinely useful at-a-glance and nothing about the new requirement asks to remove charts, only to add the table/search layer the client actually asked for.
2. **Add a "Detailed Reports" section using the master DataTable + Filter components** (`02-shared-components/`). Propose (this is the designer's call to make, per `Q-08`'s own framing, not a client-dictated list) at minimum:
   - **Jobs report** — every job, filterable by date range, company, service type, technician, dispatcher, priority, payment method, status; money columns for estimate/final price.
   - **Financial report** — every transaction row (once the ledger exists, see `04-platform-wallet.md`), filterable the same way, including the newly-confirmed types: expense, refund, dispute, Service Call Fee.
   - **Technician performance report** — a tabular version of the existing scatter, with the same filters, sortable and exportable.
3. Every report table defaults to a **scoped, non-empty date window** rather than loading unscoped (`Rule 02 · R02-5`) — the client explicitly cares about server load at scale.
4. Reports need an **export affordance** (the pattern is already implied elsewhere — Company Admin's Reports page subtitle literally reads *"Generate and download detailed reports"* even though no download control currently exists on that page either, `[LIVE:company-admin-reports.png]`) — treat "export the current filtered view to CSV/Excel" as part of this task, not a separate one, since it's the same mechanism the client wants for the yearly-archive export (`AUD-002`).

**Role visibility:** Platform Admin, full cross-company view (the one role allowed to see everything, contrasted against the company/technician self-scoping rule above).

**States:** No-results state matters more here than almost anywhere else in the product — a report with an over-narrow filter combination returning zero rows needs the "clear filters" affordance front and center, not a bare empty table.
