# Audit Log — Platform Dispatcher
URL/route: `https://jobixflow.com/platform.dispatcher/audits`
Purpose: Same global audit feed as Platform Admin's Audit Log — identical data, identical columns (User, Model, Action, Changes, Description, Created At), same 1,660 pages.

## Navigation path
Sidebar → "Audit Log" (seventh item).

## CRUD actions tested
- Read: Confirmed identical dataset to Platform Admin's Audit Log (same first-page rows, same 1,660-page count).
- Delete: **No Actions column at all here** — unlike Platform Admin's version of this page, which has a per-row "Delete" link. Platform Dispatcher gets read-only access.

## Hidden / secondary UI elements
Same single global search box, same lack of per-column filters/date range as the Platform Admin version — see `platform-admin/audit-log/audit-log.md` for the full write-up of this shared problem; not re-documented in full here to avoid duplication.

## States observed
Not re-verified independently — same page/data as already documented for Platform Admin.

## Validation & edge cases
Not re-tested.

## Permissions
Platform Dispatcher **can see the full, platform-wide, cross-company Audit Log** — this is a significant, unflagged finding: `CLAUDE.md`'s Actors table does not list Audit Log access for Platform Dispatcher at all (only Platform Admin is described as having it: "audit log, users"). Yet it's live, reachable via a normal sidebar nav item, and shows the identical unscoped dataset Platform Admin sees. The one difference found is that Platform Dispatcher's version has no Delete action on rows (Platform Admin's does).

## Issues / inconsistencies / open questions
- **[FINDING — permissions gap not documented anywhere] Platform Dispatcher has full read access to the platform-wide Audit Log**, which is not mentioned as one of this role's capabilities in `CLAUDE.md`'s Actors and dashboards table. This should be flagged to the client/developer as a real question: is this intentional (the Audit Log is meant to be visible to both platform roles), or is it scope creep from the current build that the redesign should correct by restricting it back to Platform Admin only? Recommend adding this as a new open question rather than silently designing around either assumption.
