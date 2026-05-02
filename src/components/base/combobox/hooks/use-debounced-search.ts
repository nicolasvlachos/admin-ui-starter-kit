/**
 * Hook for debounced search functionality
 */

import { useEffect, useRef } from 'react';
import { DEFAULT_DEBOUNCE_MS, DEFAULT_MIN_SEARCH_LENGTH } from '../constants';

export interface UseDebouncedSearchOptions {
	searchValue: string;
	onSearch: ((value: string) => void) | undefined;
	debounceMs?: number;
	minSearchLength?: number;
}

export function useDebouncedSearch({
	searchValue,
	onSearch,
	debounceMs = DEFAULT_DEBOUNCE_MS,
	minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
}: UseDebouncedSearchOptions): void {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!onSearch) return;

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		const trimmed = searchValue.trim();
		if (trimmed.length >= minSearchLength) {
			timeoutRef.current = setTimeout(() => {
				onSearch(trimmed);
			}, debounceMs);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [searchValue, onSearch, debounceMs, minSearchLength]);
}
