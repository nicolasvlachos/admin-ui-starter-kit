# Testing components in this library

The library uses **vitest** with `@testing-library/react`. Tests live
co-located with the component (`<name>.test.tsx`) or under
`__tests__/` for non-trivial test groups.

Run the suite:

```bash
npm test                    # vitest run (CI mode)
npm run verify              # arch-check + exports-check + tsc + lint + tests
```

## When to write a test

You don't need tests for a thin presentational wrapper that just
forwards props to a primitive. You **do** need tests when:

- The component owns state (selection, controlled/uncontrolled, async).
- The component has a non-obvious size / variant resolution chain
  (`<UIProvider>` → prop → fallback) — test that the resolution
  actually flows through. See
  [`src/components/base/default-size-config.test.tsx`](../../../src/components/base/default-size-config.test.tsx).
- The component owns business logic (a parser, formatter, async
  options hook).
- A class name change would silently break a downstream consumer
  (e.g. badge size class moved from `text-[10px]` to `text-xxs` —
  consumers depending on the old class need a clear failure).

## Pattern: `<UIProvider>` config in tests

The store is a singleton. Reset between tests:

```tsx
import { afterEach } from 'vitest';
import { applyUIConfig, resetUIConfig } from '@/lib/ui-provider/store';

afterEach(() => {
    resetUIConfig();
});

it('respects the configured badge size', () => {
    applyUIConfig({ badge: { defaultSize: 'sm' } });
    render(<Badge>x</Badge>);
    expect(screen.getByText('x').closest('[data-slot="badge"]'))
        .toHaveClass('px-2', 'py-1', 'text-xs');
});
```

Don't wrap each test in `<UIProvider>` JSX — the store is global, the
mounted provider is just a convenience. `applyUIConfig` is the test
hook.

## Pattern: assert tokens, not pixels

Tests assert **class names** (the design-token shape) rather than
computed pixel values. Two reasons: jsdom doesn't do real layout, and
the contract the library promises is "consumer overrides the token, the
component reads it" — not "this exact pixel."

Good:

```ts
expect(el).toHaveClass('text-xs');
expect(el).toHaveClass('px-2', 'py-1');
```

Avoid:

```ts
expect(getComputedStyle(el).fontSize).toBe('12px');  // brittle in jsdom
```

## Pattern: callbacks over routing

When testing a feature, mock the callback prop directly. Never reach
for a `MemoryRouter` / `RouterProvider` wrapper — the library is
framework-agnostic.

```tsx
const onSubmit = vi.fn();
render(<CommentsCard items={[]} onSubmit={onSubmit} />);
// ... interact ...
expect(onSubmit).toHaveBeenCalledWith(expectedValues);
```

## Pattern: strings in tests

Pass `strings` overrides to make assertions stable across i18n changes:

```tsx
render(<CommentsCard items={[]} strings={{ composer: { submit: 'Save' } }} />);
expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
```

## Snapshot tests — avoid

Snapshots rot. They're hard to review (a 200-line diff hides the
intent), and they tend to be re-blessed without thought. Prefer
explicit assertions: "this element has class X", "this callback was
called with Y", "this aria-label is set."

If a component's full render is genuinely non-trivial and you want a
regression net, write **focused** assertions on the few class/aria
names that matter, not a snapshot.

## Reference test files

- [`base/default-size-config.test.tsx`](../../../src/components/base/default-size-config.test.tsx) — `<UIProvider>` resolution chain.
- [`base/badge/badge.test.tsx`](../../../src/components/base/badge/badge.test.tsx) — variant + size class assertions.
- [`base/cards/smart-card.test.tsx`](../../../src/components/base/cards/smart-card.test.tsx) — slot rendering, padding presets.
- [`features/filters/facets/async-select-facet.test.tsx`](../../../src/components/features/filters/facets/async-select-facet.test.tsx) — async fetcher pattern.
- [`features/overlays/hooks/use-overlay-actions.test.tsx`](../../../src/components/features/overlays/hooks/use-overlay-actions.test.tsx) — hook tests.
- [`features/mentions/__tests__/`](../../../src/components/features/mentions/__tests__) — multi-test pattern: pure utility tests + hook tests grouped under `__tests__/`.

When in doubt, model new tests on the closest existing one.
