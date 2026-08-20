# 00 · Glossary

Canonical vocabulary. Every other BRD uses these terms exactly as defined here. Arabic originals are given because both sources are Arabic and terms must be traceable back to them.

## Two terms that mean two different things — read this first

These cause more misreading of the sources than anything else.

### العميل — "customer" *or* "client"

The sources use one word for two unrelated parties:

| Meaning | Who | Example |
|---|---|---|
| **Customer** | The end customer — a stranded motorist who phones for a lockout service | `[T:51]` "the customer calls by phone… he receives the customers' requests" |
| **Client** | The system owner who commissioned JobixFlow and is paying for this work | `[T:200]` "the file the client sent"; `[T:438]` "the client said the dispatcher adds a preliminary price" |

**In this workspace these are never conflated.** "Customer" always means the end customer. "Client" always means the system owner. When reading the transcript, `[T:200-220]` and `[T:438]`, `[T:528-533]` are about the client; almost everywhere else it is the customer.

### الشركة — "company" *or* "manufacturer"

| Meaning | Who |
|---|---|
| **Company** | A locksmith workshop operating on the platform — a tenant. This is the default meaning throughout. |
| **Manufacturer** | The vehicle manufacturer, or an authorised code provider, that issues key codes. Appears only in key-code contexts, e.g. `[T:108]` "the company that manufactured the vehicle". |

In this workspace the tenant is always **Company**; the code source is always **Provider** or **Manufacturer**.

## Actors

| Term | Arabic | Definition |
|---|---|---|
| **Platform** | المنصة | The JobixFlow system itself, and the business operating it. |
| **Platform Admin** | الادمن بتاع المنصة | Oversees the whole platform, onboards companies, monitors everything. Does not create jobs. |
| **Platform Dispatcher** | الديسباتشر بتاع المنصة | Answers customer calls, creates jobs, assigns them to companies. Internally also called "First Line"; the client's own term for the role is **"Platform Dispatch"** `[T2:26-27]`. |
| **Company** | الشركة / الورشة | A locksmith workshop operating as a tenant on the platform. Also called *workshop*. |
| **Company Admin** | الادمن بتاع الشركة | Runs one company. Creates technicians, sources key codes, holds company settings. |
| **Company Dispatcher** | الديسباتشر بتاع الشركة | Assigns jobs to technicians within one company and monitors them. |
| **Technician** | الفني | Field worker employed by a company. Works from the mobile app only. |
| **Customer** | العميل | The end customer requesting service. Has no app, portal or login — contact is by phone only. |
| **Client** | العميل | The system owner who commissioned the platform. Never a system user role. |

## Work

| Term | Arabic | Definition |
|---|---|---|
| **Job** | الوظيفة | One service request from intake to payment. The central entity of the system. |
| **Service type** | السيرفس تايب | The category of work requested — emergency lockout, lock installation, key duplication, safe opening, rekey. Maintained as a list by the platform and companies. |
| **Priority** | الاولوية | Job urgency, set by the platform dispatcher. **Resolved** `[T2:139-143]`: a binary flag, "Now" or "Scheduled" (a later day), with no effect on price, category, or which technician receives the job — see `Q-05`. |
| **Origin** | — | Whether a job came from the platform or from the company's own customers. Coined in this workspace; the sources describe the concept without naming it. See `TEN-001`. |
| **Preliminary price** | سعر مبدئي | Indicative price entered by the platform dispatcher from the customer's phone description. Not binding. |
| **Final price** | — | The price set by the technician after inspecting the job. Authoritative — see `JOB-002`. |
| **Service Call Fee** | — | A standalone charge covering a technician's wasted trip when a dispatched job doesn't reach completion — distinct from the job price, dispatch fee, and gateway fee. New concept, surfaced `[T2:105-124]`; calculation and assessment unconfirmed — see `Q-20`. |
| **Cancellation reason** | سبب الإلغاء | A required, tagged reason attached to any job cancellation. Only three examples confirmed so far (customer resolved it themselves, customer did not answer, wrong details) `[T2:102]`; the full enum was promised by the client separately and has not yet arrived — see `Q-21`. |

## Vehicle access

| Term | Arabic | Definition |
|---|---|---|
| **Key code** | الكي كود | An electronic code that opens a vehicle, obtained from the manufacturer or an authorised provider using the vehicle's identifying data. |
| **Physical key** | فيزيكال كي | A conventional cut key produced on site. Paid for out of the technician's own pocket. |
| **VIN / chassis number** | رقم الشاسيه | The vehicle identification number the technician reads off the car. The input required to request a key code, and the search key for reusing an old one. |
| **Code Request** | كود ريكويست | A technician's request to the company for a key code. Records provider, cost and notes. |
| **Provider** | البروفايدر | The party supplying a key code — the vehicle manufacturer, or a third party the manufacturer has authorised `[T:492]`. |

## Money

| Term | Arabic | Definition |
|---|---|---|
| **Wallet** | المحفظة | **Resolved** `[T2:6-16]`: a derived transaction log / source of truth, not an account with transferable balances — see `Q-01`. No technician-to-technician or peer transfer exists anywhere in the product. |
| **Platform Wallet** | محفظة المنصة | Belongs to the platform owner. Covers only companies using the platform's payment gateway. |
| **Company Wallet** | محفظة الشركة | One per company, fully isolated from every other company. |
| **Technician Account** | الحساب المالي للفني | A technician's financial standing with their company. The sources deliberately call this an *account*, not a wallet. |
| **Commission** | نسبة العمولة | The technician's percentage share of a job, configured per technician by the company. |
| **Dispatch fee** | رسوم الديسباتش | A per-job fee deducted from the technician's earnings. |
| **Gateway fee** | رسوم بوابة الدفع | Payment processing fee. Defaults to 3%, editable `[C:§Financial/Fees]`. |
| **Expense** | المصروفات | **Resolved** `[T2:47-54]`: a job-tied operational cost only (e.g. a key or key-code purchase), deducted from the job's gross before commission math and tagged paid-by-technician or paid-by-company. Not a general business-expense ledger — see `Q-16`. |
| **Invoice** | الفاتورة | **Resolved** `[T2:202-211]`: a real, per-job, technician-triggered document, issued under the company's own name only — never the platform's name or branding. See `Q-12`. |
| **Backcharge** | — | A debt raised against a technician who was already paid for a job that later lost a dispute. |
| **Dispute / Chargeback** | النزاع | A bank-initiated challenge to a payment, arriving through the payment gateway's own dispute API with an evidence window. Distinct from a Refund — see below. Always linked to Job, Invoice, Payment and Technician. |
| **Refund** | المبالغ المسترجعة | An informal, company-initiated goodwill return of money (full or partial) after a customer complaint call — distinct from a Dispute/Chargeback, which originates at the customer's bank `[T2:159-169]`. |
| **Adjustment** | تعديل مالي | A manual financial correction, recorded as its own transaction because balances are never edited directly. |
| **Financial Transaction** | العمليات المالية | One immutable row in the append-only ledger. Every financial event creates one. |
| **Weekly statement** | الكشف الأسبوعي | An automatic end-of-week summary, produced per company and per technician. Drives technician payouts. |
| **Financial week** | — | Monday 00:00 to Sunday 23:59. A job belongs to the week it *completed* in. |
| **Cash in hand** | — | Money a technician has collected in cash and still owes the company. |

## Communications

| Term | Definition |
|---|---|
| **Twilio number** | A proxy phone number that masks the real numbers of both customer and technician. Each company supplies its own, and can change it at any time it chooses — not fixed to any renewal cycle `[T2:146]`. Only call/message logs are retained across a number change; records are not versioned against a specific number. |
| **Binding / Session** | The link between a customer number, a technician number, a Twilio number and a Job ID. Survives 24 hours past job close, then is disabled. During a job reassignment, the binding follows whichever technician currently holds the job, not the originally assigned one `[T2:129]`. After 24 hours, routing goes to the company dispatcher for company-relevant jobs or back to the platform for platform-sourced jobs `[T2:131-137]`. |
| **Chat** | Per-job messaging between dispatchers and technicians, inside the platform's own UI. Both admin roles observe without posting. **Distinct** from the customer-facing 24-hour SMS session below — different surface, different mechanism. |
| **24-hour SMS session** | The technician's customer-facing messaging, sent from inside the app over the masked Twilio number and received by the customer as an ordinary SMS on their native phone app — no customer-side app or login involved `[T2:187-191]`. Recordings/logs for this session live in Twilio itself; the platform stores and displays a link, not the raw file `[T2:196-200]`. |

## System

| Term | Definition |
|---|---|
| **Tenant** | One company's fully isolated data domain. |
| **Audit log** | An immutable record of create, update and delete actions. **Scoped by infrastructure, not blanket-wide** `[T2:30-34]`: it certifies operations conducted through the platform's own systems; a company that runs entirely on its own payment gateway and its own Twilio number is excluded, out of respect for that company's independent standing — see `AUD-001` and `Q-06`. |
| **Dashboard** | One of the four web interfaces — Platform Admin, Platform Dispatcher, Company Admin, Company Dispatcher. The technician's mobile app is separate and is not called a dashboard. |

## Naming note

The existing design screenshots are branded **"LockAccess Pro"** `[FIG:Dashboard]`, while this workspace and the project directory are named **JobixFlow** `[T:157]`. Which name ships is unresolved — see `Q-09`.
