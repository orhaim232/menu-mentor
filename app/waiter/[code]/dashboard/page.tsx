"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function WaiterDashboard() {
  const params = useParams();
  const rawCode = params?.code;
  // If array, take first item, if string, use it. Default to DEMO123 if not found.
  const code = Array.isArray(rawCode) ? rawCode[0] : (rawCode || "DEMO123");

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
            לוח אימון למלצר
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">
            כאן המלצר יוכל בהמשך להתאמן על התפריט, אלרגנים ושיחות שירות.
          </p>
        </div>

        {/* Restaurant Code Display */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/80 space-y-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
            קוד מסעדה פעיל
          </span>
          <span className="text-2xl font-mono font-bold tracking-wider text-zinc-950 dark:text-zinc-50">
            {code}
          </span>
        </div>

        {/* Info Text */}
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          סימולטור השיחה וניהול מסלול הלמידה האישי יתווספו בשלבים הבאים.
        </p>

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
