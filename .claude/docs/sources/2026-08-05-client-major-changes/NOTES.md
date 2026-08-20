# Source notes — Client requirements: major changes

**Received:** on or before 2026-08-05 (sent by the client to Eng. Zeinab, forwarded to the designer around the handover meeting; no precise timestamp is recorded in the material).
**Author:** the client (system owner), writing in Arabic.
**Original location:** `client/features/major-changes.txt` — left in place, copied here.
**Citation tag:** `[C:§<section>]`

## What this source is

The client's own written statement of what must be built. Unlike the meeting transcript this is **deliberate, structured prose**, not speech — it is the highest-authority source in this workspace and wins wherever it conflicts with the transcript.

It is also unusually specific for a client document. The financial section is close to specification-grade: it names exact fee defaults, dispute win/loss outcomes, weekly cycle boundaries, and a required transaction-record schema. Where this file is detailed, the BRDs can be detailed. Where it is silent, no amount of transcript reading will substitute.

## Structure and section tags

| Lines | Tag | Content |
|---|---|---|
| 1–37 | `§Twilio` | Masked calling and SMS via Twilio — number binding, callback routing, 24h persistence |
| 41–46 | `§Financial/Overview` | Multi-tenant SaaS framing, three financial levels |
| 55–71 | `§Financial/PlatformWallet` | Scope and contents of the platform wallet |
| 75–89 | `§Financial/CompanyWallet` | Per-company wallet, isolation requirement |
| 93–108 | `§Financial/TechnicianAccount` | Technician's financial relationship with the company |
| 112–134 | `§Financial/PaymentCalc` | Cash flow vs. card flow arithmetic |
| 138–146 | `§Financial/Fees` | Dispatch fee, gateway fee (3% default), per-deduction records |
| 150–158 | `§Financial/CompanySettings` | Commission %, fees, gateway choice |
| 162–187 | `§Financial/Disputes` | Dispute linkage, freeze/backcharge, win and loss outcomes |
| 191–205 | `§Financial/WeeklyCycle` | Mon 00:00 → Sun 23:59, auto-generated statements |
| 207–237 | `§Financial/Statements` | Company weekly statement, technician weekly statement |
| 241–266 | `§Financial/Reports` | Company report set, technician report set |
| 270–301 | `§Financial/Transactions` | Append-only ledger, operation types, required record fields |
| 305–341 | `§Twilio` (duplicate) | Byte-for-byte repeat of lines 1–37 apart from bullet characters |

## Caveats

- **The Twilio section appears twice**, at lines 1–37 and again at 305–341. The content is identical; only the bullet glyphs differ. Cite the first occurrence.
- **Silent on the platform's commercial terms.** The file lists "platform commission" as a component of the Platform Wallet but never states a rate or how it is calculated. This directly contradicts what the developer reports the client said verbally — see the open questions.
- **Silent on non-financial UI.** Chat, notifications, the map, key codes, the audit log and reporting screens are not addressed here at all. Everything known about those comes from the transcript.
- **Uses "wallet" without defining it.** Whether a wallet holds transferable money or is a derived balance view is never stated, and this is the single largest ambiguity in the project.
- **Gateways named only in passing** — Stripe, Square and Authorize.net appear as examples inside a parenthetical at `§Financial/PlatformWallet`, not as a confirmed integration list.
