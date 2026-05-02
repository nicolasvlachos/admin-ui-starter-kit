# Working in the `layout/` layer

The `layout/` layer ships **page shells** — structural chrome that wraps a
consumer's app: containers, page headers, topbars, sidebars, navigation
rows, account menus, notifications. It is a peer of `composed/`, sits
above `base/` + `typography/`, and **never imports `composed/` or
`features/`**. (Layer order, rule 2.)

A more detailed living-document of the layer's conventions is the
package-local README at
[`src/components/layout/README.md`](../../../src/components/layout/README.md).
Read it first when working in this layer; this guide complements it with
the rule-skill perspective.

## Folder shape

```
src/components/layout/
├── containers/         — Container, ScrollContainer
├── header/             — Header, HeaderSearch, HeaderUserMenu, HeaderBreadcrumbs
│   └── partials/
├── page/               — Page, PageHeader, PageActions
├── sidebar/            — AppSidebar, Sidebar primitives, SidebarNavigation
│   ├── components/
│   └── sidebar.context.tsx
├── hooks/              — layout-only hooks (e.g. mobile breakpoint glue)
├── index.ts            — public surface
├── layout.types.tsx    — shared types
└── README.md           — package-local conventions (admin density, navigation contract)
```

## Hard constraints

1. **No imports from `composed/` or `features/`.** Layout chrome is the
   surface a feature mounts *into*, not the other way around.
2. **No framework integration imports.** Same rule as everywhere else —
   no `@inertiajs/*`, `next/*`, `react-router*`, `@tanstack/react-router`,
   `@tanstack/react-query`, `vite-bundled-i18n/*`, `ziggy-js`. The
   consumer wires routing via `renderLink`/`onSelect` (see below).
3. **Reach into `ui/` only via the matching `base/` wrapper.** The
   sidebar/sheet primitives are wrapped in `base/sidebar/` and
   `base/sheet/`; layout imports those, not the raw shadcn files.
4. **Admin-density typography.** `Badge size="xs"`, `Button size="sm"`,
   icon-only header controls use `icon-sm`. Primary labels and row text
   default to `Text size="sm"`; descriptions and helper copy use
   `Text size="xs"`. Don't push beyond `Text size="base"` in layout —
   page hierarchy belongs in `PageHeader`.

## Navigation contract — `renderLink`

The library can't hardcode a router. Every layout component that renders
a link accepts a `renderLink` render-prop:

```tsx
type RenderLink = (link: {
    href: string;
    children: ReactNode;
    isActive?: boolean;
    icon?: LucideIcon;
    badge?: ReactNode;
}) => ReactElement;
```

Default behaviour: render a plain `<a href>` if `renderLink` is absent.
Consumers wire it once at the root:

```tsx
<AppSidebar renderLink={(l) => <Link to={l.href}>{l.children}</Link>}>
```

For Inertia:

```tsx
<AppSidebar renderLink={(l) => <InertiaLink href={l.href}>{l.children}</InertiaLink>}>
```

If a layout component needs to *select* a target without rendering a
link (e.g. a workspace switcher dropdown), it accepts `onSelect(value)`
and the consumer dispatches `router.visit(...)` themselves.

## Sidebar specifics

- `AppSidebar` is the canonical shell. It wraps `base/sidebar/`'s
  compound parts (`SidebarProvider`, `SidebarContent`, …).
- A sidebar's mobile mode uses `base/sheet/` under the hood — already
  wired inside `base/sidebar/`.
- Pass nav data declaratively as props (`sections`, `items`,
  `footerItems`) — never reach for a routing context.
- For workspace / org switcher: the `<SidebarWorkspaceDropdown>` accepts
  a `workspaces` array + `onSelect(workspaceId)` callback. The library
  doesn't fetch.

## Page header

`<PageHeader>` is `Heading h2 + optional badge + optional description +
trailing actions`. Don't hand-roll alternative page chrome — extend
`<PageHeader>` with a slot if a specific surface needs more.

## Strings

Layout components with user-facing copy follow rule 8: each component
exports a `*Strings` interface and `default*Strings`, deep-merged via
`useStrings(defaults, override)`. A consumer maps their i18n once at the
mount site:

```tsx
<HeaderUserMenu strings={{ signOut: t('auth.sign_out') }} … />
```

## What does NOT belong here

- Domain widgets (analytics cards, comment threads, AI surfaces) — those
  are `composed/` or `features/`.
- App state stores — `<UIProvider>` is the only library provider.
  Anything else is the consumer's job.
- "Utility" hooks that aren't layout-specific — those go in
  `src/hooks/`.

When in doubt, mirror the closest existing example
(`AppSidebar`, `Header`, `PageHeader`) and let layer order decide.
