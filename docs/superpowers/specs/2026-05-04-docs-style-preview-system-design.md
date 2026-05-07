# Docs-style preview system (C-lite)

**Date:** 2026-05-04
**Status:** Draft for review
**Owner:** Nicolas Vlachos

## Problem

The current showcase under `src/preview/pages/**` is 92 hand-written React
files using a `<PreviewPage>` + `<PreviewSection>` shell. It works as an
internal demo but it is:

- **Not docs-grade.** No prose, no API/props table, no "when to use",
  no realistic data — examples use `Foo`, `onClick={() => {}}`, etc.
- **Not navigable as documentation.** Sidebar groups by section/family
  but there's no per-page table of contents, no breadcrumb, no per-example
  anchors, no "Code" tab that mirrors what the example actually renders.
- **Not skill-readable.** AI agents using the
  `component-library-rules` skill cannot find canonical example code
  for a specific component without grepping JSX. There is no markdown
  index of "how the library uses each component."
- **Inconsistent visually.** Different pages use slightly different
  paddings, headings, and section shapes because each was hand-written.

Goal: convert the showcase into a docs-grade reference that (a) looks
and behaves like shadcn/Radix-style documentation, (b) shows realistic
data and async behavior, and (c) is fully accessible to AI agents
through the rules skill.

## Non-goals

- **Public docs site.** This stays internal — the existing `npm run dev`
  preview app is the host. Nothing is deployed.
- **Content rewrite for every page.** Only ~5 reference pages get
  hand-written prose in this iteration. The other 87 ship with a
  uniform mechanical template; prose grows page-by-page later.
- **API stability changes.** No component APIs change. This is purely a
  documentation/showcase refactor.
- **i18n of docs prose.** Docs are English-only.
- **Replacing `npm run dev`.** The existing preview app remains the
  entry point; the new system mounts inside it.
- **Touching `src/components/**`.** The library itself is not modified.
  Only `src/preview/**`, build config, the rules skill, and a one-shot
  conversion script.

## Approach — C-lite

Build the docs infrastructure once, hand-craft ~5 reference pages to
set the prose tone, and run a conversion script over the remaining 87
pages so all 92 ship with the new chrome on day one. Hand-written prose
backfills organically thereafter.

### Infrastructure (one-time)

A new `src/preview/_docs/` folder with the docs primitives:

- **`<DocsPage>`** — the per-page shell. Header (title, description,
  layer/status badges, source link), table of contents (auto-generated
  from `<Section>` headings), main column.
- **`<Section title="…" id="…">`** — a scroll-anchor section with a
  heading and optional description. Contributes to the TOC.
- **`<Example name="…" source="…">`** — the workhorse. Renders its
  children live AND offers tabs:
  - **Preview** (default) — the live render
  - **Code** — the example source, pulled by Vite `?raw` import from
    a co-located `*.examples.tsx` file (single source of truth, never
    drifts from what renders)
  - **Props** (optional) — for examples that exercise a specific
    sub-API, a small props panel
- **`<PropsTable component="Badge">`** — auto-generated props table
  from TypeScript types via `react-docgen-typescript` at build time
  (cached to a JSON sidecar so rebuilds are fast).
- **`<ApiBlock>`** — a small block of import statement + signature line
  for the "API" section.
- **`<Callout type="info|warning|tip">`** — a styled note block.

Build wiring:

- **MDX support** via `@mdx-js/rollup` added to `vite.config.ts`. MDX
  pages live alongside `.tsx` pages under `src/preview/pages/**`.
- **`?raw` source extraction** — already supported by Vite, no plugin
  needed. Each page's examples live in `<page>.examples.tsx`; the MDX
  imports them as components AND imports the file as a `?raw` string
  for the Code tab.
- **`react-docgen-typescript`** as a dev-dependency. A small
  `scripts/generate-props-tables.ts` runs once (and on `npm run dev`
  via a Vite plugin hook) to emit `src/preview/_docs/props.generated.json`
  consumed by `<PropsTable>`. Pre-generation keeps the dev server fast
  and side-steps doing TS analysis in the browser.

### Mock-API layer (one-time)

`src/preview/_mocks/` holds realistic seed data and fake fetchers so
async features behave like real APIs:

- **Seed data** modeled on a fictional admin app: `customers`,
  `orders`, `vouchers`, `products`, `team`, `comments`, `activities`,
  `tags`. Each seed file exports typed arrays.
- **Fake fetchers** — small helpers like `mockSearch(query)`,
  `mockListOrders({ filters })`, `mockDelay(ms = 300)`. Implementations
  are in-memory (no MSW, no network). The shape mimics what a real
  consumer would write at the call site.
- **Strings overrides** for examples — small helper to demonstrate
  how a consumer would override `<Feature strings={{…}}>`.

The mock layer is **not exported from the library**. It only exists
inside `src/preview/_mocks/` and is consumed by examples.

### Page shape — the new contract

Every preview page is an `.mdx` file. The convention:

```
src/preview/pages/<section>/<name>.mdx           # the docs page
src/preview/pages/<section>/<name>.examples.tsx  # named example exports
```

Skeleton:

```mdx
---
id: base/badge
title: Badge
description: Status pills and chips for tags, counts, and inline state.
section: Base
family: Foundations
layer: base
status: ready
sourcePath: src/components/base/badge
---

import * as Examples from './badge.examples'
import examplesSource from './badge.examples?raw'

<Section title="Overview" id="overview">

The `Badge` component is the canonical pill/chip in the library. It
sizes through `<UIProvider badge={{ defaultSize }}>` and exposes
semantic variants (`success`, `warning`, `destructive`, `info`,
`primary`, `muted`).

</Section>

<Section title="Examples" id="examples">

<Example name="Default" source={examplesSource}>
  <Examples.Default />
</Example>

<Example name="Variants" source={examplesSource}>
  <Examples.Variants />
</Example>

<Example name="With icon" source={examplesSource}>
  <Examples.WithIcon />
</Example>

</Section>

<Section title="API" id="api">

<ApiBlock>
{`import { Badge } from '@/components/base/badge'`}
</ApiBlock>

<PropsTable component="Badge" />

</Section>

<Section title="Notes" id="notes">

- Use semantic variants only. Never `bg-chart-N` for "category color".
- Default size resolves through `<UIProvider>` — don't pin `size="xs"`
  at the call site unless intentional.

</Section>
```

The companion `badge.examples.tsx`:

```tsx
import { Badge } from '@/components/base/badge'

export function Default() {
  return <Badge>New</Badge>
}

export function Variants() {
  return (
    <div className="flex gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  )
}

export function WithIcon() {
  return (
    <Badge variant="success">
      <CheckIcon className="size-3" /> Verified
    </Badge>
  )
}
```

The "Code" tab pulls from `examplesSource` and shows just the function
matching the example name (a small slicer in `<Example>` extracts the
named export's body). This means **the rendered output and the displayed
code can never drift**.

### Conversion (per-page, mostly mechanical)

A one-shot script `scripts/convert-preview-page.ts` does the heavy
lifting on the 87 non-reference pages:

1. Reads an existing `XPage.tsx`.
2. Walks the JSX tree:
   - Each `<PreviewSection title="…">` becomes a `<Section>` in MDX.
   - The JSX inside becomes an `Examples.<CamelCasedTitle>` named
     export in `<name>.examples.tsx`.
   - The MDX wraps each in `<Example name="…" source={examplesSource}>`.
3. Lifts the page title/description into MDX frontmatter.
4. Writes the `.mdx` and `.examples.tsx` files alongside the original
   `.tsx`. The original `.tsx` is **left in place but removed from the
   registry** — a follow-up cleanup deletes them once visual parity is
   confirmed.
5. Logs anything it can't auto-convert (unusual JSX shapes, inline
   helper functions) so a human pass can finish those.

The script is run once locally; it is not part of CI. The output is
committed.

### Reference pages (hand-written prose)

These five pages get bespoke prose, "when to use / when not to use",
and richer mock-data scenarios. They become the templates contributors
copy from:

- `base/badge.mdx` — simplest stateless component
- `base/item.mdx` — canonical row primitive (covers `ItemMedia`,
  `ItemContent`, `ItemActions`, polymorphic `render`)
- `base/forms.mdx` — `FormField` + `ControlledFormField`, async
  validation example
- `features/global-search.mdx` — slots + render-props + headless hook
  (uses mock fetcher)
- `features/filters.mdx` — provider-driven feature with exported
  partials (uses mock async options)

### Navigation overhaul

`PreviewApp.tsx` and the sidebar get a small face-lift to match docs
sites:

- **Left sidebar** — sections collapsible, families as sub-headings,
  pages as items. Active page highlighted; status badge inline (`wip`,
  `broken`).
- **Top bar** — breadcrumb (`Base / Foundations / Badge`), a
  search-input that filters the registry by label/id (uses the existing
  `cmdk` primitive).
- **Right rail** — auto-generated TOC of `<Section>` headings on the
  current page. Sticky on `lg+`.
- **Per-page header** — title, description, layer + status badges,
  "View source" link to the component folder on disk.

Mobile: sidebar collapses into a sheet; right rail collapses into a
top dropdown.

### Skill integration — `references/components/`

The rules skill (`.agents/skills/component-library-rules/`) gains a
new directory:

```
references/
└── components/
    ├── README.md                # how to use this directory
    ├── INDEX.md                 # one-line entry per component, grouped by layer
    └── <component>.md           # symlink or copy of the page's MDX content
```

`INDEX.md` shape (one line per component):

```md
- [Badge](./badge.md) — `base/` — Status pills and chips. Sizes via `<UIProvider badge>`.
- [Item](./item.md) — `base/` — Canonical row primitive (icon + title-stack + actions).
- [GlobalSearch](./global-search.md) — `features/` — Slots, render-props, headless `useGlobalSearch`.
…
```

The per-component `.md` files are **generated from the MDX** by a small
script (`scripts/sync-skill-components.ts`):

- Strips MDX-only constructs (imports, `<Example>` wrappers).
- Inlines example code from `*.examples.tsx` as fenced code blocks
  with the source.
- Inlines the auto-generated props table as a markdown table.
- Adds a footer linking back to the source file in the repo.

The script runs:
- Manually via `npm run sync:skill-components`.
- In CI as a check (fails if the generated docs are out of date — same
  pattern as the existing `lint:architecture`).

The skill's `SKILL.md` gets a new section pointing agents at
`references/components/INDEX.md` as the canonical lookup for "how is
this component used in the library."

## Architecture

```
src/preview/
├── _docs/                       (NEW)
│   ├── docs-page.tsx            <DocsPage>, <Section>, <Example>, <Callout>
│   ├── code-block.tsx           Syntax-highlighted code with copy button
│   ├── props-table.tsx          Reads props.generated.json
│   ├── api-block.tsx
│   ├── toc.tsx                  Right-rail table of contents
│   ├── mdx-components.tsx       Shared MDX component map
│   ├── extract-example.ts       Slices a named export out of *.examples.tsx?raw
│   └── props.generated.json     (generated by script)
├── _mocks/                      (NEW)
│   ├── customers.ts
│   ├── orders.ts
│   ├── vouchers.ts
│   ├── …
│   └── fetchers.ts              mockSearch, mockList, mockDelay
├── PreviewApp.tsx               (UPDATED — new sidebar/topbar/rail)
├── PreviewLayout.tsx            (kept; legacy pages still render through it
│                                  during the transition)
├── registry.tsx                 (UPDATED — entries now point at .mdx pages)
└── pages/
    ├── base/
    │   ├── badge.mdx            (NEW)
    │   ├── badge.examples.tsx   (NEW)
    │   ├── BadgePage.tsx        (deleted after parity check)
    │   └── …
    └── …

scripts/                         (NEW)
├── convert-preview-page.ts      One-shot mechanical converter
├── generate-props-tables.ts     react-docgen-typescript → JSON
└── sync-skill-components.ts     MDX → skill references/components/*.md

.agents/skills/component-library-rules/
└── references/
    └── components/              (NEW)
        ├── README.md
        ├── INDEX.md
        └── <generated *.md files>
```

### Data flow per page

```
<page>.mdx
  ├── imports * as Examples from './<page>.examples'    (live components)
  ├── imports examplesSource from './<page>.examples?raw' (string source)
  ├── renders <DocsPage> wrapping <Section>s
  └── each <Example name="X"> renders <Examples.X /> in Preview tab
       and slices `examplesSource` to function X for the Code tab

<PropsTable component="Badge">
  └── reads props.generated.json (built once, cached on disk)

scripts/sync-skill-components.ts
  reads <page>.mdx + <page>.examples.tsx
  writes .agents/skills/.../references/components/<page>.md
  (with examples inlined as fenced code blocks)
```

### Error handling

- **MDX parse error** — Vite shows the standard error overlay; page is
  unreachable until fixed. Same UX as a bad `.tsx`.
- **Missing example export** — `<Example name="X">` where `Examples.X`
  doesn't exist renders a red "missing example: X" placeholder in DEV.
- **Missing prop in `props.generated.json`** — `<PropsTable component="Y">`
  where Y wasn't picked up renders a yellow "props not generated for Y"
  placeholder with a hint to re-run the script.
- **Conversion script unable to handle a page** — script logs the page
  and the unrecognized JSX shape. The original `.tsx` stays in place,
  registered, until a human converts it.

### Testing

- **Smoke test**: a Vitest run mounts every registered page and asserts
  no console errors on render. Already partially exists (`test:exports`)
  — extend.
- **Sync test**: CI runs `sync-skill-components.ts --check` and fails
  if the generated `references/components/` is out of date.
- **No bespoke unit tests** for the docs primitives — they're pure
  composition over existing base/typography components.
- **Visual check**: rule 16's five-question pass on the 5 reference
  pages and a randomly sampled 10 of the converted pages.

## Open questions / things to confirm during implementation

1. **MDX vs plain markdown with a custom parser.** MDX is the obvious
   pick (component embedding, established Vite plugin). Plain MD with
   a custom `<!-- example: Foo -->` directive is simpler but less
   expressive. Going with MDX.
2. **`react-docgen-typescript` vs handwritten props tables.** Auto-gen
   wins because the alternative is 92 manually-maintained tables that
   will rot. Tradeoff: TS-resolved types sometimes need `@docgen` JSDoc
   hints to read well — accept that and add hints where needed.
3. **Should the conversion script delete the old `.tsx` immediately?**
   No. Convert + register-the-mdx + leave-the-tsx. Visual parity
   confirmed across a sampled set, then a single cleanup commit deletes
   all old `.tsx` page files.
4. **Search in the top bar.** Use the existing `base/command` primitive
   (cmdk) to keep dependency surface minimal. Already used by
   `features/global-search`.

## Acceptance criteria

- [ ] Every entry in `registry.tsx` resolves to an `.mdx` page rendered
      via `<DocsPage>`.
- [ ] Every page has a header (title, description, layer + status
      badges, source link), a TOC right rail, and at least one
      `<Example>` block.
- [ ] Every `<Example>` block has working Preview / Code tabs; the Code
      tab content is sliced from `*.examples.tsx?raw` (no manual code
      duplication anywhere).
- [ ] `<PropsTable>` works for at least the 5 reference components.
      Other components show a "regenerate" placeholder if their props
      aren't in `props.generated.json` yet — non-blocking.
- [ ] At least one async feature (`features/global-search` or
      `features/filters`) demonstrates the mock-fetcher pattern with
      realistic seed data.
- [ ] `.agents/skills/component-library-rules/references/components/`
      contains an `INDEX.md` and a `*.md` file per registered component.
- [ ] `npm run sync:skill-components --check` passes; CI script is
      added to `npm run verify`.
- [ ] `SKILL.md` references the new components index.
- [ ] No regressions: `npm run typecheck`, `npm run lint`,
      `npm run lint:architecture`, `npm run test:exports` all pass.
- [ ] Visual evaluation pass (rule 16) passes on the 5 reference pages
      and 10 sampled converted pages.

## Phasing inside the implementation plan

The implementation plan (next step) will sequence this so each phase
ends in a working, reviewable state:

1. Infra primitives (`<DocsPage>`, `<Example>`, `<PropsTable>`,
   `<CodeBlock>`) and MDX wiring — proven against one reference page
   (`base/badge.mdx`) before touching any other page.
2. Mock-API helpers + reference page #2 (`features/global-search`)
   exercising async.
3. Remaining 4 reference pages.
4. Conversion script + run on all 87 remaining pages.
5. Navigation overhaul (sidebar, topbar, right rail).
6. Skill integration (`references/components/`, sync script, SKILL.md
   update).
7. Cleanup (delete old `.tsx` page files; update verify script).

Each phase is independently reviewable.
