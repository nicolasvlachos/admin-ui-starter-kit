/**
 * Default user-facing strings for the `features/mentions` partials.
 *
 * Both `<MentionPicker>` and `<MentionInlineSuggestions>` consume their
 * respective slice; `<MentionInlineSuggestions>` is a strict subset.
 * Consumers wire backend i18n at the call site:
 *
 *   <MentionPicker strings={{ empty: t('mentions.empty') }} … />
 */

export interface MentionPickerStrings {
	title: string;
	searchPlaceholder: string;
	empty: string;
	loading: string;
}

export const defaultMentionPickerStrings: MentionPickerStrings = {
	title: 'Insert reference',
	searchPlaceholder: 'Search…',
	empty: 'No matches.',
	loading: 'Searching…',
};

export interface MentionInlineSuggestionsStrings {
	title: string;
	empty: string;
	loading: string;
}

export const defaultMentionInlineSuggestionsStrings: MentionInlineSuggestionsStrings = {
	title: 'Insert reference',
	empty: 'No matches.',
	loading: 'Searching…',
};
