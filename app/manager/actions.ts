"use server";

import { createClient } from "@/lib/supabase/server";
import { createMenuItem, createMenuItemIngredients, createMenuItemAllergens, createMenuItemTags, deleteMenuItem } from "@/lib/db/menuItems";
import { revalidatePath } from "next/cache";

export async function createDishAction(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  
  // 1. Resolve auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Resolve restaurant_id from server-side membership
  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .eq("role", "manager")
    .single();

  if (membershipError || !membership) {
    return { success: false, error: "Access denied or not a manager." };
  }

  // 3. Extract and validate fields
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const priceRaw = formData.get("price")?.toString().trim();
  
  const rawIngredients = formData.get("ingredients")?.toString() || "";
  const rawAllergens = formData.get("allergens")?.toString() || "";
  const rawTags = formData.get("tags")?.toString() || "";

  if (!name) {
    return { success: false, error: "שם מנה הוא שדה חובה" };
  }

  const price = priceRaw ? parseFloat(priceRaw) : undefined;
  if (price !== undefined && isNaN(price)) {
    return { success: false, error: "מחיר לא תקין" };
  }

  const ingredients = Array.from(new Set(rawIngredients.split(",").map(i => i.trim()).filter(Boolean)));
  const allergens = Array.from(new Set(rawAllergens.split(",").map(i => i.trim()).filter(Boolean)));
  const tags = Array.from(new Set(rawTags.split(",").map(i => i.trim()).filter(Boolean)));

  if (ingredients.length === 0) {
    return { success: false, error: "חובה להזין לפחות מרכיב אחד" };
  }

  // 4. Save to DB reusing existing function
  const newItem = await createMenuItem(
    supabase,
    membership.restaurant_id,
    name,
    description,
    price
  );

  if (!newItem) {
    return { success: false, error: "שגיאה בשמירת המנה. אנא נסה שוב." };
  }

  // 5. Save structured relations
  const ingrSuccess = await createMenuItemIngredients(supabase, newItem.id, ingredients);
  const allgSuccess = await createMenuItemAllergens(supabase, newItem.id, allergens);
  const tagsSuccess = await createMenuItemTags(supabase, newItem.id, tags);

  if (!ingrSuccess || !allgSuccess || !tagsSuccess) {
    return { success: false, error: "המנה נוצרה חלקית. חלה שגיאה בשמירת מרכיבים, אלרגנים או תגיות." };
  }

  revalidatePath("/manager/setup");
  return { success: true, message: "המנה נשמרה בהצלחה!" };
}

export async function deleteDishAction(id: string) {
  const supabase = await createClient();

  // 1. Resolve auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "משתמש לא מחובר" };
  }

  // 2. Resolve manager membership
  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .eq("role", "manager")
    .single();

  if (membershipError || !membership) {
    return { success: false, error: "אין הרשאות מנהל" };
  }

  // 3. Verify the menu item belongs to that restaurant
  const { data: item, error: itemError } = await supabase
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", id)
    .single();

  if (itemError || !item) {
    return { success: false, error: "המנה לא נמצאה" };
  }

  if (item.restaurant_id !== membership.restaurant_id) {
    return { success: false, error: "אין הרשאה למחוק מנה זו" };
  }

  // 4. Delete the main menu item (relies on DB cascade delete)
  const success = await deleteMenuItem(supabase, id);
  if (!success) {
    return { success: false, error: "שגיאה במחיקת המנה מהמאגר" };
  }

  revalidatePath("/manager/setup");
  return { success: true };
}
