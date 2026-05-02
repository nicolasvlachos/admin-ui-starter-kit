/** SidebarNavigation — flat, framework-neutral sidebar nav list. */
import * as React from 'react';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import type { SidebarFlatNavigationProps, SidebarFlatNavItem, SidebarRenderItemContext } from '../sidebar.types';
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

export { DynamicIcon } from '../sidebar.utils';
export { DynamicIcon as Icon } from '../sidebar.utils';

function NavLabel({ item }: { item: SidebarFlatNavItem }) {
	const label = getNavLabel(item);
	return (
		<Text tag="span" className="truncate text-inherit">
			{label}
		</Text>
	);
}

export function SidebarNavigation({
	items,
	label = 'Platform',
	currentUrl = '/',
	iconMap = {},
	liveBadges,
	renderLink,
	LinkComponent,
	renderItem,
	className,
}: SidebarFlatNavigationProps) {
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });

	return (
		<SidebarGroup className={cn('px-2 py-0', className)}>
			{!!label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
			<SidebarMenu className="gap-0.5">
				{items.map((item, index) => {
					const active = !!item.href && isPathMatch(currentUrl, toPath(item.href));
					const badge = resolveNavBadge(item.handle, item.badge, liveBadges);
					const context: SidebarRenderItemContext = {
						depth: 0,
						active,
						expanded: false,
						badge,
						renderLink: resolvedRenderLink,
					};
					const labelNode = getNavLabel(item);

					if (renderItem) {
						return <React.Fragment key={getNavKey(item, index)}>{renderItem(item, context)}</React.Fragment>;
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
								isActive={active}
								render={
									item.href && !item.disabled
										? renderSidebarLink(resolvedRenderLink, item, content, undefined, active) as React.ReactElement
										: undefined
								}
								tooltip={{ children: labelNode }}
								disabled={item.disabled}
								className={cn(
									'h-7 font-medium',
									active && 'bg-sidebar-accent text-sidebar-foreground',
									item.disabled && 'cursor-not-allowed opacity-50',
								)}
							>
								{content}
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

/** @deprecated Use `SidebarFlatNavItem` from `sidebar.types`. */
export type SidebarNavigationItem = SidebarFlatNavItem;
