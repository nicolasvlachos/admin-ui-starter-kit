/** SidebarGroupedNavigation — grouped tree navigation with composable rows. */
import * as React from 'react';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarSeparator,
} from '@/components/ui/sidebar';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import type { SidebarGroupedNavigationProps, SidebarNavItem, SidebarRenderItemContext } from '../sidebar.types';
import {
	DynamicIcon,
	getNavKey,
	getNavLabel,
	isPathMatch,
	NavBadge,
	renderSidebarLink,
	resolveNavBadge,
	toPath,
} from '../sidebar.utils';

function NavLabel({ item }: { item: SidebarNavItem }) {
	const label = getNavLabel(item);
	return (
		<Text tag="span" className="truncate text-inherit">
			{label}
		</Text>
	);
}

export function SidebarGroupedNavigation({
	navigationByGroups,
	currentUrl = '/',
	iconMap = {},
	liveBadges,
	renderLink,
	LinkComponent,
	emptySlot,
	renderItem,
	className,
}: SidebarGroupedNavigationProps) {
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });
	const isActive = (href?: string): boolean => !!href && isPathMatch(currentUrl, toPath(href));

	const bestMatchIndex = (siblings: SidebarNavItem[]): number => {
		let bestIdx = -1;
		let bestLen = -1;
		for (let i = 0; i < siblings.length; i += 1) {
			const sibling = siblings[i];
			const path = sibling?.href ? toPath(sibling.href) : '';
			if (path && isPathMatch(currentUrl, path) && path.length > bestLen) {
				bestLen = path.length;
				bestIdx = i;
			}
		}
		return bestIdx;
	};

	const hasActiveChild = (children?: SidebarNavItem[]): boolean =>
		!!children?.some((child) => isActive(child.href) || hasActiveChild(child.children));

	const renderDefaultItem = (item: SidebarNavItem, depth = 0, index = 0): React.ReactNode => {
		const hasChildren = !!item.children?.length;
		const itemActive = isActive(item.href);
		const childActive = hasChildren ? hasActiveChild(item.children) : false;
		const expanded = itemActive || childActive;
		const badge = resolveNavBadge(item.handle, item.badge, liveBadges);
		const label = getNavLabel(item);
		const context: SidebarRenderItemContext = {
			depth,
			active: itemActive,
			expanded,
			badge,
			renderLink: resolvedRenderLink,
		};

		if (renderItem) {
			return <React.Fragment key={getNavKey(item, index)}>{renderItem(item, context)}</React.Fragment>;
		}

		if (hasChildren) {
			const activeChildIdx = bestMatchIndex(item.children ?? []);
			const content = (
				<>
					{!!item.icon && <DynamicIcon icon={item.icon} iconMap={iconMap} className="size-4" aria-hidden="true" />}
					<NavLabel item={item} />
					{!!badge && <NavBadge value={badge} />}
				</>
			);

			return (
				<SidebarMenuItem key={getNavKey(item, index)}>
					<SidebarMenuButton
						isActive={expanded}
						render={
							item.href && !item.disabled
								? renderSidebarLink(resolvedRenderLink, item, content, undefined, expanded) as React.ReactElement
								: undefined
						}
						tooltip={{ children: label }}
						disabled={item.disabled}
						className={cn(
							'h-7 font-medium',
							itemActive && 'bg-sidebar-accent text-sidebar-foreground',
							!itemActive && childActive && 'bg-sidebar-accent/45 text-sidebar-foreground',
							item.disabled && 'cursor-not-allowed opacity-50',
						)}
					>
						{content}
					</SidebarMenuButton>

					{!!expanded && (
						<SidebarMenuSub className="gap-0.5">
							{item.children?.map((child, childIndex) => {
								const childActiveNow = childIndex === activeChildIdx || isActive(child.href);
								const childBadge = resolveNavBadge(child.handle, child.badge, liveBadges);
								const childLabel = getNavLabel(child);
								const childContent = (
									<>
										{typeof childLabel === 'string' || typeof childLabel === 'number' ? (
											<Text tag="span" className="min-w-0 flex-1 truncate text-inherit">
												{childLabel}
											</Text>
										) : childLabel}
										{!!childBadge && <NavBadge value={childBadge} size="small" />}
									</>
								);
								return (
									<SidebarMenuSubItem key={getNavKey(child, childIndex)}>
										<SidebarMenuSubButton
											render={
												child.href && !child.disabled
												? renderSidebarLink(resolvedRenderLink, child, childContent, undefined, childActiveNow) as React.ReactElement
													: undefined
											}
											className={cn('w-full', childActiveNow && 'font-semibold text-sidebar-foreground')}
										>
											{childContent}
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								);
							})}
						</SidebarMenuSub>
					)}
			</SidebarMenuItem>
		);
	}

	const content = (
		<>
			{!!item.icon && <DynamicIcon icon={item.icon} iconMap={iconMap} className="size-4" aria-hidden="true" />}
			<NavLabel item={item} />
			{!!badge && <NavBadge value={badge} />}
		</>
	);

	return (
		<SidebarMenuItem key={getNavKey(item, index)}>
			<SidebarMenuButton
				isActive={itemActive}
				render={
					item.href && !item.disabled
						? renderSidebarLink(resolvedRenderLink, item, content, undefined, itemActive) as React.ReactElement
						: undefined
				}
				tooltip={{ children: label }}
				disabled={item.disabled}
				className={cn(
					'h-7 font-medium',
					itemActive && 'bg-sidebar-accent text-sidebar-foreground',
					item.disabled && 'cursor-not-allowed opacity-50',
				)}
			>
				{content}
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
	};

	const groupEntries = Object.entries(navigationByGroups).filter(([, items]) => items.length > 0);
	if (groupEntries.length === 0) return emptySlot ?? null;

	return (
		<div className={className}>
			{groupEntries.map(([groupName, items], groupIndex) => (
				<React.Fragment key={groupName}>
					<SidebarGroup className="px-2 py-0">
						{!groupName.startsWith('_') && <SidebarGroupLabel>{groupName}</SidebarGroupLabel>}
						<SidebarMenu className="gap-0.5">
							{items.map((item, index) => renderDefaultItem(item, 0, index))}
						</SidebarMenu>
					</SidebarGroup>
					{groupIndex < groupEntries.length - 1 && (
						<SidebarSeparator className="!mx-auto !my-1.5 !w-11/12 overflow-hidden px-4" />
					)}
				</React.Fragment>
			))}
		</div>
	);
}
