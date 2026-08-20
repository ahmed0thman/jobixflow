# Technician Mobile App — Account tab

## 🆕 NEW: My Account

**Where:** Persistent tab, always reachable regardless of active job.

**Why:** Mirrors `05-company-admin/03-company-wallet-and-technician-accounts.md`'s Technician Account page — same entity, technician's own read-mostly view of it.

**What to design:**
- Same header pattern as the admin-facing version: current commission %, and the **signed final balance** with unambiguous directionality ("You owe [company] $X" vs. "[Company] owes you $X") — never a bare signed number (`Rule 02 · R02-6`).
- This week's figures, same field set as `.claude/docs/CLAUDE.md`'s Technician Statement: job count, cash collected, card earnings, total commission, dispatch fees, gateway fees, deductions, backcharges, total paid, final balance.
- Job-level history, read-only.
- **Strictly self-scoped** — a technician must never be able to see another technician's account, activity, or figures, confirmed directly by the client as one of the "most important" constraints in the whole product (`[T2:60-61]`). This isn't just a filter default here — there should be no navigation path from this screen to any other technician's data at all.
- Past weekly statements archive, same immutability rule as the company-level version — once a week closes, nothing on it is editable from this screen (`FIN-S-003`).

**Role visibility:** Technician, own account only.

**States:** A brand-new technician with no completed jobs yet is a real Empty state for both the current-week figures and the history — design a clear "No jobs completed yet this week" message rather than a bare zeroed-out table, since this is the technician's very first thing they'll see after onboarding.
