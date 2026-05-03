# Admin UI Starter Kit

> **An opinionated React component kit for admin panels and SaaS dashboards,
> built on top of [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com).**
>
> shadcn gives you primitives. Admin UI Starter Kit gives you the *next* layer up — the
> typography rules, the row primitive, the form-field wrapper, the
> provider-driven defaults, the framework-agnostic feature surfaces — so the
> 90% of admin-panel UI that's the same everywhere actually *is* the same.

```bash
npm install admin-ui-starter-kit react react-dom tailwindcss lucide-react
```

```tsx
import { Button } from 'admin-ui-starter-kit/base/buttons';
import { Item, ItemContent, ItemMedia, ItemTitle } from 'admin-ui-starter-kit/base/item';
import { Mail } from 'lucide-react';
import 'admin-ui-starter-kit/style.css';

<Item>
  <ItemMedia variant="icon"><Mail /></ItemMedia>
  <ItemContent>
    <ItemTitle>kira@example.com</ItemTitle>
  </ItemContent>
</Item>
```

---

## Why this exists

shadcn/ui ships **primitives** — Button, Input, Dialog, Popover, Table, etc.
They're great. But they're the bottom layer.

Anyone building an admin panel has to invent the next layer themselves:
- A row primitive ("avatar + title + description + action") — every admin has dozens of these.
- A form-field wrapper that handles label + control + error/hint + react-hook-form binding.
- A typography system so every secondary line in every card is the same `xs / muted-foreground`.
- A provider for library-wide defaults (currency, week-start, density) — set once at the root.
- An i18n hook so internal strings stay overridable without coupling to any specific i18n library.
- A way to ship features (comments, filters, overlays, search) that work in **any** React app — Next.js, Vite, Inertia, Remix, Tanstack Router — without hardcoding the routing or data layer.

Admin UI Starter Kit is that next layer. You bring shadcn + Tailwind. We bring everything
between primitives and your routes.

## Who this is for

- **Admin panels** — internal tools, vendor dashboards, customer-success consoles.
- **SaaS interiors** — settings pages, billing pages, user management, audit logs.
- **B2B back-offices** — anything where the UI is functional, not marketing.

If you're building a marketing landing page, this isn't your tool. If you're
shipping the 27th internal "manage users" screen of your career, **this is
exactly your tool.**

## Five non-negotiable principles

1. **Layered architecture.** `ui/` (shadcn primitives, never edited) →
   `base/` (typography-aware wrappers) → `composed/` (domain rows + cards) →
   `features/` (callback-driven feature surfaces) → `layout/` (app shells).
   Enforced by `npm run lint:architecture`.
2. **Framework-agnostic by default.** Zero hard-coded calls into Inertia,
   Next.js, react-router, react-query, or any other peer. Every action is a
   callback the consumer wires at the call site.
3. **Provider-driven defaults.** A single `<UIProvider>` zustand store holds
   library-wide display defaults (currency, week-start, density, sizes,
   formatters). Slice-scoped subscriptions, no re-renders on unrelated changes.
4. **Strings always overridable.** Every user-facing string flows through the
   `useStrings(defaults, override)` deep-merge pattern. Consumers wire their
   own i18n at the call site, the library imports zero i18n packages.
5. **Composability through slots, render-props, and exported partials.**
   Every non-trivial component exposes its internal pieces so consumers can
   reshape without forking.
6. **Stable DOM contract.** Every public `base/` / `features/` / `composed/`
   component carries a `{kebab-name}--component` class on its outermost
   element (e.g. `.kanban-item--component`, `.comments--component`,
   `.card--header`), independent of shadcn's internal `data-slot`
   attributes. Use these for CSS theming, tests, analytics, and DevTools.

## What this is not

- **A drop-in replacement for `shadcn/ui`** — it builds on top of shadcn,
  doesn't replace it. You still install + customise shadcn primitives the
  way shadcn intends.
- **A marketing-site UI kit** — no hero sections, no landing-page blocks. Use
  it for app interiors.
- **Coupled to any backend** — everything is callback-driven, you bring the
  data.

---

## Install

### 1. Add the package

```bash
npm install admin-ui-starter-kit
```

### 2. Required peers

Always required:

```bash
npm install react react-dom tailwindcss lucide-react
```

### 3. Optional peers — install only what you use

| Feature you import | Install peer |
| --- | --- |
| `features/rich-text-editor` | `@tiptap/pm @tiptap/react @tiptap/starter-kit` |
| `base/map` | `leaflet leaflet-draw leaflet.fullscreen leaflet.markercluster react-leaflet react-leaflet-markercluster` |
| `base/table` | `@tanstack/react-table` |
| `composed/analytics` (charts) | `recharts` |
| `composed/cards` with sortable lists | `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` |
| `base/date-pickers` | `react-day-picker` |
| `base/forms/fields/qr-code` | `qrcode` |
| `base/forms` (the `ControlledFormField`) | `react-hook-form` |
| `base/toaster` | `sonner` |
| `base/command` | `cmdk` |
| `base/currency` (color tools) | `culori` |

Skip the ones you don't import — npm will warn but not fail.

### 4. Mount the stylesheet

```tsx
// in your root layout
import 'admin-ui-starter-kit/style.css';
```

The shipped stylesheet is a pre-compiled Tailwind v4 build (~250 KB
minified). If you already run Tailwind in your app, see the **Build your
own** section below to skip the pre-built CSS.

### 5. Mount the provider (optional but recommended)

```tsx
// app.tsx
import { UIProvider } from 'admin-ui-starter-kit/ui-provider';

<UIProvider config={{
  money: { defaultCurrency: 'USD', locale: 'en-US' },
  dates: { weekStartsOn: 1, format: 'dd MMM yyyy' },
  table: { defaultSize: 'xs' },
  badge: { defaultSize: 'xs' },
  item:  { defaultSize: 'sm' },
}}>
  <App />
</UIProvider>
```

The provider is locked at first mount; pass everything once at the root.

---

## Architecture

### Layer order

```
ui/        → shadcn primitives (DO NOT EDIT)
base/      → typography-aware wrappers (Button, Text, Item, FormField, ...)
composed/  → domain rows + cards (TeamMemberRow, ContactCard, MetricGrid, ...)
features/  → provider-driven feature surfaces (Comments, Filters, Overlays, ...)
layout/    → app-shell scaffolds (PageHeader, Sidebar, ...)
```

Each layer can only import from the layer below it — `lint:architecture`
enforces this on every PR.

### Three pillars

**`<UIProvider>` — library-wide defaults.** One zustand store, slice-scoped
subscriptions, locked-once at boot:

```tsx
const { defaultCurrency } = useMoneyConfig();
const currency = props.currency ?? defaultCurrency;
```

**`useStrings()` — overridable internal copy.** Every component owns a
`<Name>Strings` interface + `default<Name>Strings`:

```tsx
<ContactCard strings={{ contact: t('actions.contact') }} />
```

**`<Item>` and `<FormField>` — canonical row primitives.** Any "media + title
+ description + actions" row goes through `Item`; any "label + control +
error" row goes through `FormField`/`ControlledFormField`.

```tsx
<Item>
  <ItemMedia variant="avatar"><Avatar src={user.avatar} /></ItemMedia>
  <ItemContent>
    <ItemTitle>{user.name}</ItemTitle>
    <ItemDescription>{user.role}</ItemDescription>
  </ItemContent>
  <ItemActions><Badge variant="success">Active</Badge></ItemActions>
</Item>

<ControlledFormField name="email" control={control} label="Email" required>
  {(field, _err, invalid) => (
    <Input value={field.value} onChange={field.onChange} invalid={invalid} />
  )}
</ControlledFormField>
```

---

## Entry-points

Import per-feature. The bundler tree-shakes everything else.

```tsx
import { Button } from 'admin-ui-starter-kit/base/buttons';
import { Item, ItemGroup, ItemMedia, ItemContent, ItemTitle } from 'admin-ui-starter-kit/base/item';
import { Badge } from 'admin-ui-starter-kit/base/badge';
import { ContactCard } from 'admin-ui-starter-kit/composed/cards';
import { Comments } from 'admin-ui-starter-kit/features/comments';
import { Dialog, Drawer } from 'admin-ui-starter-kit/features/overlays';
import { useStrings } from 'admin-ui-starter-kit/lib/strings';
```

Full list: `base/*`, `composed/*`, `features/*`, `layout/*`, `ui-provider`,
`lib/strings`, `lib/utils`.

---

## Build your own stylesheet

The pre-built `style.css` is convenient but you may already run Tailwind in
your app. To skip the pre-built CSS:

1. Don't import `admin-ui-starter-kit/style.css`.
2. Add the kit's source to your Tailwind `content`:

   ```ts
   // tailwind config (or @source in your CSS)
   content: ['./node_modules/admin-ui-starter-kit/dist/**/*.{js,cjs}'],
   ```

3. Copy the design tokens from `src/App.css` into your own root
   stylesheet (`@theme` block + `:root` / `.dark` custom-property scopes).

---

## CommonJS support

Both ESM (`.js`) and CJS (`.cjs`) are emitted. The exports map resolves
automatically:

```js
// ESM
import { Item } from 'admin-ui-starter-kit/base/item';

// CJS
const { Item } = require('admin-ui-starter-kit/base/item');
```

---

## For maintainers

This package is governed by a single rules file:
[`.claude/skills/component-library-rules/SKILL.md`](.claude/skills/component-library-rules/SKILL.md).
It is **the** contract — everything from the layer order to typography to
the strings pattern to the Item/FormField primitives is documented there.

Companion docs:
- [`AGENTS.md`](AGENTS.md) — what AI agents should read first.
- [`CLAUDE.md`](CLAUDE.md) — Claude Code entry point.
- [`PLAN.md`](.claude/skills/component-library-rules/PLAN.md) — phased
  publish-readiness plan, what's landed, what's still open.
- [`references/`](.claude/skills/component-library-rules/references/) —
  per-task deep guides (new feature, strings, ui-provider, base wrapper,
  preview pages, item pattern, form-field pattern, visual evaluation).

### Common scripts

```bash
npm run dev              # start the preview app
npm run build:lib        # compile the publishable artifact (dist/)
npm run typecheck        # tsc --noEmit
npm run lint             # eslint
npm run lint:architecture # check layer-import boundaries
npm run test:exports     # check the exports map matches the file tree
npm run test             # vitest run
npm run verify           # lint:architecture + test:exports + typecheck + lint + test
npm run publish:skill    # copy the rules skill into ~/.claude and ~/.agents
```

### Project layout

```
src/
├── components/
│   ├── ui/         shadcn primitives (do not edit)
│   ├── base/       typography-aware wrappers + base/item + base/forms/form-field
│   ├── composed/   domain rows + cards (admin, cards, commerce, dark-surfaces, …)
│   ├── features/   feature surfaces (activities, comments, filters, overlays, …)
│   └── layout/     app-shell scaffolds
├── lib/
│   ├── ui-provider/  zustand store + slice hooks
│   ├── strings.ts    useStrings + StringsProp + DeepPartial helpers
│   └── utils.ts      cn() etc.
├── hooks/          cross-cutting hooks (useDebounce, useMobile, …)
└── preview/        in-repo showcase app (excluded from publish)
```

---

## License

MIT © Nicolas Vlachos. See [LICENSE](LICENSE).
