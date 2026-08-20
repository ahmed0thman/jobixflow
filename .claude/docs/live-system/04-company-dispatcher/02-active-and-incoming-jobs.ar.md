<div dir="rtl">

# مرسل الشركة: إدارة الوظائف النشطة والواردة (Active & Incoming Jobs)

## 1. بيانات الصفحة
- **المسارات (Routes):**
  - الوظائف النشطة: `/companies.dispatcher/jobs`
  - الوظائف الواردة: `/companies.dispatcher/incoming-jobs`
- **صلاحية الدور:** `company_dispatcher`
- **عناوين الصفحات:** `JobixFlow - active jobs`, `JobixFlow - incoming jobs`
- **لقطات الشاشة:**
  - الوظائف النشطة: [لوحة الوظائف النشطة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-active-jobs.png)
  - الوظائف الواردة: [طابور الوظائف الواردة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-incoming-jobs.png)

---

## 2. منطق الأعمال والقواعد الحاكمة

### أ. طابور الوظائف الواردة وقبول الشركة (Incoming Jobs Queue)
1. عندما يسند مرسل المنصة وظيفة لشركة معينة، تدخل الوظيفة في قائمة **الوظائف الواردة** بحالة `status: Assigned to Company`.
2. يقيّم مرسل الشركة موقع العميل، السعر المقدر، ومدى توفر فني مناسب.
3. الإجراءات المتاحة:
   - **قبول وتعيين فني (Accept & Assign):** تتحول حالة الوظيفة إلى `Assigned to Technician` ويتم إرسال إشعار فوري للفني المحدد.
   - **رفض الوظيفة (Refuse Job):** تتحول حالة الوظيفة إلى `Company Refused` وتعود تلقائياً لطابور مرسلي المنصة مع توضيح سبب الرفض.

### ب. الدورة التشغيلية للوظائف النشطة
1. تتبع تقدم الفني الميداني بالوقت الفعلي:
   - `Technician On The Way` (في الطريق) -> `Technician Arrived` (وصل الموقع) -> `Work In Progress` (بدء العمل) -> `Completed` (اكتملت).
2. يستطيع المرسل فتح المحادثة المباشرة للوظيفة في أي مرحلة للتواصل مع الفني أو مرسل المنصة.

---

## 3. تدفقات المستخدم والتفاعلات

### التدفق 1: قبول الوظيفة الواردة وتوجيه الفني
1. يفتح المرسل `/companies.dispatcher/incoming-jobs`.
2. يفحص بطاقات الوظائف الواردة (العميل، الموقع، السعر، الأولوية).
3. يختار الفني المتاح من القائمة المنسدلة.
4. يضغط "Accept & Dispatch".
5. تنتقل الوظيفة فوراً من طابور الوارد إلى `/companies.dispatcher/jobs` بحالة `Assigned to Technician`.

---

## 4. الاعتماديات ومخطط البيانات
- `App\Models\Job`: `WHERE company_id = {auth->company_id}`
- أحداث الدورة التشغيلية لتحديث `technician_id` والحالة، وإطلاق الإشعارات لتطبيقات الجوال.

</div>
