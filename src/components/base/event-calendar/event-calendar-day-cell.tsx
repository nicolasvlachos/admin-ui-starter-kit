/**
 * EventCalendarDayCell — single day square in the month grid. Shows the day
 * number, up to `maxEvents` event badges, and an overflow row with category
 * dots + a pluralised "+N bookings" hint when more events exist than fit.
 * Whole cell is keyboard-clickable.
 */
import Text from '@/components/typography/text';
import { cn } from '@/lib/utils';
import { EventCalendarEventBadge } from './event-calendar-event-badge';
import {
	calendarTokenDot,
	defaultEventCalendarStrings,
	resolveCategoryColorToken,
	type EventCalendarDayCellProps,
} from './event-calendar.types';
import { getCategoryById } from './use-event-calendar-data';

export function EventCalendarDayCell({
	data,
	categories,
	maxEvents = 3,
	onClick,
	compact = false,
	strings: stringsProp,
	renderEvent,
}: EventCalendarDayCellProps) {
	const strings = {
		booking: stringsProp?.booking ?? defaultEventCalendarStrings.booking,
		bookings: stringsProp?.bookings ?? defaultEventCalendarStrings.bookings,
	};
	const { date, isCurrentMonth, isToday, isWeekend, events, eventCount } = data;

	const visibleEvents = events.slice(0, maxEvents);
	const remainingCount = Math.max(0, eventCount - maxEvents);

	return (
		<div className={cn('event-calendar-day-cell--component', 'p-0 relative w-full border-r border-b border-border last:border-r-0 [&:nth-child(7n)]:border-r-0')}>
			<div
				role="button"
				tabIndex={0}
				onClick={onClick}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						onClick();
					}
				}}
				className={cn(
					'relative w-full min-h-24 p-2 transition-colors',
					'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10',
					'flex flex-col items-start gap-1',
					!isCurrentMonth && 'text-muted-foreground opacity-50',
					isToday && 'h-full bg-accent text-accent-foreground',
					compact && 'min-h-20 p-1'
				)}
				aria-label={date.toDateString()}
				data-date={date.toISOString()}
				data-today={isToday}
				data-weekend={isWeekend}
				data-current-month={isCurrentMonth}
			>
				<Text
					className={cn(
						'font-normal leading-none',
						isToday && 'font-semibold',
						!isCurrentMonth && 'text-muted-foreground',
						compact && 'text-xs'
					)}
				>
					{date.getDate()}
				</Text>

				<div className="w-full space-y-0.5">
					{visibleEvents.map((event) => {
						const category = getCategoryById(categories, event.category);
						if (renderEvent) {
							return <div key={event.id}>{renderEvent(event, category)}</div>;
						}
						return (
							<EventCalendarEventBadge
								key={event.id}
								event={event}
								category={category}
								compact={compact || data.hasMultipleEvents}
								onClick={() => onClick()}
							/>
						);
					})}

					{remainingCount > 0 && (
						<div className="flex items-center gap-1 py-0.5 px-2">
							<div className="flex items-center -space-x-1">
								{categories.slice(0, 3).map((category, idx) => (
									<span
										key={category.id || idx}
										className={cn(
											'h-1.5 w-1.5 rounded-full border border-background',
											calendarTokenDot[resolveCategoryColorToken(category)],
										)}
									/>
								))}
							</div>
							<Text
								size="xs"
								type="secondary"
								className="font-medium text-xxs"
							>
								{remainingCount} {remainingCount === 1 ? strings.booking : strings.bookings}
							</Text>
						</div>
						)}
					</div>
			</div>
		</div>
	);
}

EventCalendarDayCell.displayName = 'EventCalendarDayCell';
