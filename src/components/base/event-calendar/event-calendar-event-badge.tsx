/**
 * EventCalendarEventBadge — compact badge representing a single event inside
 * a day cell. Renders a category-coloured dot, the event title (or a custom
 * `metadata.calendar_cell_title` override), and the start time when not an
 * all-day event. Click is captured locally and propagated via `onClick`.
 */
import { format } from 'date-fns';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import {
	calendarTokenDot,
	resolveCategoryColorToken,
	type EventCalendarEventBadgeProps,
} from './event-calendar.types';

export function EventCalendarEventBadge({
	event,
	category,
	compact = false,
	onClick,
}: EventCalendarEventBadgeProps) {
	const dotColor = calendarTokenDot[resolveCategoryColorToken(category)];

	const timeDisplay = !event.allDay ? format(event.startDate, 'HH:mm') : null;
	const cellTitleRaw = event.metadata?.calendar_cell_title;
	const displayTitle =
		typeof cellTitleRaw === 'string' && cellTitleRaw.trim() !== ''
			? cellTitleRaw
			: event.title;

	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				onClick?.();
			}}
			className={cn('event-calendar-event-badge--component', 
				'group/event flex w-full min-w-0 items-center gap-1 rounded-md border border-border/60 bg-card px-1.5',
				'text-left transition-colors hover:bg-accent/50',
				compact ? 'h-5' : 'h-6',
			)}
			title={typeof displayTitle === 'string' ? displayTitle : undefined}
		>
			<span
				aria-hidden="true"
				className={cn('size-1.5 shrink-0 rounded-full', dotColor)}
			/>
			<Text
				tag="span"
				size="xxs"
				weight="medium"
				className="min-w-0 flex-1 truncate"
			>
				{displayTitle}
			</Text>
			{!!timeDisplay && (
				<Text
					tag="span"
					size="xxs"
					type="secondary"
					className="shrink-0 whitespace-nowrap tabular-nums"
				>
					{timeDisplay}
				</Text>
			)}
			{void Badge}
		</button>
	);
}

EventCalendarEventBadge.displayName = 'EventCalendarEventBadge';
