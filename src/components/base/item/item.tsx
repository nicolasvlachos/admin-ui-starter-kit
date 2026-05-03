/**
 * Item — base wrapper around the shadcn `Item` primitive.
 *
 * Why this wrapper exists (rules 1, 8, 12, 17):
 *   - Resolves `size` and `variant` against `<UIProvider>` (`useItemConfig()`),
 *     so consumers set library-wide density once.
 *   - Routes `ItemTitle` / `ItemDescription` text through our `<Text>` typography
 *     so a title is always `weight="semibold"` and a description is always
 *     `size="xs" type="secondary"` — no rogue `<div className="text-sm font-medium">`
 *     blobs at call sites.
 *   - Re-exports every compound part untouched, so `<Item>` keeps working as a
 *     drop-in replacement for hand-rolled "icon-left + text-stack + actions" rows.
 *
 * Layer rule: import from `@/components/base/item`, never from `@/components/ui/item`.
 */
import { forwardRef, type ComponentRef } from 'react';

import {
	Item as BaseItem,
	ItemActions as BaseItemActions,
	ItemContent as BaseItemContent,
	ItemDescription as BaseItemDescription,
	ItemFooter as BaseItemFooter,
	ItemGroup as BaseItemGroup,
	ItemHeader as BaseItemHeader,
	ItemMedia as BaseItemMedia,
	ItemSeparator as BaseItemSeparator,
	ItemTitle as BaseItemTitle,
} from '@/components/ui/item';
import { Text } from '@/components/typography';
import { useItemConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

import type {
	ItemActionsProps,
	ItemContentProps,
	ItemDescriptionProps,
	ItemFooterProps,
	ItemGroupProps,
	ItemHeaderProps,
	ItemMediaProps,
	ItemProps,
	ItemTitleProps,
} from './item.types';

const Item = forwardRef<ComponentRef<typeof BaseItem>, ItemProps>(function Item(
	{ size, variant, render, className, ...props },
	ref,
) {
	const { defaultSize = 'sm', defaultVariant = 'default' } = useItemConfig();
	const resolvedSize = size ?? defaultSize;
	const resolvedVariant = variant ?? defaultVariant;
	return (
		<BaseItem
			ref={ref}
			size={resolvedSize}
			variant={resolvedVariant}
			render={render}
			className={cn('item--component', className)}
			{...props}
		/>
	);
});
Item.displayName = 'Item';

const ItemGroup = forwardRef<ComponentRef<typeof BaseItemGroup>, ItemGroupProps>(function ItemGroup(
	{ className, ...props },
	ref,
) {
	return <BaseItemGroup ref={ref} className={className} {...props} />;
});
ItemGroup.displayName = 'ItemGroup';

const ItemSeparator = forwardRef<
	ComponentRef<typeof BaseItemSeparator>,
	Parameters<typeof BaseItemSeparator>[0]
>(function ItemSeparator(props, ref) {
	return <BaseItemSeparator ref={ref} {...props} />;
});
ItemSeparator.displayName = 'ItemSeparator';

const ItemMedia = forwardRef<ComponentRef<typeof BaseItemMedia>, ItemMediaProps>(function ItemMedia(
	{ variant = 'default', className, ...props },
	ref,
) {
	const baseVariant = variant === 'avatar' ? 'image' : variant;
	const avatarClass =
		variant === 'avatar'
			? 'rounded-full group-data-[size=sm]/item:rounded-full group-data-[size=xs]/item:rounded-full'
			: undefined;
	return (
		<BaseItemMedia
			ref={ref}
			variant={baseVariant}
			className={cn(avatarClass, className)}
			{...props}
		/>
	);
});
ItemMedia.displayName = 'ItemMedia';

const ItemContent = forwardRef<ComponentRef<typeof BaseItemContent>, ItemContentProps>(function ItemContent(
	{ className, ...props },
	ref,
) {
	return <BaseItemContent ref={ref} className={className} {...props} />;
});
ItemContent.displayName = 'ItemContent';

const ItemActions = forwardRef<ComponentRef<typeof BaseItemActions>, ItemActionsProps>(function ItemActions(
	{ className, ...props },
	ref,
) {
	return <BaseItemActions ref={ref} className={className} {...props} />;
});
ItemActions.displayName = 'ItemActions';

const ItemHeader = forwardRef<ComponentRef<typeof BaseItemHeader>, ItemHeaderProps>(function ItemHeader(
	{ className, ...props },
	ref,
) {
	return <BaseItemHeader ref={ref} className={className} {...props} />;
});
ItemHeader.displayName = 'ItemHeader';

const ItemFooter = forwardRef<ComponentRef<typeof BaseItemFooter>, ItemFooterProps>(function ItemFooter(
	{ className, ...props },
	ref,
) {
	return <BaseItemFooter ref={ref} className={className} {...props} />;
});
ItemFooter.displayName = 'ItemFooter';

const ItemTitle = forwardRef<ComponentRef<typeof BaseItemTitle>, ItemTitleProps>(function ItemTitle(
	{ bold = true, className, children, ...props },
	ref,
) {
	return (
		<BaseItemTitle
			ref={ref}
			className={cn('m-0 [&>p]:m-0 [&>p]:text-left', className)}
			{...props}
		>
			<Text tag="span" weight={bold ? 'semibold' : 'regular'} className="leading-snug">
				{children}
			</Text>
		</BaseItemTitle>
	);
});
ItemTitle.displayName = 'ItemTitle';

const CLAMP_CLASS: Record<NonNullable<ItemDescriptionProps['clamp']>, string> = {
	1: 'line-clamp-1',
	2: 'line-clamp-2',
	3: 'line-clamp-3',
	4: 'line-clamp-4',
	none: '',
};

const ItemDescription = forwardRef<ComponentRef<typeof BaseItemDescription>, ItemDescriptionProps>(
	function ItemDescription({ clamp = 2, className, children, ...props }, ref) {
		return (
			<BaseItemDescription
				ref={ref}
				className={cn('text-muted-foreground text-xs leading-normal', CLAMP_CLASS[clamp], className)}
				{...props}
			>
				{children}
			</BaseItemDescription>
		);
	},
);
ItemDescription.displayName = 'ItemDescription';

export {
	Item,
	ItemGroup,
	ItemSeparator,
	ItemMedia,
	ItemContent,
	ItemTitle,
	ItemDescription,
	ItemActions,
	ItemHeader,
	ItemFooter,
};
