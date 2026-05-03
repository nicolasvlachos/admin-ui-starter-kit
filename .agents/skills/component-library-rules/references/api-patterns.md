# API patterns — how to pass things down

A condensed cheat-sheet for the data-flow patterns in this library.
Use these when designing a new component's prop surface so it stays
consistent with everything else.

## The 8 prop categories — and where they live

| Category | Example props | Lives in | Resolution |
| --- | --- | --- | --- |
| Identity | `id`, `name`, `aria-label` | direct prop | passthrough |
| Data | `items`, `value`, `users`, `events` | direct prop | passthrough |
| Per-mount config | `size`, `variant`, `padding`, `tone` | direct prop OR `<UIProvider>` slice | `props.X ?? useFooConfig().X ?? fallback` |
| Display defaults (global) | `defaultCurrency`, `weekStartsOn`, `defaultBadgeSize` | `<UIProvider>` slice | `useFooConfig().X` |
| Strings | `strings` | direct prop | `useStrings(defaults, prop)` deep-merge |
| Callbacks | `onSubmit`, `onSelect`, `onChange`, `onError` | direct prop | called inline |
| Slots | `headerSlot`, `footerSlot`, `composerSlot`, `empty` | direct prop (`ReactNode`) | rendered when truthy |
| Render-props | `renderResult`, `renderItem`, `renderTrigger` | direct prop (function) | called per-item |

If you're tempted to put a callback / data / per-mount config in a
provider slice, **stop** — those go on the component. The provider
holds *only* values consumers set once at the app root.

## Strings — the "how to localize" flow

```ts
// 1. types.ts — declare the shape
export interface FooStrings {
    title: string;
    cancel: string;
    confirm: string;
}

// 2. strings.ts — declare defaults
import type { FooStrings } from './types';
export const defaultFooStrings: FooStrings = {
    title: 'Foo',
    cancel: 'Cancel',
    confirm: 'Confirm',
};

// 3. component — accept + merge
import { useStrings, type StringsProp } from '@/lib/strings';

interface FooProps {
    strings?: StringsProp<FooStrings>;
}

export function Foo({ strings: stringsProp }: FooProps) {
    const strings = useStrings(defaultFooStrings, stringsProp);
    return <button>{strings.confirm}</button>;
}
```

**Rules of thumb:**
- Always `StringsProp<T>`, never `Partial<T>` — `StringsProp` is
  `DeepPartial<T>` so consumers can override one nested key without
  re-supplying the whole object.
- Always `useStrings(defaults, prop)`, never `{ ...defaults,
  ...override }` shallow merge.
- One `*.strings.ts` per feature — if the feature has multiple
  string interfaces (`MentionPickerStrings` +
  `MentionInlineSuggestionsStrings`), put them in the same file.
- Strings interfaces are flat by default; nest only when the keys
  belong to a sub-area (e.g. `composer.{placeholder, send}`).
- For interpolation, the canonical helper is `interpolateString` —
  see `features/global-search/global-search.strings.ts`. Pattern:
  `'{count} of {total}'` → `interpolate(template, { count, total })`.

For the deep-merge mechanics see [`strings-pattern.md`](./strings-pattern.md).

## Callbacks — the canonical names

Use these names exactly. Don't invent variants.

| Event | Callback name | Signature pattern |
| --- | --- | --- |
| User submitted a form | `onSubmit` | `(values, helpers?) => void \| Promise<void>` |
| User picked an option | `onSelect` | `(value, item?) => void` |
| Controlled value changed | `onValueChange` | `(value) => void` |
| Generic field change | `onChange` | `(value) => void` |
| User opened a panel / popover | `onOpen` | `() => void` |
| User closed a panel / popover | `onClose` | `() => void` |
| Open-state change (controlled) | `onOpenChange` | `(open: boolean) => void` |
| User triggered delete | `onDelete` | `(id, item?) => void` |
| Bulk action | `onBulkDelete` / `onBulkX` | `(ids: string[]) => void` |
| Drag/move ended | `onItemMove` / `onMove` | `(event: { from, to, item }) => void` |
| After server-side mutation succeeds | `onAfterMutate` | `(kind, payload) => void` |
| Error bubbled from async work | `onError` | `(err: unknown) => void` |
| Analytics breadcrumb | `onStepOpen` / `onItemView` / `onResultSelect` | `(id) => void` |

**For controlled state:** the pair is `value` + `onValueChange`. The
default-value channel is `defaultValue`.

**Don't:**
- `onClick` for higher-level events — that's a DOM event. Use
  `onSelect` / `onSubmit` / etc. instead.
- `onSuccess` — use `onAfterMutate` with a `kind` discriminator.
- `onConfirm` — use `onSubmit` (the user is confirming the action).

## Async data — the `fetcher` contract

```ts
type Fetcher<TItem> = (args: {
    query: string;
    limit: number;
    signal?: AbortSignal;
}) => Promise<TItem[]>;
```

The library debounces, threads `AbortSignal`, and re-runs on
dependency changes. The consumer wraps their query lib /
fetch / Inertia bridge.

For paginated feeds (activity stream, comments thread):

```ts
type PaginatedFetcher<TItem, TCursor> = (args: {
    cursor?: TCursor;
    limit: number;
    signal?: AbortSignal;
}) => Promise<{ items: TItem[]; nextCursor?: TCursor }>;
```

For mutating data (comments submit, file upload progress), see
[`features-anatomy.md`](./features-anatomy.md) Pattern 4.

## Slots — when to add one

Add a slot if the answer to "how do I customize this piece" would
otherwise be "fork the component". Common slots:

| Slot | Where | Rendered when |
| --- | --- | --- |
| `headerSlot` / `footerSlot` | Card-like surfaces | always (between body and outer chrome) |
| `composerSlot` | Comments / chat | replaces the default editor |
| `empty` / `emptyState` | Lists / feeds | when `items.length === 0` |
| `loading` / `loadingSlot` | Async surfaces | while `isLoading` is true |
| `recent` / `idle` | Search input | when query is empty |
| `errorSlot` | Async surfaces | when `error` is set |

Slots are typed `ReactNode`. If you need state-aware slots, prefer
a render-prop:

```ts
renderResult?: (result: T, ctx: { isActive: boolean; …
}) => ReactNode;
```

## Render-props — when to use them

Use a render-prop instead of a slot when the consumer needs access
to per-item state or position:

```ts
// ✅ render-prop — receives item + context
renderItem?: (item: T, ctx: { index: number; isSelected: boolean }) => ReactNode;

// ✅ slot — no per-item context needed
empty?: ReactNode;
```

Default behavior in the rendering loop:

```tsx
{items.map((item, index) => {
    const ctx = { index, isSelected: index === activeIndex };
    return renderItem ? renderItem(item, ctx) : <DefaultItem item={item} {...ctx} />;
})}
```

## Accessors — domain mapping

When the feature operates on a generic shape, **don't read object
keys directly**. Take an accessor function:

```ts
// ✅
interface MentionsProps<TUser> {
    users: TUser[];
    getDisplayName: (user: TUser) => string;
    getAvatarUrl?: (user: TUser) => string | undefined;
    getId: (user: TUser) => string;
}

// ❌ — assumes the shape
interface MentionsProps {
    users: { id: string; name: string; avatar?: string }[];
}
```

The accessor pattern lets consumers map their domain shape (Inertia's
`User`, Next's session, a Supabase row) without re-shaping the data.

For complex domain mapping (status enum → label, kind → icon),
group accessors into a single `accessors` prop:

```ts
interface CommentsAccessors {
    getMediaUrl: (file: AttachmentFile) => string;
    getMediaName: (file: AttachmentFile) => string;
    getStatusLabel: (status: CommentStatus) => string;
    formatRelativeTime: (date: Date | string, locale?: Locale) => string;
}
```

## Locale + dates

The library never reads `navigator.language`, never picks a locale.
Two channels:

1. `<UIProvider dates={{ locale: enUS }}>` — global default for
   formatters.
2. `locale?: import('date-fns').Locale` — per-mount override for
   date pickers / calendars.

`useDatesConfig().locale` is the resolution.

For week-start: `<UIProvider dates={{ weekStartsOn: 0 }}>` flows
through `useDatesConfig().weekStartsOn` — components default to 1
(Monday) only when neither prop nor provider is set.

## Errors — never silent, never DOM-thrown

Three-layer surfacing:

1. DEV breadcrumb: `if (import.meta.env?.DEV) console.warn('[Foo] …')`
   — invariant violations only.
2. User-recoverable: render an inline `<Alert>` or expose an
   `errorSlot` so the consumer can override.
3. Bubble-up: `onError?(err)` — consumer wires Sentry / toast / log.

NEVER:
- `console.error` unguarded (production noise).
- `throw` from a callback handler (breaks React's render contract).
- Toast directly from inside a feature (couples the library to a
  specific toast lib). Pass through `onAfterMutate` and let the
  consumer toast at the call site.

The one exception: `base/copyable` and `base/toaster` already use
`sonner` directly (sonner is a real dep, used as the canonical
toast). Composed components that wrap copy-to-clipboard inside a
dropdown menu may also call `toast` for parity — but only via
top-level import, never `await import('sonner')`.

## The "I'm tempted to add X" stop-list

Before adding a prop, ask:

| Tempted to add | Stop and consider |
| --- | --- |
| `routerName` / `href` for navigation | Use `onSelect(value)`; consumer routes. |
| `apiUrl` / `endpoint` | Use `fetcher` callback. |
| `useQuery` directly inside | Move it to a consumer-supplied `fetcher`. |
| `i18nKey` / translation namespace | Use `strings` prop. |
| `appLocale: 'en' \| 'bg'` | Use a `Locale` object prop + `<UIProvider>` for global default. |
| `loginUrl` / `dashboardUrl` | Use `onSignIn()` / `onSelect()` callback. |
| `successToast` | Use `onAfterMutate(kind, payload)`; consumer toasts. |
| Hardcoded route in JSX | Replace with a callback. |

Read [`consumer-wiring.md`](./consumer-wiring.md) for what a
consumer's wiring looks like at the call site.
