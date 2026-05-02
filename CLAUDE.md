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
  [`.agents/skills/component-library-rules/SKILL.md`](.agents/skills/component-library-rules/SKILL.md),
  with deeper reference docs under
  [`references/`](.agents/skills/component-library-rules/references)
  and a historical record of the migration in
  [`history.md`](.agents/skills/component-library-rules/references/history.md).
  The skill is auto-loaded by the harness; read it through anyway.
- Layer order is sacred: `ui/` (shadcn primitives, do not edit) →
  `typography/` (Text, Heading, Label, TextLink) → `base/` (wrappers)
  → `layout/` (page shells) → `composed/` (domain surfaces) →
  `features/` (app features with provider + callbacks + strings +
  slots).
- The library is **framework-agnostic everywhere**. No
  `@inertiajs/*`, `next/*`, `react-router*`, `@tanstack/react-router`,
  `@tanstack/react-query`, or `vite-bundled-i18n/*` imports anywhere
  in `src/components/**`. There is no `adapters/$framework/` folder —
  the consumer wires routing/data/i18n at the call site via
  `onSubmit`, `onSelect`, `fetcher`, `strings`, etc.
- The local `.claude/` directory (settings, worktrees, scheduled
  tasks) is gitignored. The mandatory skill is symlinked from
  `.claude/skills/component-library-rules` into
  `.agents/skills/component-library-rules` for local convenience —
  the symlink itself is not tracked, only the canonical content
  under `.agents/`.

When in doubt, open AGENTS.md and the rules skill, then re-read the
five-question visual-evaluation pass (rule 16) before declaring any
visual change done.
