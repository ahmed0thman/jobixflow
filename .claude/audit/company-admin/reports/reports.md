# Reports — Company Admin
URL/route: `https://jobixflow.com/companies.admin/report`
Purpose: Company-scoped version of the same charts-only Reports page already fully documented for Platform Admin (`platform-admin/reports/reports.md`) — identical structure and identical bugs, confirmed here at company scope.

## Navigation path
Sidebar → "Reports" (fourth item).

## CRUD actions tested
Read only — same 4 sections: Technician Performance Overview (bar), Jobs & Revenue Trend (line), Revenue by Service Type (pie), Key Metrics Summary (4 stat tiles). All company-scoped (technician list matches this company's roster).

## Hidden / secondary UI elements
Same as Platform Admin's version — not re-detailed.

## States observed
Same degenerate Key Metrics values ("Total Jobs (7 days): 0," "+100% vs last week" on every tile) reconfirmed at company scope — same systemic bug, not company-specific.

## Validation & edge cases
N/A.

## Permissions
Company-scoped equivalent of the Platform Admin Reports page.

## Issues / inconsistencies / open questions
- Reconfirms both bugs already fully documented in `platform-admin/reports/reports.md`: the "Revenue by Service Type" chart plotting by person-name instead of service type (same root cause as `platform-dispatcher/service-types/service-types.md`), and the systemic broken Key Metrics deltas. Not re-detailed here to avoid duplication — see the Platform Admin write-up for full findings.
