# Component Conventions

This document is the contract every component in `src/components/` follows. New
components MUST conform; existing ones are migrated as they are touched.

The conventions exist so consumers can predict any component's API after seeing
two or three. Phase A established them; Phase B/C/D apply them everywhere.

---

## 1. Meta header (JSDoc)

Every exported component file starts with a JSDoc header:

```ts
/**
 * <ComponentName> — one-sentence purpose (em-dash separator).
 * Optional second sentence covering features, modes, or composition.
 * Optional adoption note ("Use in place of X for Y reason").
 */
```

Set `displayName` on function components React DevTools cannot infer (e.g. when
the component is assigned to a `const` or wrapped). Example:

```ts
ContactCard.displayName = 'ContactCard';
```

---

## 2. Strings (i18n-friendly defaults)

Components with user-facing English text follow the strings pattern:

```ts
// types.ts
export interface FooStrings { title: string; cta: string; }
export const defaultFooStrings: FooStrings = { title: 'Foo', cta: 'Go' };

export interface FooProps {
  // ...
  strings?: Partial<FooStrings>;
}

// foo.tsx
import { useStrings } from '@/lib/strings';
import { defaultFooStrings, type FooProps } from './types';

export function Foo({ strings: stringsProp, ...rest }: FooProps) {
  const strings = useStrings(defaultFooStrings, stringsProp);
  return <button>{strings.cta}</button>;
}
```

Use `useStrings` (memoised) inside components; reach for the bare `mergeStrings`
helper in lower-level utilities or render-once contexts.

Nested overrides merge one level deep — `{ status: { active: 'Live' } }` only
replaces that one key.

---

## 3. Typography scaling

Five CSS custom properties scale typography globally; consumers can scope a
scale to any subtree by setting the var inline.

```
--base-font-scale     // root font-size multiplier (16px baseline)
--heading-font-scale  // Heading
--text-font-scale     // Text
--label-font-scale    // Label
--link-font-scale     // TextLink
```

Each typography component carries `data-typography="<kind>"`. New typography
primitives MUST add a matching `data-typography` attribute and a CSS rule in
`App.css`.

Example: a denser dashboard surface

```tsx
<div style={{ '--text-font-scale': 0.9, '--label-font-scale': 0.85 } as React.CSSProperties}>
  ...
</div>
```

**Mechanism.** The Tailwind `.text-xs/.text-sm/.text-base/...` utilities are
re-declared in `App.css` as `font-size: calc(<base> * var(--typo-scale, 1))`.
`[data-typography="<kind>"]` rules set `--typo-scale` to the kind-specific
knob, so scaling propagates lazily through the cascade.

**Caveat — `!text-X` opt-out.** Components using Tailwind's `!important`
modifier (`!text-2xl`, `!text-base`) bypass the scaling. That is intentional —
it lets a consumer pin a size when needed — but means `!text-X` should be
reserved for true escape hatches, not used as a default. Phase B/C will sweep
gratuitous `!text-X` usage out of base and composed components.

---

## 4. Card primitive rule

`SmartCard` is the single card primitive. Only `src/components/base/cards/smart-card.tsx`
imports the underlying shadcn `Card` parts (currently aliased through
`@/components/ui/primitives/shadcn/card`).

**Allowed exception:** `src/preview/pages/ui/UiCardPage.tsx` and other preview
pages that exist to demonstrate the raw primitive itself. Production components
never reach past SmartCard.

If you need card-shaped chrome that SmartCard does not yet expose, extend
SmartCard rather than introducing a parallel wrapper.

---

## 5. API unification

### 5.1 Sizes
`xxs | xs | sm | base | lg | xl`. **`base`** (not `md`) is the default everywhere.

### 5.2 Variants (semantic colour tokens)
`default | primary | secondary | success | warning | destructive` (some
components add `info` or `error` aliases; prefer the names above for new work).

### 5.3 Padding / density
`sm | base | lg`. Default `base`.

### 5.4 Slot props (positional content)
`<position><role>` — `headerStart`, `headerEnd`, `headerAction`, `contentTop`,
`contentBottom`, `footerText`. Slots accept `ReactNode | undefined`.

### 5.5 Class overrides
- `className` — applied to the root surface.
- `<slot>ClassName` — applied to a named slot (e.g. `headerClassName`,
  `contentClassName`, `footerClassName`).

Never accept arbitrary `style` overrides for typography; use the scale vars.

### 5.6 Action lists
```ts
type Action = {
  id?: string;       // stable React key when label can repeat
  label: string;     // visible text
  onClick: () => void;
  icon?: ReactNode;  // 16px lucide icon
  disabled?: boolean;
};
```

### 5.7 State props
- `disabled?: boolean` — interactive disabled.
- `isLoading?: boolean` — loading spinner / skeleton.
- `invalid?: boolean` — error state for inputs.

### 5.8 Event handler naming
`on<Event>` — `onClick`, `onApply`, `onRemove`, `onView`. No `handleX`.

### 5.9 Naming
Files kebab-case (`contact-card.tsx`). Exported components PascalCase. Types
suffixed with `Props`, `Strings`, `Variant`.

---

## 6. Framework coupling

The `base/` and `composed/` layers are framework-agnostic.

- Allowed: React, lucide-react icons, Radix/shadcn primitives, RHF (only inside
  `base/forms/fields/*` and only behind opt-in field wrappers).
- Disallowed: Inertia, Next router, react-router, Ziggy `route()`, direct
  `axios` imports outside `src/hooks/use-api.ts`.

`use-api` accepts an HTTP client adapter; consumers wire axios at the app
boundary and pass it in. App-specific service hooks (e.g. suggestions) live in
the consuming app, not in this library.

---

## 7. File layout

```
component-name/
  index.ts          // re-exports
  types.ts          // Props, Strings, defaults, variants
  component-name.tsx
  partials/         // optional sub-components
```

Single-file components are fine for primitives (`badge.tsx`, `label.tsx`).
Anything that needs a `Strings` interface or partials gets a folder.
