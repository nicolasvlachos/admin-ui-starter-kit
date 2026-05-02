/**
 * Shared default strings for repeater-style form fields
 * (`<List>`, `<StringRepeater>`, `<ObjectRepeater>`,
 * `<LocalizedStringRepeater>`, …).
 *
 * Each repeater has its own concrete `Strings` interface — the shared
 * defaults below cover the keys they all share. Per-field strings files
 * spread these defaults into their own constant so consumers can override
 * any subset uniformly.
 */

export interface RepeaterSharedStrings {
	emptyState: string;
	addItem: string;
	removeAriaLabel: string;
}

export const defaultRepeaterStrings: RepeaterSharedStrings = {
	emptyState: 'No items added yet.',
	addItem: 'Add item',
	removeAriaLabel: 'Remove item',
};
