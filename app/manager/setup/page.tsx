"use client";

import Link from "next/link";

export default function ManagerSetup() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 p-8 space-y-6 text-center">
        {/* Under Construction Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 mx-auto">
          עמוד זמני - בהקמה
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            הגדרת מסעדה
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">
            כאן מנהל המסעדה יוכל בהמשך להגדיר תפריט, מנות, אלרגנים והנחיות שירות.
          </p>
        </div>

        {/* Temporary/Mock content box */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm">
          כלי העלאת תפריטים וניהול הגדרות הדרכה יתווספו בשלבים הבאים.
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-semibold active:scale-[0.98] transition-all"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}
