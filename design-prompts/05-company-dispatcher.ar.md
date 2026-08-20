<div dir="rtl">

# مطالبة Stitch — الدفعة 05: بوابة مرسل الشركة (`/companies.dispatcher`)

## السياق والدور
قم بتوليد تحديثات واجهات المستخدم لـ **مركز عمليات مرسل الشركة** في منصة JobixFlow. ركز على طوابير الوظائف ثنائية المصدر (المنصة مقابل الشركة) والإرسال التفاعلي عبر الخريطة الحية.

## مراجع لقطات الشاشة والتحديثات المطلوبة

### 1. الوظائف النشطة والواردة
- **لقطات الشاشة المرجعية:** [company-dispatcher-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-dashboard.png)، [company-dispatcher-active-jobs.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-active-jobs.png)، [company-dispatcher-incoming-jobs.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-incoming-jobs.png)
- **المتطلبات:**
  - إضافة **عمود شارة المصدر (Origin)** (`منصة` مقابل `شركة`).
  - إضافة زر "وظيفة جديدة" لإدخال وظائف الشركة الخاصة فورياً.
  - الحفاظ على مسار قبول وتعيين الفني للوظائف الواردة من المنصة.

### 2. الخريطة المباشرة والتوجيه حسب القرب
- **لقطات الشاشة المرجعية:** [company-dispatcher-live-map.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-live-map.png)، [company-dispatcher-map-technician-selected.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-map-technician-selected.png)
- **المتطلبات:**
  - مساحة خريطة Google بعلامات مخصصة لمواقع الفنيين والوظائف.
  - مفاتيح التحكم بطبقات الخريطة (`الفنيين` و `مواقع الوظائف`).
  - عدادات الأسطول اللحظية (`متاح: 8`، `مشغول: 0`، `غير متصل: 3`، `خارج الخدمة: 0`).
  - بطاقة جانبية منبثقة للفني عند النقر على علامته: الحالة، الوظيفة الحالية، وزر مباشر بنقرة واحدة "إسناد للوظيفة المحددة".

</div>
