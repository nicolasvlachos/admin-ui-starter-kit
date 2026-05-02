/**
 * Constants and default values for the Enhanced Combobox component.
 *
 * Default strings live in `./combobox.strings.ts` per rule 19. The legacy
 * `DEFAULT_STRINGS` alias is re-exported below for any external consumer
 * still using the old name; new code should import `defaultComboboxStrings`
 * from `./combobox.strings`.
 */

export { defaultComboboxStrings, defaultComboboxStrings as DEFAULT_STRINGS } from './combobox.strings';

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_MIN_SEARCH_LENGTH = 3;
export const DEFAULT_DEBOUNCE_MS = 300;
export const DEFAULT_SIZE = 'sm';
export const LOAD_MORE_THRESHOLD = 0.8;
export const LOAD_MORE_DEBOUNCE_MS = 100;
export const LOAD_MORE_COOLDOWN_MS = 500;

// ============================================================================
// Symbols
// ============================================================================

export const CREATE_OPTION_SYMBOL = Symbol('enhanced-combobox-create-option');

// ============================================================================
// Type Guards
// ============================================================================

export function isCreateOption<T>(item: T): item is T & { [CREATE_OPTION_SYMBOL]: string } {
	return (
		typeof item === 'object' &&
		item !== null &&
		CREATE_OPTION_SYMBOL in (item as object)
	);
}

export function getCreateOptionValue<T>(item: T): string {
	if (!isCreateOption(item)) {
		throw new Error('Item is not a create option');
	}
	return (item as { [CREATE_OPTION_SYMBOL]: string })[CREATE_OPTION_SYMBOL];
}

export function createCreateOption<T>(inputValue: string): T {
	return { [CREATE_OPTION_SYMBOL]: inputValue } as unknown as T;
}
