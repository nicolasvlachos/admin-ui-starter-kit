/**
 * MilestonesTimelineCard — project / goal milestones rendered through the
 * shared `Timeline` primitive. Each milestone has a status (completed /
 * in-progress / upcoming / blocked) that drives the dot tone, and an
 * optional `progress` percent that renders an inline progress bar when the
 * milestone is in flight. Strings overridable for i18n.
 */
import { Check, Circle, Clock, Flag, X } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	Timeline,
	type TimelineItem,
	type TimelineStatus,
} from '../shared';
import {
	defaultMilestonesTimelineStrings,
	type MilestoneItem,
	type MilestoneStatus,
	type MilestonesTimelineCardProps,
} from './types';

const STATUS_TO_TIMELINE: Record<MilestoneStatus, TimelineStatus> = {
	completed: 'completed',
	in_progress: 'current',
	upcoming: 'pending',
	blocked: 'error',
};

const STATUS_ICON = {
	completed: Check,
	in_progress: Clock,
	upcoming: Circle,
	blocked: X,
} as const;

const STATUS_BADGE: Record<MilestoneStatus, 'success' | 'primary' | 'secondary' | 'error'> = {
	completed: 'success',
	in_progress: 'primary',
	upcoming: 'secondary',
	blocked: 'error',
};

export function MilestonesTimelineCard({
	milestones,
	className,
	strings: stringsProp,
}: MilestonesTimelineCardProps) {
	const strings = useStrings(defaultMilestonesTimelineStrings, stringsProp);
	const labelByStatus: Record<MilestoneStatus, string> = {
		completed: strings.completed,
		in_progress: strings.in_progress,
		upcoming: strings.upcoming,
		blocked: strings.blocked,
	};

	const items: TimelineItem[] = milestones.map((m: MilestoneItem) => ({
		id: m.id,
		title: (
			<span className="inline-flex flex-wrap items-center gap-1.5">
				<span>{m.title}</span>
				<Badge variant={STATUS_BADGE[m.status]}>
					{labelByStatus[m.status]}
				</Badge>
			</span>
		),
		description: m.description,
		timestamp: m.dueDate ? `${strings.dueOn} ${m.dueDate}` : undefined,
		icon: STATUS_ICON[m.status],
		status: STATUS_TO_TIMELINE[m.status],
		children:
			m.status === 'in_progress' && typeof m.progress === 'number' ? (
				<div className="space-y-1">
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							className={cn('h-full rounded-full bg-primary transition-[width] duration-300')}
							style={{ width: `${Math.max(0, Math.min(100, m.progress))}%` }}
						/>
					</div>
					<Text size="xxs" type="secondary" className="tabular-nums">
						{Math.round(m.progress)}%
					</Text>
				</div>
			) : undefined,
	}));

	return (
		<SmartCard
			icon={<Flag className="size-4" />}
			title={strings.title}
			className={className}
		>
			<Timeline items={items} dotSize="base" />
		</SmartCard>
	);
}

MilestonesTimelineCard.displayName = 'MilestonesTimelineCard';
