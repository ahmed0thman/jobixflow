# Critical findings and conflicts

Six things surfaced by diffing the live system against the new requirements that change how the rest of this folder should be read. Every downstream file references back to these by number instead of re-explaining them.

---

## Finding 1 — the platform may already have its commission mechanism (`Q-02`)

**The open question.** `Q-02` (🔴 blocking, see `.claude/docs/open-questions.md`) has been unresolved since the first developer transcript: does the platform take a commission at all, and the 2026-08-17 client meeting only weakened the case for one without settling it.

**What the live system actually does.** The Platform Admin's **Add Company** form already has a required field literally called **`Commission` percentage** `[LIVE:.claude/docs/live-system/01-platform-admin/02-companies.md]`, and its own documented edge case spells out what it's for:

> *"Zero Commission Value — Company created with 0% commission → Platform logs 0 commission for platform on jobs handled by this company."*

This is about as direct as evidence gets: a per-company, platform-admin-set percentage that the platform logs against itself. It strongly suggests the platform commission mechanism already exists in the data model and just needs a home in the new financial screens — it is **not** a green-field question of "should this exist," but very possibly a green-field question of "where does this number show up in the Platform Wallet and company statements."

**What to do.** Don't treat `Q-02` as fully closed — the client's own words never confirmed this field is what they meant, and it's plausible this `commission_rate` is dead/legacy or means something else entirely (e.g., a display-only field never wired to money). But every platform financial screen in `03-platform-admin/` and `05-company-admin/` designed in this pass **should assume a platform-commission line exists and reserve space for it**, rather than assuming zero. Flag this back to the client/dev alongside `Q-02` before final sign-off: *"you already have a per-company Commission field on the Add Company form — is this the platform's cut? If so, where should it be visible?"*

---

## Finding 2 — masked-calling config lives at the wrong tenancy level today

**The requirement.** `[C:§Twilio]` / `.claude/docs/CLAUDE.md` §2: **each company** supplies its own Twilio number and subscription — the platform does not issue it, and companies configure it independently.

**What the live system actually does.** Platform Admin's **Countries** page (`.claude/docs/live-system/01-platform-admin/03-countries.md`) is where call/messaging gateway config lives today — bound to a **country**, not a company:

> *"Call Provider: Name/identifier of the telephony gateway service configured for phone operations in this country. Whatsapp Provider: ... configured for notifications in this country."*

This is a real architectural mismatch, not a cosmetic one. The country-level fields answer *"which gateway vendor does this country use"*; the requirement needs *"which Twilio number and subscription does this specific company hold."* Company Settings today (`.claude/docs/live-system/03-company-admin/05-call-logs.md`) has no telephony fields at all — Company Name, Business Email/Phone, Country, Tax ID, Status, Address only, confirmed against the actual screenshot.

**What to do.** Design a **new, company-scoped Twilio/messaging settings section** (see `05-company-admin/04-settings-twilio-and-gateway.md`) rather than extending the country-level fields. Leave the Countries page's `call_provider`/`whatsapp_provider` fields alone — flag to the dev whether they become an unused legacy pair, a platform-level fallback default, or get repurposed, but don't silently redesign them as part of this pass.

---

## Finding 3 — the live map already does proximity-based dispatch (contradicts `ROL-010`)

**The requirement.** `.claude/docs/BRDs/01-actors-roles-permissions.md`, `ROL-010`: technician assignment is filtered by same-state and free/busy only — *"proximity is explicitly not used, because exact locations are unknown."*

**What the live system actually does.** The Company Dispatcher's live map (`.claude/docs/live-system/04-company-dispatcher/03-live-map.md`) is explicitly a proximity-dispatch tool:

> *"Flow 1: Proximity Dispatching via Map — 1. Dispatcher opens the map. 2. Locates an unassigned job pin. 3. Observes nearest green ('Available') technician pin. 4. Clicks technician... 5. Dispatches technician to the nearby job."*

This is a direct contradiction, not a nuance. Either the transcript-derived rule (`ROL-010`) is stale — proximity dispatch clearly works and is a documented flow in the live product — or the live map's proximity affordance is a UI feature that overstates what the backend actually optimizes for (dispatcher chooses "nearest," but "nearest" and "correctly matched" aren't necessarily the same claim).

**What to do.** Don't remove the map's proximity affordance — it's a real, working, and by all appearances well-liked feature. Don't silently endorse it as the new source of truth either. Flag this to the client as a direct question — *"the live map already lets dispatchers pick the nearest technician visually; is same-state-and-free still the only formal assignment rule, or does the map's proximity view reflect how assignment actually works today?"* — and treat `ROL-010`'s text as provisional until answered. This affects `06-company-dispatcher/`, which otherwise leaves the live map's core mechanic alone.

---

## Finding 4 — Priority is two different things wearing one name

**The requirement.** `Q-05` (resolved, 2026-08-17): Priority is a **binary flag** — "Now" or "Scheduled" — with **no effect** on price, category, or which technician gets the job.

**What the live system actually does.** The live `priority` field is a **three-value urgency scale** — `Low` / `Medium` / `High` — and it visibly drives UI treatment: *"High priority triggers immediate urgency visual badges"* `[LIVE:.claude/docs/live-system/02-platform-dispatcher/02-create-job.md]`, and the Platform Dispatcher dashboard has a dedicated **Urgent** counter keyed off `priority = 'high'` `[LIVE:.claude/docs/live-system/02-platform-dispatcher/01-dashboard.md]`. Separately, job creation already has a **`Schedule At`** datetime field described as *"Immediate ASAP vs Scheduled"* — which maps far more closely to the client's actual Now/Scheduled concept than the priority field does.

**What to do.** These are two different fields that should probably stay two different fields, not one field to be redefined:

- **Keep** `Low`/`Medium`/`High` as an internal **dispatch urgency** indicator — it's operationally useful, already wired into UI (badges, counters), and the client never said to remove it, only that "priority" (as they use the word) doesn't affect price/routing.
- **Treat** the client's Now/Scheduled concept as best mapped onto the existing `Schedule At` field's ASAP-vs-future distinction, not onto the urgency scale.

Flag this explicitly wherever `04-platform-dispatcher/` and the mobile app touch job creation: **do not silently collapse the 3-value urgency field into the client's 2-value concept** — that would delete a working feature to satisfy a requirement that was actually describing something else. Confirm this reading with the client before final sign-off.

---

## Finding 5 — the existing "paid by" field uses the wrong parties for the new Expense feature

**The requirement.** `Q-16` (resolved): a job-tied expense (e.g. a key/key-code purchase) is tagged **paid-by-technician** or **paid-by-company** — see `.claude/docs/BRDs/07-finance-wallets-and-payments.md`, `FIN-W-013`.

**What the live system actually does.** Job Details already has a line-item cost model — `.claude/docs/live-system/01-platform-admin/04-jobs.md`, "Physical Keys / Extra Parts" — with a `Paid By` field, but its two values are **`company`** and **`customer`**, not technician and company:

> *"`Paid By`: `company` or `customer`"*

**What to do.** This existing field answers a different question — *who ultimately bears the line-item cost, the workshop or the end customer* — which is still a legitimate thing to track (e.g., a physical key the customer explicitly agreed to pay extra for). The new Expense concept from `Q-16` is narrower and internal: *did the technician front the $30 out of pocket, or did the company*. **Don't repurpose the existing `Paid By: company/customer` field** — design the new expense entry as an **additional, separate tag** (technician/company) alongside it, and make sure the job payment breakdown can show both distinctions without conflating them. See `05-company-admin/08-code-requests-expense-link.md` and the mobile app's pricing screen.

---

## Finding 6 — real screens exist that the live-system audit never wrote up

Both admin dashboards' sidebars (visible directly in `platform-settings.png` and `company-admin-settings.png`) show a **Notifications** nav item with an unread badge (51–52 items in the captured screenshots) — a working in-app notification center that has no `.md` file anywhere in `live-system/`. The Company Admin sidebar additionally shows **Jobs**, **Customer**, **Users**, and **Audit Log** nav items that were never documented (only Dashboard, Code Requests, Key Codes, Technicians, and Call Logs/Settings/Reports were captured).

**What to do.** Don't design these as if they don't exist, and don't invent their content either.

- **Notifications** almost certainly needs new event types for the new financial states (dispute opened, refund issued, weekly statement ready, archive-eligible reminder, invoice sent) — treat wiring those in as an implicit requirement of every new financial feature below, but the notification center's own UI is existing infrastructure, out of scope to redesign here.
- **Company Admin's Jobs / Customer / Users / Audit Log** pages should be assumed to exist and to roughly mirror their Platform Admin equivalents scoped to one company (this is the pattern everywhere else in the product) — but that's a hypothesis, not a confirmed spec. Before designing on top of any of these four, get them documented the same way the rest of `live-system/` was, or verify directly against the running app.
