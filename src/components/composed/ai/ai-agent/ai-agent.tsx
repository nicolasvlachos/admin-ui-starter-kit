/**
 * AiAgent — identity card for an AI persona / model. Renders avatar (icon
 * or custom), name, optional subtitle (model id, role), and a live status
 * pill. `variant='inline'` is a one-line chip (header strips, breadcrumbs);
 * `variant='card'` is a small tile (model picker, agent dock).
 */
import { Bot, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiAgentStrings,
	type AiAgentProps,
	type AiAgentStatus,
} from './types';

const TONE_AVATAR: Record<NonNullable<AiAgentProps['tone']>, string> = {
	primary: 'bg-primary/15 text-primary',
	success: 'bg-success/15 text-success',
	warning: 'bg-warning/20 text-warning',
	destructive: 'bg-destructive/15 text-destructive',
	info: 'bg-info/15 text-info',
	neutral: 'bg-muted text-muted-foreground',
};

const STATUS_VARIANT: Record<
	AiAgentStatus,
	'secondary' | 'primary' | 'success' | 'warning' | 'error'
> = {
	idle: 'secondary',
	thinking: 'primary',
	working: 'primary',
	done: 'success',
	error: 'error',
	offline: 'secondary',
};

export function AiAgent({
	name,
	icon,
	avatar,
	subtitle,
	tone = 'primary',
	status,
	variant = 'inline',
	trailing,
	className,
	strings: stringsProp,
}: AiAgentProps) {
	const strings = useStrings(defaultAiAgentStrings, stringsProp);
	const Icon: LucideIcon = icon ?? Bot;

	const avatarSize = variant === 'card' ? 'size-9' : 'size-7';
	const iconSize = variant === 'card' ? 'size-4' : 'size-3.5';

	const renderedAvatar =
		avatar ?? (
			<span
				aria-hidden
				className={cn(
					'inline-flex shrink-0 items-center justify-center rounded-full',
					avatarSize,
					TONE_AVATAR[tone],
				)}
			>
				<Icon className={iconSize} />
			</span>
		);

	const StatusPill = !!status && (
		<Badge variant={STATUS_VARIANT[status]} className="gap-1">
			<span
				aria-hidden
				className={cn(
					'inline-block size-1.5 rounded-full',
					status === 'thinking' || status === 'working'
						? 'animate-pulse bg-current'
						: 'bg-current',
				)}
			/>
			{strings.statusLabels[status]}
		</Badge>
	);

	if (variant === 'card') {
		return (
			<div
				className={cn('ai-agent--component', 
					'flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-2.5',
					className,
				)}
			>
				{renderedAvatar}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<Text weight="semibold" className="truncate">
							{name}
						</Text>
						{StatusPill}
					</div>
					{!!subtitle && (
						<Text size="xs" type="secondary" className="mt-0.5 line-clamp-1">
							{subtitle}
						</Text>
					)}
				</div>
				{!!trailing && <div className="ml-auto flex items-center gap-1">{trailing}</div>}
			</div>
		);
	}

	return (
		<div className={cn('inline-flex items-center gap-2', className)}>
			{renderedAvatar}
			<div className="flex min-w-0 items-center gap-2">
				<Text size="xs" weight="medium" className="truncate">
					{name}
				</Text>
				{!!subtitle && (
					<Text size="xxs" type="secondary" className="truncate">
						{subtitle}
					</Text>
				)}
				{StatusPill}
			</div>
			{!!trailing && <div className="ml-1 flex items-center gap-1">{trailing}</div>}
		</div>
	);
}

AiAgent.displayName = 'AiAgent';
