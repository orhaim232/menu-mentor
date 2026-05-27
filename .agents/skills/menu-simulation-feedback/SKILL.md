---
name: menu-simulation-feedback
description: Use this skill when implementing, reviewing, or improving the MenuMentor waiter simulation feedback flow, including /api/chat, AI customer roleplay, factual menu accuracy scoring, hospitality tone scoring, feedback JSON validation, conversation history, and practice attempt tracking.
---

# MenuMentor Simulation Feedback Skill

## Purpose

This skill defines how to build and review the core MenuMentor waiter simulation feedback flow.

MenuMentor is a mobile-first AI learning and simulation platform for waiter onboarding.  
The simulation flow allows a waiter to practice a real customer conversation before meeting an actual guest.

The system must evaluate every waiter response in two dimensions:

1. factual menu accuracy
2. hospitality tone

The goal is not only to check whether the waiter remembers the menu, but whether the waiter can use menu knowledge correctly in a real service situation.

---

## When to Use This Skill

Use this skill when working on:

- AI customer roleplay simulation
- `/api/chat`
- simulation chat UI under `/practice`
- waiter response submission
- conversation history sent to the LLM
- menu-aware feedback generation
- factual accuracy scoring
- hospitality tone scoring
- structured feedback JSON
- practice attempt tracking
- simulation-related error states
- simulation-related testing

---

## When Not to Use This Skill

Do not use this skill for:

- menu upload UI
- PDF or image parsing
- OCR
- manager dashboard layout
- semantic search implementation
- authentication setup
- database schema setup unless it directly supports simulation feedback
- custom themes
- POS integration
- voice-to-text
- text-to-voice

If the task is about menu upload or parsing, use a separate skill named:

```text
menu-upload-parsing
```

If the task is about real-time search, use a separate skill named:

```text
semantic-menu-search
```

---

## Required Project Context

Before using this skill, read:

1. `.agents/rules/code-structure-guide.md`
2. the project SPEC
3. the relevant `/practice` UI files
4. the relevant `/api/chat` route
5. relevant types under `/types`
6. relevant database helpers under `/lib/db`
7. relevant AI helpers under `/lib/ai`

Do not proceed from memory.

---

## Product Principle

Build the simulation as a learning and performance-support experience, not as a generic chatbot.

The waiter should practice:

- answering guest questions
- handling allergens safely
- explaining menu items clearly
- recommending dishes professionally
- using a warm service tone
- recovering from mistakes before meeting real customers

The AI customer may ask realistic restaurant questions, but the system must evaluate the waiter using the restaurant menu as the factual source of truth.

---

## Canonical Route

Use this route for simulation feedback:

```text
POST /api/chat
```

Do not create another simulation route unless explicitly requested.

Do not use:

```text
POST /api/upload
```

for simulation feedback.

---

## Required Stack

Use the existing project stack:

- Next.js App Router
- TypeScript
- Vercel AI SDK
- Supabase PostgreSQL
- Supabase Auth
- pgvector through Supabase
- TailwindCSS

Do not introduce a new framework, database, auth provider, vector database, or UI system.

---

## Allowed Files and Folders

You may modify only:

```text
/app
/components
/lib
/types
/supabase
```

Do not modify:

```text
/.github
/.husky
/public/assets
```

---

## Recommended File Locations

Use this structure for simulation-related implementation:

```text
/app/api/chat/route.ts
/app/practice/page.tsx

/components/chat/SimulationChat.tsx
/components/chat/ChatMessage.tsx
/components/chat/ChatInput.tsx
/components/chat/FeedbackCard.tsx

/lib/ai/prompts.ts
/lib/ai/feedback.ts

/lib/db/menuItems.ts
/lib/db/practiceAttempts.ts

/lib/validation/chat.ts

/types/chat.ts
/types/feedback.ts
/types/menu.ts
```

Keep UI, database access, validation, AI prompt construction, and types separated.

Do not put all logic into one large file.

---

## Authentication Rule

Before generating simulation feedback:

1. verify the user session server-side with Supabase Auth
2. reject unauthenticated users
3. never send auth tokens or personal identifiers to the LLM

If the session is invalid or expired, return HTTP `401` with:

```json
{
  "error": "Session expired. Please log in again."
}
```

Never send the following to the LLM:

- JWT token
- user email
- user full name
- raw session object
- private user identifiers

---

## Authorization Rule

Waiters may use:

```text
/practice
POST /api/chat
```

Managers may upload menus, but menu upload behavior is outside this skill.

If the feature touches manager-only actions, stop and check the global rules first.

---

## Restaurant Scope Rule

Every simulation must be scoped to the current restaurant.

Never retrieve menu data globally.

Bad:

```ts
const items = await supabase
  .from("menu_items")
  .select("*");
```

Good:

```ts
const items = await supabase
  .from("menu_items")
  .select("*")
  .eq("restaurant_id", restaurantId);
```

If `restaurant_id` is missing, do not call the LLM.

Stop and return a controlled error.

---

## Menu Ground Truth Rule

The database menu is the factual source of truth.

The LLM may evaluate and phrase feedback, but it must not invent:

- ingredients
- allergens
- dietary tags
- dish availability
- dish descriptions
- prices
- restaurant policies

For allergen-related questions, be strict.

If the waiter gives unsafe or unsupported allergen information, reduce the factual score significantly.

---

## Empty Menu Rule

If the restaurant has no menu items, do not start simulation feedback.

Show this exact message:

```text
Your manager hasn't uploaded a menu yet.
```

Required behavior:

- disable the chat input
- do not call the LLM
- do not create a practice attempt
- keep the UI stable

---

## Chat Input Validation

Validate chat input on both client and server.

Rules:

- maximum length: 500 characters
- empty input must not submit
- whitespace-only input must not submit
- input over 500 characters must be blocked
- duplicate rapid submissions must be prevented

Use this constant if needed:

```ts
const MAX_CHAT_INPUT_LENGTH = 500;
```

---

## Conversation History Rule

While the user is in a simulation session, retain conversation history.

Use Vercel AI SDK `useChat` unless the project already has a clear equivalent.

Send enough recent history for context, but avoid unnecessary token usage.

Recommended window:

```text
last 10 to 16 messages
```

Do not send unrelated old messages.

Do not send private user data.

---

## Menu Context Rule

Before calling the LLM, build a compact menu context.

Use this shape:

```ts
type MenuContextItem = {
  id: string;
  name: string;
  description: string | null;
  ingredients: string[];
  allergens: string[];
  dietary_tags: string[];
};
```

Retrieve relevant menu items by priority:

1. currently practiced menu item, if known
2. semantic similarity against menu embeddings
3. small fallback list of restaurant menu items

Never send the full menu if it is large.

Never send menu items from another restaurant.

---

## Feedback JSON Contract

The LLM response must validate against this structure:

```ts
type SimulationFeedback = {
  factual_score: number;
  tone_score: number;
  feedback_text: string;
  corrected_response?: string;
  referenced_menu_item_ids?: string[];
};
```

Validation rules:

- `factual_score` must be a number from 0 to 100
- `tone_score` must be a number from 0 to 100
- `feedback_text` must be a non-empty string
- `corrected_response` is optional
- `referenced_menu_item_ids` is optional
- `referenced_menu_item_ids` may include only real menu item IDs from the current restaurant

Do not display malformed JSON.

Do not store malformed JSON.

Do not trust the model output without validation.

---

## Scoring Rules

### Factual Score

Use this scale:

| Score | Meaning |
|---|---|
| 90-100 | Accurate and complete based on menu context |
| 70-89 | Mostly accurate with minor missing detail |
| 40-69 | Partially accurate but incomplete or risky |
| 1-39 | Mostly incorrect or misleading |
| 0 | Dangerous, unsupported, or contradicts menu/allergen facts |

Allergen mistakes are serious factual mistakes.

### Tone Score

Use this scale:

| Score | Meaning |
|---|---|
| 90-100 | Professional, clear, warm, and guest-centered |
| 70-89 | Acceptable service tone with small issues |
| 40-69 | Understandable but blunt, vague, cold, or hesitant |
| 1-39 | Poor hospitality tone |
| 0 | Rude, dismissive, or inappropriate |

---

## Language Rule

Supported locales:

```ts
type Locale = "he" | "en";
```

Every simulation request must include the selected locale.

Rules:

- if locale is `he`, user-facing feedback must be Hebrew
- if locale is `en`, user-facing feedback must be English
- JSON keys must always remain in English
- do not change the language of an already-running LLM response
- the selected locale applies to the next AI request

---

## Prompt Requirements

The simulation prompt must include:

- selected locale
- compact restaurant-scoped menu context
- recent conversation history
- latest waiter response
- instruction to evaluate factual accuracy
- instruction to evaluate hospitality tone
- instruction to return valid JSON only

The prompt must not include:

- JWT token
- user email
- user name
- unrelated database records
- menus from another restaurant
- raw logs
- private user data

---

## Recommended System Prompt

Use this as the base pattern and adapt only when necessary:

```text
You are MenuMentor, a restaurant waiter training evaluator.

Evaluate the waiter response using only the provided restaurant menu context and conversation history.

Return only valid JSON with these keys:
- factual_score: number from 0 to 100
- tone_score: number from 0 to 100
- feedback_text: string
- corrected_response: optional string
- referenced_menu_item_ids: optional array of strings

Rules:
- Use the selected locale for all user-facing text.
- Keep JSON keys in English.
- Do not invent menu facts.
- If the waiter says something unsupported by the menu context, lower factual_score.
- Hospitality tone should reward clarity, warmth, confidence, and helpfulness.
- Allergen errors are serious factual errors.
- Do not include markdown.
- Do not include explanations outside the JSON.
```

---

## Streaming Rule

Strict JSON and raw token streaming are risky together.

Use this rule:

1. Prefer non-streamed structured output for strict simulation feedback JSON.
2. If the UI needs a streaming feel, stream only after structured feedback has been validated.
3. Do not stream raw JSON token-by-token unless a robust final validation layer exists.

Recommended response:

```ts
return Response.json({
  factual_score,
  tone_score,
  feedback_text,
  corrected_response,
  referenced_menu_item_ids
});
```

---

## Practice Tracking Rule

After valid feedback is generated, store a practice attempt.

Minimum fields:

```text
user_id
restaurant_id
menu_item_id
factual_score
tone_score
feedback_text
user_message
locale
created_at
```

If `menu_item_id` cannot be confidently inferred, store `null`.

Do not invent a menu item match.

Practice tracking is required because the Short Learning Path depends on the 5 least-practiced menu items.

---

## Timeout Rule

If the LLM request exceeds 5000ms:

1. abort the request
2. show this exact message:

```text
The customer is thinking... please try again
```

3. retain the user's input
4. do not store a practice attempt
5. do not clear conversation state

---

## Duplicate Submission Rule

If the user clicks Send multiple times:

- debounce the Send button for 1000ms
- disable Send while the request is pending
- prevent duplicate practice attempts
- never rely only on client-side debounce

---

## Required Error Messages

Use exact messages.

### Empty Menu

```text
Your manager hasn't uploaded a menu yet.
```

### LLM Timeout

```text
The customer is thinking... please try again
```

### Expired Session

```json
{
  "error": "Session expired. Please log in again."
}
```

---

## Implementation Checklist

Before editing code, confirm:

- the task is simulation-feedback related
- files are inside allowed folders
- `/api/chat` is the route being used
- auth is checked server-side
- `restaurant_id` is available
- menu retrieval filters by `restaurant_id`
- empty menu state is handled before LLM call
- chat input max length is 500 characters
- selected locale is passed to the server
- prompt uses selected locale
- no PII is sent to the LLM
- response validates against `SimulationFeedback`
- practice attempt is stored after valid feedback
- send button has loading/disabled state
- duplicate submissions are prevented
- timeout handling retains user input

---

## Review Checklist

When reviewing code, flag:

- LLM prompt includes user email, name, JWT, or other PII
- menu query is not filtered by `restaurant_id`
- empty menu still calls the LLM
- malformed JSON can reach the UI
- malformed JSON can reach the database
- `factual_score` or `tone_score` can be outside 0-100
- chat input can exceed 500 characters
- user can double-submit identical messages
- timeout clears the user's unsent input
- practice attempts are not stored
- endpoint names conflict with the project rules
- code modifies forbidden folders

---

## Minimal Acceptance Test

A correct implementation must pass:

```gherkin
Scenario: Successful Simulation Turn
  GIVEN an authenticated waiter belongs to a restaurant with menu items
  AND the waiter is in an active simulation session
  WHEN the waiter submits "The burger contains gluten in the bun"
  THEN the UI appends the waiter message
  AND the server sends recent conversation history to the LLM
  AND the LLM receives only menu items scoped to the waiter's restaurant
  AND the response is valid JSON containing factual_score, tone_score, and feedback_text
  AND factual_score is between 0 and 100
  AND tone_score is between 0 and 100
  AND the practice attempt is stored
  AND the UI displays feedback in the selected locale
```

---

## Stop Conditions

Stop and ask for clarification if:

1. `.agents/rules/code-structure-guide.md` is missing
2. the task is not related to simulation feedback
3. the task requires modifying forbidden folders
4. there is no reliable `restaurant_id`
5. the database has no way to store practice attempts
6. strict JSON and raw token streaming are both required without validation
7. the implementation would expose PII or JWT data to the LLM
8. the user asks to implement menu upload/parsing inside this skill