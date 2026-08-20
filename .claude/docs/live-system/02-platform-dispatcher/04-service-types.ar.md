<div dir="rtl">

# مرسل المنصة: كتالوج أنواع الخدمات (Service Types Catalog)

## 1. بيانات الصفحة
- **المسار (Route):** `/platform.dispatcher/service_types`
- **صلاحية الدور:** `platform_dispatcher`
- **عنوان الصفحة:** `JobixFlow - services`
- **لقطات الشاشة:**
  - قائمة الخدمات: [أنواع الخدمات بالمنصة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-service-types.png)
  - نافذة إضافة خدمة: [نافذة إضافة خدمة جديدة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-add-service-modal.png)

---

## 2. منطق الأعمال والقواعد الحاكمة
1. **تعريف الخدمات المعتمدة:**
   - فئات خدمات الأقفال المحددة مسبقاً والمستخدمة أثناء استقبال طلبات العملاء وفي التقارير المالية (مثل: فتح سيارات، تغيير أقفال منازل، برمجة مفاتيح مشفرة).
2. **تتبع الاستخدام الميداني:**
   - يحسب النظام تلقائياً:
     - `الوظائف (Jobs)`: إجمالي الوظائف المصنفة تحت هذه الخدمة.
     - `الفنيين (Technicians)`: إجمالي الفنيين المؤهلين لتقديم هذه الخدمة.
3. **الإنشاء والتعديل:**
   - `اسم الخدمة (Service Name *)`: الاسم التعريفي الفريد للخدمة.

---

## 3. تدفقات المستخدم والتفاعلات
1. يفتح مرسل المنصة `/platform.dispatcher/service_types`.
2. يضغط على "Add Service" لتعريف نوع خدمة جديد في النظام.
3. يدخل `اسم الخدمة *` في النافذة المنبثقة ويضغط "Create Service".

---

## 4. الاعتماديات ومخطط البيانات
- `App\Models\ServiceType`: `id`, `name`, `created_at`, العلاقات: `hasMany(Job::class)`

</div>
