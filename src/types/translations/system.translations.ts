/**
 * Translation key shapes consumed by the `features/filters` and other
 * shared subsystems. Production apps populate these from a backend bundle
 * shipped via Inertia shared props; in the showcase the `useTranslations`
 * hook falls back to `defaultValue` so missing keys are harmless.
 *
 * Keep these as plain string-typed records — they describe the *expected*
 * shape, not a literal source of strings.
 */

type StringRecord = Record<string, string>;

export interface SystemSharedFiltersI18N {
	operators: {
		equals: string;
		contains: string;
		not_contains: string;
		not: string;
		in: string;
		not_in: string;
		before: string;
		after: string;
		between: string;
		gt: string;
		lt: string;
		gte: string;
		lte: string;
		is: string;
		is_not: string;
		has: string;
		has_any: string;
		has_all: string;
	};
}

export interface SystemSharedActionsI18N {
	save: string;
	cancel: string;
	delete: string;
	edit: string;
	confirm: string;
	close: string;
	[key: string]: string;
}

export interface SystemSharedMessagesI18N extends StringRecord {}
export interface SystemSharedStatesI18N extends StringRecord {}
export interface SystemSharedStatusesI18N extends StringRecord {}
