import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Calendar action item.
 *
 * The library never navigates on its own — there is no `href` shortcut.
 * The consumer wires routing into `onClick` (e.g. a Tanstack Router
 * `navigate(...)` or Inertia `router.visit(...)`), or supplies a fully
 * pre-rendered element via `element`.
 */
export interface CalendarActionItem {
	id?: string;
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	element?: ReactNode;
	icon?: LucideIcon;
	variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
	isVisible?: boolean;
}

/**
 * Base event data structure
 */
export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate?: Date;
	allDay?: boolean;
	category: string;
	metadata?: Record<string, unknown>;
	url?: string;
}

/**
 * Canonical category palette tokens. Map to a small fixed set of colours so
 * the calendar can render dots/strokes without parsing arbitrary class names.
 * Add new tokens here when the design palette grows.
 */
export type CalendarColorToken =
	| 'gray'
	| 'red'
	| 'orange'
	| 'amber'
	| 'yellow'
	| 'green'
	| 'blue'
	| 'purple';

/**
 * Tailwind class lookups for each canonical token. Used by day-cell dots and
 * event-badge dots so we never string-parse `category.color`.
 */
export const calendarTokenDot: Record<CalendarColorToken, string> = {
	gray: 'bg-gray-500',
	red: 'bg-red-500',
	orange: 'bg-orange-500',
	amber: 'bg-amber-500',
	yellow: 'bg-yellow-500',
	green: 'bg-green-500',
	blue: 'bg-blue-500',
	purple: 'bg-purple-500',
};

/**
 * Event category configuration. Provide a canonical `colorToken` when
 * possible — it's used everywhere the calendar paints a dot. The free-form
 * `color`/`bgColor` strings are kept for legacy consumers (legend swatches,
 * external Tailwind classes) but new code should rely on `colorToken`.
 */
export interface EventCategory {
	id: string;
	label: string;
	color: string;
	bgColor?: string;
	textColor?: string;
	colorToken?: CalendarColorToken;
	icon?: LucideIcon;
	description?: string;
}

/**
 * Best-effort mapping from a free-form `category.color` Tailwind class to a
 * canonical token. Falls back to `gray`. Prefer `category.colorToken` —
 * this is only used to retrofit legacy consumers.
 */
export function resolveCategoryColorToken(category?: EventCategory | null): CalendarColorToken {
	if (!category) return 'gray';
	if (category.colorToken) return category.colorToken;
	const c = category.color ?? '';
	if (c.includes('orange')) return 'orange';
	if (c.includes('yellow')) return 'yellow';
	if (c.includes('amber')) return 'amber';
	if (c.includes('purple')) return 'purple';
	if (c.includes('green')) return 'green';
	if (c.includes('blue')) return 'blue';
	if (c.includes('red')) return 'red';
	return 'gray';
}

/**
 * Calendar view mode
 */
export type CalendarViewMode = 'month' | 'week' | 'agenda';

/**
 * Day cell data (processed)
 */
export interface CalendarDayData {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	isWeekend: boolean;
	events: CalendarEvent[];
	eventCount: number;
	hasMultipleEvents: boolean;
}

/**
 * Localizable strings — pass partial overrides via `strings`.
 */
export interface EventCalendarStrings {
	today: string;
	previous: string;
	next: string;
	loading: string;
	booking: string;
	bookings: string;
	viewMode: {
		month: string;
		week: string;
		agenda: string;
	};
	weekdaysShort: [string, string, string, string, string, string, string]; // Sun..Sat
}

export const defaultEventCalendarStrings: EventCalendarStrings = {
	today: 'Today',
	previous: 'Previous',
	next: 'Next',
	loading: 'Loading…',
	booking: 'booking',
	bookings: 'bookings',
	viewMode: {
		month: 'Month',
		week: 'Week',
		agenda: 'Agenda',
	},
	weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

/**
 * Visual variant for the weekday-header strip ("Sun Mon Tue …").
 *  - `default` — muted text on transparent (matches body)
 *  - `accent` — primary-tinted background, primary text
 *  - `tinted` — muted background, foreground text (subtle separation)
 *  - `bordered` — bottom-bordered row, foreground text
 *
 * Consumers can also pass a fully custom `dayHeadingClassName` to override
 * any preset.
 */
export type EventCalendarDayHeadingVariant = 'default' | 'accent' | 'tinted' | 'bordered';

/**
 * Predicate-or-list shape for date rules. Either explicit dates,
 * a predicate callback, or both (combined with OR semantics).
 */
export type DateRule = Date[] | ((date: Date) => boolean) | { dates?: Date[]; predicate?: (date: Date) => boolean };

/**
 * Hook for filtering events at render time without mutating the source list.
 */
export type EventFilter = (event: CalendarEvent) => boolean;

/**
 * Render hook for individual event chips in the day cell.
 */
export type RenderEventFn = (event: CalendarEvent, category: EventCategory | undefined) => ReactNode;

/**
 * Render hook for the day cell body (after the date number is drawn).
 */
export type RenderDayCellFn = (day: CalendarDayData, defaultRender: () => ReactNode) => ReactNode;

/**
 * Range mode for navigation. `month-year` exposes a Month/Year picker
 * trigger in the header that jumps the calendar to that month.
 */
export type EventCalendarRangeMode = 'date' | 'month-year';

/**
 * Event calendar props
 */
export interface EventCalendarProps {
	events: CalendarEvent[];
	categories: EventCategory[];
	viewMode?: CalendarViewMode;
	onViewModeChange?: (mode: CalendarViewMode) => void;
	defaultDate?: Date;
	onDateChange?: (date: Date) => void;
	onEventClick?: (event: CalendarEvent) => void;
	onDayClick?: (date: Date, events: CalendarEvent[]) => void;
	maxEventsPerDay?: number;
	showLegend?: boolean;
	showHeader?: boolean;
	showWeekends?: boolean;
	weekStartsOn?: 0 | 1;
	/** Optional date-fns Locale object passed to inner date pickers. */
	locale?: import('date-fns').Locale;
	enableCategoryFilter?: boolean;
	visibleCategories?: string[];
	onVisibleCategoriesChange?: (categories: string[]) => void;
	isLoading?: boolean;
	emptyStateMessage?: string;
	className?: string;
	compact?: boolean;
	actions?: CalendarActionItem[];
	strings?: Partial<EventCalendarStrings>;
	/** Visual variant for the weekday header strip. Default `default`. */
	dayHeadingVariant?: EventCalendarDayHeadingVariant;
	/** Custom class names appended to each weekday-heading cell — wins over variant presets. */
	dayHeadingClassName?: string;
	/** Optional renderer to fully control a single weekday cell. */
	renderDayHeading?: (day: string, index: number) => ReactNode;

	/**
	 * Header navigation range mode.
	 *  - `date`        — DatePicker (default; jump to a specific date)
	 *  - `month-year`  — MonthYearPicker (compact month/year jump)
	 */
	rangeMode?: EventCalendarRangeMode;

	/** Earliest date the user can navigate to. Earlier nav is disabled. */
	minDate?: Date;
	/** Latest date the user can navigate to. Later nav is disabled. */
	maxDate?: Date;
	/**
	 * Dates that should render in the calendar but be marked as disabled
	 * (greyed out, not clickable). Pass dates, a predicate, or both.
	 */
	disabledDates?: DateRule;
	/**
	 * Hide events from rendering at runtime without mutating `events`.
	 * Returns `true` to KEEP an event, `false` to hide it.
	 */
	filterEvent?: EventFilter;
	/** Per-event renderer override. */
	renderEvent?: RenderEventFn;
	/** Per-day-cell renderer override. */
	renderDayCell?: RenderDayCellFn;
}

/**
 * Day cell props
 */
export interface EventCalendarDayCellProps {
	data: CalendarDayData;
	categories: EventCategory[];
	maxEvents?: number;
	onClick: () => void;
	compact?: boolean;
	strings?: Pick<EventCalendarStrings, 'booking' | 'bookings'>;
	/** Per-event renderer override. */
	renderEvent?: RenderEventFn;
}

/**
 * Event badge props
 */
export interface EventCalendarEventBadgeProps {
	event: CalendarEvent;
	category: EventCategory | undefined;
	compact?: boolean;
	onClick?: () => void;
}

/**
 * Event card props
 */
export interface EventCalendarEventCardProps {
	event: CalendarEvent;
	category: EventCategory | undefined;
	onClick?: () => void;
}

/**
 * Legend props
 */
export interface EventCalendarLegendProps {
	categories: EventCategory[];
	visibleCategories?: string[];
	onToggleCategory?: (categoryId: string) => void;
	enableFiltering?: boolean;
}

/**
 * Header props
 */
export interface EventCalendarHeaderProps {
	currentDate: Date;
	viewMode: CalendarViewMode;
	displayLabel: string;
	onPrevious: () => void;
	onNext: () => void;
	onToday: () => void;
	onViewModeChange?: (mode: CalendarViewMode) => void;
	onDateChange?: (date: Date) => void;
	/** Optional date-fns Locale object passed to inner date pickers. */
	locale?: import('date-fns').Locale;
	actions?: CalendarActionItem[];
	strings?: Pick<EventCalendarStrings, 'today' | 'previous' | 'next' | 'viewMode'>;
	/** Range mode for the date trigger inside the header. */
	rangeMode?: EventCalendarRangeMode;
	minDate?: Date;
	maxDate?: Date;
	prevDisabled?: boolean;
	nextDisabled?: boolean;
}

/**
 * Hook return type
 */
export interface UseEventCalendarReturn {
	currentDate: Date;
	viewMode: CalendarViewMode;
	calendarDays: CalendarDayData[];
	visibleEvents: CalendarEvent[];
	goToToday: () => void;
	goToNextPeriod: () => void;
	goToPreviousPeriod: () => void;
	setDate: (date: Date) => void;
	setViewMode: (mode: CalendarViewMode) => void;
	displayLabel: string;
	hasEvents: boolean;
}

/**
 * Data transformation hook options
 */
export interface UseEventCalendarDataOptions {
	weekStartsOn?: 0 | 1;
	showWeekends?: boolean;
	visibleCategories?: string[];
}
