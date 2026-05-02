# `<Item>` — the canonical row primitive

Open this when you're about to render a list of "icon/avatar/image media +
title/description text-stack + optional actions" rows. Anywhere two adjacent
surfaces currently disagree on `py-1.5` vs `py-2.5` is the smell `Item` is
supposed to fix.

Source: [`@/components/base/item`](../../../src/components/base/item).
Wraps: shadcn `ui/item.tsx` (do not edit per rule 1).

## Compound parts

| Part | Renders | Notes |
| --- | --- | --- |
| `<ItemGroup>` | `<div role="list">` | Default gap follows row size; nest `<ItemSeparator />` between rows for hairline dividers. |
| `<ItemSeparator>` | thin horizontal rule | Same `Separator` primitive shadcn ships. |
| `<Item>` | row container | `size`, `variant`, polymorphic `render`. See below. |
| `<ItemMedia variant="icon" \| "image" \| "avatar" \| "default">` | leading slot | `icon` sizes the icon to the row, `image` and `avatar` get sized image-square / round. |
| `<ItemContent>` | text-stack column | Hosts title + description + any inline content (progress bar, metric grid). |
| `<ItemTitle>` | strong primary line | Internally `<Text weight="semibold">`; pass `bold={false}` for body-weight. |
| `<ItemDescription>` | secondary line | Internally `<Text size="xs" type="secondary">`; `clamp={1\|2\|3\|4\|'none'}`, default 2. |
| `<ItemActions>` | trailing slot | Buttons, badges, switches, chevrons. |
| `<ItemHeader>` | full-width eyebrow above the row | Use for "vendor + status" or section labels. |
| `<ItemFooter>` | full-width footer beneath the row | Use for "publisher · date" or last-active timestamps. |

## `size` and `variant`

Resolve through `<UIProvider>` via the `useItemConfig()` slice:

| Slice key | Default | Effect |
| --- | --- | --- |
| `item.defaultSize` | `'sm'` | `xs` (dropdowns), `sm` (admin density, library default), `default` (settings rows). |
| `item.defaultVariant` | `'default'` | `'default'` (transparent), `'outline'` (bordered card-on-card), `'muted'` (inset list). |

Resolution order: `props.size ?? useItemConfig().defaultSize ?? 'sm'`. Same for
variant. Omit the prop unless you're intentionally pinning the size against
provider configuration.

## Canonical shapes

### Plain icon row

```tsx
<ItemGroup>
  <Item>
    <ItemMedia variant="icon"><Mail /></ItemMedia>
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

### Avatar row with badge action

```tsx
<Item>
  <ItemMedia variant="avatar">
    <Avatar>
      <AvatarImage src={user.avatarUrl} alt={user.name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  </ItemMedia>
  <ItemContent>
    <ItemTitle>{user.name}</ItemTitle>
    <ItemDescription clamp={1}>{user.role}</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Badge variant="secondary">{user.dept}</Badge>
  </ItemActions>
</Item>
```

### Body-weight title (contact details, line items)

```tsx
<Item size="xs" className="px-0">
  <ItemMedia variant="icon" className="text-muted-foreground"><Phone /></ItemMedia>
  <ItemContent>
    <ItemTitle bold={false}>{phone}</ItemTitle>
  </ItemContent>
</Item>
```

### Header + footer slots

```tsx
<Item variant="outline" size="default">
  <ItemHeader>
    <ItemTitle>Acme Workspace</ItemTitle>
    <Badge variant="success">Active</Badge>
  </ItemHeader>
  <ItemMedia variant="image">
    <img src={hero} alt="" />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Production environment</ItemTitle>
    <ItemDescription>
      Customer-facing storefront. Read-write for admins, read-only for analysts.
    </ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button buttonStyle="ghost" variant="secondary">Manage</Button>
  </ItemActions>
  <ItemFooter>
    <span className="text-muted-foreground text-xs">Last deploy 12 minutes ago</span>
    <span className="text-muted-foreground text-xs">3 collaborators</span>
  </ItemFooter>
</Item>
```

### Render as link (no extra `<a>` wrapper, focus styling preserved)

```tsx
<Item render={<a href="/dashboard" />}>
  <ItemMedia variant="icon"><Home /></ItemMedia>
  <ItemContent>
    <ItemTitle>Dashboard</ItemTitle>
    <ItemDescription>Overview of your workspace</ItemDescription>
  </ItemContent>
</Item>
```

## When to reach for it

- Admin rows (`team-member`, `conversation-row`, `settings-toggle`).
- Card detail rows (`contact-card` email/phone/location).
- Settings menus, navigation rows (`category-nav`), dropdown rows.
- Card *headers* with avatar + title + verified badge (`vendor-profile`,
  `feature-announcement`, `inventory-level`, `giftcard-{dark,minimal}`
  headers).
- Citation source rows (`ai-citation`).
- Two adjacent components disagreeing on `py-1.5` vs `py-2.5` density.

## When NOT to reach for it

- **Form inputs** — that's `FormField` / `ControlledFormField`. See
  [`form-field-pattern.md`](form-field-pattern.md).
- **Cards with header + body + footer that aren't list rows** — `SmartCard`.
- **Hero/dashboard surfaces** with one big number + chart — `Metric`,
  `GradientCard`, `MetricGradient`.
- **Step ribbons / horizontal connector lines** —
  `OrderStatusCard`, `ShipmentTrackingCard`, `BreadcrumbProgress` keep
  their bespoke layout.
- **Marker-rail timelines** — `ActivityRow`, `Timeline` from
  `composed/timelines/shared`, `StepsCard`.
- **Inline pills / chips** — `Badge`, `IconBadge`, `MetricTrendChip`.
- **Filter popover headers** — `features/filters` has its own bespoke
  back-button + clear-button structure inside the popover.

## Migrating an existing row

1. Find the icon → text-stack → trailing-content flex block.
2. Replace the wrapping `<div className="flex items-center gap-3 px-3 py-2.5">`
   with `<Item>` and the children with `ItemMedia`, `ItemContent`,
   `ItemActions`.
3. Strip the bespoke `<Text weight="semibold">` and
   `<Text size="xs" type="secondary">` — `ItemTitle` / `ItemDescription`
   handle those.
4. Drop manual padding overrides; the size token (`xs` / `sm` / `default`)
   provides density.
5. If multiple rows render in a list, wrap them in `<ItemGroup>` so the
   group gap follows size.
6. Verify in the matching preview page (`/composed/<group>`) — zero
   console warnings, item visually identical or denser by one notch
   (often the goal).

## Common pitfalls

- **Wrapping the row in `<button>`/`<a>` yourself** — use `render={<a />}`
  or `onClick` on `<Item>` directly. Wrapping breaks the focus ring.
- **Putting the title's badge/icon in `ItemActions`** — if it's part of the
  identity (verified checkmark next to a name), put it inline inside
  `ItemTitle`. `ItemActions` is for trailing affordances, not title
  decoration.
- **Setting `size` per-row** — let the provider drive density. Pin only
  for genuinely-different rows (e.g. `size="default"` for a hero settings
  row inside an `xs`-default app).
- **Adding `bg-muted` and `border` manually** — that's `variant="muted"`
  and `variant="outline"`.
