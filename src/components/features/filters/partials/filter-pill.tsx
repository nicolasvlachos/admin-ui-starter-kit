/**
 * FilterPill — internal partial that wraps a single `ActiveFilterItem` with
 * its popover. Used by `FilterLayout` for both `display: 'always'` filters
 * and `active` regular filters since the rendering is identical except for
 * the `availableFilters` / `activeFilters` lists passed to the popover.
 *
 * Exported from `partials/index.ts` so consumers building a custom strip
 * around `<FilterProvider>` can re-use it without duplicating the popover
 * machinery.
 */
import { useRef, useState } from 'react';

import { Popover, PopoverTrigger } from '@/components/base/popover';

import type {
    FilterConfig,
    FilterOperator,
    OperatorOption,
} from '../filters.types';

import { ActiveFilterItem } from './active-filter-item';
import { FilterErrorBoundary } from './filter-error-boundary';
import { FilterPopoverContent } from './filter-popover-content';

export interface FilterPillProps {
    filter: FilterConfig;
    value: string[];
    isActive: boolean;
    operator: FilterOperator;
    operators: OperatorOption[];
    onOperatorChange: (operator: FilterOperator) => void;
    onValueChange: (value: string[]) => void;
    onClear: () => void;
    /** Filters to render in the "+" list inside the popover. */
    availableFilters: FilterConfig[];
    /** Active regular filters list (for the popover header / context). */
    activeFilters: FilterConfig[];
    /** External signal to suppress popover open during operator change. */
    operatorChangeRef?: React.MutableRefObject<boolean>;
}

export function FilterPill({
    filter,
    value,
    isActive,
    operator,
    operators,
    onOperatorChange,
    onValueChange,
    onClear,
    availableFilters,
    activeFilters,
    operatorChangeRef,
}: FilterPillProps) {
    const localRef = useRef(false);
    const isOperatorChangeRef = operatorChangeRef ?? localRef;

    const [open, setOpen] = useState(false);

    return (
        <FilterErrorBoundary filterKey={filter.key}>
            <Popover
                open={open}
                onOpenChange={(isOpen) => {
                    if (isOpen && isOperatorChangeRef.current) return;
                    setOpen(isOpen);
                }}
            >
                <PopoverTrigger
                    nativeButton={false}
                    render={
                        <div>
                            <ActiveFilterItem
                                filter={filter}
                                value={value}
                                isActive={isActive}
                                operators={operators}
                                operator={operator}
                                onOperatorChange={(next) => {
                                    isOperatorChangeRef.current = true;
                                    onOperatorChange(next);
                                    setOpen(false);
                                    setTimeout(() => {
                                        isOperatorChangeRef.current = false;
                                    }, 100);
                                }}
                                onFilterClear={() => {
                                    setOpen(false);
                                    onClear();
                                }}
                                onFilterClick={() => {
                                    if (!isOperatorChangeRef.current) {
                                        setOpen(true);
                                    }
                                }}
                            />
                        </div>
                    }
                />

                <FilterPopoverContent
                    activeFilterInPopover={filter}
                    availableFilters={availableFilters}
                    activeFilters={activeFilters}
                    getFilterValue={() => value}
                    setFilterValue={(_, next) => onValueChange(next)}
                    onFilterSelect={() => {}}
                    onBackToFilterList={() => {}}
                    onClose={() => setOpen(false)}
                    isFromMainFilterButton={false}
                />
            </Popover>
        </FilterErrorBoundary>
    );
}

FilterPill.displayName = 'FilterPill';
