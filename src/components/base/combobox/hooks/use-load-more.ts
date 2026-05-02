/**
 * Hook for infinite scroll / load more functionality
 */

import { useCallback, useEffect, useRef } from 'react';
import {
	LOAD_MORE_THRESHOLD,
	LOAD_MORE_DEBOUNCE_MS,
	LOAD_MORE_COOLDOWN_MS,
} from '../constants';

export interface UseLoadMoreOptions {
	hasMore: boolean | undefined;
	onLoadMore: (() => void) | undefined;
	isLoadingMore: boolean | undefined;
}

export interface UseLoadMoreReturn {
	handleScroll: (event: Event) => void;
}

export function useLoadMore({
	hasMore,
	onLoadMore,
	isLoadingMore,
}: UseLoadMoreOptions): UseLoadMoreReturn {
	const isLoadingRef = useRef(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleScroll = useCallback(
		(event: Event) => {
			if (!hasMore || !onLoadMore || isLoadingMore || isLoadingRef.current) {
				return;
			}

			const target = event.target as HTMLElement;
			const { scrollHeight, scrollTop, clientHeight } = target;
			const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

			if (scrollPercentage >= LOAD_MORE_THRESHOLD) {
				if (debounceRef.current) {
					clearTimeout(debounceRef.current);
				}

				debounceRef.current = setTimeout(() => {
					isLoadingRef.current = true;
					onLoadMore();

					setTimeout(() => {
						isLoadingRef.current = false;
					}, LOAD_MORE_COOLDOWN_MS);
				}, LOAD_MORE_DEBOUNCE_MS);
			}
		},
		[hasMore, onLoadMore, isLoadingMore]
	);

	useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, []);

	return { handleScroll };
}
