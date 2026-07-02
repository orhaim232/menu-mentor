---
name: responsive-learning-ui
description: Guides the creation and refactoring of mobile-first, RTL-responsive educational interfaces that fit on one screen without truncating important text.
---

# Responsive Learning UI Skill

## Purpose
Use this skill when designing, building, or refactoring learning interfaces (quizzes, simulations, practice games) to ensure they are usable on narrow mobile devices, accessible, and follow clear visual hierarchies without sacrificing learning logic.

## Design Rules
1. **Mobile-First & RTL Responsive:** Use Tailwind's `sm:`, `md:` prefixes. Keep RTL (`dir="rtl"`) directionality.
2. **Learning Hierarchy:** Maintain visual flow: Prompt -> Choices -> Feedback -> Next Action.
3. **Compact Single-Viewport Layout:** Fit the main learning loop in one screen. Avoid excessive nesting, huge padding, repeated headings, or decorative clutter.
4. **No Truncation:** Never truncate questions, answers, explanations, or labels (`truncate` is forbidden for learning content). Let long Hebrew text wrap naturally.
5. **Readable Typography & Touch Targets:** Buttons must have adequate padding (e.g., `py-3`, `p-4`) for mobile tapping.
6. **Clear States:** Visually differentiate states (disabled, selected, correct, incorrect, loading, help-used) using distinct background colors, borders, and icons.
7. **Modals on Narrow Screens:** Ensure confirmation modals don't overflow vertically. Buttons should flex/stack properly.
8. **State Preservation:** Changing UI layout must never reset or break learning state.

## Execution Guidelines
- Inspect files first.
- Edit only relevant UI code.
- Report responsive risks.
- Mentally check: narrow phone, standard phone, laptop, long Hebrew text, keyboard/focus.
