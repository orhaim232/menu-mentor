---
name: semantic-menu-searcher
description: Focuses on how to build and reason about semantic menu search using embeddings and Supabase pgvector. Use this skill for implementing real-time menu queries.
---

# Semantic Menu Searcher Skill

## Purpose
This skill assists in building rapid search functionality allowing waiters to ask natural language questions (e.g., "vegan options without nuts") and get immediate accurate menu results using vector similarity.

## When to Use This Skill
Use this skill when implementing:
- `POST /api/search`
- The fast search input UI component
- Supabase `pgvector` queries and embedding logic

## What the AI Should Do
- Convert the user's natural language search query into an embedding vector using the chosen AI model.
- Construct queries comparing the query embedding to the database `embedding` column using cosine similarity.
- Ensure queries ALWAYS filter by `restaurant_id` first before evaluating similarity, to maintain data isolation.

## What the AI Must Avoid
- Do NOT rely entirely on exact keyword matching (LIKE/ILIKE); use the embeddings.
- Do NOT return all menu items; enforce a strict limit on results (e.g., top 3 to 5).

## Decision Rule
When asked for a recommendation directly in a fast search context, perform an embedding search rather than initiating a conversational chat session.
