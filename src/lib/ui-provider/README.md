# `@/lib/ui-provider`

Single source of library-wide display defaults for `admin-ui-starter-kit`.

One zustand store, one `<UIProvider>`, slice-scoped selector hooks. No
nested providers, no framework integrations, no mid-tree mutation.

---

## Why this exists

The library is framework-agnostic by contract: routing, i18n, and data
fetching all flow through callbacks at the call site. But there is a small
set of values consumers want to set **once at the app root and never
repeat** — default currency, week-start, default badge size, default
table density, etc. Putting those in props at every call site is noise;
putting them in feature-specific contexts (`<MoneyProvider>`,
`<TableProvider>`, …) is provider-ladder hell.

`<UIProvider>` is the one provider. Slice hooks (`useMoneyConfig`,
`useDatesConfig`, …) read what each component needs. Slice-scoped
re-renders mean a component that reads `money` doesn't re-render when
`dates` changes.

---

## Quick start

```tsx
// app root (App.tsx, main.tsx, root layout, …)
import { UIProvider } from '@/lib/ui-provider';

export default function App() {
    return (
        <UIProvider
            config={{
                money: { defaultCurrency: 'EUR', locale: 'en-GB' },
                dates: { weekStartsOn: 1 },
                typography: { defaultTextSize: 'sm' },
                badge: { defaultSize: 'xs' },
                button: { defaultSize: 'sm', defaultButtonStyle: 'solid' },
                forms: { defaultControlSize: 'sm', defaultLabelSize: 'sm' },
                card: { defaultPadding: 'sm' },
            }}
        >
            <YourApp />
        </UIProvider>
    );
}
```

That's it. Every `<Money>`, `<Text>`, `<Badge>`, `<Button>`, `<Input>`,
`<Select>`, `<Textarea>`, `<Combobox>`, `<DatePicker>`, `<DataTable>`,
`<SmartCard>`, etc. inside the tree picks up these defaults automatically.
Per-mount props always override the store value.

---

## Resolution rule

The contract every consuming component follows:

```ts
const resolved = props.X  ??  useFooConfig().X  ??  hardcodedFallback;
```

So:

```tsx
// Without UIProvider mounted: uses the library's hardcoded defaults.
<Text>Title</Text>                   // size = 'sm' (built-in default)
<Badge>New</Badge>                   // size = 'xs' (built-in default)
<Button>Save</Button>                // size = 'sm', style = 'solid'
<Input />                            // size = 'sm' (built-in default)
<Label>Email</Label>                 // size = 'sm' (built-in default)

// With UIProvider config={{ typography: { defaultTextSize: 'xs' }, badge: { defaultSize: 'sm' }, button: { defaultSize: 'xs' }, forms: { defaultControlSize: 'base', defaultLabelSize: 'xs' } }}:
<Text>Title</Text>                   // size = 'xs' (propagated from store)
<Badge>New</Badge>                   // size = 'sm' (propagated from store)
<Button>Save</Button>                // size = 'xs' (propagated from store)
<Input />                            // size = 'base' (propagated from store)
<Label>Email</Label>                 // size = 'xs' (propagated from store)
<Badge size="md">Important</Badge>   // size = 'md' (prop wins)
<Button size="lg">Continue</Button>  // size = 'lg' (prop wins)
<Input size="lg" />                  // size = 'lg' (prop wins)
```

The store is initialised with the full default config baked in, so
components work correctly even when no `<UIProvider>` is mounted at all.

---

## What goes in the store — and what does NOT

### YES — purely display defaults
- `money.defaultCurrency`, `money.locale`, `money.formatMode`, …
- `dates.weekStartsOn`, `dates.format`, `dates.formatRelativeTime`
- `comments.composerPosition`, `comments.maxAttachments`, …
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

### NO — these stay as direct props at the call site
- **Per-mount runtime callbacks** — `onSubmit`, `onDelete`, `onChange`,
  `onResultSelect`, `fetcher`, `onUpload`, etc. These are
  framework-coupled and per-instance.
- **Per-mount data** — comment lists, mention resource registries used
  by one specific surface, anything that varies between mounts.
- **User-facing strings** — use the `strings={{}}` prop pattern. The
  library has no concept of locales or translators.

If you find yourself wanting to pass a callback "once at the root,"
that's a signal you actually want to wrap the library component in
your own consumer-side component (`<MyAppComments>`) that forwards your
defaults — this library does not provide that wrapper.

---

## Public API

### `<UIProvider config={…}>`

Mount-once boundary. Reads `config` on first mount and locks the store.
Subsequent prop changes are **ignored** — in dev mode, a console
warning explains why.

```tsx
<UIProvider
    config={{
        money: { defaultCurrency: 'USD' },
        comments: { composerPosition: 'bottom', maxAttachments: 3 },
    }}
>
    {children}
</UIProvider>
```

| Prop | Type | Description |
|---|---|---|
| `config?` | `DeepPartial<UIConfig>` | Override tree merged over `DEFAULT_UI_CONFIG`. Optional — omit it and the store keeps the built-in defaults. |
| `children` | `ReactNode` | The tree. |

### Slice selector hooks

Each hook returns a guaranteed-populated slice (the store ships with all
defaults baked in), so component code can use destructuring without
optional-access chains.

```tsx
import {
    useMoneyConfig,
    useDatesConfig,
    useCommentsConfig,
    useFiltersConfig,
    useFormsConfig,
    useTableConfig,
    useBadgeConfig,
    useButtonConfig,
    useCardConfig,
    useToastConfig,
    useSpinnerConfig,
    useMediaConfig,
} from '@/lib/ui-provider';

function MyComponent({ currency: currencyProp }: Props) {
    const { defaultCurrency } = useMoneyConfig();
    const currency = currencyProp ?? defaultCurrency;
    // …
}
```

Each hook subscribes only to its slice. A component reading `money`
will not re-render when `dates` changes.

### `getUIConfig()`

Read-only snapshot of the current resolved config. Useful for tests,
debug panels, and one-off lookups outside React.

```ts
import { getUIConfig } from '@/lib/ui-provider';

const { money, dates } = getUIConfig();
console.log(money.defaultCurrency);
```

### `DEFAULT_UI_CONFIG`

The hardcoded library defaults — exported so you can inspect, snapshot
in tests, or build per-call overrides on top of them.

```ts
import { DEFAULT_UI_CONFIG } from '@/lib/ui-provider';

// E.g. test: assert a slice still has its expected default.
expect(DEFAULT_UI_CONFIG.dates.weekStartsOn).toBe(1);
```

### Types

```ts
import type {
    UIConfig,
    ResolvedUIConfig,
    MoneyConfig,
    DatesConfig,
    CommentsConfig,
    FiltersConfig,
    FormsConfigSlice,
    TableConfig,
    TypographyConfigSlice,
    BadgeConfigSlice,
    ButtonConfigSlice,
    CardConfigSlice,
    ToastConfig,
    SpinnerConfigSlice,
    MediaConfig,
    WeekDay,
    TableSize,
    TextSize,
    CardPadding,
    BadgeSize,
    FormControlSize,
    FormLabelSize,
    ButtonStyle,
    ButtonSize,
    ToastPosition,
    MoneyFormatMode,
    MoneyDisplayMode,
    MoneyDualLayout,
} from '@/lib/ui-provider';
```

---

## Mount-once contract

The store is **set once at app boot and locked**. Descendant components
read via selectors and cannot mutate the config.

The reasoning:
- Library-wide defaults are not the kind of state that benefits from
  runtime toggles. A typical change ("switch the entire app from EUR to
  USD at 14:32:08") is so disruptive that reloading the surface is
  cleaner than mid-render-mutating every consumer simultaneously.
- Zustand's `setState` notifies every subscriber synchronously, so
  arbitrary-time mutation would risk "Cannot update a component while
  rendering a different component" violations.
- It collapses the mental model: defaults exist before anything else
  runs and never change. Consumers don't need to reason about staleness.

The public surface enforces this:
- No `setUIConfig`, no `resetUIConfig`, no `useUIStore` exported from
  the barrel. Nothing reachable from inside the React tree can write to
  the store.
- `<UIProvider>` ignores `config` prop changes after first mount and
  warns in dev. The first render's snapshot is the final config.

If your app has multiple roots that genuinely need different configs
(rare), mount one `<UIProvider>` per root with its own `config` and
they will not see each other since the store is module-scoped — but
in 99% of cases, one provider at the topmost root is correct.

---

## SSR & tests — the documented escape hatch

`<UIProvider>` applies its config in `useLayoutEffect`, which is a no-op
on the server. SSR consumers that want overrides reflected in
server-rendered HTML should call the internal `applyUIConfig` once at
module load, before the React tree mounts:

```ts
// server entry, before ReactDOM.renderToString(...)
import { applyUIConfig } from '@/lib/ui-provider/store';

applyUIConfig({
    money: { defaultCurrency: 'EUR' },
    dates: { weekStartsOn: 1 },
});

// then render
```

Test setup follows the same pattern, with `resetUIConfig` for isolation:

```ts
// test setup
import { applyUIConfig, resetUIConfig } from '@/lib/ui-provider/store';

afterEach(() => {
    resetUIConfig();
});

test('something money-related', () => {
    applyUIConfig({ money: { defaultCurrency: 'GBP' } });
    // …
});
```

These imports are intentionally **not** part of the public barrel. They
exist for boot/test code that runs outside the React tree. **Never call
them from a component or a render path.**

---

## Adding a new slice

When a new component has a default that consumers might want to override
once at the root:

1. **Add the slice type** to [`types.ts`](./types.ts):
   ```ts
   export interface AvatarConfigSlice {
       defaultSize?: 'xs' | 'sm' | 'md' | 'lg';
   }

   export interface UIConfig {
       // …
       avatar?: AvatarConfigSlice;
   }
   ```

2. **Add the hardcoded library default** to [`defaults.ts`](./defaults.ts):
   ```ts
   export const DEFAULT_UI_CONFIG: ResolvedUIConfig = {
       // …
       avatar: { defaultSize: 'sm' },
   };
   ```

3. **Add the selector hook** to [`hooks.ts`](./hooks.ts):
   ```ts
   export const useAvatarConfig = (): AvatarConfigSlice =>
       useUIStore((s) => s.avatar);
   ```

4. **Re-export** from [`index.ts`](./index.ts):
   ```ts
   export { /* … */ useAvatarConfig } from './hooks';
   export type { /* … */ AvatarConfigSlice } from './types';
   ```

5. **Use the hook** inside the component, applying the resolution rule:
   ```tsx
   function Avatar({ size: sizeProp, ...rest }: AvatarProps) {
       const { defaultSize } = useAvatarConfig();
       const size = sizeProp ?? defaultSize ?? 'sm';
       // …
   }
   ```

6. **Verify** that no `<UIProvider>` is required for the component to
   work — the hardcoded fallback inside the component must keep it
   functional even with the store empty.

---

## Folder layout

```
src/lib/ui-provider/
├── README.md          ← you are here
├── index.ts           ← public barrel (read-only API)
├── types.ts           ← UIConfig + slice types
├── defaults.ts        ← DEFAULT_UI_CONFIG (hardcoded library defaults)
├── store.ts           ← zustand store + internal applyUIConfig / resetUIConfig
├── provider.tsx       ← <UIProvider> mount-once boundary
└── hooks.ts           ← slice selector hooks
```

---

## Anti-patterns — don't do these

- ❌ `import { setUIConfig } from '@/lib/ui-provider'` — not exported, by design.
- ❌ Reaching into `./store` from inside a component to call `applyUIConfig` — that's the SSR/test escape hatch, not a runtime toggle.
- ❌ Putting `onSubmit` / `onDelete` / `fetcher` callbacks in `<UIProvider config>` — those are per-mount, pass them as props.
- ❌ Putting comment lists / mention registries / table data in `<UIProvider config>` — same reason.
- ❌ Putting user-facing strings in `<UIProvider config>` — use the `strings={{}}` prop pattern on each component.
- ❌ Mounting two `<UIProvider>` siblings hoping the inner overrides the outer — the store is module-scoped, last-applied wins; co-locate config at the root instead.
- ❌ Toggling the `config` prop after mount based on user interaction — the warning fires, the change is ignored, and the design intent is being fought.
