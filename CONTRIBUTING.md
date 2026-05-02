# Contributing to Admin UI Starter Kit

Thanks for the interest. A few things to know before opening an issue or PR.

## What this project is

An opinionated React component kit on top of [shadcn/ui](https://ui.shadcn.com)
and [Tailwind CSS v4](https://tailwindcss.com), targeting **admin panels and
SaaS dashboards**. Not a marketing-site UI kit, not a general-purpose CSS
framework.

The architectural and stylistic rules are non-negotiable and live in
[`.claude/skills/component-library-rules/SKILL.md`](.claude/skills/component-library-rules/SKILL.md).
Read it before opening a PR.

## Reporting a bug

Open an issue with:
- A minimal reproduction (CodeSandbox / Stackblitz / git repo).
- The version of `admin-ui-starter-kit`, React, Tailwind, and any optional peers
  you have installed.
- Expected vs actual behaviour.

If the bug is in a specific component, mention which entrypoint
(`base/item`, `composed/admin`, `features/comments`, etc.).

## Suggesting a feature

Open an issue first. New components must fit the layered architecture
(rule 2 in the SKILL) and the canonical primitives (`Item`, `FormField`,
`SmartCard`, `UIProvider`, `useStrings`). If your idea forces a layering
exception, expect pushback.

## Sending a PR

```bash
git clone git@github.com:<your-fork>/admin-ui-starter-kit.git
cd admin-ui-starter-kit
npm install
npm run dev          # boots the preview app
```

Before opening the PR run:

```bash
npm run verify       # lint:architecture + test:exports + typecheck + lint + tests
npm run build:lib    # confirm the publishable artifact still builds
```

Both must be green before you push.

## What gets merged

PRs that land easily:
- Bug fixes with a regression test.
- New `composed/` or `features/` components that follow the existing
  folder shape, strings pattern, and layering rules.
- Documentation improvements.
- Tightening existing types without changing runtime behaviour.

PRs that need discussion first (open an issue):
- New `base/` wrappers or `ui/` primitives.
- New `<UIProvider>` slices.
- Anything that changes the `exports` map.
- Anything that adds a new dependency.
- Anything that breaks the framework-agnostic guarantee (no
  `@inertiajs/*`, `next/*`, `react-router*` imports).

## Coding standards

- Tabs, 4-wide. See `.editorconfig`.
- TypeScript strict mode. No `any` unless the boundary genuinely requires it.
- Every interactive component uses `forwardRef` + `displayName`.
- Every user-facing string flows through `useStrings()` — no hardcoded
  English in JSX.
- Every component-level prop default that has a sensible library-wide
  alternative resolves through `<UIProvider>`:
  `props.X ?? useFooConfig().X ?? hardcodedFallback`.
- Run `npm run lint:architecture` — it enforces the layer order.

## Code of conduct

Be kind. Disagree on the merits, not the person. The maintainer reserves
the right to close issues or PRs that don't follow this.

## License

By contributing, you agree your contributions will be licensed under the
project's [MIT license](LICENSE).
