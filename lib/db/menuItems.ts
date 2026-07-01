import type { SupabaseClient } from '@supabase/supabase-js';
import { MenuItem } from '../../types/database';

export async function getMenuItemsByRestaurantId(supabase: SupabaseClient, restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  return data || [];
}

export async function getMenuItemsWithDetails(supabase: SupabaseClient, restaurantId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      menu_item_ingredients (name),
      menu_item_allergens (name),
      menu_item_tags (name)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching menu items with details:', error);
    return [];
  }
  return data || [];
}

export async function getActiveMenuItemsByRestaurantId(supabase: SupabaseClient, restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active menu items:', error);
    return [];
  }
  return data || [];
}


export async function getMenuItemById(supabase: SupabaseClient, id: string): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching menu item by id:', error);
    return null;
  }
  return data;
}

export async function createMenuItem(
  supabase: SupabaseClient, 
  restaurantId: string, 
  name: string, 
  description?: string, 
  price?: number
): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      restaurant_id: restaurantId,
      name,
      description: description || null,
      price: price || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating menu item:', error);
    return null;
  }
  return data;
}

export async function updateMenuItem(
  supabase: SupabaseClient, 
  id: string, 
  updates: Partial<Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at'>>
): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating menu item:', error);
    return null;
  }
  return data;
}

export async function deleteMenuItem(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }
  return true;
}

export async function createMenuItemIngredients(supabase: SupabaseClient, menuItemId: string, ingredients: string[]): Promise<boolean> {
  if (ingredients.length === 0) return true;
  const { error } = await supabase.from('menu_item_ingredients').insert(
    ingredients.map(name => ({ menu_item_id: menuItemId, name }))
  );
  if (error) console.error('Error creating ingredients:', error);
  return !error;
}

export async function createMenuItemAllergens(supabase: SupabaseClient, menuItemId: string, allergens: string[]): Promise<boolean> {
  if (allergens.length === 0) return true;
  const { error } = await supabase.from('menu_item_allergens').insert(
    allergens.map(name => ({ menu_item_id: menuItemId, name }))
  );
  if (error) console.error('Error creating allergens:', error);
  return !error;
}

export async function createMenuItemTags(supabase: SupabaseClient, menuItemId: string, tags: string[]): Promise<boolean> {
  if (tags.length === 0) return true;
  const { error } = await supabase.from('menu_item_tags').insert(
    tags.map(name => ({ menu_item_id: menuItemId, name }))
  );
  if (error) console.error('Error creating tags:', error);
  return !error;
}

// Simple text search for MVP - does not use pgvector or AI
export async function searchMenuItemsBasic(supabase: SupabaseClient, restaurantId: string, query: string): Promise<MenuItem[]> {
  if (!query.trim()) {
    return getMenuItemsByRestaurantId(supabase, restaurantId);
  }

  // Uses Supabase ilike for basic text filtering on name or description
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) {
    console.error('Error searching menu items:', error);
    return [];
  }
  return data || [];
}
