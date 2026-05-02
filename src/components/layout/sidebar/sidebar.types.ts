/**
 * Sidebar types — framework-neutral navigation tree, render contexts, slots,
 * strings, and composition props.
 */
import type { ComponentType, ReactNode } from 'react';

import type {
	LayoutIconSource,
	LayoutLinkRenderer,
	LayoutNavigationAdapter,
	LinkComponent,
} from '../layout.types';

export interface SidebarNavItem {
	/** New preferred label. */
	label?: ReactNode;
	/** Back-compat label used by older call sites. */
	title?: ReactNode;
	href?: string;
	handle?: string;
	icon?: LayoutIconSource;
	disabled?: boolean;
	badge?: string | number;
	children?: SidebarNavItem[];
	group?: string;
	external?: boolean;
}

export type SidebarFlatNavItem = Omit<SidebarNavItem, 'children' | 'group'>;

export interface SidebarRenderItemContext {
	depth: number;
	active: boolean;
	expanded: boolean;
	badge?: string | number;
	renderLink: LayoutLinkRenderer;
}

export interface SidebarSlots {
	header?: ReactNode;
	beforeNavigation?: ReactNode;
	afterNavigation?: ReactNode;
	footer?: ReactNode;
	empty?: ReactNode;
	loading?: ReactNode;
}

export interface AppSidebarProps extends LayoutNavigationAdapter {
	navigationGroups?: Record<string, SidebarNavItem[]>;
	footerNavItems?: SidebarFlatNavItem[];
	footerLabel?: ReactNode;
	logo?: ReactNode;
	collapsedLogo?: ReactNode;
	workspaceLinks?: WorkspaceLink[];
	workspaceStrings?: Partial<SidebarWorkspaceDropdownStrings>;
	workspaceContentClassName?: string;
	headerClassName?: string;
	logoClassName?: string;
	iconMap?: Record<string, ComponentType<{ className?: string }>>;
	currentUrl?: string;
	liveBadges?: Record<string, string | number>;
	loading?: boolean;
	collapsible?: 'offcanvas' | 'icon' | 'none';
	variant?: 'sidebar' | 'floating' | 'inset';
	side?: 'left' | 'right';
	className?: string;
	surfaceClassName?: string;
	contentClassName?: string;
	slots?: SidebarSlots;
	renderItem?: (item: SidebarNavItem, context: SidebarRenderItemContext) => ReactNode;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export interface SidebarGroupedNavigationProps extends LayoutNavigationAdapter {
	navigationByGroups: Record<string, SidebarNavItem[]>;
	currentUrl?: string;
	iconMap?: Record<string, ComponentType<{ className?: string }>>;
	liveBadges?: Record<string, string | number>;
	emptySlot?: ReactNode;
	renderItem?: (item: SidebarNavItem, context: SidebarRenderItemContext) => ReactNode;
	className?: string;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export interface SidebarFlatNavigationProps extends LayoutNavigationAdapter {
	items: SidebarFlatNavItem[];
	label?: ReactNode;
	currentUrl?: string;
	iconMap?: Record<string, ComponentType<{ className?: string }>>;
	liveBadges?: Record<string, string | number>;
	renderItem?: (item: SidebarFlatNavItem, context: SidebarRenderItemContext) => ReactNode;
	className?: string;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export interface WorkspaceLink {
	label: ReactNode;
	url: string;
	icon?: ComponentType<{ className?: string }>;
	external?: boolean;
}

export interface SidebarWorkspaceDropdownStrings {
	label: string;
	select: string;
}

export const defaultSidebarWorkspaceDropdownStrings: SidebarWorkspaceDropdownStrings = {
	label: 'Workspace',
	select: 'Select workspace',
};

export interface SidebarWorkspaceDropdownProps extends LayoutNavigationAdapter {
	logo: ReactNode;
	collapsedLogo?: ReactNode;
	workspaceLinks: WorkspaceLink[];
	strings?: Partial<SidebarWorkspaceDropdownStrings>;
	contentClassName?: string;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export type SidebarFooterNavigationItem = SidebarFlatNavItem;

export interface SidebarNavigationFooterProps extends LayoutNavigationAdapter {
	items: SidebarFooterNavigationItem[];
	label?: ReactNode;
	currentUrl?: string;
	iconMap?: Record<string, ComponentType<{ className?: string }>>;
	liveBadges?: Record<string, string | number>;
	className?: string;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}
