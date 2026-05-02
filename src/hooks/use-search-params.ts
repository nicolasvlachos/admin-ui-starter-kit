/**
 * useSearchParams — framework-agnostic URL query-string state hook.
 * Mirrors the React Router useSearchParams shape but depends on no router:
 * reads from `window.location.search`, writes via `window.history.pushState`,
 * and listens for `popstate` so the back/forward buttons stay in sync.
 *
 * Use anywhere a component needs to drive part of the URL without owning the
 * routing layer. SSR-safe initialiser (returns an empty URLSearchParams when
 * `window` is undefined).
 */
import { useState, useCallback, useEffect } from 'react';

type SetSearchParamsFunction = (
	nextInit:
		| URLSearchParams
		| ((prev: URLSearchParams) => URLSearchParams)
		| Record<string, string | number | boolean | null | undefined>
		| string,
) => void;
const useSearchParams = (): [URLSearchParams, SetSearchParamsFunction] => {
	// Initialize with current URL search params
	const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
		if (typeof window === 'undefined') {
			return new URLSearchParams();
		}
		return new URLSearchParams(window.location.search);
	});

	// Function to update URL and state when search params change
	const updateSearchParams: SetSearchParamsFunction = useCallback((nextInit) => {
		let nextSearchParams: URLSearchParams;

		if (typeof nextInit === 'function') {
			// If a function is provided, call it with the current search params
			nextSearchParams = nextInit(searchParams);
		} else if (nextInit instanceof URLSearchParams) {
			// If URLSearchParams object is provided, use it directly
			nextSearchParams = nextInit;
		} else if (typeof nextInit === 'string') {
			// If a string is provided, create a new URLSearchParams from it
			nextSearchParams = new URLSearchParams(nextInit);
		} else if (nextInit && typeof nextInit === 'object') {
			// If an object is provided, convert it to URLSearchParams
			nextSearchParams = new URLSearchParams();

			// Iterate through the object and set each key-value pair
			Object.entries(nextInit).forEach(([key, value]) => {
				if (value === undefined || value === null) {
					nextSearchParams.delete(key);
				} else {
					nextSearchParams.set(key, String(value));
				}
			});
		} else {
			// Default to empty URLSearchParams
			nextSearchParams = new URLSearchParams();
		}

		// Update the URL
		const newUrl = new URL(window.location.href);
		const searchString = nextSearchParams.toString();

		// Replace current search with new one
		newUrl.search = searchString ? `?${searchString}` : '';

		// Update browser history without full navigation
		window.history.pushState({}, '', newUrl.toString());

		// Update state
		setSearchParams(nextSearchParams);
	}, [searchParams]);

	// Sync searchParams with URL when back/forward buttons are used
	useEffect(() => {
		const handlePopState = () => {
			setSearchParams(new URLSearchParams(window.location.search));
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, []);

	return [searchParams, updateSearchParams];
};

export default useSearchParams;