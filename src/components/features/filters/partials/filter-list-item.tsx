import { CommandItem } from '@/components/base/command';
import { Text } from '@/components/typography';
import { useFilters } from '../filter-context';
import { FilterType, type FilterConfig } from '../filters.types';

interface FilterListItemProps {
    filter: FilterConfig;
    onSelect: () => void;
}

/**
 * FilterListItem — single row inside the Filters-button menu.
 *
 * Shows a leading icon (rendered as-is so its native colour comes through),
 * the filter label as the primary line, and a secondary "{n} options" line
 * for SELECT-style filters or the "select date range" hint for DATE filters.
 *
 * All typography flows through the base Text component so the global
 * scale + theming applies consistently.
 */
export function FilterListItem({ filter, onSelect }: FilterListItemProps) {
    const { strings } = useFilters();

    const subtitle =
        filter.type === FilterType.DATE
            ? filter.operator === 'between'
                ? strings?.selectDateRange
                : strings?.selectDate
            : filter.options
                ? `${filter.options.length} ${strings?.options ?? ''}`.trim()
                : null;

    return (
        <CommandItem
            key={filter.key}
            onSelect={onSelect}
            className="flex items-center gap-3 rounded-none px-3 py-2"
        >
            {!!filter.icon && (
                <span className="shrink-0 text-muted-foreground">{filter.icon}</span>
            )}
            <div className="flex min-w-0 flex-col leading-tight">
                <Text tag="span" weight="semibold" className="truncate">
                    {filter.label}
                </Text>
                {!!subtitle && (
                    <Text tag="span" size="xs" type="secondary" className="truncate">
                        {subtitle}
                    </Text>
                )}
            </div>
        </CommandItem>
    );
}
