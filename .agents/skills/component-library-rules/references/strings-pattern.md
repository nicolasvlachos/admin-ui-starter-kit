# Strings pattern — defaults + overrides via `useStrings`

Open this when adding or refactoring a `*.strings.ts` file.

## The shape

One `*.strings.ts` per feature/composed surface, at the surface root. Contains:

1. One or more `<Name>Strings` interfaces.
2. A `default<Name>Strings` const for each interface.
3. Nothing else (no helpers, no formatters, no JSX).

```ts
// features/feature-x/feature-x.strings.ts
export interface FeatureXStrings {
    title: string;
    emptyState: string;
    confidenceLevels: { low: string; medium: string; high: string };
    // Templates take args so locales can re-order substitutions:
    formatRowTitle: (count: number) => string;
}

export const defaultFeatureXStrings: FeatureXStrings = {
    title: 'Feature X',
    emptyState: 'Nothing here yet',
    confidenceLevels: { low: 'Low', medium: 'Medium', high: 'High' },
    formatRowTitle: (count) => `${count} items`,
};
```

## Consuming in the component

```tsx
import { useStrings, type StringsProp } from '@/lib/strings';
import { defaultFeatureXStrings, type FeatureXStrings } from './feature-x.strings';

export interface FeatureXProps {
    /* … other props … */
    strings?: StringsProp<FeatureXStrings>;
}

export function FeatureX({ strings: stringsProp, ...rest }: FeatureXProps) {
    const strings = useStrings(defaultFeatureXStrings, stringsProp);
    return <h2>{strings.title}</h2>;
}
```

`useStrings` deep-merges `stringsProp` over the defaults and memoises by override identity. Stable references avoid downstream re-renders. Inline literals work fine — the merge is trivial.

## Multiple interfaces in one file

When several partials in the same surface have related strings, keep them in **one** `*.strings.ts` file and export multiple interfaces:

```ts
// features/mentions/mentions.strings.ts
export interface MentionPickerStrings { /* … */ }
export const defaultMentionPickerStrings: MentionPickerStrings = { /* … */ };

export interface MentionInlineSuggestionsStrings { /* … */ }
export const defaultMentionInlineSuggestionsStrings: MentionInlineSuggestionsStrings = { /* … */ };
```

Each partial imports only its own slice from the shared file. Re-export the type from the partial if you want the existing public API to stay stable: `export type { MentionPickerStrings }`.

## Multiple implementation modes sharing one strings interface

`features/rich-text-editor/` has two implementations (Tiptap + Fallback). They share **one** strings file because the user-facing copy is identical regardless of which path runs. Each implementation independently calls `useStrings(defaultRichTextEditorStrings, stringsProp)`.

## Re-exporting from the feature index

```ts
// features/feature-x/index.ts
export { FeatureX } from './feature-x';
export type { FeatureXProps } from './feature-x.types';

// Strings — make defaults importable so consumers can build on them
export {
    defaultFeatureXStrings,
    type FeatureXStrings,
} from './feature-x.strings';
```

## Templates over interpolated strings

Prefer functions over `{0}`-style templates when arguments need to move:

```ts
// ✅ Locales can rearrange
formatGreeting: (name: string, count: number) => `Hello ${name}, you have ${count} messages.`

// ❌ Hard for translators
greeting: 'Hello {name}, you have {count} messages.'
```

The library has no concept of locales or translators — consumers map their backend i18n into the strings prop at the call site:

```tsx
<FeatureX
    strings={{
        title: t('feature_x.title'),
        formatRowTitle: (n) => t('feature_x.row_title', { count: n }),
    }}
/>
```

## Migration checklist (refactoring inline strings)

1. Identify every hardcoded user-facing literal in the component(s) — JSX text, `aria-label`, `placeholder`, `title`, error/empty messages.
2. Create `<surface>.strings.ts` with one or more `<Name>Strings` interfaces + `default<Name>Strings` constants.
3. Replace each literal with `strings.<key>`.
4. Add `strings?: StringsProp<TStrings>` to the props interface.
5. Call `useStrings(defaults, stringsProp)` once per component.
6. Re-export from `index.ts`.
7. Run `tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0`.

## Don'ts

- ❌ `const STRINGS = { … }` defined inline at module scope of a partial. Move to the strings file.
- ❌ `{ ...DEFAULT, ...override }` shallow merge. Use `useStrings`.
- ❌ Strings duplicated across partials in the same feature. Consolidate.
- ❌ Strings shared across unrelated features. Each feature owns its own — no global strings file.
- ❌ Calling `t()` / `useI18n()` inside the library. Backend i18n maps INTO the prop at the call site.
- ❌ Skipping `useStrings` because "the override prop is empty most of the time". The hook is cheap; consistency matters more.
