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
