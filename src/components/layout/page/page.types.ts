/**
 * Page-level types for `Page`, `PageHeader`, `PageActions`, and exported
 * partials. All navigation is framework-neutral via `renderLink`.
 */
import type { ComponentType, JSX, Key, ReactNode } from 'react';

import type {
	LayoutLinkRenderer,
	LayoutNavigationAdapter,
	LinkComponent,
} from '../layout.types';
import type { ContainerWidth } from '../containers/containers.types';

export type PageHeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface PageTitleBadge {
	label: ReactNode;
	variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
	key?: Key;
}

export interface PageHeaderSlots {
	/** Replaces the leading back control entirely. */
	back?: ReactNode;
	/** Additional content before the title line. */
	beforeTitle?: ReactNode;
	/** Additional content after the description. */
	afterDescription?: ReactNode;
	/** Replaces the trailing actions region. */
	actions?: ReactNode;
}

export interface PageHeaderProps extends LayoutNavigationAdapter {
	title: ReactNode;
	description?: ReactNode;
	/** Semantic heading level for the title. Defaults to `h3` for nested app pages. */
	headingTag?: PageHeadingTag;
	backHref?: string;
	onBack?: () => void;
	backLabel?: string;
	titleBadges?: PageTitleBadge[];
	actions?: ReactNode;
	slots?: PageHeaderSlots;
	className?: string;
	contentClassName?: string;
	actionsClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export type PageActionVariant =
	| 'primary'
	| 'secondary'
	| 'destructive'
	| 'success'
	| 'warning';

export interface PageActionContext {
	index: number;
	isInline: boolean;
	renderLink: LayoutLinkRenderer;
}

export interface PageAction {
	id?: string;
	label: ReactNode;
	onClick?: () => void;
	href?: string;
	target?: string;
	rel?: string;
	external?: boolean;
	disabled?: boolean;
	loading?: boolean;
	icon?: ComponentType<{ className?: string }>;
	variant?: PageActionVariant;
	visible?: boolean;
	group?: string;
	placement?: 'auto' | 'inline' | 'menu';
	/** Escape hatch for one action only. Prefer `renderAction` for consistent customization. */
	element?: ReactNode | JSX.Element;
}

export type PageActionsDisplay = 'flat' | 'dropdown' | 'auto';

export interface PageActionsStrings {
	menuLabel: string;
}

export const defaultPageActionsStrings: PageActionsStrings = {
	menuLabel: 'Page actions',
};

export interface PageActionsProps extends LayoutNavigationAdapter {
	actions?: PageAction[];
	display?: PageActionsDisplay;
	breakpoint?: number;
	/**
	 * Maximum non-menu actions rendered inline before overflow moves them into
	 * the dropdown menu. Defaults to 4 for admin header density.
	 */
	maxInlineActions?: number;
	strings?: Partial<PageActionsStrings>;
	className?: string;
	inlineClassName?: string;
	menuClassName?: string;
	renderAction?: (action: PageAction, context: PageActionContext) => ReactNode;
	/** @deprecated Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

export interface PageProps extends LayoutNavigationAdapter {
	header?: PageHeaderProps;
	width?: ContainerWidth;
	children?: ReactNode;
	className?: string;
	bodyClassName?: string;
}
