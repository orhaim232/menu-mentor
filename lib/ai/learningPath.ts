import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { Restaurant, MenuItem, MenuItemTag } from '../../types/database';
import { LearningPath, learningPathSchema } from '../../types/learningPath';

export function buildLearningPathPrompt(restaurant: Restaurant, menuItems: MenuItem[], tags: MenuItemTag[]): string {
  return `
You are an expert hospitality trainer building a learning path for waiters.
Restaurant Name: ${restaurant.name}
General Notes & Guidelines: ${restaurant.general_notes || 'None'}

Menu Items:
${menuItems.map(item => {
  const itemTags = tags.filter(t => t.menu_item_id === item.id).map(t => t.name).join(', ');
  return `- [ID: ${item.id}] ${item.name} (${item.price || 0} NIS)
  Description: ${item.description || 'None'}
  Manager Note: ${item.manager_note || 'None'}
  Tags: ${itemTags}`;
}).join('\n')}

Create a focused learning path for a new waiter. 
Include 3-5 learning goals ranging from beginner to advanced.
Return a structured JSON based on the provided schema.
Use Hebrew for titles, descriptions, and practice questions.
  `;
}

export function generateFallbackLearningPath(restaurant: Restaurant, menuItems: MenuItem[]): LearningPath {
  // A simple deterministic fallback if AI is unavailable or fails
  return {
    goals: [
      {
        title: "היכרות בסיסית עם התפריט",
        description: "למידת המנות העיקריות והפתיחים כדי להמליץ בביטחון",
        whyItMatters: "חשוב להכיר את שמות המנות והמרכיבים הבסיסיים לשירות שוטף ומהיר",
        relatedMenuItemIds: menuItems.slice(0, 3).map(i => i.id),
        suggestedPracticeQuestions: ["אילו מנות פתיחה יש לכם?", "מה המנה הכי פופולרית?"],
        focusAreas: ["היכרות כללית", "זכירת שמות"],
        difficulty: "beginner"
      },
      {
        title: "דגשי שירות ואלרגיות",
        description: "תרגול שאלות מורכבות על הרכב המנות, והתאמות ללקוחות",
        whyItMatters: "בטיחות הלקוח קודמת לכל, במיוחד באלרגיות וחריגים במטבח",
        relatedMenuItemIds: menuItems.slice(0, 5).map(i => i.id),
        suggestedPracticeQuestions: ["האם אפשר להכין את המנה בלי גלוטן?", "יש לכם משהו טבעוני באמת?"],
        focusAreas: ["אלרגנים", "התאמות תזונתיות", "מכירה חכמה (Upselling)"],
        difficulty: "intermediate"
      }
    ]
  };
}

export async function generateLearningPathWithAI(restaurant: Restaurant, menuItems: MenuItem[], tags: MenuItemTag[]): Promise<LearningPath> {
  // Always use fallback if API key is not present, prevents crashing the app
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY is missing. Using fallback learning path.");
    return generateFallbackLearningPath(restaurant, menuItems);
  }

  try {
    const openai = createOpenAI({ apiKey });
    const prompt = buildLearningPathPrompt(restaurant, menuItems, tags);

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: learningPathSchema,
      prompt: prompt,
    });

    return object;
  } catch (error) {
    console.error("AI Generation failed:", error);
    // Graceful fallback when API fails (e.g., quota exceeded, network error)
    return generateFallbackLearningPath(restaurant, menuItems);
  }
}
