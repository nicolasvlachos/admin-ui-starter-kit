/**
 * useFilterGroups — headless partitioning of the filter list into the four
 * groups `FilterLayout` (and any custom layout) renders distinctly:
 *
 *  - `searchFilters`           — `FilterType.SEARCH`, always inline
 *  - `alwaysVisibleFilters`    — `displayConfig.display === 'always'` and inactive
 *  - `activeRegularFilters`    — non-search filters that are currently active
 *  - `popoverFilters`          — non-search, inactive, non-always (live in "+" popover)
 *
 * Plus `activeFilterKeys` and `hasActive` helpers. Consumers building a
 * custom strip layout against `<FilterProvider>` can call this and place
 * each group wherever they want without re-implementing the partition
 * logic.
 *
 * `dynamicFilterOptions` (optional) lets consumers swap a filter's option
 * list at render time (e.g. async-loaded options from a parent component)
 * without mutating the provider state.
 */
import { useMemo } from 'react';

import { useFilters } from '../filter-context';
import { type FilterConfig, FilterType } from '../filters.types';

export interface UseFilterGroupsOptions {
    /** Override `filter.options` per-key at render time. */
    dynamicFilterOptions?: Record<string, FilterConfig['options']>;
}

export interface UseFilterGroupsResult {
    /** Filters merged with `dynamicFilterOptions`. */
    processedFilters: FilterConfig[];
    searchFilters: FilterConfig[];
    alwaysVisibleFilters: FilterConfig[];
    activeRegularFilters: FilterConfig[];
    popoverFilters: FilterConfig[];
    activeFilterKeys: string[];
    hasActive: boolean;
}

export function useFilterGroups(options: UseFilterGroupsOptions = {}): UseFilterGroupsResult {
    const { dynamicFilterOptions } = options;
    const { filters, isFilterActive } = useFilters();

    const processedFilters = useMemo(() => {
        if (!dynamicFilterOptions) return filters;
        return filters.map((filter) => {
            const dyn = dynamicFilterOptions[filter.key];
            if (Array.isArray(dyn)) return { ...filter, options: dyn };
            return filter;
        });
    }, [filters, dynamicFilterOptions]);

    return useMemo(() => {
        const searchFilters = processedFilters.filter((f) => f.type === FilterType.SEARCH);
        const activeRegularFilters = processedFilters.filter(
            (f) => f.type !== FilterType.SEARCH && isFilterActive(f.key),
        );
        const alwaysVisibleFilters = processedFilters.filter(
            (f) =>
                f.type !== FilterType.SEARCH
                && !isFilterActive(f.key)
                && f.displayConfig?.display === 'always',
        );
        const popoverFilters = processedFilters.filter(
            (f) =>
                f.type !== FilterType.SEARCH
                && !isFilterActive(f.key)
                && f.displayConfig?.display !== 'always',
        );
        const activeFilterKeys = activeRegularFilters.map((f) => f.key);

        return {
            processedFilters,
            searchFilters,
            alwaysVisibleFilters,
            activeRegularFilters,
            popoverFilters,
            activeFilterKeys,
            hasActive: activeFilterKeys.length > 0,
        };
    }, [processedFilters, isFilterActive]);
}
