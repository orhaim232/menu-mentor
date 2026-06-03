import { MenuLearningPathV2, MenuLearningPathV2Schema } from '../../types/learningPath';
import { 
  MOCK_MENU_ITEMS, 
  getMockIngredientsByMenuItemId, 
  getMockAllergensByMenuItemId 
} from '../db/mockData';

export function generateFallbackMenuLearningPathV2(): MenuLearningPathV2 {
  // Build dishes using mock data with improved practical training content
  const dishes = MOCK_MENU_ITEMS.slice(0, 3).map(item => {
    const ingredients = getMockIngredientsByMenuItemId(item.id).map(ing => ing.name);
    const allergens = getMockAllergensByMenuItemId(item.id).map(all => all.name);
    
    let memoryTip = '';
    let familiarAssociation = '';
    let recognitionHint = '';

    if (item.id === 'item-1') {
      // Focaccia
      memoryTip = 'לחם חם תמיד פותח שולחן שמח. זכרו להציע ברגע שהלקוחות מתיישבים למנה לחלוקה.';
      familiarAssociation = 'כמו הלחם שמוגש באיטליה בתחילת הארוחה יחד עם שמן זית מובחר ובלסמי.';
      recognitionHint = 'בצק עבה וקריספי עם קרום שחום, מוגש חם מהתנור לצד צלוחית שמן זית.';
    } else if (item.id === 'item-2') {
      // Risotto
      memoryTip = 'מנה כבדה, מנחמת ועשירה מאוד בחמאה ופרמז׳ן (חלבי). לא מתאימה למי שמחפש משהו קליל או טבעוני.';
      familiarAssociation = 'תבשיל אורז איטלקי קטיפתי, דומה למרק סמיך ועשיר מאוד בטעמים אדמתיים.';
      recognitionHint = 'מנה בהירה וקרמית, בולטת למרחקים בזכות הריח העז והייחודי של שמן הכמהין.';
    } else if (item.id === 'item-3') {
      // Quinoa salad
      memoryTip = 'אופציה צבעונית, בריאה וקלילה. מצוינת לטבעונים ולרגישים לגלוטן. שימו לב לאלרגיית שקדים!';
      familiarAssociation = 'סלט בריאות של סופר-פוד שנותן המון אנרגיה ולא מכביד על הבטן (Superfood bowl).';
      recognitionHint = 'בולט בצבע האדום-סגול העז של הסלק והקינואה, עם נגיעות של ירוק ולבן מעל.';
    }

    return {
      id: item.id,
      name: item.name,
      simpleDescription: item.description || '',
      ingredients: ingredients,
      allergens: allergens,
      memoryTip: memoryTip,
      familiarAssociation: familiarAssociation,
      recognitionHint: recognitionHint,
      relatedMenuItemIds: [],
    };
  });

  const fallbackData = {
    dishes: dishes,
    comparisons: [
      {
        title: 'מה להציע כפתיח: פוקאצ׳ה מול סלט קינואה?',
        dishIds: [MOCK_MENU_ITEMS[0].id, MOCK_MENU_ITEMS[2].id],
        similarities: ['שתי המנות יוצאות מהר מהמטבח ויכולות לשמש כמנות פתיחה נהדרות למרכז השולחן.'],
        differences: ['הפוקאצ׳ה היא פחמימה חמה ומשביעה המכילה גלוטן, בעוד הסלט הוא מנה קרה, קלילה, בריאה וללא גלוטן (ויגן פרנדלי).'],
        recommendationGuidance: 'לשולחן משפחתי או רעב מאוד - המלץ על פוקאצ׳ה לחלוקה. ללקוחות המחפשים משהו קליל, מתאמנים, טבעונים או נטולי גלוטן - המלץ בחום על הסלט.',
      }
    ],
    practiceItems: [
      {
        id: 'prac-1',
        type: 'match_dish_to_ingredients' as const,
        question: 'לקוח שואל מאילו מרכיבים עשוי ריזוטו פטריות הכמהין, מה תענה?',
        options: [
          'אורז ארבוריו, חמאה ופטריות (מנה חלבית)', 
          'קמח חיטה ושמן זית (מנה טבעונית)', 
          'קינואה אדומה וסלק (מנה טבעונית)'
        ],
        correctAnswer: 'אורז ארבוריו, חמאה ופטריות (מנה חלבית)',
        explanation: 'הריזוטו מבוסס על אורז ארבוריו ומכיל כמות גדולה של חמאה ופרמז׳ן כדי להגיע למרקם הקרמי שלו. לכן המנה חלבית ואינה ניתנת לטבעון.',
        relatedDishIds: [MOCK_MENU_ITEMS[1].id],
      }
    ],
    customerQA: [
      {
        question: 'לקוח שואל: "האם סלט הקינואה מתאים למי שרגיש במיוחד לגלוטן (צליאק)?"',
        recommendedAnswer: 'הסלט עצמו מורכב ממרכיבים ללא גלוטן, אך המטבח שלנו אינו סטרילי מגלוטן. אני מיד אגש לבדוק מול השף האם נוכל להכין את הסלט בסביבת עבודה נקייה לחלוטין כדי להבטיח 100% ביטחון ללא זיהום משני.',
        relatedDishIds: [MOCK_MENU_ITEMS[2].id],
        source: 'ai' as const,
      }
    ],
    simulations: [
      {
        scenarioTitle: 'לקוח עם רגישות מסכנת חיים לגלוטן (צליאק)',
        customerOpeningMessage: 'שלום, אני חולה צליאק ויש לי רגישות קשה לגלוטן. אני מאוד מפחד מזיהום משני. אילו מנות אני יכול לאכול פה בבטחה בלי לקחת שום סיכון?',
        expectedFocusAreas: [
          'לגלות אמפתיה ללקוח ולהעניק תחושת ביטחון, לעולם לא לזלזל בחומרת האלרגיה.',
          'לציין שמנות מסוימות (כמו סלט הקינואה) הן מטבען ללא גלוטן אך המטבח לא סטרילי.',
          'להציע לבדוק פיזית מול מנהל המשמרת או השף אילו מנות ניתן להכין בפס עבודה נפרד וסטרילי.',
          'לעולם לא להתחייב או להבטיח שהמנה בטוחה 100% לפני שבודקים עם המטבח.'
        ],
        feedbackCriteria: [
          'זהירות ובטיחות הלקוח (הקריטריון הקריטי ביותר)',
          'שירותיות, הכלה והרגעת הלקוח',
          'היכרות עם המנות הרלוונטיות בתפריט (זיהוי סלט הקינואה כאופציה פוטנציאלית)'
        ],
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
