import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandSeparator,
} from '@/components/base/command';
import { useFilters } from '../filter-context';
import type { FilterConfig } from '../filters.types';
import { FilterListItem } from './filter-list-item';

interface FilterListContentProps {
    availableFilters: FilterConfig[];
    activeFilters: FilterConfig[];
    onFilterSelect: (filter: FilterConfig) => void;
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

export function FilterListContent({
    availableFilters,
    activeFilters,
    onFilterSelect,
}: FilterListContentProps) {
    const { strings } = useFilters();

    // Handle filter selection with explicit closing of popover
    const handleFilterSelect = (filter: FilterConfig) => {
        // Call the passed onFilterSelect with the filter
        onFilterSelect(filter);
    };

    // Group headings get the same px-3 horizontal as items so they all
    // align with the search input above.
    const groupHeadingClasses =
        '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:font-medium';

    return (
        <Command className="rounded-none p-0">
            <div className="border-b border-border/50 px-3 py-2">
                <CommandInput className="text-xs" placeholder={strings.searchFilters} />
            </div>
            <CommandList className="max-h-72 py-1">
                <CommandEmpty className="px-3 py-4 text-center text-xs text-muted-foreground">
                    {strings.noFiltersAvailable}
                </CommandEmpty>

                {availableFilters.length > 0 && (
                    <CommandGroup heading={strings.availableFilters} className={`p-0 ${groupHeadingClasses}`}>
                        {availableFilters.map((filter) => (
                            <FilterListItem
                                key={filter.key}
                                filter={filter}
                                onSelect={() => handleFilterSelect(filter)}
                            />
                        ))}
                    </CommandGroup>
                )}

                {activeFilters.length > 0 && (
                    <>
                        <CommandSeparator className="my-1" />
                        <CommandGroup heading={strings.activeFilters} className={`p-0 ${groupHeadingClasses}`}>
                            {activeFilters.map((filter) => (
                                <FilterListItem
                                    key={filter.key}
                                    filter={filter}
                                    onSelect={() => handleFilterSelect(filter)}
                                />
                            ))}
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </Command>
    );
}
