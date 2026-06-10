import type { SupabaseClient } from '@supabase/supabase-js';
import { MenuCategory } from '../../types/database';

export async function getMenuCategoriesByRestaurantId(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }
  return data || [];
}
