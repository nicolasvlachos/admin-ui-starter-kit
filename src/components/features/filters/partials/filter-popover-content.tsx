import { PopoverContent } from '@/components/base/popover';
import { FilterType, type FilterConfig } from '../filters.types';
import { AsyncFilterContent } from './async-filter-content';
import { DateFilterContent } from './date-filter-content';
import { FilterListContent } from './filter-list-content';
import { RegularFilterContent } from './regular-filter-content';
import { TagsFilterContent } from './tags-filter-content';

interface FilterPopoverContentProps {
    activeFilterInPopover: FilterConfig | null;
    availableFilters: FilterConfig[];
    activeFilters: FilterConfig[];
    getFilterValue: (key: string) => string[];
    setFilterValue: (key: string, value: string[]) => void;
    onFilterSelect: (filter: FilterConfig) => void;
    onBackToFilterList: () => void;
    onClose: () => void;
    isFromMainFilterButton?: boolean; // Determines back button behavior
}

/**
 * Filter Popover Content Component
 *
 * This component provides the content wrapper for filter popovers.
 * It handles:
 * - Consistent popover styling
 * - Content layout and spacing
 * - Responsive behavior
 * - Animation and transitions
 *
 * The component is used to wrap filter content in a consistent
 * popover interface across different filter types.
 */

export function FilterPopoverContent({
    activeFilterInPopover,
    availableFilters,
    activeFilters,
    getFilterValue,
    setFilterValue,
    onFilterSelect,
    onBackToFilterList,
    onClose,
    isFromMainFilterButton = false,
}: FilterPopoverContentProps) {
    const popoverWidth =
        activeFilterInPopover?.type === FilterType.DATE ||
        activeFilterInPopover?.type === FilterType.TAGS
            ? 'w-auto min-w-[320px] p-0 overflow-hidden rounded-lg shadow-lg'
            : activeFilterInPopover?.type === FilterType.ASYNC_SELECT
              ? 'w-72 p-0 overflow-hidden rounded-lg shadow-lg'
              : 'w-64 p-0 overflow-hidden rounded-lg shadow-lg';

    // Forward values directly so upstream can decide whether to add or clear the filter
    const handleSetFilterValue = (key: string, value: string[]) => {
        setFilterValue(key, value);
    };

    return (
        <PopoverContent className={popoverWidth} align="start">
            {activeFilterInPopover ? (
                // Render specific filter content based on type
                activeFilterInPopover.type === FilterType.DATE ? (
                    <DateFilterContent
                        filter={activeFilterInPopover}
                        value={getFilterValue(activeFilterInPopover.key)}
                        onFilterChange={(value) =>
                            handleSetFilterValue(
                                activeFilterInPopover.key,
                                value,
                            )
                        }
                        onBackToFilterList={onBackToFilterList}
                        isFromMainFilterButton={isFromMainFilterButton}
                    />
                ) : activeFilterInPopover.type === FilterType.TAGS ? (
                    <TagsFilterContent
                        filter={activeFilterInPopover}
                        value={getFilterValue(activeFilterInPopover.key)}
                        onFilterChange={(value) =>
                            handleSetFilterValue(
                                activeFilterInPopover.key,
                                value,
                            )
                        }
                        onBackToFilterList={onBackToFilterList}
                        onClose={onClose}
                        isFromMainFilterButton={isFromMainFilterButton}
                    />
                ) : activeFilterInPopover.type === FilterType.ASYNC_SELECT ? (
                    <AsyncFilterContent
                        filter={activeFilterInPopover}
                        value={getFilterValue(activeFilterInPopover.key)}
                        onFilterChange={(value) =>
                            handleSetFilterValue(
                                activeFilterInPopover.key,
                                value,
                            )
                        }
                        onBackToFilterList={onBackToFilterList}
                        onClose={onClose}
                        isFromMainFilterButton={isFromMainFilterButton}
                    />
                ) : (
                    <RegularFilterContent
                        filter={activeFilterInPopover}
                        value={getFilterValue(activeFilterInPopover.key)}
                        onFilterChange={(value) =>
                            handleSetFilterValue(
                                activeFilterInPopover.key,
                                value,
                            )
                        }
                        onBackToFilterList={onBackToFilterList}
                        onClose={onClose}
                        isFromMainFilterButton={isFromMainFilterButton}
                    />
                )
            ) : (
                // Render the list of available filters
                <FilterListContent
                    availableFilters={availableFilters}
                    activeFilters={activeFilters}
                    onFilterSelect={onFilterSelect}
                />
            )}
        </PopoverContent>
    );
}
