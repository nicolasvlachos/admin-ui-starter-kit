/**
 * AppSidebar — opinionated assembly of logo/header, grouped navigation, and
 * footer links. Consumers still own framework routing through `renderLink`.
 */
import * as React from 'react';

import { ScrollArea } from '@/components/base/display/scroll-area';
import { Skeleton } from '@/components/base/display/skeleton';
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarSeparator,
} from '@/components/base/sidebar';
import { cn } from '@/lib/utils';

import { SidebarGroupedNavigation } from './components/sidebar-grouped-navigation';
import { SidebarLogo } from './components/sidebar-logo';
import { SidebarNavigationFooter } from './components/sidebar-navigation-footer';
import { SidebarWorkspaceDropdown } from './components/sidebar-workspace-dropdown';
import { Sidebar } from './sidebar';
import type { AppSidebarProps } from './sidebar.types';

export function AppSidebar({
	navigationGroups,
	footerNavItems = [],
	footerLabel,
	logo,
	collapsedLogo,
	workspaceLinks = [],
	workspaceStrings,
	workspaceContentClassName,
	headerClassName,
	logoClassName,
	iconMap,
	currentUrl = '/',
	liveBadges,
	renderLink,
	LinkComponent,
	loading,
	collapsible = 'icon',
	variant = 'sidebar',
	side = 'left',
	className,
	surfaceClassName,
	contentClassName,
	slots,
	renderItem,
}: AppSidebarProps) {
	const hasFooter = footerNavItems.length > 0 || !!slots?.footer;
	const isLoading = loading || !navigationGroups;
	const hasWorkspaceLinks = workspaceLinks.length > 0;

	return (
		<Sidebar collapsible={collapsible} variant={variant} side={side} className={cn('h-svh', className)} surfaceClassName={surfaceClassName}>
			{slots?.header ?? (!!logo && (
				<SidebarHeader className={headerClassName}>
					{hasWorkspaceLinks ? (
						<SidebarWorkspaceDropdown
							logo={logo}
							collapsedLogo={collapsedLogo}
							workspaceLinks={workspaceLinks}
							strings={workspaceStrings}
							contentClassName={workspaceContentClassName}
							renderLink={renderLink}
							LinkComponent={LinkComponent}
						/>
					) : (
						<SidebarLogo logo={logo} collapsedLogo={collapsedLogo} className={logoClassName} />
					)}
				</SidebarHeader>
			))}

			<SidebarContent className={contentClassName}>
				<ScrollArea className="h-full pr-1.5 pt-4">
					{slots?.beforeNavigation}
					{isLoading ? (
						slots?.loading ?? <AppSidebarSkeleton />
					) : (
						<SidebarGroupedNavigation
							navigationByGroups={navigationGroups}
							currentUrl={currentUrl}
							iconMap={iconMap}
							liveBadges={liveBadges}
							renderLink={renderLink}
							LinkComponent={LinkComponent}
							emptySlot={slots?.empty}
							renderItem={renderItem}
						/>
					)}
					{slots?.afterNavigation}
				</ScrollArea>
			</SidebarContent>

			{hasFooter && (
				<SidebarFooter>
					{slots?.footer ?? (
						<SidebarNavigationFooter
							items={footerNavItems}
							label={footerLabel}
							currentUrl={currentUrl}
							iconMap={iconMap}
							liveBadges={liveBadges}
							renderLink={renderLink}
							LinkComponent={LinkComponent}
						/>
					)}
				</SidebarFooter>
			)}
		</Sidebar>
	);
}

function AppSidebarSkeleton() {
	const groups = [9, 3, 4, 2, 1];

	return (
		<>
			{groups.map((count, groupIdx) => (
				<React.Fragment key={groupIdx}>
					<SidebarGroup className="px-2 py-0">
						<SidebarMenu className="gap-0.5">
							{Array.from({ length: count }, (_, i) => (
								<SidebarMenuItem key={i}>
									<div className="flex h-8 items-center gap-2 px-2">
										<Skeleton className="h-4 w-4 shrink-0 rounded" />
										<Skeleton
											className="h-3.5 rounded"
											style={{ width: `${60 + ((groupIdx * 7 + i * 13) % 40)}px` }}
										/>
									</div>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
					{groupIdx < groups.length - 1 && (
						<SidebarSeparator className="!mx-auto !my-1 !w-11/12 overflow-hidden px-4" />
					)}
				</React.Fragment>
			))}
		</>
	);
}
