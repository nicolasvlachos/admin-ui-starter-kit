# Standalone-package readiness plan

This plan ladders the codebase up to "publishable npm package" state. Each phase is a self-contained session — execute in order, verify, then move on. Every phase ends with `tsc` clean and a visual evaluation pass per rule 16.

> **Status (last update):** Phases 1–13 are complete. The library is publish-ready
> from an architecture and patterns standpoint. Remaining work is largely about
> packaging metadata (Phase 10) and a final pre-publish verification pass (Phase
> 11). See "Phase 13" at the bottom for what landed after the original plan.

---

## Phase 1 — Foundation (no behavior change)

Goal: introduce the new abstraction layer pieces that everything downstream will consume.

1. **`base/popover/`** wrapper around `ui/popover`
   - Re-export `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverArrow`, `PopoverClose`.
   - Wrap the root with default `sideOffset`, focus ring, density-aware `--popover-content-pad`.
   - Document API in a header block.
2. **`base/command/`** wrapper around `ui/command`
   - Default `CommandItem` typography via `Text size="xs"`.
   - Default empty state slot.
   - Density tokens.
3. **`base/popover-menu/`** — composed of `base/popover` + `base/command`
   - Captures the recurring "trigger → header → command list" pattern from filter facets.
   - Slots: `header`, `footer`, `empty`, `loading`.
   - Render-prop: `renderItem={(item) => …}`.
4. **Typography tokens** in `App.css` `@theme`
   - `--text-xxs: 0.6875rem`, `--text-xs: 0.75rem`, `--text-sm: 0.8125rem`, `--text-base: 0.875rem`, `--text-lg: 1rem`.
   - Rewire `Text` size scale to read these via `font-size: var(--text-xs)` etc.
   - Document each in a comment.
5. **Density tokens** in `App.css`
   - `--row-py-tight: 0.25rem`, `--row-py-default: 0.5rem`, `--row-py-loose: 0.625rem`.
   - Add `data-density="default|tight|loose"` data attribute pattern documented in `App.css`.

Verification: snapshot the showcase before/after — pixel diff should be near-zero.

---

## Phase 2 — Migrate filter facets to `base/` wrappers

Goal: prove the new wrappers work under real load and collapse duplicated primitive imports.

6. **`features/filters/partials/filter-operator-select.tsx`** — replace inline `Popover` + `Command` with `<PopoverMenu>` from `base/`. Drop ~80 lines.
7. **`features/filters/partials/filter-popover-content.tsx`** — same.
8. **`features/filters/facets/select-facet.tsx`** — same.
9. **`features/filters/facets/async-select-facet.tsx`** — same (still has the `useQuery` import; that gets handled in phase 3, not here).
10. **`features/filters/facets/search-facet.tsx`** — minor: confirm `Input` is from `base/forms/fields/input`, not from `ui/`.

Verification: every filter facet preview still renders identically, every interaction still works.

---

## Phase 3 — Decouple `features/global-search` from peer deps

Goal: turn this from "Inertia-only" into a framework-agnostic feature, then port the rich preview rendering INTO the feature.

11. **Move rich rendering INTO `features/global-search/`**
    - Create `features/global-search/global-search.tsx` with the rich layout currently inlined in `preview/pages/features/GlobalSearchPage.tsx`.
    - Export `GlobalSearchResultRow` partial.
    - Define `GlobalSearchStrings` interface + `defaultGlobalSearchStrings`.
12. **Remove `vite-bundled-i18n/react`** import from default exports.
    - All strings flow through `strings` prop merged with defaults via `useStrings`.
13. **Remove `@inertiajs/react` `router.visit`** from default exports.
    - Replace with `onResultSelect(result)` callback. Consumer wires their own router.
14. **`features/global-search/adapters/inertia.tsx`** — opt-in adapter
    - Exports `<InertiaGlobalSearch>` that wires `router.visit` to `onResultSelect` and optionally pulls strings from `vite-bundled-i18n`.
    - NOT re-exported from `features/global-search/index.ts`. Consumer imports adapter explicitly.
15. **Folder shape** — restructure to:
    ```
    features/global-search/
    ├── index.ts
    ├── global-search.types.ts
    ├── global-search.strings.ts
    ├── global-search.tsx
    ├── partials/
    │   ├── global-search-input.tsx
    │   ├── global-search-tabs.tsx
    │   ├── global-search-result-row.tsx
    │   └── global-search-empty-state.tsx
    ├── hooks/
    │   ├── index.ts
    │   └── use-global-search.ts        # headless state hook
    └── adapters/
        └── inertia.tsx
    ```
16. **`preview/pages/features/GlobalSearchPage.tsx`** — delete the inline `GlobalSearch` component (300+ lines). Import from `@/components/features/global-search`. The preview becomes a thin demo of slots/render-props/strings overrides.

Verification: visually identical to the current rich preview, but the preview file is < 100 lines.

---

## Phase 4 — Decouple `features/comments` and `features/filters` Inertia bits

17. **`features/comments/*`** — strings prop, callbacks (`onSubmit`, `onDelete`, `onUpdate`) instead of `router.post`, drop `vite-bundled-i18n/react` import. Inertia wiring lands in `features/comments/adapters/inertia.tsx`.
18. **`features/filters/inertia-filter-provider.tsx`** + **`features/filters/use-inertia-filters.ts`** → move to `features/filters/adapters/inertia/`. Re-export from there only.
19. **`features/filters/facets/async-select-facet.tsx`** — replace `useQuery` with a `fetcher` prop + internal `useState`/`useEffect` async state machine. Provide `features/filters/adapters/react-query.tsx` for consumers who want the original integration.
20. **`features/filters/partials/async-filter-content.tsx`** — same treatment.

Verification: feature-level imports of `@inertiajs/*`, `@tanstack/react-query`, `vite-bundled-i18n/*`, `ziggy-js` only exist under `adapters/` folders. Confirm with:
```
grep -rn "@inertiajs\|@tanstack/react-query\|vite-bundled-i18n\|ziggy-js" \
  src/components/features --include='*.ts' --include='*.tsx' \
  | grep -v '/adapters/'
# expect: empty
```

---

## Phase 5 — Strings audit across `composed/`, `metrics/`, and remaining features

21. **`features/metrics/*`** — restructure into folder shape (per rule 11). Each metric variant gets `*.types.ts` + `*.strings.ts`. Convert hardcoded English (`"vs prev period"`, `"All time high"`, etc.).
22. **`composed/cards/*`** — strings audit. Convert hardcoded strings to `defaultStrings` + `strings` prop.
23. **`features/rich-text-editor`** — strings prop.
24. **`features/sync`, `features/metadata`, `features/slugify`, `features/currency`** — strings prop where applicable.
25. **`features/activities`, `features/loaders`, `features/suggestions`** — strings audit.

Verification: grep for likely hardcoded English (`"Cancel"`, `"Save"`, `"Loading"`, `"No results"`, etc.) inside `src/components/{composed,features}/**` — every hit should resolve to a `defaultStrings` reference.

---

## Phase 6 — Composability seams

26. **`features/global-search`** — slots: `headerSlot`, `footerSlot`, `emptyStateSlot`, `recentSlot`, `tabsSlot`. Render-prop: `renderResult={(item, ctx) => ReactNode}`. Export `<GlobalSearchResultRow>` partial. Headless: `useGlobalSearch()` hook.
27. **`features/filters`** — export individual partials (`<FilterChip>`, `<FilterValuePopover>`, `<FilterOperatorSelect>`) so consumers can build custom layouts. Add `useFiltersState()` hook for headless usage.
28. **`features/overlays`** — already good; document the slot list in a header block in each overlay file.
29. **`features/comments`** — slots: `composerSlot`, `emptySlot`, `headerSlot`. Render-prop for items.

Verification: each preview page should be able to demonstrate at least one slot/render-prop override without modifying the feature.

---

## Phase 7 — Showcase cleanup

30. **Audit every preview page** for inline "private" component definitions. List them, rank by impact, fix the underlying feature so the preview becomes a thin demo.
    - Already known: `GlobalSearchPage.tsx` (handled in phase 3).
    - Likely candidates: any page > 300 lines.
31. **Add a "Slots & customization" section** to each preview page that has them — demos consumer-overrideable parts.

---

## Phase 8 — Typography & density application

32. **Sweep `text-[Npx]`** across `src/`:
    ```
    grep -rn "text-\[" src/components src/preview --include='*.tsx'
    # replace each with semantic Text size or rewire to typography variables
    ```
33. **Apply density tokens** to list rows in `filters`, `global-search`, `comments`, `metrics`, `activities`. Rows that are currently `py-2`/`py-2.5` consume `var(--row-py-default)` etc.
34. **Audit `Heading` usage** — confirm h1/h2 are only used in actual page-title contexts, not section headers (those should be `text-base` semibold per the rule).

---

## Phase 9 — Hooks colocation

35. Move feature-specific hooks out of `src/hooks/`:
    - `use-suggestions-query.ts`, `use-suggestions-query-adapter.ts` → `features/suggestions/hooks/`
    - `use-currency.ts` → `features/currency/hooks/`
    - `use-combobox.ts`, `use-autocomplete.ts` → `base/combobox/hooks/`
    - `use-files.ts`, `use-iframe-connection.ts` → audit if cross-cutting
36. Add `hooks/index.ts` barrel files where missing.

---

## Phase 10 — Package readiness

37. **`package.json`**:
    - Mark all peer-dep-flavoured deps as `peerDependencies` (`@inertiajs/*`, `@tanstack/react-query`, `vite-bundled-i18n`, `ziggy-js`, `react-router*`, `next`).
    - Mark them `peerDependenciesMeta.optional = true`.
    - Add `exports` map covering `./base`, `./composed`, `./features/*`, `./features/*/adapters/inertia`, etc.
    - Add `sideEffects` policy.
38. **Build pipeline** — confirm Vite library mode or tsup config emits ESM + CJS + d.ts.
39. **Lint rule** — add an eslint custom rule (or a `forbidden-import` config) banning peer-dep imports outside `adapters/` folders.
40. **README** — quickstart for consumers, slot/strings/adapter examples.

---

## Phase 11 — Verification & ship

41. `tsc -p tsconfig.app.json --noEmit` clean.
42. `pnpm build` (or equivalent) produces a publishable artifact.
43. Visual evaluation pass on every modified preview page (rule 16 checklist).
44. A clean `pnpm pack && npm install …tgz` in a scratch app — try importing each feature, confirm no peer-dep complaints, confirm strings/slots work.
45. Tag release.

---

## Phase 12 — `<UIProvider>` + framework-coupling removal

Eliminates the last framework-specific code paths by collapsing all
provider-style configuration into a single zustand-backed store, and
deleting every `adapters/$framework/` folder + every peer-dep stub.

46. **`@/lib/ui-provider` foundation** — `types.ts`, `defaults.ts`,
    `store.ts`, `provider.tsx`, `hooks.ts`, `index.ts`. One zustand store
    initialized with library-wide defaults. Slice selectors per concern
    (`useMoneyConfig`, `useDatesConfig`, `useCommentsConfig`, …).
47. **Base + composed read selectors** — `Money` / `MoneyDisplay` /
    `MoneyInput` via `useMoneyConfig`; `Badge` via `useBadgeConfig`;
    `SmartCard` via `useCardConfig`; `Button` via `useButtonConfig`;
    timelines / activity-feed / event-log via `useDatesConfig`. Per-mount
    props always win.
48. **Delete library-side providers** — `CommentsProvider` and
    `MentionsProvider` are gone. Mass config flows as direct props on
    `<Comments>` and friends. Filter state machine (`<FilterProvider>`)
    stays — it is per-mount state, not config.
49. **Delete framework adapters** — `features/comments/adapters/inertia.tsx`,
    `features/global-search/adapters/inertia.tsx`,
    `features/filters/adapters/inertia/`. Consumers wire callbacks at
    the call site.
50. **TipTap as direct dep** — `@tiptap/react`, `@tiptap/starter-kit`,
    `@tiptap/pm` move into `dependencies`.
51. **Stub purge** — delete `src/lib/external-stubs/` and every Vite
    alias pointing at it. Remove every framework integration peer dep
    from `package.json`.
52. **Showcase wiring** — root `<UIProvider>` in `App.tsx` demonstrates
    overrides; preview pages spread per-mount common props instead of
    nesting cross-cutting providers.
53. **Docs** — rule 9 forbids framework imports library-wide; rule 11
    drops the `adapters/` slot from feature folder shape; rule 17
    codifies the `<UIProvider>` precedence chain.

Net effect: zero framework integration code in `src/components/**`, zero
stubs, single provider, slice-scoped re-renders.

---

## Execution recommendation

Tackle as separate sessions:
- **Session 1**: Phase 1 (foundation). Low risk, high leverage.
- **Session 2**: Phase 2 (filter migration to base wrappers). Validates wrappers under real load.
- **Session 3**: Phase 3 (global-search decoupling — biggest single-feature win toward standalone-package goal).
- **Session 4**: Phases 4 + 5 (decoupling + strings audit) — these compound; doing both in one pass avoids two grep sweeps.
- **Session 5**: Phase 6 (composability seams).
- **Session 6**: Phases 7 + 8 (showcase cleanup + typography/density sweeps).
- **Session 7**: Phase 9 (hook colocation).
- **Session 8**: Phase 10 (package readiness).
- **Session 9**: Phase 11 (verify + ship).

---

## Phase 13 — Post-`<UIProvider>` cleanup (landed)

This phase wasn't in the original plan but was needed once Phase 12 landed.
It tightened the layer model and removed legacy aliases left over from a
previous app.

54. **Typography promoted to top-level peer** — `src/components/typography/`
    now holds Text, Heading, Label, TextLink. Old shim re-exporting from
    `base/typography/` is gone; `base/typography/` is gone. Layer order is
    `typography → base → composed/features`. Label inlines its size mapping
    so typography has zero dependency on `base/`.
55. **`@/components/ui/base/*` and `@/components/ui/typography*` aliases
    removed** — codemodded 306 files to canonical paths. Vite + tsconfig
    aliases collapsed to a single `@ → ./src` entry. The `ui/primitives/shadcn/`
    alias also removed; bare `@/components/ui/<primitive>` is now allowed
    only inside its dedicated base wrapper.
56. **Consumer-app folders purged** — `src/components/icons/` and
    `src/components/common/brand/` were consumer-specific (GCT branding).
    `ShopifyIcon` inlined into `shopify-button.tsx`; brand logos moved to
    `src/preview/_brand/` for showcase use only.
57. **Size-pinning fixes** — `TextButton`, `PageActionButton`, `Heading`
    sub-heading no longer pin sizes to inner components, so the
    `<UIProvider>` resolution chain reaches them.
58. **Dead provider slices wired** — `useFiltersConfig` now wires into
    `useAsyncOptions` (debounceMs + defaultPageSize). `useSpinnerConfig`
    wires into a now variant-aware `Spinner` (default / shimmer / progress).
59. **`features/metrics/` dead code purged** — the folder was a deprecation
    shim re-exporting from `composed/analytics`; the inline implementation
    files (change-indicator, stat-bar, stat-item, mini-sparkline,
    stat-item-skeleton, stat-item.types) had zero external consumers and
    were deleted.
60. **Strings rollout completed across remaining features** —
    `composed/ai/ai.strings.ts` (shared), `composed/navigation/time-ruler`,
    `composed/cards/vendor-profile`, `features/rich-text-editor`,
    `features/mentions` (single shared file for picker + inline-suggestions),
    `features/suggestions`, `features/sync`,
    `base/display/metadata/metadata-list`,
    `features/overlays` (consolidated `defaultOverlayStrings` +
    `defaultAlertDialogStrings`).
61. **Folder shape normalization** — `filter-types.ts` renamed to
    `filters.types.ts` (28 importers updated); `activities-feed-card.tsx`
    moved into `features/activities/partials/`; `event-log-event-row.tsx`
    moved into `features/event-log/partials/`.
62. **Layout preview pages registered** — five preview pages under
    `src/preview/pages/layout/` were on disk but missing from the registry.
    Added a `Layout` section to `PreviewEntry['section']` + `SECTION_ORDER`
    and registered all 5 pages.
63. **Showcase shell polish** — `bg-chart-1`/`bg-chart-2` (rule 6 violation
    — chart tokens are grayscale palette) replaced with `bg-warning`/
    `bg-success`. PreviewLayout dropped `!important` Heading overrides.
64. **Typography opacity sweep** — every `text-foreground/N` violation
    replaced with semantic tokens (`text-muted-foreground` / `text-foreground`
    / `text-destructive`).
65. **Companion sub-guides added** — split out as
    `references/{new-feature, strings-pattern, ui-provider, base-wrapper,
    preview-pages, consumer-wiring, import-paths, visual-eval}.md` so the
    main SKILL.md stays the rules contract while task-specific work pulls
    only the relevant guide.

Net effect: zero stale aliases, single canonical import path per destination,
every advertised provider slice has at least one consumer, every feature
follows the strings pattern, and the showcase covers all 6 sections (UI /
Base / Common / Composed / Features / Layout) without dead files.

What's still open (genuinely future work, not in scope today):
- Optional: `base/sheet/` and `base/sidebar/` wrappers if the layout package
  starts being reused elsewhere. Currently only `layout/` reaches into
  `ui/sheet` and `ui/sidebar` directly, which is acceptable given there's
  one consumer.
- Pre-publish chores: flip `private: true` off and bump `version` from
  `0.0.0` to a real number when the maintainer is ready to push the
  first npm release.

---

## Phase 15 — Build pipeline + publish verification (landed)

Goal: turn the architecturally-ready library into an installable npm
artifact.

Landed:
- **Vite library-mode config** at `vite.lib.config.ts`:
  - 50+ entrypoints mirroring `src/` so each
    `dist/components/<layer>/<name>/index.js` sits next to its
    `index.d.ts`.
  - `dependencies` and `peerDependencies` from `package.json` are
    externalised — React, recharts, lucide, leaflet, etc. resolve at
    consumer install time, never bundled in `dist/`.
  - Shared internal modules land in `dist/_shared/<name>-<hash>.js` so
    consumers importing two entrypoints share helper code.
- **`vite-plugin-dts`** emits matching `.d.ts` files (one per entry, not
  rolled up — the plugin's `rollupTypes` only supports a single entry)
  using `tsconfig.lib.json` (excludes `preview/`, `main.tsx`, `App.tsx`,
  `*.test.*`).
- **Tailwind v4 CLI** compiles `src/App.css` → `dist/style.css` (minified,
  ≈252 KB) so consumers get a pre-built stylesheet without needing the
  Vite plugin themselves.
- **`exports` map** in `package.json` rewritten to `dist/...` paths with
  `types`-first resolution per Node spec (TypeScript 4.7+ compatible).
- **`build:lib` script**: `rm -rf dist && vite build -c vite.lib.config.ts && tailwindcss …`.
- **`prepublishOnly: build:lib`** so `npm publish` always re-builds.
- **`files` allowlist** narrowed to `dist`, `src`, README/LICENSE/AGENTS
  docs.
- **Phase 11 verification**: ran `npm pack` (1.9 MB tarball, 8.2 MB
  unpacked, 2414 files) → installed into a scratch consumer at
  `/tmp/rsc-consumer` with `npm install <tarball> react@19 react-dom@19`.
  Then imported every layer through Node ESM:
  `admin-ui-starter-kit/base/item`, `…/base/badge`, `…/base/buttons`,
  `…/composed/cards`, `…/composed/navigation`, `…/composed/admin`,
  `…/composed/commerce`, `…/ui-provider`, `…/lib/strings` — every named
  export resolved as `function` or `object` (forwardRef components show
  as objects, that's correct). **All OK.**

Known notes for the maintainer:
- The root `import 'admin-ui-starter-kit'` namespace import pulls in
  every layer — including `base/map` which side-effect-imports leaflet
  CSS. In a real consumer (Vite/webpack/Next) the bundler handles CSS
  imports; under raw Node ESM smoke tests this fails. Real consumers
  are unaffected.
- The package is currently `private: true` so `npm publish` will fail.
  Flip the flag and bump `version` when ready.
- Heavy deps stay in `dependencies` (per maintainer call). If a future
  consumer wants opt-in tree-shaking for `recharts`/`@tiptap/*`/`leaflet`,
  move them to `peerDependenciesMeta` with `optional: true` later — the
  externalisation in `vite.lib.config.ts` already keeps them out of the
  bundle.

---

## Phase 14 — `base/item` adoption (landed)

Goal: collapse the dozen-or-so hand-rolled "icon-left + text-stack + actions"
row implementations onto a single shadcn-backed primitive so density,
typography, and focus rings stop drifting.

Landed in this phase:
- `npx shadcn add item` brought the primitive into `ui/item.tsx`.
  Per rule 1 it is not edited.
- New `base/item/` wrapper exporting `Item`, `ItemGroup`, `ItemSeparator`,
  `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`,
  `ItemHeader`, `ItemFooter`. The wrapper:
  - Resolves `size` and `variant` against `<UIProvider>` via the new
    `useItemConfig()` slice (`item.defaultSize` defaults to `'sm'`,
    `item.defaultVariant` defaults to `'default'`).
  - Routes `ItemTitle` through `<Text weight="semibold">` (toggleable via
    `bold={false}`) and `ItemDescription` through `<Text size="xs">` so the
    library typography rules (rule 3) hold automatically — no rogue
    `<div className="text-sm font-medium">` blobs at call sites.
  - Adds an `'avatar'` `ItemMedia` variant (rounded-full image slot) on top
    of the primitive's `default | icon | image`.
- `useItemConfig` hook + `ItemConfigSlice` type wired through the provider.
- New preview page `preview/pages/base/ItemPage.tsx` registered at
  `base/item` covering sizes, variants, media variants, separators,
  header/footer slots, and link rendering.

Migrated:
- `composed/admin/team-member` — was a manual flex row with `UserCell`
  inside; now `ItemGroup` + `Item` + `ItemMedia` + `ItemContent/ItemActions`.
- `composed/admin/conversation-row` — same.
- `composed/admin/settings-toggle` — same; the toggle moves into
  `ItemActions`, the icon swatch into `ItemMedia variant="icon"`.
- `composed/cards/contact-card` — the email/phone/location detail rows
  collapse to an `ItemGroup` (header + CTA stay bespoke).
- `composed/commerce/upcoming-booking` — `DateBlock` lives in `ItemMedia`,
  service/customer in `ItemContent`, time + amount in `ItemActions`.
- `composed/commerce/cart-summary` — line-item list collapsed to
  `ItemGroup`; thumbnail in `ItemMedia variant="image"`, qty/price in
  actions.
- `composed/commerce/discount-stack` — applied-discount rows.
- `composed/commerce/subscription-summary` — perks list (icon-medallion +
  label) collapsed to `ItemGroup`.
- `composed/commerce/voucher-entry` — applied-state row (success-tinted
  Item with check medallion + balance + remove icon).
- `composed/commerce/coupon-input` — applied-state row (same shape as
  voucher-entry).
- `composed/commerce/loyalty-points` — history rows (label/date in
  content, signed points in actions).
- `composed/cards/course-card` — the `minimal` variant only.
- `composed/cards/giftcard-card/partials/giftcard-illustrated` — the
  recipient/expires detail rows.
- `composed/cards/giftcard-card/partials/giftcard-compact` — full row
  collapsed to `Item` with image-tone media.
- `composed/data-display/invoice-items/InvoiceItemsCompact` — line-item
  list. Table and Detailed layouts stay as-is (table grid; multi-row
  detail block).
- `composed/dark-surfaces/dark-payment` — help row at the bottom
  (`Item variant="muted"` with a chevron action).
- `composed/cards/feature-announcement` — header (icon + title +
  description). Tags + action stay below as separate clusters.
- `composed/cards/vendor-profile` — identity row at the top of the card
  (avatar/initials + name + verified badge inline + role).
- `composed/admin/inventory-level` — top-row header (productName +
  variant in description + status badge in actions).
- `composed/cards/giftcard-card/partials/giftcard-dark` — header
  (gift icon + label + status badge).
- `composed/cards/giftcard-card/partials/giftcard-minimal` — same
  header.
- `composed/navigation/category-nav` — entire icon-row list with hint,
  count badge, and chevron.
- `composed/navigation/experience-activity` — top of each activity row
  (icon + title + time). The 2-col metric grid stays inside
  `ItemContent` as a structured slot below the description.
- `composed/dark-surfaces/order-items` — each line is now a vertical
  `Item variant="muted"` with an `ItemHeader` (vendor + badge) above the
  `ItemContent` + `ItemActions` row (name/qty/price). InlineStat summary
  rows below stay as-is.

What's deliberately NOT migrated:
- `base/display/{email,phone,url}-display` — these are inline text fields,
  not row-shaped, so they stay as `<Text>` wrappers.
- `composed/cards/gradient-card` — vivid gradient hero surface; the
  hero-value/alert/action layout has its own visual rhythm and isn't
  row-shaped.
- `composed/cards/giftcard-card/partials/giftcard-full` — large hero
  layout (gradient header + balance + code strip + 2-col metadata
  grid).
- `composed/commerce/payment-method` — credit-card mock surface.
- `composed/commerce/{shipment-tracking,refund-status,order-status}` —
  horizontal step ribbon + InlineStat detail block; not Item-shaped.
- `composed/commerce/tax-breakdown` — tight inline label-value rows that
  belong on `InlineStat`, not `Item`.
- `composed/commerce/address-card` — stacked text body, not row-shaped.
- `composed/admin/role-permission` — permissions render as inline pills.
- `composed/admin/inventory-level` — single stat card with hero number +
  progress bar.
- `composed/data-display/dense-info-card/*` — stat grids + InlineStat
  rows.
- `composed/timelines/steps-card` — vertical marker rail + connector line.
- `composed/charts/*` — stat cards and analytics surfaces.
- `composed/analytics/*` — metric / metric-gradient / metric-micro-grid
  hero surfaces.
- `composed/ai/{ai-summary,ai-classification,ai-feedback}` — summary
  blocks and inline voter widgets.
- `features/global-search/partials/global-search-result-row` — the row has
  bespoke right-value column + chevron + tone palettes; folding into Item
  would bend the API. Revisit when we redesign the search row layout.
- `features/activities/partials/activity-row` — has a marker rail +
  connector line; that's not Item-shaped.
- `features/comments/partials/*` — reaction chips (inline pills) and
  thread items (multi-zone replies + composer affordance) don't match
  Item.
- `features/filters/partials/filter-list-item` — already uses `CommandItem`
  inside the base/command menu; that's the right primitive layer.
- Form fields — shadcn explicitly says use `Field` for inputs, `Item` only
  for content rows.

Verified:
- `tsc --noEmit` clean after every migration.
- Preview pages `base/item`, `composed/admin`, `composed/cards-contact` all
  render with zero console warnings or errors.

Next adoption candidates (not in this phase):
- `composed/admin/inventory-level` — likely a row pattern.
- `composed/data-display/dense-info-card` rows — review for Item shape.
- `composed/timelines/*` non-marker rows.
- `features/comments` participant chips and reaction summaries.
- `composed/navigation/category-nav` and `tab-switcher` — review whether
  they qualify as Item-shaped or should stay bespoke.
