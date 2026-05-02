import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isToday,
	isSameDay,
	isWeekend,
	startOfDay
} from 'date-fns';
import { useMemo } from 'react';
import type {
	CalendarEvent,
	CalendarDayData,
	CalendarViewMode,
	UseEventCalendarDataOptions
} from './event-calendar.types';

/**
 * Transforms raw events into calendar grid data
 */
export function useEventCalendarData(
	events: CalendarEvent[],
	currentDate: Date,
	viewMode: CalendarViewMode,
	options: UseEventCalendarDataOptions = {}
): CalendarDayData[] {
	const {
		weekStartsOn = 1,
		showWeekends = true,
		visibleCategories
	} = options;

	return useMemo(() => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);

		let rangeStart: Date;
		let rangeEnd: Date;

		if (viewMode === 'month') {
			rangeStart = startOfWeek(monthStart, { weekStartsOn });
			rangeEnd = endOfWeek(monthEnd, { weekStartsOn });
		} else if (viewMode === 'week') {
			rangeStart = startOfWeek(currentDate, { weekStartsOn });
			rangeEnd = endOfWeek(currentDate, { weekStartsOn });
		} else {
			rangeStart = monthStart;
			rangeEnd = monthEnd;
		}

		const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

		const filteredEvents = visibleCategories && visibleCategories.length > 0
			? events.filter(event => visibleCategories.includes(event.category))
			: events;

		const eventsByDate = new Map<string, CalendarEvent[]>();

		filteredEvents.forEach(event => {
			const eventStart = startOfDay(event.startDate);
			if (Number.isNaN(eventStart.getTime())) {
				return;
			}

			let eventEnd = eventStart;
			if (event.endDate && !Number.isNaN(event.endDate.getTime())) {
				const normalizedEnd = startOfDay(event.endDate);
				if (!Number.isNaN(normalizedEnd.getTime()) && normalizedEnd.getTime() >= eventStart.getTime()) {
					eventEnd = normalizedEnd;
				}
			}

			const eventDays = eachDayOfInterval({ start: eventStart, end: eventEnd });

			eventDays.forEach(day => {
				const dateKey = day.toISOString().split('T')[0];
				if (!eventsByDate.has(dateKey)) {
					eventsByDate.set(dateKey, []);
				}
				eventsByDate.get(dateKey)!.push(event);
			});
		});

		const calendarDays: CalendarDayData[] = days
			.filter(day => showWeekends || !isWeekend(day))
			.map(day => {
				const dateKey = day.toISOString().split('T')[0];
				const dayEvents = eventsByDate.get(dateKey) || [];

				const sortedEvents = [...dayEvents].sort((a, b) => {
					if (a.allDay && !b.allDay) return -1;
					if (!a.allDay && b.allDay) return 1;
					return a.startDate.getTime() - b.startDate.getTime();
				});

				return {
					date: day,
					isCurrentMonth: isSameMonth(day, currentDate),
					isToday: isToday(day),
					isWeekend: isWeekend(day),
					events: sortedEvents,
					eventCount: sortedEvents.length,
					hasMultipleEvents: sortedEvents.length > 1
				};
			});

		return calendarDays;
	}, [events, currentDate, viewMode, weekStartsOn, showWeekends, visibleCategories]);
}

/**
 * Gets events for a specific day
 */
export function getEventsForDay(
	events: CalendarEvent[],
	date: Date
): CalendarEvent[] {
	return events
		.filter(event => {
			const eventStart = startOfDay(event.startDate);
			const eventEnd = event.endDate ? startOfDay(event.endDate) : eventStart;
			const targetDay = startOfDay(date);

			return isSameDay(targetDay, eventStart) ||
				isSameDay(targetDay, eventEnd) ||
				(targetDay > eventStart && targetDay < eventEnd);
		})
		.sort((a, b) => {
			if (a.allDay && !b.allDay) return -1;
			if (!a.allDay && b.allDay) return 1;
			return a.startDate.getTime() - b.startDate.getTime();
		});
}

/**
 * Gets the category object by ID
 */
export function getCategoryById<T extends { id: string }>(
	categories: T[],
	categoryId: string
): T | undefined {
	return categories.find(cat => cat.id === categoryId);
}
