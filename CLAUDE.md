# CLAUDE.md

This file is intentionally a thin pointer.

The canonical instructions for AI agents working in this repo live in
**[AGENTS.md](AGENTS.md)** at the project root. Read it through before
touching any code.

Key things to know up front:

- **`admin-ui-starter-kit` is a publishable component library**, not a
  one-off app. Every change propagates to every consumer. Be careful
  with leverage.
- The mandatory rules skill is
  [`.claude/skills/component-library-rules/SKILL.md`](.claude/skills/component-library-rules/SKILL.md)
  with its companion [PLAN.md](.claude/skills/component-library-rules/PLAN.md).
  Both are auto-loaded by the harness; read them.
- Layer order is sacred: `ui/` (shadcn primitives, do not edit) →
  `base/` (wrappers) → `composed/` (domain surfaces) → `features/`
  (app features with provider + callbacks + strings + slots).
- Features must be **framework-agnostic** in default export paths.
  Framework-specific wiring lives only in
  `features/$feature/adapters/$framework/`.
- Other useful design / UI skills the harness may surface:
  `frontend-design`, `shadcn`, `shadcn-ui`, `tailwind-v4-shadcn`,
  `ui-components`. Use them when the work matches.

When in doubt, open AGENTS.md and the rules skill, then re-read the
five-question visual-evaluation pass (rule 16) before declaring any
visual change done.
