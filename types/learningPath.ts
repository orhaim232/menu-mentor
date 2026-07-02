import { z } from 'zod';

export type LearningPathDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Zod schema for structured output from AI
export const learningPathGoalSchema = z.object({
  title: z.string().describe("The title of the learning goal in Hebrew"),
  description: z.string().describe("Short description of what the waiter will learn in Hebrew"),
  whyItMatters: z.string().describe("Why this is important for the waiters service and training"),
  relatedMenuItemIds: z.array(z.string()).describe("IDs of the menu items related to this goal"),
  suggestedPracticeQuestions: z.array(z.string()).describe("Example questions a customer might ask related to this goal in Hebrew"),
  focusAreas: z.array(z.string()).describe("Key focus areas like allergens, upselling, vegan adaptations, service tone"),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const learningPathSchema = z.object({
  goals: z.array(learningPathGoalSchema).describe("List of learning goals tailored for the restaurant"),
});

export type LearningPathGoal = z.infer<typeof learningPathGoalSchema>;
export type LearningPath = z.infer<typeof learningPathSchema>;

// --- V2 Schemas and Types for Practical Menu-Learning Path ---

// Stage 1: Learn the menu items
export const MenuDishLearningCardV2Schema = z.object({
  id: z.string().describe("Unique identifier of the dish"),
  name: z.string().describe("Name of the dish in Hebrew"),
  imageUrl: z.string().optional().describe("Optional URL of the dish image"),
  imageAlt: z.string().optional().describe("Optional alternative text for the image in Hebrew"),
  simpleDescription: z.string().describe("Simple and brief description of the dish in Hebrew"),
  ingredients: z.array(z.string()).describe("List of key ingredients in Hebrew"),
  allergens: z.array(z.string()).describe("List of allergens in Hebrew"),
  memoryTip: z.string().describe("A memory tip or mnemonic to help remember the dish/allergens in Hebrew"),
  familiarAssociation: z.string().describe("Familiar association or context in Hebrew"),
  recognitionHint: z.string().describe("How to recognize the dish (by name, image, or main ingredient) in Hebrew"),
  relatedMenuItemIds: z.array(z.string()).optional().describe("Optional IDs of related menu items"),
  tags: z.array(z.string()).optional().describe("Optional tags or dietary details in Hebrew"),
});

// Stage 2: Compare similar dishes
export const DishComparisonV2Schema = z.object({
  title: z.string().describe("Title of the comparison in Hebrew"),
  dishIds: z.array(z.string()).describe("IDs of the dishes compared"),
  similarities: z.array(z.string()).describe("Common points or similarities in Hebrew"),
  differences: z.array(z.string()).describe("Key differences in Hebrew"),
  recommendationGuidance: z.string().describe("Guidance on when to recommend which dish in Hebrew"),
});

// Stage 3: Recall and practice quiz items
export const RecallPracticeItemV2Schema = z.object({
  id: z.string().describe("Unique identifier for the practice item"),
  type: z.enum([
    'match_dish_to_image',
    'match_dish_to_ingredients',
    'identify_allergens',
    'choose_dish_for_customer_need'
  ]).describe("Type of practice/recall item"),
  question: z.string().describe("The practice question prompt in Hebrew"),
  options: z.array(z.string()).describe("Multiple-choice options in Hebrew"),
  correctAnswer: z.string().describe("The correct option in Hebrew"),
  explanation: z.string().describe("Detailed explanation of why this answer is correct in Hebrew"),
  relatedDishIds: z.array(z.string()).optional().describe("Optional IDs of related dishes"),
});

// Stage 4: Common customer Q&A
export const CustomerQAV2Schema = z.object({
  question: z.string().describe("Common customer question in Hebrew"),
  recommendedAnswer: z.string().describe("Recommended answer in Hebrew"),
  relatedDishIds: z.array(z.string()).optional().describe("Optional related dish IDs"),
  source: z.enum(['manager', 'ai']).describe("Source of the question-answer pair"),
});

// Stage 5: Customer conversation simulations
export const CustomerSimulationV2Schema = z.object({
  scenarioTitle: z.string().describe("Title of the roleplay simulation in Hebrew"),
  customerOpeningMessage: z.string().describe("First message from the AI customer in Hebrew"),
  expectedFocusAreas: z.array(z.string()).describe("Focus areas expected to cover in Hebrew (e.g. allergies, service tone)"),
  feedbackCriteria: z.array(z.string()).describe("Criteria for evaluation feedback in Hebrew"),
});

// Parent schema for the entire V2 Learning Path
export const MenuLearningPathV2Schema = z.object({
  dishes: z.array(MenuDishLearningCardV2Schema).describe("Stage 1: Menu items learning cards"),
  comparisons: z.array(DishComparisonV2Schema).describe("Stage 2: Dishes comparisons"),
  practiceItems: z.array(RecallPracticeItemV2Schema).describe("Stage 3: Recall and practice quiz items"),
  customerQA: z.array(CustomerQAV2Schema).describe("Stage 4: Common customer Q&A"),
  simulations: z.array(CustomerSimulationV2Schema).describe("Stage 5: Customer conversation simulations"),
});

export type MenuDishLearningCardV2 = z.infer<typeof MenuDishLearningCardV2Schema>;
export type DishComparisonV2 = z.infer<typeof DishComparisonV2Schema>;
export type RecallPracticeItemV2 = z.infer<typeof RecallPracticeItemV2Schema>;
export type CustomerQAV2 = z.infer<typeof CustomerQAV2Schema>;
export type CustomerSimulationV2 = z.infer<typeof CustomerSimulationV2Schema>;
export type MenuLearningPathV2 = z.infer<typeof MenuLearningPathV2Schema>;

