/**
 * StackedAvatars — overlapping avatar group with optional `+N` overflow chip,
 * configurable size, and an optional `tone` that paints a gradient ring on
 * fallbacks (initials) when the consumer hasn't passed `imageUrl`.
 *
 * Wraps the shadcn AvatarGroup primitive with library-default sizes and a
 * deterministic gradient picker so we don't regenerate ring colors per render.
 */
import * as React from 'react';
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from '@/components/ui/avatar';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export type StackedAvatarsSize = 'sm' | 'default' | 'lg';

export interface StackedAvatarUser {
	id?: string;
	name: string;
	imageUrl?: string;
	/** Optional gradient tone override for this user's fallback. */
	tone?: number;
}

export interface StackedAvatarsProps {
	users: StackedAvatarUser[];
	max?: number;
	size?: StackedAvatarsSize;
	className?: string;
	/** Whether to render a `+N` count when `users.length > max`. Default `true`. */
	showOverflow?: boolean;
	/** Provide custom overflow text (e.g. "+12 more"). Default `+N`. */
	overflowFormatter?: (overflow: number) => React.ReactNode;
	/** Extra class names applied to each avatar root. */
	avatarClassName?: string;
}

const FALLBACK_GRADIENTS = [
	'from-blue-500 to-cyan-500',
	'from-violet-500 to-fuchsia-500',
	'from-amber-500 to-rose-500',
	'from-emerald-500 to-teal-500',
	'from-sky-500 to-indigo-500',
	'from-orange-500 to-pink-500',
];

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 0) return '?';
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function pickGradient(seed: string | number, override?: number) {
	if (typeof override === 'number') {
		return FALLBACK_GRADIENTS[override % FALLBACK_GRADIENTS.length];
	}
	const key = typeof seed === 'number' ? seed : Array.from(seed).reduce((s, c) => s + c.charCodeAt(0), 0);
	return FALLBACK_GRADIENTS[key % FALLBACK_GRADIENTS.length];
}

export function StackedAvatars({
	users,
	max = 4,
	size = 'default',
	className,
	showOverflow = true,
	overflowFormatter,
	avatarClassName,
}: StackedAvatarsProps) {
	const visible = users.slice(0, max);
	const overflow = Math.max(0, users.length - max);

	return (
		<AvatarGroup className={className}>
			{visible.map((user, index) => {
				const initials = getInitials(user.name);
				const gradient = pickGradient(user.id ?? user.name ?? index, user.tone);
				return (
					<Avatar
						key={user.id ?? `${user.name}-${index}`}
						size={size}
						className={cn('ring-background', avatarClassName)}
						title={user.name}
					>
						{user.imageUrl ? (
							<AvatarImage src={user.imageUrl} alt={user.name} />
						) : null}
						<AvatarFallback
							className={cn(
								'bg-gradient-to-br text-white',
								gradient,
							)}
						>
							{initials}
						</AvatarFallback>
					</Avatar>
				);
			})}
			{!!showOverflow && overflow > 0 && (
				<AvatarGroupCount>
					<Text size="xs" weight="semibold">
						{overflowFormatter ? overflowFormatter(overflow) : `+${overflow}`}
					</Text>
				</AvatarGroupCount>
			)}
		</AvatarGroup>
	);
}

StackedAvatars.displayName = 'StackedAvatars';
