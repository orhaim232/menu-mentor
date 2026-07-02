import type { SupabaseClient } from '@supabase/supabase-js';
import { Restaurant } from '../../types/database';

export async function createRestaurant(supabase: SupabaseClient, name: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .insert({ name })
    .select()
    .single();

  if (error) {
    console.error('Error creating restaurant:', error);
    return null;
  }
  return data;
}

export async function getRestaurantById(supabase: SupabaseClient, id: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching restaurant by id:', error);
    return null;
  }
  return data;
}

export async function getRestaurantByCode(supabase: SupabaseClient, code: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('access_code', code)
    .single();

  if (error) {
    console.error('Error fetching restaurant by access code:', error);
    return null;
  }
  return data;
}

export async function updateRestaurantBasicInfo(supabase: SupabaseClient, id: string, name: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating restaurant info:', error);
    return null;
  }
  return data;
}

export async function updateRestaurantNotes(supabase: SupabaseClient, id: string, notes: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .update({ general_notes: notes })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating restaurant notes:', error);
    return null;
  }
  return data;
}
