# Consumer wiring — framework integration at the call site

Open this when explaining (or implementing in a consumer's app) how to wire `@inertiajs/*`, `@tanstack/react-router`, `next/*`, `react-router*`, `@tanstack/react-query`, `vite-bundled-i18n`, etc. with this library.

## The principle

The library never imports a framework integration package. **The consumer wires their framework at the call site of the library component.** This keeps the package framework-agnostic and lets one consumer use Inertia while another uses Next.js without forking.

## What flows in via props

| Consumer concern | Library prop | Example |
| --- | --- | --- |
| Routing / navigation | `onSelect`, `onResultSelect`, `onSubmit`, `onCancel`, action callbacks | `onResultSelect={(r) => router.visit(r.url)}` |
| Data fetching | `fetcher` callback (async) | `fetcher={({ query }) => api.search(query)}` or pre-resolved `options=[…]` |
| i18n | `strings={{ … }}` (deep-partial) | `strings={{ title: t('feature.title') }}` |
| Mutations | `onSubmit`, `onDelete`, `onUpdate` | `onSubmit={(values) => router.post('/comments', values)}` |
| Domain mapping | accessor props (`getMediaUrl`, `getStatusLabel`, `formatRelativeTime`) | `getMediaUrl={(att) => mediaResolver(att.key)}` |
| App-wide display defaults | `<UIProvider>` at the React root | see [`ui-provider.md`](ui-provider.md) |

## Worked examples

### Inertia

```tsx
import { router } from '@inertiajs/react';
import { Comments } from '@/components/features/comments';

<Comments
    comments={comments}
    canComment
    onSubmit={(values) => router.post('/comments', values)}
    onDelete={(id) => router.delete(`/comments/${id}`)}
/>
```

### Tanstack Router

```tsx
import { useNavigate } from '@tanstack/react-router';
import { GlobalSearch } from '@/components/features/global-search';

const navigate = useNavigate();
<GlobalSearch
    query={query}
    onQueryChange={setQuery}
    results={results}
    onResultSelect={(r) => navigate({ to: r.url })}
/>
```

### Next.js (pages or app router)

```tsx
import { useRouter } from 'next/router';        // or 'next/navigation'
import { Comments } from '@/components/features/comments';

const router = useRouter();
<Comments
    comments={comments}
    onSubmit={async (values) => {
        await fetch('/api/comments', { method: 'POST', body: JSON.stringify(values) });
        router.refresh?.();
    }}
/>
```

### `@tanstack/react-query` for async filters

The library's `useAsyncOptions` works peer-dep-free. Consumers who want react-query semantics layer it OUTSIDE:

```tsx
import { useQuery } from '@tanstack/react-query';

function UsersFilter({ value, onChange }) {
    const { data: options = [] } = useQuery({
        queryKey: ['users-filter', value],
        queryFn: () => api.searchUsers(value),
    });
    return (
        <SelectFacet
            filter={{ key: 'user', label: 'User', /* … */ }}
            value={value}
            onChange={onChange}
            options={options}    // pre-resolved — bypasses the internal fetcher
        />
    );
}
```

### `vite-bundled-i18n` strings

```tsx
import { useI18n } from 'vite-bundled-i18n/react';

function CommentsSection() {
    const { t } = useI18n();
    return (
        <Comments
            strings={{
                composer: { placeholder: t('comments.placeholder') },
                empty: t('comments.empty'),
            }}
            /* … */
        />
    );
}
```

### App-wide defaults

```tsx
// At the React root, once:
import { UIProvider } from '@/lib/ui-provider';

<UIProvider config={{
    money: { defaultCurrency: 'EUR', locale: 'de-DE' },
    dates: { weekStartsOn: 1, format: 'dd.MM.yyyy' },
    button: { defaultSize: 'sm' },
    badge: { defaultSize: 'xs' },
}}>
    <App />
</UIProvider>
```

Per-mount overrides always win:

```tsx
<Money amount={1200} currency="USD" />  {/* ignores defaultCurrency */}
```

## What the library never does

- ❌ Import `router` / `navigate` / `useRouter` / `useNavigate` from any package.
- ❌ Call `useI18n()` / `t()` inside a component.
- ❌ Call `useQuery()` / `useMutation()` inside a feature.
- ❌ Read from a fixed endpoint URL — features always accept a `fetcher` callback.
- ❌ Read from a backend SDK (Supabase, Firebase, Prisma) — pass results in via props.

## Repeating wiring across many call sites

If a consumer ends up calling `<Comments onSubmit={…} onDelete={…} resources={…}>` the same way in 30 places, **they** wrap the library component in their own `<AppComments>`:

```tsx
// In the consumer app — never in this library:
import { Comments, type CommentsProps } from 'admin-ui-starter-kit/comments';
import { router } from '@inertiajs/react';

export function AppComments(props: Pick<CommentsProps, 'context' | 'comments'>) {
    return (
        <Comments
            {...props}
            onSubmit={(values) => router.post('/comments', values)}
            onDelete={(id) => router.delete(`/comments/${id}`)}
            resources={appResources}
        />
    );
}
```

Don't ship `<AppComments>` from the library. That's consumer code.
