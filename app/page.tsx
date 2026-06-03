"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [restaurantCode, setRestaurantCode] = useState("DEMO123");

  // Clean code to avoid space issues in URL
  const cleanCode = restaurantCode.trim() || "DEMO123";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 p-8 space-y-8 transition-all">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            MenuMentor
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">
            מערכת אימון חכמה למלצרים על תפריט, אלרגנים ושירות.
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          {/* Restaurant Code Input */}
          <div className="space-y-2">
            <label 
              htmlFor="restaurant-code" 
              className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
            >
              קוד מסעדה
            </label>
            <input
              id="restaurant-code"
              type="text"
              value={restaurantCode}
              onChange={(e) => setRestaurantCode(e.target.value)}
              placeholder="הכנס קוד מסעדה..."
              className="w-full px-4 py-3 text-center text-lg font-mono tracking-wider rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:border-transparent transition-all"
            />
          </div>

          {/* Role Navigation Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href={`/waiter/${cleanCode}/dashboard`}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              כניסה כמלצר
            </Link>

            <Link
              href="/manager/setup"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold active:scale-[0.98] transition-all"
            >
              כניסה כמנהל
            </Link>
          </div>
        </div>

        {/* Footer/Hint */}
        <div className="text-center pt-2">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            השתמש בקוד <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">DEMO123</code> כדי לנסות את המערכת
          </span>
        </div>
      </div>
    </main>
  );
}

