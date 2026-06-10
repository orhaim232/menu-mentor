import { Restaurant, MenuItem, MenuIngredient, MenuAllergen, MenuItemTag } from '../../types/database';

const MOCK_DATE = new Date().toISOString();

export const MOCK_RESTAURANT: Restaurant = {
  id: 'DEMO123',
  name: 'המסעדה של מנטור (Demo)',
  general_notes: 'דגשים למלצרים: להמליץ תמיד על שתייה חמה בסוף הארוחה. לשים לב במיוחד לאלרגיות בוטנים וגלוטן - חובה לשאול כל שולחן. לשמור על טון שירותי, אדיב ומזמין. לחייך!',
  menu_version: 1,
  created_at: MOCK_DATE,
  updated_at: MOCK_DATE,
};

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    restaurant_id: 'DEMO123',
    name: 'פוקאצ׳ה תנור אבן',
    description: 'פוקאצ׳ה טרייה הנאפית במקום, מוגשת עם מטבל שמן זית, בלסמי ומלח ים.',
    price: 32,
    manager_note: 'מצוין בתור פתיח לזוג או שלישייה. יוצא מהר יחסית, כ-5 דקות.',
    category_id: null,
    service_notes: [],
    modification_rules: [],
    custom_attributes: {},
    image_url: null,
    image_source: null,
    is_active: true,
    include_in_memory_game: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 'item-2',
    restaurant_id: 'DEMO123',
    name: 'ריזוטו פטריות כמהין',
    description: 'ריזוטו קרמי עם פטריות פורטובלו, שימג׳י, שמן כמהין ופרמז׳ן.',
    price: 68,
    manager_note: 'מנה מאוד כבדה ועשירה. לא מתאימה למי שמחפש משהו קליל. אי אפשר לעשות טבעוני כי יש המון חמאה בבסיס.',
    category_id: null,
    service_notes: [],
    modification_rules: [],
    custom_attributes: {},
    image_url: null,
    image_source: null,
    is_active: true,
    include_in_memory_game: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 'item-3',
    restaurant_id: 'DEMO123',
    name: 'סלט קינואה אדומה וסלק',
    description: 'קינואה אדומה, סלק אפוי, שקדים קלויים, פטרוזיליה ורוטב ויניגרט הדרים.',
    price: 54,
    manager_note: 'מנה מעולה לטבעונים. אפשר להציע תוספת עוף או גבינת פטה בתשלום נוסף.',
    category_id: null,
    service_notes: [],
    modification_rules: [],
    custom_attributes: {},
    image_url: null,
    image_source: null,
    is_active: true,
    include_in_memory_game: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 'item-4',
    restaurant_id: 'DEMO123',
    name: 'פבלובה פירות יער',
    description: 'מרנג פריך, קרם מסקרפונה, ורוטב פירות יער חמצמץ.',
    price: 48,
    manager_note: 'קינוח הדגל שלנו. חובה להמליץ עליו לכל שולחן שמתלבט.',
    category_id: null,
    service_notes: [],
    modification_rules: [],
    custom_attributes: {},
    image_url: null,
    image_source: null,
    is_active: true,
    include_in_memory_game: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 'item-5',
    restaurant_id: 'DEMO123',
    name: 'קוקטייל שקיעה',
    description: 'ג׳ין, מחית פסיפלורה, לימון ונגיעת קמפרי.',
    price: 42,
    manager_note: 'לא להגיש לנשים בהיריון. לבקש תעודת זהות ממי שנראה צעיר.',
    category_id: null,
    service_notes: [],
    modification_rules: [],
    custom_attributes: {},
    image_url: null,
    image_source: null,
    is_active: true,
    include_in_memory_game: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  }
];

export const MOCK_INGREDIENTS: MenuIngredient[] = [
  { id: 'ing-1', menu_item_id: 'item-1', name: 'קמח חיטה', created_at: new Date().toISOString() },
  { id: 'ing-2', menu_item_id: 'item-1', name: 'שמן זית', created_at: new Date().toISOString() },
  { id: 'ing-3', menu_item_id: 'item-2', name: 'אורז ארבוריו', created_at: new Date().toISOString() },
  { id: 'ing-4', menu_item_id: 'item-2', name: 'חמאה', created_at: new Date().toISOString() },
  { id: 'ing-5', menu_item_id: 'item-2', name: 'פטריות', created_at: new Date().toISOString() },
  { id: 'ing-6', menu_item_id: 'item-2', name: 'פרמז׳ן', created_at: new Date().toISOString() },
  { id: 'ing-7', menu_item_id: 'item-3', name: 'קינואה', created_at: new Date().toISOString() },
  { id: 'ing-8', menu_item_id: 'item-3', name: 'שקדים', created_at: new Date().toISOString() },
  { id: 'ing-9', menu_item_id: 'item-4', name: 'ביצים', created_at: new Date().toISOString() },
  { id: 'ing-10', menu_item_id: 'item-4', name: 'מסקרפונה', created_at: new Date().toISOString() },
  { id: 'ing-11', menu_item_id: 'item-5', name: 'ג׳ין', created_at: new Date().toISOString() },
];

export const MOCK_ALLERGENS: MenuAllergen[] = [
  { id: 'all-1', menu_item_id: 'item-1', name: 'גלוטן', created_at: new Date().toISOString() },
  { id: 'all-2', menu_item_id: 'item-2', name: 'חלב', created_at: new Date().toISOString() },
  { id: 'all-3', menu_item_id: 'item-3', name: 'אגוזים (שקדים)', created_at: new Date().toISOString() },
  { id: 'all-4', menu_item_id: 'item-4', name: 'חלב', created_at: new Date().toISOString() },
  { id: 'all-5', menu_item_id: 'item-4', name: 'ביצים', created_at: new Date().toISOString() },
];

export const MOCK_TAGS: MenuItemTag[] = [
  // קטגוריות ממופות כתגיות (לפי מבנה סכימה שטוח)
  { id: 'tag-1', menu_item_id: 'item-1', name: 'starters', created_at: new Date().toISOString() },
  { id: 'tag-2', menu_item_id: 'item-2', name: 'mains', created_at: new Date().toISOString() },
  { id: 'tag-3', menu_item_id: 'item-3', name: 'starters', created_at: new Date().toISOString() },
  { id: 'tag-4', menu_item_id: 'item-4', name: 'desserts', created_at: new Date().toISOString() },
  { id: 'tag-5', menu_item_id: 'item-5', name: 'drinks', created_at: new Date().toISOString() },
  
  // תגיות תזונתיות והתאמות
  { id: 'tag-6', menu_item_id: 'item-1', name: 'vegan', created_at: new Date().toISOString() },
  { id: 'tag-7', menu_item_id: 'item-2', name: 'vegetarian', created_at: new Date().toISOString() },
  { id: 'tag-8', menu_item_id: 'item-3', name: 'vegan', created_at: new Date().toISOString() },
  { id: 'tag-9', menu_item_id: 'item-3', name: 'gluten_free', created_at: new Date().toISOString() },
  { id: 'tag-10', menu_item_id: 'item-3', name: 'customizable', created_at: new Date().toISOString() },
  { id: 'tag-11', menu_item_id: 'item-4', name: 'vegetarian', created_at: new Date().toISOString() },
  { id: 'tag-12', menu_item_id: 'item-4', name: 'gluten_free', created_at: new Date().toISOString() },
  { id: 'tag-13', menu_item_id: 'item-4', name: 'recommended_for_upsell', created_at: new Date().toISOString() },
  { id: 'tag-14', menu_item_id: 'item-5', name: 'contains_alcohol', created_at: new Date().toISOString() },
  { id: 'tag-15', menu_item_id: 'item-5', name: 'pregnancy_caution', created_at: new Date().toISOString() },
];

// --- Helper Functions ---

export function getMockRestaurantByCode(code: string): Restaurant | null {
  if (code === MOCK_RESTAURANT.id) {
    return MOCK_RESTAURANT;
  }
  return null;
}

export function getMockMenuItemsByRestaurantId(restaurantId: string): MenuItem[] {
  return MOCK_MENU_ITEMS.filter(item => item.restaurant_id === restaurantId);
}

export function getMockIngredientsByMenuItemId(menuItemId: string): MenuIngredient[] {
  return MOCK_INGREDIENTS.filter(ing => ing.menu_item_id === menuItemId);
}

export function getMockAllergensByMenuItemId(menuItemId: string): MenuAllergen[] {
  return MOCK_ALLERGENS.filter(all => all.menu_item_id === menuItemId);
}

export function getMockTagsByMenuItemId(menuItemId: string): MenuItemTag[] {
  return MOCK_TAGS.filter(tag => tag.menu_item_id === menuItemId);
}

export function searchMockMenuItemsBasic(restaurantId: string, query: string): MenuItem[] {
  const items = getMockMenuItemsByRestaurantId(restaurantId);
  if (!query.trim()) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    (item.description && item.description.toLowerCase().includes(lowerQuery))
  );
}
