---
name: training-scenario-writer
description: Use this skill when creating, reviewing, or improving MenuMentor waiter training scenarios, including customer questions, menu knowledge practice, allergens, dietary preferences, vegetarian or vegan needs, spice level, gluten, dish recommendations, upselling opportunities, and difficulty progression. Use this skill whenever the task is about designing the practice situation itself, not evaluating the waiter response.
---

# MenuMentor Training Scenario Writer Skill

## Purpose

This skill defines how to create short, realistic training scenarios for new waiters in MenuMentor.

MenuMentor is a mobile-first AI learning and simulation platform for waiter onboarding.  
The goal of this skill is to help create practice situations that prepare waiters to answer real customer questions about the restaurant menu.

This skill creates the training scenario itself.  
It does not evaluate the waiter response and does not generate feedback after the waiter answers.

For evaluating waiter answers and generating feedback, use the separate skill:

```text
menu-simulation-feedback
```

---

## When to Use This Skill

Use this skill when working on:

- creating a waiter training scenario
- writing a realistic customer question
- creating menu knowledge practice
- creating allergen-safe practice situations
- practicing vegetarian or vegan menu questions
- practicing gluten, spice level, or dietary preference questions
- practicing dish recommendations
- practicing upselling opportunities
- creating scenario difficulty levels
- reviewing whether a training scenario is clear and useful
- creating mock training scenarios before the UI or database exists

---

## When Not to Use This Skill

Do not use this skill for:

- evaluating a waiter response
- generating feedback after a waiter answers
- scoring factual accuracy or hospitality tone
- validating SimulationFeedback JSON
- building `/api/chat`
- building the `/practice` UI
- creating database tables
- uploading menus
- parsing PDFs, images, or OCR
- semantic menu search
- authentication setup
- practice attempt tracking

If the task is about feedback after a waiter answers, use:

```text
menu-simulation-feedback
```

If the task is about checking whether menu data is complete, use or create a separate skill:

```text
menu-data-completeness-auditor
```

---

## Product Principle

Create scenarios as learning tools, not as trick questions.

A good MenuMentor training scenario should help a new waiter practice one clear service skill at a time.

The scenario should feel like a realistic customer interaction in a restaurant, but it should not be unnecessarily confusing, overly dramatic, or intentionally misleading.

The waiter should practice:

- answering customer questions clearly
- using menu knowledge correctly
- handling allergens safely
- responding to dietary preferences
- recommending suitable dishes
- offering upsell suggestions only when appropriate
- staying warm, professional, and helpful

---

## Scenario Scope Rule

Each scenario must focus on one main learning goal.

Good:

```text
Learning goal: Practice answering an allergen question safely.
```

Good:

```text
Learning goal: Practice recommending a side dish that matches the customer's preference.
```

Avoid combining too many goals in one scenario.

Bad:

```text
Learning goal: Practice allergens, upselling, complaints, pricing, and vegetarian options all at once.
```

Difficulty can increase by making the customer question more realistic or adding context, but the learning goal should still remain clear.

---

## Menu Ground Truth Rule

Use only the menu information provided in the prompt, mock data, database context, or selected menu item.

Do not invent:

- ingredients
- allergens
- dietary tags
- vegan or vegetarian suitability
- gluten information
- spice level
- prices
- availability
- restaurant policies
- recommended pairings

If the menu does not provide enough information for a safe scenario, do not invent missing details.

For allergens, gluten, vegan/vegetarian status, or dietary restrictions, accuracy is more important than creating a dramatic scenario.

---

## Missing Menu Information Rule

If the user asks for a scenario that depends on missing menu information, do not guess.

For example:

- If the user asks for a gluten scenario, but the menu does not say whether the dish contains gluten, do not create a scenario that assumes it does or does not.
- If the user asks for a vegan scenario, but the menu does not include vegan information, do not label the dish vegan.
- If the user asks for an allergen scenario, but allergen data is missing, do not invent allergens.

Instead, create one of these outputs:

1. A scenario that teaches the waiter to check with the kitchen or manager.
2. A note that the scenario cannot be safely created until the missing menu information is provided.
3. A TODO explaining which menu data should be added.

Example safe phrasing:

```text
The menu does not include gluten information for this dish. This scenario should train the waiter to say: "I want to make sure I give you accurate information, so I’ll check with the kitchen."
```

---

## Scenario Types

This skill can create scenarios for:

1. ingredients
2. allergens
3. vegetarian options
4. vegan options
5. spicy / not spicy preferences
6. gluten-related questions
7. dish recommendations
8. upselling opportunities
9. customers who are unsure what to order
10. customer preferences such as light, not heavy, suitable for children, or not fried

Do not create customer complaint scenarios unless the user explicitly asks for them.  
Customer complaints may require a separate skill or a later version of this skill.

---

## Difficulty Levels

Use these difficulty levels:

### Easy

The customer asks a direct and simple question.

Example:

```text
Does this dessert contain nuts?
```

Use Easy when the waiter should practice retrieving one clear piece of menu information.

### Medium

The customer includes one preference, need, or limitation.

Example:

```text
I want something light and not spicy. What do you recommend?
```

Use Medium when the waiter should match menu information to a customer preference.

### Hard

The customer question is more realistic and requires careful judgment, but still has one main learning goal.

Example:

```text
I’m sensitive to gluten and I want something light. Is this dish safe for me?
```

Use Hard when the waiter needs to respond carefully, avoid guessing, and possibly say they will check with the kitchen.

Hard scenarios should not become confusing multi-topic exams.

---

## Upselling Rule

Only include upselling when the learning goal is upselling, recommendation, pairing, or increasing order value.

Upselling should be helpful and natural, not aggressive.

Good upselling:

```text
This burger pairs well with sweet potato fries if you want something richer, or a green salad if you prefer something lighter.
```

Bad upselling:

```text
You should definitely add fries, dessert, and a drink.
```

Never prioritize upselling over safety, allergies, or customer needs.

---

## Output Format

Return each scenario using this structure:

```text
Scenario title:
Customer question:
Menu context used:
Learning goal:
Difficulty:
What the waiter should practice:
Good answer should include:
Common mistake to avoid:
```

Keep the output short and clear.

Do not include a full ideal waiter answer unless the user explicitly asks for one.

This skill creates the practice situation.  
The feedback skill evaluates the waiter’s answer later.

---

## Output Style

The scenario should be:

- short but useful
- clear enough for a new waiter
- realistic for a restaurant conversation
- based only on provided menu facts
- focused on one learning goal
- written in simple language
- not overly dramatic
- not intentionally confusing

If the selected locale is `he`, write user-facing scenario text in Hebrew.  
If the selected locale is `en`, write user-facing scenario text in English.

If no locale is provided, default to Hebrew.

---

## MVP / Prototype Rule

This skill supports early planning and prototype work.

In MVP / Prototype Mode:

- It is allowed to create scenarios from mock menu data supplied directly in the prompt.
- It is allowed to create scenarios without a real database.
- It is allowed to create scenarios without a UI.
- It is allowed to create scenarios without `/api/chat`.
- Missing production requirements should be marked as TODO.
- Do not invent missing menu facts.
- Do not present mock data as production-ready restaurant data.

In Production Mode:

- Scenario generation should use real restaurant menu data.
- Menu data should be scoped to the current restaurant.
- Scenario content must not include menu information from another restaurant.
- Missing menu fields should be handled safely.
- If scenario generation is stored in the database, validate the structure before saving.

---

## Safety Rules

For allergens, dietary restrictions, vegan/vegetarian status, gluten, and spice level:

- do not guess
- do not invent missing data
- do not create unsafe recommendations
- do not encourage the waiter to answer with certainty when the data is missing
- encourage checking with the kitchen or manager when needed
- make safety more important than upselling

---

## Scenario Review Checklist

When reviewing a scenario, check:

- Does it focus on one learning goal?
- Is it realistic for a waiter?
- Is it short and clear?
- Is it based only on provided menu facts?
- Does it avoid inventing allergens, ingredients, prices, or dietary tags?
- Is the difficulty level appropriate?
- Is upselling included only when relevant?
- Is safety prioritized in allergen or dietary scenarios?
- Is the scenario suitable for a new waiter?
- Is the output in the required format?

---

## Test Cases

### Test Case 1 — Allergen Scenario

Input:

```text
Locale: he
Menu item: עוגת שוקולד
Description: עוגת שוקולד עשירה עם שקדים טחונים
Allergens: שקדים, ביצים, חלב
Goal: Create an allergen training scenario.
Difficulty: Easy
```

Expected result:

- The scenario should focus on a customer asking whether the dessert contains nuts.
- The scenario should mention that the menu context includes almonds.
- The learning goal should be allergen safety.
- The common mistake should warn against saying “no nuts” when almonds are present.
- The scenario should not invent other allergens.

---

### Test Case 2 — Upselling Scenario

Input:

```text
Locale: he
Menu item: המבורגר הבית
Description: המבורגר בקר עם רוטב הבית בלחמנייה
Recommended pairings: צ׳יפס בטטה, בירה בהירה, סלט ירוק
Goal: Create an upselling training scenario.
Difficulty: Medium
```

Expected result:

- The scenario should train natural recommendation or upselling.
- The customer question should invite a recommendation.
- The scenario should not push every add-on at once.
- The good answer should include one or two relevant pairing options.
- The common mistake should mention being too dry or too pushy.

---

### Test Case 3 — Customer Preference Scenario

Input:

```text
Locale: he
Menu items:
1. סלט עוף — קליל, לא חריף
2. טאקו דג — חריף
3. פסטה שמנת — כבדה יחסית
Goal: Create a scenario for a customer asking for something light and not spicy.
Difficulty: Medium
```

Expected result:

- The scenario should focus on matching customer preference.
- The customer should ask for something light and not spicy.
- The menu context should point to the chicken salad.
- The scenario should not recommend the spicy taco.
- The common mistake should warn against ignoring the “not spicy” preference.

---

### Test Case 4 — Vegetarian / Vegan Scenario

Input:

```text
Locale: he
Menu item: פסטה עגבניות
Description: פסטה ברוטב עגבניות עם בזיליקום
Dietary tags: צמחוני
Vegan information: not provided
Goal: Create a vegetarian/vegan training scenario.
Difficulty: Hard
```

Expected result:

- The scenario should allow a vegetarian question based on the provided tag.
- The scenario should not claim the dish is vegan because vegan information is missing.
- The scenario should train the waiter to distinguish between vegetarian and vegan.
- The good answer should include checking with the kitchen if the customer specifically asks about vegan suitability.
- The scenario should not invent dairy, egg, or other ingredients.
