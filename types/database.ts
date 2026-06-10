export type UserRole = 'manager' | 'waiter';

export interface Profile {
  id: string; // UUID references auth.users.id
  role: UserRole;
  full_name: string;
  created_at: string;
}

export interface Restaurant {
  id: string; // UUID
  name: string;
  general_notes: string | null;
  created_at: string;
}

export interface MenuItem {
  id: string; // UUID
  restaurant_id: string; // UUID references Restaurant.id
  name: string;
  description: string | null;
  price: number | null;
  manager_note: string | null;
  created_at: string;
  category?: string;
  spice_level?: string;
  modification_rules?: string[];
  service_notes?: string[];
  include_in_memory_game?: boolean;
}

export interface MenuIngredient {
  id: string; // UUID
  menu_item_id: string; // UUID references MenuItem.id
  name: string;
  created_at: string;
}

export interface MenuAllergen {
  id: string; // UUID
  menu_item_id: string; // UUID references MenuItem.id
  name: string;
  created_at: string;
}

export interface MenuItemTag {
  id: string; // UUID
  menu_item_id: string; // UUID references MenuItem.id
  name: string;
  created_at: string;
}

export interface SimulationSession {
  id: string; // UUID
  user_id: string; // UUID references Profile.id
  restaurant_id: string; // UUID references Restaurant.id
  created_at: string;
}

export interface SimulationMessage {
  id: string; // UUID
  session_id: string; // UUID references SimulationSession.id
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface SimulationFeedback {
  id: string; // UUID
  session_id: string; // UUID references SimulationSession.id
  message_id: string; // UUID references SimulationMessage.id
  menu_item_id: string | null; // UUID references MenuItem.id (optional)
  factual_score: number;
  tone_score: number;
  upselling_score: number | null;
  feedback_text: string;
  created_at: string;
}
