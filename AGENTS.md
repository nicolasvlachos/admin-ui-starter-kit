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

A historical record of how the library reached publish-ready state
lives in
[`.agents/skills/component-library-rules/references/history.md`](.agents/skills/component-library-rules/references/history.md).
Read it once for context; it is not a live roadmap.

## Mandatory reading before any code change

The **only** mandatory skill in this repo is
[`component-library-rules`](.agents/skills/component-library-rules/SKILL.md).
It encodes 23 rules covering layer order, typography, density, tokens,
strings/i18n, framework-agnostic contracts, slot/render-prop
composability, locale-agnosticism, console hygiene, and the visual
evaluation pass. Read it before touching any component in
`src/components/**`. The Claude harness auto-loads it; you must read it
through and follow it.

Deeper how-to guides live alongside the skill under
[`.agents/skills/component-library-rules/references/`](.agents/skills/component-library-rules/references):
strings pattern, base wrapper, item / form-field patterns, preview
pages, ui-provider, consumer wiring, import paths, visual evaluation,
testing, layout, composed-domains. Pull the matching one when the work
fits; don't read all of them.

This skill is **self-sufficient by design** — there are no other skills
shipped with this repo. If a topic isn't covered, ask before inventing
a pattern.

## The architectural layers

```
src/components/
├── ui/         ← shadcn primitives — DO NOT EDIT
├── typography/ ← Text, Heading, Label, TextLink (peer to ui/, no upstream deps)
├── base/       ← thin wrappers / compositions of UI primitives
│                 (Button, Card, Input, Badge, Popover, Command,
│                  PopoverMenu, Tabs, Combobox, Item, FormField, …)
├── layout/     ← page shells (header, sidebar, page) — built on
│                 base + typography + ui, never imports composed/features
├── composed/   ← domain-level cards & widgets built from base
│                 (admin, ai, analytics, cards, commerce, dark-surfaces,
│                  data-display, navigation, timelines, …)
└── features/   ← app-level features (filters, comments, overlays,
                   global-search, mentions, rich-text-editor, sync,
                   activities, ai-chat, event-log, suggestions, card)
                   — provider/callback driven, with strings + slots.
```

Hard rules (full detail in the skill):
- `typography/` depends only on `@/lib/ui-provider`, `@/lib/utils`,
  `@/lib/sanitize-html`. Never imports from `base/`/`composed/`/
  `features/`/`layout/`.
- A `base` wrapper imports from `ui/` and `typography/` (and other
  `base`). Never `composed`/`features`/`layout`.
- A `layout` shell imports from `base`, `typography`, `ui`. Never
  `composed`/`features`.
- A `composed` component imports from `base`, `typography`, `ui`. Never
  `features` or `layout`.
- A `features` component imports from `base`, `typography`, `composed`,
  `ui` — and its **default behaviour is callback-driven**, never
  hardcoded routing/i18n/data fetching.
- **No framework integration imports anywhere in the library** — no
  `@inertiajs/*`, no `@tanstack/react-query`, no
  `@tanstack/react-router`, no `react-router*`, no `next/*`, no
  `vite-bundled-i18n/*`, no `ziggy-js`. There is **no**
  `adapters/$framework/` folder anymore. The consumer wires routing /
  data / i18n at the call site via direct props
  (`onSubmit`, `onSelect`, `fetcher`, `strings`, …).
- Direct imports from `@/components/ui/*` are allowed **only** inside
  the matching `base/` wrapper. Anywhere else, use the wrapper.

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
  on the actual component — never put them in the store. Canonical
  slice list: see the union types in `src/lib/ui-provider/types.ts`.
- **Tokens**: `src/App.css` — typography, density, semantic colours,
  shadcn token composition. Read the comment blocks before editing.
- **Strings pattern**: every component with user-facing text exports a
  `*Strings` interface + `default*Strings` defaults; the prop is
  deep-merged via `useStrings(defaults, override)`. See
  `features/global-search/global-search.strings.ts`,
  `features/comments/comments.strings.ts`, or
  `composed/analytics/analytics.strings.ts` for canonical examples.
- **Slots / hooks**: see `features/global-search/` (slots, render-prop,
  `useGlobalSearch`) and `features/filters/` (provider + exported
  partials + `useAsyncOptions`) for canonical composability patterns.

## Workflow

1. Read `component-library-rules/SKILL.md` if you haven't this session.
2. Identify which layer owns the change (`ui` → primitive, `base` →
   wrapper, `composed` → surface, `features` → app feature, `layout`
   → page shell).
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
# or: npm run typecheck

# Architecture check (forbidden imports between layers, alias drift).
npm run lint:architecture

# Public exports surface check.
npm run test:exports

# All of the above + lint + tests.
npm run verify

# Dev / preview server. Already auto-managed by the Claude harness via
# preview_start; for terminal use:
npm run dev

# Lint
npm run lint

# Library build (verifying publish-readiness).
npm run build:lib
```

When asserting "no new tsc errors", filter the output to the files you
actually touched — there are pre-existing errors flagged in `verify`.
Don't claim success against the unfiltered exit code.

For the visual pass:
1. Use `preview_start` / `preview_eval` / `preview_screenshot` from
   the harness, not Bash. The repo's preview server is already wired
   into `.claude/launch.json` (the local-only Claude config).
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
│   ├── typography/               — Text, Heading, Label, TextLink
│   ├── base/
│   │   ├── buttons/              — Button (variant + buttonStyle)
│   │   ├── badge/                — Badge (size: xs/sm/md, variant)
│   │   ├── cards/                — SmartCard with PADDING preset
│   │   ├── popover/              — wrapper around ui/popover
│   │   ├── command/              — wrapper around ui/command (cmdk)
│   │   ├── popover-menu/         — popover + command + slots
│   │   ├── navigation/            — tabs, breadcrumbs, dropdown menus
│   │   ├── forms/                — FormField, ControlledFormField,
│   │   │                            fields/ (Input, Select, Money…)
│   │   ├── combobox/             — searchable combobox + hooks/
│   │   ├── currency/             — useCurrency lives in hooks/
│   │   ├── date-pickers/         — DatePicker, DateRangePicker, …
│   │   ├── display/              — Avatar, Tooltip, Separator,
│   │   │                            IconBadge, InlineStat, Metadata
│   │   ├── item/                 — canonical row primitive
│   │   │                            (icon + title-stack + actions)
│   │   ├── event-calendar/, map/, table/, toaster/, spinner/
│   │   ├── copyable/             — copy-to-clipboard wrapper
│   │   └── …
│   ├── layout/
│   │   ├── header/, sidebar/, page/, containers/
│   │   ├── hooks/                — layout-only hooks
│   │   └── README.md             — layout-layer conventions
│   ├── composed/
│   │   ├── admin/                — team-member, settings rows, …
│   │   ├── ai/                   — citation, suggestion cards
│   │   ├── analytics/            — Metric, MetricBar, MetricGrid,
│   │   │                           ActivityHeatmap, MetricComparison.
│   │   │                           Strings: analytics.strings.ts.
│   │   ├── cards/                — domain-specific card layouts
│   │   ├── commerce/             — order, shipment, product surfaces
│   │   ├── dark-surfaces/        — dense dark-themed dashboards
│   │   ├── data-display/         — KV pairs, definition lists, …
│   │   ├── navigation/           — category-nav, breadcrumb-progress
│   │   └── timelines/            — marker-rail timeline
│   └── features/
│       ├── activities/           — activity feed
│       ├── ai-chat/              — chat shell
│       ├── card/                 — card-builder feature
│       ├── comments/             — composer + thread (canonical)
│       ├── event-log/            — audit log feature
│       ├── filters/              — provider + facets + partials
│       │   ├── facets/           — Search/Select/Async/Date/…/Tags
│       │   ├── partials/         — exported as composition seams
│       │   └── hooks/            — useAsyncOptions
│       ├── global-search/        — canonical example shape
│       │   ├── partials/         — input, tabs, result-row, …
│       │   ├── hooks/            — useGlobalSearch (headless)
│       │   ├── *.types.ts
│       │   └── *.strings.ts
│       ├── mentions/             — @-mention picker + suggestions
│       ├── overlays/             — Dialog, Drawer, AlertDialog
│       ├── rich-text-editor/     — TipTap-backed
│       ├── suggestions/          — typeahead suggestions
│       └── sync/                 — sync indicators / conflict UI
├── hooks/                        — only cross-cutting hooks
│                                   (use-debounce, use-mobile,
│                                   use-event-listener, …).
│                                   Feature-specific hooks live with
│                                   their feature.
├── lib/
│   ├── strings.ts                — useStrings deep-merge helper
│   ├── utils.ts                  — cn (clsx + tailwind-merge)
│   ├── sanitize-html.ts          — used by typography
│   └── ui-provider/              — single zustand provider + slices
├── preview/                      — the showcase app (do not ship)
│   ├── PreviewApp.tsx            — registry-driven nav
│   ├── registry.tsx              — page registration (every page
│   │                                 under pages/ MUST appear here)
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
- **Callback-driven feature** →
  [features/comments/](src/components/features/comments). `onSubmit`,
  `onDelete`, `onAfterMutate`, `onError` flow as direct props;
  `composerSlot` is a slot for BYO editor when TipTap isn't installed;
  `CommentsAccessors` map domain shapes (media URL/name, status label,
  relative time formatter) without baking them into the library.
- **Base wrapper around a shadcn primitive** →
  [base/popover/popover.tsx](src/components/base/popover/popover.tsx),
  [base/command/command.tsx](src/components/base/command/command.tsx).
  Wrap the root, re-export the parts untouched, document defaults.
- **Composed wrapper across base** →
  [base/popover-menu/popover-menu.tsx](src/components/base/popover-menu/popover-menu.tsx).
  Slots, render-prop, strings — the recurring "trigger → optional
  header → search → list" pattern, captured once.
- **Item row primitive** →
  [base/item/](src/components/base/item) — canonical "icon/avatar/image
  + title/description text-stack + optional actions" row. Any composed
  surface that hand-rolls this shape is a smell; reach for `<Item>`.
- **FormField row primitive** →
  [base/forms/form-field](src/components/base/forms) — canonical
  "label + control + hint/helper/error" row. Pure presentational
  (`<FormField>`) and react-hook-form-bound (`<ControlledFormField>`)
  variants both live there.
- **Token-driven typography & density** → `App.css` `@theme` block.
  Component CSS reads `var(--text-xs)` / `var(--row-py)` etc., never
  hardcoded literals.

## Do NOT touch

- `src/components/ui/**` — shadcn primitives. Wrap or compose; never
  edit. Next shadcn upgrade overwrites your work.
- `src/services/**`, `src/types/**` — domain layer; out of scope for
  component changes.
- `*.test.tsx` / `*.test.ts` — only update if the test asserts a class
  name or behaviour you intentionally changed (e.g. badge size class).
- `package.json` `peerDependencies` — already wired; only touch when
  bumping a peer-dep range.
- The hooks list in `src/hooks/` — only cross-cutting hooks belong
  there. Feature-specific hooks must live in `<feature>/hooks/`.

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
  go through the `strings` prop + `default*Strings` pattern, resolved
  via `useStrings(defaults, override)`.
- **Adding `useQuery` / `router.visit` / `useI18n` / `navigator.language`
  anywhere in the library.** All of these are consumer concerns. The
  feature accepts a callback or a `Locale` prop; the consumer wires
  their framework / i18n / locale at the call site.
- **Pinning a literal `size`/`variant` on an inner base component
  inside a wrapper.** Forward the resolved size so `<UIProvider>`
  defaults can flow through.
- **Editing the Comments preview page or any 300-line "private"
  component inside `preview/pages/**`.** That's a smell — the
  underlying feature is missing a slot or render-prop. Fix the
  feature, not the preview.
- **Unguarded `console.error` / `console.warn`.** Wrap in
  `if (import.meta.env?.DEV) { … }`. Surface real errors via an
  `onError` callback for the consumer.
- **Importing `Modules.Core.*` / `App.*` ambient types.** These are
  consumer-app types; they don't ship in the library. Define a local
  type and parameterize via generics.
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
restraint.
