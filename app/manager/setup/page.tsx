import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ManagerSetupForm } from "./ManagerSetupForm";
import { getMenuItemsWithDetails } from "@/lib/db/menuItems";
import { DeleteDishButton } from "./DeleteDishButton";

interface MenuItemDetail {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  menu_item_ingredients: { name: string }[];
  menu_item_allergens: { name: string }[];
  menu_item_tags: { name: string }[];
}

export default async function ManagerSetup() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/manager/login");
  }

  // Check manager membership
  const { data: membership, error } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .eq("role", "manager")
    .single();

  if (error || !membership) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-red-200 dark:border-red-900/50 p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              גישה נדחתה
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              אינך משויך לאף מסעדה כמנהל. אנא פנה למנהל המערכת לקבלת הרשאות מתאימות.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-semibold transition-all"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const dishes = (await getMenuItemsWithDetails(supabase, membership.restaurant_id)) as unknown as MenuItemDetail[];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 bg-zinc-50 dark:bg-zinc-950 py-12 space-y-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 p-8 space-y-6 text-center">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            הגדרת מסעדה
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">
            כאן מנהל המסעדה יכול להוסיף מנות לתפריט.
          </p>
        </div>

        {/* Action Form */}
        <ManagerSetupForm />
      </div>

      {/* Dishes List */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 p-8 text-right space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 border-b pb-2">תפריט קיים</h2>
        {dishes.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">אין מנות בתפריט עדיין.</p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-4">
            {dishes.map((dish) => (
              <div key={dish.id} className="pt-4 first:pt-0 space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{dish.name}</h3>
                    <DeleteDishButton id={dish.id} />
                  </div>
                  {dish.price !== null && (
                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">₪{dish.price}</span>
                  )}
                </div>
                {dish.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{dish.description}</p>
                )}

                <div className="text-xs space-y-1 pt-1.5 text-zinc-500 dark:text-zinc-400">
                  {dish.menu_item_ingredients && dish.menu_item_ingredients.length > 0 && (
                    <div>
                      <strong className="text-zinc-700 dark:text-zinc-300">מרכיבים:</strong> {dish.menu_item_ingredients.map(i => i.name).join(', ')}
                    </div>
                  )}
                  {dish.menu_item_allergens && dish.menu_item_allergens.length > 0 && (
                    <div>
                      <strong className="text-zinc-700 dark:text-zinc-300">אלרגנים:</strong> {dish.menu_item_allergens.map(i => i.name).join(', ')}
                    </div>
                  )}
                  {dish.menu_item_tags && dish.menu_item_tags.length > 0 && (
                    <div>
                      <strong className="text-zinc-700 dark:text-zinc-300">תגיות:</strong> {dish.menu_item_tags.map(i => i.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="w-full max-w-md pt-2">
        <Link
          href="/"
          className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-semibold active:scale-[0.98] transition-all"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </main>
  );
}
