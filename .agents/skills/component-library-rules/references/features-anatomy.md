# Anatomy of a feature — building from scratch

Every feature in `src/components/features/**` follows the same shape.
This guide walks through that shape with concrete pointers to the
canonical examples already in the repo. When in doubt, model new
features on these — the patterns landed by audit and convention,
not preference.

The five canonical features to copy from:
- [`features/global-search/`](../../../src/components/features/global-search) — slots + render-prop + headless hook
- [`features/filters/`](../../../src/components/features/filters) — provider + exported partials + validation + facets
- [`features/comments/`](../../../src/components/features/comments) — callback-driven mutations + accessors + strings
- [`features/mentions/`](../../../src/components/features/mentions) — multi-interface strings file + headless hooks
- [`features/kanban/`](../../../src/components/features/kanban) — generic-T headless DnD with compound API

## Folder layout

```
features/<name>/
├── <name>.tsx                # main entry component
├── <name>.types.ts           # shared TS types — props, items, public shapes
├── <name>.strings.ts         # XxxStrings interface + defaultXxxStrings
├── <name>-context.tsx        # OPTIONAL — provider-driven features
├── partials/                 # internal pieces, exported via index.ts
│   └── index.ts              # surface the partials consumers can compose
├── hooks/                    # feature-local hooks (with index.ts barrel)
│   └── index.ts
├── index.ts                  # the public surface
└── README.md                 # OPTIONAL — only for non-obvious APIs
```

This shape is mandatory for `features/`; non-trivial `composed/` and
`base/` components follow the same shape "in spirit" (folder, types,
strings, partials, hooks if needed).

## The seven seams every feature exposes

A consumer can swap any of these without forking your code:

1. **Strings** — every user-facing piece of copy is overridable via
   `strings={{ … }}` deep-merged into `defaultXxxStrings`. See
   [`strings-pattern.md`](./strings-pattern.md).
2. **Slots** — named `ReactNode` props for the recurring pieces
   (`headerSlot`, `footerSlot`, `composerSlot`, `empty`, `loading`).
3. **Render-props** — function-props that return a `ReactNode` for
   per-item / per-row custom rendering (`renderResult`,
   `renderTrigger`, `renderItem`).
4. **Headless hook** — when your feature owns state (selection,
   active index, keyboard nav, mutation queue), expose
   `useXxx({ items, … })` so consumers can build a fully custom UI
   against the same state machine.
5. **Exported partials** — every internal piece a consumer might
   want to recompose lives in `partials/` and is re-exported from
   `index.ts`. Consumers can `import { CommentBubble } from
   '@/components/features/comments'` and assemble their own thread
   layout against `<CommentsProvider>`.
6. **Callbacks** — `onSubmit`, `onDelete`, `onAfterMutate`,
   `onError`, `onSelect`, `onChange`, `onOpen`, `onClose`. Use
   plural callbacks for batch mutations (`onBulkDelete`).
7. **Accessors** — for domain mapping. `getMediaUrl(file)`,
   `getDisplayName(user)`, `getStatusLabel(status)`,
   `formatRelativeTime(date, locale)`. Anything that depends on the
   consumer's domain shape goes through an accessor instead of
   being inferred.

## Pattern 1 — The provider-driven feature (filters / kanban / comments)

Reach for this when the feature owns state that multiple partials
read.

```
features/<name>/
├── <name>-context.tsx        ← createContext + provider + useXxx hook
├── <name>.tsx                ← <Xxx> default-shape composition over the partials
└── partials/                 ← <XxxHeader>, <XxxRow>, <XxxFooter>, …
```

The `<Xxx>` default component IS a composition — consumers can
mount the partials directly inside `<XxxProvider>` instead of using
the default shape. See [`features/filters/index.ts`](../../../src/components/features/filters/index.ts)
for how to expose them.

**Provider rule:** never put per-mount data (`items`, `users`,
`onSubmit`) in the provider. Pass those as direct props on the
component itself. The provider only holds *derived shared state*
(active filter set, current selection, drag state).

## Pattern 2 — Headless hook + slot-driven UI (global-search)

Reach for this when the consumer wants the *behavior* (keyboard
selection, keyboard shortcuts, Cmd+K) but not your default chrome.

```
features/<name>/
├── hooks/
│   └── use-<name>.ts         ← exposes { activeIndex, onKeyDown, onSelect, … }
├── <name>.tsx                ← default UI built on top of the hook
└── partials/                 ← <NameInput>, <NameResultRow>, <NameTabs>
```

The headless hook is the contract; the `<Xxx>` component is a
*reference layout* over it. Power-users skip the layout and write
their own JSX driving the hook.

`useGlobalSearch` is the canonical example.

## Pattern 3 — Generic-T containers (kanban)

When the feature shape is generic (any item, not just one domain),
type the entry component on `<T>` and require a `getItemValue: (item:
T) => string` accessor at the call site. The library never reaches
into `item.id` — the consumer maps their domain.

`<Kanban<T> value onValueChange getItemValue>` is the pattern.

## Pattern 4 — Mutation pipelines with `onSubmit` / `onAfterMutate`

For features that mutate (comments, key-value editor, async filters):

```
onSubmit?: (values: T, helpers?: { reset: () => void; setError: (msg: string) => void }) => void | Promise<void>;
onAfterMutate?: (kind: 'create' | 'update' | 'delete', payload: T) => void;
onError?: (err: unknown) => void;
```

The library calls `onSubmit` and awaits it. If the consumer's
promise rejects, the library calls `onError`. The consumer is
responsible for the actual HTTP call; the library never `fetch()`s.

The `helpers` argument is optional but useful for: `reset()` to clear
the form on success, `setError(msg)` to surface a server-side
validation error inline, `setSubmitting(false)` if the consumer
wants finer control. Keep this surface narrow — only add a helper
when at least two consumers need it.

## Pattern 5 — Async data via `fetcher` prop

For autocompletes, async-select facets, "load more" feeds:

```ts
fetcher: (args: {
    query: string;
    limit: number;
    signal?: AbortSignal;
}) => Promise<TItem[]>;
```

The library debounces the calls, threads an `AbortSignal`, and
re-runs on dependency changes. Consumers can wrap their own
TanStack Query / SWR / fetch / Inertia bridge inside the fetcher.

`useAsyncOptions` from `features/filters/hooks/` is the canonical
implementation of this contract.

## Pattern 6 — Validators (rule 8 + filter `validation.custom`)

The filter `ValidationConfig.custom` accepts any
`(value) => boolean | string`. Don't bake Zod / Valibot / Yup into
the feature itself — accept the `(value) => boolean | string` and
let the consumer adapt their validator.

The library ships two adapters in
[`features/filters/validators.ts`](../../../src/components/features/filters/validators.ts):
- `zodValidator(schema)` — adapts any object with a `safeParse(v) =>
  { success, error?: { issues?: [{message}], message? } }` method
  (Zod 3, Zod 4, Valibot via thin shim).
- `predicateValidator(predicate, message)` — pairs a boolean predicate
  with a static error message; no third-party dep needed.

Pattern at the call site:

```tsx
import { z } from 'zod';
import { zodValidator } from '@/components/features/filters';

const fields: FilterConfig[] = [
    {
        key: 'email',
        label: 'Email',
        type: FilterType.TEXT,
        icon: <Mail className="size-3.5" />,
        displayConfig: { display: 'always' },
        validation: { custom: zodValidator(z.string().email('Invalid email')) },
    },
];
```

## Pattern 7 — Strings file shape (rule 8 + 19)

Every feature has exactly **one** `<name>.strings.ts` at the feature
root, even when multiple partials need their own strings interface.
Each partial imports from there:

```ts
// features/mentions/mentions.strings.ts
export interface MentionPickerStrings { /* … */ }
export const defaultMentionPickerStrings: MentionPickerStrings = { /* … */ };
export interface MentionInlineSuggestionsStrings { /* … */ }
export const defaultMentionInlineSuggestionsStrings: MentionInlineSuggestionsStrings = { /* … */ };
```

Always typed as `strings?: StringsProp<XStrings>` (NOT
`Partial<XStrings>`) — the deep-merge contract requires DeepPartial.
`useStrings(defaults, override)` is the only way the library merges
strings; never `{ ...DEFAULT, ...override }` shallow.

`useStrings` returns a memoized result, so you can pass an inline
literal at the call site without triggering re-renders.

## Pattern 8 — Framework wiring is the consumer's job

The library never reaches into `@inertiajs/*`, `next/*`,
`react-router*`, `@tanstack/react-router`, `@tanstack/react-query`,
`vite-bundled-i18n/*`, or `ziggy-js`. Period.

What that means in practice:
- Routing → `onSelect(value)` callback; consumer calls
  `router.visit(url)`.
- Data fetching → `fetcher` prop; consumer wires their query lib.
- Optimistic updates → `onAfterMutate(kind, payload)`; consumer
  invalidates / mutates their cache.
- i18n → `strings={{ … }}`; consumer maps their backend i18n into
  the prop.
- Locale-aware formatting → accept a `locale?: import('date-fns').Locale`
  prop and forward to date-fns. Default to `enUS`.

If a pattern repeats across many call sites for a particular
consumer, **the consumer wraps the feature** (`<AppCommentsCard>`
forwarding their defaults). The library never ships that wrapper.

## Pattern 9 — Errors

Three layers of error surfacing:

1. **Local invariant violation in dev** —
   `if (import.meta.env?.DEV) console.warn('[Comments] …')`
   for things only a developer should see.
2. **User-recoverable error** — surface in a slot the consumer can
   override (`errorSlot`, an `<Alert>` rendered when state.error is
   set).
3. **Bubble-up** — `onError?(err: unknown)` callback so the consumer
   can pipe to Sentry / Datadog / their own toast.

The library never imports a telemetry SDK. Class-based
ErrorBoundaries (e.g. `FilterErrorBoundary`) follow the same rule:
DEV-log + dispatch a CustomEvent (`feature-error`) the consumer can
listen for.

## Pattern 10 — Resolving size / variant against `<UIProvider>`

When your feature renders a `<Button>` / `<Badge>` / `<Text>` /
`<Item>`, **never pin a literal size**. The base component already
resolves against `useFooConfig()` — pinning blocks the chain. If
your feature has its own per-mount `size` prop, forward the resolved
value:

```tsx
// ✅ — let the base component resolve
<Button>Send</Button>

// ✅ — forwarding a feature-local size
<Button size={resolvedSize}>Send</Button>

// ❌ — blocks UIProvider override
<Button size="xs">Send</Button>
```

See [`ui-provider.md`](./ui-provider.md) for the resolution rule
and how to add a new slice.

## Verification before declaring done

1. `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0` clean.
2. `npm run lint:architecture` passes (no forbidden imports).
3. `npm run test:exports` passes (public surface unchanged).
4. `npm run lint` clean.
5. `npm test` — your feature has at least one vitest case asserting:
   - default render
   - controlled / uncontrolled modes (if stateful)
   - strings deep-merge override
   - one callback fires
6. Preview page added under `src/preview/pages/features/` and
   registered in `src/preview/registry.tsx`.
7. Visual evaluation per [`visual-eval.md`](./visual-eval.md) — five
   questions, no "no" answers.

Skip any of these and you're shipping un-verified.
