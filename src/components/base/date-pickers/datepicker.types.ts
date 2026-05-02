import type { LucideIcon } from 'lucide-react';
import type { DateRange, PropsSingle, PropsRange, PropsMulti, Locale } from 'react-day-picker';

import type { StringsProp } from '@/lib/strings';

// Header configuration for date pickers
export interface DatePickerHeader {
	title: string;
	description?: string;
	icon?: LucideIcon;
	align?: 'left' | 'center';
}

// Footer action button
export interface DatePickerFooterAction {
	label: string;
	onClick: (output: DateOutput | DateRangeOutput | MultipleDatesOutput) => void;
	variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
	disabled?: boolean | ((output: DateOutput | DateRangeOutput | MultipleDatesOutput) => boolean);
	loading?: boolean;
}

// Footer configuration for date pickers
export interface DatePickerFooter {
	// Custom text (overrides or supplements auto-generated summary)
	text?: string | ((output: DateOutput | DateRangeOutput | MultipleDatesOutput) => string | undefined);
	// Custom action buttons
	actions?: DatePickerFooterAction[];
	// Show footer only when date(s) are selected
	showOnlyWhenSelected?: boolean;
	// Always show auto-generated summary alongside custom text
	showSummary?: boolean;
}

// Year selection configuration
export interface YearSelectionConfig {
	enabled: boolean;
	fromYear?: number;
	toYear?: number;
}

// Translation key interface - implementations should provide actual translations
export interface DatePickerTranslations {
	selectDate: string;
	selectDates: string;
	selectDateRange: string;
	from: string;
	to: string;
	confirm: string;
	clear: string;
	today: string;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	hours: string;
	minutes: string;
	seconds: string;
	am: string;
	pm: string;
	minimumDays: (days: number) => string;
	maximumDays: (days: number) => string;
	maximumDates: (max: number) => string;
	datesSelected: (count: number) => string;
	lastWeek: string;
	lastMonth: string;
	lastYear: string;
	nextWeek: string;
	nextMonth: string;
	nextYear: string;
	thisWeek: string;
	thisMonth: string;
	last30Days: string;
	selectMonthYear: string;
	month: string;
	year: string;
}

// Default strings live in `./date-pickers.strings`. Re-export for back-compat.
export { defaultDatePickerStrings as defaultDatePickerTranslations } from './date-pickers.strings';

// Base props shared by all date pickers
export interface DatepickerBaseProps {
	label?: string;
	hint?: string;
	error?: string;
	disabled?: boolean;
	className?: string;

	// Locale and translations.
	// `locale` accepts a date-fns `Locale` object — consumers pass their
	// chosen locale directly (e.g. `import { bg } from 'date-fns/locale'`).
	// `translations` / `strings` deep-merge over `defaultDatePickerStrings`.
	translations?: StringsProp<DatePickerTranslations>;
	strings?: StringsProp<DatePickerTranslations>;
	locale?: Locale;

	// UI enhancements
	header?: DatePickerHeader; // Optional header with title/description
	footer?: DatePickerFooter; // Optional footer with text/actions
	modal?: boolean; // When rendered inside modal/drawer to avoid focus traps

	// Year selection
	enableYearDropdown?: boolean; // Quick enable for year dropdown (sets captionLayout="dropdown")
	yearSelection?: YearSelectionConfig; // Advanced year selection config

	// Display options
	numberOfMonths?: number;
	showOutsideDays?: boolean;
	buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

// Date output format for single date
export interface DateOutput {
	date: Date | undefined;
	formatted: string | undefined;
	readable: string | undefined;
}

// Month/Year output format
export interface MonthYearOutput {
	month: number; // 0-11 (January = 0)
	year: number;
	formatted: string; // e.g., "2025-01" or custom format
	readable: string; // e.g., "January 2025"
	date: Date; // First day of the selected month
}

// Date output format for multiple dates
export interface MultipleDatesOutput {
	dates: Date[];
	formatted: string[];
	readable: string[];
}

// Range output format
export interface DateRangeOutput {
	range: DateRange | undefined;
	formatted: FormattedDateRange;
	readable: {
		from: string | undefined;
		to: string | undefined;
	};
}

// Formatted range type
export type FormattedDateRange = {
	from: string | undefined;
	to: string | undefined;
};

// Time configuration
export interface TimeConfig {
	enabled: boolean;
	format?: '12' | '24'; // Default: '24'
	step?: number; // Step in seconds, default: 60
	showSeconds?: boolean; // Explicitly show seconds, default: false
	showTimeInButton?: boolean; // Append time next to formatted date text, default auto
	showTimeInSummary?: boolean; // Append time in summary footer, default auto
}

// Preset date ranges
export interface PresetDateRange {
	label: string;
	getValue: () => DateRange;
}

// Single date picker props
export interface DatepickerProps extends DatepickerBaseProps {
	mode?: 'single';
	value?: Date;
	defaultValue?: Date;
	onChange?: (output: DateOutput) => void;
	format?: string; // Default: 'yyyy-MM-dd'
	readableFormat?: string; // Default: 'PPP'
	placeholder?: string;
	closeOnSelect?: boolean; // Default: true
	withTime?: TimeConfig;
	disabledDates?: Date[] | ((date: Date) => boolean);
	calendarProps?: Omit<PropsSingle, 'mode' | 'selected' | 'onSelect'>;
}

// Multiple dates picker props
export interface MultipleDatepickerProps extends DatepickerBaseProps {
	mode: 'multiple';
	value?: Date[];
	defaultValue?: Date[];
	onChange?: (output: MultipleDatesOutput) => void;
	format?: string; // Default: 'yyyy-MM-dd'
	readableFormat?: string; // Default: 'PPP'
	placeholder?: string;
	closeOnSelect?: boolean; // Default: false
	min?: number; // Minimum dates to select
	max?: number; // Maximum dates to select
	required?: boolean; // Whether at least one date must be selected
	disabledDates?: Date[] | ((date: Date) => boolean);
	calendarProps?: Omit<PropsMulti, 'mode' | 'selected' | 'onSelect'>;
}

// Range picker specific props
export interface DateRangePickerProps extends DatepickerBaseProps {
	mode?: 'range';
	value?: DateRange;
	defaultValue?: DateRange;
	onChange?: (output: DateRangeOutput) => void;
	format?: string; // Default: 'yyyy-MM-dd'
	readableFormat?: string; // Default: 'PPP'
	placeholder?: string;
	withConfirm?: boolean;
	min?: number; // Minimum days required
	max?: number; // Maximum days allowed
	closeOnSelect?: boolean; // Default: true when not using confirm
	withTime?: TimeConfig;
	presets?: PresetDateRange[];
	disabledDates?: Date[] | ((date: Date) => boolean);
	calendarProps?: Omit<PropsRange, 'mode' | 'selected' | 'onSelect'>;
}

// Month/Year picker props
export interface MonthYearPickerProps extends DatepickerBaseProps {
	value?: { month: number; year: number };
	defaultValue?: { month: number; year: number };
	onChange?: (output: MonthYearOutput) => void;
	format?: string; // Default: 'yyyy-MM'
	readableFormat?: string; // Default: 'MMMM yyyy'
	placeholder?: string;
	closeOnSelect?: boolean; // Default: true
	fromYear?: number; // Default: current year - 100
	toYear?: number; // Default: current year + 10
}

// Union type for all date picker props
export type DatePickerProps = DatepickerProps | MultipleDatepickerProps | DateRangePickerProps;
