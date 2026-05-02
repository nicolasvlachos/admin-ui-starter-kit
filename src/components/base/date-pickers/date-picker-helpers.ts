import { format } from 'date-fns';
import type { Locale as DateFnsLocale } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import type {
	DateOutput,
	MultipleDatesOutput,
	DateRangeOutput,
	DatePickerTranslations
} from './datepicker.types';

export type TimePeriod = 'AM' | 'PM';

export interface NormalizedTime {
	hours: number;
	minutes: number;
	seconds: number;
}

export interface DisplayTimeSegments {
	hours: string;
	minutes: string;
	seconds?: string;
	period?: TimePeriod;
}

export interface TimeDisplayLabels {
	am?: string;
	pm?: string;
}

export const HOURS_24_MAX = 23;
export const HOURS_12_MAX = 12;
export const MINUTES_MAX = 59;
export const SECONDS_MAX = 59;

export function padTimeSegment(value: number): string {
	return value.toString().padStart(2, '0');
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function alignSecondsToStep(totalSeconds: number, step: number): number {
	if (step <= 0) {
		return totalSeconds;
	}
	const aligned = Math.floor(totalSeconds / step) * step;
	return Math.max(0, Math.min(aligned, 24 * 60 * 60 - 1));
}

export function parseTimeString(timeString: string | undefined): NormalizedTime | null {
	if (!timeString) {
		return null;
	}
	const parts = timeString.split(':');
	if (parts.length < 2 || parts.length > 3) {
		return null;
	}
	const [hRaw, mRaw, sRaw] = parts;
	const hours = clamp(Number.parseInt(hRaw, 10), 0, HOURS_24_MAX);
	const minutes = clamp(Number.parseInt(mRaw, 10), 0, MINUTES_MAX);
	const seconds = clamp(Number.parseInt(sRaw ?? '0', 10), 0, SECONDS_MAX);
	if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
		return null;
	}
	return { hours, minutes, seconds };
}

export function normalizedTimeToString(time: NormalizedTime, includeSeconds: boolean): string {
	const secondsPart = includeSeconds ? `:${padTimeSegment(time.seconds)}` : '';
	return `${padTimeSegment(time.hours)}:${padTimeSegment(time.minutes)}${secondsPart}`;
}

export function createDefaultNormalizedTime(
	date: Date | undefined,
	includeSeconds: boolean,
	step: number
): NormalizedTime {
	const source = Number.isFinite(date?.getTime?.()) ? (date as Date) : new Date();
	const hours = source.getHours();
	const minutes = source.getMinutes();
	const seconds = includeSeconds ? source.getSeconds() : 0;
	const totalSeconds = hours * 3600 + minutes * 60 + seconds;
	const alignedSeconds = alignSecondsToStep(totalSeconds, step);
	const alignedHours = Math.floor(alignedSeconds / 3600);
	const alignedMinutes = Math.floor((alignedSeconds % 3600) / 60);
	const alignedSecondsRemainder = alignedSeconds % 60;
	return {
		hours: alignedHours,
		minutes: alignedMinutes,
		seconds: includeSeconds ? alignedSecondsRemainder : 0,
	};
}

export function normalizedTimeToDisplaySegments(
	time: NormalizedTime,
	format: '12' | '24',
	includeSeconds: boolean
): DisplayTimeSegments {
	if (format === '12') {
		const period: TimePeriod = time.hours >= 12 ? 'PM' : 'AM';
		let displayHour = time.hours % 12;
		if (displayHour === 0) {
			displayHour = 12;
		}
		return {
			hours: padTimeSegment(displayHour),
			minutes: padTimeSegment(time.minutes),
			seconds: includeSeconds ? padTimeSegment(time.seconds) : undefined,
			period,
		};
	}
	return {
		hours: padTimeSegment(time.hours),
		minutes: padTimeSegment(time.minutes),
		seconds: includeSeconds ? padTimeSegment(time.seconds) : undefined,
	};
}

export function displaySegmentsToNormalizedTime(
	segments: DisplayTimeSegments,
	format: '12' | '24',
	includeSeconds: boolean
): NormalizedTime {
	const parseSegment = (value: string | undefined): number => {
		const numeric = Number.parseInt(value ?? '0', 10);
		return Number.isNaN(numeric) ? 0 : numeric;
	};
	let hours = parseSegment(segments.hours);
	const minutes = clamp(parseSegment(segments.minutes), 0, MINUTES_MAX);
	const seconds = includeSeconds ? clamp(parseSegment(segments.seconds), 0, SECONDS_MAX) : 0;
	if (format === '12') {
		hours = clamp(hours, 1, HOURS_12_MAX);
		const period = segments.period ?? 'AM';
		const isPM = period === 'PM';
		hours = hours % 12;
		if (isPM) {
			hours += 12;
		}
	} else {
		hours = clamp(hours, 0, HOURS_24_MAX);
	}
	return { hours, minutes, seconds };
}

export function alignNormalizedTimeToStep(
	time: NormalizedTime,
	step: number,
	includeSeconds: boolean
): NormalizedTime {
	const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
	const alignedSeconds = alignSecondsToStep(totalSeconds, step);
	const hours = Math.floor(alignedSeconds / 3600);
	const minutes = Math.floor((alignedSeconds % 3600) / 60);
	const seconds = includeSeconds ? alignedSeconds % 60 : 0;
	return { hours, minutes, seconds };
}

export function formatNormalizedTimeForDisplay(
	time: NormalizedTime,
	includeSeconds: boolean,
	format: '12' | '24',
	labels?: TimeDisplayLabels
): string {
	const minutes = padTimeSegment(time.minutes);
	const secondsPart = includeSeconds ? `:${padTimeSegment(time.seconds)}` : '';
	if (format === '24') {
		return `${padTimeSegment(time.hours)}:${minutes}${secondsPart}`;
	}
	const period: TimePeriod = time.hours >= 12 ? 'PM' : 'AM';
	let displayHour = time.hours % 12;
	if (displayHour === 0) {
		displayHour = 12;
	}
	const periodLabel = period === 'AM' ? labels?.am ?? 'AM' : labels?.pm ?? 'PM';
	return `${padTimeSegment(displayHour)}:${minutes}${secondsPart} ${periodLabel}`;
}

const QUOTED_TEXT_REGEX = /'[^']*'/g;
const TIME_TOKEN_REGEX = /[HKhk]|\bp\b|\bt\b|\ba\b/;

export function readableFormatIncludesTime(format: string | undefined): boolean {
	if (!format) {
		return false;
	}
	const sanitized = format.replace(QUOTED_TEXT_REGEX, '');
	return TIME_TOKEN_REGEX.test(sanitized);
}

/**
 * Create date output object with formatted strings
 */
export function createDateOutput(
	date: Date | undefined,
	dateFormat: string,
	readableFormat: string,
	locale?: DateFnsLocale
): DateOutput {
	const options = locale ? { locale } : undefined;
	return {
		date,
		formatted: date ? format(date, dateFormat, options) : undefined,
		readable: date ? format(date, readableFormat, options) : undefined,
	};
}

/**
 * Create multiple dates output object with formatted strings
 */
export function createMultipleDatesOutput(
	dates: Date[],
	dateFormat: string,
	readableFormat: string,
	locale?: DateFnsLocale
): MultipleDatesOutput {
	const options = locale ? { locale } : undefined;
	return {
		dates,
		formatted: dates.map(d => format(d, dateFormat, options)),
		readable: dates.map(d => format(d, readableFormat, options)),
	};
}

/**
 * Create date range output object with formatted strings
 */
export function createDateRangeOutput(
	range: DateRange | undefined,
	dateFormat: string,
	readableFormat: string,
	locale?: DateFnsLocale
): DateRangeOutput {
	const options = locale ? { locale } : undefined;
	return {
		range,
		formatted: {
			from: range?.from ? format(range.from, dateFormat, options) : undefined,
			to: range?.to ? format(range.to, dateFormat, options) : undefined,
		},
		readable: {
			from: range?.from ? format(range.from, readableFormat, options) : undefined,
			to: range?.to ? format(range.to, readableFormat, options) : undefined,
		},
	};
}

/**
 * Apply time to a date
 */
export function applyTimeToDate(date: Date, time: string | NormalizedTime): Date {
	const normalized = typeof time === 'string' ? parseTimeString(time) : time;
	const newDate = new Date(date);
	if (!Number.isFinite(newDate.getTime()) || !normalized) {
		return new Date(NaN);
	}
	newDate.setHours(normalized.hours, normalized.minutes, normalized.seconds, 0);
	return newDate;
}

/**
 * Apply time to date range
 */
export function applyTimeToRange(
	range: DateRange,
	startTime: string | NormalizedTime,
	endTime: string | NormalizedTime
): DateRange {
	let finalRange = range;

	if (range.from) {
		finalRange = { ...finalRange, from: applyTimeToDate(range.from, startTime) };
	}

	if (range.to && finalRange) {
		finalRange = { ...finalRange, to: applyTimeToDate(range.to, endTime) };
	}

	return finalRange;
}

/**
 * Calculate days difference between two dates
 */
export function calculateDaysDifference(from: Date, to: Date): number {
	return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Validate date range constraints
 */
export function validateDateRange(
	range: DateRange | undefined,
	min?: number,
	max?: number
): { isValid: boolean; daysDiff?: number } {
	if (!range?.from || !range?.to) {
		return { isValid: true };
	}

	const daysDiff = calculateDaysDifference(range.from, range.to);

	if (min && daysDiff < min) {
		return { isValid: false, daysDiff };
	}

	if (max && daysDiff > max) {
		return { isValid: false, daysDiff };
	}

	return { isValid: true, daysDiff };
}

/**
 * Get validation message for date range
 */
export function getRangeValidationMessage(
	range: DateRange | undefined,
	min: number | undefined,
	max: number | undefined,
	translations: DatePickerTranslations
): string | null {
	if (!range?.from || !range?.to) return null;

	const daysDiff = calculateDaysDifference(range.from, range.to);

	if (min && daysDiff < min) {
		return translations.minimumDays(min);
	}

	if (max && daysDiff > max) {
		return translations.maximumDays(max);
	}

	return null;
}

/**
 * Get validation message for multiple dates
 */
export function getMultipleDatesValidationMessage(
	dates: Date[],
	min: number | undefined,
	max: number | undefined,
	required: boolean | undefined,
	translations: DatePickerTranslations
): string | null {
	if (required && dates.length === 0) {
		return 'At least one date must be selected';
	}

	if (min && dates.length < min) {
		return `Select at least ${min} dates`;
	}

	if (max) {
		return translations.maximumDates(max);
	}

	return null;
}

/**
 * Format button text for single date
 */
export function formatDateButtonText(
	date: Date | undefined,
	readableFormat: string,
	placeholder: string | undefined,
	defaultPlaceholder: string,
	time?: string,
	locale?: DateFnsLocale
): string {
	if (date) {
		const options = locale ? { locale } : undefined;
		let text = format(date, readableFormat, options);
		if (time) {
			text += ` ${time}`;
		}
		return text;
	}
	return placeholder ?? defaultPlaceholder;
}

/**
 * Format button text for multiple dates
 */
export function formatMultipleDatesButtonText(
	dates: Date[],
	readableFormat: string,
	placeholder: string | undefined,
	defaultPlaceholder: string,
	translations: DatePickerTranslations,
	locale?: DateFnsLocale
): string {
	if (dates.length > 0) {
		if (dates.length === 1) {
			const options = locale ? { locale } : undefined;
			return format(dates[0], readableFormat, options);
		}
		return translations.datesSelected(dates.length);
	}
	return placeholder ?? defaultPlaceholder;
}

/**
 * Format button text for date range
 */
export function formatRangeButtonText(
	range: DateRange | undefined,
	readableFormat: string,
	placeholder: string | undefined,
	defaultPlaceholder: string,
	locale?: DateFnsLocale
): string {
	if (range?.from) {
		const options = locale ? { locale } : undefined;
		if (range.to) {
			return `${format(range.from, readableFormat, options)} - ${format(range.to, readableFormat, options)}`;
		}
		return format(range.from, readableFormat, options);
	}
	return placeholder ?? defaultPlaceholder;
}
