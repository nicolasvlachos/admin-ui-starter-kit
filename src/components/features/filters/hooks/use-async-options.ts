/**
 * useAsyncOptions — peer-dep-free async fetcher for filter facets.
 *
 * Replaces the previous `@tanstack/react-query` integration so the feature
 * stays framework-agnostic. Behaviour preserved:
 *   - Debounced search input
 *   - Min-query-length gating with an `isBelowMinQuery` flag
 *   - Optional preload (empty query) with an `enabled` toggle
 *   - AbortController on each new request
 *   - In-memory cache keyed by `(filter.key, query)` to avoid refetching
 *     identical queries within the cache window (`staleTime`)
 *   - `refetch()` for the consumer's retry button
 *
 * Consumers that want react-query semantics can compose `asyncConfig.fetcher`
 * with their own `useQuery` and pass the resulting `FilterOption[]` through
 * a controlled `options` prop on the facet — no integration code needed in
 * this library.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { useFiltersConfig } from '@/lib/ui-provider';

import type { FilterConfig, FilterOption } from '../filters.types';

interface CacheEntry {
    timestamp: number;
    data: FilterOption[];
}

const moduleCache = new Map<string, CacheEntry>();

export interface UseAsyncOptionsResult {
    options: FilterOption[];
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
    isBelowMinQuery: boolean;
    minQueryLength: number;
}

export function useAsyncOptions(
    filter: FilterConfig,
    searchInput: string,
    isActive: boolean,
): UseAsyncOptionsResult {
    const { asyncConfig, fetchOptions } = filter;
    const { debounceMs: configDebounceMs, defaultPageSize } = useFiltersConfig();
    const debounceMs = asyncConfig?.debounceMs ?? filter.delay ?? configDebounceMs ?? 300;
    const debouncedSearch = useDebounce(searchInput, debounceMs);
    const normalisedQuery = (debouncedSearch ?? '').trim();

    const limit = asyncConfig?.limit ?? defaultPageSize ?? 10;
    const minQueryLength = asyncConfig?.minQueryLength ?? 0;
    const preload = asyncConfig?.preload ?? true;
    const staleTime = asyncConfig?.staleTime ?? 60_000;

    const isPreload = normalisedQuery.length === 0 && preload;
    const meetsMinLength = normalisedQuery.length >= minQueryLength;
    const canFetch =
        isActive && (isPreload || (normalisedQuery.length > 0 && meetsMinLength));
    const isBelowMinQuery =
        isActive &&
        !isPreload &&
        normalisedQuery.length > 0 &&
        normalisedQuery.length < minQueryLength;

    const cacheKey = useMemo(() => {
        if (asyncConfig?.queryKey) {
            return JSON.stringify(
                asyncConfig.queryKey({ query: normalisedQuery, limit }),
            );
        }
        return JSON.stringify(['filter', filter.key, normalisedQuery, limit]);
    }, [asyncConfig, filter.key, normalisedQuery, limit]);

    const queryFn = useCallback(
        async (signal: AbortSignal): Promise<FilterOption[]> => {
            if (asyncConfig?.fetcher && asyncConfig.mapToOption) {
                const items = await asyncConfig.fetcher({
                    query: normalisedQuery,
                    limit,
                    signal,
                });
                return items.map(asyncConfig.mapToOption);
            }
            if (fetchOptions) {
                return fetchOptions({ q: [normalisedQuery] });
            }
            return [];
        },
        [asyncConfig, fetchOptions, normalisedQuery, limit],
    );

    const [state, setState] = useState<{
        data: FilterOption[];
        loading: boolean;
        fetching: boolean;
        error: boolean;
    }>(() => {
        const cached = moduleCache.get(cacheKey);
        return {
            data: cached?.data ?? [],
            loading: false,
            fetching: false,
            error: false,
        };
    });

    const [reloadTick, setReloadTick] = useState(0);
    const refetch = useCallback(() => setReloadTick((t) => t + 1), []);

    useEffect(() => {
        if (!canFetch) return;

        const cached = moduleCache.get(cacheKey);
        const isFresh =
            cached !== undefined && Date.now() - cached.timestamp < staleTime;

        const controller = new AbortController();

        if (isFresh && reloadTick === 0) {
            setState({
                data: cached.data,
                loading: false,
                fetching: false,
                error: false,
            });
            return () => controller.abort();
        }

        setState((prev) => ({
            data: cached?.data ?? prev.data,
            loading: cached === undefined,
            fetching: true,
            error: false,
        }));

        let cancelled = false;
        queryFn(controller.signal)
            .then((data) => {
                if (cancelled) return;
                moduleCache.set(cacheKey, { timestamp: Date.now(), data });
                setState({
                    data,
                    loading: false,
                    fetching: false,
                    error: false,
                });
            })
            .catch((err) => {
                if (cancelled || controller.signal.aborted) return;
                if (err && (err as { name?: string }).name === 'AbortError') return;
                setState((prev) => ({
                    data: prev.data,
                    loading: false,
                    fetching: false,
                    error: true,
                }));
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [cacheKey, queryFn, canFetch, staleTime, reloadTick]);

    return {
        options: canFetch ? state.data : [],
        isLoading: canFetch && state.loading,
        isFetching: canFetch && state.fetching,
        isError: canFetch && state.error,
        refetch,
        isBelowMinQuery,
        minQueryLength,
    };
}
