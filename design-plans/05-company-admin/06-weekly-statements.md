# Company Admin — Weekly Statements (new)

No equivalent exists in the live system.

## 🆕 NEW PAGE: Weekly Statements

**Where:** New nav item or a tab on the Company Wallet (same either/or call as Disputes — be consistent with whichever pattern is chosen there).

**Why:** `.claude/docs/CLAUDE.md` §3 — statements auto-generate at week end (Monday 00:00 → Sunday 23:59, `FIN-S-001`); a job counts in the week it *completed*, not the week it was created (`FIN-S-002`). The Company Statement drives visibility into the business as a whole; the Technician Statement drives the weekly payout and already has its own home on the Technician Account page (`03-company-wallet-and-technician-accounts.md`) — this page is the **company-level** roll-up plus the archive of past weeks.

**What to design:**
1. **Current week card** — auto-generated, read-only, matching the exact field set from `.claude/docs/CLAUDE.md`: total revenue, total cash, total card, gateway fees, dispatch fees, refunds, disputes, company profit, wallet balance, technician balances (a mini-table of every technician's signed balance for the week, each linking through to their full Technician Account).
2. **Past statements archive** — one row per closed week, with the same fields collapsed into a summary row, expandable to the full breakdown. This is naturally a DataTable + date-range-filter use case (`02-shared-components/`).
3. **No editable field anywhere on a closed week's statement** — once Sunday 23:59 passes, the week is immutable (`FIN-S-003`). The only day-to-day editability in this entire financial system is the *current week's draft* technician report line items, already covered on the Technician Account page — don't duplicate that affordance here.
4. Since technician payout is *driven by* this statement (`.claude/docs/CLAUDE.md`), each technician row should link straight through to that technician's Account page for the settlement-confirmation action described there — this page is a dashboard/summary, not where the "Mark as Settled" action itself lives.

**Role visibility:** Company Admin only.

**States:** A company's very first week (no statement history yet) is a real Empty state for the archive section, separate from the always-present current-week card.
