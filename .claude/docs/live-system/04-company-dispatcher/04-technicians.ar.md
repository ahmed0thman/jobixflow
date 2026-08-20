<div dir="rtl">

# مرسل الشركة: سجل وقائمة الفنيين (Technicians Roster)

## 1. بيانات الصفحة
- **المسار (Route):** `/companies.dispatcher/technicians`
- **صلاحية الدور:** `company_dispatcher`
- **عنوان الصفحة:** `JobixFlow - Technicians`
- **لقطة الشاشة:** [سجل فنيي مرسل الشركة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-dispatcher-technicians.png)

---

## 2. منطق الأعمال والقواعد الحاكمة
1. **عرض التوجيه الميداني للأسطول:**
   - يمنح مرسل الشركة رؤية مركزة وسريعة لكافة فنيي الأقفال التابعين للشركة في الميدان.
2. **عناصر ملف الفني:**
   - الاسم الكامل والحروف الأولى للصورة الشخصية.
   - مؤشر الحالة المباشر (`Available` متاح، `Busy` مشغول، `Offline` غير متصل).
   - زر الاتصال الهاتفي المباشر.
   - عداد الوظائف النشطة المسندة إليه حالياً.

---

## 3. الاعتماديات ومخطط البيانات
- `App\Models\User`: `WHERE role = 'technician' AND company_id = {auth->company_id}`

</div>
