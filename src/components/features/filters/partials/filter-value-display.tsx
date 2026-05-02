import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Text } from '@/components/typography';
import { useFilters } from '../filter-context';
import type { FilterStrings } from '../filters.strings';
import { interpolateFilterString } from '../filters.strings';
import { FilterType, type FilterConfig } from '../filters.types';

interface FilterValueDisplayProps {
    filter: FilterConfig;
    value: string[];
}

/**
 * Filter Value Display Component
 *
 * This component provides the UI for displaying filter values.
 * It handles:
 * - Displaying filter values with appropriate formatting
 * - Showing icons for filter options
 * - Handling date formatting
 * - Supporting internationalization
 *
 * The component is used to show users the current value of a filter
 * in a consistent and informative way.
 */

export function FilterValueDisplay({ filter, value }: FilterValueDisplayProps) {
    const { strings } = useFilters();

    // For ASYNC_SELECT — always show "N selected"
    if (filter.type === FilterType.ASYNC_SELECT && !filter.options?.length) {
        return (
            <Text tag="span" size="xs" weight="semibold">
                {renderAsyncValueText(filter, value, strings)}
            </Text>
        );
    }

    if (filter.options && filter.type !== FilterType.DATE) {
        return (
            <div className="flex items-center gap-1">
                {/* Option icons - shown for both single and multi-select cases */}
                <div className="relative flex">
                    {value.slice(0, 2).map((val, index) => {
                        const option = filter.options?.find(
                            (o) => o.value === val,
                        );
                        if (!option?.icon) return null;

                        return (
                            <div
                                key={val}
                                className={`${index > 0 ? '-ml-1.5' : ''} border-background bg-background relative rounded-full border`}
                                style={{ zIndex: 10 - index }}
                            >
                                {option.icon}
                            </div>
                        );
                    })}
                    {value.length > 2 && (
                        <div className="bg-muted border-background relative -ml-1.5 flex h-4 w-4 items-center justify-center rounded-full border text-xxs font-medium">
                            +{value.length - 2}
                        </div>
                    )}
                </div>

                {/* Value text */}
                <Text tag="span" size="xs" weight="semibold">
                    {renderValueText(filter, value, strings)}
                </Text>
            </div>
        );
    }

    // For date filters
    if (filter.type === FilterType.DATE) {
        return (
            <div className="flex items-center gap-1">
                <CalendarIcon className="text-muted-foreground h-3.5 w-3.5" />
                <Text tag="span" size="xs" weight="semibold">
                    {renderDateValue(filter, value, strings)}
                </Text>
            </div>
        );
    }

    // For other filters
    return (
        <Text tag="span" size="xs" weight="semibold">
            {renderValueText(filter, value, strings)}
        </Text>
    );
}

// Helper function to render date values
function renderDateValue(
    filter: FilterConfig,
    value: string[],
    strings: FilterStrings,
) {
    if (filter.operator === 'between' && value.length === 2) {
        return `${formatDateValue(value[0], filter.dateFormat?.display)} - ${formatDateValue(value[1], filter.dateFormat?.display)}`;
    }

    if (value.length === 1) {
        return formatDateValue(value[0], filter.dateFormat?.display);
    }

    if (value.length === 2) {
        return `${formatDateValue(value[0], filter.dateFormat?.display)} - ${formatDateValue(value[1], filter.dateFormat?.display)}`;
    }

    return (
        filter.datePickerConfig?.noDatePlaceholder ||
        strings.calendar.notDateSelected
    );
}

// Helper function to render text values for async filters — always "N selected"
function renderAsyncValueText(
    _filter: FilterConfig,
    value: string[],
    strings: FilterStrings,
) {
    if (value.length === 0) return '';
    return interpolateFilterString(strings.selected, { count: value.length, filterLabel: (value.length > 1 ? _filter.pluralLabel : _filter.label) ?? _filter.label });
}

// Helper function to render text values
function renderValueText(
    filter: FilterConfig,
    value: string[],
    strings: FilterStrings,
) {
    if (value.length > 1) {
        return interpolateFilterString(strings.selected, {
            count: value.length,
            filterLabel: filter.pluralLabel ?? filter.label,
        });
    }

    return value
        .map((val) => {
            const option = filter.options?.find((o) => o.value === val);
            return option?.label || val;
        })
        .join(', ');
}

function formatDateValue(rawValue: string, pattern?: string) {
    const parsed = new Date(rawValue);

    if (Number.isNaN(parsed.getTime())) {
        return rawValue;
    }

    if (pattern) {
        try {
            return format(parsed, pattern);
        } catch {
            // Fall through to locale formatting if the provided pattern is invalid
        }
    }

    return parsed.toLocaleDateString();
}
