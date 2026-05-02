/**
 * Default user-facing strings for `<EnhancedCombobox>`.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <EnhancedCombobox strings={{ noResults: t('search.empty') }} … />
 *
 * Templates use `{placeholder}` tokens — the component substitutes them at
 * render time. Function-valued strings would also work; we keep templates
 * here for the constants file.
 */
import type { ComboboxStrings } from './types';

export const defaultComboboxStrings: ComboboxStrings = {
	placeholder: 'Search...',
	searching: 'Loading...',
	noResults: 'No results found.',
	typeToSearch: 'Type at least {min} characters to search...',
	typeMore: 'Type {remaining} more character{s} to search...',
	createNew: 'Create {value}',
	loadingMore: 'Loading...',
	apply: 'Apply',
	cancel: 'Cancel',
};

export type { ComboboxStrings };
