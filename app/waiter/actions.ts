"use server";

import { createClient } from "@/lib/supabase/server";
import { getRestaurantByCode } from "@/lib/db/restaurants";
import { getActiveMenuItemsWithDetails } from "@/lib/db/menuItems";
import type { MenuDishLearningCardV2 } from "@/types/learningPath";

interface DBDish {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  service_notes: string[] | null;
  menu_item_ingredients: { name: string }[];
  menu_item_allergens: { name: string }[];
  menu_item_tags: { name: string }[];
}

export async function getWaiterMenuAction(code: string): Promise<
  { success: true; dishes: MenuDishLearningCardV2[] } | { success: false; error: string }
> {
  const trimmedCode = code.trim();
  const supabase = await createClient();

  // 1. Resolve restaurant by access_code
  const restaurant = await getRestaurantByCode(supabase, trimmedCode);
  if (!restaurant) {
    return { success: false, error: "קוד מסעדה לא תקין או פג תוקף" };
  }

  // 2. Fetch active dishes
  const dishes = (await getActiveMenuItemsWithDetails(supabase, restaurant.id)) as unknown as DBDish[];

  // 3. Map to MenuDishLearningCardV2 shape + include tags
  const mappedDishes: MenuDishLearningCardV2[] = dishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    imageUrl: dish.image_url || undefined,
    imageAlt: dish.image_url ? `תמונה של ${dish.name}` : undefined,
    simpleDescription: dish.description || "",
    ingredients: dish.menu_item_ingredients?.map(i => i.name) || [],
    allergens: dish.menu_item_allergens?.map(a => a.name) || [],
    tags: dish.menu_item_tags?.map(t => t.name) || [],
    memoryTip: dish.service_notes?.[0] || "",
    familiarAssociation: "",
    recognitionHint: "",
    relatedMenuItemIds: []
  }));

  return { success: true, dishes: mappedDishes };
}

export async function checkAccessCodeAction(code: string): Promise<
  { success: true } | { success: false; error: string }
> {
  const trimmedCode = code.trim();
  const supabase = await createClient();

  const restaurant = await getRestaurantByCode(supabase, trimmedCode);
  if (!restaurant) {
    return { success: false, error: "קוד מסעדה לא תקין או פג תוקף" };
  }

  return { success: true };
}
