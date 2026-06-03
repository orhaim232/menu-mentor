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
  price?: number,
  managerNote?: string
): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      restaurant_id: restaurantId,
      name,
      description: description || null,
      price: price || null,
      manager_note: managerNote || null
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
