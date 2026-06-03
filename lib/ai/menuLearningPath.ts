import { MenuLearningPathV2, MenuLearningPathV2Schema } from '../../types/learningPath';
import { 
  MOCK_MENU_ITEMS, 
  getMockIngredientsByMenuItemId, 
  getMockAllergensByMenuItemId 
} from '../db/mockData';

export function generateFallbackMenuLearningPathV2(): MenuLearningPathV2 {
  // Build dishes using mock data
  const dishes = MOCK_MENU_ITEMS.slice(0, 3).map(item => {
    const ingredients = getMockIngredientsByMenuItemId(item.id).map(ing => ing.name);
    const allergens = getMockAllergensByMenuItemId(item.id).map(all => all.name);
    
    return {
      id: item.id,
      name: item.name,
      simpleDescription: item.description || '',
      ingredients: ingredients,
      allergens: allergens,
      memoryTip: `זכור: ${item.name} היא מנה בולטת וחשובה.`,
      familiarAssociation: 'מנה קלאסית ומוכרת.',
      recognitionHint: 'זיהוי לפי המראה והריח הייחודי.',
      relatedMenuItemIds: [],
    };
  });

  const fallbackData = {
    dishes: dishes,
    comparisons: [
      {
        title: 'השוואה בין מנות פתיחה',
        dishIds: [MOCK_MENU_ITEMS[0].id, MOCK_MENU_ITEMS[2].id],
        similarities: ['שתי המנות מתאימות כפתיח או לצד מנה עיקרית'],
        differences: ['הפוקאצ׳ה היא בצק חם והסלט הוא מנה קרה וקלילה'],
        recommendationGuidance: 'המלץ על פוקאצ׳ה לחלוקה למי שרעב מאוד, ועל סלט למי שמחפש פתיח קליל ובריא.',
      }
    ],
    practiceItems: [
      {
        id: 'prac-1',
        type: 'match_dish_to_ingredients' as const,
        question: 'אילו מרכיבים יש בריזוטו פטריות כמהין?',
        options: ['אורז ארבוריו, חמאה ופטריות', 'קמח חיטה ושמן זית', 'קינואה אדומה וסלק'],
        correctAnswer: 'אורז ארבוריו, חמאה ופטריות',
        explanation: 'ריזוטו מבוסס על אורז ארבוריו ומוכן עם חמאה ופטריות לקבלת מרקם עשיר.',
        relatedDishIds: [MOCK_MENU_ITEMS[1].id],
      }
    ],
    customerQA: [
      {
        question: 'האם סלט הקינואה מכיל גלוטן?',
        recommendedAnswer: 'לא, הסלט עצמו ללא גלוטן (קינואה, סלק, שקדים קלויים).',
        relatedDishIds: [MOCK_MENU_ITEMS[2].id],
        source: 'ai' as const,
      }
    ],
    simulations: [
      {
        scenarioTitle: 'לקוח עם רגישות לגלוטן',
        customerOpeningMessage: 'שלום, אני רגיש לגלוטן ברמה קשה. האם יש פה מנות שאני יכול לאכול בבטחה?',
        expectedFocusAreas: ['וידוא רמת הרגישות (צליאק או רגישות)', 'שליטה במנות נטולות גלוטן', 'אזהרה לגבי סביבת העבודה במטבח'],
        feedbackCriteria: ['שקיפות ואמינות', 'ידע על אלרגנים', 'אמפתיה וסבלנות'],
      }
    ]
  };

  // Validate the fallback object with the schema before returning it
  const parsed = MenuLearningPathV2Schema.safeParse(fallbackData);
  if (!parsed.success) {
    console.error("Fallback validation failed:", parsed.error);
    throw new Error("Failed to validate fallback MenuLearningPathV2 data. Check schema definitions.");
  }

  return parsed.data;
}
