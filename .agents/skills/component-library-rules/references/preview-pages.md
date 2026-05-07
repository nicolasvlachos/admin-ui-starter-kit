# Preview pages and the showcase registry

Open this when adding, moving, or refactoring a showcase page.

## The contract

Every MDX page under `src/preview/pages/**/*.mdx` MUST appear in
`src/preview/registry.tsx`. Pages on disk that are not registered are dead —
they exist but never appear in the showcase, so they silently rot.

Each page normally has a sibling examples file:

```
src/preview/pages/<section>/<slug>.mdx
src/preview/pages/<section>/<slug>.examples.tsx
```

The MDX file owns prose, sections, live example wrappers, and API tables. The
examples file owns named React examples that import the real library components.

## Adding a new preview page

1. **Create** `src/preview/pages/<section>/<slug>.examples.tsx`. Sections:
   `ui`, `base`, `common`, `composed`, `features`, `layout`.
2. **Compose with the real components.** Import from
   `@/components/base/...`, `@/components/composed/...`,
   `@/components/features/...`, `@/components/layout/...`. Use real props and
   realistic data, not a custom visual mock.
3. **Create** `src/preview/pages/<section>/<slug>.mdx`. Import
   `DocsPage`, `Section`, `Example`, and `PropsTable` from `@/preview/_docs`,
   then render each named example through `<Example>`.
4. **Register** in `src/preview/registry.tsx`:
    ```ts
    {
        id: '<section>/<slug>',
        label: 'Friendly name',
        section: 'Composed',          // capitalized — PreviewEntry['section']
        family: 'Cards',              // groups in the sidebar
        component: lazy(() => import('./pages/composed/contact-card.mdx')),
        status: 'ready',              // 'ready' | 'wip' | 'broken'
    },
    ```
5. **Regenerate docs surfaces**:
   `npm run docs:generate-props` and `npm run docs:sync-skill`.
6. **Verify** in the running showcase — open the section tab and confirm the
   entry appears under the right family.

## Page anatomy

```mdx
import { DocsPage, Section, Example, PropsTable } from '@/preview/_docs';
import * as Examples from './feature.examples';
import examplesSource from './feature.examples?raw';

<DocsPage
    title="Features · Feature"
    description="One-line description of what this surface does."
    layer="features"
    status="ready"
    sourcePath="src/components/features/feature"
>

<Section title="Examples" id="examples">

<Example name="Default" source={examplesSource}>
    <Examples.Default />
</Example>

<Example name="StringsOverride" source={examplesSource}>
    <Examples.StringsOverride />
</Example>

</Section>

<Section title="API" id="api">

#### Feature
<PropsTable component="Feature" />

</Section>

</DocsPage>
```

```tsx
// feature.examples.tsx
import { useState } from 'react';
import { Feature } from '@/components/features/feature';

export function Default() {
    const [value, setValue] = useState('');
    return <Feature value={value} onChange={setValue} />;
}

export function StringsOverride() {
    const [value, setValue] = useState('');
    return (
        <Feature
            value={value}
            onChange={setValue}
            strings={{ title: 'Custom title' }}
        />
    );
}
```

## Example rules

Examples are public documentation and informal API tests. Keep them thin:

- Import the actual shipped component or exported partial.
- Keep reusable demo data in the examples file, not the MDX file.
- Use `Row` / `Col` from `src/preview/PreviewLayout.tsx` only for simple demo
  arrangement. Page chrome belongs to `DocsPage`, `Section`, and `Example`.
- Avoid `// @ts-nocheck` on new examples. Existing converted examples may still
  have it, but new work should be typed.

## Forbidden — re-implementing the component

A preview example that defines a "private" version of the component inline is a
smell:

```tsx
// ❌ This is the rule-10 violation — a static visual mock with no
//    `import { RichTextEditor } from '@/components/features/rich-text-editor'`.
const TOOLBAR_BUTTONS = [{ icon: Bold, label: 'Bold' }, /* … */];
export function Default() {
    return /* … hand-rolled toolbar + body */;
}
```

If the preview cannot drive the real component, the underlying feature is
missing a slot, render-prop, exported partial, or fallback path. Fix the
feature, then make the preview a thin demo.

The one acceptable exception: when a feature genuinely cannot render in the
showcase context because an optional peer is absent. In that case the feature
itself ships a fallback, and the preview imports the real component which
decides at runtime which path to take.

## Status meanings

- `'ready'` — production-grade, no known issues.
- `'wip'` — under active development; some examples may not be stable yet.
- `'broken'` — known to fail; surfaces a red dot so contributors notice.

`status` defaults to `'ready'` if omitted.

## When restructuring a feature folder

If you move a partial from the feature root into `partials/`, double-check the
examples that demo it. Update imports through the index barrel rather than
direct paths so future moves do not break the showcase.
