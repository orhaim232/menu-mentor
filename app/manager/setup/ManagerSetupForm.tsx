"use client";

import { useActionState, useEffect, useRef } from "react";
import { createDishAction } from "../actions";

export function ManagerSetupForm() {
  const [state, formAction, isPending] = useActionState(createDishAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 w-full text-right">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">הוספת מנה חדשה</h2>
      
      {state?.error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm mb-4 border border-rose-200 dark:border-rose-900/50">
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-sm mb-4 border border-emerald-200 dark:border-emerald-900/50">
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">שם המנה (חובה)</label>
          <input type="text" id="name" name="name" required className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50" />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">תיאור</label>
          <textarea id="description" name="description" rows={3} className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 resize-none"></textarea>
        </div>
        
        <div>
          <label htmlFor="ingredients" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">מרכיבים (מופרדים בפסיק - חובה)</label>
          <input type="text" id="ingredients" name="ingredients" required placeholder="לדוגמה: עגבניות, מלפפון, קינואה" className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50" />
        </div>
        
        <div>
          <label htmlFor="allergens" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">אלרגנים (מופרדים בפסיק)</label>
          <input type="text" id="allergens" name="allergens" placeholder="לדוגמה: גלוטן, בוטנים, שומשום" className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50" />
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">תגיות ותזונה (מופרדות בפסיק)</label>
          <input type="text" id="tags" name="tags" placeholder="לדוגמה: טבעוני, ללא גלוטן, חריף" className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50" />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">מחיר</label>
          <input type="number" id="price" name="price" step="0.01" className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50" />
        </div>
        
        <button type="submit" disabled={isPending} className="w-full h-11 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
          {isPending ? "שומר..." : "שמור מנה"}
        </button>
      </form>
    </div>
  );
}
