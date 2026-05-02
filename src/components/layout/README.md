# Layout

Framework-neutral app-shell primitives for composing admin/SaaS layouts.

This package owns structural UI only: containers, page headers, topbars,
sidebars, navigation rows, account menus, notifications, and exported partials.
It never imports Inertia, Next, React Router, TanStack Router, app services, or
i18n/runtime integrations. Apps provide navigation, data, callbacks, and copy at
the call site.

## Admin Density Contract

The layout layer is for admin panels and SaaS work surfaces. It should feel
calm, compact, and consistent.

- Use `Badge size="xs"` for all layout status/count badges.
- Use `Button size="sm"` for layout actions. Icon-only header controls use
  `icon-sm`.
- Use `Text size="sm"` for primary labels, card values, navigation labels, and
  row text.
- Use `Text size="xs"` for descriptions, metadata, secondary labels, and helper
  copy.
- Avoid `Text size="lg"` and large card padding in layout showcases. Page
  headings are handled by `PageHeader` and stay admin-scale.
- Prefer `SmartCard padding="sm"` for dashboard/page examples.
- Keep badges beside titles when they describe title state. Do not push them to
  the far action edge.

## Import Paths

```tsx
import {
	Container,
	Header,
	HeaderSearch,
	Page,
	PageActions,
	AppSidebar,
} from 'admin-ui-starter-kit/layout';

import { HeaderUserMenu } from 'admin-ui-starter-kit/layout/header';
import { PageHeader } from 'admin-ui-starter-kit/layout/page';
import { SidebarNavigation } from 'admin-ui-starter-kit/layout/sidebar';
```

Subpath exports are available for smaller imports:

```tsx
admin-ui-starter-kit/layout
admin-ui-starter-kit/layout/containers
admin-ui-starter-kit/layout/page
admin-ui-starter-kit/layout/header
admin-ui-starter-kit/layout/sidebar
admin-ui-starter-kit/layout/hooks
```

## Navigation Contract

Use `renderLink` for every framework-specific link. This is the primary seam for
Inertia, Next, React Router, TanStack Router, or plain anchors.

```tsx
import type { LayoutLinkRenderProps } from 'admin-ui-starter-kit/layout';

function renderAppLink({ href, children, className, target, rel }: LayoutLinkRenderProps) {
	return (
		<AppLink href={href ?? '#'} className={className} target={target} rel={rel}>
			{children}
		</AppLink>
	);
}

<AppSidebar
	currentUrl={location.pathname}
	navigationGroups={groups}
	renderLink={renderAppLink}
/>;
```

`LinkComponent` still exists for older call sites, but new code should use
`renderLink`. `renderLink` is more explicit and works for breadcrumbs, sidebar
rows, dropdown links, page actions, workspace links, and render-prop contexts.

## Shared Types

`LayoutLinkRenderProps`
: Link rendering props passed to `renderLink`. Includes `href`, `children`,
`className`, `target`, `rel`, `active`, `disabled`, `external`, and
`aria-label`.

`LayoutUser`
: Shared user shape for header and sidebar identity surfaces:
`{ name, email?, avatar?, role? }`.

`BreadcrumbItem`
: Header breadcrumb item: `{ label, href?, handle? }`.

`LayoutIconSource`
: Navigation icon source. Accepts a component, a React node, or an icon key that
can be resolved through `iconMap`.

## Containers

### `Container`

`Container` is the page/body wrapper. It provides the container-query boundary,
height/flex behavior, width clamp, and optional padded inner column.

```tsx
<Container as="main" width="wide" padding="default" innerClassName="gap-4">
	<Section density="default">
		<SmartCard>...</SmartCard>
	</Section>
</Container>
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `as` | `'div' \| 'main' \| 'section'` | `'div'` | Semantic outer element. |
| `width` | `'narrow' \| 'default' \| 'wide' \| 'full'` | `'default'` | `narrow` and `wide` center/clamp content. |
| `padding` | `'none' \| 'sm' \| 'default' \| 'lg'` | `'default'` | Applies to the inner column unless `bare` is true. |
| `bare` | `boolean` | `false` | Removes the inner padded column for edge-to-edge children. |
| `innerClassName` | `string` | - | Styles the inner column without breaking the outer wrapper. |

Use `bare` for tables, virtualized lists, maps, or any edge-to-edge region:

```tsx
<Container as="main" width="full" bare>
	<DataTable />
</Container>
```

### `Section`

`Section` is only a rhythm wrapper. It does not render headings or cards.

```tsx
<Section density="tight">
	<SmartCard>...</SmartCard>
	<SmartCard>...</SmartCard>
</Section>
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `as` | `'section' \| 'div'` | `'section'` | Use `div` for non-landmark grouping. |
| `density` | `'tight' \| 'default' \| 'loose'` | `'default'` | Controls vertical rhythm between children. |

## Page

### `Page`

`Page` is the convenience composition for a common body region: `Container` plus
an optional `PageHeader`.

```tsx
<Page
	width="full"
	renderLink={renderAppLink}
	header={{
		title: 'Customers',
		description: 'Manage accounts, contacts, and lifecycle state.',
		headingTag: 'h2',
		titleBadges: [{ label: 'Live', variant: 'success' }],
		actions: <PageActions actions={actions} display="auto" renderLink={renderAppLink} />,
	}}
>
	<CustomerOverview />
</Page>
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `header` | `PageHeaderProps` | - | Optional page title/actions region. |
| `width` | `ContainerWidth` | `'narrow'` | Passed to `Container`. |
| `bodyClassName` | `string` | - | Applies to the child body wrapper. |
| `renderLink` | `LayoutLinkRenderer` | native anchor | Shared by header links unless overridden in `header`. |

### `PageHeader`

`PageHeader` owns the title, description, title-adjacent badges, back control,
and trailing actions. Breadcrumbs are intentionally not supported here; they
belong to `Header`.

```tsx
<PageHeader
	title="Invoice review"
	description="Use directly when the surrounding app shell is custom."
	headingTag="h3"
	backHref="/customers"
	titleBadges={[
		{ label: '42 queued', variant: 'info' },
		{ label: '3 overdue', variant: 'warning' },
	]}
	actions={<PageActions actions={actions} renderLink={renderAppLink} />}
	renderLink={renderAppLink}
/>;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | Rendered through `Heading`; admin-density sizes are built in. |
| `description` | `ReactNode` | - | Uses `Text size="xs" type="secondary"`. |
| `headingTag` | `'h1'` to `'h6'` | `'h3'` | Semantic heading level and size preset. |
| `backHref` | `string` | - | Link back control using `renderLink`. |
| `onBack` | `() => void` | - | Button back control. Takes precedence over link behavior when present. |
| `backLabel` | `string` | `'Back'` | Accessible label for the back control. |
| `titleBadges` | `PageTitleBadge[]` | `[]` | Badges render beside the title, not in the action region. |
| `actions` | `ReactNode` | - | Trailing action region. |
| `slots` | `PageHeaderSlots` | - | Replace `back`, add `beforeTitle`, add `afterDescription`, or replace `actions`. |

Visual contract:

- Title and description use one `flex flex-col gap-0.5` rhythm.
- The title/description wrapper is capped at `max-width: 475px`.
- Badges render as `size="xs"` and sit directly beside the title.
- Page title sizes are admin-density, not marketing/landing-page sizes.
- Breadcrumbs are excluded by design.

### `PageActions`

`PageActions` centralizes page action filtering, inline/dropdown display,
grouping, responsive auto mode, and link rendering.

```tsx
const actions = [
	{ id: 'new', label: 'New customer', icon: Plus, variant: 'primary', href: '/customers/new', placement: 'inline' },
	{ id: 'sync', label: 'Sync records', icon: RefreshCw, group: 'Data', placement: 'menu' },
	{ id: 'delete', label: 'Delete saved view', icon: Trash2, variant: 'destructive', group: 'Danger', placement: 'menu' },
];

<PageActions actions={actions} display="auto" renderLink={renderAppLink} />;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `actions` | `PageAction[]` | `[]` | Hidden actions use `visible: false`. |
| `display` | `'flat' \| 'dropdown' \| 'auto'` | `'dropdown'` | `auto` switches at `breakpoint`; `flat` still respects `maxInlineActions`. |
| `breakpoint` | `number` | `1040` | Window width threshold for auto mode. |
| `maxInlineActions` | `number` | `4` | Maximum non-menu actions rendered inline before overflow moves into the menu. |
| `strings` | `Partial<PageActionsStrings>` | - | Override `menuLabel`. |
| `renderAction` | `(action, context) => ReactNode` | - | Customize rendering while keeping grouping/display logic. |

`PageAction` supports `href`, `onClick`, `target`, `rel`, `external`,
`disabled`, `loading`, `icon`, `variant`, `group`, `placement`, and `element`.
Prefer `renderAction` for consistent customization. Use `element` only for a
single escape-hatch action.

Visual contract:

- Inline actions render as sm buttons with xs text.
- At most four visible non-menu actions render inline by default; additional
  visible/inline actions move into the overflow menu automatically.
- Dropdown actions render as dense xs menu rows.
- Keep destructive actions in the menu unless the primary task is destructive.

### `PageContent`

`PageContent` is a lighter `<main>` wrapper for manual app-shell compositions.

```tsx
<PageContent maxWidth="2xl">
	<PageHeader title="Orders" />
	<OrderTable />
</PageContent>
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `noPadding` | `boolean` | `false` | Removes default `p-4 md:p-6`. |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | - | Optional centered width clamp. |

## Header

### `Header`

`Header` owns the sticky topbar and composes optional breadcrumbs plus named
slots for brand, left, center, and right content.

```tsx
<Header
	renderLink={renderAppLink}
	breadcrumbs={[{ label: 'Operations', href: '/operations' }, { label: 'Orders' }]}
	slots={{
		center: <HeaderSearch onOpen={openCommandMenu} />,
		right: (
			<>
				<HeaderNotifications notifications={notifications} unreadCount={2} />
				<HeaderUserMenu user={user} onLogout={logout} />
			</>
		),
	}}
/>;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `showBreadcrumbs` | `boolean` | `true` | Disable when replacing the left side entirely. |
| `breadcrumbs` | `BreadcrumbItem[]` | `[]` | Header trail. Page shell does not own breadcrumbs. |
| `homeBreadcrumb` | `BreadcrumbItem \| null` | `null` | Optional leading crumb. |
| `showSidebarTrigger` | `boolean` | `true` | Shows the shadcn sidebar trigger inside `HeaderBreadcrumbs`. |
| `brand` | `ReactNode` | - | Compatibility brand slot. Prefer `slots.brand`. |
| `slots` | `HeaderSlots` | - | `brand`, `breadcrumbs`, `left`, `center`, `right`. |
| `*ClassName` | `string` | - | `content`, `left`, `center`, `right`, `breadcrumbs` class hooks. |

`leftContent`, `centerContent`, and `rightContent` remain compatibility aliases.
Use `slots.left`, `slots.center`, and `slots.right` for new work.

### `HeaderBreadcrumbs`

`HeaderBreadcrumbs` renders the sidebar trigger, separator, and breadcrumb trail.

```tsx
<HeaderBreadcrumbs
	homeBreadcrumb={{ label: 'Admin', href: '/admin' }}
	breadcrumbs={[{ label: 'Customers', href: '/customers' }, { label: 'Maria Petrova' }]}
	renderLink={renderAppLink}
/>;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `breadcrumbs` | `BreadcrumbItem[]` | `[]` | Main trail. |
| `homeBreadcrumb` | `BreadcrumbItem \| null` | `null` | Optional leading crumb. |
| `showSidebarTrigger` | `boolean` | `true` | Controls sidebar trigger visibility. |
| `triggerSlot` | `ReactNode` | - | Replace the sidebar trigger. |

### `HeaderSearch`

`HeaderSearch` is a command-search trigger. It does not fetch or own results.
Apps open their own command palette through `onOpen`.

```tsx
<HeaderSearch
	onOpen={() => setCommandOpen(true)}
	strings={{ placeholder: 'Search customers, invoices, comments...' }}
/>;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onOpen` | `() => void` | - | Called on click and shortcut. |
| `enableShortcut` | `boolean` | `true` | Enables Cmd/Ctrl+K listener. |
| `isMac` | `boolean` | auto-detected | Controls shortcut label. |
| `strings` | `Partial<HeaderSearchStrings>` | - | Override placeholder/shortcut copy. |
| `shortcutSlot` | `ReactNode` | - | Replace the keyboard shortcut display. |

Visual contract:

- Default height is `h-8`.
- Default minimum width is `205px`.
- The trigger uses the sm button size with xs placeholder text.
- It is a trigger only. Search implementation stays in the app.

### `HeaderNotifications`

`HeaderNotifications` renders a bell trigger and dropdown for consumer-supplied
notification data.

```tsx
<HeaderNotifications
	notifications={notifications}
	unreadCount={2}
	viewAllHref="/activity"
	onMarkAllRead={markAllRead}
	onNotificationClick={trackNotificationClick}
	renderLink={renderAppLink}
/>;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `notifications` | `HeaderNotification[]` | `[]` | `id`, `title`, `description`, `time`, `read`, `tone`, `href`. |
| `unreadCount` | `number` | `0` | Badge text caps at `99+`. |
| `onNotificationClick` | `(notification) => void` | - | Runs for link and button rows. |
| `onMarkAllRead` | `() => void` | - | Shows the mark-all control when provided and unread count is positive. |
| `onViewAll` | `() => void` | - | Button view-all action. |
| `viewAllHref` | `string` | - | Link view-all action. |
| `renderNotification` | `(notification) => ReactNode` | - | Replace a single row renderer. |
| `strings` | `Partial<HeaderNotificationsStrings>` | - | Override trigger, heading, empty, and action copy. |

### `HeaderUserMenu`

`HeaderUserMenu` renders the topbar user block and consumer-wired account
actions. It does not own auth, routing, or mutation logic.

```tsx
<HeaderUserMenu
	user={user}
	showEmail={false}
	onProfile={() => navigate('/profile')}
	onSettings={() => navigate('/settings')}
	onLogout={logout}
/>;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `user` | `LayoutUser` | required | Uses `name`, optional `email`, optional `avatar`. |
| `showEmail` | `boolean` | `true` | Hide email for dense topbars. |
| `customContent` | `ReactNode` | - | Replace dropdown content. |
| `renderTrigger` | `(user) => ReactNode` | - | Replace the trigger. |
| `onProfile` | `() => void` | - | Shows profile item when provided. |
| `onSettings` | `() => void` | - | Shows settings item when provided. |
| `onLogout` | `() => void` | - | Shows logout item when provided. |
| `strings` | `Partial<HeaderUserMenuStrings>` | - | Override menu labels. |

Visual contract:

- Default trigger is `h-10`.
- Avatar is compact and aligned for admin topbars.
- Use `showEmail={false}` in tight header right clusters.
- Text is xs inside the trigger; email remains xxs when shown.

## Sidebar

### `SidebarProvider` and `Sidebar`

The sidebar exports the shadcn sidebar context and shell with library defaults.
Wrap sidebar examples or app shells in `SidebarProvider`.

```tsx
<SidebarProvider defaultOpen>
	<AppSidebar navigationGroups={groups} renderLink={renderAppLink} />
</SidebarProvider>
```

`Sidebar` accepts `collapsible`, `variant`, `side`, `className`, and
`surfaceClassName`. Use `surfaceClassName` to align the inner surface with the
surrounding app chrome.

`Sidebar` API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `side` | `'left' \| 'right'` | `'left'` | Sidebar edge. |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | Shell style. |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | Desktop collapse behavior. |
| `strings` | `Partial<SidebarStrings>` | - | Mobile sheet title/description copy. |
| `surfaceClassName` | `string` | - | Styles the inner sidebar surface. |

### `AppSidebar`

`AppSidebar` is the default app sidebar composition: logo/workspace header,
grouped navigation, optional slots, and footer utility navigation.

```tsx
<AppSidebar
	logo={<AppLogo />}
	collapsedLogo={<AppIcon />}
	workspaceLinks={[
		{ label: 'Production store', url: '/workspaces/production', icon: Store, external: false },
		{ label: 'Sandbox', url: '/workspaces/sandbox', icon: Store, external: false },
	]}
	navigationGroups={navigationGroups}
	footerNavItems={utilityItems}
	currentUrl={location.pathname}
	liveBadges={{ customers: 31, invoices: 14 }}
	renderLink={renderAppLink}
/>;
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `navigationGroups` | `Record<string, SidebarNavItem[]>` | - | Grouped main navigation. |
| `footerNavItems` | `SidebarFlatNavItem[]` | `[]` | Bottom utility navigation. |
| `footerLabel` | `ReactNode` | - | Optional footer nav label. |
| `logo` | `ReactNode` | - | Header logo/tenant block. |
| `collapsedLogo` | `ReactNode` | - | Icon-only collapsed state. |
| `workspaceLinks` | `WorkspaceLink[]` | `[]` | Turns the logo/header area into a workspace switcher. |
| `workspaceStrings` | `Partial<SidebarWorkspaceDropdownStrings>` | - | Workspace menu copy. |
| `currentUrl` | `string` | `'/'` | Active matching input. |
| `liveBadges` | `Record<string, string \| number>` | - | Runtime badge overrides keyed by item `handle`. |
| `loading` | `boolean` | - | Shows skeletons when true or when groups are missing. |
| `slots` | `SidebarSlots` | - | `header`, `beforeNavigation`, `afterNavigation`, `footer`, `empty`, `loading`. |
| `renderItem` | `(item, context) => ReactNode` | - | Custom row renderer for grouped navigation. |

### Sidebar navigation items

`SidebarNavItem`:

```ts
{
	label?: ReactNode;
	title?: ReactNode; // older alias
	href?: string;
	handle?: string;
	icon?: LayoutIconSource;
	disabled?: boolean;
	badge?: string | number;
	children?: SidebarNavItem[];
	group?: string;
	external?: boolean;
}
```

`label` is preferred. `title` exists for older call sites. `handle` is useful
for `liveBadges` and stable keys.

Visual contract:

- Navigation rows use sm text.
- Badges use xs sizing through `NavBadge`.
- Footer rows are visually secondary but keep the same row rhythm.
- Nested rows are full-width so badges align with parent row badges.

### `SidebarLogo`

`SidebarLogo` is the minimal logo/collapsed-logo switcher. Use it directly when
building a custom sidebar header without workspace switching.

```tsx
<SidebarLogo logo={<AppLogo />} collapsedLogo={<AppIcon />} className="px-2" />
```

API:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `logo` | `ReactNode` | required | Full sidebar logo/header block. |
| `collapsedLogo` | `ReactNode` | `null` | Rendered when sidebar state is collapsed. |
| `className` | `string` | - | Wrapper class hook. |

### `SidebarGroupedNavigation`

Use this when the app owns the surrounding sidebar shell but wants the default
grouped navigation behavior.

```tsx
<SidebarGroupedNavigation
	navigationByGroups={groups}
	currentUrl={location.pathname}
	liveBadges={{ bookings: 8 }}
	renderLink={renderAppLink}
/>;
```

Supports nested children. Parent rows expand when the parent or a child is
active. Sub-navigation rows are full width so badges align cleanly.

### `SidebarNavigation`

Flat navigation list for secondary panels, small sidebars, or custom shells.

```tsx
<SidebarNavigation
	label="Flat navigation"
	items={[
		{ label: 'Inbox', href: '/inbox', icon: Inbox, badge: 6 },
		{ label: 'Settings', href: '/settings', icon: Settings },
	]}
	currentUrl={location.pathname}
	renderLink={renderAppLink}
/>;
```

`renderItem` receives `{ depth, active, expanded, badge, renderLink }` when an
app needs a fully custom row while keeping active matching and badge resolution.

### `SidebarNavigationFooter`

Footer/utility navigation. Supports the same item shape as `SidebarNavigation`,
plus external-link indicator rendering.

```tsx
<SidebarNavigationFooter
	label="Help"
	items={[
		{ label: 'Support', href: '/support', icon: LifeBuoy },
		{ label: 'External docs', href: 'https://example.com', icon: ExternalLink, external: true },
	]}
	renderLink={renderAppLink}
/>;
```

### `SidebarWorkspaceDropdown`

Workspace switcher for the sidebar logo/header area.

```tsx
<SidebarWorkspaceDropdown
	logo={<AppLogo />}
	collapsedLogo={<AppIcon />}
	workspaceLinks={[
		{ label: 'Production store', url: '/workspaces/production', icon: Store, external: false },
		{ label: 'Sandbox', url: '/workspaces/sandbox', icon: Store, external: false },
	]}
	strings={{ label: 'Workspace', select: 'Switch workspace' }}
	renderLink={renderAppLink}
/>;
```

Use `AppSidebar.workspaceLinks` for the common case. Use this partial directly
when composing a custom sidebar shell.

### `SidebarNavigationUser`

Sidebar account dropdown for sidebar footer regions. Use this when an app wants
account controls in the sidebar instead of the header.

```tsx
<SidebarNavigationUser
	user={user}
	onProfile={openProfile}
	onSettings={openSettings}
	onLogout={logout}
/>;
```

Supports `customContent`, `renderTrigger`, and `strings` for app-specific menus.

## Hooks

`useLayoutLinkRenderer({ renderLink, LinkComponent })`
: Resolves the final link renderer. Components use this internally; app code can
use it when composing custom renderers around layout partials.

`useActivePath(currentUrl)`
: Returns a callback for sidebar-style path matching.

`useCommandShortcut({ key, enabled, onTrigger, preventDefault })`
: Registers Cmd/Ctrl + key shortcuts. Used by `HeaderSearch`.

## Strings

Components with user-facing default text expose a strings interface and default
object:

- `SidebarStrings` / `defaultSidebarStrings`
- `HeaderSearchStrings` / `defaultHeaderSearchStrings`
- `HeaderNotificationsStrings` / `defaultHeaderNotificationsStrings`
- `HeaderUserMenuStrings` / `defaultHeaderUserMenuStrings`
- `PageActionsStrings` / `defaultPageActionsStrings`
- `SidebarWorkspaceDropdownStrings` / `defaultSidebarWorkspaceDropdownStrings`
- `SidebarNavigationUserStrings` / `defaultSidebarNavigationUserStrings`

Override strings at the component boundary:

```tsx
<HeaderUserMenu
	user={user}
	strings={{
		profile: 'Account',
		settings: 'Preferences',
		logout: 'Sign out',
	}}
/>;
```

## Showcase Parity

Preview pages under `src/preview/pages/layout` should demonstrate the shipped
components, not private mockups.

- `LayoutPagePage` uses `Page`, `PageHeader`, `PageActions`, and `PageContent`.
- `LayoutHeaderPage` uses `Header`, `HeaderBreadcrumbs`, `HeaderSearch`,
  `HeaderNotifications`, `HeaderUserMenu`, and `PageHeader` for the body title.
- `LayoutSidebarPage` uses `AppSidebar`, `SidebarGroupedNavigation`,
  `SidebarNavigation`, `SidebarNavigationFooter`, `SidebarWorkspaceDropdown`,
  `Header`, and `PageHeader`.
- `LayoutUsersPage` uses `HeaderUserMenu`, `SidebarNavigationUser`, and the base
  avatar primitives.
- `LayoutContainersPage` uses `Container`, `Section`, and `SmartCard`.

When a showcase needs a title/description/badge pattern, use `PageHeader`.
When it needs topbar identity, use `HeaderUserMenu`. When it needs sidebar
navigation, use the exported sidebar partials before adding private rows.
Showcase cards should use sm values, xs metadata, xs badges, and sm buttons so
the previews match the admin-density contract.

## Rules

- Pass runtime callbacks and data directly as props.
- Use `strings` props for user-facing default copy.
- Use `renderLink` for framework navigation.
- Keep breadcrumbs in `Header`, not `PageHeader`.
- Keep search implementation outside `HeaderSearch`; it is a trigger only.
- Use exported partials before writing custom private components in an app.
