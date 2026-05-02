# AGENTS.md — instructions for AI coding agents working in this repo

> **Heads up:** `CLAUDE.md` in this directory is a thin pointer that re-uses
> this file. Treat AGENTS.md as the source of truth.

## What this project is

`admin-ui-starter-kit` is a **standalone, publishable React component library**.
It re-exports shadcn primitives at the bottom and layers an opinionated
`base/ → composed/ → features/` design-system stack on top. Code lives in
many downstream apps via this package, so **every change is leverage** —
good or bad. Fixes propagate everywhere; mistakes do too.

The architectural goals — and the reason every rule below exists — are:

1. **Centralized**: shadcn primitives, base wrappers, composed surfaces,
   and feature shells all ship from one place. Consumers upgrade once.
2. **Framework-agnostic**: Inertia, Tanstack Router, RR7, Next.js, plain
   Vite, anywhere. Routing, i18n, and data fetching arrive via callbacks
   and props at each call site. **The library never imports any framework
   integration package** — no `adapters/$framework/` folders, no
   framework-specific code anywhere in `src/components/**`. The consumer
   wires their `<Comments onSubmit={(v) => router.post(…)}>` themselves.
3. **Composable**: every complex feature exposes slots, render-props, and
   headless hooks so consumers can reshape any portion without forking.
4. **Theme-able**: shadcn tokens are the foundation; on top, the library
   exposes typography (`--text-xs`, …), density (`--row-py-*`), and
   component-specific CSS variables in `App.css` so consumers rebrand
   from `:root` without touching JS. App-wide JS-side display defaults
   (default currency, week-start, default badge size, …) live in a
   single zustand store wrapped by `<UIProvider>` (see
   `@/lib/ui-provider`). One provider, no nesting.
5. **Admin-density**: workhorses are `text-sm` and `text-xs`. `text-base`
   is rare. Rows breathe at `py-2` minimum.
6. **Visual-quality first**: every shipped surface is evaluated as a
   designer would — spacing, hierarchy, focus states, voice consistency.

The full migration roadmap to standalone-package readiness lives in
[.claude/skills/component-library-rules/PLAN.md](.claude/skills/component-library-rules/PLAN.md).
The roadmap is complete through Phase 11 — the library is publish-ready.

## Mandatory reading before any code change

### 1. `component-library-rules` skill (non-negotiable)

The skill at
[.claude/skills/component-library-rules/SKILL.md](.claude/skills/component-library-rules/SKILL.md)
encodes 16 rules covering layer order, typography, density, tokens,
strings/i18n, framework-agnostic contracts, slot/render-prop
composability, and the visual-evaluation pass. Read it before touching
any component in `src/components/**`. It is loaded automatically by the
Claude harness, but you must read it through and follow it. Failing to
do so turns into "you keep fucking up things." Don't.

The companion file
[PLAN.md](.claude/skills/component-library-rules/PLAN.md) lists the
phased migration that brought this codebase to standalone-package
state. Re-read it before structural work so you know which patterns are
canonical and which are legacy.

### 2. Other design / UI skills available

These skills are also auto-loaded. Use them when the work matches —
they cover material this repo's own skill deliberately leaves out.

- **`frontend-design`** — for distinctive, production-grade visual
  design. Reach for it whenever building or styling user-facing surfaces
  (pages, dashboards, landing components) and you want to escape generic
  AI aesthetics. Pairs naturally with `component-library-rules`: this
  one chooses *what to build*, ours dictates *how to build it inside the
  library*.
- **`shadcn`** — for adding, searching, fixing, debugging, or composing
  shadcn components. Use it when you need to bring in a new primitive,
  resolve a registry/preset issue, or understand how a shadcn component
  is meant to compose.
- **`shadcn-ui`** — expert guidance on shadcn/ui integration,
  customization, and best practices. Use alongside `shadcn` when the
  question is *how to wire it correctly*, not *which command to run*.
- **`tailwind-v4-shadcn`** — production-tested Tailwind v4 + shadcn
  setup. Reach for it when touching `App.css`, `@theme`, dark mode,
  tokens, or anything CSS-architectural.
- **`ui-components`** — broader UI component-library patterns
  (shadcn/ui + Radix primitives, accessibility, design-system
  foundations). Useful for primitive-level decisions.

If multiple skills apply, follow the priority hierarchy defined in
`component-library-rules`: process skills first, implementation skills
second; library rules override generic guidance when they conflict.

## The architectural layers

```
src/components/
├── ui/        ← shadcn primitives — DO NOT EDIT directly
├── base/      ← thin wrappers / compositions of UI primitives
│               (Button, Text, Heading, Card, Input, Badge, Popover,
│                Command, PopoverMenu, Tabs, Combobox, …)
├── composed/  ← domain-level cards & widgets built from base
│               (analytics, cards, charts, commerce, navigation, …)
└── features/  ← app-level features (filters, comments, overlays,
                 metrics, search) — provider/callback driven, with
                 strings, slots, and `adapters/$framework/` opt-ins.
```

Hard rules:
- A `composed` component imports from `base` and `ui`, never `features`.
- A `feature` imports from `base`, `composed`, `ui`. **No framework
  integration imports anywhere in the library** — no `@inertiajs/*`, no
  `@tanstack/react-query`, no `@tanstack/react-router`, no
  `react-router*`, no `next/*`, no `vite-bundled-i18n/*`, no `ziggy-js`.
  Framework wiring lives in the consumer's app, not here.
- Adapter folders (`features/$feature/adapters/$framework/`) **do not
  exist anymore**. The consumer passes `onSubmit`, `onDelete`,
  `onResultSelect`, `onChange`, `fetcher`, etc. as direct props at the
  call site.

## Quick reference

- **Entry**: `src/preview/PreviewApp.tsx` (showcase) and the public
  `package.json` `exports` map (`./base/*`, `./composed/*`,
  `./features/*`, `./ui-provider`).
- **`<UIProvider>`** (`@/lib/ui-provider`) — the **only** library-level
  provider. Holds opinionated display defaults (`money.defaultCurrency`,
  `dates.weekStartsOn`, `badge.defaultSize`, `card.defaultPadding`, …).
  Components read via slice hooks (`useMoneyConfig()`,
  `useBadgeConfig()`, …). Resolution rule everywhere:
  **`props.X ?? useFooConfig().X ?? hardcoded fallback`**. Per-mount
  callbacks, data, and resource registries are **always** direct props
  on the actual component — never put them in the store.
- **Tokens**: `src/App.css` — typography, density, semantic colours,
  shadcn token composition. Read the comment blocks before editing.
- **Strings pattern**: every component with user-facing text exports a
  `*Strings` interface + `default*Strings` defaults; the prop is
  deep-merged. See `features/global-search/global-search.strings.ts` or
  `features/comments/comments.strings.ts` for canonical examples.
- **Slots / hooks**: see `features/global-search/` (slots, render-prop,
  `useGlobalSearch`) and `features/filters/` (provider + exported
  partials + `useAsyncOptions`) for canonical composability patterns.

## Workflow

1. Read `component-library-rules/SKILL.md` if you haven't this session.
2. Identify which layer owns the change (`ui` → primitive, `base` →
   wrapper, `composed` → surface, `features` → app feature).
3. Read the file and its callers. Don't assume an API.
4. Use `base/` components, not raw HTML. If a primitive is used in 2+
   places without a wrapper, add one in `base/` rather than inlining.
5. Verify with `tsc` + a screenshot pass on the preview server. The
   visual evaluation in rule 16 is non-negotiable before declaring done.

## Commands & verification

```bash
# Type-check the app (the only invocation that works on this repo —
# the deprecation flag is mandatory because `baseUrl` is still used).
npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0

# Dev / preview server. Already auto-managed by the Claude harness via
# preview_start; for terminal use:
npm run dev

# Lint
npm run lint

# Build (only when verifying publish-readiness)
npm run build
```

When asserting "no new tsc errors", filter the output to the files you
actually touched — there are pre-existing errors (peer-dep imports
inside opt-in adapters, `enum` syntax under `erasableSyntaxOnly`, a
`MoneyValueData` mismatch). Don't claim success against the unfiltered
exit code.

For the visual pass:
1. Use `preview_start` / `preview_eval` / `preview_screenshot` from
   the harness, not Bash. The repo's preview server is already wired
   into `.claude/launch.json`.
2. Reload via `window.location.reload()` after edits — Vite HMR is
   reliable except for module-shape changes (renames, new exports).
3. Run rule 16's five-question check before declaring done.

## Codebase map — where to find things

```
src/
├── App.css                       — design tokens (colors, typography
│                                   font-size vars, density tokens,
│                                   per-component knobs). Read the
│                                   comment blocks before editing.
├── components/
│   ├── ui/                       — shadcn primitives. Read-only.
│   ├── base/
│   │   ├── typography/           — Text, Heading, Label, TextLink
│   │   ├── buttons/              — Button (variant + buttonStyle)
│   │   ├── badge/                — Badge (size: xs/sm/md, variant)
│   │   ├── cards/                — SmartCard with PADDING preset
│   │   ├── popover/              — wrapper around ui/popover
│   │   ├── command/              — wrapper around ui/command (cmdk)
│   │   ├── popover-menu/         — popover + command + slots
│   │   ├── navigation/tabs.tsx   — re-export of ui/tabs (segmented)
│   │   ├── forms/fields/         — Input, Select, MoneyInput, etc.
│   │   ├── combobox/             — searchable combobox + hooks/
│   │   ├── currency/             — useCurrency lives in hooks/
│   │   ├── date-pickers/         — DatePicker, DateRangePicker, …
│   │   └── display/              — Avatar, Tooltip, Separator, …
│   ├── composed/
│   │   ├── analytics/            — Metric, MetricBar, MetricGrid,
│   │   │                           ActivityHeatmap, MetricComparison.
│   │   │                           Strings: analytics.strings.ts.
│   │   ├── cards/                — domain-specific card layouts
│   │   ├── commerce/, ai/,       — narrow domain surfaces
│   │   │   admin/, navigation/,
│   │   │   data-display/, …
│   │   └── timelines/, charts/
│   └── features/
│       ├── filters/              — provider + facets + partials
│       │   ├── facets/           — Search/Select/Async/Date/…/Tags
│       │   ├── partials/         — exported as composition seams
│       │   ├── hooks/            — useAsyncOptions
│       │   └── adapters/inertia/ — opt-in: Inertia router wiring
│       ├── global-search/        — canonical example shape
│       │   ├── partials/         — input, tabs, result-row, …
│       │   ├── hooks/            — useGlobalSearch (headless)
│       │   ├── adapters/         — inertia.tsx (opt-in)
│       │   ├── *.types.ts
│       │   └── *.strings.ts
│       ├── comments/             — also canonical
│       ├── overlays/             — Dialog, Drawer, AlertDialog
│       ├── metrics/              — deprecation shim → analytics
│       └── rich-text-editor/     — TipTap-backed (peer dep)
├── hooks/                        — only cross-cutting hooks
│                                   (use-debounce, use-mobile,
│                                   use-event-listener, …).
│                                   Feature-specific hooks live with
│                                   their feature.
├── lib/
│   ├── strings.ts                — useStrings deep-merge helper
│   ├── utils.ts                  — cn (clsx + tailwind-merge)
│   └── external-stubs/           — local fakes for peer deps so the
│                                   showcase builds without them
├── preview/                      — the showcase app (do not ship)
│   ├── PreviewApp.tsx            — registry-driven nav
│   ├── registry.tsx              — page registration
│   └── pages/                    — thin demos of the real components
└── services/, types/             — domain types/services (largely
                                    untouched by component work)
```

## Canonical examples — copy these shapes

When in doubt, model new work on these reference implementations:

- **Strings prop pattern** →
  [features/global-search/global-search.strings.ts](src/components/features/global-search/global-search.strings.ts)
  + the `interpolateString` helper. Same shape used by
  [features/comments/comments.strings.ts](src/components/features/comments/comments.strings.ts)
  and
  [composed/analytics/analytics.strings.ts](src/components/composed/analytics/analytics.strings.ts).
- **Headless hook + slots + render-prop** →
  [features/global-search/](src/components/features/global-search). The
  `GlobalSearch` component composes partials behind named slots
  (`input`, `tabs`, `idle`, `empty`, `loading`, `footer`,
  `renderResult`, `toneBg`, `toneAvatar`); `useGlobalSearch` is the
  headless state machine.
- **Provider + exported partials** →
  [features/filters/](src/components/features/filters). Consumers can
  use `<FilterLayout>` for the default shape OR compose
  `<ActiveFilterItem>`, `<FilterOperatorSelect>`, `<FiltersButton>`
  themselves around `<FilterProvider>`.
- **Opt-in framework adapter** →
  [features/global-search/adapters/inertia.tsx](src/components/features/global-search/adapters/inertia.tsx),
  [features/filters/adapters/inertia/](src/components/features/filters/adapters/inertia),
  [features/comments/adapters/inertia.tsx](src/components/features/comments/adapters/inertia.tsx).
  Adapters are NOT re-exported from the feature's main `index.ts`;
  consumers import explicitly from the adapter path.
- **Base wrapper around a shadcn primitive** →
  [base/popover/popover.tsx](src/components/base/popover/popover.tsx),
  [base/command/command.tsx](src/components/base/command/command.tsx).
  Wrap the root, re-export the parts untouched, document defaults.
- **Composed wrapper across base** →
  [base/popover-menu/popover-menu.tsx](src/components/base/popover-menu/popover-menu.tsx).
  Slots, render-prop, strings — the recurring "trigger → optional
  header → search → list" pattern, captured once.
- **Token-driven typography & density** → `App.css` `@theme` block.
  Component CSS reads `var(--text-xs)` / `var(--row-py)` etc., never
  hardcoded literals.

## Do NOT touch

- `src/components/ui/**` — shadcn primitives. Wrap or compose; never
  edit. Next shadcn upgrade overwrites your work.
- `src/services/**`, `src/types/**` — domain layer; out of scope for
  component changes.
- `src/lib/external-stubs/**` — local fakes for absent peer deps.
  Don't "improve" them; they exist only to keep the showcase building
  without `@inertiajs/*` etc. installed.
- `*.test.tsx` / `*.test.ts` — only update if the test asserts a class
  name or behaviour you intentionally changed (e.g. badge size class).
- `package.json` `peerDependencies` — already wired; only touch when
  bumping a peer-dep range or adding a new opt-in framework.
- The hooks list in `src/hooks/` — only cross-cutting hooks belong
  there. Feature-specific hooks must live in
  `<feature>/hooks/`.

## Common mistakes — don't repeat these

- **`text-[10px]` / `text-[11px]` etc.** Forbidden as semantic sizes.
  10px → `text-xxs`, 11px/13px → `text-xs`, 0.8rem → `text-xs`. The
  exception is density-toggled overrides in tables/calendars where the
  bespoke size is intentional and load-bearing — those are explicitly
  scoped (see the `SKIP` list in any token sweep).
- **`text-orange-600 dark:text-orange-400`** style raw colours. Use
  semantic tokens (`text-warning`, `text-info`, `text-success`,
  `text-destructive`).
- **`bg-primary/70` for backdrops.** That's a brand wash, not a dim.
  Use `bg-foreground/50 backdrop-blur-[1px]` for overlay backdrops.
- **`focus:` outlines on interactive elements.** Use `focus-visible:`
  so mouse clicks don't create a focus ring.
- **Hardcoding strings inside JSX** (`<button>Cancel</button>`). Always
  go through the `strings` prop + `default*Strings` pattern.
- **Adding `useQuery` / `router.visit` / `useI18n` to a default export
  path.** That's a peer-dep — it goes in
  `features/$feature/adapters/$framework/` only.
- **Editing the Comments preview page or any 300-line "private"
  component inside `preview/pages/**`.** That's a smell — the
  underlying feature is missing a slot or render-prop. Fix the
  feature, not the preview.
- **`text-[length:var(--text-xxs)]` is fine** when you need a token
  font-size on a non-`Text` element. Don't refactor those to
  `text-xxs` — they're already aligned with the token system.
- **Edit-tool tab indentation mismatches.** Files in this repo are
  tab-indented. If the Edit tool returns "string not found" on what
  looks like an exact match, the issue is almost always tab vs. space
  vs. tab-count. Fall back to a Bash + `python3` patch in those rare
  cases.
- **Stale Vite errors after a syntax-failed save.** When you see
  "ReferenceError: X is not defined" on a `t=...` URL, those are
  cached error logs from a prior bad save, not the current state.
  Reload and check the rendered DOM, not the log tail.

## Glossary — terms used in this codebase

- **Facet** — a single filter type (search, select, async-select,
  date, range, tags). Lives in `features/filters/facets/`.
- **Operator chip** — the small pill inside an active filter pill
  showing `is` / `equals` / `contains` etc.
- **SmartCard** — `base/cards/smart-card`. Library-default card with
  preset paddings (`sm`/`base`/`lg`), optional title/description.
- **Slot** — named `ReactNode` prop on a complex component
  (`headerSlot`, `footerSlot`, `composerSlot`, `empty`, `loading`).
- **Render-prop** — a function-prop that returns a `ReactNode`,
  giving the consumer per-row / per-item override
  (`renderResult={(item, ctx) => …}`).
- **Headless hook** — a `useFeature*` hook exposing the internal state
  machine (active index, selection, keyboard nav) so consumers can
  drive a fully custom UI against the same logic
  (`useGlobalSearch`, `useFilters`, `useAsyncOptions`).
- **Adapter** — opt-in framework wiring under
  `features/$feature/adapters/$framework/`, NOT re-exported from the
  feature's main `index.ts`.
- **Strings prop** — every user-facing string in a component is
  reachable via `strings={{ … }}`, deep-merged over `default*Strings`.
- **Density token** — `--row-py-tight | --row-py-default |
  --row-py-loose`. Consumed by list rows; consumer can override at
  any wrapping element to densify a single surface.
- **Token-driven typography** — `--text-xxs/xs/sm/base/lg`. Consumer
  can override at `:root` to resize the entire library.

## Commit / PR conventions

- **Don't commit unless the user explicitly asks.** This is a hard
  rule from the harness; respect it.
- When asked to commit: small, focused commits with a clear
  imperative subject line. No co-author lines from automated tools
  unless the user explicitly opts in.
- Don't push without an explicit request.
- Don't create PRs unless asked.

## Tone for visual work

This is an admin / SaaS surface. Voice is **calm, neutral, dense
without being cramped**. No flashy colour washes. Active states
intentional, not accidental. When picking a value, default to
restraint. The `frontend-design` skill is the right reference when you
want to push beyond "boring but correct" without breaking the library
voice.
