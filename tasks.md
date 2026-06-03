# MenuMentor - משימות פיתוח (Development Tasks)

מסמך זה מכיל משימות פיתוח מעודכנות לפי תוכנית ה-MVP.
המערכת משמשת לתרגול מלצרים על בסיס נתוני מסעדה מרובים, ללא אימות משתמשים אמיתי (Auth) וללא העלאת PDF בשלב זה.

---

## שלב 1: תשתיות ונתונים (Data Core MVP)

### [x] משימה 1: הגדרת טבלאות ליבה וסכמה בסיסית
**Completed: TypeScript interfaces and Supabase SQL schema drafted.**
1. **מטרה:** יצירת מבנה הטבלאות הבסיסי למסעדה ולתפריטים ב-TypeScript ו-SQL.

### [x] משימה 2: פונקציות מסד נתונים (TS Database Clients)
**Completed: Created basic TypeScript functions in lib/db/restaurants.ts and lib/db/menuItems.ts.**
1. **מטרה:** יצירת שכבת הקוד שתקרא ותכתוב לטבלאות המסעדות והמנות.
2. **אזורים רלוונטיים:** `lib/db/restaurants.ts`, `lib/db/menuItems.ts`.
3. **תלות:** משימה 1.
4. **קריטריון הצלחה:** פונקציות בסיסיות להכנסת ושליפת מנות/מסעדה קיימות.

### [x] משימה 3: נתוני Mock בסיסיים
**Completed: Created lib/db/mockData.ts with sample restaurant and menu items.**
1. **מטרה:** יצירת נתוני מסעדה ותפריט לדוגמה שקל להחליף.
2. **אזורים רלוונטיים:** `lib/db/mockData.ts`.
3. **תלות:** משימה 2.
4. **קריטריון הצלחה:** קיימת מסעדת ברירת מחדל עם מספר מנות לבדיקת לוגיקה.

---

## שלב 2: לוגיקת למידה (Learning Logic MVP)

### [x] משימה 4: לוגיקת בניית מסלול למידה
**Completed: Created lib/ai/learningPath.ts with OpenAI integration and fallback.**
1. **מטרה:** בניית פונקציה המנתחת תפריט ומייצרת יעדי תרגול עבור המלצר.
2. **אזורים רלוונטיים:** `lib/ai/learningPath.ts`, `app/api/learning-path/route.ts`.
3. **תלות:** משימה 3.
4. **קריטריון הצלחה:** קריאה לשרת מחזירה רשימת משימות אימון (למשל: תרגול מנות טבעוניות) מבוססות תפריט.

---

## שלב 3: ממשק משתמש (UI MVP)

### משימה 5: מסך בית וכניסה
1. **מטרה:** מסך `Home` לבחירת תפקיד והזנת קוד מסעדה.
2. **אזורים רלוונטיים:** `app/page.tsx`.
3. **קריטריון הצלחה:** ניתוב נכון לפי קוד למסך מנהל או מלצר.

### משימה 6: מסך ניהול תפריט (Manager Setup)
1. **מטרה:** ממשק הזנה ידני למנות והערות מנהל.
2. **אזורים רלוונטיים:** `app/manager/setup/page.tsx`, `components/manager/MenuForm.tsx`.
3. **קריטריון הצלחה:** מנהל יכול לראות ולהוסיף מנות באופן פשוט.

### משימה 7: דאשבורד מסלול הלמידה למלצר
1. **מטרה:** מסך המציג למלצר את המשימות שנוצרו במשימה 4.
2. **אזורים רלוונטיים:** `app/waiter/[code]/dashboard/page.tsx`.
3. **קריטריון הצלחה:** המלצר רואה מה הוא אמור לתרגל ובוחר יעד.

### משימה 8: סימולציית תרגול מלצר
1. **מטרה:** חלון צ'אט מול לקוח AI בהתאם ליעד שנבחר.
2. **אזורים רלוונטיים:** `app/waiter/[code]/practice/page.tsx`, `app/api/chat/route.ts`.
3. **קריטריון הצלחה:** שיחת AI זורמת מבוססת תפריט עם מתן משוב בסוף.

### משימה 9: חיפוש תפריט בסיסי ומהיר
1. **מטרה:** שורת חיפוש טקסטואלית לשליפת מנות/אלרגנים (ללא pgvector).
2. **אזורים רלוונטיים:** `components/search/FastSearch.tsx`.
3. **קריטריון הצלחה:** ניתן לחפש מנה ולקבל תוצאה מיידית.

---

# Phase 5 - Course Submission and AI Documentation

* [x] Updating AGENTS.md into a project-specific AI rules file.
* [x] Reviewing existing skills:
  * menu-simulation-feedback
  * training-scenario-writer
* [x] Creating missing skills later:
  * menu-upload-parser
  * semantic-menu-searcher
  * course-submission-documenter
* [x] Creating a rules and skills summary table.
* [x] Documenting 5 actions used to improve AI results and reduce context.
* [ ] Writing a short course reflection.
* [ ] Updating README.md later so it describes MenuMentor instead of the default Next.js text.
* [x] Explaining the connection between MonumentorSpec.md and the final developed product.
* [ ] Checking technical gaps later, such as missing Vercel AI SDK and missing folders.
