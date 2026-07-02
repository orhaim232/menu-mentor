import type { MenuDishLearningCardV2 } from "@/types/learningPath";

export interface PracticeQuestion {
  id: string;
  type: "match_dish_to_ingredients" | "identify_allergens" | "choose_dish_for_customer_need";
  family: "dish_to_ingredient" | "ingredient_to_dish" | "dish_to_allergen" | "allergen_to_dish" | "dish_to_tag" | "tag_to_dish";
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  relatedDishIds: string[];
}

export interface GeneratorMetadata {
  generatedCount: number;
  skippedAmbiguousCount: number;
  hasEnoughDataForFourOptions: boolean;
  categoriesRepresented: string[];
}

export interface GeneratorResult {
  questions: PracticeQuestion[];
  metadata: GeneratorMetadata;
}

function getDeterministicValue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generatePracticeRound(
  dishes: MenuDishLearningCardV2[],
  options: {
    level: "beginner" | "intermediate" | "advanced";
    focus: "all" | "ingredients" | "allergens" | "tags";
    limit?: number;
    seed?: string;
  }
): GeneratorResult {
  const { level, focus, limit = 10, seed = "" } = options;

  const allIngredients = Array.from(new Set(dishes.flatMap((d) => d.ingredients || [])));
  const allAllergens = Array.from(new Set(dishes.flatMap((d) => d.allergens || [])));
  const allTags = Array.from(new Set(dishes.flatMap((d) => d.tags || [])));

  const familiesForDifficulty = {
    beginner: ["dish_to_ingredient", "dish_to_allergen", "dish_to_tag"],
    intermediate: [
      "dish_to_ingredient",
      "ingredient_to_dish",
      "dish_to_allergen",
      "allergen_to_dish",
      "dish_to_tag",
      "tag_to_dish",
    ],
    advanced: ["ingredient_to_dish", "allergen_to_dish", "tag_to_dish"],
  }[level];

  const familiesForFocus = {
    all: ["dish_to_ingredient", "ingredient_to_dish", "dish_to_allergen", "allergen_to_dish", "dish_to_tag", "tag_to_dish"],
    ingredients: ["dish_to_ingredient", "ingredient_to_dish"],
    allergens: ["dish_to_allergen", "allergen_to_dish"],
    tags: ["dish_to_tag", "tag_to_dish"],
  }[focus];

  const activeFamilies = familiesForDifficulty.filter((f) => familiesForFocus.includes(f));

  const candidates: PracticeQuestion[] = [];

  for (const dish of dishes) {
    // 1. dish_to_ingredient
    if (activeFamilies.includes("dish_to_ingredient") && dish.ingredients && dish.ingredients.length > 0) {
      for (const ing of dish.ingredients) {
        const distractors = allIngredients.filter((i) => !dish.ingredients.includes(i));
        if (distractors.length >= 3) {
          const sortedDistractors = distractors
            .map((d) => ({ d, score: getDeterministicValue(`${d}-${dish.id}-${ing}-distractor-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.d)
            .slice(0, 3);

          const opts = [ing, ...sortedDistractors];
          const sortedOpts = opts
            .map((o) => ({ o, score: getDeterministicValue(`${o}-${dish.id}-${ing}-options-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.o);

          candidates.push({
            id: `${dish.id}-dish_to_ingredient-${ing}`,
            type: "match_dish_to_ingredients",
            family: "dish_to_ingredient",
            prompt: `איזה מהרכיבים הבאים נמצא במנה "${dish.name}"?`,
            options: sortedOpts,
            correctAnswer: ing,
            explanation: `הרכיב "${ing}" נמצא במנה "${dish.name}".`,
            relatedDishIds: [dish.id],
          });
        }
      }
    }

    // 2. ingredient_to_dish
    if (activeFamilies.includes("ingredient_to_dish") && dish.ingredients && dish.ingredients.length > 0) {
      for (const ing of dish.ingredients) {
        const distractors = dishes.filter((d) => !d.ingredients.includes(ing));
        if (distractors.length >= 3) {
          const sortedDistractors = distractors
            .map((d) => ({ d, score: getDeterministicValue(`${d.id}-${dish.id}-${ing}-distractor-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.d);

          const opts = [dish, ...sortedDistractors.slice(0, 3)];
          const sortedOpts = opts
            .map((o) => ({ o, score: getDeterministicValue(`${o.id}-${dish.id}-${ing}-options-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.o.name);

          candidates.push({
            id: `${dish.id}-ingredient_to_dish-${ing}`,
            type: "match_dish_to_ingredients",
            family: "ingredient_to_dish",
            prompt: `איזו מהמנות הבאות מכילה את הרכיב "${ing}"?`,
            options: sortedOpts,
            correctAnswer: dish.name,
            explanation: `המנה "${dish.name}" מכילה את הרכיב "${ing}".`,
            relatedDishIds: [dish.id, ...sortedDistractors.slice(0, 3).map((d) => d.id)],
          });
        }
      }
    }

    // 3. dish_to_allergen
    if (activeFamilies.includes("dish_to_allergen") && dish.allergens && dish.allergens.length > 0) {
      for (const allg of dish.allergens) {
        const distractors = allAllergens.filter((a) => !dish.allergens.includes(a));
        if (distractors.length >= 3) {
          const sortedDistractors = distractors
            .map((d) => ({ d, score: getDeterministicValue(`${d}-${dish.id}-${allg}-distractor-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.d)
            .slice(0, 3);

          const opts = [allg, ...sortedDistractors];
          const sortedOpts = opts
            .map((o) => ({ o, score: getDeterministicValue(`${o}-${dish.id}-${allg}-options-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.o);

          candidates.push({
            id: `${dish.id}-dish_to_allergen-${allg}`,
            type: "identify_allergens",
            family: "dish_to_allergen",
            prompt: `איזה מהאלרגנים הבאים קיים במנה "${dish.name}"?`,
            options: sortedOpts,
            correctAnswer: allg,
            explanation: `המנה "${dish.name}" מכילה את האלרגן "${allg}".`,
            relatedDishIds: [dish.id],
          });
        }
      }
    }

    // 4. allergen_to_dish
    if (activeFamilies.includes("allergen_to_dish") && dish.allergens && dish.allergens.length > 0) {
      for (const allg of dish.allergens) {
        const distractors = dishes.filter((d) => !d.allergens.includes(allg));
        if (distractors.length >= 3) {
          const sortedDistractors = distractors
            .map((d) => ({ d, score: getDeterministicValue(`${d.id}-${dish.id}-${allg}-distractor-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.d);

          const opts = [dish, ...sortedDistractors.slice(0, 3)];
          const sortedOpts = opts
            .map((o) => ({ o, score: getDeterministicValue(`${o.id}-${dish.id}-${allg}-options-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.o.name);

          candidates.push({
            id: `${dish.id}-allergen_to_dish-${allg}`,
            type: "identify_allergens",
            family: "allergen_to_dish",
            prompt: `איזו מהמנות הבאות מכילה את האלרגן "${allg}"?`,
            options: sortedOpts,
            correctAnswer: dish.name,
            explanation: `המנה "${dish.name}" מכילה את האלרגן "${allg}".`,
            relatedDishIds: [dish.id, ...sortedDistractors.slice(0, 3).map((d) => d.id)],
          });
        }
      }
    }

    // 5. dish_to_tag
    if (activeFamilies.includes("dish_to_tag") && dish.tags && dish.tags.length > 0) {
      for (const tag of dish.tags) {
        const distractors = allTags.filter((t) => !dish.tags!.includes(t));
        if (distractors.length >= 3) {
          const sortedDistractors = distractors
            .map((d) => ({ d, score: getDeterministicValue(`${d}-${dish.id}-${tag}-distractor-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.d)
            .slice(0, 3);

          const opts = [tag, ...sortedDistractors];
          const sortedOpts = opts
            .map((o) => ({ o, score: getDeterministicValue(`${o}-${dish.id}-${tag}-options-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.o);

          candidates.push({
            id: `${dish.id}-dish_to_tag-${tag}`,
            type: "choose_dish_for_customer_need",
            family: "dish_to_tag",
            prompt: `איזו מהתגיות הבאות מתאימה למנה "${dish.name}"?`,
            options: sortedOpts,
            correctAnswer: tag,
            explanation: `המנה "${dish.name}" מתאימה לתגית "${tag}".`,
            relatedDishIds: [dish.id],
          });
        }
      }
    }

    // 6. tag_to_dish
    if (activeFamilies.includes("tag_to_dish") && dish.tags && dish.tags.length > 0) {
      for (const tag of dish.tags) {
        const distractors = dishes.filter((d) => !d.tags || !d.tags.includes(tag));
        if (distractors.length >= 3) {
          const sortedDistractors = distractors
            .map((d) => ({ d, score: getDeterministicValue(`${d.id}-${dish.id}-${tag}-distractor-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.d);

          const opts = [dish, ...sortedDistractors.slice(0, 3)];
          const sortedOpts = opts
            .map((o) => ({ o, score: getDeterministicValue(`${o.id}-${dish.id}-${tag}-options-${seed}`) }))
            .sort((a, b) => a.score - b.score)
            .map((item) => item.o.name);

          candidates.push({
            id: `${dish.id}-tag_to_dish-${tag}`,
            type: "choose_dish_for_customer_need",
            family: "tag_to_dish",
            prompt: `איזו מהמנות הבאות מתאימה לתגית "${tag}"?`,
            options: sortedOpts,
            correctAnswer: dish.name,
            explanation: `המנה "${dish.name}" מתאימה לתגית "${tag}".`,
            relatedDishIds: [dish.id, ...sortedDistractors.slice(0, 3).map((d) => d.id)],
          });
        }
      }
    }
  }

  // Deterministically shuffle candidates based on level + focus + seed
  const sortedCandidates = candidates
    .map((c) => ({
      c,
      score: getDeterministicValue(`${c.id}-${level}-${focus}-${seed}`),
    }))
    .sort((a, b) => a.score - b.score)
    .map((item) => item.c);

  const questions: PracticeQuestion[] = [];
  const seenPrompts = new Set<string>();
  let skippedAmbiguousCount = 0;

  for (const q of sortedCandidates) {
    if (seenPrompts.has(q.prompt)) {
      skippedAmbiguousCount++;
      continue;
    }
    seenPrompts.add(q.prompt);
    questions.push(q);
  }

  const finalQuestions = questions.slice(0, limit);

  // Check if overall menu dataset is rich enough to generate 4-option questions for this focus
  let hasEnoughDataForFourOptions = false;
  if (focus === "ingredients") {
    hasEnoughDataForFourOptions = allIngredients.length >= 4 && dishes.length >= 4;
  } else if (focus === "allergens") {
    hasEnoughDataForFourOptions = allAllergens.length >= 4 && dishes.length >= 4;
  } else if (focus === "tags") {
    hasEnoughDataForFourOptions = allTags.length >= 4 && dishes.length >= 4;
  } else {
    hasEnoughDataForFourOptions =
      (allIngredients.length >= 4 || allAllergens.length >= 4 || allTags.length >= 4) && dishes.length >= 4;
  }

  const categoriesRepresented = Array.from(new Set(finalQuestions.map((q) => q.family)));

  return {
    questions: finalQuestions,
    metadata: {
      generatedCount: finalQuestions.length,
      skippedAmbiguousCount,
      hasEnoughDataForFourOptions,
      categoriesRepresented,
    },
  };
}
