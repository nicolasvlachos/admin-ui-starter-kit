 
/** SidebarNavigationUser — user profile dropdown for sidebar footer. */
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';
import type { ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/base/display/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/base/navigation/dropdown-menu';
import { Text } from '@/components/typography';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useStrings } from '@/lib/strings';

import type { LayoutUser } from '../../layout.types';
import { useSidebar } from '../sidebar.context';

export interface SidebarNavigationUserStrings {
	profile: string;
	settings: string;
	logout: string;
}

export const defaultSidebarNavigationUserStrings: SidebarNavigationUserStrings = {
	profile: 'Profile',
	settings: 'Settings',
	logout: 'Log out',
};

export interface SidebarNavigationUserProps {
	user: LayoutUser;
	customContent?: ReactNode;
	onProfile?: () => void;
	onSettings?: () => void;
	onLogout?: () => void;
	strings?: Partial<SidebarNavigationUserStrings>;
	renderTrigger?: (user: LayoutUser) => ReactNode;
}

function deriveInitials(name: string): string {
	return name
		.split(' ')
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join('')
		.toUpperCase();
}

export function SidebarNavigationUser({
	user,
	customContent,
	onProfile,
	onSettings,
	onLogout,
	strings: stringsProp,
	renderTrigger,
}: SidebarNavigationUserProps) {
	const strings = useStrings(defaultSidebarNavigationUserStrings, stringsProp);
	const { state, isMobile } = useSidebar();
	const dropdownSide = isMobile || state !== 'collapsed' ? 'bottom' : 'right';
	const initials = deriveInitials(user.name);

	const defaultContent = (
		<>
			{!!onProfile && (
				<DropdownMenuItem onClick={onProfile}>
					<User className="mr-2 size-4" aria-hidden="true" />
					<Text tag="span" size="xs" className="text-inherit">{strings.profile}</Text>
				</DropdownMenuItem>
			)}
			{!!onSettings && (
				<DropdownMenuItem onClick={onSettings}>
					<Settings className="mr-2 size-4" aria-hidden="true" />
					<Text tag="span" size="xs" className="text-inherit">{strings.settings}</Text>
				</DropdownMenuItem>
			)}
			{!!(onProfile || onSettings) && !!onLogout && <DropdownMenuSeparator />}
			{!!onLogout && (
				<DropdownMenuItem onClick={onLogout}>
					<LogOut className="mr-2 size-4" aria-hidden="true" />
					<Text tag="span" size="xs" className="text-inherit">{strings.logout}</Text>
				</DropdownMenuItem>
			)}
		</>
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
							/>
						}
					>
						{renderTrigger?.(user) ?? (
							<>
								<div className="flex min-w-0 flex-1 items-center gap-2">
									<Avatar className="size-8 rounded-full">
										{!!user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
										<AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-accent-foreground">
											{initials}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-1 flex-col items-start justify-center overflow-hidden">
										<Text weight="medium" className="w-full truncate">{user.name}</Text>
										{!!user.email && <Text size="xs" type="secondary" className="w-full truncate">{user.email}</Text>}
									</div>
								</div>
								<ChevronsUpDown className="ml-auto size-4 shrink-0" aria-hidden="true" />
							</>
						)}
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="end"
						side={dropdownSide}
						sideOffset={4}
					>
						{customContent ?? defaultContent}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

/** @deprecated — use `LayoutUser` from `layout.types`. */
export type SidebarUserData = LayoutUser;
