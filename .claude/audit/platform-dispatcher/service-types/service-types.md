# Service Types — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher/service_types`
Purpose: Admin CRUD for the "Service Type" lookup entity used by job creation.

## Navigation path
Sidebar → "Service Types" (third item).

## CRUD actions tested
- **Create**: "Add Service" button present (not opened in this pass, form shape assumed identical to Edit based on the pattern used everywhere else in this audit — single Name field).
- **Read**: Table — Service Name, Jobs (count), Technicians (count), Actions. **8 pages** of results.
- **Update**: Row "Edit" link → modal "Edit Service," single "Name" field, pre-filled. Tested on the first row ("Aida Mosciski"). Closed without saving.
- **Delete**: Row "Delete" link present — not tested, same live-data caution as elsewhere.

## Hidden / secondary UI elements
- Row actions use the inline-text-link pattern (Edit / Delete) — consistent with Countries/Users, not Companies' kebab.
- Search box ("Search by name") present, not exercised.

## States observed
- Empty state: Not observed (8 pages of seed rows).
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not captured.
- Disabled elements: Pagination Previous disabled on page 1.

## Validation & edge cases
Not tested.

## Permissions
Reachable by Platform Dispatcher (confirmed in this role's sidebar). Not yet confirmed whether Platform Admin or any other role can also reach this URL — Platform Admin's sidebar had no equivalent link, so this may be Platform-Dispatcher-exclusive; worth double-checking once other roles are mapped.

## Issues / inconsistencies / open questions
- **[FINDING — root cause confirmed] This table is the source of the Service Type data-quality bug flagged in both `platform-admin/reports/reports.md` and `platform-dispatcher/new-job/new-job.md`.** Every single "Service Name" value on this admin management screen is a person's full name (e.g. "Aida Mosciski," "Alan Reinger II," "Alta Jenkins," "Angelina Nicolas," "Ayden Gleason," "Bell Schultz," "Boyd Willms" — 8 pages of them), not a real locksmith service category. This is not a display/rendering bug in the Reports chart or the New Job dropdown — **the underlying `service_types` table itself is seeded with the wrong kind of data** at the source. Every job in the system that has ever selected a "service type" is tagged with a person's name instead of a real category. This is the single most concrete, structurally-confirmed data bug found in this audit so far and should be raised with the developer as a priority item — it affects reporting, job creation, and any future service-type-based filtering (relevant to the reports overhaul's "condition filters" requirement, which will be useless if this isn't fixed first).
- Each service type also carries a live "Jobs" and "Technicians" count column, suggesting this entity is meant to be a real, structurally important lookup (not a throwaway list) — reinforcing that this is worth fixing at the data level, not working around in the design.
