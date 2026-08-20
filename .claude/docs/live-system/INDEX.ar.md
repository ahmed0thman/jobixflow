<div dir="rtl">

# توثيق التدقيق الميداني للنظام المباشر والهيكلية البرمجية

## نظرة عامة

تدقيق معماري وشامل لواجهات المستخدم ومنطق الأعمال عبر لوحات التحكم الأربع لمنصة **JobixFlow** من خلال الفحص المباشر وأتمتة Playwright MCP على الموقع `https://jobixflow.com`.

---

## خريطة بوابات الأدوار والمسارات

| البوابة | رمز الدور | الرابط الأساسي | المسؤوليات الرئيسية |
|---|---|---|---|
| **مدير المنصة (Platform Admin)** | `platform_admin` | `/platform` | الإشراف العام على النظام، تسجيل وانضمام الشركات، إعدادات الدول ومزودي الاتصال، التقارير المالية، سجلات التدقيق، وإدارة المستخدمين. |
| **مرسل المنصة (Platform Dispatcher)** | `platform_dispatcher` | `/platform.dispatcher` | استقبال طلبات العملاء المباشرة، إنشاء الوظائف وتحديد الأسعار التقديرية، تعيين الشركات، كتالوج أنواع الخدمات، والتواصل مع العملاء. |
| **مدير الشركة (Company Admin)** | `company_admin` | `/companies.admin` | العمليات التشغيلية للشركة، إدارة فنيي الأقفال، طلب وتوفير أكواد المفاتيح وتتبع تكلفتها، سجلات المكالمات، وتقارير الأداء. |
| **مرسل الشركة (Company Dispatcher)** | `company_dispatcher` | `/companies.dispatcher` | مراقبة الأسطول الميداني المباشر، توجيه وتعيين الفنيين، التتبع الحي على خرائط Google Maps، وإدارة المحادثات التشغيلية. |

---

## وحدات التوثيق الميداني

### 1. بوابة مدير المنصة (`/01-platform-admin/`)
- [01-dashboard.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/01-dashboard.ar.md) — نظرة عامة على المقاييس، اتجاه الإيرادات، وجدول الوظائف النشطة.
- [02-companies.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/02-companies.ar.md) — قائمة الشركات، نافذة تعديل الحالة (نشط/معلق/موقوف/محذوف)، نموذج إنشاء شركة، وتفاصيل أداء الشركة.
- [03-countries.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/03-countries.ar.md) — رموز الدول، ربط مزودي الاتصال ومزودي الواتساب، ونافذة إضافة دولة.
- [04-jobs.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/04-jobs.md) — مراقبة الوظائف عبر الشركات، عرض التفاصيل الكاملة (تفصيل التسعير، المفاتيح المادية، الدفع، المركبة، وسجل الحالات)، وتدقيق المحادثات للقراءة فقط.
- [05-reports.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/05-reports.ar.md) — نظرة عامة على أداء الفنيين، الإيرادات حسب نوع الخدمة، وملخص المقاييس الرئيسية.
- [06-customers.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/06-customers.ar.md) — دليل العملاء المركزي وسجلات الوظائف المرتبطة بهم.
- [07-users.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/07-users.ar.md) — إدارة مستخدمي المنصة، تعيين الأدوار، ونافذة إنشاء مستخدم جديد.
- [08-audit-log.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/08-audit-log.ar.md) — تتبع التغييرات على كيانات النظام وسجلات التدقيق.
- [09-settings.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/01-platform-admin/09-settings.ar.md) — إعدادات شعار وهوية المنصة.

### 2. بوابة مرسل المنصة (`/02-platform-dispatcher/`)
- [01-dashboard.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/01-dashboard.ar.md) — نظرة عامة على طلبات الإرسال، عدادات الوظائف العاجلة، وسجل الوظائف الحديثة.
- [02-create-job.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/02-create-job.ar.md) — مسار استقبال وإنشاء الوظيفة بالكامل، نافذة إضافة عميل فوري، تصنيف العنصر (مركبة/باب)، السعر التقديري والموعد.
- [03-job-history.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/03-job-history.ar.md) — بحث شامل في الوظائف، فلاتر الحالات، ونموذج تعديل الوظيفة.
- [04-service-types.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/04-service-types.ar.md) — إدارة كتالوج الخدمات ونافذة إضافة خدمة جديدة.
- [05-chat-and-dispatch.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/02-platform-dispatcher/05-chat-and-dispatch.ar.md) — محادثات الوظائف الداخلية، وتدفقات التواصل بين أطراف العمل.

### 3. بوابة مدير الشركة (`/03-company-admin/`)
- [01-dashboard.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/01-dashboard.ar.md) — لوحة التحكم التشغيلية للشركة، بطاقات التنبيه للوظائف العاجلة، ومؤشر جاهزية الفنيين.
- [02-code-requests.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/02-code-requests.ar.md) — طلبات أكواد المفاتيح من الفنيين الميدانيين، تفاصيل رقم الهيكل (VIN)، ونافذة إدخال الكود مع تسجيل المزود والتكلفة.
- [03-key-codes.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/03-key-codes.ar.md) — المستودع التاريخي لأكواد المفاتيح، تتبع الصلاحية، وتدقيق التكاليف.
- [04-technicians.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/04-technicians.ar.md) — سجل الفنيين، حالات التواجد (متاح/في وظيفة/غير متصل)، وإحصائيات أعباء العمل.
- [05-call-logs.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/05-call-logs.ar.md) — سجلات المكالمات الهاتفية وتدقيق الاتصالات.
- [06-reports-and-settings.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/03-company-admin/06-reports-and-settings.ar.md) — مقاييس أداء الشركة، إعدادات العنوان التجاري والتراخيص.

### 4. بوابة مرسل الشركة (`/04-company-dispatcher/`)
- [01-dashboard.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/01-dashboard.ar.md) — غرفة قيادة الوظائف النشطة، متتبع الفنيين المتاحين، وشريط الحالات المباشر.
- [02-active-and-incoming-jobs.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/02-active-and-incoming-jobs.ar.md) — قائمة الوظائف الواردة من المنصة، قبول الوظيفة، وتعيين الفني المناسب.
- [03-live-map.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/03-live-map.ar.md) — تتبع الأسطول الحي عبر خرائط Google التفاعلية، التحكم بالطبقات، لوحة الإحصائيات الحية، وفحص ملف الفني.
- [04-technicians.ar.md](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/04-company-dispatcher/04-technicians.ar.md) — قائمة الفنيين التابعين للشركة، تفاصيل الاتصال، وإدارة الحالات.

---

## فهرس لقطات الشاشة الحية

تم حفظ جميع لقطات الشاشة الملتقطة أثناء الفحص في المسار:
`file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/`

</div>
