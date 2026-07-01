"use client";

import { useTransition } from "react";
import { deleteDishAction } from "../actions";

export function DeleteDishButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("האם אתה בטוח שברצונך למחוק מנה זו?")) return;
    
    startTransition(async () => {
      const res = await deleteDishAction(id);
      if (!res.success) {
        alert(res.error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 disabled:opacity-50 transition-colors"
    >
      {isPending ? "מוחק..." : "מחיקה"}
    </button>
  );
}
