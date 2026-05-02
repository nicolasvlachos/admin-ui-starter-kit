# UIProvider — adding/wiring slices

Open this when adding a slice to `<UIProvider>` or wiring an existing slice into a component.

## What lives here

`@/lib/ui-provider` holds **library-wide display defaults** consumers set once at the React root:

- `money.defaultCurrency`, `money.locale`, `money.formatMode`, `money.dualPricingEnabled`, …
- `dates.weekStartsOn`, `dates.format`, `dates.formatRelativeTime`
- `comments.composerPosition`, `comments.maxAttachments`, `comments.allowReactions`
- `filters.debounceMs`, `filters.defaultPageSize`
- `forms.defaultControlSize`, `forms.defaultLabelSize`
- `table.defaultSize`
- `typography.defaultTextSize`
- `badge.defaultSize`
- `button.defaultSize`, `button.defaultButtonStyle`
- `card.defaultPadding`
- `toast.duration`, `toast.position`
- `spinner.defaultVariant`
- `media.resolveUrl`, `media.resolveName`

## What does NOT belong here

- ❌ Per-mount runtime callbacks (`onSubmit`, `onDelete`, `onChange`, `onResultSelect`, `fetcher`, `onUpload`). These flow as direct props.
- ❌ Per-mount data (comment lists, mention resource registries used by one specific surface).
- ❌ User-facing strings — use the `strings={{ … }}` prop pattern instead.

## The resolution rule (universal)

Components read with this precedence:

```ts
const resolved = props.X ?? useFooConfig().X ?? hardcodedFallback;
```

The store is initialized with `DEFAULT_UI_CONFIG`, so a component without `<UIProvider>` mounted still works. A consumer overriding at the root means every mount inherits; a per-mount prop override always wins.

### Worked example

```tsx
import { useBadgeConfig, type BadgeSize } from '@/lib/ui-provider';

export function Badge({ size: sizeProp, … }: BadgeProps) {
    const { defaultSize } = useBadgeConfig();
    const size: BadgeSize = sizeProp ?? defaultSize ?? 'xs';
    /* … */
}
```

## Adding a new slice — checklist

1. **Type** — append to `src/lib/ui-provider/types.ts`:
   ```ts
   export interface FooConfig {
       defaultBar?: 'a' | 'b' | 'c';
   }
   // and add to UIConfig + ResolvedUIConfig:
   export interface UIConfig { /* … */ foo?: FooConfig; }
   ```
2. **Default** — append to `src/lib/ui-provider/defaults.ts`:
   ```ts
   export const DEFAULT_UI_CONFIG: ResolvedUIConfig = {
       /* … */
       foo: { defaultBar: 'a' },
   };
   ```
3. **Hook** — append to `src/lib/ui-provider/hooks.ts`:
   ```ts
   export const useFooConfig = (): FooConfig => useUIStore((s) => s.foo);
   ```
4. **Re-export** — append to `src/lib/ui-provider/index.ts` (types + hook).
5. **Consumer** — wire at least one component to read it via the resolution rule (see "No dead slices" below).

## No dead slices

A slice with zero consumers is a **smell**. Either wire it, or drop it. Future contributors trust the slice list as advertised; dead slices teach them the wrong shape.

When you add a slice, add a consumer in the **same change**. If you can't justify a consumer, don't add the slice yet.

## Wrapper size-pinning is forbidden

When a wrapper composes another size-aware base component, **forward** the size, don't pin a literal:

```tsx
// ❌ Pinning blocks the resolution chain — the consumer's
//    <UIProvider button={{ defaultSize: 'sm' }}> never reaches BaseButton.
<BaseButton size="xs" {...props} />

// ✅ Forward the resolved size; BaseButton applies its own resolution.
const resolvedSize = sizeProp ?? 'xs';
<BaseButton size={resolvedSize} {...props} />
```

If the wrapper genuinely needs a narrower size space (e.g. `'xs' | 'sm' | 'base'`), declare its own `size` prop in that narrower type and **map** it to the inner component's size space. Still forward.

## Slice-scoped subscriptions

The store uses zustand with slice selectors. Components reading `money` do **not** re-render when `dates` changes. Don't read the whole store with `useUIStore((s) => s)` — always grab a slice via the dedicated hook.

## Verifying

After wiring, confirm the resolution chain end-to-end:

```tsx
// In a temporary preview:
<UIProvider config={{ foo: { defaultBar: 'b' } }}>
    <YourComponent />        {/* should pick up 'b' */}
    <YourComponent bar="c" /> {/* should pick up 'c' (per-mount wins) */}
</UIProvider>
```

Without the `<UIProvider>` wrapper at all, the component should still fall back to the library default.

## Reference implementations

- [`base/badge/badge.tsx`](../../../../../src/components/base/badge/badge.tsx) — `useBadgeConfig` consumed straightforwardly
- [`base/buttons/base-button.tsx`](../../../../../src/components/base/buttons/base-button.tsx) — chain for both `defaultSize` and `defaultButtonStyle`
- [`features/filters/hooks/use-async-options.ts`](../../../../../src/components/features/filters/hooks/use-async-options.ts) — chain inside a hook (`useFiltersConfig` for `debounceMs` and `defaultPageSize`)
- [`features/loaders/spinner.tsx`](../../../../../src/components/features/loaders/spinner.tsx) — chain for variant selection
