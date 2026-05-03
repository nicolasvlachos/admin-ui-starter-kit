import type { ReactNode } from 'react';

import type { SmartCardStrings } from './smart-card.strings';

export type CardPadding = 'sm' | 'base' | 'lg';

export type CardAlertVariant =
	| 'default'
	| 'destructive'
	| 'warning'
	| 'success'
	| 'info';

export type SmartCardAction = {
	id?: string;
	label: string;
	onClick: () => void;
	icon?: ReactNode;
	disabled?: boolean;
};

/**
 * Outer surface chrome.
 *
 * - `card` (default): canonical bordered + soft-shadow card surface.
 * - `flat`: no border, no shadow, transparent background — use when
 *   nesting inside another surface that already has chrome. Equivalent
 *   to the legacy `transparent` boolean.
 * - `framed`: matted "polaroid" treatment — soft 5px outer border tinted
 *   from `--border` plus a 1px hairline inner border drawn via a
 *   pseudo-element. All values flow through theme tokens.
 */
export type SmartCardSurface = 'card' | 'flat' | 'framed';

export interface SmartCardProps {
	icon?: ReactNode;
	title?: ReactNode;
	titleSuffix?: ReactNode;
	description?: ReactNode;
	tooltip?: ReactNode;
	tooltipAriaLabel?: string;
	footerText?: ReactNode;
	alert?: ReactNode | string;
	alertVariant?: CardAlertVariant;
	/**
	 * Outer surface chrome. Default `'card'`. Legacy `transparent` still
	 * works (mapped to `'flat'`).
	 */
	surface?: SmartCardSurface;
	/** @deprecated Use `surface='flat'` instead. */
	transparent?: boolean;
	padding?: CardPadding;
	actions?: SmartCardAction[];
	actionsLabel?: string;
	headerAction?: ReactNode;
	headerStart?: ReactNode;
	headerEnd?: ReactNode;
	contentTop?: ReactNode;
	contentBottom?: ReactNode;
	/**
	 * Optional full-width footer band rendered under the content, ideal
	 * for a single primary action ("Open", "Connect"). Pairs with
	 * `footerDivider` to add a `border-t` rule above it.
	 */
	footerSlot?: ReactNode;
	/** Render a `border-b` rule between header and content. */
	headerDivider?: boolean;
	/** Render a `border-t` rule between content and footer. */
	footerDivider?: boolean;
	/**
	 * Make the card body collapsible. Pass `true` for default behavior
	 * (12rem / 192px collapsed max-height with a soft fade overlay) or
	 * an object to tune the collapsed height.
	 */
	expandable?: boolean | { collapsedMaxHeight?: number | string };
	/** Initial expanded state (uncontrolled). Defaults to `false`. */
	defaultExpanded?: boolean;
	/** Controlled expanded state. */
	expanded?: boolean;
	/** Change callback for controlled mode. */
	onExpandedChange?: (expanded: boolean) => void;
	children: ReactNode;
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	footerClassName?: string;
	strings?: Partial<SmartCardStrings>;
}

export interface SmartCardSkeletonProps {
	title?: ReactNode;
	lines?: number;
	className?: string;
}
