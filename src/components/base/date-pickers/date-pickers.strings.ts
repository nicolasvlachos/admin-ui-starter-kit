/**
 * Default user-facing strings for the date-picker family
 * (`<DatePicker>`, `<DateRangePicker>`, `<MonthYearPicker>`).
 *
 * Library is locale-agnostic — consumers wire backend i18n via the
 * `strings` prop and pass a `Locale` object from `date-fns/locale` (or
 * any equivalent) via the `locale` prop:
 *
 *   import { bg } from 'date-fns/locale';
 *   <DatePicker locale={bg} strings={{ today: t('date.today') }} />
 */
import type { DatePickerTranslations } from './datepicker.types';

export const defaultDatePickerStrings: DatePickerTranslations = {
	selectDate: 'Select a date',
	selectDates: 'Select dates',
	selectDateRange: 'Select date range',
	from: 'From',
	to: 'To',
	confirm: 'Confirm',
	clear: 'Clear',
	today: 'Today',
	startDate: 'Start date',
	endDate: 'End date',
	startTime: 'Start time',
	endTime: 'End time',
	hours: 'Hours',
	minutes: 'Minutes',
	seconds: 'Seconds',
	am: 'AM',
	pm: 'PM',
	minimumDays: (days: number) => `A minimum of ${days} days is required`,
	maximumDays: (days: number) => `A maximum of ${days} days is allowed`,
	maximumDates: (max: number) => `Select up to ${max} dates`,
	datesSelected: (count: number) => `${count} dates selected`,
	lastWeek: 'Last week',
	lastMonth: 'Last month',
	lastYear: 'Last year',
	nextWeek: 'Next week',
	nextMonth: 'Next month',
	nextYear: 'Next year',
	thisWeek: 'This Week',
	thisMonth: 'This Month',
	last30Days: 'Last 30 Days',
	selectMonthYear: 'Select month and year',
	month: 'Month',
	year: 'Year',
};

export type { DatePickerTranslations };
