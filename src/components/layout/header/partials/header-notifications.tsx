/** HeaderNotifications — bell dropdown for consumer-supplied notifications. */
import type { ReactElement } from 'react';

import { Bell } from 'lucide-react';

import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuLinkItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/base/navigation/dropdown-menu';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import {
	defaultHeaderNotificationsStrings,
	type HeaderNotification,
	type HeaderNotificationsProps,
	type NotificationTone,
} from '../header.types';

const TONE_BORDER: Record<NotificationTone, string> = {
	info: 'border-l-info',
	success: 'border-l-success',
	warning: 'border-l-warning',
	error: 'border-l-destructive',
};

function getToneClass(tone: NotificationTone | undefined): string {
	return TONE_BORDER[tone ?? 'info'];
}

export function HeaderNotifications({
	notifications = [],
	unreadCount = 0,
	onNotificationClick,
	onMarkAllRead,
	onViewAll,
	viewAllHref,
	renderLink,
	LinkComponent,
	align = 'end',
	side = 'bottom',
	strings: stringsProp,
	className,
	contentClassName,
	renderNotification,
}: HeaderNotificationsProps) {
	const strings = useStrings(defaultHeaderNotificationsStrings, stringsProp);
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });
	const badgeText = unreadCount > 99 ? '99+' : String(unreadCount);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="secondary"
						buttonStyle="ghost"
						size="icon-sm"
						aria-label={strings.triggerLabel}
						className={cn('relative', className)}
					>
						<Bell className="size-4" aria-hidden="true" />
						{unreadCount > 0 && (
							<Badge
								variant="error"
								className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 py-0 text-xxs"
							>
								{badgeText}
							</Badge>
						)}
					</Button>
				}
			/>
			<DropdownMenuContent className={cn('w-80', contentClassName)} align={align} side={side}>
				<DropdownMenuLabel className="flex items-center justify-between gap-3">
					<Text tag="span" weight="semibold">{strings.heading}</Text>
					{unreadCount > 0 && !!onMarkAllRead && (
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							size="xs"
							onClick={onMarkAllRead}
							className="h-auto px-1 py-0 text-xs"
						>
							{strings.markAllRead}
						</Button>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{notifications.length === 0 ? (
					<div className="p-4 text-center">
						<Text type="secondary">{strings.empty}</Text>
					</div>
				) : (
					<div className="space-y-1 p-1">
						{notifications.map((notification) => (
							<NotificationRow
								key={notification.id}
								notification={notification}
								onClick={onNotificationClick}
								renderLink={resolvedRenderLink}
								renderNotification={renderNotification}
							/>
						))}
					</div>
				)}

				{!!(onViewAll || viewAllHref) && (
					<>
						<DropdownMenuSeparator />
						{viewAllHref ? (
							<DropdownMenuLinkItem
								href={viewAllHref}
								render={(props) =>
									resolvedRenderLink({
										...props,
										href: viewAllHref,
										children: props.children,
									}) as ReactElement
								}
							>
								{strings.viewAll}
							</DropdownMenuLinkItem>
						) : (
							<DropdownMenuItem onClick={onViewAll}>{strings.viewAll}</DropdownMenuItem>
						)}
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function NotificationRow({
	notification,
	onClick,
	renderLink,
	renderNotification,
}: {
	notification: HeaderNotification;
	onClick?: (n: HeaderNotification) => void;
	renderLink: NonNullable<HeaderNotificationsProps['renderLink']>;
	renderNotification?: HeaderNotificationsProps['renderNotification'];
}) {
	if (renderNotification) return renderNotification(notification);

	const content = (
		<div className="min-w-0 space-y-1">
			<Text weight="medium">{notification.title}</Text>
			{!!notification.description && <Text size="xs" type="secondary">{notification.description}</Text>}
			{!!notification.time && <Text size="xxs" type="secondary">{notification.time}</Text>}
		</div>
	);

	const className = cn(
		'items-start rounded-md border-l-2 px-3 py-2',
		getToneClass(notification.tone),
		!notification.read && 'bg-muted/40',
	);

	if (notification.href) {
		return (
			<DropdownMenuLinkItem
				href={notification.href}
				className={className}
				onClick={() => onClick?.(notification)}
				render={(props) =>
					renderLink({
						...props,
						href: notification.href,
						children: props.children,
					}) as ReactElement
				}
			>
				{content}
			</DropdownMenuLinkItem>
		);
	}

	return (
		<DropdownMenuItem onClick={() => onClick?.(notification)} className={className}>
			{content}
		</DropdownMenuItem>
	);
}

/** @deprecated Re-exported for backwards compat — use `HeaderNotification`. */
export type Notification = HeaderNotification;
