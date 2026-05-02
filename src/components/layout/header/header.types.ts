/**
 * Header layout and partial types.
 *
 * This layer is intentionally framework-neutral: links and route state enter
 * through `renderLink`, and app-specific content enters through slots.
 */
import type { ReactNode } from 'react';

import type {
	BreadcrumbItem,
	LayoutNavigationAdapter,
	LayoutUser,
	LinkComponent,
} from '../layout.types';

export interface HeaderBreadcrumbsProps extends LayoutNavigationAdapter {
	breadcrumbs?: BreadcrumbItem[];
	homeBreadcrumb?: BreadcrumbItem | null;
	showSidebarTrigger?: boolean;
	triggerSlot?: ReactNode;
	className?: string;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export type NotificationTone = 'info' | 'success' | 'warning' | 'error';

export interface HeaderNotification {
	id: string | number;
	title: ReactNode;
	description?: ReactNode;
	time?: ReactNode;
	read?: boolean;
	tone?: NotificationTone;
	href?: string;
}

export interface HeaderNotificationsStrings {
	triggerLabel: string;
	heading: string;
	markAllRead: string;
	empty: string;
	viewAll: string;
}

export const defaultHeaderNotificationsStrings: HeaderNotificationsStrings = {
	triggerLabel: 'Notifications',
	heading: 'Notifications',
	markAllRead: 'Mark all as read',
	empty: 'No new notifications',
	viewAll: 'View all notifications',
};

export interface HeaderNotificationsProps extends LayoutNavigationAdapter {
	notifications?: HeaderNotification[];
	unreadCount?: number;
	onNotificationClick?: (notification: HeaderNotification) => void;
	onMarkAllRead?: () => void;
	onViewAll?: () => void;
	viewAllHref?: string;
	align?: 'start' | 'center' | 'end';
	side?: 'top' | 'right' | 'bottom' | 'left';
	strings?: Partial<HeaderNotificationsStrings>;
	className?: string;
	contentClassName?: string;
	renderNotification?: (notification: HeaderNotification) => ReactNode;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export interface HeaderSearchStrings {
	placeholder: string;
	shortcutMac: string;
	shortcutPc: string;
}

export const defaultHeaderSearchStrings: HeaderSearchStrings = {
	placeholder: 'Search...',
	shortcutMac: '⌘K',
	shortcutPc: 'Ctrl+K',
};

export interface HeaderSearchProps {
	onOpen?: () => void;
	isMac?: boolean;
	enableShortcut?: boolean;
	strings?: Partial<HeaderSearchStrings>;
	className?: string;
	iconClassName?: string;
	shortcutSlot?: ReactNode;
}

export interface HeaderUserMenuProps {
	user: LayoutUser;
	showEmail?: boolean;
	customContent?: ReactNode;
	onProfile?: () => void;
	onSettings?: () => void;
	onLogout?: () => void;
	align?: 'start' | 'center' | 'end';
	side?: 'top' | 'right' | 'bottom' | 'left';
	strings?: Partial<HeaderUserMenuStrings>;
	triggerClassName?: string;
	contentClassName?: string;
	renderTrigger?: (user: LayoutUser) => ReactNode;
}

export interface HeaderUserMenuStrings {
	profile: string;
	settings: string;
	logout: string;
}

export const defaultHeaderUserMenuStrings: HeaderUserMenuStrings = {
	profile: 'Profile',
	settings: 'Settings',
	logout: 'Log out',
};

export interface HeaderSlots {
	/** Leading brand/logo region before breadcrumbs. */
	brand?: ReactNode;
	/** Replaces the breadcrumb/sidebar-trigger region. */
	breadcrumbs?: ReactNode;
	/** Leading content after breadcrumbs. Prefer this over `leftContent` for new code. */
	left?: ReactNode;
	/** Center content, usually search or a scope switcher. */
	center?: ReactNode;
	/** Trailing content, usually notifications/user menu/actions. */
	right?: ReactNode;
}

export interface HeaderProps extends LayoutNavigationAdapter {
	showBreadcrumbs?: boolean;
	breadcrumbs?: BreadcrumbItem[];
	homeBreadcrumb?: BreadcrumbItem | null;
	showSidebarTrigger?: boolean;
	brand?: ReactNode;
	/** @deprecated Prefer `slots.left`. */
	leftContent?: ReactNode;
	/** @deprecated Prefer `slots.center`. */
	centerContent?: ReactNode;
	/** @deprecated Prefer `slots.right`. */
	rightContent?: ReactNode;
	slots?: HeaderSlots;
	className?: string;
	contentClassName?: string;
	leftClassName?: string;
	centerClassName?: string;
	rightClassName?: string;
	breadcrumbsClassName?: string;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}
