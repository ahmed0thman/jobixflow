# Technician Mobile App — Masked calling and customer messaging

Built from `.claude/docs/CLAUDE.md` §2, `.claude/rules/01-business-invariants.md` (`COM-001` through `COM-005`), and `.claude/docs/BRDs/00-glossary.md`'s 24-hour SMS session entry.

## 🆕 NEW: Call Customer action

**Where:** Triggered from the Active Job screen at the "Call to confirm" step, and remains available for the life of the 24-hour binding after that.

**What to design:** A single tap-to-call control — never a visible dial-out to a raw number, since there is no raw number to show (`COM-001`, `COM-003`: the technician originates calls only from inside the app). The UI should not render a phone-number field for the customer at all, anywhere in this screen or its call history — this needs to be true at the data layer the screen is built against, not just visually hidden.

**States:** In-call UI (duration timer, end-call), and a visible reminder somewhere in the flow (a small persistent badge is enough) that this call is going out over the masked Twilio number, not the technician's own line — mostly to build trust in the mechanism, since this is new behavior for a field technician to internalize.

---

## 🆕 NEW: Message Customer

**Where:** Same active-job context, alongside the call action.

**What to design:** A simple SMS-style composer. Mechanically, messages sent here leave as an ordinary SMS from the Twilio number and arrive on the customer's own native messaging app — the customer needs no app, no login (`[T2:187-191]`). The technician's *sending* side, though, is this in-app composer, not their phone's native SMS app — make this distinction clear in the screen's framing (e.g., a short label like "Sent via [Company] business line" on each outgoing bubble) so a technician doesn't confuse this with texting from their personal number.

**This is a distinct surface from any internal dispatcher chat** (if one exists on the technician side at all — the live system's job chat, `.claude/docs/live-system/02-platform-dispatcher/05-chat-and-dispatch.md`, already lists `technician` as an interactive participant for *dispatcher* coordination). Don't merge the customer-facing SMS thread with any internal chat-with-dispatcher thread — they serve different parties and the glossary explicitly calls this out as a "distinct — different surface, different mechanism" pair (`.claude/docs/BRDs/00-glossary.md`).

---

## ➕ NEW SECTION: 24-hour window indicator

**Where:** Active Job screen, and still reachable for 24h after the job closes (`COM-004`).

**Why:** The binding is time-limited and its destination changes based on who currently holds the job (`COM-004`'s reassignment clause) and, after 24h, based on job origin (`COM-005`).

**What to design:** A small, unobtrusive countdown or "Available until [time]" indicator near the call/message actions once a job is closed but still within its 24h window — mostly useful for the rare case a technician needs to follow up with a customer shortly after closing a job, so they know the channel is still live before it silently stops working.

---

## ✅ NO CHANGE / confirm only: recordings live in Twilio, not this app

Per `[T2:196-200]`, call/SMS recordings and logs for this session are stored by Twilio directly; the platform (web dashboards, specifically Company Admin's call log) displays a link, not the raw file. **The technician app itself does not need a call-recording playback UI** — that's a Company Admin surface (`.claude/docs/live-system/03-company-admin/05-call-logs.md`), already existing and out of scope for this file.
