<div dir="rtl">

# مرسل الشركة: التتبع المباشر للأسطول على الخريطة التفاعلية (Live Map Tracking)

## 1. بيانات الصفحة
- **المسار (Route):** `/companies.dispatcher/map`
- **صلاحية الدور:** `company_dispatcher`
- **عنوان الصفحة:** `JobixFlow - technicians`
- **لقطات الشاشة:**
  - الخريطة المباشرة: [الخريطة المباشرة التفاعلية](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-live-map.png)
  - فحص ملف الفني على الخريطة: [فحص بيانات الفني على الخريطة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-map-technician-selected.png)

---

## 2. منطق الأعمال والقواعد الحاكمة

### أ. التتبع اللحظي عبر خرائط Google Maps
1. خريطة تفاعلية متمركزة حول النطاق الجغرافي النشط للعمليات.
2. تتبع مباشر للإحداثيات:
   - **علامات الفنيين الميدانيين (Technician Pins):** علامات ملونة حسب حالة الفني (أخضر = متاح `Available`، أزرق/أصفر = مشغول في وظيفة `Busy`، رمادي = غير متصل `Offline`، أحمر = خارج الخدمة `Off Duty`).
   - **علامات مواقع الوظائف (Job Pins):** مواقع العملاء الدقيقة للوظائف النشطة.

### ب. التحكم في طبقات الخريطة (Layers Control)
- **طبقة الفنيين (Technicians):** زر تفعيل/إخفاء علامات الفنيين.
- **طبقة مواقع الوظائف (Job Locations):** زر تفعيل/إخفاء علامات مواقع العمل.

### ج. إحصائيات الأسطول الحية (Live Stats)
- عدادات فورية:
  - `متاح Available (8)`
  - `مشغول Busy (0)`
  - `غير متصل Offline (3)`
  - `خارج الخدمة Off Duty (0)`

### د. لوحة فحص الفني وقائمة "المتاحون الآن" (Available Now)
1. يؤدي الضغط على أي علامة في الخريطة أو اختيار فني من قائمة "المتاحون الآن" إلى فتح نافذة **معلومات الفني (Technician Info)**.
2. تعرض النافذة رقم الهاتف، عدد الوظائف النشطة، والمسافة لأقرب موقع عمل.

---

## 3. تدفقات المستخدم والتفاعلات

### التدفق 1: التوجيه الذكي للفني الأقرب جغرافياً
1. يفتح مرسل الشركة `/companies.dispatcher/map`.
2. يحدد موقع وظيفة جديدة على الخريطة.
3. يلاحظ أقرب فني متاح باللون الأخضر ("Available").
4. يضغط على اسم الفني في قائمة "Available Now" لفحص جهوزيته وتفاصيل الاتصال به.
5. يسند الوظيفة فوراً للفني الأقرب لتقليل زمن الاستجابة.

---

## 4. الاعتماديات ومخطط البيانات
- مكتبة Google Maps JavaScript SDK v3
- `App\Models\User`: إحداثيات موقع الفني (`latitude`, `longitude`, `last_location_update`)
- `App\Models\Job`: إحداثيات موقع العميل (`latitude`, `longitude`)

</div>
