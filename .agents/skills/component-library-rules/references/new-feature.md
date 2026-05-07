# Adding a new feature folder

Open this when creating `src/components/features/$feature/` from scratch.

## Folder shape (rule 11)

```
features/$feature/
├── index.ts                # public exports only — the package surface
├── $feature.types.ts       # shared types
├── $feature.strings.ts     # `<Feature>Strings` interface + `default<Feature>Strings`
├── $feature.tsx            # main entry component
├── partials/               # internal pieces, exported via index.ts when reusable
│   └── index.ts            # barrel
└── hooks/                  # feature-specific hooks
    └── index.ts            # barrel
```

`hooks/` and `partials/` are optional when the feature is a single component with no internal state machine. They are mandatory the moment you have a second renderable piece or a non-trivial state hook.

There is **no** `adapters/` folder. Framework wiring happens at the consumer's call site — the library never imports `@inertiajs/*`, `@tanstack/react-router`, `next/*`, `react-router*`, `vite-bundled-i18n/*`, `ziggy-js`, or any backend SDK.

## Acceptance criteria

When you're done, all four MUST be true:

1. `import { Feature, useFeature } from '@/components/features/$feature'` works from a fresh consumer with zero peer-dep installs (beyond what's listed in `package.json` `peerDependencies`).
2. Every internal partial is either re-exported from `index.ts` OR overridable via a render-prop / slot on the main component.
3. Every user-facing string is overridable via `<Feature strings={{ … }} />` deep-merged over `default<Feature>Strings`.
4. The feature accepts callbacks (`onSubmit`, `onDelete`, `onSelect`, `fetcher`, `onResultSelect`, …) — never imports a router, query lib, or i18n hook.

## Reference implementations

| Pattern | Look at |
| --- | --- |
| Folder shape, slots, headless hook | `features/global-search/` |
| Provider + exported partials + headless config | `features/filters/` |
| Strings file, accessors, editor slot | `features/comments/` |
| Multi-interface strings file | `features/mentions/` |
| Two implementation modes sharing one strings file | `features/rich-text-editor/` (Tiptap + Fallback) |

If your folder doesn't structurally resemble at least one of these, stop and re-read [`../SKILL.md`](../SKILL.md) rule 11.

## Boilerplate

```ts
// $feature.strings.ts
export interface FeatureStrings {
    title: string;
    emptyState: string;
}

export const defaultFeatureStrings: FeatureStrings = {
    title: 'Feature',
    emptyState: 'Nothing here yet',
};
```

```ts
// $feature.types.ts
import type { StringsProp } from '@/lib/strings';
import type { FeatureStrings } from './$feature.strings';

export interface FeatureProps {
    items: ReadonlyArray<{ id: string; label: string }>;
    onSelect?: (id: string) => void;
    strings?: StringsProp<FeatureStrings>;
    className?: string;
}
```

```tsx
// $feature.tsx
import { useStrings } from '@/lib/strings';
import { defaultFeatureStrings } from './$feature.strings';
import type { FeatureProps } from './$feature.types';

export function Feature({ items, onSelect, strings: stringsProp, className }: FeatureProps) {
    const strings = useStrings(defaultFeatureStrings, stringsProp);
    if (items.length === 0) return <div>{strings.emptyState}</div>;
    return /* … */;
}
```

```ts
// index.ts
export { Feature } from './$feature';
export {
    defaultFeatureStrings,
    type FeatureStrings,
} from './$feature.strings';
export type { FeatureProps } from './$feature.types';
```

## Don'ts

- ❌ Drop user-facing strings inline as JSX literals.
- ❌ Import from any framework integration package — even "just for now".
- ❌ Use `{ ...DEFAULT, ...override }` shallow merge instead of `useStrings(defaults, override)`.
- ❌ Create an `adapters/` subfolder.
- ❌ Add a feature without a strings file just because you "don't have any user-facing strings yet" — you will, and adding the file later means re-touching every importer.

## After landing

Add a showcase docs pair under `src/preview/pages/features/`:
`$feature.examples.tsx` for named live examples and `$feature.mdx` for
`DocsPage` / `Section` / `Example` / `PropsTable` documentation. Register the
MDX page in `src/preview/registry.tsx`, then run `npm run docs:generate-props`
and `npm run docs:sync-skill` (see [`preview-pages.md`](preview-pages.md)).
