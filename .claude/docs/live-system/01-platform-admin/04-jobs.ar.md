<div dir="rtl">

# مدير المنصة: مراقبة وتدقيق الوظائف (Jobs Monitoring & Auditing)

## 1. بيانات الصفحة
- **المسارات (Routes):**
  - جدول الوظائف: `/platform/jobs`
  - تفاصيل الوظيفة: `/platform/jobs/{id}`
  - تدقيق المحادثات: `/jobs/{id}/chat`
- **صلاحية الدور:** `platform_admin`
- **عناوين الصفحات:** `JobixFlow - jobs`, `JobixFlow - job_chat #{id}`
- **لقطات الشاشة:**
  - قائمة الوظائف: [قائمة الوظائف](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-jobs-list.png)
  - تفاصيل الوظيفة: [عرض تفاصيل الوظيفة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-details.png)
  - تدقيق المحادثات (للقراءة فقط): [محادثة الوظيفة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-chat.png)
  - استعراض رسائل المحادثة: [استعراض محادثة الوظيفة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-job-chat-open.png)

---

## 2. منطق الأعمال والقواعد الحاكمة

### أ. آلة حالات دورة حياة الوظيفة (Lifecycle State Machine)
تنتقل الوظائف عبر مسار حالات محدد بدقة:
`New Job` (وظيفة جديدة) -> `Assigned to Company` (معينة لشركة) -> `Assigned to Technician` (معينة لفني) -> `Technician On The Way` (الفني في الطريق) -> `Technician Arrived` (وصل الفني) -> `Work In Progress` (العمل جارٍ) -> (`tech request code` / `company get code` - طلب/توفير الكود) -> `Completed` (مكتملة) أو (`Cancelled` ملغاة / `Company Refused` رفض الشركة / `Technician Refused` رفض الفني).

### ب. نموذج تفصيل التسعير (Pricing Breakdown)
تتتبع كل وظيفة مكونات مالية متعددة المستويات:
1. **السعر التقديري (Estimate Price):** السعر التقريبي المبدئي المسجل أثناء استقبال الطلب.
2. **المفاتيح المادية وقطع الغيار الإضافية (Physical Keys):** بنود تفصيلية تشمل:
   - نوع البند (مثل: مفتاح مادي `Physical Key`، جهاز تحكم `Remote Fob`، كالون قفل `Lock Hardware`).
   - مبلغ التكلفة ($).
   - `الجهة الدافعة (Paid By)`: الشركة `company` أو العميل `customer`.
   - `حالة الدفع (Payment Status)`: مدفوع `Paid` أو غير مدفوع `Unpaid`.
   - ملاحظات الفني التشغيلية.
3. **السعر النهائي (Final Price):** الإجمالي الكلي المحسوب شامل المصنعية، سعر الخدمة، والمواد المستهلكة المفوترة.

### ج. تتبع تفاصيل الدفع
- يسجل النظام `المجموع الفرعي (Subtotal)`، `المبلغ الإجمالي (Total Amount)`، `تاريخ الدفع`، `طريقة الدفع` (رابط دفع `Payment Link`، نقداً `Cash`، بطاقة `Card`)، `رقم المعاملة (Transaction ID)`، `الرقم المرجعي (Reference Number)`، و`حالة الدفع (Payment Status)`.

### د. تدقيق المحادثات (إنفاذ قاعدة ROL-004)
- يملك مدير المنصة حق القراءة الشاملة لكافة المحادثات.
- **قراءة فقط بشكل صارم:** يتم تعطيل حقل إدخال الرسائل مع ظهور نص `👁 Only Show`، وتعطيل زر الإرسال. يستطيع مدير المنصة فحص سجل المحادثات الكامل بين مرسلي المنصة ومرسلي الشركات والفنيين دون إمكانية إرسال رسائل.

---

## 3. تدفقات المستخدم والتفاعلات

### التدفق 1: تصفية وفحص سجل الوظيفة
1. ينتقل المدير إلى `/platform/jobs`.
2. يقوم بتصفية الوظائف حسب الحالة (مثل: `Cancelled`, `High Priority`, `Today`) أو البحث برقم الوظيفة أو اسم العميل.
3. يضغط على زر الإجراءات `...` -> "Show" (`/platform/jobs/{id}`).
4. يراجع المدير:
   - المعلومات العامة: مرسل المنصة، مرسل الشركة، الشركة المعينة، الفني، الموعد، الاحتياج لمفتاح أو كود.
   - التسعير والقطع: التفصيل المالي للقطع الإضافية ومن يدفعها.
   - تفاصيل الدفع: معرف المعاملة البنكية وحالة السداد.
   - بيانات العميل: الاسم، العنوان، الهاتف، والبريد.
   - بيانات المركبة: رقم الهيكل (VIN)، الشركة المصنعة، الموديل، سنة الصنع، رقم اللوحة، رقم المحرك، واللون.
   - الخط الزمني للحالات (Status Timeline): سجل تدقيق تاريخي بالوقت والتاريخ، مع توضيح الحالة السابقة والجديدة والمستخدم المسؤول مع دوره.

### التدفق 2: تدقيق المحادثات والتواصل
1. في شاشة تفاصيل الوظيفة، يضغط المدير على "Open Chat" (أو خيار "Chat" من القائمة).
2. ينتقل إلى `/jobs/{id}/chat`.
3. تعرض القائمة الجانبية أطراف المحادثة.
4. يضغط المدير على المحادثة لقراءة الرسائل مرتبة زمنياً بالكامل.

---

## 4. حالات الاستخدام والحالات الحدية (Edge Cases)

| الحالة | السيناريو | السلوك المتوقع |
|---|---|---|
| **تسوية نزاع مالي** | اعتراض العميل على تكلفة مفتاح إضافي مسجلة في الموقع | يفحص المدير بند "Pricing Details" للتحقق مما إذا كانت القطعة مسجلة على أنها `Paid By: customer` مع مراجعة الخط الزمني للحالات. |
| **فشل عملية الدفع** | إخفاق بوابة الدفع الإلكتروني في تحصيل رابط الدفع | تظهر شارة الدفع باللون الأحمر `Failed` وتبقى الوظيفة معلقة مالياً. |
| **محاولة الكتابة في المحادثة** | محاولة المدير إرسال رسالة في شاشة المحادثة | حقل الكتابة معطل برمجياً (`disabled`) مع ظهور شارة المراقبة `👁 Only Show`. |

---

## 5. الاعتماديات ومخطط البيانات

### الكيانات البرمجية (Entities):
- `App\Models\Job`: `id`, `company_id`, `technician_id`, `platform_dispatcher_id`, `company_dispatcher_id`, `customer_id`, `status`, `priority`, `estimated_price`, `final_price`, `needs_key`, `needs_code`, `scheduled_at`
- `App\Models\JobCost`: `job_id`, `cost_type`, `cost`, `paid_by`, `payment_status`, `notes`
- `App\Models\Payment`: `job_id`, `amount`, `subtotal`, `payment_method`, `transaction_id`, `reference_number`, `status`
- `App\Models\JobVehicle`: `job_id`, `vin`, `brand`, `model`, `year`, `plate_number`, `engine_number`, `color`
- `App\Models\JobStatusLog`: `job_id`, `user_id`, `from_status`, `to_status`, `created_at`
- `App\Models\ChatMessage`: `job_id`, `sender_id`, `recipient_id`, `message`, `type`, `created_at`

</div>
