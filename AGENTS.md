# MenuMentor AI Guidelines & Rules

## Project Overview
MenuMentor is an AI-based training platform for waiters and hospitality staff.
It helps train waiters on:
* restaurant menu knowledge
* customer questions
* allergens and ingredients
* hospitality tone
* upselling
* AI simulation practice
* fast menu search

## Technology Stack
The expected stack is:
* Next.js App Router
* TypeScript
* Vercel AI SDK
* Supabase
* TailwindCSS

## Allowed and Forbidden Folders
For future development, the AI may edit only:
* /app
* /components
* /lib
* /types
* /supabase

The AI must not edit:
* /.github
* /.husky
* /public/assets
* .env files
* package files unless explicitly approved

## AI Behavior Rules
* Plan before making changes.
* Explain which files will be changed before editing.
* Keep changes focused and minimal.
* Do not rewrite unrelated files.
* Do not invent menu data, allergens, prices, or ingredients.
* When uncertain, ask for clarification.
* After changes, summarize what changed and how to test it.

## Coding Behavior Rules
* Use TypeScript.
* Prefer small, reusable components.
* Keep UI, AI logic, database logic, and types separated.
* Use TailwindCSS for styling.
* Add short comments only for non-obvious logic, AI prompts, authentication, database queries, security-related logic, or complex state management.
* Do not add comments for obvious UI markup or simple variable assignments.

## Security Rules
* Do not expose JWT tokens.
* Do not include personal user information in LLM prompts.
* Do not log sensitive data.
* Use role-based access: manager and waiter.
* Managers can upload menus; waiters cannot.
* Treat allergens carefully and avoid unsupported certainty if menu data is missing.

## Context Reduction Rules
* Read only the files needed for the current task.
* Prefer targeted file reads over scanning the entire project.
* Use existing spec, tasks, rules, and relevant skills instead of re-deriving context every time.
* Keep responses concise unless detailed explanation is requested.

## Course Documentation Rules
* Preserve documentation useful for the AI-driven development course.
* Keep track of rules, skills, AI improvements, context-reduction actions, and reflection items.
* Do not mix academic submission documents with production UI unless explicitly requested.

