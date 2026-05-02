/**
 * UserCell — avatar + name + optional subtitle list-item row, the canonical
 * shape for team rosters, conversation lists, comment authors, and search
 * result rows. Three sizes match the surrounding row density (sm/base/lg).
 *
 * Pass `avatarUrl` for an image, `initials` for a fallback, or `avatar` for
 * a full custom Avatar tree (e.g. with a status badge). The `trailing` slot
 * sits on the right edge — use it for badges, action buttons, or timestamps.
 *
 * Avatar primitives come from `base/display/avatar` (shadcn-backed) so they
 * match the rest of the system without configuration.
 */
import type { ReactNode } from 'react';

import { Text } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/base/display/avatar';
import { cn } from '@/lib/utils';

export type UserCellSize = 'sm' | 'base' | 'lg';

export interface UserCellProps {
	name: ReactNode;
	subtitle?: ReactNode;
	avatarUrl?: string;
	avatarAlt?: string;
	initials?: string;
	/** Fully custom avatar element (overrides `avatarUrl` / `initials`). */
	avatar?: ReactNode;
	trailing?: ReactNode;
	size?: UserCellSize;
	className?: string;
}

const SIZE_MAP: Record<UserCellSize, { avatar: string; gap: string; nameSize: 'sm' | 'base'; subtitleSize: 'xs' | 'sm' }> = {
	sm: { avatar: 'size-7', gap: 'gap-2', nameSize: 'sm', subtitleSize: 'xs' },
	base: { avatar: 'size-9', gap: 'gap-3', nameSize: 'sm', subtitleSize: 'xs' },
	lg: { avatar: 'size-11', gap: 'gap-3', nameSize: 'base', subtitleSize: 'sm' },
};

export function UserCell({
	name,
	subtitle,
	avatarUrl,
	avatarAlt,
	initials,
	avatar,
	trailing,
	size = 'base',
	className,
}: UserCellProps) {
	const sizes = SIZE_MAP[size];

	const avatarNode = avatar ?? (
		<Avatar className={sizes.avatar}>
			{!!avatarUrl && <AvatarImage src={avatarUrl} alt={avatarAlt ?? (typeof name === 'string' ? name : undefined)} />}
			{!!initials && <AvatarFallback>{initials}</AvatarFallback>}
		</Avatar>
	);

	return (
		<div className={cn('flex items-center', sizes.gap, className)}>
			{avatarNode}
			<div className="min-w-0 flex-1">
				<Text size={sizes.nameSize} weight="semibold" className="truncate">
					{name}
				</Text>
				{!!subtitle && (
					<Text size={sizes.subtitleSize} type="secondary" className="truncate">
						{subtitle}
					</Text>
				)}
			</div>
			{!!trailing && <div className="shrink-0">{trailing}</div>}
		</div>
	);
}

UserCell.displayName = 'UserCell';
