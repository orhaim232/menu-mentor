---
name: menu-practice-generator
description: Focuses on building and testing the deterministic memory game question generator based on restaurant menu items. Helps design closed questions (Multiple Choice), distractor choices from menu context, immediate feedback, and quiz validation without using an LLM at runtime.
---

# MenuMentor Practice Generator Skill

## Purpose

This skill defines how to generate and validate closed-ended memory and recognition questions for waiters in MenuMentor. 
These questions are generated deterministically (without using LLM at game runtime) from the restaurant menu data to test the waiter's factual knowledge (dish names, ingredients, allergens, dietary tags, and images).

---

## When to Use This Skill

Use this skill when working on:
- Designing or implementing the memory game question generator logic.
- Creating deterministic multiple-choice questions from active menu items.
- Selecting plausible distractor options (incorrect choices) from other dishes in the same menu.
- Validating the 10-question round structure.
- Reviewing immediate feedback handling (correct vs. incorrect visual indicators).
- Defining image-based questions (and managing AI illustration labels).

---

## When Not to Use This Skill

Do not use this skill for:
- Writing customer roleplay conversations (use `training-scenario-writer`).
- Evaluating free-text waiter responses or grading chat dialogue (use `menu-simulation-feedback`).
- Manager-facing upload forms or PDF parsing (use `menu-upload-parser`).
- Setting up database schemas or authentication.

---

## Question Types

The generator supports these 6 distinct question types:

1. **תמונה -> שם מנה (Image to Dish Name)**:
   - Show dish image.
   - Options: 4 dish names from the menu.

2. **רכיבים -> שם מנה (Ingredients to Dish Name)**:
   - Show list of 3-4 key ingredients.
   - Options: 4 dish names.

3. **השלמת רכיב חסר (Missing Ingredient)**:
   - Show dish name and all its ingredients except one.
   - Options: 4 ingredient choices (1 correct, 3 distractors from other dishes).

4. **בחירת אלרגן (Select Allergen)**:
   - Ask if a specific dish contains a certain allergen, or ask which of the listed allergens is in the dish.
   - Options: Multiple choice allergens.

5. **טבעוני / צמחוני (Vegan / Vegetarian Suitability)**:
   - Ask if a dish is suitable for vegans, vegetarians, or both.
   - Options: Yes/No or classification options.

6. **שם מנה -> בחירת רכיבים (Dish Name to Ingredients)**:
   - Show dish name.
   - Options: 4 ingredient lists (1 correct list, 3 incorrect lists compiled from other dishes).

---

## Rules and Constraints

- **Deterministic Generator**: Do not use LLMs to create questions during gameplay. Code must extract facts and build options directly from active database menu items.
- **Round Length**: Exactly 10 questions per game round.
- **Options Structure**: 4 choices per question (Multiple Choice) with exactly 1 correct answer.
- **Plausible Distractors**: Distractors (incorrect options) must be pulled from real data of other dishes on the same restaurant's menu. Never invent ingredients, allergens, or dish names.
- **No Image, No Image-Question**: If a dish lacks an image URL, never generate an "Image to Dish Name" question for it.
- **One Fact Focus**: Each question must target exactly one piece of information (e.g. either ingredients, or allergens, or dietary tags). Do not mix them in a single question.
- **Immediate Feedback**: The UI must display whether the choice is correct/incorrect immediately after selection, before proceeding.
- **No Scoring History (MVP)**: Show final result at the end of the 10-question round, but do not save scores or history to the database.

---

## Distractor Selection Rules

1. Never invent menu items, ingredients, allergens, dietary tags, categories, or images.

2. Distractors must be selected from the supplied menu data.

3. Category matching:
- When the target dish has a category, dish-name distractors must come from other dishes in the same category.
- Do not use desserts as distractors for pasta questions, or unrelated categories only to fill the options.
- If there are not enough same-category distractors, reduce the number of options or skip the question.

4. Dish-name questions:
- Exclude the correct dish from distractors.
- Use each dish name only once.
- Do not use aliases or nearly identical names that create ambiguity.
- Every question must have exactly one valid correct answer.

5. Missing-ingredient questions:
- The correct missing ingredient must belong to the target dish.
- Distractors should come from other dishes in the same category.
- A distractor must not already exist in the target dish.
- A distractor must not equal the hidden correct ingredient.
- All options must be unique.

6. Allergen questions:
- Use only allergen values that exist in the supplied menu.
- Prefer allergens from other dishes in the same category.
- Do not use an allergen already present in the target dish as a false distractor.
- Do not create a question if more than one answer could be correct.

7. Vegan / vegetarian questions:
- Use only controlled answer labels:
  - vegan
  - vegetarian
  - neither
  - insufficient information
- Do not infer vegan status from a vegetarian tag.
- When explicit information is missing, the correct answer must be insufficient information.

8. Image questions:
- Use only dishes with image_url.
- Dish-name distractors must come from the same category.
- Skip the question if there are not enough valid options.

9. Option validation:
- No duplicate options.
- The correct answer appears exactly once.
- No distractor may also be factually correct.
- Randomize the correct-answer position.
- Avoid repeating the same distractors unnecessarily across the 10-question round.

10. Insufficient-data fallback:
- Prefer 4 options when enough valid distractors exist.
- Use 2 or 3 options when the menu or category is small.
- If there are still not enough valid distractors, generate another supported question type.
- If no valid question can be created, skip it or return an insufficient-data result.
- Never invent values to force 4 options.

---

## Image Standards

- **Preferred**: Manager-uploaded real dish photo.
- **AI Illustration**: If using AI generated illustrations, the UI must render a clear label: "איור להמחשה" (Illustration for visualization purposes). Never present AI illustrations as real photos.

---

## Division of Responsibilities

- **menu-practice-generator**: Deterministic closed-ended questions (Multiple Choice) testing factual memory of menu items. No LLM.
- **training-scenario-writer**: Customer roleplay prompts, situations, and dialogue choices.
- **menu-simulation-feedback**: Evaluation and scoring of waiter's free-text input via LLM.

---

## MVP Mode

It is allowed to run, test, and validate the question generator utility with mock menu datasets without requiring a database connection or a front-end UI.

---

## Test Cases

### Test Case 1: Ingredients -> Dish Name
- **Input**:
  - Menu Items:
    1. "סלט קינואה" (מרכיבים: קינואה, חמוציות, מלפפון, פטרוזיליה)
    2. "סלט קיסר" (מרכיבים: חסה, קרוטונים, פרמזן, רוטב קיסר)
    3. "פסטה עגבניות" (מרכיבים: פסטה, עגבניות, בזיליקום)
- **Expected Question**:
  - Prompt: "איזו מנה מכילה את המרכיבים הבאים: חסה, קרוטונים, פרמזן, רוטב קיסר?"
  - Correct Answer: "סלט קיסר"
  - Distractors: "סלט קינואה", "פסטה עגבניות"

### Test Case 2: Missing Ingredient
- **Input**:
  - Target Dish: "פסטה עגבניות" (מרכיבים: פסטה, עגבניות, בזיליקום)
  - Distractor pool: "סלט קיסר", "סלט קינואה"
- **Expected Question**:
  - Prompt: "פסטה עגבניות מכילה פסטה, עגבניות, ו____?"
  - Correct Answer: "בזיליקום"
  - Distractors: "חמוציות", "פרמזן", "חסה"

### Test Case 3: Allergens
- **Input**:
  - Target Dish: "מלבי" (אלרגנים: חלב, בוטנים)
  - Other allergens in menu: "גלוטן", "שומשום"
- **Expected Question**:
  - Prompt: "אילו מהאלרגנים הבאים קיימים במנה מלבי?"
  - Correct Answer: "חלב, בוטנים"
  - Distractors: "גלוטן", "שומשום", "ללא אלרגנים"

### Test Case 4: Vegan / Vegetarian Tags
- **Input**:
  - Dish A: "המבורגר טבעוני" (תגיות: טבעוני, צמחוני)
  - Dish B: "פסטה שמנת" (תגיות: צמחוני)
- **Expected Question**:
  - Prompt: "האם המנה פסטה שמנת מתאימה לטבעונים?"
  - Correct Answer: "לא, המנה צמחונית בלבד"
  - Distractors: "כן, המנה טבעונית לחלוטין", "לא, המנה מכילה בשר"

### Test Case 5: Missing Image
- **Input**:
  - Dish: "מרק ירקות" (ללא image_url)
- **Expected Question**:
  - Never generate an "Image to Dish Name" question using "מרק ירקות".
