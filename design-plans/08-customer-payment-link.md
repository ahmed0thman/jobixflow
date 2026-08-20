# Customer Payment Link (new)

## The gap

Confirmed absent on both sides of the comparison. `.claude/docs/BRDs/07-finance-wallets-and-payments.md`: *"no UI was ever made for it from the start."* The live system's Job Details payment-method field already includes **`Payment Link`** as a selectable value (`.claude/docs/live-system/01-platform-admin/04-jobs.md`) — so the data model anticipates this feature — but no screenshot, route, or doc anywhere in `live-system/` shows the actual customer-facing page. This is the one genuinely green-field item in the entire gap analysis with essentially zero existing material on either side to build from.

## 🆕 NEW PAGE: Standalone customer payment page

**Where:** A mobile-web page reached via SMS link, entirely outside any dashboard — no login, no app (`JOB-001`: the customer has no app or portal at all, ever).

**Why this page carries more design weight than its size suggests:** it is **the only customer-facing surface in the entire product** (`.claude/docs/BRDs/07-finance-wallets-and-payments.md`). Every other screen in this project is for platform/company/technician staff who already trust the product because they work with it daily. This page has to earn a stranger's trust in one cold, unsolicited SMS click, on their phone browser, with no prior context beyond whatever the message text says.

**What to design:**
1. **Trust signaling first** — company name prominently (never the platform's — same branding rule as invoices, `FIN-W-015`), job reference, amount, and a brief description of what this charge is for, before any payment field appears. A stranger arriving cold needs to recognize *why* they're being asked for money before they'll enter a card number.
2. **Amount and job context** — job ID/reference, service performed (technician's final description, `JOB-002`), itemized if useful (matches the breakdown principle used everywhere else, `Rule 02 · R02-6`) but kept simple — this is not a dashboard, it's a one-shot payment screen.
3. **Card form** — routed through whichever gateway the company has configured (their own, or the platform fallback, per `FIN-W-007`) — the customer never sees or needs to know which.
4. **States, all of which need their own explicit design, not a generic error page:**
   - **Success** — clear confirmation, no further action implied.
   - **Failure** — retry path, doesn't lose entered data unnecessarily.
   - **Expired** — link has a lifespan; explain what to do next (call the company back), don't just show a dead page.
   - **Already paid** — a customer clicking an old link after already paying by another method (cash on site, say) shouldn't hit a confusing form; show them a simple confirmation that this is already settled.
5. **No navigation, no other product surface reachable from here** — this page is a dead end by design, consistent with the customer having no account, no history, and no other reason to ever be on this domain.

**Role visibility:** Customer only — the one and only screen in this entire product a customer ever sees.

**Open dependency:** which gateway(s) route this page is still capped by `Q-03` (gateway names unconfirmed) — the payment-form component should be built gateway-agnostic (a card-entry shell that can point at whichever provider's SDK/checkout is eventually wired in) rather than hardcoded to one vendor's widget.
