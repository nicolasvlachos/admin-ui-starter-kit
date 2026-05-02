import { addMonths, subMonths, addWeeks, subWeeks, format } from 'date-fns';
import { useState, useCallback, useMemo } from 'react';
import type {
	CalendarEvent,
	CalendarViewMode,
	UseEventCalendarReturn,
	UseEventCalendarDataOptions
} from './event-calendar.types';
import { useEventCalendarData } from './use-event-calendar-data';

export interface UseEventCalendarProps {
	events: CalendarEvent[];
	defaultDate?: Date;
	defaultViewMode?: CalendarViewMode;
	onDateChange?: (date: Date) => void;
	onViewModeChange?: (mode: CalendarViewMode) => void;
	dataOptions?: UseEventCalendarDataOptions;
}

/**
 * Core calendar logic hook
 */
export function useEventCalendar({
	events,
	defaultDate = new Date(),
	defaultViewMode = 'month',
	onDateChange,
	onViewModeChange,
	dataOptions = {}
}: UseEventCalendarProps): UseEventCalendarReturn {
	const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
	const [viewMode, setViewMode] = useState<CalendarViewMode>(defaultViewMode);

	const calendarDays = useEventCalendarData(
		events,
		currentDate,
		viewMode,
		dataOptions
	);

	const visibleEvents = useMemo(() => {
		if (dataOptions.visibleCategories && dataOptions.visibleCategories.length > 0) {
			return events.filter(event =>
				dataOptions.visibleCategories!.includes(event.category)
			);
		}
		return events;
	}, [events, dataOptions.visibleCategories]);

	const goToToday = useCallback(() => {
		const today = new Date();
		setCurrentDate(today);
		onDateChange?.(today);
	}, [onDateChange]);

	const goToNextPeriod = useCallback(() => {
		const newDate = viewMode === 'month'
			? addMonths(currentDate, 1)
			: addWeeks(currentDate, 1);
		setCurrentDate(newDate);
		onDateChange?.(newDate);
	}, [currentDate, viewMode, onDateChange]);

	const goToPreviousPeriod = useCallback(() => {
		const newDate = viewMode === 'month'
			? subMonths(currentDate, 1)
			: subWeeks(currentDate, 1);
		setCurrentDate(newDate);
		onDateChange?.(newDate);
	}, [currentDate, viewMode, onDateChange]);

	const handleSetDate = useCallback((date: Date) => {
		setCurrentDate(date);
		onDateChange?.(date);
	}, [onDateChange]);

	const handleSetViewMode = useCallback((mode: CalendarViewMode) => {
		setViewMode(mode);
		onViewModeChange?.(mode);
	}, [onViewModeChange]);

	const displayLabel = useMemo(() => {
		if (viewMode === 'month') {
			return format(currentDate, 'MMMM yyyy');
		} else if (viewMode === 'week') {
			const weekStart = calendarDays[0]?.date;
			const weekEnd = calendarDays[calendarDays.length - 1]?.date;
			if (weekStart && weekEnd) {
				return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
			}
			return format(currentDate, 'MMMM yyyy');
		}
		return format(currentDate, 'MMMM yyyy');
	}, [currentDate, viewMode, calendarDays]);

	const hasEvents = useMemo(() => {
		return visibleEvents.length > 0;
	}, [visibleEvents]);

	return {
		currentDate,
		viewMode,
		calendarDays,
		visibleEvents,
		goToToday,
		goToNextPeriod,
		goToPreviousPeriod,
		setDate: handleSetDate,
		setViewMode: handleSetViewMode,
		displayLabel,
		hasEvents
	};
}
