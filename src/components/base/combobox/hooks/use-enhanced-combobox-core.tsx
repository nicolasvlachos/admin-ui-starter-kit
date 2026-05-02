/**
 * Core hook for Enhanced Combobox components
 *
 * Extracts shared logic between single and multiple selection variants
 * to reduce duplication and ensure consistent behavior.
 */

import { PlusIcon } from 'lucide-react';
import * as React from 'react';
import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';

import { HighlightedText } from '../components/highlighted-text';
import { defaultComboboxStrings } from '../combobox.strings';
import {
	DEFAULT_MIN_SEARCH_LENGTH,
	DEFAULT_DEBOUNCE_MS,
	isCreateOption,
	getCreateOptionValue,
	createCreateOption,
} from '../constants';
import type { ComboboxStrings, BaseComboboxProps } from '../types';
import { useDebouncedSearch } from './use-debounced-search';
import { useGroupedItems } from './use-grouped-items';
import { useLoadMore } from './use-load-more';

// ============================================================================
// Types
// ============================================================================

export interface UseEnhancedComboboxCoreOptions<T> extends BaseComboboxProps<T> {
	/** Items that should always be included (selected items) */
	ensuredItems?: T[];
}

export interface UseEnhancedComboboxCoreReturn<T> {
	// Resolved values
	strings: ComboboxStrings;
	getKey: (item: T) => string;
	trimmedSearch: string;

	// Refs
	listRef: React.RefObject<HTMLDivElement | null>;

	// Items
	baseItems: T[];
	allItems: T[];
	groupedItems: Map<string, T[]> | null;
	createOptionItem: T | null;

	// Display state
	showStatus: boolean;
	showEmpty: boolean;
	showCreateOption: boolean;

	// Handlers
	renderItemContent: (item: T) => React.ReactNode;
	itemToStringLabel: (item: T) => string;
	getItemReactKey: (item: T) => string;

	// Scroll handling
	handleScroll: (event: Event) => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

function useComboboxStrings(custom?: StringsProp<ComboboxStrings>): ComboboxStrings {
	return useStrings(defaultComboboxStrings, custom);
}

function hasExactMatch<T>(
	items: T[],
	searchValue: string,
	getItemLabel: (item: T) => string
): boolean {
	const normalizedSearch = searchValue.toLowerCase();
	return items.some(
		(item) => getItemLabel(item).toLowerCase() === normalizedSearch
	);
}

export function useEnhancedComboboxCore<T>({
	// Core props
	items,
	searchValue,
	getItemLabel,
	getItemKey,
	isLoading = false,
	minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
	strings: stringsProp,
	renderItem,

	// Debounced Search
	onSearch,
	debounceMs = DEFAULT_DEBOUNCE_MS,

	// Creatable
	creatable,
	onCreate,

	// Grouped Items
	getItemGroup,

	// Load More
	hasMore,
	onLoadMore,
	isLoadingMore,

	// Highlight Match
	highlightMatch,

		// Ensured items (selected items that should always be included)
	ensuredItems = [],
}: UseEnhancedComboboxCoreOptions<T>): UseEnhancedComboboxCoreReturn<T> {
	// -------------------------------------------------------------------------
	// Setup
	// -------------------------------------------------------------------------

	const strings = useComboboxStrings(stringsProp);
	const getKey = getItemKey ?? getItemLabel;
	const listRef = useRef<HTMLDivElement | null>(null);
	const trimmedSearch = searchValue.trim();

	// -------------------------------------------------------------------------
	// Hooks
	// -------------------------------------------------------------------------

	useDebouncedSearch({
		searchValue,
		onSearch,
		debounceMs,
		minSearchLength,
	});

	const { handleScroll } = useLoadMore({
		hasMore,
		onLoadMore,
		isLoadingMore,
	});

	// Attach scroll listener
	useEffect(() => {
		const listEl = listRef.current;
		if (!listEl || !hasMore || !onLoadMore) return;

		listEl.addEventListener('scroll', handleScroll);
		return () => listEl.removeEventListener('scroll', handleScroll);
	}, [handleScroll, hasMore, onLoadMore]);

	// -------------------------------------------------------------------------
	// Computed Values
	// -------------------------------------------------------------------------

	// Merge ensured items with fetched items
	const baseItems = useMemo(() => {
		if (ensuredItems.length === 0) return items;

		const merged = [...ensuredItems];
		items.forEach((item) => {
			const itemKey = getKey(item);
			if (!ensuredItems.some((ensured) => getKey(ensured) === itemKey)) {
				merged.push(item);
			}
		});
		return merged;
	}, [items, ensuredItems, getKey]);

	// Group items if grouping is enabled
	const groupedItems = useGroupedItems({
		items: baseItems,
		getItemGroup,
	});

	// Determine if create option should be shown
	const showCreateOption = useMemo(() => {
		if (!creatable || !onCreate) return false;
		if (trimmedSearch.length < minSearchLength) return false;
		return !hasExactMatch(baseItems, trimmedSearch, getItemLabel);
	}, [creatable, onCreate, trimmedSearch, minSearchLength, baseItems, getItemLabel]);

	const createOptionItem = useMemo(() => {
		if (!showCreateOption) return null;
		return createCreateOption<T>(trimmedSearch);
	}, [showCreateOption, trimmedSearch]);

	// Build final items array with create option
	const allItems = useMemo(() => {
		if (createOptionItem) return [...baseItems, createOptionItem];
		return baseItems;
	}, [baseItems, createOptionItem]);

	// Status display conditions
	const showStatus = isLoading || trimmedSearch.length < minSearchLength;
	const showEmpty =
		!isLoading &&
		trimmedSearch.length >= minSearchLength &&
		items.length === 0 &&
		!showCreateOption;

	// -------------------------------------------------------------------------
	// Handlers
	// -------------------------------------------------------------------------

	const renderItemContent = useCallback(
		(item: T): React.ReactNode => {
			// Handle create option
			if (isCreateOption(item)) {
				const value = getCreateOptionValue(item);
				return (
					<span className="flex items-center gap-2">
						<PlusIcon className="size-4" />
						{strings.createNew.includes('{value}') ? (
							strings.createNew.replace('{value}', value)
						) : (
							<span className="inline-flex items-center gap-1">
								<span>{strings.createNew}</span>
								<Text tag="span" weight="medium">{value}</Text>
							</span>
						)}
					</span>
				);
			}

			// Custom renderer takes precedence
			if (renderItem) {
				return renderItem(item);
			}

			// Default rendering with optional highlighting
			const label = getItemLabel(item);
			if (highlightMatch && trimmedSearch) {
				return <HighlightedText text={label} highlight={trimmedSearch} />;
			}
			return label;
		},
		[strings.createNew, renderItem, getItemLabel, highlightMatch, trimmedSearch]
	);

	const itemToStringLabel = useCallback(
		(item: T): string => {
			if (isCreateOption(item)) {
				return getCreateOptionValue(item);
			}
			return getItemLabel(item);
		},
		[getItemLabel]
	);

	const getItemReactKey = useCallback(
		(item: T): string => {
			if (isCreateOption(item)) return `__create__:${getCreateOptionValue(item)}`;
			return String(getKey(item));
		},
		[getKey]
	);

	return {
		strings,
		getKey,
		trimmedSearch,
		listRef,
		baseItems,
		allItems,
		groupedItems,
		createOptionItem,
		showStatus,
		showEmpty,
		showCreateOption,
		renderItemContent,
		itemToStringLabel,
		getItemReactKey,
		handleScroll,
	};
}
