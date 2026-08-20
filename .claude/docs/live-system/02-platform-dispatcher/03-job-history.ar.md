<div dir="rtl">

# مرسل المنصة: سجل وإدارة الوظائف (Job History & Management)

## 1. بيانات الصفحة
- **المسارات (Routes):**
  - قائمة الوظائف: `/platform.dispatcher/jobs`
  - تعديل الوظيفة: `/platform.dispatcher/jobs/{id}/edit`
- **صلاحية الدور:** `platform_dispatcher`
- **عناوين الصفحات:** `JobixFlow - Jobs`, `JobixFlow - Edit Job`
- **لقطات الشاشة:**
  - سجل الوظائف: [سجل وظائف مرسل المنصة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-job-history.png)
  - شاشة تعديل الوظيفة: [تعديل الوظيفة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-edit-job.png)

---

## 2. منطق الأعمال والقواعد الحاكمة
1. **مراقبة وإدارة الوظائف للمرسل:**
   - تصميم تشغيلي قائم على البطاقات يوضح هاتف العميل، عنوان الموقع، الشركة المسند إليها العمل، تاريخ الإنشاء، السعر، الأولوية، والحالة الحالية.
2. **البحث والتصفية:**
   - بحث نصي شامل بأرقام الوظائف، أسماء العملاء، والعناوين.
   - فلترة حسب كافة الحالات التشغيلية (`New Job`, `Assigned to Company`, `Assigned to Technician`, `Technician On The Way`, `Technician Arrived`, `Work In Progress`, `tech request code`, `company get code`, `Completed`, `Cancelled`, `Company Refused`, `Technician Refused`, `Low`, `Medium`, `High`).
3. **الإجراءات السريعة في كل بطاقة وظيفة:**
   - `show chat`: الدخول المباشر لغرفة المحادثة الخاصة بالوظيفة.
   - `edit`: فتح شاشة التعديل الكاملة لبيانات الوظيفة.
   - `delete / reassign`: إجراءات الإلغاء أو إعادة التوجيه.

---

## 3. تدفقات المستخدم والتفاعلات
1. يفتح مرسل المنصة `/platform.dispatcher/jobs`.
2. يبحث عن وظيفة جديدة `New Job` غير مسندة أو يتابع الوظائف الجارية.
3. يضغط على `show chat` للتنسيق الفوري مع مرسل الشركة المسند إليها العمل.
4. يضغط على `edit` إذا طلب العميل تعديل العنوان أو الموعد.

---

## 4. الاعتماديات ومخطط البيانات
- `App\Models\Job`: استعلام مقسم لصفحات مع جلب العلاقات (`customer`, `company`, `technician`, `serviceType`).

</div>
