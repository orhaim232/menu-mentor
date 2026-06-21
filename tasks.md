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

### [x] משימה 5: מסך בית וכניסה
**Completed: Home page is implemented at app/page.tsx, allowing code entry and correct routing to manager setup or waiter dashboard.**
1. **מטרה:** מסך `Home` לבחירת תפקיד והזנת קוד מסעדה.
2. **אזורים רלוונטיים:** `app/page.tsx`.
3. **קריטריון הצלחה:** ניתוב נכון לפי קוד למסך מנהל או מלצר.

### [x] משימה 6: עדכון מבנה הדאשבורד ל-3 Tabs
**Completed: Added activeTab state and conditional rendering for 3 tabs (Menu Knowledge, Memory Game, Customer Simulation) in waiter dashboard.**
1. **מטרה:** ארגון הדאשבורד הקיים ל-3 אזורים בלשוניות: הכרת המנות (התוכן הקיים), משחק זיכרון, ותרגול מול לקוח.
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 5 (מסך בית וכניסה)
4. **אזורים רלוונטיים:** `app/waiter/[code]/dashboard/page.tsx`
5. **קריטריון הצלחה:** המלצר יכול לנווט בין 3 הלשוניות בדאשבורד; הנתונים הקיימים מוצגים תחת "הכרת המנות" והשאר מציגים "בקרוב".
6. **בדיקות נדרשות:** לחיצה על הלשוניות השונות בדפדפן ווידוא מעבר חלק והצגת כיתוב "בקרוב" בלשוניות החדשות.


### [x] משימה 7: יצירת ובדיקת Skill menu-practice-generator
**Completed: Created and tested menu-practice-generator with category-aware distractors, duplicate prevention, and insufficient-data fallback.**
1. **מטרה:** יצירת קובץ Skill חדש המנחה את ה-AI בייצור שאלות זיכרון עובדתיות מגוונות (למשל: זיהוי תמונה, רכיב חסר, אלרגנים, מנות טבעוניות) מתוך תפריט המסעדה.
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 6
4. **אזורים רלוונטיים:** `.agents/skills/menu-practice-generator/SKILL.md`
5. **קריטריון הצלחה:** קובץ `SKILL.md` קיים בתיקייה ומנוסח לפי הפורמט, ללא סתירות או שגיאות.
6. **בדיקות נדרשות:** פתיחה וקריאה של קובץ ה-Skill, בדיקה שכל השדות הנדרשים מתועדים ומוסברים כראוי.

### [x] משימה 8: הגדרת טיפוסי TypeScript למשחק הזיכרון
**Completed: Created TypeScript types for memory game questions, options, rounds, and local answer results.**
1. **מטרה:** הגדרת ה-TypeScript Interfaces עבור משחק הזיכרון (כמו מבנה שאלה, אפשרויות, תשובות, סבב שאלות).
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 7
4. **אזורים רלוונטיים:** `types/practice.ts` (או יצירתו)
5. **קריטריון הצלחה:** קובץ `types/practice.ts` קיים ומגדיר את כל הטיפוסים ללא שגיאות קומפילציה.
6. **בדיקות נדרשות:** הרצת `npx tsc --noEmit` או הרצת build כדי לוודא שאין שגיאות קומפילציה.
## שלב 4: אזור ניהול התפריט (Manager Menu Setup MVP)

### משימה 10: עדכון תכנון הסכמה במסמכים (בוצע)
1. **מטרה:** עדכון סכמה גנרית תומכת במסעדות שונות (`menu_categories`, `custom_attributes`).

### [x] משימה 11: כתיבת Migration עבור menu_categories והשדות החדשים
**Completed: Created and successfully applied the generic menu schema migration in Supabase.**
1. **מטרה:** יצירת קובץ SQL המכיל הוספת `menu_categories` ושדות `custom_attributes`, `service_notes`, `modification_rules`, `category_id` (במקום `category` טקסט) ו-`menu_version`.
2. **זמן:** 20 דקות.
3. **אזורים:** `supabase/migrations/` ו-`supabase/schema.sql`.

### [x] משימה 12: הרצת Migration ידנית ב-Supabase
**Completed: Created and successfully applied the generic menu schema migration in Supabase. Verified in remote DB.**
1. **מטרה:** הפעלת ה-SQL במסד הנתונים בענן ליצירת הטבלאות.

### [x] משימה 13: עדכון טיפוסי TypeScript
**Completed: Aligned database types, added MenuCategory, updated mock data, and verified build.**
1. **מטרה:** עדכון `types/database.ts` כך ש-`MenuItem` יכלול את `category_id` (במקום `category`), מערכים ו-`custom_attributes`. הוספת טיפוס `MenuCategory`.
2. **זמן:** 10 דקות.

### [x] משימה 14: עדכון פונקציות DB
**Completed: Added restaurant-scoped read functions for active menu items and menu categories.**
1. **מטרה:** עדכון `lib/db/menuItems.ts` ו-`restaurants.ts` לתמיכה בשדות החדשים וטבלאות מקושרות, כולל העלאת `menu_version`.
2. **זמן:** 30 דקות.

### [x] משימה 15: עדכון SPEC ו-tasks לאימות מנהל Invite-only
1. **מטרה:** הוספת Auth, RLS ותכנון הגנה מבוססת `restaurant_members` ב-SPEC ו-`tasks.md`.

### [x] משימה 16: תכנון Migration ל-restaurant_members, grants ו-RLS
**Completed: Planned manager membership schema, RLS policies, grants, and verification flow.**
1. **מטרה:** תכנון סכמת `restaurant_members`, והרשאות קריאה וכתיבה מתאימות למנהלים ולמלצרים.
2. **זמן:** 20-30 דקות.

### [x] משימה 17: יצירת Migration בלבד
**Completed: Created and applied manager membership RLS and tightened API table privileges in Supabase.**
1. **מטרה:** כתיבת ה-Migration עצמו כקובץ מבוסס התכנון ב-`supabase/migrations/`.
2. **זמן:** 20-30 דקות.

### [x] משימה 18: הרצה ידנית ואימות ב-Supabase
**Completed: RLS installation verified in Supabase. End-to-end testing will be completed after membership is created.**
1. **מטרה:** הפעלת ה-Migration בענן, וידוא טבלאות ו-Policies.
2. **זמן:** 20-30 דקות.

### [x] משימה 19: יצירת proxy.ts (עבור Next.js 16)
**Completed: Created lib/supabase/proxy.ts and root proxy.ts for session refresh.**
1. **מטרה:** יצירת `proxy.ts` לרענון סשן בסיסי ל-Supabase.
2. **זמן:** 20-30 דקות.

### משימה 20: יצירת Auth callback
1. **מטרה:** הגדרת `/app/auth/callback/route.ts` לאימות טוקן ה-Magic Link מול Supabase.
2. **זמן:** 20-30 דקות.

### משימה 21: יצירת מסך manager/login
1. **מטרה:** שימוש ב-`signInWithOtp` עם `shouldCreateUser: false`.
2. **זמן:** 20-30 דקות.

### משימה 22: הגנת Server Component של manager/setup
1. **מטרה:** בדיקת סשן ו-`restaurant_members` ב-`app/manager/setup/page.tsx` והפניה מתאימה ל-login.
2. **זמן:** 20-30 דקות.

### משימה 23: יצירת ושיוך מנהל הדמו
1. **מטרה:** יצירה ידנית של משתמש ב-Supabase Dashboard, שיוכו למסעדת DEMO123, וכניסה למערכת.
2. **זמן:** 20-30 דקות.

### משימה 24: רשימת מנות במסך מנהל
1. **מטרה:** בניית ממשק המציג את כל המנות הקיימות והקטגוריות שלהן במסך מנהל.
2. **זמן:** 30 דקות.

### משימה 25: יציאה (Logout)
1. **מטרה:** הוספת כפתור התנתקות מ-Supabase וחזרה לראשי.
2. **זמן:** 20-30 דקות.

### משימה 26: פעולות כתיבה מאובטחות
1. **מטרה:** עדכון Server Actions כדי להשתמש ב-`restaurant_id` מה-membership ב-DB במקום מהלקוח.
2. **זמן:** 30 דקות.

## שלב 5: משחק הזיכרון ומחולל שאלות (Memory Game MVP)

### משימה 19.1: הרחבת תפריט הדמו לאחר אישור המנות
1. **מטרה:** הגדרת מנות חסרות שיוצעו ל-Mock Data כדי להגיע ל-10-12 מנות עם חלוקה לקטגוריות.
   - **הצעת המנות לפי קטגוריות (סך הכל 12 מנות):**
     * **ראשונות (Starters - 4 מנות):** פוקאצ׳ה תנור אבן, סלט קינואה אדומה וסלק, קרפצ׳ו בקר [חדש], מרק כתומים [חדש]. *אפשרויות מקסימליות:* 4 (מנה נכונה + 3 מסיחים).
     * **עיקריות (Mains - 4 מנות):** ריזוטו פטריות כמהין, המבורגר בקר [חדש], פילה סלמון [חדש], פסטה עגבניות [חדש]. *אפשרויות מקסימליות:* 4 (מנה נכונה + 3 מסיחים).
     * **קינוחים (Desserts - 3 מנות):** פבלובה פירות יער, עוגת שוקולד [חדש], טארט לימון [חדש]. *אפשרויות מקסימליות:* 3 (מנה נכונה + 2 מסיחים).
     * **משקאות (Drinks - מנה אחת 1):** קוקטייל שקיעה. *אפשרויות מקסימליות:* 0 (לא ניתן ליצור מסיחים מאותה קטגוריה - השאלה תדולג).
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 8
4. **אזורים רלוונטיים:** `lib/db/mockData.ts` (ללא שינוי בפועל בשלב התכנון)
5. **קריטריון הצלחה:** תפריט דמו מורחב המאפשר למחולל למצוא מסיחים מגוונים לפי חוקי הקטגוריות, ללא מנות מלאכותיות.

### משימה 19.2: הגדרת טיפוס PracticeQuestionRecord
1. **מטרה:** הגדרת טיפוס `PracticeQuestionRecord`.
2. **זמן:** 20 דקות.

### משימה 19.3: יצירת טבלת practice_questions ב-Supabase
1. **מטרה:** הגדרת הטבלה החדשה בסכמה המקומית (supabase/schema.sql) על בסיס הטיפוסים.
2. **זמן:** 20-30 דקות

### משימה 19.4: יצירת מחולל שאלות דטרמיניסטי pure
1. **מטרה:** פונקציה טהורה המקבלת מנות ומייצרת שאלות חוקיות ללא גישה ישירה ל-DB.
2. **זמן:** 20-30 דקות

### משימה 19.5: ולידציה וסיכום שאלות שנדחו
1. **מטרה:** בדיקת השאלות שנוצרו, פסילת אלו שאינן עומדות בחוקים (למשל פחות מדי אפשרויות), והחזרת סיכום ריצה.
2. **זמן:** 20-30 דקות

### משימה 19.6: אינטגרציית Generate / Refresh ושמירה כ-pending
1. **מטרה:** ממשק מנהל להפעלת המחולל ושמירת השאלות ל-DB בסטטוס `pending`.
2. **זמן:** 20-30 דקות

### משימה 19.7: מסך מנהל לצפייה, אישור והשבתת שאלות
1. **מטרה:** בניית UI למנהל המציג את השאלות בסטטוס `pending` ומאפשר העברתן ל-`approved` או `disabled`.
2. **זמן:** 20-30 דקות

### משימה 19.8: שליפת עד 10 שאלות approved מהגרסה הנוכחית
1. **מטרה:** פונקציית צד-שרת השולפת מה-DB שאלות בסטטוס `approved` התואמות לגרסת התפריט הנוכחית.
2. **זמן:** 20-30 דקות

### משימה 19.9: ממשק משחק הזיכרון למלצר
1. **מטרה:** UI המריץ את השאלות שנשלפו, מערבב אותן מקומית, ומציג משוב מיידי למלצר ללא שמירת היסטוריית ציונים.
2. **זמן:** 20-30 דקות

### משימה 12: מסך בחירת תרגול מול לקוח ושאלה מהירה
1. **מטרה:** בניית לשונית "תרגול מול לקוח", ופיתוח מצב "שאלה מהירה" (Quick Question) בודדת.
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 6
4. **אזורים רלוונטיים:** `app/waiter/[code]/dashboard/page.tsx`, `app/waiter/[code]/practice/page.tsx`
5. **קריטריון הצלחה:** ניתוב לעמוד תרגול שמאפשר לענות לשאלה קצרה אחת ולקבל משוב בסוף.
6. **בדיקות נדרשות:** לחיצה על "שאלה מהירה", מענה עליה, ווידוא קבלת המשוב.

### משימה 13: המלצה ללקוח (Recommendation)
1. **מטרה:** הוספת מצב שבו הלקוח מציג צורך והמלצר מקליד המלצה חופשית.
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 12
4. **אזורים רלוונטיים:** `app/waiter/[code]/practice/page.tsx`
5. **קריטריון הצלחה:** המערכת מספקת משוב על התאמת ההמלצה לצורכי הלקוח על בסיס נתוני המנות.
6. **בדיקות נדרשות:** הזנת המלצה נכונה/שגויה ובדיקת דיוק המשוב המתקבל מה-API.

### משימה 14: שיחה מלאה ושאלות נפוצות מבוססות תפריט
1. **מטרה:** סימולציה מרובת-הודעות מבוססת תפריט, שמסתיימת בסיכום על: דיוק, בטיחות, טון והתאמה לצורך. שילוב שאלות מוגדרות מראש או AI.
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 13
4. **אזורים רלוונטיים:** `app/api/chat/route.ts` וניהול היסטוריית הצ'אט.
5. **קריטריון הצלחה:** סימולציה חלקה ללא המצאת מידע (הזיות) מחוץ לתפריט.
6. **בדיקות נדרשות:** הרצת צ'אט סימולציה מלא עם מגוון שאלות לקוח ובדיקה שאין חריגה מנתוני התפריט האמיתיים.

### משימה 15: תמונות והעלאת מנה בשלבים מתקדמים
1. **מטרה:** תמיכה בתמונות שהמנהל מעלה או איורי AI להמחשה (עם סימון ברור), והגדרות include_in_training ו-category.
2. **זמן:** 20-30 דקות
3. **תלות:** משימה 11 (או משימות מנהל קודמות)
4. **אזורים רלוונטיים:** בסיס הנתונים (`image_url`, `image_source`), `app/manager/setup/page.tsx`.
5. **קריטריון הצלחה:** כרטיס מנה מציג תמונה/איור אוטומטית לפי המקור, ואינו שואל שאלות זיהוי אם אין תמונה.
6. **בדיקות נדרשות:** העלאת תמונה כקישור/קובץ ובדיקה שהיא מוצגת בכרטיסי הלמידה ובמשחק הזיכרון.

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
