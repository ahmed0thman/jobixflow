# Company Admin — Settings: Twilio and Payment Gateway (new)

Current page: `/companies.admin/settings/1/edit` (`.claude/docs/live-system/03-company-admin/05-call-logs.md`, part B; verified directly against `company-admin-settings.png`).

## The gap

Confirmed by direct screenshot inspection: Company Settings today has exactly two cards — **Company Information** (Name, Business Email, Business Phone, Tax ID/EIN, Country, Status) and **Business Address** (Street, City, State, ZIP). Nothing about telephony, nothing about payments. See `01-critical-findings-and-conflicts.md`, Finding 2 — this is where the requirement's per-company Twilio number and per-company gateway credentials need to land, and neither exists today.

---

## 🆕 NEW SECTION: Twilio / Masked Calling

**Where:** New card on the Settings page, same visual pattern as the existing Company Information / Business Address cards (icon chip + title, per `Rule 02 · R02-1`).

**Why:** `.claude/docs/CLAUDE.md` §2 — each company supplies its own Twilio number and subscription; the platform does not issue it. `COM-004` — the binding survives 24h past job close. Twilio number can change at any time (`Q-10`, resolved).

**What to design:**
- Credential/connection entry: Twilio Account SID, Auth Token (masked input, reveal toggle matching existing password-field pattern per `Rule 02 · R02-1`), and the active phone number — with a connection-test action and an active/connected status indicator.
- A **change number** action — since the client confirmed the number can change any time with no fixed cycle, don't gate this behind any "once a year" assumption. On change, existing bindings and call logs must remain intact and readable (`.claude/docs/BRDs/00-glossary.md` — only logs are retained, not versioned against a specific number) — the UI should reassure the admin of this with a short confirmation note rather than a scary warning.
- A short explanatory note near the top of the card: *"Call recordings and SMS for this number are stored by Twilio directly — this platform displays a link to them, not the file itself"* (`[T2:196-200]`) — sets the right expectation before the admin looks for a recording and doesn't find a native player.

**Role visibility:** Company Admin only — this is company-owned infrastructure, never platform-configured (`.claude/docs/CLAUDE.md` §2, "the platform does not issue it").

---

## 🆕 NEW SECTION: Payment Gateway

**Where:** New card on the same Settings page.

**Why:** `.claude/docs/CLAUDE.md` §3 — up to three gateways per company (Stripe, PayPal or Square, Authorize.net — name conflict flagged, `Q-03`, don't hardcode the exact three until confirmed), each with its own API credentials the company obtains directly (`FIN-W-016`) — the platform never re-sells or co-signs access.

**What to design:**
- A list-with-add pattern (not a single form) — one row per configured gateway: provider logo/name, masked credential summary, active/fallback toggle, connection-test result, remove action.
- An explicit **"No gateway configured"** state that clearly explains the fallback behavior: *"Your customers' payments will go through the platform's own gateway until you connect one here"* (`FIN-W-007`) — this is a genuinely important default behavior for a company admin to understand, not just an empty list.
- Because credentials require the company's own KYC/background check with the provider (`[T2:157]`), the connection flow is "bring your own already-approved credentials," not an in-product signup wizard — don't design an onboarding flow that implies the platform mediates approval.

**Role visibility:** Company Admin only.

**States:** The "no gateway configured, using platform fallback" state described above should be the *default* rendering, not an edge case — most companies will likely start here.
