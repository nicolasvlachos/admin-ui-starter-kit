/**
 * Enhanced Combobox Module
 *
 * A feature-rich, API-driven combobox component built on Base UI with shadcn styling.
 * This version reduces duplication through shared hooks and components.
 */

// ============================================================================
// Main Components
// ============================================================================

export {
	EnhancedCombobox,
	EnhancedComboboxMultiple,
	ApiCombobox,
	ApiComboboxMultiple,
} from './enhanced-combobox';

// ============================================================================
// Types
// ============================================================================

export type {
	ComboboxSize,
	ComboboxStrings,
	BaseComboboxProps,
	EnhancedComboboxProps,
	EnhancedComboboxMultipleProps,
	ApiComboboxProps,
	ApiComboboxMultipleProps,
} from './types';

// ============================================================================
// Constants
// ============================================================================

export {
	defaultComboboxStrings,
	// `DEFAULT_STRINGS` is the legacy alias — prefer `defaultComboboxStrings`.
	DEFAULT_STRINGS,
	DEFAULT_MIN_SEARCH_LENGTH,
	DEFAULT_DEBOUNCE_MS,
	DEFAULT_SIZE,
	LOAD_MORE_THRESHOLD,
	LOAD_MORE_DEBOUNCE_MS,
	LOAD_MORE_COOLDOWN_MS,
	CREATE_OPTION_SYMBOL,
	isCreateOption,
	getCreateOptionValue,
	createCreateOption,
} from './constants';

// ============================================================================
// Hooks (for custom implementations)
// ============================================================================

export {
	useDebouncedSearch,
	useLoadMore,
	useGroupedItems,
	useEnhancedComboboxCore,
} from './hooks';

export type {
	UseDebouncedSearchOptions,
	UseLoadMoreOptions,
	UseLoadMoreReturn,
	UseGroupedItemsOptions,
	GroupedItemsResult,
	UseEnhancedComboboxCoreOptions,
	UseEnhancedComboboxCoreReturn,
} from './hooks';

// ============================================================================
// Sub-components (for custom implementations)
// ============================================================================

export {
	HighlightedText,
	StatusContent,
	ErrorMessage,
	LoadingMore,
	ComboboxDropdown,
} from './components';

export type {
	HighlightedTextProps,
	StatusContentProps,
	ErrorMessageProps,
	LoadingMoreProps,
	ComboboxDropdownProps,
} from './components';

// ============================================================================
// Base UI Components (re-exported for custom implementations)
// ============================================================================

export {
	Combobox,
	ComboboxInput,
	ComboboxInputTrigger,
	ComboboxTrigger,
	ComboboxValue,
	ComboboxClear,
	ComboboxPortal,
	ComboboxPositioner,
	ComboboxPopup,
	ComboboxList,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxEmpty,
	ComboboxStatus,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxCollection,
	ComboboxSeparator,
	ComboboxChips,
	ComboboxChip,
	ComboboxChipsInput,
	ComboboxBackdrop,
	ComboboxArrow,
	useComboboxFilter,
} from '@/components/ui/combobox';
