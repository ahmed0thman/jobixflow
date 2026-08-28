# Reports — Platform Admin
URL/route: `https://jobixflow.com/platform/reports`
Purpose: Charts-only overview of technician performance, jobs/revenue trend, and revenue mix.

## Navigation path
Sidebar → "Reports" (fourth item).

## CRUD actions tested
- Create/Update/Delete: N/A, purely a read-only reporting page.
- Read: Four visualizations render: "Technician Performance Overview" (bar chart, per-technician), "Jobs & Revenue Trend" (line/area chart, Mon–Sun), "Revenue by Service Type" (pie/donut chart with an enormous legend — see Issues), "Key Metrics Summary" (4 stat tiles: Total Jobs (7 days), Avg Response Time, Total Revenue (7 days), Avg Job Value).

## Hidden / secondary UI elements
- **Pie/donut legend entries** ("Revenue by Service Type") are individually hoverable/clickable (`cursor=pointer` on each) — presumably toggles that series on/off in the chart, standard chart-library behavior. Not exhaustively clicked through all 50+ entries.
- No date-range control, no search, no filter, no export/download button anywhere on this page despite the page subtitle reading "Generate and download detailed reports" — the subtitle promises functionality that does not exist on the page (see Issues).
- No drill-down: clicking into a chart segment, bar, or stat tile does not appear to navigate anywhere (not exhaustively tested per element, but no links/hrefs present in the accessibility tree for any chart element).

## States observed
- Empty state: Not observed as a true empty state, but the "Key Metrics Summary" tiles show zeroed/degenerate values (see Issues) which may indicate this section is effectively broken/empty despite live jobs existing platform-wide.
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: N/A.
- Disabled elements: None found — there are no interactive form controls on this page to disable.

## Validation & edge cases
N/A — no inputs.

## Permissions
Platform-wide scope (aggregates across all companies), consistent with Platform Admin's monitoring role. No per-company or per-technician filter exists to narrow the view, which will matter for the reports overhaul (`TEN-002` cross-company isolation is trivially satisfied today only because there's no filtering at all to leak through).

## Issues / inconsistencies / open questions
- **[FINDING] This page is charts-only with zero tables, search, date-range, or export**, exactly matching the "Reports overhaul" requirement's description of current behavior (`NEW-REQUIREMENTS.md §4`, `CLAUDE.md §4`). Confirms live-system baseline for the gap analysis rather than adding new information.
- **[FINDING] Page subtitle ("Generate and download detailed reports") promises functionality that does not exist anywhere on the page** — no generate action, no download/export control. This is either a stale copy string or a half-shipped feature; worth flagging to the developer regardless of the design work planned here.
- **[FINDING] "Revenue by Service Type" chart legend lists ~55 individual customer/person names** (e.g. "Glennie Sawayn," "Dr. Craig Larson"), not service types (which per the domain should be a small fixed set like vehicle/door/etc., as seen on the Jobs table's "Type" column). This looks like a live data/query bug — the chart is plotting by the wrong dimension — rather than a design concern, but it materially affects what a designer should assume this chart is capable of showing.
- **[FINDING] "Key Metrics Summary" tiles show degenerate values** — "Total Jobs (7 days): 0" despite 1051 total jobs platform-wide and clear daily job activity visible in the "Jobs & Revenue Trend" chart directly above it; deltas read "+100% vs last week" and "+0 hours increase" on every tile, the same suspicious pattern seen on the Dashboard KPI deltas (see `platform-admin/dashboard/dashboard.md`). This looks like a shared, systemic bug in whatever week-over-week delta calculation feeds both pages — worth flagging to the developer as one root cause, not two separate issues.
- **[OPEN]** Because this page has no filters at all, it was not possible to test scope/isolation behavior here — the actual filtering requirements (date presets + custom range, per-company/technician/dispatcher/payment-method conditions, strict no-cross-company and no-cross-technician visibility per `NEW-REQUIREMENTS.md §4`) are entirely unbuilt, confirming the "thin" source-coverage flag already called out for `RPT` in `Rule 00`.
