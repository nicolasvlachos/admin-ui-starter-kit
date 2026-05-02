// Main unified component
export { DatePicker } from './date-picker';

// Legacy components (for backward compatibility)
export { DateRangePicker } from './date-range-picker';

// Month/Year picker
export { MonthYearPicker } from './month-year-picker';

// Types
export type {
	// Base types
	DatePickerProps,
	DatepickerProps,
	MultipleDatepickerProps,
	DateRangePickerProps,
	MonthYearPickerProps,
	DatePickerTranslations,

	// Output types
	DateOutput,
	MultipleDatesOutput,
	DateRangeOutput,
	MonthYearOutput,
	FormattedDateRange,

	// Configuration types
	TimeConfig,
	PresetDateRange,
	DatePickerHeader,
	DatePickerFooter,
	DatePickerFooterAction,
	YearSelectionConfig
} from './datepicker.types';

// Default strings — consumers wire their backend i18n via the `strings` /
// `translations` prop, deep-merged over these defaults.
export {
	defaultDatePickerStrings,
	type DatePickerTranslations as DatePickerStrings,
} from './date-pickers.strings';
// Back-compat alias for the older name; prefer `defaultDatePickerStrings`.
export { defaultDatePickerStrings as defaultDatePickerTranslations } from './date-pickers.strings';

// Helper exports for advanced usage
export { SegmentedTimeInput } from './segmented-time-input';
export { DatePickerHeader as DatePickerHeaderComponent } from './date-picker-header';
export { DatePickerFooter as DatePickerFooterComponent } from './date-picker-footer';
