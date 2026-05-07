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
	{ id: 'ui/alerts', label: 'Alert', section: 'UI', family: 'Feedback', component: lazy(() => import('./pages/ui/alert.mdx')), status: 'ready' },
	{ id: 'ui/sonner', label: 'Toaster', section: 'UI', family: 'Feedback', component: lazy(() => import('./pages/ui/sonner.mdx')), status: 'ready' },

	{ id: 'ui/badge', label: 'Badge', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/ui-badge.mdx')), status: 'ready' },
	{ id: 'ui/avatar', label: 'Avatar', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/avatar.mdx')), status: 'ready' },
	{ id: 'ui/progress', label: 'Progress', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/progress.mdx')), status: 'ready' },
	{ id: 'ui/skeleton', label: 'Skeleton', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/skeleton.mdx')), status: 'ready' },
	{ id: 'ui/spinner', label: 'Spinner', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/spinner.mdx')), status: 'ready' },
	{ id: 'ui/table', label: 'Table', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/ui-table.mdx')), status: 'ready' },
	{ id: 'ui/empty-item', label: 'Empty + Item', section: 'UI', family: 'Data display', component: lazy(() => import('./pages/ui/empty-item.mdx')), status: 'ready' },

	{ id: 'ui/separator', label: 'Separator', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/separator.mdx')), status: 'ready' },
	{ id: 'ui/card', label: 'Card', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/ui-card.mdx')), status: 'ready' },
	{ id: 'ui/scroll-area', label: 'Scroll area', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/scroll-area.mdx')), status: 'ready' },
	{ id: 'ui/collapsible', label: 'Collapsible', section: 'UI', family: 'Layout', component: lazy(() => import('./pages/ui/collapsible.mdx')), status: 'ready' },

	{ id: 'ui/tabs', label: 'Tabs', section: 'UI', family: 'Navigation', component: lazy(() => import('./pages/ui/tabs.mdx')), status: 'ready' },
	{ id: 'ui/breadcrumb', label: 'Breadcrumb', section: 'UI', family: 'Navigation', component: lazy(() => import('./pages/ui/breadcrumb.mdx')), status: 'ready' },
	{ id: 'ui/pagination', label: 'Pagination', section: 'UI', family: 'Navigation', component: lazy(() => import('./pages/ui/pagination.mdx')), status: 'ready' },

	{ id: 'ui/button', label: 'Button', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/button.mdx')), status: 'ready' },
	{ id: 'ui/inputs', label: 'Inputs', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/inputs.mdx')), status: 'ready' },
	{ id: 'ui/input-group', label: 'Input group', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/input-group.mdx')), status: 'ready' },
	{ id: 'ui/toggles', label: 'Toggles', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/toggles.mdx')), status: 'ready' },
	{ id: 'ui/toggle-group', label: 'Toggle group', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/toggles-group.mdx')), status: 'ready' },
	{ id: 'ui/calendar', label: 'Calendar', section: 'UI', family: 'Forms', component: lazy(() => import('./pages/ui/calendar.mdx')), status: 'ready' },

	{ id: 'ui/overlays', label: 'Overlays', section: 'UI', family: 'Overlays', component: lazy(() => import('./pages/ui/overlays.mdx')), status: 'ready' },
	{ id: 'ui/menus', label: 'Menus', section: 'UI', family: 'Overlays', component: lazy(() => import('./pages/ui/menus.mdx')), status: 'ready' },

	// ── Base wrappers ────────────────────────────────────────────────
	{ id: 'base/buttons', label: 'Buttons', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/buttons.mdx')), status: 'ready' },
	{ id: 'base/typography', label: 'Typography', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/typography.mdx')), status: 'ready' },
	{ id: 'base/badge', label: 'Badge', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/badge.mdx')), status: 'ready' },
	{ id: 'base/cards', label: 'Cards (SmartCard)', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/cards.mdx')), status: 'ready' },
	{ id: 'base/item', label: 'Item (rows)', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/item.mdx')), status: 'ready' },

	{ id: 'layout/containers', label: 'Layout containers', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/layout-containers.mdx')), status: 'ready' },
	{ id: 'layout/page', label: 'Page shell', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/layout-page.mdx')), status: 'ready' },
	{ id: 'layout/header', label: 'Header shell', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/layout-header.mdx')), status: 'ready' },
	{ id: 'layout/sidebar', label: 'Sidebar shell', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/layout-sidebar.mdx')), status: 'ready' },
	{ id: 'layout/users', label: 'Users & avatars', section: 'Base', family: 'Layout', component: lazy(() => import('./pages/layout/layout-users.mdx')), status: 'ready' },

	{ id: 'base/accordion', label: 'Accordion', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/accordion.mdx')), status: 'ready' },
	{ id: 'base/display', label: 'Display', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/display.mdx')), status: 'ready' },
	{ id: 'base/empty-state', label: 'Empty state', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/empty-state.mdx')), status: 'ready' },
	{ id: 'base/copyable', label: 'Copyable', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/copyable.mdx')), status: 'ready' },
	{ id: 'base/currency', label: 'Currency', section: 'Base', family: 'Display', component: lazy(() => import('./pages/base/currency.mdx')), status: 'ready' },

	{ id: 'base/forms', label: 'Forms', section: 'Base', family: 'Forms & inputs', component: lazy(() => import('./pages/base/forms.mdx')), status: 'ready' },
	{ id: 'base/upload-tray', label: 'Upload tray', section: 'Base', family: 'Forms & inputs', component: lazy(() => import('./pages/base/upload-tray.mdx')), status: 'ready' },
	{ id: 'base/combobox', label: 'Combobox', section: 'Base', family: 'Forms & inputs', component: lazy(() => import('./pages/base/combobox.mdx')), status: 'ready' },
	{ id: 'base/date-pickers', label: 'Date pickers', section: 'Base', family: 'Forms & inputs', component: lazy(() => import('./pages/base/date-pickers.mdx')), status: 'ready' },

	{ id: 'base/navigation', label: 'Navigation', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/navigation.mdx')), status: 'ready' },
	{ id: 'base/table', label: 'Table', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/table.mdx')), status: 'ready' },
	{ id: 'base/event-calendar', label: 'Event calendar', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/event-calendar.mdx')), status: 'ready' },
	{ id: 'base/map', label: 'Map', section: 'Base', family: 'Navigation & data', component: lazy(() => import('./pages/base/map.mdx')), status: 'ready' },

	// ── Common ───────────────────────────────────────────────────────
	{ id: 'common/brand', label: 'Brand', section: 'Common', family: 'Branding', component: lazy(() => import('./pages/common/brand.mdx')), status: 'ready' },

	// ── Composed ─────────────────────────────────────────────────────
	{ id: 'composed/cards-contact', label: 'Contact', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/contact-card.mdx')), status: 'ready' },
	{ id: 'composed/cards-gradient', label: 'Gradient', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/gradient-card.mdx')), status: 'ready' },
	{ id: 'composed/cards-feature', label: 'Feature announcement', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/feature-announcement.mdx')), status: 'ready' },
	{ id: 'composed/cards-giftcard', label: 'Giftcard', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/giftcard-cards.mdx')), status: 'ready' },
	{ id: 'composed/cards-course', label: 'Course', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/course-card.mdx')), status: 'ready' },
	{ id: 'composed/cards-vendor', label: 'Vendor profile', section: 'Composed', family: 'Cards', component: lazy(() => import('./pages/composed/vendor-profile.mdx')), status: 'ready' },

	{ id: 'composed/data-display-invoice-mini', label: 'Invoice mini', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/invoice-mini.mdx')), status: 'ready' },
	{ id: 'composed/data-display-invoice-items', label: 'Invoice items', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/invoice-items.mdx')), status: 'ready' },
	{ id: 'composed/data-display-invoice-header', label: 'Invoice header', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/invoice-header.mdx')), status: 'ready' },
	{ id: 'composed/data-display-invoice-table', label: 'Invoice table', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/invoice-table.mdx')), status: 'ready' },
	{ id: 'composed/data-display-dense-info', label: 'Dense info', section: 'Composed', family: 'Data display', component: lazy(() => import('./pages/composed/dense-info.mdx')), status: 'ready' },

	{ id: 'composed/admin', label: 'Admin', section: 'Composed', family: 'Admin', component: lazy(() => import('./pages/composed/admin.mdx')), status: 'ready' },
	{ id: 'composed/admin-api-keys', label: 'API keys', section: 'Composed', family: 'Admin', component: lazy(() => import('./pages/composed/api-key-list.mdx')), status: 'ready' },
	{ id: 'composed/dark-surfaces', label: 'Dark surfaces', section: 'Composed', family: 'Surfaces', component: lazy(() => import('./pages/composed/dark-surfaces.mdx')), status: 'ready' },
	{ id: 'composed/commerce', label: 'Commerce', section: 'Composed', family: 'Commerce', component: lazy(() => import('./pages/composed/commerce.mdx')), status: 'ready' },
	{ id: 'composed/commerce-extras', label: 'Commerce (extras)', section: 'Composed', family: 'Commerce', component: lazy(() => import('./pages/composed/commerce-extras.mdx')), status: 'ready' },
	{ id: 'composed/navigation', label: 'Navigation & boards', section: 'Composed', family: 'Navigation', component: lazy(() => import('./pages/composed/navigation.mdx')), status: 'ready' },
	{ id: 'composed/navigation-extras', label: 'Navigation (extras)', section: 'Composed', family: 'Navigation', component: lazy(() => import('./pages/composed/navigation-extras.mdx')), status: 'ready' },
	{ id: 'composed/timelines', label: 'Timelines', section: 'Composed', family: 'Timelines', component: lazy(() => import('./pages/composed/timelines.mdx')), status: 'ready' },
	{ id: 'composed/ai', label: 'AI', section: 'Composed', family: 'AI', component: lazy(() => import('./pages/composed/ai.mdx')), status: 'ready' },
	{ id: 'composed/ai-extras', label: 'AI (extras)', section: 'Composed', family: 'AI', component: lazy(() => import('./pages/composed/ai-new.mdx')), status: 'ready' },
	{ id: 'composed/ai-elements', label: 'AI elements', section: 'Composed', family: 'AI', component: lazy(() => import('./pages/composed/ai-elements.mdx')), status: 'ready' },
	{ id: 'composed/onboarding-checklist', label: 'Onboarding checklist', section: 'Composed', family: 'Onboarding', component: lazy(() => import('./pages/composed/onboarding-checklist.mdx')), status: 'ready' },

	// ── Features (app-level capabilities) ────────────────────────────
	{ id: 'features/metrics-overview', label: 'Overview', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-overview.mdx')), status: 'ready' },
	{ id: 'features/metrics-stat-cards', label: 'Stat cards', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-stat-cards.mdx')), status: 'ready' },
	{ id: 'features/metrics-analytics-cards', label: 'Analytics cards', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-analytics-cards.mdx')), status: 'ready' },
	{ id: 'features/metrics-analytics-bar', label: 'Analytics bar', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-analytics-bar.mdx')), status: 'ready' },
	{ id: 'features/metrics-comparison', label: 'Comparison', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-comparison.mdx')), status: 'ready' },
	{ id: 'features/metrics-micro-grid', label: 'Micro chart grid', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-micro-grid.mdx')), status: 'ready' },
	{ id: 'features/metrics-heatmap', label: 'Activity heatmap', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-heatmap.mdx')), status: 'ready' },
	{ id: 'features/metrics-inline-badge', label: 'Inline badge', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-inline-badge.mdx')), status: 'ready' },
	{ id: 'features/metrics-kpi-row', label: 'KPI row', section: 'Features', family: 'Metrics', component: lazy(() => import('./pages/features/metrics-kpi-row.mdx')), status: 'ready' },

	{ id: 'features/overlays', label: 'Overlays', section: 'Features', family: 'Overlays', component: lazy(() => import('./pages/features/overlays.mdx')), status: 'ready' },
	{ id: 'features/filters', label: 'Filters', section: 'Features', family: 'Search & filter', component: lazy(() => import('./pages/features/filters.mdx')), status: 'ready' },
	{ id: 'features/global-search', label: 'Global search', section: 'Features', family: 'Search & filter', component: lazy(() => import('./pages/features/global-search.mdx')), status: 'ready' },
	{ id: 'features/rich-text', label: 'Rich text editor', section: 'Features', family: 'Inputs', component: lazy(() => import('./pages/features/rich-text-editor.mdx')), status: 'ready' },
	{ id: 'features/ai-chat', label: 'AI chat', section: 'Features', family: 'AI', component: lazy(() => import('./pages/features/ai-chat.mdx')), status: 'ready' },
	{ id: 'features/comments', label: 'Comments', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/comments.mdx')), status: 'ready' },
	{ id: 'features/event-log', label: 'Event log (comments + events)', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/event-log.mdx')), status: 'ready' },
	{ id: 'features/activities', label: 'Activity feed', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/activities.mdx')), status: 'ready' },
	{ id: 'features/enhanced-activities', label: 'Enhanced activities (Shopify-style)', section: 'Features', family: 'Collaboration', component: lazy(() => import('./pages/features/enhanced-activities.mdx')), status: 'ready' },
	{ id: 'features/kanban', label: 'Kanban', section: 'Features', family: 'Boards', component: lazy(() => import('./pages/features/kanban.mdx')), status: 'ready' },
	{ id: 'base/spinner', label: 'Spinner', section: 'Base', family: 'Feedback', component: lazy(() => import('./pages/base/spinner.mdx')), status: 'ready' },
	{ id: 'base/metadata', label: 'Metadata list', section: 'Base', family: 'Data display', component: lazy(() => import('./pages/base/metadata-list.mdx')), status: 'ready' },

	// ---- Layout ----
	{ id: 'layout/page', label: 'Page shell', section: 'Layout', family: 'Shells', component: lazy(() => import('./pages/layout/layout-page.mdx')), status: 'ready' },
	{ id: 'layout/header', label: 'Header', section: 'Layout', family: 'Shells', component: lazy(() => import('./pages/layout/layout-header.mdx')), status: 'ready' },
	{ id: 'layout/sidebar', label: 'Sidebar', section: 'Layout', family: 'Shells', component: lazy(() => import('./pages/layout/layout-sidebar.mdx')), status: 'ready' },
	{ id: 'layout/containers', label: 'Containers', section: 'Layout', family: 'Building blocks', component: lazy(() => import('./pages/layout/layout-containers.mdx')), status: 'ready' },
	{ id: 'layout/users', label: 'User cells', section: 'Layout', family: 'Building blocks', component: lazy(() => import('./pages/layout/layout-users.mdx')), status: 'ready' },
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
