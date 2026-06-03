"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import type { LearningPathGoal } from "../../../../types/learningPath";

// Maps difficulty values to Hebrew labels and color classes
const DIFFICULTY_LABELS: Record<string, { label: string; classes: string }> = {
  beginner: {
    label: "מתחיל",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  },
  intermediate: {
    label: "בינוני",
    classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  },
  advanced: {
    label: "מתקדם",
    classes: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  },
};

export default function WaiterDashboard() {
  const params = useParams();
  const rawCode = params?.code;
  const code = Array.isArray(rawCode) ? rawCode[0] : (rawCode || "DEMO123");

  const [goals, setGoals] = useState<LearningPathGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateLearningPath() {
    setLoading(true);
    setError(null);
    setGoals([]);

    try {
      const res = await fetch("/api/dev/learning-path");

      if (!res.ok) {
        throw new Error(`שגיאת שרת: ${res.status}`);
      }

      const json = await res.json();

      if (!json.success || !json.data?.goals) {
        throw new Error("לא התקבלו נתוני מסלול למידה תקינים.");
      }

      setGoals(json.data.goals);
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
            onClick={handleGenerateLearningPath}
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
              "צור מסלול למידה"
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

        {/* Goal Cards */}
        {goals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 px-1">
              מסלול הלמידה שלך
            </h2>

            {goals.map((goal, index) => {
              const difficulty = DIFFICULTY_LABELS[goal.difficulty] ?? {
                label: goal.difficulty,
                classes: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
              };

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 p-6 space-y-3"
                >
                  {/* Goal header */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                      {index + 1}. {goal.title}
                    </h3>
                    {/* Difficulty badge */}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${difficulty.classes}`}
                    >
                      {difficulty.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Focus Areas */}
                  {goal.focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {goal.focusAreas.map((area, areaIdx) => (
                        <span
                          key={areaIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
