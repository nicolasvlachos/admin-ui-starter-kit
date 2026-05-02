/** SidebarWorkspaceDropdown — workspace selector using consumer link rendering. */
import { ChevronsUpDown, ExternalLink } from 'lucide-react';

import { Text } from '@/components/typography';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/base/navigation/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import {
	defaultSidebarWorkspaceDropdownStrings,
	type SidebarWorkspaceDropdownProps,
} from '../sidebar.types';
import { useSidebar } from '../sidebar.context';

export function SidebarWorkspaceDropdown({
	logo,
	collapsedLogo,
	workspaceLinks,
	renderLink,
	LinkComponent,
	strings: stringsProp,
	contentClassName,
}: SidebarWorkspaceDropdownProps) {
	const strings = useStrings(defaultSidebarWorkspaceDropdownStrings, stringsProp);
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });
	const { state } = useSidebar();
	const isCollapsed = state === 'collapsed';
	const visibleLogo = isCollapsed ? (collapsedLogo ?? logo) : logo;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							/>
						}
					>
						<div className="flex min-w-0 flex-1 items-center gap-2">
							{visibleLogo}
							{!isCollapsed && (
								<Text tag="span" size="xs" className="sr-only">
									{strings.select}
								</Text>
							)}
						</div>
						{!isCollapsed && <ChevronsUpDown className="ml-auto size-4 shrink-0" aria-hidden="true" />}
					</DropdownMenuTrigger>
					<DropdownMenuContent className={cn('min-w-56', contentClassName)} align="start" side="right" sideOffset={8}>
						<DropdownMenuGroup>
							<DropdownMenuLabel>
								<Text weight="semibold">{strings.label}</Text>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{workspaceLinks.map((link) => {
								const Icon = link.icon ?? ExternalLink;
								const content = (
									<>
										<Icon className="size-4 shrink-0" aria-hidden="true" />
										<Text tag="span" size="xs" className="text-inherit">{link.label}</Text>
									</>
								);
								return (
									<DropdownMenuItem
										key={link.url}
										render={
											resolvedRenderLink({
												href: link.url,
												external: link.external ?? true,
												children: null,
												className: 'flex items-center gap-2',
											}) as React.ReactElement
										}
									>
										{content}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
