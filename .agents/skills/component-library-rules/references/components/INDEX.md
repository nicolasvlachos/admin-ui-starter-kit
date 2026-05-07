# Component reference index

Auto-generated. Do not edit by hand — run `npm run docs:sync-skill`.

Agents: prefer `INDEX.json` (structured) for discovery; this file is for humans.

## base

- [Accordion](./base__accordion.md) — Two tiers — pass-through compound parts (Accordion / AccordionItem / AccordionTrigger / AccordionContent) for full control, or SmartAccordion for the canonical icon + title + optional badge + body admin pattern.
- [Badge](./base__badge.md) — Status pills and chips for tags, counts, and inline state.
- [Buttons](./base__buttons.md) — The base button family — BaseButton (variant × style × size), the higher-level Button (loader / tooltip / link wrapper), and specialty buttons (Google, Shopify, Text, PageAction).
- [Cards (SmartCard)](./base__cards.md) — The composed card primitive — header (icon, title, suffix, slots), optional alert, expandable body, footer text or slot, and three surface chromes.
- [Combobox](./base__combobox.md) — EnhancedCombobox and EnhancedComboboxMultiple — searchable, optionally grouped, with apply / close-on-select behaviours, async fetchers, custom rendering, and form integration.
- [Copyable](./base__copyable.md) — Click-to-copy inline span with hover affordance and toast feedback.
- [Currency](./base__currency.md) — MoneyDisplay and CurrencyPairPreview — locale-aware, dual-pricing-aware money rendering driven by useCurrency() / UIProvider config.
- [Date pickers](./base__date-pickers.md) — DatePicker (single / range / multiple) and MonthYearPicker — popover-based, locale-aware, with optional year dropdown and time input.
- [Display](./base__display.md) — The display layer — Avatar, IconBadge, InlineStat, Tooltip, Separator, NotificationBanner, BooleanIndicator, ShowIf, ThrottleAlert, VisuallyHidden, PlaceholderPattern.
- [Empty state](./base__empty-state.md) — Adaptive zero-data surface. Wrap with the right illustration per resource — products, users, search results, inbox. Slots for media / actions / footer; consumer overrides every string.
- [Event calendar](./base__event-calendar.md) — Month view with categories, filtering, navigation rules, custom event rendering, and three day-heading variants.
- [Forms](./base__forms.md) — The full form scope — FormField wrapper plus every field component exported from base/forms/fields: text inputs, numeric, selects, toggles, choice groups, date/time, repeaters, localized fields, and uploads.
- [Item](./base__item.md) — Canonical row primitive — icon/avatar/image media, title + description content, optional actions. Use ItemGroup to compose lists.
- [Map](./base__map.md) — Leaflet-backed map primitives — Map shell, MapTileLayer, MapMarker, MapPopup. Always wrap in a fixed-height container.
- [Metadata list](./base__metadata-list.md) — Flexible label/value list for entity metadata. Three layouts (vertical grid, horizontal pills, two-column rows), per-item icons, tooltips, descriptions, and custom renderers — with first-class empty-state handling.
- [Navigation](./base__navigation.md) — The navigation primitives — PageHeader, Breadcrumbs, ActionMenu, LanguageSwitcher, SectionNav, SideNav, AsideNavigationMenu, TabNavigationMenu, NavigationTabs, OverflowTabBar.
- [Spinner](./base__spinner.md) — Loading indicator with three visual variants. Pairs with content placeholders, route transitions, and Suspense fallbacks.
- [Table](./base__table.md) — DataTable + Pagination — TanStack-React-Table-backed, with sorting, row actions, sticky header, three sizes, and three surface chromes.
- [Typography](./base__typography.md) — Heading, Text, Label, and TextLink — the four typography primitives every higher layer composes from.
- [Upload tray](./base__upload-tray.md) — Drag-drop area + per-file progress rows + summary toolbar. Composes Dropzone and UploadProgressList. Framework-agnostic — the consumer drives the actual transfer.

## common

- [Common · Brand](./common__brand.md) — Logo + AppLogo (sized variants). Source images expected at /assets/media/gct-logo[-light].png.

## composed

- [Composed · Admin](./composed__admin.md) — Team list, permissions, conversations, settings, inventory.
- [Composed · AI](./composed__ai.md) — Summary block + classification panel.
- [Composed · AI (elements)](./composed__ai-elements.md) — Standalone surfaces ported from elements.ai-sdk.dev: shimmer, code-block, agent, package-info, reasoning, chain-of-thought, sources, inline-citation, task, artifact, file-tree, confirmation, attachment.
- [Composed · AI (extras)](./composed__ai-new.md) — Confidence dial, prompt suggestions, token usage card, message bubble, tool call, citation, feedback.
- [Composed · Admin · API key list](./composed__api-key-list.md) — Collapsible section with per-row dropdown menu (Copy / Delete) and an optional Add action in the header. Generic enough for any 'named secret list' — service tokens, webhook URLs, deployment hooks. Composes base/cards + base/display/collapsible + base/navigation/ActionMenu + base/copyable.
- [Composed · Commerce](./composed__commerce.md) — Bookings, loyalty, discount stacks, shipment tracking.
- [Composed · Commerce (extras)](./composed__commerce-extras.md) — Cart, coupon, order status, payment, tax breakdown, subscription, refund, address, voucher.
- [Composed · Contact card](./composed__contact-card.md) — ContactCard — name, role, email, phone, location, badge.
- [Composed · Course card](./composed__course-card.md) — Group experience with participants & progress.
- [Composed · Dark surfaces](./composed__dark-surfaces.md) — Dark-wrapped components — payment, receipt, info panel, order items, outstanding balance.
- [Composed · Dense info cards](./composed__dense-info.md) — Five layout variants — dashboard, classification, financial, project, score.
- [Composed · Feature announcement](./composed__feature-announcement.md) — Highlight a new feature with tags and an action.
- [Composed · Giftcard cards](./composed__giftcard-cards.md) — Five visual variants — gradient, compact, minimal, dark, illustrated.
- [Composed · Gradient card](./composed__gradient-card.md) — Vivid gradient card with optional pattern, badge, alert, action.
- [Composed · Invoice header](./composed__invoice-header.md) — Top of an invoice — number, status, parties, amount.
- [Composed · Invoice items](./composed__invoice-items.md) — Table, compact, detailed layouts with subtotal/tax/discount/total.
- [Composed · Invoice mini](./composed__invoice-mini.md) — Compact invoice tile — paid / pending / overdue.
- [Composed · Invoice table](./composed__invoice-table.md) — Line items with qty / price / total.
- [Composed · Navigation & boards](./composed__navigation.md) — Kanban, tab switcher, time ruler, vendor performance, experience activity.
- [Composed · Navigation (extras)](./composed__navigation-extras.md) — BreadcrumbProgress wizard + CategoryNavCard sidebar.
- [Composed · Onboarding · Checklist](./composed__onboarding-checklist.md) — Step-list accordion with completed / in-progress / pending status indicators. Auto-opens the next non-completed step. Strings + status ARIA fully overridable. Composes base/accordion.
- [Composed · Timelines](./composed__timelines.md) — Read-only tracking timelines — steps, order, payment, activity stream, release changelog, project milestones. For interactive activity (segments, mass-config, resource registry, callbacks) see Features → Activity feed.
- [Composed · Vendor profile](./composed__vendor-profile.md) — VendorProfileCard with metrics, stats and actions.

## features

- [Features · Activity feed](./features__activities.md) — Interactive activity feed — generic, framework-agnostic, with headline segments, callbacks (actor / resource / action), strings, slots, mass event configuration, and a save/restore resource registry. For read-only tracking timelines (order, payment, changelog, milestones) see Composed → Timelines.
- [AI Chat](./features__ai-chat.md) — Framework-agnostic AI chat surface. Ties together prompt input, conversation, message renderer, queue, and the full composed/ai/* palette (reasoning, tool calls, attachments, artifacts, confirmations).
- [Features · Comments](./features__comments.md) — Generic, framework-agnostic comments with rich-text composer (TipTap-backed), inline resource references (mentions, links, badges), attachment uploads with progress, and reactions. Every callback / registry flows as a direct prop — no provider.
- [Features · Enhanced activities](./features__enhanced-activities.md) — 
- [Features · Event log](./features__event-log.md) — Unified, mentions-aware mixed-source log: comments + audit events + system messages + custom kinds under one chronological surface. Inline `@user` / `#booking` / `$order` triggers work in the composer; resource chips render with tone-driven Badge variants in every entry kind.
- [Filters](./features__filters.md) — Composable filter system. Search + multi-select stay always visible; the rest collapse behind a Filters button. Provider-driven so it works with any data source.
- [GlobalSearch](./features__global-search.md) — Async search palette with slots, render-props, and a headless useGlobalSearch hook.
- [Features · Kanban](./features__kanban.md) — Drag-and-drop board, generic in T. Pass `itemActions` (static array or per-item factory) for the ⋮ menu, `onItemClick` for whole-card click. Headless via `useKanban`; slots: KanbanBoard / KanbanColumn / KanbanColumnContent / KanbanItem / KanbanItemHandle / KanbanItemActions / KanbanOverlay.
- [Features · Metrics · Analytics bar](./features__metrics-analytics-bar.md) — `MetricBar` — horizontal KPI strip with hairline-divided cells. Pair with `MetricGrid` for card-style layouts.
- [Features · Metrics · Analytics cards](./features__metrics-analytics-cards.md) — `MetricGradient` — vivid gradient hero card with embedded area chart. Pick a `theme` to drive the colour palette.
- [Features · Metrics · Comparison](./features__metrics-comparison.md) — `MetricComparison` — side-by-side current vs previous with a tone-tinted delta box. Reuses the unified `MetricData` shape so currency/percent formatting carries through.
- [Features · Metrics · Activity heatmap](./features__metrics-heatmap.md) — `ActivityHeatmap` — GitHub-style daily-activity calendar with success-tinted intensity cells.
- [Features · Metrics · Inline badge](./features__metrics-inline-badge.md) — `InlineMetricBadge` — compact `label · value · change%` pill rows. Use as in-flow copy where a full Metric tile is too heavy.
- [Features · Metrics · KPI row](./features__metrics-kpi-row.md) — `MiniKpiRow` — compact horizontal divider-separated KPI strip for header / footer accents.
- [Features · Metrics · Micro chart grid](./features__metrics-micro-grid.md) — `MetricMicroGrid` — six-cell dense overview pairing each KPI with a different lightweight visualization (bars / line / dots / progress / area / pie).
- [Features · Metrics · Overview](./features__metrics-overview.md) — The unified metrics module: a single Metric component with seven layout variants, plus MetricBar, MetricGrid, and supporting atoms (TrendChip, Sparkline, Skeleton). One MetricData shape powers every surface — see the dedicated pages for each layout.
- [Features · Metrics · Stat cards](./features__metrics-stat-cards.md) — Two stat tile flavors built from the unified `Metric` component — `accent` (dark surface + sparkline) and `colored` (segmented progress bar).
- [Features · Overlays](./features__overlays.md) — 
- [Features · Rich text editor](./features__rich-text-editor.md) — Tiptap-backed editor with bold / italic / strike / lists / quote / undo-redo. Falls back to a non-editable preview when @tiptap/react is not bundled. Strings overridable via the `strings` prop.

## layout

- [Layout · Containers](./layout__layout-containers.md) — Container and Section primitives for page structure, width clamps, padding density, and semantic wrappers.
- [Layout · Header](./layout__layout-header.md) — Topbar, breadcrumbs, command search, notifications, and action slots in a realistic app-shell canvas.
- [Layout · Page](./layout__layout-page.md) — Page shell, header partials, actions, and content regions with framework-neutral links.
- [Layout · Sidebar](./layout__layout-sidebar.md) — Full app sidebar assembly plus reusable navigation, workspace, and footer item partials.
- [Layout · Users & avatars](./layout__layout-users.md) — User identity surfaces used by layout headers, sidebars, menus, avatar groups, and status badges.

## ui

- [UI · Alert](./ui__alert.md) — shadcn alert primitive: variants, with title/description/action.
- [UI · Avatar](./ui__avatar.md) — Avatar with fallback, image, sizes, group, badge.
- [UI · Breadcrumb](./ui__breadcrumb.md) — shadcn breadcrumb — list, items, separator (default & custom).
- [UI · Button](./ui__button.md) — shadcn primitive button — variants, sizes, button group.
- [UI · Calendar](./ui__calendar.md) — react-day-picker styled with shadcn primitives.
- [UI · Collapsible](./ui__collapsible.md) — Headless show/hide region.
- [UI · Empty + Item](./ui__empty-item.md) — Empty state and Item list-row primitives.
- [UI · Input group](./ui__input-group.md) — Input with leading / trailing add-ons.
- [UI · Inputs](./ui__inputs.md) — Input, Textarea, Select primitives.
- [UI · Menus](./ui__menus.md) — DropdownMenu, ContextMenu, Command palette.
- [UI · Overlays](./ui__overlays.md) — Dialog, Sheet, Popover, Tooltip, HoverCard.
- [UI · Pagination](./ui__pagination.md) — Manual composition of pagination controls.
- [UI · Progress](./ui__progress.md) — Linear progress bar at varying values.
- [UI · Scroll area](./ui__scroll-area.md) — Custom-styled scroll viewport.
- [UI · Separator](./ui__separator.md) — Horizontal & vertical dividers.
- [UI · Skeleton](./ui__skeleton.md) — Animated loading placeholders.
- [UI · Sonner toaster](./ui__sonner.md) — Toast notifications.
- [UI · Spinner](./ui__spinner.md) — Loading spinner — sized via className.
- [UI · Tabs](./ui__tabs.md) — Tab list with content panels.
- [UI · Toggles](./ui__toggles.md) — Checkbox, Switch, RadioGroup, Slider primitives.
- [UI · Toggle + ToggleGroup](./ui__toggles-group.md) — Single toggle + radio/multiple group.
- [UI · Badge](./ui__ui-badge.md) — shadcn badge primitive (no theming wrapper).
- [UI · Card](./ui__ui-card.md) — shadcn primitive card with header / title / description / content / footer.
- [UI · Table](./ui__ui-table.md) — shadcn table primitive (no data layer).

