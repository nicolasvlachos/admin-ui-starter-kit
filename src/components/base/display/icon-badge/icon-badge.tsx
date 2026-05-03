/**
 * IconBadge — circular or square icon container with a tinted background.
 * Workhorse for "row leading icon" and "feature illustration" patterns —
 * coupon checks, conversation initials, search-result tones, AI-bot avatars.
 *
 * Tones reuse the shadcn semantic tokens, with the foreground colour picked
 * to read against a 10–15% background tint (e.g. `bg-success/15 text-success`).
 * For a fully-saturated mark (primary fill, inverse foreground), use
 * `tone="primary"` and pass `solid`.
 */
import type { ComponentProps, ElementType, ReactNode } from 'react';
import { createElement } from 'react';

import { cn } from '@/lib/utils';

export type IconBadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type IconBadgeShape = 'circle' | 'square';
export type IconBadgeTone =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'destructive'
	| 'info'
	| 'muted';

export interface IconBadgeProps extends Omit<ComponentProps<'span'>, 'children'> {
	icon?: ElementType;
	children?: ReactNode;
	size?: IconBadgeSize;
	shape?: IconBadgeShape;
	tone?: IconBadgeTone;
	/** When true, fills the badge with the tone color and inverts the icon. */
	solid?: boolean;
	/**
	 * When true, renders a hairline `border-border/60` around the badge.
	 * Useful for compact "secret list" / "key list" rows where the icon
	 * needs a subtle outline against the surrounding card surface
	 * (see `composed/admin/api-key-list`).
	 */
	bordered?: boolean;
}

const SIZE_MAP: Record<IconBadgeSize, { box: string; icon: string }> = {
	xs: { box: 'size-6', icon: 'size-3' },
	sm: { box: 'size-8', icon: 'size-3.5' },
	md: { box: 'size-9', icon: 'size-4' },
	lg: { box: 'size-12', icon: 'size-5' },
};

const TONE_TINT: Record<IconBadgeTone, string> = {
	primary: 'bg-primary/15 text-primary',
	secondary: 'bg-foreground/8 text-muted-foreground',
	success: 'bg-success/15 text-success',
	warning: 'bg-warning/20 text-warning-foreground',
	destructive: 'bg-destructive/12 text-destructive',
	info: 'bg-info/15 text-info',
	muted: 'bg-muted text-muted-foreground',
};

const TONE_SOLID: Record<IconBadgeTone, string> = {
	primary: 'bg-primary text-primary-foreground',
	secondary: 'bg-secondary text-secondary-foreground',
	success: 'bg-success text-success-foreground',
	warning: 'bg-warning text-warning-foreground',
	destructive: 'bg-destructive text-destructive-foreground',
	info: 'bg-info text-info-foreground',
	muted: 'bg-foreground/70 text-background',
};

export function IconBadge({
	icon: Icon,
	children,
	size = 'md',
	shape = 'circle',
	tone = 'primary',
	solid = false,
	bordered = false,
	className,
	...props
}: IconBadgeProps) {
	const sizes = SIZE_MAP[size];
	const tones = solid ? TONE_SOLID[tone] : TONE_TINT[tone];

	return (
		<span
			aria-hidden={!props['aria-label']}
			className={cn('icon-badge--component', 
				'inline-flex shrink-0 items-center justify-center',
				shape === 'circle' ? 'rounded-full' : 'rounded-md',
				sizes.box,
				tones,
				bordered && 'border border-border/60',
				className,
			)}
			{...props}
		>
			{Icon ? createElement(Icon, { className: sizes.icon }) : children}
		</span>
	);
}

IconBadge.displayName = 'IconBadge';
