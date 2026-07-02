# MenuMentor AI Guidelines & Rules

## Project Overview
MenuMentor is an AI-based training platform for waiters and hospitality staff.

### CURRENT MVP
- manager Magic Link authentication
- manager add/list/delete dishes
- structured ingredients, allergens, and tags
- waiter restaurant-code validation
- real menu cards from Supabase
- shared learning-path preferences
- deterministic knowledge game
- immediate factual feedback
- weighted scoring when consulting the menu
- responsive desktop/mobile learning UI

### IN DEVELOPMENT
- AI customer simulation
- final AI conversation feedback

### FUTURE
- image/PDF menu parsing
- semantic menu search

## Technology Stack
* Next.js App Router
* TypeScript
* Vercel AI SDK
* Supabase
* TailwindCSS

## Allowed and Forbidden Folders
For future development, the AI may edit only: `/app`, `/components`, `/lib`, `/types`, `/supabase`.
The AI must not edit: `/.github`, `/.husky`, `/public/assets`, `.env` files, `package` files unless explicitly approved.

## AI Behavior Rules
* **Skill Reading:** Read the relevant Skill before applicable work.
* **Context Scope:** Perform task-relevant file reads only.
* **Edit Scope:** Maintain focused edit scope. Do not rewrite unrelated files.
* **Factual Accuracy:** No invented menu/allergen facts.
* **Model Choice:** Use stronger models for audits/risky refactors, and faster models for focused changes.
* **Communication:** Use Caveman mode output when requested.
* **Honesty:** No false claims that unused Skills were used. No AI-generated personal reflections.
* **Planning:** Plan before making changes. Explaining files to be changed.

## Coding Behavior Rules
* Use TypeScript. Prefer small, reusable components.
* Keep UI, AI logic, database logic, and types separated.
* Use TailwindCSS for styling. Add short comments only for non-obvious logic.

## Security Rules
* Do not expose JWT tokens.
* Do not include personal user info in LLM prompts.
* Use role-based access: manager vs waiter.

## Course Documentation Rules
* Preserve documentation useful for the AI course.
* Keep track of rules, skills, AI improvements, context reduction actions.
