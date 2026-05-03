/**
 * CourseCard — course summary tile with title, description, badges row,
 * stacked-avatar participants block, progress bar, and primary action.
 *
 * Three variants:
 *  - `default` — soft gradient surface (current behaviour)
 *  - `gradient` — vivid gradient header background, white text overlay
 *  - `minimal` — borderless inline row (icon-free, single line of meta)
 *
 * Strings overridable for i18n.
 */
import { Badge } from '@/components/base/badge/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards/smart-card';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@/components/base/item';
import { Text } from '@/components/typography/text';
import { StackedAvatars, type StackedAvatarUser } from '@/components/base/display/stacked-avatars';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultCourseCardStrings, type CourseCardProps, type CourseParticipant } from './types';

const innerSurface = 'rounded-xl bg-background/80 ring-1 ring-border/60 p-3';

const DEFAULT_GRADIENT = 'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500';

function toAvatarUsers(participants: CourseParticipant[]): StackedAvatarUser[] {
	return participants.map((p, idx) => ({
		id: `${idx}-${p.name ?? p.initials ?? ''}`,
		name: p.name ?? p.initials ?? `P${idx + 1}`,
		imageUrl: p.imageUrl,
	}));
}

export function CourseCard({
	title,
	description,
	badges = [],
	participants = [],
	extraParticipants = 0,
	progressPercent,
	actionLabel,
	onAction,
	className,
	strings: stringsProp,
	variant = 'default',
	gradient = DEFAULT_GRADIENT,
}: CourseCardProps) {
	const strings = useStrings(defaultCourseCardStrings, stringsProp);
	const totalUsers = participants.length + extraParticipants;
	const avatarUsers = toAvatarUsers(participants);

	if (variant === 'minimal') {
		return (
			<Item variant="outline" className={cn('course-card--component', 'hover:bg-muted/30 transition-colors', className)}>
				<ItemContent>
					<ItemTitle>{title}</ItemTitle>
					{!!description && <ItemDescription clamp={1}>{description}</ItemDescription>}
				</ItemContent>
				<ItemActions>
					{participants.length > 0 && (
						<StackedAvatars
							users={avatarUsers}
							max={3}
							size="sm"
							overflowFormatter={() => `+${extraParticipants || 0}`}
							showOverflow={extraParticipants > 0}
						/>
					)}
					{progressPercent !== undefined && (
						<Text size="xs" type="secondary" className="shrink-0 tabular-nums">
							{progressPercent}%
						</Text>
					)}
					{!!actionLabel && (
						<Button variant="secondary" buttonStyle="ghost" onClick={onAction}>
							{actionLabel}
						</Button>
					)}
				</ItemActions>
			</Item>
		);
	}

	if (variant === 'gradient') {
		return (
			<div
				className={cn(
					'relative overflow-hidden rounded-2xl text-white shadow-sm',
					gradient,
					className,
				)}
			>
				<div className="p-5">
					<Text size="base" weight="semibold" className="text-white">{title}</Text>
					{!!description && (
						<Text className="text-white/80 mt-0.5">{description}</Text>
					)}
					{badges.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-1.5">
							{badges.map((badge) => (
								<span
									key={badge.label}
									className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xxs font-medium text-white backdrop-blur-sm"
								>
									{badge.label}
								</span>
							))}
						</div>
					)}
				</div>
				{(participants.length > 0 || progressPercent !== undefined) && (
					<div className="bg-black/15 px-5 py-3 backdrop-blur-sm flex items-center gap-4">
						{participants.length > 0 && (
							<div className="flex items-center gap-2">
								<StackedAvatars users={avatarUsers} max={3} size="sm" showOverflow={false} />
								<Text size="xs" className="text-white/80">
									{totalUsers} {strings.participants.toLowerCase()}
								</Text>
							</div>
						)}
						{progressPercent !== undefined && (
							<div className="ml-auto flex items-center gap-2">
								<div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/25">
									<div className="h-full rounded-full bg-white" style={{ width: `${progressPercent}%` }} />
								</div>
								<Text size="xs" className="text-white/90 tabular-nums">{progressPercent}%</Text>
							</div>
						)}
					</div>
				)}
				{!!actionLabel && (
					<div className="px-5 pb-5 pt-0">
						<button
							type="button"
							onClick={onAction}
							className={cn(
								'w-full rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-white transition-colors',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2',
							)}
						>
							{actionLabel}
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<SmartCard
			title={title}
			description={description}
			className={cn('bg-gradient-to-b from-muted/30 to-card', className)}
		>
			{badges.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{badges.map((badge) => (
						<Badge key={badge.label} variant={badge.variant}>
							{badge.label}
						</Badge>
					))}
				</div>
			)}

			{(participants.length > 0 || progressPercent !== undefined) && (
				<div className="mt-4 grid grid-cols-2 gap-2.5">
					{participants.length > 0 && (
						<div className={innerSurface}>
							<Text size="xs" type="secondary">{strings.participants}</Text>
							<div className="mt-2">
								<StackedAvatars
									users={avatarUsers}
									max={4}
									size="sm"
									showOverflow={extraParticipants > 0}
									overflowFormatter={() => `+${extraParticipants}`}
								/>
							</div>
						</div>
					)}
					{progressPercent !== undefined && (
						<div className={innerSurface}>
							<Text size="xs" type="secondary">{strings.progress}</Text>
							<div className="mt-2.5">
								<div className="h-1.5 w-full overflow-hidden rounded-full bg-success/15">
									<div className="h-full rounded-full bg-success" style={{ width: `${progressPercent}%` }} />
								</div>
								<Text size="xs" type="secondary" className="mt-1 tabular-nums">{progressPercent}%</Text>
							</div>
						</div>
					)}
				</div>
			)}

			{!!actionLabel && (
				<Button variant="dark" className="mt-4 w-full rounded-xl" onClick={onAction}>
					{actionLabel}
				</Button>
			)}
		</SmartCard>
	);
}

CourseCard.displayName = 'CourseCard';
