# Specification: MenuMentor Core Simulation & Learning Platform

## Context
- **Feature name:** MenuMentor Core Simulation & Learning Platform
- **Business goal:** Reduce waiter onboarding time and real-time service errors by replacing static menu reading with interactive AI roleplay and semantic search.
- **Target users:** Waiters (practice & search) and Managers (upload menus).
- **Existing stack:** `Next.js` (App Router), `Vercel AI SDK` (LLM state management), `Supabase` (PostgreSQL DB + Auth), `TailwindCSS` (UI).
- **Files/folders allowed to touch:** `/app`, `/components`, `/lib`, `/types`, `/supabase`
- **Files/folders NOT to touch:** `/.github`, `/.husky`, `/public/assets`

## Requirements (EARS format)
- WHEN the user clicks the "Language Toggle" button THE SYSTEM SHALL switch all UI text and AI prompt instructions between `he` and `en` within 100ms.
- WHEN a Manager uploads a PDF or Image menu THE SYSTEM SHALL extract dishes, ingredients, and allergens into a structured JSON format and store it in the database.
- WHILE the user is in a "Simulation Session" THE SYSTEM SHALL retain previous messages in the conversation history array sent to the LLM.
- WHEN the user submits a simulation response THE SYSTEM SHALL return feedback evaluating both factual menu accuracy and hospitality tone.
- WHEN the user navigates to the Dashboard THE SYSTEM SHALL display three learning areas: "הכרת המנות" (Menu Knowledge), "משחק זיכרון וזיהוי" (Memory Game), and "תרגול מול לקוח" (Customer Simulation).
- WHEN the Manager triggers question generation THE SYSTEM SHALL deterministically generate, validate, and save practice questions to a question bank.
- WHEN the user plays the "Memory Game" THE SYSTEM SHALL retrieve up to 10 approved questions from the pre-generated question bank, shuffle them locally, and provide immediate feedback without tracking user scores.
- IF the AI fails to parse the uploaded PDF menu THE SYSTEM SHALL display the error message: "Failed to read menu. Please ensure the file is a clear PDF or JPG."

## Out of Scope
- Point of Sale (POS) integration.
- Custom UI themes per restaurant (only standard Light/Dark mode + HE/EN).
- Voice-to-text or Text-to-voice.
- Employee scheduling or payroll features.
- Semantic similarity search, Fast Search, and pgvector (moved to Future).
- User authentication, saving scores, learning history, or least-practiced item tracking (not in MVP).

## Acceptance Criteria (GWT format)
- **Scenario: Successful Simulation Turn**
  - GIVEN a user is in an active simulation session
  - WHEN the user types "The burger contains gluten in the bun" and clicks "Send"
  - THEN the system appends the message to the chat UI
  - AND the LLM responds within 2000ms with a JSON object containing `factual_score`, `tone_score`, and `feedback_text`.
- **Scenario: Manager Uploads Menu**
  - GIVEN a user with the `manager` role is on the Dashboard
  - WHEN they upload a 2MB PDF file
  - THEN a toast with text "Parsing menu..." appears
  - AND the system creates vector embeddings for the extracted text.
- **Scenario: Unauthorized Access**
  - GIVEN an unauthenticated user
  - WHEN they navigate directly to `/practice`
  - THEN the system redirects to `/login`
  - AND clears any local storage session data.

## Security
- **Authentication:** Supabase Auth (JWT). Tokens stored in `HttpOnly` secure cookies.
- **Authorization:** Two roles: `waiter` and `manager`. Managers can `POST /api/menu`. Waiters get `403 Forbidden` for that endpoint.
- **Input validation:** Search input maximum 200 characters. Chat input maximum 500 characters. Sanitized using `DOMPurify` on the client and parameterized queries on the server.
- **Sensitive data:** LLM prompts must NOT contain PII (user emails, names). System logs must redact the JWT token.
- **Failure mode:** Invalid auth token returns HTTP `401 Unauthorized` with body `{"error": "Session expired. Please log in again."}`.

## Performance
- **Latency target:** AI Chat response < 2500ms (P95). UI interactions (language toggle, tab switch) < 100ms.
- **Maximum payload size:** PDF/Image upload limited to 5MB.
- **Caching policy:** Menu metadata heavily cached (TTL 24 hours). Invalidate cache immediately WHEN Manager uploads a new menu. AI Chat responses must NOT be cached.

## Edge Cases
- **Empty Menu DB** → IF a waiter starts a simulation but no menu exists, SYSTEM SHALL display "Your manager hasn't uploaded a menu yet." and disable the chat input.
- **LLM Timeout (>5000ms)** → SYSTEM SHALL abort the request, display "The customer is thinking... please try again", and retain the user's input in the text field.
- **Concurrent DB Writes** → IF user rapidly clicks "Send" multiple times, SYSTEM SHALL debounce the button for 1000ms after the first click.

## Technical Decisions
| Decision | Chosen | Rejected | Reason |
| :--- | :--- | :--- | :--- |
| **AI Memory** | Vercel AI SDK `useChat` | Custom state array | Handles streaming and statefulness out-of-the-box perfectly for chat UIs. |
| **Menu Parsing** | Multimodal LLM Vision API | OCR libraries (Tesseract) | LLMs provide superior semantic structuring (separating ingredients from descriptions) from raw images. |
| **Upselling Logic** | Prompt Engineering | Hardcoded rules | Required to be "culinary based" (pairings), which is fluid and better handled by LLM reasoning than strict DB tables. |

## Question Bank & Menu Versioning
- **Restaurant Menu Versioning:**
  - The `restaurants` table includes a `menu_version` field (`integer`, default `1`).
  - On any menu update or save, `menu_version` is incremented by 1.
  - Practice questions in the question bank are stored with a `generated_from_menu_version` reference.
  - Waiters only receive `approved` questions matching the current `menu_version` of the restaurant.
  - Older questions are retained in the database for historical/documentation purposes but are not displayed in the game.
  - Refreshing questions creates new `pending` questions for the updated `menu_version`.

- **Memory Game Option Logic:**
  - Multiple-choice questions require 4 options: 1 correct dish/option + 3 valid distractors.
  - Distractors must come from the same category.
  - If a category contains only 3 dishes, the question will present 3 options.
  - If a category contains 2 dishes, the question will present 2 options.
  - If a category has less than 2 dishes (insufficient data), the question is skipped.
  - No artificial dishes shall be created or added to force a 4-option count.

## Open Questions
- **[MINOR] Image Storage:** Do we need to retain the original PDF/Image file in an S3 bucket after the AI extracts the text, or can we discard it to save storage? *(Defaulting to discard after successful extraction).*

## Definition of Done
- [ ] `POST /api/chat` returns 200 with streaming text response matching the feedback JSON schema.
- [ ] `POST /api/upload` successfully parses a test PDF and inserts rows into the `menu_items` table.
- [ ] Language toggle clicks mutate the `next-intl` or `i18next` locale context and re-render the DOM without full page reload.
- [ ] Lighthouse performance score > 90 on mobile.