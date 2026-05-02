/**
 * Type definitions for the Enhanced Combobox component
 */

import type * as React from 'react';

// ============================================================================
// Size Types
// ============================================================================

export type ComboboxSize = 'sm' | 'md' | 'lg';

// ============================================================================
// String Customization
// ============================================================================

export type ComboboxStrings = {
	placeholder: string;
	searching: string;
	noResults: string;
	typeToSearch: string;
	typeMore: string;
	createNew: string;
	loadingMore: string;
	apply: string;
	cancel: string;
};

// ============================================================================
// Base Props (Shared between Single and Multiple)
// ============================================================================

export type BaseComboboxProps<T> = {
	items: T[];
	searchValue: string;
	onSearchValueChange: (value: string) => void;
	getItemLabel: (item: T) => string;
	getItemKey?: (item: T) => string;
	isLoading?: boolean;
	minSearchLength?: number;
	strings?: Partial<ComboboxStrings>;
	disabled?: boolean;
	className?: string;
	renderItem?: (item: T) => React.ReactNode;
	portalContainer?: React.RefObject<HTMLElement | null>;

	// Form Integration
	name?: string;
	error?: string;
	required?: boolean;
	onBlur?: () => void;

	// Debounced Search
	onSearch?: (value: string) => void;
	debounceMs?: number;

	// Creatable
	creatable?: boolean;
	onCreate?: (inputValue: string) => void;

	// Grouped Items
	getItemGroup?: (item: T) => string;
	renderGroupLabel?: (group: string) => React.ReactNode;

	// Load More
	hasMore?: boolean;
	onLoadMore?: () => void;
	isLoadingMore?: boolean;

	// Disable individual items
	getItemDisabled?: (item: T) => boolean;

	// Highlight Match
	highlightMatch?: boolean;

	// Size
	size?: ComboboxSize;

	// Controlled Open
	open?: boolean;
	onOpenChange?: (open: boolean) => void;

	// Behaviour API
	/**
	 * Whether the dropdown should close after selecting an item.
	 * Default: `true` for single, `false` for multiple.
	 */
	closeOnSelect?: boolean;
	/**
	 * Render an "Apply" / "Cancel" footer instead of committing each
	 * selection immediately. Only meaningful for multi-select. The
	 * working selection lives internally as a draft until `onApply`
	 * commits it to the controlled value.
	 */
	applyButton?: boolean;
	/** Fired when the user clicks Apply (or presses Enter on apply). */
	onApply?: () => void;
	/** Fired when the user clicks Cancel (closes without committing). */
	onCancel?: () => void;
};

// ============================================================================
// Single Selection Props
// ============================================================================

export type EnhancedComboboxProps<T> = BaseComboboxProps<T> & {
	selectedValue: T | null;
	onSelectedValueChange: (value: T | null) => void;
};

// ============================================================================
// Multiple Selection Props
// ============================================================================

export type EnhancedComboboxMultipleProps<T> = BaseComboboxProps<T> & {
	selectedValues: T[];
	onSelectedValuesChange: (values: T[]) => void;
};

// ============================================================================
// Legacy Aliases
// ============================================================================

/** @deprecated Use EnhancedComboboxProps instead */
export type ApiComboboxProps<T> = EnhancedComboboxProps<T>;

/** @deprecated Use EnhancedComboboxMultipleProps instead */
export type ApiComboboxMultipleProps<T> = EnhancedComboboxMultipleProps<T>;
