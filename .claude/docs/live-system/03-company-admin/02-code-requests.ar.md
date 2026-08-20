<div dir="rtl">

# مدير الشركة: إدارة طلبات أكواد المفاتيح (Code Requests Management)

## 1. بيانات الصفحة
- **المسارات (Routes):**
  - جدول طلبات الأكواد: `/companies.admin/code_requests`
  - تفاصيل وتلبية الطلب: `/companies.admin/code_requests/{id}`
- **صلاحية الدور:** `company_admin`
- **عناوين الصفحات:** `JobixFlow - code requests`, `JobixFlow - code request`
- **لقطات الشاشة:**
  - قائمة طلبات الأكواد: [طلبات الأكواد لمدير الشركة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-code-requests.png)
  - تفاصيل طلب الكود: [تفاصيل طلب الكود الميداني](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-code-request-details.png)
  - نافذة إضافة الكود: [نافذة إدخال الكود والتكلفة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-add-code-modal.png)

---

## 2. منطق الأعمال والقواعد الحاكمة

### أ. مسار طلب الكود من فني الأقفال الميداني
1. عندما يتواجد فني الأقفال في الموقع لقص أو برمجة مفتاح سيارة مفقود دون معرفة كود القص، يقوم الفني بتقديم **طلب كود مفتاح (Key Code Request)** من تطبيقه.
2. حالات الطلب: معلق `Pending`، معتمد `Approved`، متاح `Available`، ومرفوض `Rejected`.

### ب. بيانات الطلب ومواصفات المركبة
- يستعرض مدير الشركة بيانات المركبة اللازمة لشراء الكود من مزودي الخدمة:
  - رقم الهيكل `VIN` (مثل: `ho22542909`)
  - الماركة `Brand` (مثل: `Toyota`)
  - الموديل `Model` (مثل: `Camry`)
  - سنة الصنع `Year` (مثل: `2010`)
  - رقم اللوحة ولون المركبة ورقم المحرك.

### ج. توفير الكود والمحاسبة المالية (مطابقة لملاحظات المطور)
- يتواصل مدير الشركة مع مزود الأكواد الخارجي (مثل NASTF أو الوكالات أو وسطاء الأكواد).
- يضغط على "Add Code" لتسجيل الكود.
- تطلب النافذة المنبثقة:
  - `قيمة الكود (Code Value *)`: رمز القص الأبجدي الرقمي للمفتاح.
  - `المزود (Provider *)`: اسم الجهة أو البوابة التي تم شراء الكود منها.
  - `التكلفة (Cost *)`: المبلغ الفعلي ($) المدفوع من الشركة لشراء هذا الكود.
  - `الملاحظات (Notes)`: أرقام مرجعية إضافية.
- عند الحفظ، تتحول حالة الطلب إلى `Available` أو `Approved`، ويصبح الكود متاحاً فوراً للفني في موقع العمل.

---

## 3. تدفقات المستخدم والتفاعلات

### التدفق 1: تلبية طلب كود مفتاح
1. ينتقل المدير إلى `/companies.admin/code_requests`.
2. يحدد الطلب المعلق `Pending` ويضغط "Show".
3. يراجع رقم الهيكل (VIN) وبيانات السيارة.
4. يشتري الكود من المزود المعتمد.
5. يضغط على زر "Add Code".
6. تنبثق النافذة: يدخل قيمة الكود، اسم المزود، التكلفة بالدولار، والملاحظات.
7. يضغط "Save Code".
8. يسجل النظام كود المفتاح، ويحدث حالة الطلب، ويشعر الفني الميداني فوراً.

---

## 4. الاعتماديات ومخطط البيانات

### الكيانات البرمجية:
- `App\Models\CodeRequest`: `id`, `job_id`, `technician_id`, `company_id`, `status`, `created_at`
- `App\Models\KeyCode`: `code_request_id`, `job_id`, `code_value`, `provider`, `cost`, `notes`, `obtained_by_user_id`, `status`
- `App\Models\JobVehicle`: `vin`, `brand`, `model`, `year`, `plate_number`, `engine_number`, `color`

</div>
