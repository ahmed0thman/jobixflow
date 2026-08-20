<div dir="rtl">

# مدير المنصة: سجل التدقيق وإعدادات النظام (Audit Log & Settings)

## 1. بيانات الصفحة
- **المسارات (Routes):**
  - سجل التدقيق: `/platform/audits`
  - إعدادات المنصة: `/platform/settings/1/edit`
- **صلاحية الدور:** `platform_admin`
- **عناوين الصفحات:** `JobixFlow - audits`, `JobixFlow - Settings`
- **لقطات الشاشة:**
  - سجل التدقيق: [سجل تدقيق المنصة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-audit-log.png)
  - إعدادات المنصة: [إعدادات المنصة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-settings.png)

---

## 2. منطق الأعمال والقواعد الحاكمة

### أ. نظام سجل التدقيق (Audit Logging System)
1. **تتبع التغييرات على الكيانات:**
   - يسجل كل عملية تعديل (إنشاء `Created`، تحديث `Updated`، حذف `Deleted`) عبر كافة النماذج الهامة في النظام (`الدول`, `أنواع الخدمات`, `الشركات`, `الوظائف`, `المستخدمين`, `المدفوعات`).
2. **عناصر سجل التدقيق:**
   - `المستخدم (User)`: منفذ الإجراء (مثل: `System`، `Emily Zboncak II`، أو اسم المرسل).
   - `النموذج (Model)`: اسم الكيان المتأثر.
   - `الإجراء (Action)`: نوع العملية (`Created`, `Updated`, `Deleted`).
   - `التغييرات (Changes)`: الفروقات بين القيم القديمة والجديدة.
   - `الوصف (Description)`: ملخص نصي مقروء للعملية (مثل: `User System created Country #1`).
   - `تاريخ الإنشاء (Created At)`: الطابع الزمني الدقيق للعملية.

### ب. إعدادات المنصة (Platform Settings)
1. **إدارة الهوية والشعار:**
   - يتيح لمدير المنصة رفع وتحديث الشعار الرسمي للمنصة والمستخدم في شاشات تسجيل الدخول، ترويسات الصفحات، وفواتير PDF المطبوعة.

---

## 3. الاعتماديات ومخطط البيانات

### نموذج الكيان (`App\Models\Audit`):
- `id`, `user_type`, `user_id`, `event`, `auditable_type`, `auditable_id`, `old_values`, `new_values`, `url`, `ip_address`, `user_agent`, `created_at`

</div>
