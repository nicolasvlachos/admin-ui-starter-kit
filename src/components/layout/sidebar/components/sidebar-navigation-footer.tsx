/** SidebarNavigationFooter — secondary footer navigation using renderLink. */
import { ExternalLink } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/base/sidebar';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import type { SidebarNavigationFooterProps } from '../sidebar.types';
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

export function SidebarNavigationFooter({
	items,
	label,
	currentUrl = '/',
	iconMap = {},
	liveBadges,
	renderLink,
	LinkComponent,
	className,
}: SidebarNavigationFooterProps) {
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });

	return (
		<SidebarGroup className={cn('group-data-[collapsible=icon]:p-0', className)}>
			{!!label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
			<SidebarGroupContent>
				<SidebarMenu className="gap-0.5">
					{items.map((item, index) => {
						const active = !!item.href && isPathMatch(currentUrl, toPath(item.href));
						const badge = resolveNavBadge(item.handle, item.badge, liveBadges);
						const labelNode = getNavLabel(item);
						const content = (
							<>
								{!!item.icon && <DynamicIcon icon={item.icon} iconMap={iconMap} className="size-4" aria-hidden="true" />}
								{typeof labelNode === 'string' || typeof labelNode === 'number' ? (
									<Text tag="span" className="truncate text-inherit">{labelNode}</Text>
								) : labelNode}
								{!!badge && <NavBadge value={badge} />}
								{!!item.external && <ExternalLink className="ml-auto size-3 opacity-50" aria-hidden="true" />}
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
									className={cn(
										'h-7 font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground',
										active && 'bg-sidebar-accent text-sidebar-foreground',
									)}
									tooltip={{ children: labelNode }}
									disabled={item.disabled}
								>
									{content}
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
