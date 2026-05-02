# Visual evaluation pass — before declaring done

Open this before claiming a visual change is complete. This is rule 16 from the main skill, expanded with the actual workflow and the tools to run.

## When this applies

Any change observable in the browser preview:

- New base/composed/feature component
- Restyled component (className, density, spacing, color)
- Refactored typography (Text/Heading)
- New preview page or section
- Changes to `App.css` tokens

When the change is purely structural (types, refactors that pass tsc, hooks with no UI surface), skip this — but say so explicitly rather than silently dropping the check.

## Workflow

### 1. Boot the preview

```
preview_start (config: "preview")
```

The harness reads `.claude/launch.json`. Don't use Bash for the dev server.

### 2. Resize to a real desktop viewport

```
preview_resize (width: 1440, height: 900)
```

Most components are designed for ≥1024px. Test ≥320px (mobile preset) when the component is responsive.

### 3. Navigate and reload

```
preview_eval ("window.location.hash = '#/path/to/page'; window.location.reload(); 'reloaded'")
```

After source edits Vite HMR usually picks up. Only reload when HMR fails to invalidate (renames, new exports, alias changes).

### 4. Check console

```
preview_console_logs (level: error)
preview_logs (level: error)
```

A console error is the only acceptable answer to "did this regress?" If there's a `?t=…` cached error log from a prior bad save, ignore it — check the rendered DOM.

### 5. Snapshot or screenshot

```
preview_snapshot           # accessibility tree — preferred for verifying text/structure
preview_screenshot         # JPEG — for layout, spacing, color (don't trust for precise pixel values)
preview_inspect (selector, properties)  # for actual computed CSS
```

### 6. Five-question check

Answer each — fix any "no":

1. **Spacing breathes?** No cramped rows, no orphan gaps, consistent rhythm.
2. **Typography reads in clear hierarchy?** `sm`/`xs`/`xxs` working as the rule prescribes; `text-base` only for hero values.
3. **Active/hover/focus state intentional?** `focus-visible:` (not `focus:`); semantic color tokens; no accidental brand washes.
4. **Matches the library voice?** Admin-density, neutral-modern, calm. No flashy gradients unless that's the explicit design goal.
5. **Could a designer find one obvious thing to fix in 3 seconds?** If yes, fix it.

### 7. Detail polish

- Row heights stable across states (toggling shouldn't shift layout).
- Adjacent components with the same role have matching paddings.
- Borders/separators consistent (1px, `border-border` token, not raw `border-zinc-…`).
- Icons sized via the parent's gap/sizing — not random literal sizes.
- Truncation uses `truncate` + a sensible min/max width.

## Verification commands

```bash
# Type-check (cleanly):
npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0

# Find typography violations introduced this session:
grep -rn "text-\[" src/components --include='*.tsx' | grep -v "text-\[length:var"

# Find raw color violations:
grep -rn "text-orange-\|text-red-\|text-green-\|text-blue-\|text-yellow-\|text-amber-" src/components --include='*.tsx'

# Find foreground/N opacity (forbidden as typography contrast):
grep -rn "text-foreground/" src/components --include='*.tsx'

# Find lingering legacy import paths:
grep -rn "@/components/ui/base\|@/components/ui/typography\|@/components/ui/primitives" src
```

All four should return zero matches in a clean state (modulo intentional `text-[length:var(--text-…)]` that the first grep already excludes).

## Programmatic regression sweep

Visit a representative slice of the showcase and check for runtime errors:

```js
preview_eval(`
(async () => {
    const ids = [
        'ui/inputs', 'base/typography', 'base/forms', 'base/popover',
        'composed/cards-giftcard', 'composed/timelines',
        'features/comments', 'features/global-search', 'features/activities',
        'layout/sidebar', 'layout/header',
    ];
    const errors = [];
    const onError = (e) => errors.push(String(e.error || e.message));
    window.addEventListener('error', onError);
    for (const id of ids) {
        window.location.hash = '#/' + id;
        await new Promise(r => setTimeout(r, 300));
    }
    window.removeEventListener('error', onError);
    return { visited: ids.length, errors };
})()
`)
```

Expect `errors: []`. Any non-empty array is a regression.

## What "done" means

- `tsc` clean.
- Preview boots without errors.
- The four greps above return zero violations in your changed files.
- The five-question check passes.
- A representative regression sweep returns no runtime errors.

Anything less means the change isn't done — even when "it looks right on the screenshot".

## When you can't visually verify

Some changes can't be exercised in the showcase (e.g. SSR-only behavior, peer-dep paths the showcase doesn't bundle). Say so explicitly:

> "Type-checked clean; preview boot is OK. Cannot visually exercise the SSR fallback path because the showcase runs client-only — flagged for a manual check in the consumer app."

Don't claim visual success on something you didn't see.
