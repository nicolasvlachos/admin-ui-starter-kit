# Wrapping a shadcn primitive in `base/`

Open this when adding a new wrapper around an `@/components/ui/<primitive>` shadcn component.

## When to wrap

Wrap a shadcn primitive in `base/` when **any** of these are true:

- It's used in 2+ places (existing or imminent).
- The library wants to apply consistent design defaults (typography from `Text`, density tokens, semantic colors, focus-visible ring).
- The shadcn primitive doesn't expose a prop you want consumers to control via `<UIProvider>`.
- You'd otherwise inline class blobs at the call site.

When in doubt: wrap. The cost is one tiny file; the upside is centralized control.

## API contract

A wrapper:

1. Lives at `src/components/base/<name>/<name>.tsx`.
2. Imports the shadcn primitive only at the wrapper file (no other layer touches `@/components/ui/<primitive>` directly).
3. Accepts the primitive's props by spread; doesn't narrow them unnecessarily.
4. Applies design-system defaults: `Text`/`Heading` for typography, density tokens, focus-visible ring, semantic color tokens.
5. Re-exports the primitive's child parts (`PopoverTrigger`, `CommandList`, …) untouched so the shadcn compound-component pattern keeps working.
6. Documents in a header block: which primitive, what defaults are applied, when a consumer would override.
7. Reads from `<UIProvider>` slices when relevant (size, padding, density, …) — see [`ui-provider.md`](ui-provider.md).
8. Has a barrel `index.ts` that re-exports the wrapper + child parts.

## Pattern — wrap the root

For most primitives the smallest viable wrapper is "wrap the root, re-export the rest":

```tsx
// src/components/base/popover/popover.tsx
import {
    Popover as PrimitivePopover,
    PopoverContent as PrimitivePopoverContent,
    PopoverTrigger,
    PopoverAnchor,
    PopoverArrow,
    PopoverClose,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/**
 * Popover — base wrapper for the shadcn primitive.
 *
 * Defaults applied: density-tokenized padding (`--popover-content-pad`),
 * library-default `sideOffset`, `text-[length:var(--text-xs)]`. Consumers
 * override via `className`. Compound parts re-exported untouched.
 */
export const Popover = PrimitivePopover;

export function PopoverContent({
    className,
    sideOffset = 6,
    ...props
}: React.ComponentProps<typeof PrimitivePopoverContent>) {
    return (
        <PrimitivePopoverContent
            sideOffset={sideOffset}
            className={cn(
                'p-[var(--popover-content-pad)] text-[length:var(--text-xs)]',
                className,
            )}
            {...props}
        />
    );
}

export { PopoverTrigger, PopoverAnchor, PopoverArrow, PopoverClose };
```

```ts
// src/components/base/popover/index.ts
export * from './popover';
```

## Variants

Expose a `variant` prop **only** when the variation is real and used today. Don't pre-build variants nobody asked for. When you do, drive variants through a single `cn()` lookup table — not branching `if`/`else` in the JSX.

## Consuming a `<UIProvider>` slice

If the wrapper has size/density/style defaults that consumers want to set globally:

```tsx
import { useFooConfig } from '@/lib/ui-provider';

export function Foo({ size: sizeProp, …rest }) {
    const { defaultSize } = useFooConfig();
    const size = sizeProp ?? defaultSize ?? 'sm';
    /* … */
}
```

Don't pin `size` literally inside the wrapper when you compose another base component. Forward it. See [`ui-provider.md`](ui-provider.md) "Wrapper size-pinning is forbidden".

## Existing wrappers — DO NOT recreate

Before adding a new wrapper, check if one exists:

| Wrapper | Wraps |
| --- | --- |
| `base/badge/` | `ui/badge` |
| `base/buttons/` | `ui/button` |
| `base/cards/` (SmartCard) | `ui/card` |
| `base/combobox/` | `ui/combobox` |
| `base/command/` | `ui/command` |
| `base/popover/` | `ui/popover` |
| `base/popover-menu/` | `popover` + `command` |
| `base/navigation/` | `ui/dropdown-menu`, `ui/breadcrumb`, segmented `ui/tabs`, `ui/sidebar` |
| `base/forms/` | `ui/input`, `ui/select`, `ui/textarea`, `ui/checkbox`, `ui/switch`, `ui/radio-group`, `ui/slider` |
| `base/date-pickers/` | `ui/calendar` |
| `base/toaster/` | `ui/sonner` |
| `base/display/` (namespace) | `ui/avatar`, `ui/tooltip`, `ui/separator`, `ui/scroll-area`, `ui/skeleton` |
| `base/table/` | `ui/table` |
| `base/event-calendar/` | `ui/calendar` (richer compositions) |
| `base/map/` | `ui/map` |

Currently NOT wrapped (consider adding when you encounter inlined usage in 2+ places):
- `ui/sheet` — only `layout/sidebar` reaches into it
- `ui/sidebar` — only `layout/sidebar` reaches into it
- `ui/hover-card`, `ui/context-menu`, `ui/collapsible` — only used by other wrappers internally

## Don'ts

- ❌ Edit `src/components/ui/<primitive>.tsx` directly — that's shadcn-managed; the next upgrade overwrites your work.
- ❌ Import from `@/components/ui/<primitive>` outside its dedicated wrapper.
- ❌ Add a wrapper "just in case" — wait until 2+ consumers exist or a real design rule justifies it.
- ❌ Narrow the wrapped primitive's props. Spread the rest.
- ❌ Forget to re-export the compound-component parts (`Trigger`, `Content`, etc.).
