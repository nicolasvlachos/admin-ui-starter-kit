export { EventCalendar } from './event-calendar';
export { EventCalendarHeader } from './event-calendar-header';
export { EventCalendarDayCell } from './event-calendar-day-cell';
export { EventCalendarEventBadge } from './event-calendar-event-badge';
export {
	EventCalendarEventCard,
	defaultEventCalendarEventCardStrings,
	type EventCalendarEventCardStrings,
} from './event-calendar-event-card';
export { EventCalendarLegend } from './event-calendar-legend';
export { useEventCalendar } from './use-event-calendar';
export { useEventCalendarData, getEventsForDay, getCategoryById } from './use-event-calendar-data';
export {
	getCalendarColorClasses,
	getCalendarDotClass,
	type CalendarColorClasses,
} from './colors';

export type {
	CalendarEvent,
	EventCategory,
	CalendarColorToken,
	CalendarViewMode,
	CalendarDayData,
	CalendarActionItem,
	EventCalendarProps,
	EventCalendarDayCellProps,
	EventCalendarEventBadgeProps,
	EventCalendarEventCardProps,
	EventCalendarLegendProps,
	EventCalendarHeaderProps,
	UseEventCalendarReturn,
	UseEventCalendarDataOptions,
	EventCalendarStrings,
} from './event-calendar.types';

export {
	defaultEventCalendarStrings,
	calendarTokenDot,
	resolveCategoryColorToken,
} from './event-calendar.types';
