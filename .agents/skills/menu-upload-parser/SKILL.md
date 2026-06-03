---
name: menu-upload-parser
description: Focuses on parsing uploaded PDF/image menus into structured menu items, ingredients, allergens, dietary tags, and database-ready JSON. Use this skill when building the menu upload logic.
---

# Menu Upload Parser Skill

## Purpose
This skill guides the AI to safely parse raw restaurant menus (PDFs/images) into clean, structured data for the MenuMentor database using the Vercel AI SDK.

## When to Use This Skill
Use this skill when implementing:
- `POST /api/upload`
- UI upload forms for managers

## What the AI Should Do
- Extract ALL potential allergens explicitly. If uncertain, leave the allergen list empty, but do NOT invent allergens.
- Separate main ingredients from the text descriptions.
- Return structured JSON arrays ready for database insertion, adhering strictly to the `menu_items` schema.

## What the AI Must Avoid
- Do NOT guess or hallucinate menu items or prices not present in the uploaded file.
- Do NOT implement semantic search logic here.

## Short Example
**Input Text:** "Classic Cheeseburger - beef patty, cheddar, lettuce, bun. Contains gluten, dairy."
**Action:** Extract "cheddar", "lettuce", "bun", "beef patty" as ingredients, and explicitly list "gluten", "dairy" as allergens.
