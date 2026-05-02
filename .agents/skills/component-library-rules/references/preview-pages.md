# Preview pages and the showcase registry

Open this when adding, moving, or refactoring a preview page.

## The contract

Every file under `src/preview/pages/**/*.tsx` MUST appear in `src/preview/registry.tsx`. Pages on disk that aren't registered are dead — they exist but never appear in the showcase, so they silently rot.

## Adding a new preview page

1. **Create** `src/preview/pages/<section>/<Name>Page.tsx`. Sections: `ui`, `base`, `common`, `composed`, `features`, `layout`.
2. **Compose with the real components.** Import from `@/components/base/...`, `@/components/composed/...`, `@/components/features/...`, `@/components/layout/...`. Use real props, real data — not custom inline mocks.
3. **Wrap with `PreviewPage` + `PreviewSection`** from `src/preview/PreviewLayout.tsx`. They handle title, description, two-column grid, card chrome.
4. **Register** in `src/preview/registry.tsx`:
    ```ts
    {
        id: '<section>/<slug>',
        label: 'Friendly name',
        section: 'Composed',          // capitalized — the union in PreviewEntry['section']
        family: 'Cards',              // groups in the sidebar
        component: lazy(() => import('./pages/composed/CardsContactPage')),
        status: 'ready',              // 'ready' | 'wip' | 'broken'
    },
    ```
5. **Verify** in the running showcase — open the section tab and confirm the entry appears under the right family.

## Page anatomy

```tsx
import { useState } from 'react';
import { Feature } from '@/components/features/feature';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function FeaturePage() {
    const [value, setValue] = useState('');
    return (
        <PreviewPage
            title="Features · Feature"
            description="One-line description of what this surface does."
        >
            <PreviewSection title="API surface">
                {/* Quick prose + monospace examples of the public props */}
            </PreviewSection>

            <PreviewSection title="Default" span="full">
                <Feature value={value} onChange={setValue} />
            </PreviewSection>

            <PreviewSection title="With slot override" description="Demo a custom slot.">
                <Feature value={value} onChange={setValue} renderItem={(item) => /* … */} />
            </PreviewSection>

            <PreviewSection title="Strings override">
                <Feature value={value} onChange={setValue} strings={{ title: 'Custom title' }} />
            </PreviewSection>
        </PreviewPage>
    );
}
```

`<PreviewSection span="full">` makes a section span both columns (use for wider components like editors, tables, complex layouts).

## Heading rules in previews

`PreviewLayout` uses `Heading tag="h1"` for the page title and `Heading tag="h4"` for section titles — both with their default sizes from the typography system. **Don't add `!important` overrides** — fix the typography component if a default looks wrong.

## Forbidden — re-implementing the component

A preview page that defines a "private" version of the component inline is a smell:

```tsx
// ❌ This is the rule-10 violation — a 122-line "static visual mock" with no
//    `import { RichTextEditor } from '@/components/features/rich-text-editor'`.
const TOOLBAR_BUTTONS = [{ icon: Bold, label: 'Bold' }, /* … */];
export default function RichTextEditorPage() {
    return /* … hand-rolled toolbar + body */;
}
```

If the preview can't drive the real component, the underlying feature is missing a slot, render-prop, or fallback path. **Fix the feature**, then make the preview a thin demo.

The one acceptable exception: when a feature genuinely can't render in the showcase context (e.g. a peer-dep isn't bundled). Then the feature itself ships a fallback (see `features/rich-text-editor` `FallbackRichTextEditor`), and the preview imports the real component which decides at runtime which path to take.

## Status meanings

- `'ready'` — production-grade, no known issues.
- `'wip'` — under active development; some examples may not be stable yet.
- `'broken'` — known to fail; surfaces a red dot so contributors notice.

`status` defaults to `'ready'` if omitted.

## When restructuring a feature folder

If you move a partial from the feature root into `partials/`, double-check the preview pages that demo it — sometimes they import partials directly (e.g. `import { ActivityRow } from '@/components/features/activities'`). Update imports through the index barrel rather than direct paths so future moves don't break the preview.
