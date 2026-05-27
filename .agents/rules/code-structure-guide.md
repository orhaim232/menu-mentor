# MenuMentor Project Rules

## Recommended Location

Place this file in:

```text
.agents/rules/Rules.md
```

Alternative name:

```text
.agents/rules/code-structure-guide.md
```

Recommended activation mode: **Always On**.

---

## Purpose of This Rules File

This file defines the global technological rules for the MenuMentor project.

MenuMentor is a mobile-first AI learning and simulation platform for waiter onboarding. The system moves waiter training from passive menu reading into active, performance-based practice.

The product includes four core capabilities:

1. AI customer roleplay simulation
2. Immediate dual-layer feedback: factual menu accuracy and hospitality tone
3. AI-based menu parsing from PDF or image uploads
4. Real-time semantic menu search during service

These rules apply globally to the project unless a more specific workflow or skill explicitly overrides them.

---

## Core Product Principle

Always build MenuMentor as a learning and performance-support system, not as a generic chatbot.

The system should help waiters:

- practice before meeting real customers
- answer menu questions accurately
- handle allergens and dietary restrictions safely
- improve service tone
- make better culinary recommendations
- reduce dependency on managers during shifts

The system should help managers:

- upload menus easily
- avoid manual course building
- keep menu knowledge structured and searchable
- reduce onboarding time and service errors

---

## Technology Stack

Use the existing project stack only:

- Next.js App Router
- TypeScript
- Vercel AI SDK
- Supabase PostgreSQL
- Supabase Auth
- pgvector through Supabase
- TailwindCSS
- DOMPurify only when sanitized HTML rendering is required

Do not introduce:

- a different frontend framework
- a different backend framework
- a different authentication provider
- a different database
- a different vector search engine
- a separate CMS
- a separate LMS
- a custom UI framework

If a new dependency is required, explain why it is necessary before adding it.

---

## Allowed Project Areas

You may modify only these folders:

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

Do not move, rename, or delete protected folders.

---

## Recommended Project Structure

Use this structure unless the existing codebase already has a clear equivalent structure.

```text
/app
  /api
    /chat
      route.ts
    /menu
      route.ts
    /search
      route.ts
  /login
    page.tsx
  /dashboard
    page.tsx
  /practice
    page.tsx
  layout.tsx
  page.tsx

/components
  /chat
    SimulationChat.tsx
    ChatMessage.tsx
    ChatInput.tsx
    FeedbackCard.tsx
  /menu
    MenuUploadForm.tsx
    MenuItemCard.tsx
  /search
    FastSearchInput.tsx
    SearchResults.tsx
  /ui
    Button.tsx
    Card.tsx
    Input.tsx
    Toast.tsx
    LanguageToggle.tsx

/lib
  /ai
    prompts.ts
    feedback.ts
    parsing.ts
  /auth
    server.ts
    roles.ts
  /db
    menuItems.ts
    practiceAttempts.ts
    restaurants.ts
  /search
    embeddings.ts
    semanticSearch.ts
  /validation
    chat.ts
    menu.ts
    upload.ts
  /i18n
    locales.ts
    dictionary.ts
  supabaseClient.ts
  supabaseServer.ts

/types
  menu.ts
  chat.ts
  feedback.ts
  auth.ts
  database.ts

/supabase
  /migrations
```

Keep feature-specific logic grouped by domain.

Do not dump unrelated logic into a single large utility file.

---

## Architecture Rules

Use a clear separation between:

1. UI components
2. server routes
3. database access
4. AI prompt construction
5. validation
6. shared types

Rules:

- React components must not contain raw database logic.
- API routes must not contain large prompt strings directly if the prompt can live in `/lib/ai/prompts.ts`.
- Supabase queries should be wrapped in dedicated helper functions under `/lib/db`.
- Validation logic should live under `/lib/validation`.
- Shared TypeScript types should live under `/types`.
- UI components should receive data through props and avoid hidden side effects.
- Server-only logic must stay server-side.

---

## Rendering and Component Rules

Use Server Components by default.

Use Client Components only when required for:

- user input
- chat interactions
- stateful UI
- language toggle behavior
- upload interaction
- Vercel AI SDK `useChat`

Every Client Component must include:

```ts
"use client";
```

Do not mark a component as client-side unless it actually needs client-side behavior.

---

## Naming Conventions

Use TypeScript naming consistently.

### Components

Use PascalCase:

```ts
SimulationChat
FeedbackCard
MenuUploadForm
FastSearchInput
```

### Functions

Use camelCase:

```ts
getMenuItemsByRestaurantId
createPracticeAttempt
validateChatInput
buildSimulationPrompt
```

### Types and Interfaces

Use PascalCase:

```ts
MenuItem
PracticeAttempt
SimulationFeedback
UserRole
```

### Files

Use one of these patterns consistently:

```text
PascalCase.tsx
camelCase.ts
kebab-case folder names
```

Examples:

```text
SimulationChat.tsx
feedback.ts
semantic-search/
```

### Constants

Use UPPER_SNAKE_CASE:

```ts
MAX_CHAT_INPUT_LENGTH
MAX_SEARCH_INPUT_LENGTH
MENU_CACHE_TTL_HOURS
```

---

## TypeScript Rules

Use TypeScript strictly.

Do not use `any` unless there is no reasonable alternative.

Prefer:

```ts
unknown
```

over:

```ts
any
```

All API request bodies must have typed validation before use.

All AI outputs must be parsed and validated before being displayed or stored.

Do not trust model output as valid data.

---

## Canonical Endpoints

Use these canonical endpoints:

| Purpose | Endpoint |
|---|---|
| Simulation feedback | `POST /api/chat` |
| Manager menu upload/parsing | `POST /api/menu` |
| Semantic fast search | `POST /api/search` |

Do not create `POST /api/upload` unless the project SPEC is explicitly updated to replace `POST /api/menu`.

If the codebase already contains both `/api/menu` and `/api/upload`, stop and ask which endpoint should be canonical.

---

## User Roles

The system has two user roles:

```ts
type UserRole = "waiter" | "manager";
```

Waiters may:

- access `/practice`
- run simulation sessions
- use fast search
- receive feedback
- complete learning paths

Managers may:

- access the manager dashboard
- upload menus
- trigger menu parsing
- manage restaurant menu knowledge

Waiters must not access manager-only upload actions.

Unauthorized manager endpoint access must return:

```text
403 Forbidden
```

---

## Authentication Rules

Use Supabase Auth.

Authentication tokens must be stored in HttpOnly secure cookies.

Every protected server route must verify the session server-side.

If the auth token is invalid or expired, return HTTP `401` with this body:

```json
{
  "error": "Session expired. Please log in again."
}
```

Never send these to the LLM:

- JWT token
- user email
- user name
- personal identifiers
- raw session object

System logs must redact JWT tokens.

---

## Restaurant Scope Rule

Every menu, search, simulation, and practice query must be scoped to the current restaurant.

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

If `restaurant_id` is missing, do not continue silently.

Stop the operation and return a controlled error.

---

## Database Model Rules

Use Supabase PostgreSQL as the source of truth.

The minimum expected tables are:

```text
profiles
restaurants
restaurant_members
menu_items
practice_attempts
```

Recommended minimum shape:

```ts
type MenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  ingredients: string[];
  allergens: string[];
  dietary_tags: string[];
  price: number | null;
  embedding_text: string;
  created_at: string;
  updated_at: string;
};
```

```ts
type PracticeAttempt = {
  id: string;
  user_id: string;
  restaurant_id: string;
  menu_item_id: string | null;
  factual_score: number;
  tone_score: number;
  feedback_text: string;
  user_message: string;
  locale: "he" | "en";
  created_at: string;
};
```

If `menu_item_id` cannot be determined confidently, store `null`.

Never invent a menu item match.

---

## Row-Level Security Rules

Use Supabase Row-Level Security where relevant.

Users must access only records belonging to restaurants they are associated with.

Managers may modify menu data only for their restaurant.

Waiters may read menu data only for their restaurant.

Waiters may create practice attempts only for themselves.

Do not rely only on frontend hiding for authorization.

---

## AI Usage Rules

The AI is used for:

- waiter simulation roleplay
- factual and tone feedback
- multimodal menu parsing
- culinary recommendation logic
- semantic search support

The AI must not be treated as the source of truth for menu facts.

Menu data in the database is the factual ground truth.

For simulation feedback:

- evaluate against restaurant-scoped menu data
- return factual accuracy feedback
- return hospitality tone feedback
- do not invent ingredients, allergens, or dish details
- be especially strict with allergens

For menu parsing:

- parse dishes, ingredients, allergens, dietary tags, and descriptions
- return structured JSON
- validate before inserting into the database
- do not insert malformed model output

---

## Prompt Construction Rules

Prompts must be built in `/lib/ai/prompts.ts` or a clearly named file under `/lib/ai`.

Prompts must include only the minimum necessary context.

Do not include:

- user emails
- user full names
- JWT tokens
- unrelated restaurant data
- menus from another restaurant
- private system logs

Prompts must be language-aware.

If the selected locale is Hebrew, feedback text should be Hebrew.

If the selected locale is English, feedback text should be English.

JSON keys must remain in English.

---

## Feedback JSON Rules

Simulation feedback must validate against this structure:

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

- `factual_score` must be between 0 and 100
- `tone_score` must be between 0 and 100
- `feedback_text` must be a non-empty string
- `referenced_menu_item_ids` must refer only to real menu items from the current restaurant
- malformed JSON must not be shown to the user
- malformed JSON must not be inserted into the database

---

## Chat and Simulation Rules

Use Vercel AI SDK `useChat` for chat state unless the existing implementation already has an equivalent pattern.

While the user is in a simulation session:

- retain previous messages in the conversation history
- send relevant recent history to the LLM
- avoid sending unnecessary old messages
- prefer the last 10 to 16 messages when possible
- keep simulation feedback tied to the selected restaurant menu

When a waiter submits a response:

1. append the message to the chat UI
2. validate input
3. retrieve relevant menu context
4. call the LLM
5. validate feedback JSON
6. show feedback
7. store a practice attempt

---

## Menu Upload Rules

Managers can upload menu files.

Allowed file types:

```text
PDF
JPG
JPEG
PNG
```

Maximum upload size:

```text
5MB
```

When upload begins, show:

```text
Parsing menu...
```

The AI must extract at least:

- dish names
- descriptions
- ingredients
- allergens
- dietary tags when inferable
- embedding text for search

If parsing fails, show this exact message:

```text
Failed to read menu. Please ensure the file is a clear PDF or JPG.
```

After successful upload:

- insert or update `menu_items`
- generate embeddings
- invalidate menu cache immediately
- do not require managers to manually build courses

---

## Semantic Search Rules

Fast Search allows waiters to ask natural-language questions during service.

Search input maximum length:

```text
200 characters
```

Semantic search must:

- use pgvector through Supabase
- search only within the current restaurant
- return the top 3 most relevant results
- use the latest menu data
- respond in the selected locale when user-facing text is generated

Target performance:

```text
Semantic Search < 500ms P95
```

Do not use Algolia or Elasticsearch.

---

## Short Learning Path Rules

The Short Learning Path must generate a 5-question quiz based on the 5 least-practiced menu items for that user.

Do not generate random questions when practice history exists.

Use `practice_attempts` to identify least-practiced items.

If there is not enough practice history, use this fallback:

1. never-practiced items first
2. then least-practiced items
3. then menu items with low factual scores

The learning path should reinforce performance, not just recall.

---

## Language and Localization Rules

Supported locales:

```ts
type Locale = "he" | "en";
```

The language toggle must:

- switch UI text within 100ms
- avoid full page reload
- update the locale context
- affect the next AI request
- not promise to change an already-running AI response mid-stream

Use one localization system consistently.

Preferred:

```text
next-intl
```

If the project already uses `i18next`, continue with `i18next`.

Do not mix `next-intl` and `i18next` in the same project unless explicitly required.

---

## UI and UX Rules

The product is mobile-first.

Design for waiters using the system quickly before or during shifts.

UI must be:

- clean
- fast
- readable on mobile
- low-friction
- suitable for quick practice
- suitable for real-time search during service

Use TailwindCSS.

Do not introduce custom UI frameworks.

Support:

- standard Light mode
- standard Dark mode
- Hebrew
- English

Do not implement custom themes per restaurant.

---

## Accessibility Rules

Interactive elements must have clear labels.

Inputs must have visible focus states.

Buttons must show disabled and loading states.

Do not rely only on color to communicate status.

Error messages must be readable and close to the relevant action.

---

## Input Validation Rules

Validate inputs on both client and server.

Limits:

```text
Chat input: 500 characters
Search input: 200 characters
Upload size: 5MB
```

Rules:

- empty chat input must not submit
- whitespace-only chat input must not submit
- duplicate rapid sends must be blocked
- invalid uploads must fail before AI parsing
- database writes must never use unvalidated payloads

Use parameterized Supabase queries.

Never build SQL strings directly from user input.

---

## Security Rules

Security is not optional.

Required:

- Supabase Auth
- HttpOnly secure cookies
- role-based authorization
- restaurant-scoped data access
- no PII in LLM prompts
- JWT redaction in logs
- server-side validation
- parameterized Supabase queries

If HTML rendering is used, sanitize with DOMPurify.

Prefer plain text rendering for AI feedback.

---

## Performance Rules

Target performance:

```text
AI chat response: < 2500ms P95
Semantic search: < 500ms P95
UI interactions: < 100ms
Upload size limit: 5MB
Lighthouse mobile score: > 90
```

Caching:

- menu metadata may be cached for 24 hours
- embeddings may be cached for 24 hours
- cache must be invalidated immediately after manager uploads a new menu
- AI chat responses must not be cached

Avoid unnecessary client-side bundle growth.

Do not load large libraries into client components unless required.

---

## Error Handling Rules

Use controlled user-facing errors.

Required exact messages:

### Empty Menu

```text
Your manager hasn't uploaded a menu yet.
```

### LLM Timeout

```text
The customer is thinking... please try again
```

### Failed Menu Parse

```text
Failed to read menu. Please ensure the file is a clear PDF or JPG.
```

### Expired Session

```json
{
  "error": "Session expired. Please log in again."
}
```

Do not expose raw stack traces to users.

Do not display raw model failures directly.

---

## Timeout and Concurrency Rules

If an LLM request exceeds 5000ms:

- abort the request
- show the timeout message
- retain the user's input
- do not store a practice attempt
- do not clear conversation state

If the user rapidly clicks Send:

- debounce the Send button for 1000ms
- disable Send while a request is pending
- prevent duplicate practice attempts

Do not rely only on client-side debounce for protection.

---

## Testing Rules

Every important flow should have either a manual test checklist or an automated test.

Minimum scenarios:

1. authenticated waiter completes a simulation turn
2. unauthenticated user navigating to `/practice` is redirected to `/login`
3. manager uploads a valid PDF menu
4. waiter sees the empty-menu message when no menu exists
5. semantic search returns relevant menu results
6. language toggle updates UI without full reload
7. LLM timeout preserves the user's input
8. waiter cannot access manager upload endpoint

---

## Definition of Done

A feature is done only when:

- it matches the SPEC
- it follows this rules file
- it uses the approved stack
- it modifies only allowed folders
- it validates input
- it handles authentication and authorization
- it respects restaurant scope
- it handles relevant edge cases
- it does not expose PII to the LLM
- it has clear loading and error states
- it passes the relevant acceptance scenario

---

## Git and AI Agent Rules

Because this is an AI-assisted development project, treat Git commits or pushes as human approval checkpoints.

Before major changes:

- inspect the relevant files
- explain the intended change
- keep the scope narrow
- avoid unrelated refactors

After major changes:

- summarize what changed
- list files changed
- identify any risks
- suggest the next validation step

Do not make broad architectural changes silently.

Do not rewrite working code unless there is a clear reason.

---

## Stop Conditions

Stop and ask for clarification if:

1. the task requires modifying forbidden folders
2. there is no reliable `restaurant_id`
3. endpoint naming conflicts between `/api/menu` and `/api/upload`
4. the existing localization system is unclear
5. the database schema does not support required restaurant scoping
6. the user asks for POS integration
7. the user asks for voice-to-text or text-to-voice
8. the user asks for custom UI themes per restaurant
9. AI output is required to be both strict JSON and raw token streaming without a validation layer
10. the implementation would expose PII or JWT data to the LLM
