/**
 * Default user-facing strings for `<SuggestionsCombobox>`.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <SuggestionsCombobox strings={{ emptyMessage: t('search.empty') }} … />
 */

export interface SuggestionsStrings {
	placeholder: string;
	emptyMessage: string;
	loadingMessage: string;
	startTypingMessage: string;
}

export const defaultSuggestionsStrings: SuggestionsStrings = {
	placeholder: 'Search...',
	emptyMessage: 'No results found.',
	loadingMessage: 'Searching...',
	startTypingMessage: 'Type to search.',
};
