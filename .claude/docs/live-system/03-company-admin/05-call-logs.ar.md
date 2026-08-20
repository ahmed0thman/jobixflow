<div dir="rtl">

# مدير الشركة: سجلات المكالمات والإعدادات والتقارير (Call Logs & Settings)

## 1. بيانات الصفحة
- **المسارات (Routes):**
  - سجلات المكالمات: `/companies.admin/calls`
  - إعدادات الشركة: `/companies.admin/settings/1/edit`
  - تقارير الشركة: `/companies.admin/report`
- **صلاحية الدور:** `company_admin`
- **عناوين الصفحات:** `JobixFlow - calls`, `JobixFlow - settings`, `JobixFlow - report`
- **لقطات الشاشة:**
  - سجلات المكالمات: [سجلات مكالمات الشركة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-calls.png)
  - إعدادات الشركة: [إعدادات الشركة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-settings.png)
  - تقارير أداء الشركة: [تقارير الشركة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-reports.png)

---

## 2. منطق الأعمال والقواعد الحاكمة

### أ. تدقيق سجلات المكالمات (Call Logs Auditing)
- يتتبع العمليات الهاتفية الواردة والصادرة بين العملاء، المرسلين، وفنيي الأقفال الميدانيين.
- يسجل المتصل، المستقبل، مدة المكالمة، الحالة (مكتملة `Completed`، فائتة `Missed`، بريد صوتي `Voicemail`)، وروابط التسجيل والطابع الزمني.

### ب. إعدادات وملف الشركة التجاري (Company Settings)
- تعديل بيانات الشركة الرسمية:
  - `اسم الشركة *`، `البريد الإلكتروني *`، `هاتف العمل *`، `الدولة *`، `الرقم الضريبي`، و`حالة الشركة *` (`Active`, `Pending`, `Suspended`, `Deleted`).
  - العنوان التجاري: `الشارع *`، `المدينة *`، `الولاية *`، و`الرمز البريدي *`.

---

## 3. الاعتماديات ومخطط البيانات
- `App\Models\Company`: تحديث ملف الشركة التشغيلي.
- `App\Models\CallLog`: سجلات تدقيق الاتصالات الهاتفية.

</div>
