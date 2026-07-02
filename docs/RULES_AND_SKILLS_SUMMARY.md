# סיכום חוקים וכישורים (Rules and Skills Summary)

| שם הקובץ / הכישור | סוג | מטרה | סטטוס | שימוש בפועל / עדות קונקרטית |
| :--- | :--- | :--- | :--- | :--- |
| **AGENTS.md** | Rule | חוקי בסיס, איסור הזיות על תפריטים. | בשימוש תדיר | אכיפת ציות לנתונים קיימים ב-generator.ts וב-UI. |
| **caveman** | Skill | תקשורת סופר-תמציתית לחסכון טוקנים. | בשימוש | מענה ב-12 עד 25 שורות לכל אורך פיתוח הדשבורד למלצר. |
| **menu-practice-generator** | Skill | יצירת משחק זיכרון דטרמיניסטי ללא LLM וללא המצאות. | בשימוש | מימוש פונקציית `generatePracticeRound` ב-`lib/practice/generator.ts`. |
| **responsive-learning-ui** | Skill | הדרכה לעיצוב רספונסיבי, מסך יחיד וללא קיטוע טקסט. | בשימוש | תיקון טקסט צף, כפתורים גמישים ומודלים ב-`WaiterDashboardClient.tsx`. |
| **course-submission-documenter** | Internal | כלי עזר פנימי לכתיבת מסמכי ההגשה. | כלי פנימי | שימוש לעריכת מסמך זה ומסמך שיפורי ה-AI (לא פיצ'ר אפליקטיבי ללומד). |
| **training-scenario-writer** | Skill | כתיבת תרחישי לקוח לסימולציה. | מתוכנן | בקרוב (פיצ'ר תרגול מול לקוח). |
| **menu-simulation-feedback** | Skill | הערכת דיוק וטון שירות בסימולציה. | מתוכנן | בקרוב (פיצ'ר תרגול מול לקוח). |
| **menu-upload-parser** | Skill | פירוק תפריט בעזרת Vision API. | עתידי | מחוץ ל-MVP. |
| **semantic-menu-searcher** | Skill | חיפוש סמנטי וקטורי בעזרת Supabase. | עתידי | מחוץ ל-MVP. |
