/**
 * EventCalendar — month-grid event calendar with category legend, header
 * navigation (prev/next/today + view-mode select), keyboard-accessible day
 * cells, and per-category filtering. Strings are fully overridable; category
 * colours come from a small canonical token set (`calendarTokenDot`).
 */
import { useState, useMemo } from 'react';
import Text from '@/components/typography/text';
import { useDatesConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';
import { EventCalendarDayCell } from './event-calendar-day-cell';
import { EventCalendarHeader } from './event-calendar-header';
import { EventCalendarLegend } from './event-calendar-legend';
import { defaultEventCalendarStrings, type EventCalendarProps } from './event-calendar.types';
import { useEventCalendar } from './use-event-calendar';

function isDateMatched(rule: EventCalendarProps['disabledDates'], date: Date): boolean {
	if (!rule) return false;
	if (Array.isArray(rule)) {
		return rule.some((d) => d.toDateString() === date.toDateString());
	}
	if (typeof rule === 'function') {
		return rule(date);
	}
	const datesMatch = rule.dates?.some((d) => d.toDateString() === date.toDateString()) ?? false;
	const predicateMatch = rule.predicate?.(date) ?? false;
	return datesMatch || predicateMatch;
}

export function EventCalendar({
	events,
	categories,
	viewMode: controlledViewMode,
	onViewModeChange,
	defaultDate,
	onDateChange,
	onEventClick: _onEventClick,
	onDayClick,
	maxEventsPerDay = 3,
	showLegend = true,
	showHeader = true,
	showWeekends = true,
	weekStartsOn: weekStartsOnProp,
	locale,
	enableCategoryFilter = false,
	visibleCategories: controlledVisibleCategories,
	onVisibleCategoriesChange,
	isLoading = false,
	emptyStateMessage,
	className,
	compact = false,
	actions,
	strings: stringsProp,
	dayHeadingVariant = 'default',
	dayHeadingClassName,
	renderDayHeading,
	rangeMode = 'date',
	minDate,
	maxDate,
	disabledDates,
	filterEvent,
	renderEvent,
	renderDayCell,
}: EventCalendarProps) {
	const strings = useMemo(
		() => ({
			...defaultEventCalendarStrings,
			...stringsProp,
			viewMode: { ...defaultEventCalendarStrings.viewMode, ...(stringsProp?.viewMode ?? {}) },
			weekdaysShort: stringsProp?.weekdaysShort ?? defaultEventCalendarStrings.weekdaysShort,
		}),
		[stringsProp],
	);

	const [internalVisibleCategories, setInternalVisibleCategories] = useState<string[]>([]);

	const visibleCategories = controlledVisibleCategories ?? internalVisibleCategories;

	// Resolve start-of-week against the consumer's <UIProvider> dates
	// slice. Library default is 1 (Monday) when no consumer override is set.
	const { weekStartsOn: configWeekStartsOn } = useDatesConfig();
	const weekStartsOn = (weekStartsOnProp ?? configWeekStartsOn ?? 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6;

	const handleToggleCategory = (categoryId: string) => {
		const newCategories = visibleCategories.includes(categoryId)
			? visibleCategories.filter(id => id !== categoryId)
			: [...visibleCategories, categoryId];

		if (onVisibleCategoriesChange) {
			onVisibleCategoriesChange(newCategories);
		} else {
			setInternalVisibleCategories(newCategories);
		}
	};

	const calendar = useEventCalendar({
		events,
		defaultDate,
		defaultViewMode: controlledViewMode || 'month',
		onDateChange,
		onViewModeChange,
		dataOptions: {
			weekStartsOn,
			showWeekends,
			visibleCategories: visibleCategories.length > 0 ? visibleCategories : undefined
		}
	});

	const weekdays = useMemo(() => {
		const days = strings.weekdaysShort;
		if (weekStartsOn === 1) {
			return [...days.slice(1), days[0]];
		}
		return days as readonly string[];
	}, [strings.weekdaysShort, weekStartsOn]);

	const handleDayClick = (dayData: typeof calendar.calendarDays[0]) => {
		// Block clicks on disabled or out-of-range dates.
		if (isDateMatched(disabledDates, dayData.date)) return;
		if (minDate && dayData.date < minDate) return;
		if (maxDate && dayData.date > maxDate) return;
		onDayClick?.(dayData.date, dayData.events);
	};

	// Apply runtime event filtering + min/max disabled rules to each day's
	// event list before passing to the cell. Doesn't mutate the source.
	const filteredCalendarDays = useMemo(() => {
		if (!filterEvent) return calendar.calendarDays;
		return calendar.calendarDays.map((day) => ({
			...day,
			events: day.events.filter(filterEvent),
			eventCount: day.events.filter(filterEvent).length,
			hasMultipleEvents: day.events.filter(filterEvent).length > 1,
		}));
	}, [calendar.calendarDays, filterEvent]);

	function isDayDisabled(date: Date): boolean {
		if (isDateMatched(disabledDates, date)) return true;
		if (minDate && date < minDate) return true;
		if (maxDate && date > maxDate) return true;
		return false;
	}

	// Pre-compute prev/next disabled state for the header navigation.
	const navDisabled = useMemo(() => {
		const days = calendar.calendarDays;
		if (days.length === 0) return { prev: false, next: false };
		const first = days[0].date;
		const last = days[days.length - 1].date;
		return {
			prev: !!minDate && first <= minDate,
			next: !!maxDate && last >= maxDate,
		};
	}, [calendar.calendarDays, minDate, maxDate]);

	if (isLoading) {
		return (
			<div className={cn('event-calendar--component', 'flex items-center justify-center py-12')}>
				<Text type="secondary">
					{strings.loading}
				</Text>
			</div>
		);
	}

	const viewModeChangeHandler = controlledViewMode ? onViewModeChange : undefined;
	const toggleCategoryHandler = enableCategoryFilter ? handleToggleCategory : undefined;

	return (
		<div className={cn('w-full space-y-4', className)}>
			{!!showHeader && (
				<EventCalendarHeader
					currentDate={calendar.currentDate}
					viewMode={calendar.viewMode}
					displayLabel={calendar.displayLabel}
					onPrevious={calendar.goToPreviousPeriod}
					onNext={calendar.goToNextPeriod}
					onToday={calendar.goToToday}
					onViewModeChange={viewModeChangeHandler}
					onDateChange={calendar.setDate}
					locale={locale}
					actions={actions}
					rangeMode={rangeMode}
					minDate={minDate}
					maxDate={maxDate}
					prevDisabled={navDisabled.prev}
					nextDisabled={navDisabled.next}
					strings={{ today: strings.today, previous: strings.previous, next: strings.next, viewMode: strings.viewMode }}
				/>
			)}

			{!!showLegend && categories.length > 0 && (
				<EventCalendarLegend
					categories={categories}
					visibleCategories={visibleCategories}
					onToggleCategory={toggleCategoryHandler}
					enableFiltering={enableCategoryFilter}
				/>
			)}

			{(!calendar.hasEvents && emptyStateMessage) ? (
				<div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg">
					<Text type="secondary">
						{emptyStateMessage}
					</Text>
				</div>
			) : (
				<div className="bg-background rounded-lg border border-border">
					{/* Weekday headers */}
					<div
						className={cn(
							'grid grid-cols-7',
							dayHeadingVariant === 'bordered' && 'border-b border-border mb-0',
							dayHeadingVariant === 'tinted' && 'bg-muted/40 rounded-t-lg mb-0 overflow-hidden',
							dayHeadingVariant === 'accent' && 'bg-primary/8 rounded-t-lg mb-0 overflow-hidden',
							(dayHeadingVariant === 'default') && 'mb-2',
						)}
					>
						{weekdays.map((day, index) => {
							if (renderDayHeading) {
								return <div key={day}>{renderDayHeading(day, index)}</div>;
							}
							return (
								<div
									key={day}
									className={cn(
										'text-center h-8 flex items-center justify-center',
										dayHeadingClassName,
									)}
								>
									<Text
										size="xs"
										weight={dayHeadingVariant === 'accent' ? 'medium' : 'regular'}
										className={cn(
											dayHeadingVariant === 'default' && 'text-muted-foreground',
											dayHeadingVariant === 'tinted' && 'text-muted-foreground',
											dayHeadingVariant === 'bordered' && 'text-foreground',
											dayHeadingVariant === 'accent' && 'text-primary',
										)}
									>
										{day}
									</Text>
								</div>
							);
						})}
					</div>

					{/* Calendar grid */}
					<div className="grid grid-cols-7">
						{filteredCalendarDays.map((dayData) => {
							const disabled = isDayDisabled(dayData.date);
							const defaultRender = () => (
								<EventCalendarDayCell
									data={dayData}
									categories={categories}
									maxEvents={maxEventsPerDay}
									onClick={() => handleDayClick(dayData)}
									compact={compact}
									strings={{ booking: strings.booking, bookings: strings.bookings }}
									renderEvent={renderEvent}
								/>
							);
							return (
								<div
									key={dayData.date.toISOString()}
									className={cn(disabled && 'pointer-events-none opacity-40')}
									aria-disabled={disabled || undefined}
								>
									{renderDayCell ? renderDayCell(dayData, defaultRender) : defaultRender()}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

EventCalendar.displayName = 'EventCalendar';
