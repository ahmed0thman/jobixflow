# Company Admin — Code Requests / Key Codes: link to Expenses

Current pages: `/companies.admin/code_requests` and `/companies.admin/key_codes` (`.claude/docs/live-system/03-company-admin/02-code-requests.md`, `03-key-codes.md`). These two pages are already well-built and closely match the BRD's existing description — this is a small, precise addition, not a rebuild.

## ➕ NEW SECTION: Code fulfillment — link the cost to the job's Expense entry

**Where:** The existing "Add Code" modal (`company-admin-add-code-modal.png`) which already captures `Code Value`, `Provider`, `Cost`, `Notes`.

**Why:** A key-code purchase is the client's own worked example of a job-tied Expense (`Q-16`, `[T2:50-54]`) — right now the Code Request/Key Code flow captures the cost the *company* pays a provider, but nothing connects that cost back to the job's payment breakdown or tags who ultimately bears it (technician vs. company, `FIN-W-013`).

**What to design:**
- When a code request is fulfilled, offer the same **paid-by-technician / paid-by-company** tag used on the Job Details Expense block (`03-platform-admin/02-jobs-and-audit-updates.md`) — either inline in the existing "Add Code" modal, or as a clearly-linked follow-up step. This is the one place in the live system where the connection between "company sourced this code" and "the job's price gets reduced by this amount" needs to become explicit — today the two live in completely separate models (`KeyCode.cost` vs. the job's pricing breakdown) with no visible link.
- The Key Codes repository's existing `Cost` and `User Obtained` columns (`.claude/docs/live-system/03-company-admin/03-key-codes.md`) are good raw material for the Company Wallet's expense ledger filter (`03-company-wallet-and-technician-accounts.md`) — make sure whoever builds that ledger can trace a `KeyCode.cost` row back to this page's data, not just to a generic "expense" line with no provenance.

**Role visibility:** Company Admin, unchanged from today.
