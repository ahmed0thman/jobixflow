# Figma AI generation prompt — Customer Payment Page (mobile, 375px)

**Tool:** Figma AI (First Draft / Figma Make), not Stitch. Paste the prompt block below directly.
**Supersedes for this tool only:** [`07-customer-payment-link.md`](07-customer-payment-link.md) was written for Stitch and predates the 2026-08-28 financial-resolution model — it doesn't know about the Service Call Fee trigger or the real `PaymentLink` data shape. This file replaces it as the source of truth for generating this screen; `07` can stay as a Stitch-format archive.
**Self-contained per `Rule 02 · R02-8`:** design system, business rules, states and data shape are all restated inline below — the generation tool cannot read this workspace.

---

## Why this screen carries more design weight than its size suggests

This is **the only customer-facing surface in the entire JobixFlow product** (`NEW-REQUIREMENTS.md §3.10`, `FIN-W-011`). Every other screen is for staff who already trust the product because they use it daily. This page has to earn a stranger's trust in one cold click from an SMS, on their own phone, with zero prior context beyond the text message that brought them here. No login, no app install, no account — `JOB-001` (the customer has no app or portal, ever) extends directly to this page.

---

## Two real triggers, one page

Grounded in the actual data model already implemented in the prototype (`frontend/src/types.ts`):

```ts
interface PaymentLink {
  url: string
  amount: number
  purpose: string                       // e.g. "Job Payment — JOB-30012" or "Service Call Fee — JOB-30045"
  status: 'sent' | 'paid' | 'expired'
  sentAt: string
  sentBy: string
}
```

1. **Job payment (the primary case, and this task's focus)** — sent once a job reaches `completed` and the customer is paying via a link rather than in-person card/cash.
2. **Service Call Fee** — sent when a company dispatcher cancels a dispatched-but-not-completed job and assesses a fee for the wasted trip (`ServiceCallFee { amount, link: PaymentLink }`, modeled in `job-completion-financial-resolution-model.md` Part B, `Q-20` still open on the fee's *calculation* logic — not its delivery mechanism, which is confirmed).

Both funnel through the identical page shell — same layout, same states, only the context copy (`purpose`) and framing sentence differ. Design **one** template with a `purpose`/charge-type variable, not two bespoke pages — this mirrors how the prototype actually built it (one `PaymentLink` record shape, two callers) and avoids the "bespoke screen per trigger" pattern this workspace's component discipline (`Rule 02 · R02-2`) argues against everywhere else, even though this specific page sits outside the dashboard/table world that rule literally governs.

---

## Design system (`Rule 02 · R02-1`) — restated inline, do not invent new tokens

- **Primary blue** `#3B82F6` / hover-active `#2563EB`
- **Page background** `#F8FAFC`; **cards** white, `12px` radius, `1px` hairline border `#E2E8F0`, soft shadow
- **Text** `#0F172A`; **muted** `#64748B`
- **Success** `#22C55E` · **warning** `#F59E0B` · **danger** `#EF4444`
- **Inputs**: `~10px` radius, `1px` gray border, leading icon where relevant, gray placeholder
- **Icons**: outline/line style (Lucide/Feather family) — a lock, shield, clock, checkmark, alert-triangle from this same family, never a different icon set
- **Type**: system UI sans-serif stack (no custom webfont loaded elsewhere in the product — match that, don't introduce one)
- **No sidebar, no top nav, no dashboard chrome of any kind.** This is the one screen in the whole product with no shell to extend — "extend, don't redesign" (`R02-1`) applies only to color/type/radii/icon language here, not layout, because there is no dashboard layout to inherit.

## Branding rule — no platform branding anywhere on this page

`FIN-W-015` states an invoice carries the **company's name only**, never the platform's logo or branding. `[ASSUMPTION, extending FIN-W-015 by direct analogy]`: apply the identical rule to this payment page — it is the same kind of company-branded, customer-facing financial artifact. **Do not add a "Powered by JobixFlow" footer, logo, or any platform mark.** The only brand identity on screen is the locksmith company's own name and phone number.

---

## Canvas and layout constraints

- **Fixed mobile-first frame: 375px wide** (iPhone SE/mini reference width), unconstrained height, vertical scroll only — never horizontal.
- Safe-area padding top and bottom (assume a notch device may render this).
- All tappable targets **≥ 44px** tall (card inputs, Pay button, retry button, tap-to-call link).
- Single column throughout. No multi-column layout at any point — this page is never viewed on desktop by design (it only exists as an SMS link opened on a phone).
- Generous vertical spacing — this is a one-shot, low-density page, not a dashboard; err toward more whitespace than the rest of the product uses.

---

## Screen 1 — Payment request (active link, `status: 'sent'`)

Top to bottom:

1. **Trust header** — company name large and bold, company phone number directly beneath in muted text, small lock/shield icon beside the name. This is the very first thing the customer sees, before any mention of money — they need to recognize *who* is asking before they'll consider *why*.
2. **Charge context card** — white card, `12px` radius:
   - Small label pill: "Job Payment" (blue tint) or "Service Call Fee" (amber tint) — the two charge types get visually distinct treatment since one is routine and the other is a fee for an incomplete job; use the existing status-pill tinted style from the rest of the product.
   - Job reference (`displayId`, e.g. `JOB-30012`)
   - Date of service
   - One-line description — the technician's final problem/work description for a Job Payment (`JOB-002`: the technician's account is authoritative), or a short cancellation-context line for a Service Call Fee (e.g. "Technician dispatched — job cancelled before completion")
3. **Amount due** — the single largest, boldest number on the page. Currency symbol generic `$` — `[OPEN, Q-14]` currency/locale is unconfirmed, don't imply a specific locale beyond a plain `$` prefix.
4. **Payment method row** — Apple Pay and Google Pay as standard OS-styled one-tap buttons side by side, above a "or pay with card" divider. `[ASSUMPTION, low-risk]`: wallet buttons are a reasonable default for a cold mobile checkout; keep them visually secondary to the card form below, not the primary path.
5. **Card form** — Cardholder Name, Card Number, Expiry, CVC, ZIP/Postal Code. Fields styled per the design-system input spec above. **Gateway-agnostic** — no vendor logo, no gateway-specific styling; `Q-03` (which gateway/gateways) is still unresolved, so the form must read as generic card entry, not tied to one provider's widget.
6. **Pay button** — full-width, primary blue, label includes the amount (e.g. "Pay $187.00"), disabled state until required fields are filled.
7. **Trust footer** — small lock icon + "Payments are processed securely" line, and a repeated "Questions? Call [Company Name] at [phone]" fallback contact line. No platform branding (see rule above).

## Screen 2 — Processing (transient, not persisted)

A brief full-card overlay state after the Pay button is tapped: spinner, "Processing your payment…", form fields dimmed/disabled beneath it. This state is never written back as a `PaymentLink.status` value — it only exists while the request is in flight.

## Screen 3 — Card declined (transient, not persisted)

Same layout as Screen 1 with an inline **danger** banner (`#EF4444` tint, alert-triangle icon) above the card form: "Your card was declined — [reason if the gateway provides one, otherwise a generic message]." The form stays populated — **except CVC, which clears** (standard practice, never re-display or retain a CVC after a failed attempt). "Try again" re-submits the same form. Like Screen 2, this is a transient in-page state, not a `PaymentLink.status` value — a decline doesn't expire or consume the link.

## Screen 4 — Success (`status` transitions to `'paid'` on the backend)

- Large success checkmark, **success green** `#22C55E`.
- "Payment received" + the amount, restated.
- Date/time of payment.
- Company name restated once more (closing the trust loop it opened on).
- A single closing line: "You may now close this page." **No further navigation is offered** — there is no other page for this customer to reach; this is a deliberate dead end (`JOB-001`: no customer account, no history to view).
- `[OPEN]`: whether a receipt/invoice is generated from *this* page is not confirmed — invoicing is a **per-job, technician-decided** action (`FIN-W-014`), not guaranteed for every payment-link transaction, so do **not** add a "Download Receipt / Invoice" button here as if it always exists. If the technician opted into an invoice for this job, its delivery is a separate, already-scoped flow (`design-prompts` invoicing note under §3.6), not this button.

## Screen 5 — Expired link (`status: 'expired'`)

- Clock/hourglass icon, **warning amber** `#F59E0B`.
- "This payment link has expired."
- No form is shown at all — nothing on this screen accepts input.
- A single next step: "Contact [Company Name] at [phone] for an updated link" with the phone number rendered as a tap-to-call link (`tel:` — this is the customer's own device, this is not the masked-number system, `COM-001`/`COM-002` don't apply here since there's no technician or dispatcher on the other end of this specific number).

## Screen 6 — Already paid (`status: 'paid'`, link opened again after settling)

- Blue info badge/checkmark (info tone, matching the product's existing blue-tint badge style).
- "This has already been paid."
- Amount, restated.
- `[OPEN]`: the current `PaymentLink` type only carries `sentAt`, not a `paidAt` timestamp — so an exact "paid on [date]" line **cannot be shown truthfully** with today's data model. Design the copy to degrade gracefully without a fabricated timestamp (e.g. omit the date rather than guess it), and flag to the developer that a `paidAt` field would close this gap if the client wants the exact date shown.
- No form, no further action implied.

---

## Explicit "do not" list

- Do not add any JobixFlow platform logo, wordmark, or "powered by" credit anywhere on any of the six screens.
- Do not design a desktop/tablet variant — this page is mobile-only by its nature (SMS link opened on a phone), design at 375px only.
- Do not add navigation, a menu, a back button to "the app," or any link to another page in the product — there is nothing else this customer can reach.
- Do not hardcode a specific payment gateway's branding into the card form (`Q-03` open).
- Do not invent an exact "paid on" timestamp for Screen 6 (see the note above) or a currency/locale beyond a plain `$` (`Q-14` open).
- Do not merge the Failed/Processing states into the persisted link-status states — they are transient UI-only states layered on top of Screen 1, not new values of `PaymentLink.status`.

---

## Role visibility

Customer only. This is not gated by any of the five platform actors (Platform Admin, Platform Dispatcher, Company Admin, Company Dispatcher, Technician) — none of them ever see this page; it exists entirely outside the authenticated product.
