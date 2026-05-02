/**
 * Type contracts for the `<Item>` family.
 *
 * The base wrapper extends shadcn's primitive props with our provider-driven
 * defaults (size from `useItemConfig`) and the canonical title/description
 * typography mapping. Consumers writing custom partials on top of the wrapper
 * should import these types instead of reaching into `@/components/ui/item`.
 */
import type { ComponentProps, ReactElement, ReactNode } from 'react';

import type { ItemSize, ItemVariant } from '@/lib/ui-provider';

export type { ItemSize, ItemVariant };

export type ItemMediaVariant = 'default' | 'icon' | 'image' | 'avatar';

export interface ItemBaseProps extends Omit<ComponentProps<'div'>, 'children'> {
	children?: ReactNode;
}

export interface ItemProps extends ItemBaseProps {
	variant?: ItemVariant;
	size?: ItemSize;
	/** Polymorphic render slot — pass `<a href="…" />` to render the row as a link. */
	render?: ReactElement;
}

export interface ItemMediaProps extends ItemBaseProps {
	variant?: ItemMediaVariant;
}

export interface ItemContentProps extends ItemBaseProps {}
export interface ItemActionsProps extends ItemBaseProps {}
export interface ItemHeaderProps extends ItemBaseProps {}
export interface ItemFooterProps extends ItemBaseProps {}
export interface ItemGroupProps extends ItemBaseProps {}

export interface ItemTitleProps extends ItemBaseProps {
	/** Whether to enforce semantic typography weight. Defaults to `true`. */
	bold?: boolean;
}

export interface ItemDescriptionProps extends Omit<ComponentProps<'p'>, 'children'> {
	children?: ReactNode;
	/** Allow longer descriptions to wrap to N lines. Defaults to `2`. */
	clamp?: 1 | 2 | 3 | 4 | 'none';
}
