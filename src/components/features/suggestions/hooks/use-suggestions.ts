import { useEffect, useState } from 'react';

import type {
	UseSuggestionsConfig,
	UseSuggestionsResult,
} from '../suggestions.types';

const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * Headless data-fetching state machine for the suggestions feature.
 *
 * Returns the search/selection/open state plus the latest items + loading flag.
 * Consumers that want a different visual layer can build their own UI on top
 * of this hook without touching `<SuggestionsCombobox>`.
 */
export function useSuggestions<T>(
	config: UseSuggestionsConfig<T>,
): UseSuggestionsResult<T> {
	const {
		fetchData,
		minQueryLength = 1,
		debounceMs = 250,
		requestDelay = 0,
		preload = false,
		onError,
	} = config;

	const [items, setItems] = useState<T[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const [selectedValue, setSelectedValue] = useState<T | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		let cancelled = false;
		let timer: ReturnType<typeof setTimeout> | null = null;

		const shouldQuery =
			searchValue.length >= minQueryLength ||
			(preload && searchValue.length === 0);

		if (!shouldQuery) {
			setItems([]);
			return () => {
				if (timer) clearTimeout(timer);
			};
		}

		timer = setTimeout(() => {
			void (async () => {
				setIsLoading(true);
				try {
					if (requestDelay > 0) {
						await wait(requestDelay);
					}

					const result = await fetchData(searchValue);
					if (!cancelled) {
						setItems(Array.isArray(result) ? result : []);
					}
				} catch (error) {
					if (!cancelled) {
						setItems([]);
						onError?.(error, searchValue);
					}
				} finally {
					if (!cancelled) {
						setIsLoading(false);
					}
				}
			})();
		}, debounceMs);

		return () => {
			cancelled = true;
			if (timer) clearTimeout(timer);
		};
	}, [
		debounceMs,
		fetchData,
		minQueryLength,
		onError,
		preload,
		requestDelay,
		searchValue,
	]);

	return {
		items,
		isLoading,
		searchValue,
		setSearchValue,
		selectedValue,
		setSelectedValue,
		open,
		setOpen,
	};
}
