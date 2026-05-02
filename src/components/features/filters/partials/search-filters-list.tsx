import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { SearchFacet } from '../facets/search-facet';
import type { FilterConfig } from '../filters.types';

interface SearchFiltersListProps {
    filters: FilterConfig[];
    getFilterValue: (key: string) => string[];
    setFilterValue: (key: string, value: string[]) => void;
    className?: string;
}

/**
 * Search Filters List Component
 *
 * This component provides a list of search filters that are always visible.
 * It handles:
 * - Rendering multiple search filters
 * - Managing filter values
 * - Applying custom styling
 * - Supporting responsive layout
 *
 * The component is used to display search filters that should be
 * immediately accessible to users without requiring a popover.
 */

export function SearchFiltersList({
    filters,
    getFilterValue,
    setFilterValue,
    className,
}: SearchFiltersListProps) {
    return (
        <>
            {filters.map((filter) => (
                <div
                    key={filter.key}
                    className={cn(
                        'space-y-2',
                        filter.displayConfig.className,
                        className,
                    )}
                >
                    <SearchFacet
                        filter={filter}
                        value={getFilterValue(filter.key)}
                        onChange={(newValue) =>
                            setFilterValue(filter.key, newValue)
                        }
                    />
                    {!!filter.description && (
                        <Text size="xs" type="secondary">
                            {filter.description}
                        </Text>
                    )}
                </div>
            ))}
        </>
    );
}
