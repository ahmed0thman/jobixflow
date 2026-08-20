# Company Admin — Technicians: financial fields

Current page: `/companies.admin/technicians` (`.claude/docs/live-system/03-company-admin/04-technicians.md`).

## The gap

The live Technician entity today carries only: name/avatar, status (Available/On Job/Offline), contact details, zone, last activity, and job-count metrics (Active/Completed Today/Total). **No financial attributes exist on this page at all** — no commission rate, no cash-in-hand indicator, no balance, nothing.

Two company-level financial settings are described in the requirements but have no home anywhere in the live system:
- Commission % **per technician** (`.claude/docs/CLAUDE.md` §3 "Company settings") — not to be confused with the Platform Admin's per-*company* Commission field (see Finding 1) — these are two different percentages at two different tenancy levels, don't conflate them in design or copy.
- Dispatch fee, gateway fee — company-wide, not per-technician; see `04-settings-twilio-and-gateway.md` for where those belong.

---

## ✏️ MODIFY: Technician profile — add Commission %

**Where:** Technician create/edit (no dedicated create/edit doc exists — the live doc only mentions "'Edit' action triggers technician profile and zone updates" without detail; design a proper form here rather than assuming one exists).

**What to design:** A `Commission %` field, editable by Company Admin only (`ROL-006` — technicians are created by the company admin, and by extension their financial terms), per-technician (variable, matching the client's own description of commission as experience/capability-based, `[T2:41]`). Surface the current value on the technician's row/card in the roster table too, not just inside the edit form — a company admin balancing dispatch load benefits from seeing commission alongside availability.

**Role visibility:** Company Admin only (view and edit). Not shown to Company Dispatcher's technician roster (`04-technicians` under Company Dispatcher) — that view is about availability for dispatch, not financial terms; keep commission out of it unless the client asks otherwise.

---

## ➕ NEW SECTION: Technician card — link to Technician Account

**Where:** Company Admin's Technicians list, each technician's row/card.

**Why:** `.claude/docs/BRDs/07-finance-wallets-and-payments.md` — Technician Account is one of the three financial levels and needs to be reachable from wherever a company admin already looks at a technician.

**What to design:** A small "View Account" link/action on each technician card/row, opening the new Technician Account view (`03-company-wallet-and-technician-accounts.md`). Also surface the account's **signed balance** (owed-to or owed-by, per `Rule 02 · R02-6` — direction must be readable without inferring from a minus sign) as a compact indicator directly on the roster row, since a company admin scanning technicians for weekly settlement needs this at a glance, not three clicks away.

**Role visibility:** Company Admin.
