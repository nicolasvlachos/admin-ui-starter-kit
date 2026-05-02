# Phase A — Cross-Cutting Infrastructure (Design)

**Date:** 2026-04-29
**Scope:** Foundational conventions every other phase (B/C/D) consumes.

## Context

The library has ~80+ components across `ui/` (shadcn primitives), `base/`, `common/`,
and `composed/`. SmartCard already exists; ~31% of base and ~22% of composed components
have JSDoc headers; the `defaultStrings` + `strings` prop pattern exists in 4–5 well-formed
composed components but is not applied uniformly. Typography scaling vars are partly wired:
`--base-font-scale` exists, `--heading-font-scale` works on Heading, but Text, Label, and
TextLink do not consistently participate.

## Goals

1. Establish a single source-of-truth for component conventions.
2. Make UI text size globally scalable via CSS variables (no JS rerenders).
3. Define a typed, low-ceremony i18n-friendly strings pattern that components opt into.
4. Enforce the SmartCard wrapper rule (only `smart-card.tsx` imports shadcn `Card`).
5. Strip framework-specific coupling from primitives; accept it only at app integration points.
6. Codify API/naming conventions so subsequent phases don't reinvent them.

## Decisions

### A1. Component meta convention
Every exported component file MUST start with a JSDoc block following the SmartCard format:

```ts
/**
 * <ComponentName> — one-sentence purpose (em-dash separator).
 * Optional second sentence covering features, modes, or composition.
 * Optional adoption notes (e.g. "Use in place of X for Y reason").
 */
```

`displayName` is set on the exported component when it is a function expression that
React DevTools cannot infer. Conventions live in `src/components/CONVENTIONS.md`.

### A2. Strings / defaultStrings pattern
A new helper at `src/lib/strings.ts`:

```ts
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export function mergeStrings<T extends Record<string, unknown>>(defaults: T, override?: DeepPartial<T>): T;
export function useStrings<T extends Record<string, unknown>>(defaults: T, override?: DeepPartial<T>): T;
```

Adoption rule: any component with user-facing English text exports a typed
`<Component>Strings` interface, a `default<Component>Strings` const, accepts a
`strings?: Partial<...>` prop, and uses `mergeStrings` to resolve at render time.

This is the existing pattern from `contact-card`, `coupon-input`, `cart-summary`, and
`ai-prompt-suggestions` — formalised and made the default.

### A3. Typography scaling
Five CSS custom properties drive global typography scaling:

```
--base-font-scale: 1     (root font-size; existing)
--heading-font-scale: 1  (Heading; existing)
--text-font-scale: 1     (Text; new)
--label-font-scale: 1    (Label; new)
--link-font-scale: 1     (TextLink; new)
```

Each typography component carries `data-typography="<kind>"`. A pair of
`[data-typography="<kind>"]` rules sets `--typo-scale` to the kind-specific
knob, and the Tailwind `.text-*` utilities are re-declared as
`font-size: calc(<base> * var(--typo-scale, 1))` so the var lookup happens at
use-site.

Label and TextLink gain the missing `data-typography` markers. The naive
`font-size: calc(1em * var(--scale))` rule on `[data-typography]` cannot win —
verified empirically — because Tailwind text utilities override it (same
specificity, later in cascade) and `1em` would also incorrectly replace the
target size rather than multiplying it. The redeclared-utilities approach is
the only one that actually works without using `!important`.

Consumers can scope a scale to a region: `<div style={{ '--text-font-scale': 0.9 }}>`.

**Caveat:** Tailwind's `!text-X` (`!important`) variant bypasses the scaling
on purpose. Documented in `CONVENTIONS.md`.

### A4. SmartCard adoption rule
Codified in `CONVENTIONS.md`: only `src/components/base/cards/smart-card.tsx` may import
from `@/components/ui/card` (or its alias). Preview pages under `src/preview/pages/ui/*`
demonstrating the raw primitive are exempt — they exist to document the primitive itself.

Audit confirmed: no production violators. (Path aliases in tsconfig and vite.config map
`@/components/ui/primitives/shadcn/*` → `@/components/ui/*`, so SmartCard's imports work.)

### A5. Framework-coupled hooks
- `src/hooks/use-api.ts` — keep but make axios-optional via an injected HTTP client
  adapter; document Sanctum/Laravel as one supported backend, not the only one.
- `src/hooks/use-search-params.ts` — keep; it is already framework-agnostic
  (uses `window.history`, no router dependency). Add JSDoc clarifying.
- `src/hooks/use-suggestions-query.ts` and `use-suggestions-query-adapter.ts` — flag as
  app-integration (depend on a `services/api/suggestions` path that lives outside the
  library). Move out of `hooks/` is a Phase B/C task; documented here as known debt.
- `react-hook-form` field components in `src/components/base/forms/fields/` — keep, but
  treat as **opt-in** (a component MUST NOT import RHF unless it lives in this folder).

### A6. API unification rules
Documented in `src/components/CONVENTIONS.md`:
- Slot props: `<position><role>` (e.g. `headerStart`, `headerEnd`, `contentTop`).
- Sizes: `xxs | xs | sm | base | lg | xl`. `base` (not `md`) is the default.
- Variants colour-tokens: `default | primary | secondary | success | warning | destructive`.
- Padding/density: `sm | base | lg`.
- Strings: `strings?: Partial<<Component>Strings>` (see A2).
- Class overrides: `className`, `<slot>ClassName` for additional surfaces.
- Action lists: `actions?: { id?, label, onClick, icon?, disabled? }[]`.
- Disabled: `disabled` (boolean). Loading: `isLoading` (boolean).

## Non-goals (Phase A)

- Visual / aesthetic redesign of any component (Phase B/C).
- Adding new components (Phase B/C/D).
- Migrating every existing component to the strings pattern — only the helper + rule
  + reference-converted components in this phase. Bulk migration happens during the
  per-component pass in Phase B/C.
- Removing RHF entirely — kept as opt-in.

## Deliverables

1. `src/lib/strings.ts` — `mergeStrings`, `useStrings`, types.
2. `src/components/base/typography/label.tsx` — gains `data-typography="label"`.
3. `src/components/base/typography/text-link.tsx` — gains `data-typography="link"`.
4. `src/App.css` — adds `--text-font-scale`, `--label-font-scale`, `--link-font-scale`
   defaults and four `[data-typography="..."]` rules.
5. `src/hooks/use-api.ts` — refactored to accept an optional HTTP client.
6. `src/hooks/use-search-params.ts` — JSDoc + minor cleanup.
7. `src/components/CONVENTIONS.md` — new file documenting A1, A4, A6.
8. `src/components/base/typography/text.tsx` — confirms `data-typography="text"` is set
   on every render path, JSDoc updated to mention the scale var.
9. JSDoc headers added to top-traffic files that lack them
   (`label.tsx`, `text-link.tsx`, plus typography helpers).

## Verification

- `tsc -b` passes with no new errors.
- `npm run lint` shows no new warnings.
- Manual: `<div style={{ '--text-font-scale': 0.85 }}>` visibly shrinks Text but not
  Heading; `--base-font-scale: 0.9` shrinks the document baseline.
- Static check: grep for `from '@/components/ui/card'` outside SmartCard and preview —
  zero hits.
