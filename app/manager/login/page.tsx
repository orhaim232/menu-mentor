"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ManagerLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        if (error.message.includes("signup is disabled") || error.status === 415 || error.message.includes("Signups not allowed")) {
          setMessage({
            type: "error",
            text: "אינך רשום במערכת כמנהל. התחברות זו מיועדת למשתמשים מוזמנים בלבד.",
          });
        } else {
          setMessage({
            type: "error",
            text: `שגיאה בהתחברות: ${error.message}`,
          });
        }
      } else {
        setMessage({
          type: "success",
          text: "קישור התחברות (Magic Link) נשלח לתיבת הדואר שלך! אנא בדוק גם את תיקיית הספאם.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "אירעה שגיאה בלתי צפויה. נסה שנית מאוחר יותר.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 p-8 space-y-6">
        {/* Title */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            כניסת מנהל
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            הזן את הדואר האלקטרוני שלך כדי לקבל קישור התחברות מהיר (Magic Link).
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
            >
              כתובת אימייל
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@example.com"
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 transition-all text-zinc-950 dark:text-zinc-50"
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-xl text-sm border font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30"
                  : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-100 dark:border-red-900/30"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-semibold active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? "שולח קישור..." : "שלח קישור התחברות"}
          </button>
        </form>
      </div>
    </main>
  );
}
