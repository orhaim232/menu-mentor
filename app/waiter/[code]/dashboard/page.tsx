"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import type { MenuDishLearningCardV2 } from "../../../../types/learningPath";

export default function WaiterDashboard() {
  const params = useParams();
  const rawCode = params?.code;
  const code = Array.isArray(rawCode) ? rawCode[0] : (rawCode || "DEMO123");

  const [dishes, setDishes] = useState<MenuDishLearningCardV2[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateMenuLearningPath() {
    setLoading(true);
    setError(null);
    setDishes([]);

    try {
      const res = await fetch("/api/dev/menu-learning-path");

      if (!res.ok) {
        throw new Error(`שגיאת שרת: ${res.status}`);
      }

      const json = await res.json();

      if (!json.success || !json.data?.dishes) {
        throw new Error("לא התקבלו נתוני מסלול למידה תקינים.");
      }

      setDishes(json.data.dishes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "אירעה שגיאה בעת יצירת מסלול הלמידה. אנא נסה שנית."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200/80 dark:border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                לוח אימון למלצר
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                כאן תוכל להתאמן על התפריט, אלרגנים ושיחות שירות.
              </p>
            </div>

            {/* Restaurant Code Badge */}
            <div className="text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-2 border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                קוד מסעדה
              </span>
              <span className="text-lg font-mono font-bold tracking-wider text-zinc-950 dark:text-zinc-50">
                {code}
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="generate-learning-path-btn"
            onClick={handleGenerateMenuLearningPath}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <>
                {/* Simple spinner */}
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                מייצר מסלול למידה...
              </>
            ) : (
              "צור מסלול למידה תפריטי"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 text-rose-700 dark:text-rose-400 text-sm font-medium"
          >
            ⚠️ {error}
          </div>
        )}

        {/* Dishes Cards */}
        {dishes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 px-1">
              הכר את המנות
            </h2>

            {dishes.map((dish, index) => (
              <div
                key={dish.id || index}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 overflow-hidden flex flex-col sm:flex-row"
              >
                {/* Image Placeholder */}
                <div className="w-full sm:w-1/3 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-6 min-h-[160px]">
                  <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">
                    {dish.name} (תמונה)
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6 sm:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {dish.simpleDescription}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {dish.ingredients && dish.ingredients.length > 0 && (
                      <div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">מרכיבים: </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{dish.ingredients.join(', ')}</span>
                      </div>
                    )}
                    
                    {dish.allergens && dish.allergens.length > 0 && (
                      <div>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">אלרגנים: </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{dish.allergens.join(', ')}</span>
                      </div>
                    )}
                    
                    {dish.recognitionHint && (
                      <div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">זיהוי: </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{dish.recognitionHint}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 flex flex-col gap-2">
                    {dish.memoryTip && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/50 text-sm">
                        💡 <strong>טיפ לזיכרון:</strong> {dish.memoryTip}
                      </div>
                    )}
                    {dish.familiarAssociation && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 p-3 rounded-xl border border-blue-200/50 dark:border-blue-900/50 text-sm">
                        🔗 <strong>אסוציאציה:</strong> {dish.familiarAssociation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="pt-2">
          <Link
            href="/"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold active:scale-[0.98] transition-all text-sm"
          >
            חזרה לדף הבית
          </Link>
        </div>

      </div>
    </main>
  );
}
