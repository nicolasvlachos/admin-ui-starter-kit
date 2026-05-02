# UI Library Audit

Date: 2026-05-01

Scope: `admin-ui-starter-kit` as a standalone React admin/SaaS component package.

This document is the baseline audit for making the package consistent, reusable,
themeable, easy to install, and visually strong without dressing up preview pages
as a substitute for good component foundations.

## Audit Method

I reviewed the local rules, package surface, source layout, provider/token
architecture, base primitives, composed/features/layout boundaries, preview
registry, static verification, and representative rendered pages.

Commands and checks run:

```bash
npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0
npm run lint
npx vitest run
```

Additional scans:

- Package export targets vs actual files.
- Layer import direction and direct shadcn primitive usage.
- Old alias usage like `@/components/ui/base/*`.
- Typography drift: arbitrary font sizes and `text-base+` usage.
- Raw semantic color drift, chart token misuse, hex colors.
- Raw interactive elements and raw text utilities inside component JSX.
- Long files that carry too many responsibilities.
- UIProvider adoption.
- Desktop and mobile Playwright smoke screenshots for representative preview
  routes.

Screenshots were captured outside the repo at:

```text
/tmp/react-sass-components-audit-screenshots
```

## Implementation Status

Initial remediation completed on 2026-05-01:

- Added a Vitest setup and restored the currently checked-in tests.
- Tightened package exports with feature/base barrels and exact exports for
  non-standard `index.tsx` entrypoints.
- Shifted library defaults toward admin density: `Text` defaults to `sm`,
  `BaseButton` defaults to `sm`, `Badge` defaults to `xs`, and `SmartCard`
  default padding is `sm`.
- Reduced `Heading` default scale so headings do not dominate dense admin
  surfaces.
- Moved `EventLog` from `composed/timelines` to `features/event-log`, because
  it composes comment and mention feature workflows.
- Replaced the invalid hook direction with feature-local
  `default*Strings` exports and `strings` props, so consumers translate outside
  the library and pass copy in.
- Fixed the visual smoke warnings found in `PageActions` and
  `CommentComposer`.
- Replaced stale README boilerplate with package usage, theming, and provider
  guidance.

## Target Contract

This is the contract the package should converge on.

### Layers

Component imports should flow in one direction:

```text
ui         generated/read-only shadcn/base-ui primitives
base       package design-system wrappers and single-purpose primitives
common     shared brand/common package pieces
composed   domain-neutral cards, rows, visual widgets built from base
features   app-level workflows driven by props, callbacks, strings, slots
layout     framework-neutral admin shell primitives built from base/ui
preview    thin demos only
```

Rules:

- Never edit `src/components/ui/**` for package design defaults.
- Fix repeated primitive styling by adding or improving `base/**`.
- Do not import features from composed.
- Do not put routing, data fetching, i18n SDKs, or app services in default
  package paths.
- Preview pages should exercise real component APIs; if they need heavy custom
  JSX to look good, the underlying component API is missing a seam.

### Admin Visual Language

Default density should be admin-first:

- `Text size="sm"` for primary row/card/body text.
- `Text size="xs"` for metadata, descriptions, secondary labels.
- `Text size="xxs"` for counts, eyebrows, dense helper text.
- `text-base` is opt-in, not the default for card titles, inputs, and rows.
- Card titles should default to `sm` semibold unless they are true page/hero
  values.
- Rows should generally be `py-1.5` or `py-2`; compact means organized, not
  cramped.
- Icon-only controls should use established sizes (`icon-xs`, `icon-sm`) and
  tooltips/aria labels.
- Visual emphasis should come from hierarchy, spacing, and semantic state, not
  many unrelated gradients or raw colors.

### Tokens And CSS Variables

`src/App.css` should be the documented token contract:

- Typography tokens: `--text-xxs`, `--text-xs`, `--text-sm`, `--text-base`,
  `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`, `--text-4xl`,
  `--text-5xl`.
- Typography scale knobs: `--base-font-scale`, `--heading-font-scale`,
  `--text-font-scale`, `--label-font-scale`, `--link-font-scale`.
- Density tokens: `--row-py-tight`, `--row-py-default`, `--row-py-loose`,
  `--row-py`.
- Component knobs should be narrow, named, commented, and mapped in `@theme`
  only when they need Tailwind utilities.

Potential CSS variables to add after concrete use cases:

- `--control-height-xs`, `--control-height-sm`, `--control-height-base`
- `--control-radius`
- `--field-pad-x`, `--field-pad-y`
- `--card-pad-sm`, `--card-pad-base`, `--card-pad-lg`
- `--surface-header-px`, `--surface-header-py`
- `--menu-item-px`, `--menu-item-py`
- `--popover-content-pad` already exists and should be documented with examples.

Do not add a variable just to avoid choosing a component default. Add one only
when consumers realistically need to rebrand or redensify an entire surface.

### UIProvider Boundary

`UIProvider` should stay focused on package-wide display defaults:

- Good fit: default currency, locale, week start, table density, badge size,
  default button style, card padding, toast position/duration, media URL/name
  resolution.
- Bad fit: per-mount data, callbacks, fetchers, resource registries, route
  builders, user-facing strings.

Resolution rule:

```ts
props.X ?? useFooConfig().X ?? hardcodedFallback
```

Any new provider slice needs:

- type in `types.ts`
- default in `defaults.ts`
- selector in `hooks.ts`
- export in `index.ts`
- at least one component using the resolution rule
- docs in `src/lib/ui-provider/README.md`

## High-Priority Findings

### 1. Package Surface Is Not Publish-Ready

Files:

- `package.json`
- `src/index.ts`
- `src/components/base/index.tsx`
- `src/components/features/loaders`
- `src/components/features/metadata`
- `src/components/features/sync`
- `src/components/features/suggestions/index.tsx`

Problems:

- `package.json` is still `private: true`.
- `README.md` is still the default Vite template.
- Root `src/index.ts` exports `Base`, `Composed`, `Layout`, and
  `UIProvider`, but not `Features`.
- `./base/*` export targets assume `index.ts`; existing packages with
  `index.tsx` break for `base/buttons`, `base/map`, and `base/table`.
- `./features/*` maps to missing indexes for `features/loaders`,
  `features/metadata`, and `features/sync`.
- `features/suggestions/index.tsx` exists but the export map points at
  `index.ts`.
- No obvious declaration generation strategy is present for npm consumers.

Recommended direction:

- Decide whether package exports target source files during local development or
  built `dist` files for publishing. Do not mix the two.
- Add missing indexes or remove unpublished feature subpaths.
- Add `Features` to the root barrel if root namespace imports are part of the
  API.
- Add a real package README with install, CSS import, provider setup, import
  paths, peer deps, theming, and examples.

### 2. Generated `ui/**` Is Not Protected Enough

Files:

- `src/components/ui/badge.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/map.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/place-autocomplete.tsx`
- several other `src/components/ui/**` files currently modified in git status

Problems:

- Local rules say do not edit shadcn primitives directly, but the worktree has
  modified files under `ui/**`.
- `ui/badge.tsx` contains `text-[10px]`.
- `ui/calendar.tsx` contains `text-[0.8rem]`.
- `ui/map.tsx` is 1540 lines, which is far beyond a generated primitive shape
  and should probably not live in the shadcn layer.

Recommended direction:

- Treat `ui/**` as generated/read-only. If existing changes are intentional,
  promote them into `base/**` wrappers or a non-generated package layer.
- Add an audit guard: a script or lint rule that fails if package work changes
  `src/components/ui/**` except when explicitly running shadcn updates.
- Move package-owned primitives like map/place autocomplete out of `ui/**` if
  they are not generated shadcn primitives.

### 3. Base Barrel Is Incomplete

File:

- `src/components/base/index.tsx`

Currently exports:

- `badge`
- `buttons`
- `cards`
- `combobox`
- `copyable`
- `date-pickers`
- `event-calendar`
- `forms`
- `navigation`
- `typography`
- `table`

Missing even though folders exist:

- `command`
- `currency`
- `display`
- `map`
- `popover`
- `popover-menu`
- `toaster`

Impact:

- Root `Base` namespace and package subpath ergonomics are inconsistent.
- Consumers have to know folder-level paths instead of relying on a coherent
  base barrel.

Recommended direction:

- Export every intentional base module from `base/index.tsx`.
- If a folder is internal, rename it or document it as internal and keep it out
  of package exports.

### 4. Density Defaults Do Not Fully Match The Admin Contract

Files:

- `src/components/base/typography/heading.tsx`
- `src/components/base/typography/text.tsx`
- `src/components/base/cards/smart-card.tsx`
- `src/components/base/buttons/base-button.tsx`
- `src/components/base/forms/fields/input.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/card.tsx`

Problems:

- `Text` defaults to `size="base"`. That makes raw `<Text>` too large for the
  admin package contract.
- `Heading` maps h1-h6 to large marketing/document sizes by default.
- `SmartCard` plain text titles render as `Text size="base"`.
- `SmartCard` default padding resolves to `base`, which maps to `px-6 py-6`.
  That is polished but too roomy for dense admin defaults.
- `BaseButton` defaults to `size="default"` (`h-9`) rather than `sm` (`h-8`).
- `Input` uses `text-base md:text-sm`. That is common for mobile zoom behavior,
  but package documentation needs to explain it; otherwise it looks like a
  violation of the `sm/xs` rule.

Recommended direction:

- Make `Text` default `sm` only if the blast radius is acceptable. If not,
  keep it as-is but enforce explicit `size` in component code.
- Add admin-specific heading presets or revise `Heading` defaults for package
  surfaces. Page/hero consumers can opt into large headings explicitly.
- Change `SmartCard` title default to `sm` semibold and consider changing
  provider default `card.defaultPadding` to `sm` for admin use.
- Consider `button.defaultSize` as a UIProvider slice only if many components
  need global action density. Otherwise set `BaseButton` default to `sm`.
- Document mobile input font-size behavior if `text-base md:text-sm` remains.

### 5. Layer Violation In Composed Event Log

Status: implemented. `EventLog` now lives under `features/event-log`, and
`composed/timelines` no longer exports it.

Original files:

- `src/components/composed/timelines/event-log/event-log.tsx`
- `src/components/composed/timelines/event-log/event-log.types.ts`
- `src/components/composed/timelines/event-log/event-log-event-row.tsx`

Problem:

- Composed `event-log` imports from `features/comments` and
  `features/mentions`.

Impact:

- This inverts the architecture. Composed components should not depend on
  feature workflows.

Recommended direction:

- Extract feature-independent mention/comment display primitives into `base` or
  `composed/timelines/shared`.
- Keep workflow state machines, composer behavior, uploads, and feature hooks in
  `features/comments` and `features/mentions`.

### 6. Import Paths Are Inconsistent

Scan result:

- 387 imports still use compatibility aliases like
  `@/components/ui/base/*` and `@/components/ui/typography/*`.

Problem:

- The codebase presents `base` as `@/components/base`, but a large amount of
  code still imports base through a `ui/base` alias.

Impact:

- New contributors will copy mixed patterns.
- Layer scans are noisier.
- Public API examples become harder to trust.

Recommended direction:

- Normalize internal imports to `@/components/base/*`,
  `@/components/composed/*`, `@/components/features/*`, and
  `@/components/ui/primitives/shadcn/*` only when intentionally reaching the
  generated primitive layer.
- Keep the aliases temporarily for backwards compatibility, but stop using them
  in source.

### 7. Repeated Surface Patterns Should Become Base Components

Repeated patterns observed:

- `border-b border-border/60 px-3 py-2` appears in popover/search/menu surfaces.
- `flex min-w-0 flex-1 flex-col leading-tight` appears in option/result rows.
- `inline-flex size-6 shrink-0 items-center justify-center rounded-md...`
  appears in filter back/clear controls.
- Dense info cards repeat footer badge/chip sections.
- AI confidence/token/citation components repeat progress meter shapes.
- Field display components repeat copyable link/value rows.

Extraction candidates:

- `SurfaceHeader`: small header strip for popovers, command panels, and feature
  menus.
- `OptionRow`: icon/avatar + title + meta + trailing slot, with active/disabled
  states.
- `IconControl`: small icon-only button with Tooltip/aria support.
- `ValueRow` or `DescriptionRow`: label/value/trailing pattern for invoice,
  dense-info, metadata, and settings surfaces.
- `ProgressMeter`: semantic progress bar used by AI, metrics, and timelines.
- `EmptyState`: small admin empty state with icon/title/body/action slots.

Do not extract just because two strings match. Extract only when the same API,
accessibility behavior, and visual contract repeat across layers.

### 8. Raw Tokens And Typography Drift Are Real

Static scan counts:

- arbitrary text size matches: 8
- raw color utility matches: 133
- chart token usage as UI color: 19
- `text-base` and larger utility usage: 86
- hex colors in component code: 19
- raw `<button>` matches: 59
- raw texty `<span className=...>` matches: 28

Important files:

- `src/components/composed/cards/giftcard-card/types.ts`
- `src/components/base/event-calendar/colors.ts`
- `src/components/composed/commerce/payment-method/payment-method.tsx`
- `src/components/composed/cards/gradient-card/gradient-card.tsx`
- `src/components/composed/analytics/metric-gradient/metric-gradient.tsx`
- `src/components/features/metrics/stat-item.tsx`
- `src/components/composed/analytics/metric/metric.tsx`
- `src/components/base/command/command.tsx`
- `src/components/layout/header/partials/header-user-menu.tsx`

Recommended direction:

- Review raw colors case by case. Some domain palettes are legitimate, but
  status semantics should use semantic tokens.
- Stop using chart tokens for UI state. Chart tokens are grayscale data-series
  tokens in this package.
- Convert raw text spans to `Text` unless they are internal primitives,
  screen-reader spans, or layout-only spans.
- Keep bespoke text size only when it is tied to a documented density mechanism.

### 9. Strings Pattern Is Good But Not Complete

Good:

- Many components already export `default*Strings`.
- `src/lib/strings.ts` gives a reusable deep merge helper.
- Comments, global search, table, forms, layout pieces mostly follow the
  contract.

Problems:

- Some components still use ad-hoc object spreads instead of `useStrings`.
- There are hardcoded visible/accessibility strings in feature code:
  - `src/components/features/comments/partials/comment-composer.tsx`
    has `aria-label="Cancel"`.
  - `src/components/features/card/shared-resource-card.tsx` has hardcoded empty
    copy.
  - `src/components/features/filters/filter-layout.tsx` still has fallback
    string literals like loading and clear filters.
  - `src/components/base/event-calendar/event-calendar-legend.tsx` has a
    hardcoded aria label.

Recommended direction:

- Make `StringsProp<T>` the default type everywhere.
- Prefer `useStrings(defaults, stringsProp)` over manual spread unless a lower
  utility cannot use hooks.
- Include aria labels in the strings interface.

### 10. Tests Are Present But Not Operational Enough

Current test files: 10 under `src/components/**`.

`npx vitest run` result:

- failed
- picked up test files under `.claude/worktrees`
- picked up tests under `references`
- failed because `jsdom` is missing
- failed rich-text tests because they read old `resources/js/...` paths

Recommended direction:

- Add Vitest config that includes only intended tests:
  - `src/**/*.test.ts`
  - `src/**/*.test.tsx`
- Exclude:
  - `.claude/**`
  - `references/**`
  - `dist/**`
- Add `jsdom` if DOM component tests are expected.
- Fix old file-path assertions.
- Add a small number of high-value contract tests before broad visual work:
  - `SmartCard` padding/title defaults and provider override.
  - `Badge` size/provider/semantic variants.
  - `Button` variant/style/size and loading/tooltip composition.
  - `Input` clearable/loading/aria-invalid.
  - `PageActions` key stability and dropdown grouping.
  - `Comments` composer Base UI trigger/accessibility warning regression.
  - Export map smoke tests.

### 11. Visual Smoke Found Real Issues

Representative routes checked:

- `base/buttons`
- `base/cards`
- `base/forms`
- `base/table`
- `layout/page`
- `layout/sidebar`
- `composed/cards-gradient`
- `composed/data-display-dense-info`
- `features/filters`
- `features/global-search`
- `features/comments`

Desktop findings:

- `layout/page` logs a React key warning from `PageActions`.
- `features/comments` logs Base UI accessibility errors around `PopoverTrigger`
  rendering a non-button with native button semantics.
- `features/comments` also logs a Base UI render-prop warning around an
  uppercase render function.
- Gradient card demos have internal overflow and use raw hex/chart colors.

Mobile findings:

- The preview shell itself has horizontal overflow: body overflow measured at
  518px on every checked route.
- This comes from `PreviewApp` header/nav layout, not individual component
  content, but it blocks mobile visual QA for the whole package.
- Some component content also overflows/truncates heavily on mobile, especially
  global search result metadata and comments rows.

Recommended direction:

- Fix preview shell responsiveness as infrastructure, then do component visual
  audits.
- Add automated visual smoke for a curated route list at desktop and mobile.
- Fail the visual smoke on console errors and body horizontal overflow.

## File-By-File Audit Queue

This queue is ordered by leverage. It is not a demand to refactor all files in
one pass.

### Package And Docs

| File | Audit Result | Action |
| --- | --- | --- |
| `package.json` | Export map and publish config are not package-ready. | Fix subpath exports, private flag, types/build strategy. |
| `README.md` | Default Vite template. | Replace with real install/API/theming docs. |
| `AGENTS.md` | Rich but internally stale in places. | Remove contradictions around adapters/external-stubs. |
| `.agents/skills/component-library-rules/SKILL.md` | Active rules differ from root AGENTS and mention external-stubs. | Align with actual architecture. |
| `src/components/CONVENTIONS.md` | Useful but not fully enforced. | Update with current package import paths and admin defaults. |
| `vite.config.ts` | Alias compatibility is broad. | Keep compat if needed, but source should use canonical aliases. |
| `tsconfig.app.json` | Type-check passes. | Keep command documented; consider stricter package build config later. |
| `eslint.config.js` | Lint passes. | Add guardrails for `ui/**`, raw text sizes, and generated worktrees. |

### Tokens And Provider

| File | Audit Result | Action |
| --- | --- | --- |
| `src/App.css` | Strong token foundation; component variables underdocumented. | Add CSS variable docs and only narrow new knobs. |
| `src/lib/ui-provider/types.ts` | Good slice boundary. | Add slices only with real repeated defaults. |
| `src/lib/ui-provider/defaults.ts` | Defaults skew admin in places, but card/button defaults may be too roomy. | Revisit `card.defaultPadding`, possible button size strategy. |
| `src/lib/ui-provider/provider.tsx` | Mount-once semantics are deliberate. | Keep; consider SSR warning docs if needed. |
| `src/lib/ui-provider/hooks.ts` | Good slice selectors. | Add tests for slice stability. |
| `src/lib/ui-provider/README.md` | Best docs in repo. | Extend with CSS variable table and adoption list. |

### Base

| File | Audit Result | Action |
| --- | --- | --- |
| `src/components/base/index.tsx` | Missing several base exports. | Add intentional base module exports. |
| `src/components/base/typography/text.tsx` | Default `base` conflicts with admin-density if used implicitly. | Either change default to `sm` or require explicit size in component code. |
| `src/components/base/typography/heading.tsx` | Defaults are too large for admin surfaces. | Add admin presets or reduce defaults; keep large opt-in. |
| `src/components/base/buttons/base-button.tsx` | Good variant/style matrix; default size is roomy. | Consider `sm` default and provider strategy. |
| `src/components/base/buttons/button.tsx` | Composition is pragmatic; `href` wraps a button in an anchor. | Revisit semantics; prefer rendering link/button correctly, not nested interactive semantics. |
| `src/components/base/buttons/tooltip-button.tsx` | Tooltip composition works but console warning suggests render-prop handling needs review. | Validate with Base UI docs and add regression test. |
| `src/components/base/badge/badge.tsx` | Good semantic wrapper; default fallback says `xs` but provider default is `sm`. | Align docs/defaults and ensure icon size is not oversized. |
| `src/components/base/cards/smart-card.tsx` | Central primitive but too large/complex at 603 lines; title default is `base`. | Split internals, make admin title default `sm`, review padding defaults. |
| `src/components/base/popover/popover.tsx` | Good wrapper and CSS var. | Ensure all features use this instead of raw primitive where practical. |
| `src/components/base/popover-menu/popover-menu.tsx` | Reusable pattern. | Compare with global-search/mentions/filter menus for extraction. |
| `src/components/base/command/command.tsx` | Contains arbitrary text-size matches. | Align with typography tokens. |
| `src/components/base/forms/fields/input.tsx` | Strong API; raw input is correct here. | Add docs/tests for clearable/loading/addons and mobile font-size behavior. |
| `src/components/base/forms/fields/select.tsx` | Uses Base UI select; good candidate for provider/string consistency tests. | Audit sizing and string props. |
| `src/components/base/forms/fields/textarea.tsx` | Mirrors input; raw textarea is correct here. | Align clear/loading controls with `IconControl`. |
| `src/components/base/date-pickers/date-picker.tsx` | 1131 lines, too much responsibility. | Split state, trigger, calendar body, footer, presets; test core contracts. |
| `src/components/base/display/metadata/metadata-list.tsx` | 455 lines; repeated tooltip/value-row patterns. | Extract reusable metadata/value rows if API repeats. |
| `src/components/base/table/data-table.tsx` | Provider adoption exists. | Add tests for density/string/selection contracts. |
| `src/components/base/navigation/action-menu.tsx` | Important shared menu primitive. | Use as source of truth for small action menus. |

### Composed

| File | Audit Result | Action |
| --- | --- | --- |
| `src/components/composed/timelines/event-log/*` | Imports features. | Break dependency inversion. |
| `src/components/composed/cards/gradient-card/gradient-card.tsx` | Visual drift: raw hex, chart tokens, mobile overflow. | Rework tokens/variants; keep gradients only if domain-justified. |
| `src/components/composed/analytics/metric/metric.tsx` | Powerful but large; uses larger typography. | Audit metric hierarchy and share atoms with `features/metrics`. |
| `src/components/features/metrics/stat-item.tsx` | Overlaps with composed analytics. | Deprecate or unify around analytics atoms. |
| `src/components/composed/data-display/dense-info-card/**` | Good dense direction with repeated partial patterns. | Extract only genuinely shared row/footer primitives. |
| `src/components/composed/commerce/payment-method/payment-method.tsx` | Many raw brand colors. | Decide brand palette API vs semantic tokens. |
| `src/components/composed/cards/giftcard-card/types.ts` | Raw color-heavy by design. | Treat as brand/art component or expose theme slots explicitly. |
| `src/components/composed/preview.tsx` | 453-line composed demo-like file inside package. | Verify it is package code; if preview-only, move to preview. |

### Features

| File | Audit Result | Action |
| --- | --- | --- |
| `src/components/features/comments/partials/comment-composer.tsx` | Base UI native button warning and hardcoded `Cancel` aria label. | Fix popover trigger semantics and strings. |
| `src/components/features/comments/comments.tsx` | Good callback-driven feature shape. | Add accessibility and provider/string tests. |
| `src/components/features/filters/filter-layout.tsx` | Filter copy now resolves through nested `defaultFilterStrings` and provider `strings`. | Add focused tests for nested string overrides. |
| `src/components/features/filters/facets/async-select-facet.tsx` | Large but important. | Keep fetcher-driven; test loading/error/empty/min-query states. |
| `src/components/features/global-search/global-search.tsx` | Strong canonical shape. | Use as API model for other features. |
| `src/components/features/global-search/partials/global-search-result-row.tsx` | Mobile metadata truncates heavily. | Add better wrapping/truncation slots or responsive row layout. |
| `src/components/features/rich-text-editor/rich-text-editor.tsx` | 695 lines and tests point to old paths. | Split toolbar/editor/source mode; fix tests. |
| `src/components/features/mentions/**` | Useful headless logic and tests. | Restore jsdom test environment and export docs. |
| `src/components/features/overlays/**` | Good shared overlay direction. | Ensure all dialog titles/descriptions are accessible and strings-driven. |
| `src/components/features/card/shared-resource-card.tsx` | Hardcoded empty copy. | Add strings interface/defaults. |

### Layout

| File | Audit Result | Action |
| --- | --- | --- |
| `src/components/layout/index.ts` | Good framework-neutral intent. | Include layout in package docs. |
| `src/components/layout/page/partials/page-actions.tsx` | React key warning in visual smoke. | Ensure inline render path always returns keyed children. |
| `src/components/layout/sidebar/**` | Directly imports shadcn sidebar/sheet primitives. | Decide whether layout owns these wrappers or base should. |
| `src/components/layout/header/**` | Good string pattern overall. | Audit mobile density and old aliases. |
| `src/components/layout/README.md` | Strong docs. | Keep in sync with package README and export map. |

### Preview

| File | Audit Result | Action |
| --- | --- | --- |
| `src/preview/PreviewApp.tsx` | Mobile header causes 518px body overflow on checked routes. | Fix preview shell responsiveness as QA infrastructure. |
| `src/preview/registry.tsx` | Useful central registry. | Add visual smoke route list from registry status. |
| `src/preview/pages/**` | 83 pages; many use raw JSX for docs/demo. | Keep demos thin; when custom private components appear, move capability into real package layer. |

## Verification Baseline

Current state from this audit:

```text
tsc:     pass
eslint:  pass
vitest:  fail
visual:  representative routes render, but console/mobile overflow issues exist
```

Vitest blockers:

- `jsdom` missing.
- `.claude/worktrees/**` tests are included.
- `references/**` tests are included.
- Some tests read old `resources/js/...` paths.

Visual blockers:

- Preview shell mobile overflow.
- PageActions React key warning.
- Comments composer Base UI trigger semantic warning.
- Comments composer Base UI render prop warning.

## Recommended Implementation Roadmap

### Phase 0 — Guardrails Before Refactor

- Add/adjust Vitest config so only intended tests run.
- Add `jsdom` if DOM tests are part of the package test suite.
- Exclude `.claude/**`, `references/**`, and `dist/**`.
- Add a package export smoke test.
- Add a simple static check for forbidden `ui/**` edits and arbitrary text
  sizes outside approved files.

### Phase 1 — Package Surface And Docs

- Fix `package.json` exports.
- Decide source vs `dist` export strategy.
- Add missing barrels or remove unpublished subpaths.
- Replace root README with install, CSS import, provider, theming, and examples.
- Align `AGENTS.md`, `.agents/skills/component-library-rules/SKILL.md`, and
  `src/components/CONVENTIONS.md`.

### Phase 2 — Base Defaults

- Normalize `base/index.tsx`.
- Revisit `Text`, `Heading`, `SmartCard`, `Button`, `Badge`, and `Input`
  defaults against the admin density contract.
- Add tests around base defaults before changing composed/features.
- Document every CSS variable and provider slice that consumers can override.

### Phase 3 — Architecture Cleanup

- Normalize import aliases.
- Fix composed event-log dependency on features.
- Move package-owned non-generated primitives out of `ui/**` or wrap them
  cleanly in `base/**`.
- Establish extraction criteria for repeated rows/headers/menus.

### Phase 4 — Visual QA Infrastructure

- Fix preview shell mobile layout.
- Add Playwright smoke routes for desktop and mobile.
- Fail visual smoke on console errors, page errors, and body horizontal
  overflow.
- Capture screenshots for changed components only.

### Phase 5 — Component-by-Component Polishing

Order:

1. Base typography/cards/buttons/badge/forms.
2. Popover/menu/command shared surfaces.
3. Table/date picker/high-density forms.
4. Layout shell.
5. Comments/mentions/global-search/filters.
6. Analytics/metrics and commerce/cards.

Each component pass should include:

- API review.
- strings review.
- provider/CSS-var boundary review.
- accessibility review.
- desktop/mobile preview check.
- targeted tests.

## Definition Of Done For Future Component Edits

A component edit is done only when:

- It respects the layer boundary.
- It uses base components by default.
- It uses `Text`/`Heading` and admin sizes intentionally.
- User-facing and aria strings are overrideable.
- State and callbacks are props, not provider/global state.
- CSS variables are documented if introduced.
- `tsc` passes for touched files.
- Relevant tests pass or are added.
- Preview route renders without console errors.
- Desktop and mobile screenshots have no incoherent overlap or body overflow.
