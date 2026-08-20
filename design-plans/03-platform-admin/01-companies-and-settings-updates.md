# Platform Admin — Companies and Settings updates

Current pages: `/platform/companies` (`.claude/docs/live-system/01-platform-admin/02-companies.md`), `/platform/settings` (`.claude/docs/live-system/01-platform-admin/08-audit-log.md`, part B).

---

## ✏️ MODIFY: Company creation/edit form — reconcile the Commission field

**Where:** `/platform/companies/create` and the row-level "Edit" modal (`platform-add-company.png`, `platform-companies-edit-modal.png`).

**Why:** See `01-critical-findings-and-conflicts.md`, Finding 1. The form already collects a required `Commission` percentage per company, and the system's own documented behavior ("Platform logs 0 commission for platform on jobs handled by this company") strongly suggests this is the platform-commission mechanism `Q-02` has been asking about.

**What to design:**
- Don't remove or rename the field yet — it may be exactly right. Add a short inline helper/tooltip clarifying what it means today: *"Percentage the platform retains from this company's platform-gateway transactions"* (or whatever wording the client confirms) so a Platform Admin creating a company understands the financial consequence of the number they're typing, not just that it's required.
- Once `Q-02` is confirmed, this field's label and helper text is the first thing to finalize — treat it as provisional copy, not shipped copy.

**Role visibility:** Platform Admin only (`ROL-003` — company creation is not a job-creation action, stays with the admin, consistent with existing behavior).

---

## ➕ NEW SECTION: Company Details — Gateway & Tenancy status

**Where:** `/platform/companies/{id}` (`platform-company-details.png`), alongside the existing KPI cards (Dispatchers, Technicians, Active Jobs, Total Revenue).

**Why:** `FIN-W-002` — companies on their own payment gateway never appear in the Platform Wallet. `AUD-001` — a company fully self-sufficient on its own gateway *and* its own Twilio is excluded from the platform audit log. A Platform Admin looking at a company's profile currently has no way to see which regime that company is in.

**What to design:**
- A small status block (not a KPI tile — this is a configuration state, not a metric): **Payment Gateway** — "Platform (fallback)" or "Own gateway configured [Stripe/PayPal/Authorize.net icon]"; **Twilio** — "Not configured" or "Own number configured." Read-only here — the company configures these themselves in their own Settings (`05-company-admin/04-settings-twilio-and-gateway.md`); Platform Admin only observes.
- This status directly explains to the admin *why* a given company's financials might be absent from the Platform Wallet, and why its audit trail might look thin — surface a one-line explanatory note near the block, e.g. *"Companies on their own gateway and Twilio don't appear in platform-level financial or audit views."*

**Role visibility:** Platform Admin (view only). Not shown to any company role — it's about how the platform sees them, not a company-facing setting.

**States:** Empty/loading not really applicable (always resolves to one of the two states above); no permission-denied variant needed since this is Platform-Admin-only page context already gated at the route level.

---

## ➕ NEW SECTION: Platform Settings — Payment Gateway (fallback)

**Where:** `/platform/settings` (`platform-settings.png`) — today this page is a single card, "Manage and update your platform logo," nothing else.

**Why:** `FIN-W-007` — a company with no configured gateway falls back to the platform's own gateway. Nothing in the live system today configures *that* platform-level gateway — Platform Settings has zero financial configuration.

**What to design:**
- A new "Payment Gateway" card matching the existing card style (icon chip + title, per `Rule 02 · R02-1`), with credential entry for the platform's own fallback gateway (provider selection, API key fields, connection-test action, active indicator) — the same credential-entry pattern used in the company-level gateway settings (`05-company-admin/04-settings-twilio-and-gateway.md`), just single-tenant and platform-owned.
- Gateway name is still open (`Q-03`) — design the provider picker to hold 2–3 logo options without hardcoding which ones until confirmed.

**Role visibility:** Platform Admin only.

**States:** Standard form states (validation error on bad credentials, success confirmation on save, connection-test pending/success/fail).

---

## ✅ NO CHANGE: Countries page's provider fields

Per Finding 2, leave `.claude/docs/live-system/01-platform-admin/03-countries.md`'s `call_provider`/`whatsapp_provider` fields as-is for this pass — don't redesign them into the new per-company Twilio model. Flag to the dev whether they should be deprecated once every company configures its own number, but that's a backend/data decision, not a design task here.
