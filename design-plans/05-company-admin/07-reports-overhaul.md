# Company Admin — Reports overhaul

Current page: `/companies.admin/report` (`.claude/docs/live-system/03-company-admin/05-call-logs.md`, part referencing Reports; verified directly against `company-admin-reports.png`).

## ✏️ MODIFY → rebuild, mirroring the Platform Reports task exactly

**What exists today:** Confirmed by direct screenshot inspection — an identical structure to the Platform Admin Reports page: Technician Performance Overview (scatter), Jobs & Revenue Trend (line), Revenue by Service Type (pie), and a 4-tile Key Metrics Summary (Total Jobs 7d, Avg Response Time, Total Revenue 7d, Avg Job Value). The page subtitle already reads *"Generate and download detailed reports"* — a promise the current page doesn't keep, since there is no table and no download control anywhere on it.

**What to design:** Apply `03-platform-admin/03-reports-overhaul.md`'s spec here, company-scoped:
- Keep the four chart widgets as a Summary view.
- Add the master DataTable + Filter detailed-reports layer with the same confirmed filtering set (today/this-week/last-week/custom range, condition filters on customer/technician/dispatcher/payment method, `[T2:59]`).
- **Two extra constraints that don't apply to the platform version, and matter more here than anywhere else in the product:** every report on this page must never surface another company's data (`TEN-002` — trivially true since this is already company-scoped by route, but double-check no cross-company aggregate accidentally leaks through a chart's data source), and a technician's own drill-down into these reports (if the mobile app or a future technician-facing report ever reuses this component) must never expose another technician's rows (`[T2:60-61]`).
- Add the **Origin** column/filter from `01-own-jobs-and-customers.md` to every report table here — a company running both platform- and company-sourced work needs to separate the two in every report, per `.claude/docs/CLAUDE.md` §1 ("financials and reports must separate the two").
- Deliver on the existing subtitle's promise: add the export-to-CSV/Excel action.

**Role visibility:** Company Admin, scoped to one company.
