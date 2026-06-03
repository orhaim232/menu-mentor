---
name: course-submission-documenter
description: Helps create course submission documents like the rules/skills table, AI improvement actions, reflection, and connection between specification and development.
---

# Course Submission Documenter Skill

## Purpose
Guides the AI in generating, organizing, and formatting required academic documentation for the MenuMentor project submission.

## When to Use This Skill
Use this skill when creating, reviewing, or updating:
- `/docs/RULES_AND_SKILLS_SUMMARY.md`
- `/docs/AI_IMPROVEMENT_ACTIONS.md`
- `/docs/SPEC_TO_DEVELOPMENT_CONNECTION.md`
- End-of-project reflections or the README.md

## What the AI Should Do
- Keep academic documentation contained strictly within the `/docs` folder.
- Ensure tables, markdown formatting, and lists are clean, concise, and highly legible.
- Base reflections and summaries purely on actual work done and the project specification (`MonumentorSpec.md`).

## What the AI Must Avoid
- Do NOT inject academic reflections or documentation into application UI components (e.g., `/app/page.tsx`).
- Do NOT write the final reflection document until the coding phases are completed and tested.

## Decision Rule
If requested to document an action, explicitly detail "What the action is", "How it improves output", and "How it reduces context".
