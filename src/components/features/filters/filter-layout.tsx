/**
 * FilterLayout — default strip layout: search inputs inline, then either
 * "always-visible" or active filter pills, then the "+" button for the
 * remaining inactive filters.
 *
 * The heavy lifting now lives in two reusable pieces:
 *   - `useFilterGroups()` (hook) — partitions filters into search /
 *     always-visible / active / popover groups so consumers building a
 *     custom strip can call this and place each group themselves.
 *   - `<FilterPill>` (partial) — wraps `<ActiveFilterItem>` + popover so
 *     the duplicated rendering between always-visible and active filters
 *     collapses to a single component.
 */
import { useState } from 'react';

import { Button } from '@/components/base/buttons';
import { cn } from '@/lib/utils';

import { useFilters } from './filter-context';
import { interpolateFilterString } from './filters.strings';
import {
    type FilterConfig,
    type FilterTab,
    type FilterOperator,
} from './filters.types';
import { useFilterGroups } from './hooks/use-filter-groups';
import { getOperatorsForType } from './operator-options';

import {
    FilterErrorBoundary,
    FiltersButton,
    FilterPill,
    FilterTabs,
    SearchFiltersList,
} from './partials';

interface FilterLayoutProps {
    className?: string;
    /** Per-key dynamic options that override the provider's filter.options. */
    dynamicFilterOptions?: Record<string, FilterConfig['options']>;
    /** Per-key loading states; renders a small spinning chip. */
    loadingFilters?: Record<string, boolean>;
    variant?: 'default' | 'compact';
    showClearFilters?: boolean;
    tabs?: FilterTab[];
}

export function FilterLayout({
    className,
    dynamicFilterOptions = {},
    loadingFilters = {},
    variant = 'default',
    showClearFilters = false,
    tabs,
}: FilterLayoutProps) {
    const {
        getFilterValue,
        setFilterValue,
        isFilterActive,
        clearFilters,
        getFilterOperator,
        setFilterOperator,
        isNavigating,
        strings,
    } = useFilters();

    const groups = useFilterGroups({ dynamicFilterOptions });
    const {
        processedFilters,
        searchFilters,
        alwaysVisibleFilters,
        activeRegularFilters,
        popoverFilters,
        hasActive,
    } = groups;

    const [activeFilterInPopover, setActiveFilterInPopover] = useState<FilterConfig | null>(null);

    function getFilterOperators(filter: FilterConfig) {
        if (filter.operators && filter.operators.length > 0) return filter.operators;
        return getOperatorsForType(filter.type, strings.operators);
    }

    function handleOperatorChange(filterKey: string, operator: FilterOperator) {
        setFilterOperator(filterKey, operator);
    }

    return (
        <div
            className={cn(
                variant === 'compact' ? 'space-y-2' : 'space-y-4',
                className,
            )}
        >
            {!!tabs && tabs.length > 0 && <FilterTabs tabs={tabs} />}

            <div
                className={cn(
                    'flex flex-wrap items-center',
                    variant === 'compact' ? 'gap-1' : 'gap-2',
                )}
            >
                <FilterErrorBoundary filterKey="search-filters">
                    <SearchFiltersList
                        filters={searchFilters}
                        getFilterValue={getFilterValue}
                        setFilterValue={setFilterValue}
                    />
                </FilterErrorBoundary>

                <div className={cn('contents', isNavigating && 'pointer-events-none opacity-60')}>
                    {/* Loading chips for filters being updated */}
                    {Object.entries(loadingFilters)
                        .filter(([, isLoading]) => isLoading)
                        .map(([key]) => {
                            const filterLabel =
                                processedFilters.find((f) => f.key === key)?.label || key;
                            return (
                                <div
                                    key={`loading-${key}`}
                                    className="text-muted-foreground bg-muted/50 flex items-center rounded-md px-2 py-1 text-xs"
                                >
                                    <div className="border-muted-foreground/30 border-t-primary mr-1 size-3 animate-spin rounded-full border-2"></div>
                                    {interpolateFilterString(strings.loadingOptions, { filterLabel })}
                                </div>
                            );
                        })}

                    {/* Always-visible filters (display: 'always') — even when inactive */}
                    {alwaysVisibleFilters.map((filter) => (
                        <FilterPill
                            key={filter.key}
                            filter={filter}
                            value={getFilterValue(filter.key) ?? []}
                            isActive={false}
                            operator={getFilterOperator(filter.key) || 'equals'}
                            operators={getFilterOperators(filter)}
                            onOperatorChange={(operator) => handleOperatorChange(filter.key, operator)}
                            onValueChange={(value) => setFilterValue(filter.key, value)}
                            onClear={() => setFilterValue(filter.key, [])}
                            availableFilters={popoverFilters}
                            activeFilters={[...activeRegularFilters, ...alwaysVisibleFilters]}
                        />
                    ))}

                    {/* Active regular filters */}
                    {activeRegularFilters.map((filter) => (
                        <FilterPill
                            key={filter.key}
                            filter={filter}
                            value={getFilterValue(filter.key) ?? []}
                            isActive={isFilterActive(filter.key)}
                            operator={getFilterOperator(filter.key) || 'equals'}
                            operators={getFilterOperators(filter)}
                            onOperatorChange={(operator) => handleOperatorChange(filter.key, operator)}
                            onValueChange={(value) => setFilterValue(filter.key, value)}
                            onClear={() => setFilterValue(filter.key, [])}
                            availableFilters={popoverFilters}
                            activeFilters={activeRegularFilters}
                        />
                    ))}

                    {popoverFilters.length > 0 && (
                        <FilterErrorBoundary filterKey="filters-button">
                            <FiltersButton
                                availableFilters={popoverFilters}
                                activeFilters={activeRegularFilters}
                                activeFilterInPopover={activeFilterInPopover}
                                getFilterValue={getFilterValue}
                                setFilterValue={setFilterValue}
                                setActiveFilterInPopover={setActiveFilterInPopover}
                            />
                        </FilterErrorBoundary>
                    )}

                    {!!showClearFilters && hasActive && (
                        <Button
                            variant="secondary"
                            buttonStyle="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground ml-auto"
                        >
                            {strings.clearFilters}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
