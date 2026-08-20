<div dir="rtl">

# مطالبة Stitch — الدفعة 03: بوابة مرسل المنصة (`/platform.dispatcher`)

## السياق والدور
قم بتوليد تحديثات واجهات المستخدم لـ **غرفة عمليات مرسل المنصة** في منصة JobixFlow. ركز على سهولة وسرعة إدخال البيانات، ووضوح شارات الحالة، وتصنيف أسباب الإلغاء.

## مراجع لقطات الشاشة والتحديثات المطلوبة

### 1. غرفة عمليات الإرسال
- **لقطة الشاشة المرجعية:** [platform-dispatcher-dashboard.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-dashboard.png)
- **المتطلبات:**
  - بطاقات المؤشرات: `إجمالي الوظائف`، `غير المكتملة`، `المكتملة`، و `العاجلة`.
  - جدول البث الحي: ترقيته للمكون الموحد `DataTable` مع شارات الحالة اللحظية وزر سريع "وظيفة جديدة".

### 2. إنشاء الوظيفة ونافذة العميل الفوري
- **لقطات الشاشة المرجعية:** [platform-dispatcher-create-job.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-create-job.png)، [platform-dispatcher-add-customer-modal.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-add-customer-modal.png)
- **المتطلبات:**
  - **المصدر التلقائي (`TEN-001`):** تعيين `origin: platform` تلقائياً لكافة الوظائف المنشأة هنا.
  - **الأولوية التشغيلية مقابل الموعد (`Q-05`):** الحفاظ على محدد الأولوية الثلاثي (`منخفضة`/`متوسطة`/`عاجلة`) كدرجة استجابة، بينما يحدد حقل `Schedule At` موعد الحجز الفوري أو المستقبلي.
  - **نافذة العميل الفوري:** الحفاظ على النموذج السريع لإنشاء عميل جديد دون مغادرة الصفحة.

### 3. سجل الوظائف، الإلغاء وإعادة التوجيه
- **لقطات الشاشة المرجعية:** [platform-dispatcher-job-history.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-job-history.png)، [platform-dispatcher-edit-job.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-edit-job.png)، [platform-dispatcher-start-new-chat.png](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-dispatcher-start-new-chat.png)
- **المتطلبات:**
  - **إجراء الأرشفة (`AUD-002`):** استبدال خيار "الحذف" بزر "الأرشفة" المشروط بالمدة الزمنية.
  - **مسار الإلغاء (`JOB-009`):** نافذة إلزامية لاختيار سبب الإلغاء من القائمة المعتمدة.
  - **درج المحادثة التفاعلي:** الحفاظ على المحادثة اللحظية النشطة للمرسل مع مرسل الشركة والفنيين.

</div>
