# Settings — Platform Admin
URL/route: `https://jobixflow.com/platform/settings/1/edit`
Purpose: Platform-wide branding — logo only.

## Navigation path
Sidebar → "Settings" (tenth/last item).

## CRUD actions tested
- Create/Read: Page shows a single "Drag & Drop or Click to Upload" upload control and an "Update Logo" button. No existing logo preview was visible (no current logo shown before upload).
- Update: Not tested (would require uploading a real file and permanently changing the platform's branding — avoided as an irreversible-ish shared-state change).
- Delete: N/A — no delete action exists on this page.

## Hidden / secondary UI elements
None found — this is the smallest, flattest page mapped in this audit. No tabs, no sub-sections, no other settings of any kind.

## States observed
- Empty state: Arguably the default state itself is an "empty" state (no logo currently set / not shown) — not clearly distinguished from a populated state since no preview area was visible.
- Loading state: Not observed.
- Error state: Not tested.
- Success/confirmation state: Not tested (upload not completed).
- Disabled elements: None found.

## Validation & edge cases
Not tested.

## Permissions
Platform Admin only.

## Issues / inconsistencies / open questions
- **[FINDING] This page is the entirety of platform-level "Settings" today** — no gateway configuration, no Twilio settings, no default commission/dispatch-fee/gateway-fee values, no data-retention/archive-age configuration (relevant to `AUD-002`'s admin-configurable minimum-archive-age requirement), nothing beyond a logo uploader. Confirms live, first-hand, that every settings-adjacent new requirement (gateway selection, Twilio number ownership, archive-age config) is being designed from a completely blank slate at the platform level, not extending any existing settings UI.
- **[OPEN]** Company-level settings (commission %, dispatch fee, gateway fee, gateway selection) were not found anywhere in the Companies module either (see `companies.md`) — worth confirming with the developer whether a company-settings screen exists at all today, reachable by some path this audit didn't find, before assuming it must be built fully from scratch.
