---
name: component-library-rules
description: Use whenever modifying any component in this `admin-ui-starter-kit` library — base, composed, features, or preview pages. Enforces the architectural layering, typography rules, token usage, and i18n patterns the maintainer expects. Failing to follow these turns into "you keep fucking up things." This is non-negotiable.
---

# Component library rules — read before touching ANY component

This is a reusable component library. Code lives in many projects via this package — fixes propagate everywhere. That means **every change is leverage, good or bad**. Follow these rules.

## Goal & target distribution

This codebase is on a path to becoming a **standalone, publishable npm package** that re-exports shadcn primitives, the `base/` wrappers, and the `composed/`/`features/` layers — centralized so every consuming app upgrades from one place.

That goal drives every other rule:
- Components must be **framework-agnostic** by default (Inertia, Next.js, plain Vite, Remix, …).
- Internal strings must be **overridable** so consumers wire their own i18n.
- Visual tokens must be **theme-able** through CSS custom properties so consumers can rebrand.
- Internal partials must be **exported and composable** so consumers can build custom layouts on top.
- Direct imports of peer dependencies (`@inertiajs/*`, `@tanstack/react-query`, `next/*`, `vite-bundled-i18n/*`, `ziggy-js`, `react-router*`) belong **only** in opt-in adapter folders, never in the default export path.

When in doubt, ask: "Would this work for a brand-new consumer who installed `admin-ui-starter-kit` from npm and has no idea what Inertia is?" If not, refactor.

The historical migration log of how this codebase reached publish-ready state lives in [`references/history.md`](references/history.md) next to this file. **It is background only — not a live roadmap.** Read it once for context if you're touching structural plumbing; otherwise skip.

## Mandatory loading

This skill is the **non-negotiable contract** for any change inside `src/components/**`. The Claude harness auto-loads it whenever the repo is touched, but auto-loading is not enough — read the rules through every session in which you intend to modify components. The maintainer's repeated frustration ("you keep fucking up things") is a direct cost of skipping this. Don't skip.

The repo's `AGENTS.md` and `CLAUDE.md` at the project root point at this skill. They are the entry doc; this file is the operating manual.

## Conditional sub-guides — read when the work matches

These deeper guides live alongside this file under `references/`. The skill stays lean; reach into the right reference only when the task fits. Each is self-contained and can be opened directly with `Read`.

| When you're doing | Open the guide |
| --- | --- |
| Adding a new feature folder from scratch | [`references/new-feature.md`](references/new-feature.md) |
| Picking the right shape for a feature (provider / slots / hook / accessors) | [`references/features-anatomy.md`](references/features-anatomy.md) |
| Designing a prop API (callbacks, slots, render-props, fetcher, accessors) | [`references/api-patterns.md`](references/api-patterns.md) |
| Adding/refactoring a `*.strings.ts` file | [`references/strings-pattern.md`](references/strings-pattern.md) |
| Adding/wiring a `<UIProvider>` slice | [`references/ui-provider.md`](references/ui-provider.md) |
| Wrapping a shadcn primitive in `base/` | [`references/base-wrapper.md`](references/base-wrapper.md) |
| Building a row of "media + title/description + actions" | [`references/item-pattern.md`](references/item-pattern.md) |
| Building a form input row (label + control + error/hint) | [`references/form-field-pattern.md`](references/form-field-pattern.md) |
| Adding a preview page or section | [`references/preview-pages.md`](references/preview-pages.md) |
| Wiring framework-specific behaviour at a call site | [`references/consumer-wiring.md`](references/consumer-wiring.md) |
| Auditing or migrating import paths | [`references/import-paths.md`](references/import-paths.md) |
| Visual evaluation pass before declaring done | [`references/visual-eval.md`](references/visual-eval.md) |
| Adding tests for a component or feature | [`references/testing.md`](references/testing.md) |
| Working in the `layout/` layer (page shells, sidebars, header) | [`references/layout.md`](references/layout.md) |
| Placing a new card/widget inside `composed/` | [`references/composed-domains.md`](references/composed-domains.md) |
| Background reading on how the library reached publish-ready state | [`references/history.md`](references/history.md) |
| Looking for the next high-leverage piece of work | [`references/audit-followups.md`](references/audit-followups.md) |

Don't read all of them — find the matching guide for the immediate task, follow it, return.

## This is the only skill in this repo

There are no other skills shipped with this repo. The harness may surface generic skills (`frontend-design`, `shadcn`, `tailwind-v4-shadcn`, etc.) from the user's plugin set, but **this skill is the source of truth for anything inside `src/components/**`**. Where they conflict, this skill wins. The relevant material from those generic skills is inlined here:

- **Visual taste / "escape generic AI aesthetics"** → see rule 16 (visual evaluation) and the "Tone for visual work" section in `AGENTS.md`. The library voice is calm, neutral, dense without being cramped — admin density, not marketing flash.
- **Adding a shadcn primitive** → step 0 of [`references/base-wrapper.md`](references/base-wrapper.md): `npx shadcn@latest add <primitive>` lands the file in `src/components/ui/<primitive>.tsx`. Then write the wrapper.
- **Tailwind v4 + shadcn token architecture** → tokens live in `src/App.css` under `@theme inline { … }` (and the `:root` / `.dark` blocks for the variable values themselves). Read the comment blocks at the top of `App.css` before editing. Do **not** move design tokens into runtime CSS or component-level `style={}` props.

## 1. Never modify shadcn primitives directly

**`src/components/ui/*`** is the shadcn primitive layer. **Do not edit these files** to change defaults, sizes, density, or typography. Every file in `ui/` should be reproducible by re-running `npx shadcn@latest add <primitive>`. If a file in `ui/` doesn't roundtrip with shadcn, it doesn't belong there.

If you need a different version (denser, larger, themed):
- **Compose a wrapper** in `src/components/base/` that wraps the shadcn primitive and applies your variant.
- Or — if it's a one-off — pass `className` overrides at the call site.

The bare `@/components/ui/<primitive>` path is allowed **only** for base wrappers (e.g. `base/popover/popover.tsx` reaches into `@/components/ui/popover`). Anywhere outside `base/`, importing directly from `@/components/ui/*` is a layering violation — wrap the primitive first, or use the existing wrapper.

Touching shadcn primitives directly breaks the abstraction layer and means the next shadcn upgrade overwrites your work.

**Package-owned non-shadcn "primitives".** A few units of UI in this library are large, package-owned, opinionated implementations (Mapbox/Leaflet adapter, Google Places autocomplete) that are **not** shadcn primitives. They live in `src/components/base/` directly (e.g. `base/map/map.tsx`, `base/map/place-autocomplete.tsx`), not in `ui/`. They follow the same framework-agnostic / token-driven / strings-overridable rules as everything else in `base/`. Don't recreate them in `ui/` — `ui/` is shadcn-only.

## 2. The component layer order is sacred

```
src/components/
├── ui/         ← shadcn primitives — DO NOT EDIT
├── typography/ ← Text, Heading, Label, TextLink — peer to base, no upstream deps
├── base/       ← thin wrappers / compositions of UI primitives (Button, Card, Input, Badge, …)
├── layout/     ← page shells (header, sidebar, page) — built on base + ui, never imports features
├── composed/   ← domain-level cards & widgets built from base (cards, charts, commerce, navigation, timelines, AI)
└── features/   ← app-level features (filters, comments, overlays, search) — provider/callback-driven
```

Rules:
- `typography/` is a leaf alongside `ui/` — depends only on `@/lib/ui-provider`, `@/lib/utils`, `@/lib/sanitize-html`. Never imports from `base/`, `composed/`, `features/`, or `layout/`.
- A `base` wrapper imports from `ui/` and `typography/` (and other `base`). Never `composed`/`features`/`layout`.
- A `layout` shell imports from `base`, `typography`, `ui`. Never `composed`/`features`.
- A `composed` component imports from `base`, `typography`, `ui`. Never `features` or `layout`.
- A `features` component imports from `base`, `typography`, `composed`, `ui` — and its **default behaviour is callback-driven**, never hardcoded routing/i18n/data fetching.

When uncertain whether to add to `base` or `composed`: if it's a single visual element (Button, Badge, Input variant), it's `base`. If it's a row, card, or layout containing multiple primitives, it's `composed`. Pure text primitives (Text, Heading, Label, TextLink) live in `typography/`, not `base/`.

## 3. Typography — sm and xs are the workhorses

The `Text` component (`@/components/typography/text`) and `Heading` component (`@/components/typography/heading`) are **mandatory** for any user-facing text. Typography lives at the top-level peer layer alongside `ui/` — never under `base/`. Import via `import { Text, Heading, Label, TextLink } from '@/components/typography'`.

| Use case | Size |
| --- | --- |
| Hero numbers / page titles | `Heading` h2/h3 (rare) |
| Section headings | `text-base` weight=semibold (rare) |
| **Card titles, primary labels** | **`weight="semibold"`** (`sm` inherited) |
| **Body text, item labels** | **omit `size`** (`sm` inherited) |
| **Secondary / subtitles / metadata** | **`size="xs" type="secondary"`** |
| **Eyebrows / micro-labels / counts** | **`size="xxs" type="secondary"`** |

**`text-base` is rare.** Use it only for actual hero values. Default to `sm`/`xs`.
`<Text>` inherits `sm` from `UIProvider` (`typography.defaultTextSize`). Do not
write `size="sm"` unless you are intentionally pinning the size against provider
configuration or demonstrating size variants in a preview. Same rule for
`<Badge size="xs">` and `<Button size="sm">`: the defaults are provider-driven,
so omit those props at normal call sites.

Forbidden:
- `text-[10px]`, `text-[11px]`, `text-[13px]` — pick `xxs` / `xs` / `sm`.
- `<span className="text-sm font-semibold">` — use `<Text weight="semibold">`.
- `text-foreground/85` — use `Text type="secondary"` or `type="discrete"`.

## 4. Padding & whitespace — normal, not cramped

Admin density ≠ smashing things together. Use these defaults:

| Context | Padding |
| --- | --- |
| Inline pill / chip | `px-2 py-0.5` or `px-2.5 py-1` |
| List row (menu / popover item) | `px-2 py-1.5` minimum, `px-3 py-2` for richer menus |
| Section header inside a card | `px-3 py-2.5` |
| Card body | `p-4` (sm), `p-5` (base), `p-6` (lg) — see SmartCard PADDING |
| Page section | `gap-3` to `gap-6` between cards |

**Rows shorter than 28px (`h-7`) feel cramped.** Default menu items: `py-2` (≈32-36px tall with text-sm).

## 5. Use base components, not raw HTML+classes

| Don't | Do |
| --- | --- |
| `<button className="...">Click</button>` | `<Button>Click</Button>` |
| `<input className="...">` | `<Input>` from `base/forms/fields/input` |
| `<span className="text-xs text-muted-foreground">...</span>` | `<Text size="xs" type="secondary">...</Text>` |
| `<div className="rounded-full bg-success px-2 py-0.5 text-xs">x</div>` | `<Badge variant="success">x</Badge>` |
| Custom card div with shadow | `<SmartCard>` |
| Custom dialog markup | `<Dialog>` from `features/overlays` |
| `<div className="flex items-center gap-3 px-3 py-2.5"> <Icon/> <div><Text weight="semibold">…</Text><Text size="xs" type="secondary">…</Text></div> </div>` (icon-row pattern) | `<Item>` family from `base/item` |

Before you write JSX with utility classes, **check `base/` for an existing component**.

### Item — the canonical row primitive

Any "icon/avatar/image media + title/description text-stack + optional actions"
row goes through `base/item`. It comes from shadcn (`ui/item.tsx`, do not edit)
wrapped in `base/item/` which:

- Resolves `size` and `variant` against `<UIProvider>` (`useItemConfig()`).
- Routes `ItemTitle` through `<Text weight="semibold">` and `ItemDescription`
  through `<Text size="xs" type="secondary">` so typography stays in lockstep
  with the rest of the library — no rogue `<div className="text-sm font-medium">`
  blobs.
- Re-exports every compound part (`Item`, `ItemGroup`, `ItemSeparator`,
  `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`,
  `ItemHeader`, `ItemFooter`).

**The canonical shape:**

```tsx
import {
  Item, ItemGroup, ItemSeparator,
  ItemMedia, ItemContent, ItemTitle, ItemDescription,
  ItemActions, ItemHeader, ItemFooter,
} from '@/components/base/item';

<ItemGroup>
  <Item>                           {/* size + variant come from useItemConfig() */}
    <ItemMedia variant="icon">     {/* 'icon' | 'image' | 'avatar' | 'default' */}
      <Mail />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>kira@example.com</ItemTitle>
      <ItemDescription clamp={1}>Primary contact</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button buttonStyle="ghost" variant="secondary">Copy</Button>
    </ItemActions>
  </Item>
</ItemGroup>
```

`ItemTitle bold={false}` switches to body weight when the title is body-text-equivalent
(contact details, line items). Use `ItemDescription clamp={1|2|3|4|'none'}` to control
truncation; default is 2.

**Item header / footer** for richer rows: `ItemHeader` and `ItemFooter` span the
full width of the row, useful for "vendor + status" eyebrow above the main row
(`composed/dark-surfaces/order-items`) or "publisher + date" beneath the body
(`composed/ai/ai-citation`).

**Polymorphic `render`** turns any Item into a link or custom element without
breaking focus/hover styling:

```tsx
<Item render={<a href="/dashboard" />}>
  <ItemMedia variant="icon"><Home /></ItemMedia>
  <ItemContent>
    <ItemTitle>Dashboard</ItemTitle>
    <ItemDescription>Overview of your workspace</ItemDescription>
  </ItemContent>
</Item>
```

Use it for:
- Admin rows (`team-member`, `conversation-row`, `settings-toggle`).
- Card detail rows (`contact-card` email/phone/location).
- Settings menus, navigation rows (`category-nav`), dropdown rows.
- Anywhere two adjacent components currently disagree on `py-1.5` vs `py-2.5`.

Don't use it for:
- Form inputs — that's `FormField`/`ControlledFormField` (see next subsection).
- Cards with a header + body + footer that aren't list rows (`SmartCard`).
- Activity / timeline rows — those have a marker-rail layout (`ActivityRow`).
- Hero/dashboard surfaces with a single big number + chart (`Metric`,
  `GradientCard`, `MetricGradient`).
- Step ribbons / horizontal connector lines (`OrderStatusCard`,
  `ShipmentTrackingCard`, `BreadcrumbProgress`).

### FormField — the canonical form-row primitive

Form inputs go through `FormField` (presentational) or `ControlledFormField`
(react-hook-form-bound) from `@/components/base/forms`. The wrapper handles:

- Label rendering with `htmlFor`, the red asterisk for required, the standard
  `space-y-2.5` rhythm between label/control/error.
- Error / hint / helper-text precedence: `error` wins, otherwise `helperText`,
  otherwise `hint`.
- `aria-live="polite"` + `role="alert"` on error so screen readers announce
  validation state.
- For `ControlledFormField`: backend errors (Inertia/server) override
  validation errors, so server-side validation is authoritative.

**Pure presentational form row:**

```tsx
import { FormField } from '@/components/base/forms';
import { Input } from '@/components/base/forms/fields';

<FormField label="Email" required hint="We never share this">
  <Input value={value} onChange={setValue} />
</FormField>
```

**With react-hook-form binding:**

```tsx
import { ControlledFormField } from '@/components/base/forms';
import { Input } from '@/components/base/forms/fields';

<ControlledFormField
  name="email"
  control={control}
  error={getError}
  rules={{ required: true, pattern: /^\S+@\S+$/i }}
  label="Email"
  required
>
  {(field, error, invalid) => (
    <Input
      placeholder="you@example.com"
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      invalid={invalid}
    />
  )}
</ControlledFormField>
```

The render function gets `(field, error, invalid, fieldState)`. Pass `invalid`
straight through to the input — every `base/forms/fields/*` accepts it and
flips the destructive border + ring. Don't apply error styling yourself.

**Don't:**
- Hand-roll `<label>` + `<input>` + `<p className="text-destructive">…</p>`
  triplets at the call site. Use `FormField`.
- Pass `aria-invalid` or `data-invalid` to the input manually — pass
  `invalid={invalid}` and the field wrapper does it.
- Mix `<FormField>` and `<ControlledFormField>` for the same input — pick one.
- Reach for `<Field>` from shadcn directly. The shadcn `Field` primitive is
  there but our wrapper is the canonical entry point.

**Pairs with the strings pattern (rule 8):**
form labels and validation messages flow through `useStrings` at the call
site, the form field doesn't own them.

### Building a new component the right way — checklist

Before you write a single JSX line, walk this list. Skipping a step reliably
becomes "you keep fucking up things."

1. **Pick the layer.** Does the work fit `base/` (a single visual element, a
   primitive wrapper) or `composed/` (a row, card, or layout combining
   primitives) or `features/` (a callback-driven, framework-agnostic feature
   with provider + slots + strings)? Layer order is sacred (rule 2).

2. **Look for an existing primitive first.** If your component contains:
   - "icon-left + text-stack + actions" → reach for `<Item>` from `base/item`.
   - A label + control + error string → reach for `<FormField>` /
     `<ControlledFormField>` from `base/forms`.
   - Card with a header/title/headerEnd/actions → reach for `<SmartCard>`
     from `base/cards`.
   - Modal/Drawer/Confirm → reach for `<Dialog>` / `<Drawer>` /
     `<AlertDialog>` from `features/overlays`.
   - Status chip → `<Badge>` from `base/badge`.
   - Icon medallion → `<IconBadge>` from `base/display/icon-badge`.
   - Inline label-value pair → `<InlineStat>` from `base/display`.
   - Stacked user faces → `<StackedAvatars>`.
   - Currency / date / boolean / metric → `base/display/*` already has it.
   - Marker-rail timeline → `composed/timelines/shared/Timeline`.

   If two of these primitives nest (e.g. an `Item` row whose `ItemActions`
   contains a `Badge` + `Button`), that's the right shape. If you find
   yourself building all-new chrome with raw flexbox + utility classes, you
   missed a primitive — go back.

3. **Lock the folder shape.** A non-trivial component lives in its own folder
   under the chosen layer:

   ```
   <layer>/<name>/
   ├── <name>.tsx                # main entry
   ├── <name>.types.ts           # public types if there are any
   ├── <name>.strings.ts         # default strings + interface (rule 8)
   ├── partials/                 # internal pieces, exported via index.ts
   ├── hooks/                    # feature-specific hooks (rule 15)
   ├── index.ts                  # public surface
   └── <name>.css                # OPTIONAL — only when Tailwind can't express it
   ```

   `features/` MUST follow this layout (rule 11). `composed/` and `base/`
   follow it whenever the component is non-trivial (multi-file, has hooks,
   has strings, has internal partials).

4. **Strings before JSX.** Define `<Name>Strings` interface +
   `default<Name>Strings` in `<name>.strings.ts` BEFORE writing the
   component. Every user-facing string lives there. Component accepts
   `strings?: StringsProp<<Name>Strings>` and resolves with
   `useStrings(default<Name>Strings, stringsProp)` (rule 8 + rule 9). No
   hardcoded English in JSX.

5. **Provider before props.** If the component has a sensible library-wide
   default (size, variant, density, formatter), wire it through
   `<UIProvider>`: pick the right slice or add a new one (`useFooConfig()`),
   resolve as `props.X ?? config.X ?? hardcodedFallback` (rule 17).

6. **Callbacks, not router calls.** Every action exposes a callback prop
   (`onSubmit`, `onDelete`, `onSelect`, `onAfterMutate`, `onError`). The
   library never calls `router.post(...)` / `navigate(...)` itself
   (rule 9). The consumer wires their framework at the call site.

7. **Typography from `<Text>` and `<Heading>`.** Default size is `sm`
   (rule 3) — omit `size` unless intentionally pinning. Card titles are
   `<Text weight="semibold">`; secondary lines are
   `<Text size="xs" type="secondary">`. Inside `Item`, just use `ItemTitle`
   / `ItemDescription` and the wrapper handles it.

8. **Density follows the base tokens.** Padding for rows, menu items,
   cards, and section headers is in rule 4's table. Don't invent
   `py-1.5` if `py-2` is the standard for that surface.

9. **Tokens stay semantic.** Use `success` / `warning` / `destructive` /
   `info` / `primary` / `muted`. Never `bg-chart-N` for "category color"
   (rule 6). The chart tokens are only for genuine multi-series charts.

10. **`forwardRef` + `displayName` on every interactive component**, and
    name the file the kebab-case of the component (`badge.tsx`,
    `category-nav.tsx`).

11. **Slots and render-props for composability** (rule 13). If a consumer
    might want to change one piece of internal layout, expose it as a
    `ReactNode` slot, a `render*` prop, or an exported partial. Don't
    force forks.

12. **Verify before claiming done.** Run `npx tsc --noEmit
    --ignoreDeprecations 6.0`, navigate to the component's preview page,
    confirm zero console warnings/errors, eyeball it at desktop + narrow
    viewport (rule 16's five-question check).

If a step is genuinely not applicable (e.g. a base wrapper with no user
strings), say so explicitly in the component's header doc-comment so the
next reader doesn't think it was forgotten.

## 6. Tokens — semantic only, respect shadcn theme composition

### Forbidden as semantic colour
`chart-1`, `chart-2`, `chart-3`, `chart-4`, `chart-5` — these are grayscale palette tokens for stacked-chart bars. They are **NOT** semantic colours. Using `bg-chart-1` for "success" gives you gray. Always wrong.

**Subtle exception**: chart tokens ARE legitimate inside actual chart visualizations where the visual intent is "five distinguishable series" rather than "this means success/warning/etc.". A heatmap with intensity steps is **NOT** that case — heatmap intensity is a single semantic axis (low → high) and should be `bg-success/N` opacity steps, not `bg-chart-1/N`. A multi-series bar chart legitimately uses chart-1 through chart-5.

### Use semantic tokens
- `success` / `success-foreground` — green for confirmations, completed states
- `warning` / `warning-foreground` — amber for caution, pending states
- `destructive` / `destructive-foreground` — red for errors, destructive actions
- `info` / `info-foreground` — blue for neutral notices, info chips
- `primary` / `primary-foreground` — brand colour
- `muted` / `muted-foreground` — neutral grays

### Adding new variants
If you need a new colour variant in `App.css` (e.g. a "premium" gold):
- Add the variable in BOTH the `:root` light and `.dark` dark scope
- Add `--color-<name>: var(--<name>)` in `@theme`
- **Comment it** with what it's for and where it's used
- Don't repurpose existing variables

### Respect shadcn token composition
The shadcn primitives compose against `--background`, `--foreground`, `--card`, `--card-foreground`, `--border`, `--input`, `--ring`, `--popover`, etc. When wrapping primitives in `base/`, use these same tokens — don't introduce a new colour just because.

## 7. Read components and APIs before changing them

Before any non-trivial change:
1. **Read the component file** in full
2. **Read its types file** if separate
3. **Read its index** to see what's exported
4. **Grep for callers** to understand usage patterns

Don't assume an API. Don't add a prop you didn't verify the component supports. Don't override classes without understanding what the component already applies.

## 8. Internal strings — defaults + override pattern, always

Any user-facing string in a component must use the strings pattern:

```ts
// types.ts
export interface FooCardStrings {
    title: string;
    actionLabel: string;
    emptyState: string;
}

export const defaultFooCardStrings: FooCardStrings = {
    title: 'Foo',
    actionLabel: 'Open',
    emptyState: 'Nothing here yet',
};

// foo-card.tsx
import { useStrings } from '@/lib/strings';
import { defaultFooCardStrings, type FooCardStrings, type FooCardProps } from './types';

export function FooCard({ strings: stringsProp, ...rest }: FooCardProps & { strings?: Partial<FooCardStrings> }) {
    const strings = useStrings(defaultFooCardStrings, stringsProp);
    return <h2>{strings.title}</h2>;
}
```

Forbidden:
- Hardcoded English strings inside JSX (`<button>Cancel</button>`)
- Strings duplicated across components — co-locate per-component, never share unless they truly are global.

## 9. Features must be framework-agnostic

A `features/*` component that ships in this library has to work in Inertia, Tanstack Router, RR7, Next.js, plain Vite, anywhere. That means:

- Accept callbacks (`onSubmit`, `onSelect`, `onDelete`, `onResultSelect`, `onChange`) — never hardcode `router.post(...)`, `navigate(...)`, etc.
- Accept data via props — never fetch from a hardcoded endpoint. For async UI (autocompletes, async-select), accept a `fetcher` callback.
- Strings via the `strings`/`defaultStrings` pattern (rule 8). No `useI18n()` import inside the library.
- Per-mount config (resources, accessors, callbacks) flows as props.
- Library-wide display defaults flow through `<UIProvider>` (see rule 17).

### Forbidden imports anywhere in `src/components/**`

The library — including every feature, partial, hook, helper, and any module re-exported by `index.ts` — MUST NOT import any of:

- `@inertiajs/*`, `ziggy-js`
- `next/*`, `react-router*`, `@tanstack/react-router`
- `@tanstack/react-query`
- `vite-bundled-i18n/*`
- Any backend SDK (Supabase, Firebase, …)

There is **no** `adapters/$framework/` folder, no presets folder, no recipes folder inside `src/components/**`. The consumer wires their framework at the call site:

```tsx
<Comments
    onSubmit={(values) => router.post('/comments', values)}
    onDelete={(id) => router.delete(`/comments/${id}`)}
/>
```

If a consumer pattern repeats across many mount sites, they wrap our component in their own `<AppComments>` that forwards their defaults — we do not provide that wrapper.

There is **no** `src/lib/external-stubs/` folder. Anything the library imports must be a real `dependencies` (or `peerDependencies`) entry in `package.json`.

### Validation libraries (Zod / Valibot / Yup)

Same rule. The library MUST NOT depend on a validation library. Validators are a strong fit for the consumer-injection pattern:

```ts
// `(value) => true | string` — true when valid, string when invalid (the message).
type Validator = (value: unknown) => boolean | string;
```

Filter facets / form fields accept that shape via
`validation.custom`. The library ships two adapters in
[`features/filters/validators.ts`](../../../src/components/features/filters/validators.ts):

- `zodValidator(schema)` — adapts any object with a `safeParse(v) =>
  { success, error }` method (Zod 3, Zod 4, Valibot via thin shim).
- `predicateValidator(predicate, message)` — pairs a boolean
  predicate with a static error message; no third-party dep needed.

Pattern at the call site is the consumer's:

```tsx
import { z } from 'zod';
import { zodValidator } from '@/components/features/filters';

validation: { custom: zodValidator(z.string().email()) }
```

If a new component needs validation, follow the same shape — accept
`(value) => boolean | string`, never `Schema` directly. See
[`api-patterns.md`](references/api-patterns.md) for the full
prop-shape cheat sheet.

## 10. Showcase pages reflect the components, not custom mocks

Preview pages in `src/preview/pages/**` should:
- Import the actual `base`/`composed`/`features` components
- Pass realistic data through their actual API
- **Not** reimplement the component visually for the preview (we did this for tiptap because it can't run without the package — note the comment when this happens)

When a preview shows something the component doesn't render correctly: **fix the component**, not the preview.

**Smell**: a preview page contains 100+ lines of inline JSX defining a "private" version of the component. That's a sign the underlying feature isn't expressive enough — fix the feature (add slots/render-props/exported partials), then trim the preview to a thin demo.

## 11. Feature folder shape — strict

Every `features/$feature/` MUST follow this shape:

```
features/$feature/
├── index.ts                # public exports only — the package surface
├── $feature.types.ts       # shared types
├── $feature.strings.ts     # FeatureStrings interface + defaultFeatureStrings
├── $feature.tsx            # main entry component (or feature-context.tsx + feature-layout.tsx)
├── partials/               # internal pieces — exported via index.ts when reusable
├── hooks/                  # feature-specific hooks (with index.ts barrel)
└── $feature.css            # OPTIONAL — only when Tailwind cannot express the styling
```

There is no `adapters/` folder. Framework wiring is the consumer's job at the call site (rule 9).

Acceptance criteria for the public API:
1. `import { Feature, FeatureRow, useFeature } from '@/components/features/$feature'` works.
2. Consumer can override every internal partial via render-prop OR by composing exported partials directly.
3. Consumer can replace any user-facing string via `<Feature strings={{ … }} />` (deep-partial).
4. Consumer can integrate the feature without the library importing any framework integration package.

The same shape applies (in spirit) to non-trivial `composed/` and `base/` components — folder, types file, strings file when applicable, optional `partials/` and `hooks/`.

## 12. Base wrapper requirement — make new ones liberally

Every shadcn primitive used in 2+ places SHOULD have a `base/` wrapper. **Do not hesitate to add new base components when needed** — that's the whole point of the abstraction layer.

Wrapper API contract:
- Accept the primitive's props by spread; do not narrow them unnecessarily.
- Apply design-system defaults: typography from `Text`, padding from the density tokens, focus-visible ring, semantic colour tokens.
- Re-export the primitive's child parts (`PopoverTrigger`, `CommandList`, …) with thin wrappers OR untouched — wrapping the root only is usually enough; the compound-component pattern from shadcn must keep working.
- Expose a `variant` prop only when the variation is real and used. Don't pre-build variants nobody asked for.
- Document with a brief block comment: which primitive, what defaults are applied, when a consumer would override.

Existing wrappers — DO NOT recreate, prefer them:
- `base/popover/` (wraps `ui/popover`) — every filter facet, mention picker, popover menus
- `base/command/` (wraps `ui/command`) — every cmdk surface
- `base/popover-menu/` — composed of `base/popover` + `base/command`
- `base/sheet/` (wraps `ui/sheet`) — slide-in panels (mobile sidebar, drawers)
- `base/sidebar/` (wraps `ui/sidebar`) — every sidebar shell, used by `layout/sidebar`
- `base/navigation/` (re-exports `ui/dropdown-menu`, `ui/breadcrumb`, etc.) — use for menus, dropdowns, action menus
- `base/forms/` — `FormField`, `ControlledFormField`, plus `fields/` (Input, Select, Textarea, Checkbox, Switch, repeaters, …)
- `base/cards/` (SmartCard) — every domain-card chrome
- `base/item/` — canonical "icon + title-stack + actions" row primitive
- `base/spinner/` — every loading spinner
- `base/badge/`, `base/buttons/`, `base/combobox/`, `base/copyable/`, `base/currency/`, `base/date-pickers/`, `base/display/` (Avatar, Tooltip, Separator, IconBadge, InlineStat, Metadata), `base/event-calendar/`, `base/map/`, `base/table/`, `base/toaster/`

Add a new wrapper liberally when you encounter the same primitive being inlined with class blobs in 2+ places. Don't wait for permission — that's exactly what the `base/` layer is for.

## 13. Composability via slots, render-props, and hooks

Complex components MUST expose composition seams:
- **Slots**: named `ReactNode` props (`header`, `footer`, `leading`, `trailing`, `empty`, `loading`, `recent`).
- **Render props**: `renderResult={(item, ctx) => …}`, `renderTrigger={(props) => …}` for custom inner rendering.
- **Headless hooks**: every feature with internal state SHOULD expose a `useFeature*` hook so consumers can build entirely custom UIs against the same state machine.
- **Callbacks**: `onOpen`, `onClose`, `onSelect`, `onAfterMutate`, `onError` — not just the primary action.

Two-line rule: if a consumer asks "how do I customize X" and the answer requires a fork, you have a composability hole.

## 14. Theming surface — beyond shadcn tokens

Shadcn tokens (`--background`, `--foreground`, `--card`, etc.) are the foundation. Beyond them, expose component-level CSS variables in `App.css` `@theme` so consumers can rebrand without forking:

- **Typography scale** — `--text-xxs`, `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`. The `Text`/`Heading` components read from these, so a consumer can resize the entire library at `:root` for denser/sparser dashboards.
- **Density** — `--row-py-tight`, `--row-py-default`, `--row-py-loose`. List rows in filters/global-search/comments/analytics consume these.
- **Component-specific** — when a single component reasonably needs override (`--filter-chip-h`, `--popover-content-pad`), add a variable and document where it's read.

Document each new variable in `App.css` with a comment listing the consuming components.

## 15. Hooks colocation

Feature-specific hooks live INSIDE the feature folder under `hooks/`. Only put hooks in the global `src/hooks/` directory if they're genuinely cross-cutting (e.g. `use-mobile`, `use-debounce`, `use-event-listener`).

When you find a feature-specific hook in the global folder, move it.

## 16. Visual evaluation pass — non-negotiable before "done"

Before declaring any visual change done:
1. **Screenshot at the actual rendered DPI**, viewport ≥ 1024px (and a narrower viewport when the component is responsive).
2. **Five-question check** — answer each, fix any "no":
   - Does the spacing breathe? (no cramped rows, no orphan gaps, consistent rhythm)
   - Does the typography read in a clear hierarchy? (sm/xs/xxs working as the rule prescribes)
   - Does the active/hover/focus state feel intentional, not accidental?
   - Does it match the rest of the library's voice — admin-density, neutral-modern, calm?
   - Could a designer find one obvious thing to fix in 3 seconds? If yes, fix it.
3. If a row's height shifts as you toggle states, fix the height. If two adjacent components have different paddings for the same role, pick one. Detail matters.

## 17. `<UIProvider>` — single source of library-wide display defaults

There is exactly **one** library provider: `<UIProvider>` from `@/lib/ui-provider`. It holds the small set of values consumers want to set once at the root and never repeat. A representative (non-exhaustive) list:

- `money.defaultCurrency`, `money.locale`, `money.formatMode`, `money.dualPricingEnabled`, …
- `dates.weekStartsOn`, `dates.format`, `dates.formatRelativeTime`, …
- `comments.composerPosition`, `comments.maxAttachments`, `comments.allowReactions`, …
- `filters.debounceMs`, `filters.defaultPageSize`
- `forms.defaultControlSize`, `forms.defaultLabelSize`
- `table.defaultSize`
- `typography.defaultTextSize`
- `badge.defaultSize`
- `item.defaultSize`, `item.defaultVariant`
- `button.defaultSize`, `button.defaultButtonStyle`
- `card.defaultPadding`
- `toast.duration`, `toast.position`
- `spinner.defaultVariant`
- `media.resolveUrl`, `media.resolveName`

> **Source of truth**: the canonical, up-to-date slice list lives in
> [`src/lib/ui-provider/types.ts`](../../../src/lib/ui-provider/types.ts) (the `UIConfig` union and its slice types). The bullet list above is informational; trust the file when they disagree.

Implemented as a single zustand store; consumers read via slice hooks (`useMoneyConfig()`, `useBadgeConfig()`, `useItemConfig()`, `useDatesConfig()`, …). Slice-scoped subscriptions: components that read `money` do not re-render when `dates` changes.

### Resolution rule (universal)

```
const resolved = props.X  ??  useFooConfig().X  ??  hardcodedFallback;
```

The store is initialized with `DEFAULT_UI_CONFIG`, so a component without `<UIProvider>` mounted still works. A consumer overriding at the root means every mount inherits; a per-mount prop override always wins.

### What does NOT go in `<UIProvider>`

- Per-mount runtime callbacks: `onSubmit`, `onDelete`, `onChange`, `onResultSelect`, `fetcher`, `onUpload`. These flow as direct props.
- Per-mount data: comment lists, mention resource registries used by one specific surface. Direct props.
- User-facing strings: use the `strings={{}}` prop pattern. The library has no concept of locales or translators.

If a consumer ends up repeating the same callback wiring across many mount sites, they wrap our component in their own `<AppComments>` that forwards their defaults — we do not provide that wrapper.

### Adding a new slice

1. Add the slice type to `src/lib/ui-provider/types.ts`.
2. Add hardcoded library defaults to `src/lib/ui-provider/defaults.ts`.
3. Add a selector hook to `src/lib/ui-provider/hooks.ts`.
4. Re-export the new types and hook from `src/lib/ui-provider/index.ts`.
5. Use the slice hook inside the consuming component, applying the precedence rule above.

### No dead slices

A provider slice that no consumer reads is a smell — either wire it (read it from the relevant component with the resolution rule) or delete it. Future contributors trust the slice list as advertised; dead slices teach them the wrong shape. When you add a slice, add at least one consumer in the same change.

### No size-pinning in wrappers

When a wrapper composes another size-aware base component, **do not pin a literal size to it**. Pinning blocks the resolution chain (`props.X ?? config.X ?? fallback`) so the consumer's `<UIProvider>` override can never reach the inner component.

```tsx
// ❌ TextButton always renders BaseButton at size="xs", even if the consumer
//    set <UIProvider button={{ defaultSize: 'sm' }}>.
<BaseButton size="xs" {...props} />

// ✅ Forward the resolved size so BaseButton can apply its own resolution.
<BaseButton size={resolvedSize} {...props} />
```

If the wrapper genuinely needs a narrower size space (e.g. `'xs' | 'sm' | 'base'`), declare its own `size` prop in that narrower type and map it to the inner component's space — but still forward it.

## 18. Import-path discipline — exactly one path per destination

There must be **one** canonical import path per module. The codebase had a legacy `@/components/ui/base/*` alias that resolved to `@/components/base/*`; that aliasing is gone. New code uses:

- `@/components/typography/*` — Text, Heading, Label, TextLink (top-level peer)
- `@/components/base/*` — base wrappers
- `@/components/composed/*` — composed surfaces
- `@/components/features/*` — features
- `@/components/layout/*` — page shells (header / sidebar / page)
- `@/components/ui/*` — shadcn primitives (only consumed by their direct base wrapper)
- `@/lib/ui-provider`, `@/lib/strings`, `@/lib/utils` — shared utilities

Forbidden patterns (these were aliases that no longer resolve — they will fail at build time):

- ❌ `@/components/ui/base/*`
- ❌ `@/components/ui/typography*`
- ❌ `@/components/ui/primitives/shadcn/*`
- ❌ `@/components/typography/*` re-exporting from `base/typography/*` (the typography directory IS the source of truth now; never reintroduce the shim)

If you find a re-export shim where the "real" implementation lives elsewhere, delete the shim and codemod its importers. Two paths to one destination always rot — pick one.

## 19. Strings file consolidation — per-feature, not per-partial

When several partials in the same feature share user-facing copy, consolidate into one `*.strings.ts` at the feature root with multiple exported interfaces — don't define `Strings` interfaces inline inside partial files.

```ts
// ✅ features/mentions/mentions.strings.ts
export interface MentionPickerStrings { /* … */ }
export const defaultMentionPickerStrings: MentionPickerStrings = { /* … */ };
export interface MentionInlineSuggestionsStrings { /* … */ }
export const defaultMentionInlineSuggestionsStrings: MentionInlineSuggestionsStrings = { /* … */ };

// ❌ features/mentions/partials/mention-picker.tsx
const DEFAULT_STRINGS = { /* … */ };  // inline duplicate, easy to drift
```

Then the partials and the feature index re-export from the single file:

```ts
// features/mentions/partials/mention-picker.tsx
import { defaultMentionPickerStrings, type MentionPickerStrings } from '../mentions.strings';
import { useStrings, type StringsProp } from '@/lib/strings';

export function MentionPicker({ strings: stringsProp, … }: { strings?: StringsProp<MentionPickerStrings> }) {
    const strings = useStrings(defaultMentionPickerStrings, stringsProp);
    // …
}
```

Always use `useStrings(defaults, override)` from `@/lib/strings` — never an inline `{ ...DEFAULT, ...override }` shallow merge. `useStrings` handles deep partials and is memoised.

When backward compatibility for previously-inline interfaces matters, re-export the type from the partial: `export type { MentionPickerStrings }`. Don't duplicate the shape.

## 20. Preview registry stays in sync with the file tree

Every preview page under `src/preview/pages/**` MUST appear in `src/preview/registry.tsx`, registered to the right section (`'UI' | 'Base' | 'Common' | 'Composed' | 'Features' | 'Layout'`). Adding a preview page without registering it produces dead files — they exist on disk but don't appear in the showcase, which silently rots.

When adding a new preview page:
1. Create `src/preview/pages/<section>/<Name>Page.tsx`.
2. Add a `{ id, label, section, family, component, status }` entry in `registry.tsx`.
3. Pick or reuse a `family` — the sidebar groups by family within a section.
4. Verify the entry shows in the section nav by reloading the showcase.

When adding a new section (rare): extend the `PreviewEntry['section']` union, add it to `SECTION_ORDER`, then register pages.

---

## Reference implementations — copy these shapes

Five feature folders in this repo are the canonical examples of every rule above. When in doubt, model new work on them; don't reinvent the pattern.

- **`features/global-search/`** — folder shape (`*.types.ts`, `*.strings.ts`, `partials/`, `hooks/`), strings prop deep-merged with defaults via `useStrings`, slots (`input`, `tabs`, `idle`, `empty`, `loading`, `footer`, `renderResult`, `toneBg`, `toneAvatar`), headless `useGlobalSearch` hook. Every partial individually exported from `index.ts`. Framework-agnostic — consumer wires `onResultSelect` at the call site.
- **`features/filters/`** — provider-driven state (`FilterProvider` + `useFilters`), composition partials (`<ActiveFilterItem>`, `<FilterOperatorSelect>`, `<FiltersButton>`, …) all exported so consumers can build a custom strip without `<FilterLayout>`. Peer-dep-free `useAsyncOptions` hook (with `useFiltersConfig` resolution chain) replaces what was a `useQuery` integration.
- **`features/comments/`** — strings file at the feature root, callback-based `onSubmit(values, helpers)` / `onDelete(id)`, `composerSlot` for BYO editor when TipTap isn't installed, `CommentsAccessors` (`getMediaUrl`, `getMediaName`, `getStatusLabel`, `formatRelativeTime`) for domain mapping.
- **`features/mentions/`** — multi-interface strings file (`MentionPickerStrings` + `MentionInlineSuggestionsStrings` in one `mentions.strings.ts`), partials consume via `useStrings`, types re-exported from partials for backward compat. Headless `useMentions` + `useMentionsSearch` hooks.
- **`features/rich-text-editor/`** — `rich-text-editor.strings.ts` covers toolbar (Bold/Italic/etc.) + counts, deep-partial via `StringsProp`, both Tiptap and Fallback paths consume the same strings. Reference for "two implementation modes share one strings interface".

Base-layer references:

- **`base/popover/popover.tsx`** + **`base/command/command.tsx`** — wrap-the-root pattern: defaults applied to the primitive root (density-tokenized padding, library-default `sideOffset`, `text-[length:var(--text-xs)]`); compound parts re-exported untouched so the shadcn pattern keeps working.
- **`base/popover-menu/popover-menu.tsx`** — composed wrapper: combines `base/popover` + `base/command` for the recurring "trigger → optional header → search → list" pattern, with slots (`header`, `footer`, `empty`, `loadingSlot`), render-prop (`renderItem`), and a `strings` prop.

Token-level references:

- **`src/App.css`** — typography font-size variables (`--text-xxs/xs/sm/base/lg`), density tokens (`--row-py-tight/default/loose`), component knobs (`--popover-content-pad`). The `.text-*` utility overrides further down route Tailwind through these variables so consumers can override at `:root`.
- **`composed/analytics/analytics.strings.ts`** — strings file shape used across composed surfaces.

If a new feature you're adding doesn't structurally resemble at least one of these, you're probably off-pattern. Stop and re-read the rule that applies.

## 21. Locale-agnostic library

The library has **no concept of an application locale**. It does not ship Bulgarian / German / French translations baked in, does not detect `navigator.language`, does not take an `'en' | 'bg'` enum prop. Every locale-flavoured concept flows in:

- **User-facing strings** — via the `strings` prop merged through `useStrings(defaults, override)`. The defaults are English; consumers map their backend i18n into the prop.
- **`date-fns` Locale objects** — accept a `locale?: import('date-fns').Locale` prop directly and forward it to `date-fns` formatters / `react-day-picker`. Default to `enUS` when none is passed. Never accept a string locale identifier the library has to map.
- **Number / currency / date formatters** — read via `useMoneyConfig().locale` and `useDatesConfig().locale`. Consumers set their root locale once on `<UIProvider>`.

Forbidden:

- ❌ Files like `date-picker-locales.ts` that enumerate `'en' | 'bg' | 'de'` and hold translation maps.
- ❌ Calling `navigator.language` inside the library.
- ❌ A `detectAppLocale()` helper.
- ❌ An `appLocale: AppLocale` prop on a base component.
- ❌ Country-name maps with English `label` fields baked into a base component (e.g. phone-input). Country lists are user-facing data — accept them as a prop.

If a base component needs locale-flavoured behaviour, accept a `Locale` object and a `strings` prop. The consumer wires both.

## 22. Console hygiene — DEV-guarded only

A library never logs to the consumer's production console. Every `console.error` / `console.warn` MUST be guarded:

```ts
// ✅
if (import.meta.env?.DEV) {
    console.warn('[Foo] something off');
}

// ❌ leaks to every consumer's prod console
console.error('Foo failed', err);
```

For errors that consumers need to react to (async submit failures, fetch errors), accept an `onError?: (err: unknown) => void` prop and surface them through that — the consumer wires it to their telemetry. The DEV log stays as a developer breadcrumb.

Class-based ErrorBoundaries (`componentDidCatch`) get the same treatment: DEV-log, then `window.dispatchEvent(new CustomEvent('feature-error', { detail: … }))` so the consumer can hook telemetry without the library knowing about Sentry / Datadog / etc.

## 23. Ambient consumer types — banned in the library

A library can't read consumer-app ambient module types (`Modules.Core.Currencies.Currency`, `App.Models.User`, etc.). They live in the consumer's `*.d.ts` and aren't part of the published artifact. Any base/composed/feature component that references them won't type-check after `pnpm pack`.

Forbidden:

- ❌ `import type { Currency } from 'Modules/Core/Currencies'` inside the library.
- ❌ Reaching into a global `App.*` namespace.

Fix: define the type **locally** in the library (`@/lib/ui-provider/types.ts` or the component's `types.ts`), and parameterize via generics where the consumer needs to pass their own shape.

## Workflow when you spot a problem

1. **Identify which layer owns the issue.** Is it a primitive (`ui/`), a wrapper (`base/`), a composed surface (`composed/`), or a feature (`features/`)?
2. **Read the file and its callers.**
3. **Pick the right layer to change.** If a Button looks wrong everywhere, fix `base/buttons/button.tsx`. If only one card looks wrong, fix that card.
4. **Use base components.** Replace any raw `<span className="...">` or `<button>` with the equivalent base component.
5. **Verify with tsc + a screenshot.** Reload the dev server before you claim it's done.

## Anti-patterns I keep falling into (correct yourself when tempted)

- ❌ "Let me just edit the shadcn primitive to make it smaller." → Wrap or compose instead.
- ❌ "I'll use `<span className='text-[10px]'>` for this eyebrow." → `<Text size="xxs">`.
- ❌ "I'll inline a custom popover header here." → Use `Text` + `Heading` + a `border-b` div, with proper paddings.
- ❌ "The screenshot is too zoomed in to compare." → It's still your problem; fix it for the actual rendered DPI.
- ❌ "I'll wrap the icon in a `bg-muted` square." → Plain icon usually reads better; only add a container when it's load-bearing.
- ❌ "I'll bypass the design tokens with a hex." → Use semantic tokens; add a new variant in App.css with a comment if you genuinely need one.
- ❌ "I'll hardcode 'Cancel' here, it's just temp." → It will not be temp. Use defaultStrings.
- ❌ "Let me make this row super tight at `py-0.5`." → That's cramped. `py-1.5` minimum unless explicitly compact.
- ❌ "I'll just `import { useQuery } from '@tanstack/react-query'`." → It's a peer-dep. Accept a `fetcher` prop. Adapter folders no longer exist; the consumer wires their query lib at the call site.
- ❌ "I'll wire `router.visit(result.url)` directly inside the feature." → Pass `onResultSelect(result)`. Consumer maps it to their router at the call site.
- ❌ "I'll import from `@/components/ui/base/...`." → That alias was removed. Use `@/components/base/...` (or `@/components/typography/...` for Text/Heading/Label/TextLink).
- ❌ "I'll import Text from `@/components/base/typography`." → Typography moved up a layer. Use `@/components/typography`.
- ❌ "I'll add a `Strings` interface inline in the partial file." → Consolidate to `feature.strings.ts` at the feature root, even when there's only one partial.
- ❌ "I'll do `{ ...DEFAULT_STRINGS, ...override }` shallow merge." → Use `useStrings(defaults, override)` from `@/lib/strings` — handles deep partials and is memoised.
- ❌ "I'll hardcode `size='xs'` to BaseButton inside my wrapper." → Forward the resolved size so the provider chain can apply. Pinning blocks `<UIProvider button={{ defaultSize }}>` from reaching the inner component.
- ❌ "I'll add a slice to `useFooConfig` and skip wiring a consumer for now." → Don't. Dead slices rot. Wire at least one consumer in the same change, or don't add the slice.
- ❌ "I'll add a preview page but skip registering it." → Files in `src/preview/pages/**` not listed in `registry.tsx` are dead. Always register.
- ❌ "I'll re-export from a shim folder for back-compat." → Two paths to one destination always rot. Delete the shim and codemod importers.
- ❌ "I'll bake a `bg` translation alongside `en` so the consumer doesn't need to wire it." → Library is locale-agnostic. Ship English defaults only. Consumer maps their i18n into `strings={{ … }}` (rule 21).
- ❌ "I'll detect the browser locale with `navigator.language` so it Just Works." → No. Library never reads consumer environment. Accept a `locale?: Locale` prop and let the consumer pick.
- ❌ "I'll `console.error` in the catch block — useful for debugging." → Wrap in `if (import.meta.env?.DEV)`. Surface real errors via an `onError` callback for the consumer (rule 22).
- ❌ "I'll import `Modules.Core.Currencies.Currency` for the type." → That's an ambient type from the consumer's app, not the library. Define a local type and parameterize via generics (rule 23).
- ❌ "Heatmap intensity step looks like a chart, I'll use `bg-chart-1/20`." → Heatmap intensity is a single semantic axis; use `bg-success/N` opacity steps. Chart tokens are for multi-series charts only (rule 6).
- ❌ "I'll call `useI18n()` from inside the component." → Strings flow via `<Feature strings={{ … }}>` merged with `default*Strings`. Backend i18n maps INTO that prop at the call site, not inside the feature.
- ❌ "Backdrop should be `bg-primary/70`." → That's a brand wash, not a dim. Use `bg-foreground/50 backdrop-blur-[1px]`.
- ❌ "I'll use `text-orange-600 dark:text-orange-400` for warning." → `text-warning`. Same for `text-info`, `text-success`, `text-destructive`.
- ❌ "`focus:ring-2 focus:ring-ring`." → `focus-visible:` so mouse clicks don't ring.
- ❌ "I'll re-implement the GlobalSearch / Comments / Filters layout in the preview page." → That's a smell; the underlying feature is missing a slot or render-prop. Add the seam, then make the preview a thin demo.
- ❌ "Edit failed with 'string not found' but it looks identical." → Tabs vs. spaces. Re-Read the file fresh; if the diff is genuinely indistinguishable on screen, fall back to a `python3` patch via Bash.
- ❌ "Console shows `ReferenceError` after my fix." → Almost always stale Vite logs from a prior bad save (`?t=…` URL is the timestamp from BEFORE your latest reload). Check the rendered DOM, not the log tail.
- ❌ "I'll commit my changes." → Don't commit unless explicitly asked. Same for push, PR creation, branch deletion.

When you're about to do any of these, stop and pick the proper path.
