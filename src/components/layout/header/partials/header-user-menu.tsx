/** HeaderUserMenu — avatar/name trigger with consumer-wired menu callbacks. */
import type { ReactElement } from 'react';

import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/base/display/avatar';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/base/navigation/dropdown-menu';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultHeaderUserMenuStrings,
	type HeaderUserMenuProps,
} from '../header.types';

function deriveInitials(name: string): string {
	return name
		.split(' ')
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join('')
		.toUpperCase();
}

export function HeaderUserMenu({
	user,
	showEmail = true,
	customContent,
	onProfile,
	onSettings,
	onLogout,
	align = 'end',
	side = 'bottom',
	strings: stringsProp,
	triggerClassName,
	contentClassName,
	renderTrigger,
}: HeaderUserMenuProps) {
	const strings = useStrings(defaultHeaderUserMenuStrings, stringsProp);
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

	const trigger = renderTrigger?.(user) ?? (
		<Button
			type="button"
			variant="secondary"
			buttonStyle="ghost"
			className={cn(
				'group h-10 max-w-56 justify-start gap-2 rounded-lg px-1.5 pr-2 text-foreground shadow-none hover:bg-foreground/5 data-[state=open]:bg-foreground/5',
				showEmail ? 'py-1.5' : 'py-1',
				'dark:text-background dark:hover:bg-topbar-accent/50',
				triggerClassName,
			)}
		>
			<Avatar className="size-6 overflow-hidden rounded-full ring-1 ring-border/60">
				{!!user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
				<AvatarFallback className="rounded-md bg-success text-[length:var(--text-xxs)] font-semibold text-background">
					{initials}
				</AvatarFallback>
			</Avatar>
			<div className="grid min-w-0 flex-1 text-left leading-none">
				<Text size="xs" weight="medium" className="truncate">{user.name}</Text>
				{!!showEmail && !!user.email && (
					<Text size="xxs" type="secondary" className="truncate">{user.email}</Text>
				)}
			</div>
			<ChevronsUpDown className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
		</Button>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={trigger as ReactElement} />
			<DropdownMenuContent
				className={cn('w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg p-3', contentClassName)}
				align={align}
				side={side}
			>
				{customContent ?? defaultContent}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
