import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type PreviewStatus = 'ready' | 'wip' | 'broken';

export type PreviewEntry = {
	id: string;
	label: string;
	section: 'UI' | 'Base' | 'Common' | 'Composed' | 'Features' | 'Layout';
	family: string;
	component: LazyExoticComponent<ComponentType>;
	status?: PreviewStatus;
	note?: string;
};

export const REGISTRY: PreviewEntry[] = [
	// ── UI primitives (shadcn) ───────────────────────────────────────
	{ id: 'ui/alerts', label: 'Alert', section: 'UI', family: 'Feedback', component: lazy(() => import('./pages/ui/AlertPage')), status: 'ready' },
	{ id: 'ui/sonner', label: 'Toaster', section: 'UI', family: 'Feedback', component: lazy(() => import('./pages/ui/SonnerPage')), status: 'ready' },

	{ id: 'ui/badge', label: 'Badge', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/UiBadgePage')), status: 'ready' },
	{ id: 'ui/avatar', label: 'Avatar', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/AvatarPage')), status: 'ready' },
	{ id: 'ui/progress', label: 'Progress', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/ProgressPage')), status: 'ready' },
	{ id: 'ui/skeleton', label: 'Skeleton', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/SkeletonPage')), status: 'ready' },
	{ id: 'ui/spinner', label: 'Spinner', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/SpinnerPage')), status: 'ready' },
	{ id: 'ui/table', label: 'Table', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/UiTablePage')), status: 'ready' },
	{ id: 'ui/empty-item', label: 'Empty + Item', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/EmptyItemPage')), status: 'ready' },

	{ id: 'ui/separator', label: 'Separator', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/SeparatorPage')), status: 'ready' },
	{ id: 'ui/card', label: 'Card', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/UiCardPage')), status: 'ready' },
	{ id: 'ui/scroll-area', label: 'Scroll area', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/ScrollAreaPage')), status: 'ready' },
	{ id: 'ui/collapsible', label: 'Collapsible', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/CollapsiblePage')), status: 'ready' },

	{ id: 'ui/tabs', label: 'Tabs', section: 'UI', family: 'Navigation', component: lazy(() => import('./pages/ui/TabsPage')), status: 'ready' },
	{ id: 'ui/breadcrumb', label: 'Breadcrumb', section: 'UI', family: 'Navigation', component: lazy(() => import('./pages/ui/BreadcrumbPage')), status: 'ready' },
	{ id: 'ui/pagination', label: 'Pagination', section: 'UI', family: 'Navigation', component: lazy(() => import('./pages/ui/PaginationPage')), status: 'ready' },

	{ id: 'ui/button', label: 'Button', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/ButtonPage')), status: 'ready' },
	{ id: 'ui/inputs', label: 'Inputs', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/InputsPage')), status: 'ready' },
	{ id: 'ui/input-group', label: 'Input group', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/InputGroupPage')), status: 'ready' },
	{ id: 'ui/toggles', label: 'Toggles', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/TogglesPage')), status: 'ready' },
	{ id: 'ui/toggle-group', label: 'Toggle group', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/TogglesGroupPage')), status: 'ready' },
	{ id: 'ui/calendar', label: 'Calendar', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/CalendarPage')), status: 'ready' },

	{ id: 'ui/overlays', label: 'Overlays', section: 'UI', family: 'Overlays', component: lazy(() => import('./pages/ui/OverlaysPage')), status: 'ready' },
	{ id: 'ui/menus', label: 'Menus', section: 'UI', family: 'Overlays', component: lazy(() => import('./pages/ui/MenusPage')), status: 'ready' },

	// ── Base wrappers ────────────────────────────────────────────────
	{ id: 'base/buttons', label: 'Buttons', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/ButtonsPage')), status: 'ready' },
	{ id: 'base/typography', label: 'Typography', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/TypographyPage')), status: 'ready' },
	{ id: 'base/badge', label: 'Badge', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/BadgePage')), status: 'ready' },
	{ id: 'base/cards', label: 'Cards (SmartCard)', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/CardsPage')), status: 'ready' },
	{ id: 'base/item', label: 'Item (rows)', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/ItemPage')), status: 'ready' },

	{ id: 'layout/containers', label: 'Layout containers', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/LayoutContainersPage')), status: 'ready' },
	{ id: 'layout/page', label: 'Page shell', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/LayoutPagePage')), status: 'ready' },
	{ id: 'layout/header', label: 'Header shell', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/LayoutHeaderPage')), status: 'ready' },
	{ id: 'layout/sidebar', label: 'Sidebar shell', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/LayoutSidebarPage')), status: 'ready' },
	{ id: 'layout/users', label: 'Users & avatars', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/LayoutUsersPage')), status: 'ready' },

	{ id: 'base/display', label: 'Display', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/DisplayPage')), status: 'ready' },
	{ id: 'base/empty-state', label: 'Empty state', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/EmptyStatePage')), status: 'ready' },
	{ id: 'base/copyable', label: 'Copyable', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/CopyablePage')), status: 'ready' },
	{ id: 'base/currency', label: 'Currency', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/CurrencyPage')), status: 'ready' },

	{ id: 'base/forms', label: 'Forms', section: 'Base', family: 'Forms & inputs', component: lazy(() => import('./pages/base/FormsPage')), status: 'ready' },
	{ id: 'base/combobox', label: 'Combobox', section: 'Base', family: 'Forms & inputs', component: lazy(() => import('./pages/base/ComboboxPage')), status: 'ready' },
	{ id: 'base/date-pickers', label: 'Date pickers', section: 'Base', family: 'Forms & inputs', component: lazy(() => import('./pages/base/DatePickersPage')), status: 'ready' },

	{ id: 'base/navigation', label: 'Navigation', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/NavigationPage')), status: 'ready' },
	{ id: 'base/table', label: 'Table', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/TablePage')), status: 'ready' },
	{ id: 'base/event-calendar', label: 'Event calendar', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/EventCalendarPage')), status: 'ready' },
	{ id: 'base/map', label: 'Map', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/MapPage')), status: 'ready' },

	// ── Common ───────────────────────────────────────────────────────
	{ id: 'common/brand', label: 'Brand', section: 'Common', family: 'Branding', component: lazy(() => import('./pages/common/BrandPage')), status: 'ready' },

	// ── Composed ─────────────────────────────────────────────────────
	{ id: 'composed/cards-contact', label: 'Contact', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/ContactCardPage')), status: 'ready' },
	{ id: 'composed/cards-gradient', label: 'Gradient', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/GradientCardPage')), status: 'ready' },
	{ id: 'composed/cards-feature', label: 'Feature announcement', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/FeatureAnnouncementPage')), status: 'ready' },
	{ id: 'composed/cards-giftcard', label: 'Giftcard', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/GiftcardCardsPage')), status: 'ready' },
	{ id: 'composed/cards-course', label: 'Course', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/CourseCardPage')), status: 'ready' },
	{ id: 'composed/cards-vendor', label: 'Vendor profile', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/VendorProfilePage')), status: 'ready' },

	{ id: 'composed/data-display-invoice-mini', label: 'Invoice mini', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/InvoiceMiniPage')), status: 'ready' },
	{ id: 'composed/data-display-invoice-items', label: 'Invoice items', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/InvoiceItemsPage')), status: 'ready' },
	{ id: 'composed/data-display-invoice-header', label: 'Invoice header', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/InvoiceHeaderPage')), status: 'ready' },
	{ id: 'composed/data-display-invoice-table', label: 'Invoice table', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/InvoiceTablePage')), status: 'ready' },
	{ id: 'composed/data-display-dense-info', label: 'Dense info', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/DenseInfoPage')), status: 'ready' },

	{ id: 'composed/admin', label: 'Admin', section: 'Composed', family: 'Admin', component: lazy(() => import('./pages/composed/AdminPage')), status: 'ready' },
	{ id: 'composed/dark-surfaces', label: 'Dark surfaces', section: 'Composed', family: 'Surfaces', component: lazy(() => import('./pages/composed/DarkSurfacesPage')), status: 'ready' },
	{ id: 'composed/commerce', label: 'Commerce', section: 'Composed', family: 'Commerce', component: lazy(() => import('./pages/composed/CommercePage')), status: 'ready' },
	{ id: 'composed/commerce-extras', label: 'Commerce (extras)', section: 'Composed', family: 'Commerce', component: lazy(() => import('./pages/composed/CommerceExtrasPage')), status: 'ready' },
	{ id: 'composed/navigation', label: 'Navigation & boards', section: 'Composed', family: 'Navigation', component: lazy(() => import('./pages/composed/NavigationPage')), status: 'ready' },
	{ id: 'composed/navigation-extras', label: 'Navigation (extras)', section: 'Composed', family: 'Navigation', component: lazy(() => import('./pages/composed/NavigationExtrasPage')), status: 'ready' },
	{ id: 'composed/timelines', label: 'Timelines', section: 'Composed', family: 'Timelines', component: lazy(() => import('./pages/composed/TimelinesPage')), status: 'ready' },
	{ id: 'composed/ai', label: 'AI', section: 'Composed', family: 'AI', component: lazy(() => import('./pages/composed/AiPage')), status: 'ready' },
	{ id: 'composed/ai-extras', label: 'AI (extras)', section: 'Composed', family: 'AI', component: lazy(() => import('./pages/composed/AiNewPage')), status: 'ready' },
	{ id: 'composed/ai-elements', label: 'AI elements', section: 'Composed', family: 'AI', component: lazy(() => import('./pages/composed/AiElementsPage')), status: 'ready' },

	// ── Features (app-level capabilities) ────────────────────────────
	{ id: 'features/metrics-overview', label: 'Overview', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsOverviewPage')), status: 'ready' },
	{ id: 'features/metrics-stat-cards', label: 'Stat cards', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsStatCardsPage')), status: 'ready' },
	{ id: 'features/metrics-analytics-cards', label: 'Analytics cards', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsAnalyticsCardsPage')), status: 'ready' },
	{ id: 'features/metrics-analytics-bar', label: 'Analytics bar', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsAnalyticsBarPage')), status: 'ready' },
	{ id: 'features/metrics-comparison', label: 'Comparison', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsComparisonPage')), status: 'ready' },
	{ id: 'features/metrics-micro-grid', label: 'Micro chart grid', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsMicroGridPage')), status: 'ready' },
	{ id: 'features/metrics-heatmap', label: 'Activity heatmap', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsHeatmapPage')), status: 'ready' },
	{ id: 'features/metrics-inline-badge', label: 'Inline badge', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsInlineBadgePage')), status: 'ready' },
	{ id: 'features/metrics-kpi-row', label: 'KPI row', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/MetricsKpiRowPage')), status: 'ready' },

	{ id: 'features/overlays', label: 'Overlays', section: 'Features', family: 'Overlays', component: lazy(() => import('./pages/features/OverlaysPage')), status: 'ready' },
	{ id: 'features/filters', label: 'Filters', section: 'Features', family: 'Search & filter', component: lazy(() => import('./pages/features/FiltersPage')), status: 'ready' },
	{ id: 'features/global-search', label: 'Global search', section: 'Features', family: 'Search & filter', component: lazy(() => import('./pages/features/GlobalSearchPage')), status: 'ready' },
	{ id: 'features/rich-text', label: 'Rich text editor', section: 'Features', family: 'Inputs', component: lazy(() => import('./pages/features/RichTextEditorPage')), status: 'ready' },
	{ id: 'features/ai-chat', label: 'AI chat', section: 'Features', family: 'AI', component: lazy(() => import('./pages/features/AiChatPage')), status: 'ready' },
	{ id: 'features/comments', label: 'Comments', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/CommentsPage')), status: 'ready' },
	{ id: 'features/event-log', label: 'Event log (comments + events)', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/EventLogPage')), status: 'ready' },
	{ id: 'features/activities', label: 'Activity feed', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/ActivitiesPage')), status: 'ready' },
	{ id: 'features/enhanced-activities', label: 'Enhanced activities (Shopify-style)', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/EnhancedActivitiesPage')), status: 'ready' },
	{ id: 'base/spinner', label: 'Spinner', section: 'Base', family: 'Feedback', component: lazy(() => import('./pages/base/SpinnerPage')), status: 'ready' },
	{ id: 'base/metadata', label: 'Metadata list', section: 'Base', family: 'Data display', component: lazy(() => import('./pages/base/MetadataListPage')), status: 'ready' },

	// ---- Layout ----
	{ id: 'layout/page', label: 'Page shell', section: 'Layout', family: 'Shells', component: lazy(() => import('./pages/layout/LayoutPagePage')), status: 'ready' },
	{ id: 'layout/header', label: 'Header', section: 'Layout', family: 'Shells', component: lazy(() => import('./pages/layout/LayoutHeaderPage')), status: 'ready' },
	{ id: 'layout/sidebar', label: 'Sidebar', section: 'Layout', family: 'Shells', component: lazy(() => import('./pages/layout/LayoutSidebarPage')), status: 'ready' },
	{ id: 'layout/containers', label: 'Containers', section: 'Layout', family: 'Building blocks', component: lazy(() => import('./pages/layout/LayoutContainersPage')), status: 'ready' },
	{ id: 'layout/users', label: 'User cells', section: 'Layout', family: 'Building blocks', component: lazy(() => import('./pages/layout/LayoutUsersPage')), status: 'ready' },
];

const SECTION_ORDER: PreviewEntry['section'][] = ['UI', 'Base', 'Common', 'Composed', 'Features', 'Layout'];

export function getStructure(): {
	section: PreviewEntry['section'];
	families: { family: string; entries: PreviewEntry[] }[];
}[] {
	return SECTION_ORDER.map((section) => {
		const sectionEntries = REGISTRY.filter((e) => e.section === section);
		const families: { family: string; entries: PreviewEntry[] }[] = [];
		for (const entry of sectionEntries) {
			let bucket = families.find((f) => f.family === entry.family);
			if (!bucket) {
				bucket = { family: entry.family, entries: [] };
				families.push(bucket);
			}
			bucket.entries.push(entry);
		}
		return { section, families };
	}).filter((s) => s.families.length > 0);
}
