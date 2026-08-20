<div dir="rtl">

# مدير الشركة: إدارة أسطول الفنيين (Technicians Fleet Management)

## 1. بيانات الصفحة
- **المسار (Route):** `/companies.admin/technicians`
- **صلاحية الدور:** `company_admin`
- **عنوان الصفحة:** `JobixFlow - Technicians Management`
- **لقطة الشاشة:** [إدارة فنيي الشركة](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/company-admin-technicians-list.png)

---

## 2. منطق الأعمال والقواعد الحاكمة
1. **حالات توافر الأسطول:**
   - **متاح (Available):** متصل وجاهز فوراً لاستقبال مهام جديدة.
   - **في وظيفة (On Job):** يباشر عملاً ميدانياً حالياً لدى عميل.
   - **غير متصل (Offline):** التطبيق مغلق أو الفني في إجازة.
2. **مقاييس بطاقة الفني:**
   - تفاصيل الاتصال المباشرة (البريد الإلكتروني، رقم الهاتف).
   - النطاق الجغرافي (مثل: `Unknown Zone` أو منطقة محددة).
   - توقيت آخر نشاط (مثل: `4 weeks ago`, `N/A`).
   - مؤشرات أداء العمليات:
     - `الوظائف النشطة (Active Jobs)`: عبء العمل المسند حالياً.
     - `المكتملة اليوم (Completed Today)`: الوظائف المنجزة اليوم.
     - `إجمالي الوظائف (Total Jobs)`: إجمالي ما أنجزه الفني تاريخياً.
3. **التعديل:**
   - خيار "Edit" لتعديل بيانات الفني ونطاقه الجغرافي.

---

## 3. تدفقات المستخدم والتفاعلات
1. ينتقل مدير الشركة إلى `/companies.admin/technicians`.
2. يفحص مؤشرات الجاهزية العلوية (`Available: 8`, `On Job: 0`, `Offline: 3`).
3. يقيّم توزيع أعباء العمل بين الفنيين قبل اعتماد المهام.

---

## 4. الاعتماديات ومخطط البيانات
- `App\Models\User`: `WHERE role = 'technician' AND company_id = {company_id}`

</div>
