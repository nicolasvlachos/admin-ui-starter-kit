/**
 * Event-calendar colour resolution helpers.
 *
 * The canonical token enum (`CalendarColorToken`) and a basic dot-class lookup
 * live in `event-calendar.types.ts`. This module extends that with the richer
 * class sets used by the day cell, event badge, and legend (badge surface,
 * border, filled swatch). Centralising the map here means new tokens (or theme
 * changes) are a one-line update.
 *
 * Legacy `EventCategory.color` strings (e.g. `'border-amber-500'`) are still
 * supported via `resolveCategoryColorToken` (in types.ts), which falls back to
 * substring matching — the same brittle behaviour the old day-cell /
 * event-badge code implemented inline. New code should set
 * `category.colorToken` directly.
 */
import {
	calendarTokenDot,
	resolveCategoryColorToken,
	type CalendarColorToken,
	type EventCategory,
} from './event-calendar.types';

export interface CalendarColorClasses {
	/** Solid dot fill (used as the leading bullet on event chips). */
	dot: string;
	/** Soft tinted surface for the event badge background. */
	badgeBg: string;
	/** Border-tone for the event badge / legend swatch. */
	border: string;
	/** Filled legend swatch (square chip in the legend row). */
	swatch: string;
}

const TOKEN_EXTRAS: Record<CalendarColorToken, Omit<CalendarColorClasses, 'dot'>> = {
	gray: { badgeBg: 'bg-gray-500/10', border: 'border-gray-500/40', swatch: 'bg-gray-500' },
	red: { badgeBg: 'bg-red-500/10', border: 'border-red-500/40', swatch: 'bg-red-500' },
	orange: { badgeBg: 'bg-orange-500/10', border: 'border-orange-500/40', swatch: 'bg-orange-500' },
	amber: { badgeBg: 'bg-amber-500/10', border: 'border-amber-500/40', swatch: 'bg-amber-500' },
	yellow: { badgeBg: 'bg-yellow-500/10', border: 'border-yellow-500/40', swatch: 'bg-yellow-500' },
	green: { badgeBg: 'bg-green-500/10', border: 'border-green-500/40', swatch: 'bg-green-500' },
	blue: { badgeBg: 'bg-blue-500/10', border: 'border-blue-500/40', swatch: 'bg-blue-500' },
	purple: { badgeBg: 'bg-purple-500/10', border: 'border-purple-500/40', swatch: 'bg-purple-500' },
};

/**
 * Resolve a category to its full set of Tailwind colour classes. Prefers an
 * explicit `colorToken`; falls back to legacy `color` parsing.
 */
export function getCalendarColorClasses(
	category: Pick<EventCategory, 'colorToken' | 'color'> | null | undefined,
): CalendarColorClasses {
	const token = resolveCategoryColorToken(category as EventCategory | null | undefined);
	return {
		dot: calendarTokenDot[token],
		...TOKEN_EXTRAS[token],
	};
}

/** Convenience: just the dot class (most common lookup). */
export function getCalendarDotClass(
	category: Pick<EventCategory, 'colorToken' | 'color'> | null | undefined,
): string {
	const token = resolveCategoryColorToken(category as EventCategory | null | undefined);
	return calendarTokenDot[token];
}
