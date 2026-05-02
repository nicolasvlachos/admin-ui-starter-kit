import {
    createContext,
    useContext,
    useMemo,
    useCallback,
    type ReactNode,
    useRef,
    useEffect,
    useState,
} from 'react';
import { useStrings, type StringsProp } from '@/lib/strings';
import {
    defaultFilterStrings,
    getFilterString,
    type FilterStrings,
} from './filters.strings';
import {
    FilterType,
    type FilterConfig,
    type ActiveFilter,
    type FilterOperator,
    type FilterOption,
} from './filters.types';
import { getDefaultOperatorForType } from './operator-options';
import { validateFilterValue } from './utils/filter-utils';

interface FilterProviderProps {
    children: ReactNode;
    filters: FilterConfig[];
    activeFilters: ActiveFilter[];
    onFilterChange: (filters: ActiveFilter[]) => void;
    isNavigating?: boolean;
    strings?: StringsProp<FilterStrings>;
    locale?: string;
    /** Called when an async fetch / validation / apply step throws.
     *  Library DEV-logs the error; consumer wires telemetry here. */
    onError?: (error: unknown, context: { phase: 'fetch-options' | 'apply' | 'validate'; filterKey?: string }) => void;
}

interface FilterContextValue {
    activeFilters: ActiveFilter[];
    filters: FilterConfig[];
    addFilter: (filter: ActiveFilter) => void;
    removeFilter: (id: string) => void;
    updateFilter: (id: string, updates: Partial<ActiveFilter>) => void;
    clearFilters: () => void;
    replaceFilters: (filters: ActiveFilter[]) => void;
    getFilterByKey: (key: string) => FilterConfig | undefined;
    getFilterValue: (key: string) => string[];
    setFilterValue: (key: string, value: string[]) => void;
    isFilterActive: (key: string) => boolean;
    getFilterOperator: (key: string) => FilterOperator | undefined;
    setFilterOperator: (key: string, operator: FilterOperator) => void;
    validateFilter: (key: string, value: unknown) => boolean | string;
    getDependentFilters: (key: string) => FilterConfig[];
    getFilterOptions: (key: string) => Promise<FilterOption[]>;
    isNavigating: boolean;
    locale: string;
    strings: FilterStrings;
    /** Cache resolved options for async filters (keyed by filter key → option value → FilterOption) */
    cacheAsyncOptions: (filterKey: string, options: FilterOption[]) => void;
    /** Resolve a cached label for an async filter value */
    getAsyncOptionLabel: (filterKey: string, optionValue: string) => string | undefined;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

/**
 * Module-level cache for async filter option labels.
 * Lives outside the component tree so it survives provider remounts.
 */
const globalAsyncOptionsCache = new Map<string, Map<string, FilterOption>>();

/**
 * Framework-agnostic filter provider.
 * State, strings, and async option fetchers are passed by the consumer.
 */
export function FilterProvider({
    children,
    filters,
    activeFilters,
    onFilterChange,
    isNavigating: isNavigatingProp = false,
    strings: stringsProp,
    locale: localeProp,
    onError,
}: FilterProviderProps) {
    const filtersRef = useRef(filters);
    const activeFiltersRef = useRef(activeFilters);
    const onFilterChangeRef = useRef(onFilterChange);
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    // Trigger re-render when async labels are resolved
    const [, setAsyncCacheVersion] = useState(0);

    const locale = localeProp || 'en';
    const strings = useStrings(defaultFilterStrings, stringsProp);

    // Update refs when prop change
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    useEffect(() => {
        activeFiltersRef.current = activeFilters;
    }, [activeFilters]);

    useEffect(() => {
        onFilterChangeRef.current = onFilterChange;
    }, [onFilterChange]);

    const addFilter = useCallback(
        (filter: ActiveFilter) => {
            const newFilters = [...activeFilters, filter];
            onFilterChangeRef.current(newFilters);
        },
        [activeFilters],
    );

    const removeFilter = useCallback(
        (id: string) => {
            const newFilters = activeFilters.filter(
                (f: ActiveFilter) => f.id !== id && f.key !== id,
            );
            onFilterChangeRef.current(newFilters);
        },
        [activeFilters],
    );

    const updateFilter = useCallback(
        (id: string, updates: Partial<ActiveFilter>) => {
            const newFilters = activeFilters.map((f: ActiveFilter) =>
                f.id === id || f.key === id ? { ...f, ...updates } : f,
            );
            onFilterChangeRef.current(newFilters);
        },
        [activeFilters],
    );

    const clearFilters = useCallback(() => {
        onFilterChangeRef.current([]);
    }, []);

    const replaceFilters = useCallback((newFilters: ActiveFilter[]) => {
        onFilterChangeRef.current(newFilters);
    }, []);

    const getFilterByKey = useCallback(
        (key: string): FilterConfig | undefined => {
            return filtersRef.current.find((f: FilterConfig) => f.key === key);
        },
        [],
    );

    const getFilterValue = useCallback(
        (key: string): string[] => {
            const filter = activeFilters.find(
                (f: ActiveFilter) => f.key === key,
            );
            return filter?.value || [];
        },
        [activeFilters],
    );

    const setFilterValue = useCallback(
        (key: string, value: string[]) => {
            const existingFilter = activeFilters.find(
                (f: ActiveFilter) => f.key === key,
            );

            if (value.length === 0) {
                // Remove filter if the value is empty
                if (existingFilter) {
                    removeFilter(key);
                }
            } else {
                // Update or add filter
                if (existingFilter) {
                    updateFilter(key, { value });
                } else {
                    // Get the filter config to check for default operator
                    const filterConfig = filtersRef.current.find(
                        (f: FilterConfig) => f.key === key,
                    );
                    const defaultOperator =
                        filterConfig?.operator ??
                        filterConfig?.operators?.[0]?.value ??
                        (filterConfig
                            ? getDefaultOperatorForType(filterConfig.type)
                            : 'equals');

                    addFilter({
                        id: key,
                        key,
                        value,
                        operator: defaultOperator,
                    });
                }
            }
        },
        [activeFilters, addFilter, removeFilter, updateFilter],
    );

    const isFilterActive = useCallback(
        (key: string): boolean => {
            return activeFilters.some(
                (f: ActiveFilter) => f.key === key && f.value.length > 0,
            );
        },
        [activeFilters],
    );

    const getFilterOperator = useCallback(
        (key: string): FilterOperator | undefined => {
            const filter = activeFilters.find(
                (f: ActiveFilter) => f.key === key,
            );
            return filter?.operator || 'equals';
        },
        [activeFilters],
    );

    const setFilterOperator = useCallback(
        (key: string, operator: FilterOperator) => {
            const existingFilter = activeFilters.find(
                (f: ActiveFilter) => f.key === key,
            );
            if (existingFilter) {
                updateFilter(key, { operator });
            }
        },
        [activeFilters, updateFilter],
    );

    const validateFilter = useCallback(
        (key: string, value: unknown): boolean | string => {
            const filter = filtersRef.current.find(
                (f: FilterConfig) => f.key === key,
            );
            if (!filter) return false;
            return validateFilterValue(filter, value, (path) =>
                getFilterString(strings, path),
            );
        },
        [strings],
    );

    const getDependentFilters = useCallback((key: string): FilterConfig[] => {
        return filtersRef.current.filter((f: FilterConfig) =>
            f.dependencies?.some((dep: { key: string }) => dep.key === key),
        );
    }, []);

    const getFilterOptions = useCallback(
        async (key: string): Promise<FilterOption[]> => {
            const filter = filtersRef.current.find(
                (f: FilterConfig) => f.key === key,
            );
            if (!filter) return [];

            if (filter.fetchOptions) {
                const filtersState = activeFiltersRef.current.reduce(
                    (acc, current) => {
                        acc[current.key] = current.value;
                        return acc;
                    },
                    {} as Record<string, string[]>,
                );

                const dependencyValues = (filter.dependencies ?? []).reduce(
                    (acc, dep) => {
                        const dependencyValue = filtersState[dep.key];
                        if (dependencyValue && dependencyValue.length > 0) {
                            acc[dep.key] = dependencyValue;
                        }
                        return acc;
                    },
                    {} as Record<string, string[]>,
                );

                try {
                    const dynamicOptions =
                        await filter.fetchOptions(dependencyValues);
                    if (Array.isArray(dynamicOptions)) {
                        return dynamicOptions;
                    }
                } catch (error) {
                    if (import.meta.env?.DEV) {
	                    console.error(
	                        `Failed fetching options for filter "${key}":`,
	                        error,
	                    );
                    }
                    onErrorRef.current?.(error, { phase: 'fetch-options', filterKey: key });
                }
            }

            // Fall back to the static definition if no dynamic options are available
            return filter.options || [];
        },
        [],
    );

    const cacheAsyncOptions = useCallback(
        (filterKey: string, options: FilterOption[]) => {
            let filterMap = globalAsyncOptionsCache.get(filterKey);
            if (!filterMap) {
                filterMap = new Map();
                globalAsyncOptionsCache.set(filterKey, filterMap);
            }
            let hasNew = false;
            for (const opt of options) {
                if (!filterMap.has(opt.value)) {
                    hasNew = true;
                }
                filterMap.set(opt.value, opt);
            }
            // Trigger re-render if new labels were added so filter pills update
            if (hasNew) {
                setAsyncCacheVersion((v) => v + 1);
            }
        },
        [],
    );

    const getAsyncOptionLabel = useCallback(
        (filterKey: string, optionValue: string): string | undefined => {
            return globalAsyncOptionsCache.get(filterKey)?.get(optionValue)?.label;
        },
        [],
    );

    // On mount, preload options for any active ASYNC_SELECT filters so that
    // filter pills can display resolved labels instead of raw UUIDs.
    useEffect(() => {
        const controller = new AbortController();

        for (const filter of filters) {
            if (filter.type !== FilterType.ASYNC_SELECT) continue;

            const active = activeFilters.find((af) => af.key === filter.key);
            if (!active || active.value.length === 0) continue;

            // Check if all active values already have cached labels
            const allCached = active.value.every(
                (v) => globalAsyncOptionsCache.get(filter.key)?.has(v),
            );
            if (allCached) continue;

            // Preload: fetch with empty query to get default/popular options
            const { asyncConfig, fetchOptions } = filter;
            if (asyncConfig?.fetcher && asyncConfig.mapToOption) {
                void asyncConfig
                    .fetcher({
                        query: '',
                        limit: asyncConfig.limit ?? 10,
                        signal: controller.signal,
                    })
                    .then((items) => {
                        if (controller.signal.aborted) return;
                        const options = items.map(asyncConfig.mapToOption);
                        cacheAsyncOptions(filter.key, options);
                    })
                    .catch(() => {
                        // Silently ignore — labels will fallback to "N selected"
                    });
            } else if (fetchOptions) {
                void fetchOptions({ q: [''] })
                    .then((options) => {
                        if (controller.signal.aborted) return;
                        cacheAsyncOptions(filter.key, options);
                    })
                    .catch(() => {
                        // Silently ignore
                    });
            }
        }

        return () => controller.abort();
        // Only run on mount — filters/activeFilters identity may change on every render
        // but we only need to preload once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({
            activeFilters,
            filters,
            addFilter,
            removeFilter,
            updateFilter,
            clearFilters,
            replaceFilters,
            getFilterByKey,
            getFilterValue,
            setFilterValue,
            isFilterActive,
            getFilterOperator,
            setFilterOperator,
            validateFilter,
            getDependentFilters,
            getFilterOptions,
            isNavigating: isNavigatingProp,
            locale,
            strings,
            cacheAsyncOptions,
            getAsyncOptionLabel,
        }),
        [
            activeFilters,
            filters,
            addFilter,
            removeFilter,
            updateFilter,
            clearFilters,
            replaceFilters,
            getFilterByKey,
            getFilterValue,
            setFilterValue,
            isFilterActive,
            getFilterOperator,
            setFilterOperator,
            validateFilter,
            getDependentFilters,
            getFilterOptions,
            isNavigatingProp,
            locale,
            strings,
            cacheAsyncOptions,
            getAsyncOptionLabel,
        ],
    );

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
}
