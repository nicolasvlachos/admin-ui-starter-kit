import { ChevronDown, X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useFilters } from '../filter-context';
import {
    FILTER_ELEMENT_HEIGHT,
    type FilterConfig,
    type FilterOperator,
    type OperatorOption,
} from '../filters.types';
import { FilterOperatorSelect } from './filter-operator-select';
import { FilterValueDisplay } from './filter-value-display';

interface ActiveFilterItemProps {
    filter: FilterConfig;
    value: string[];
    isActive: boolean;
    operators: OperatorOption[];
    operator: FilterOperator;
    onOperatorChange: (operator: FilterOperator) => void;
    onFilterClear: () => void;
    onFilterClick: () => void;
}

/**
 * Active Filter Item Component
 *
 * This component displays a single active filter in the filter list.
 * It provides:
 * - Display of filter label and value
 * - Remove filter functionality
 * - Visual feedback for active state
 * - Support for different filter types
 *
 * The component is used in the filter list to show currently active filters
 * and allow users to remove them.
 */

export function ActiveFilterItem({
    filter,
    value,
    isActive,
    operators,
    operator,
    onOperatorChange,
    onFilterClear,
    onFilterClick,
}: ActiveFilterItemProps) {
    const { strings } = useFilters();

    // Handle button click to avoid interference with children
    const handleLabelClick = (e: React.MouseEvent) => {
        // Only proceed if this is directly on the button, not a child element
        if (
            e.currentTarget === e.target ||
            (e.target as HTMLElement).tagName !== 'BUTTON'
        ) {
            onFilterClick();
        }
    };

    // Inside the pill, segment buttons must not paint their own border or
    // focus ring — the pill itself is the visual container. The global
    // `<Button>` primitive bakes in `border border-transparent
    // focus-visible:border-ring focus-visible:ring-3`, so without these
    // overrides every segment paints a full 1px box (showing as a
    // double-border just inside the pill chrome) and a rounded focus ring
    // when the popover opens.
    const SEGMENT_RESET =
        '!border-0 !rounded-none !shadow-none focus-visible:!ring-0 focus-visible:!border-transparent';

    // Explicit 1px divider — the segment buttons use `!border-0` (so they
    // don't paint an inner full-box decoration) which would also wipe a
    // `divide-x` border. A standalone separator div is unambiguous and
    // doesn't fight with the buttons' baseline chrome.
    const Divider = () => <div aria-hidden className="w-px self-stretch bg-border" />;

    return (
        <div
            role="group"
            aria-label={filter.label}
            className={cn(
                `border-input bg-background flex ${FILTER_ELEMENT_HEIGHT} items-center overflow-hidden rounded-md border`,
                filter.displayConfig?.className,
                isActive && 'active',
            )}
        >
            {/* Filter icon, label and dropdown button grouped together */}
            <Button
                type="button"
                variant="secondary"
                buttonStyle="ghost"
                className={cn(
                    SEGMENT_RESET,
                    'flex h-full items-center px-3 hover:bg-accent hover:text-accent-foreground',
                )}
                onClick={handleLabelClick}
            >
                {!!filter.icon && (
                    <span className="text-muted-foreground mr-1">
                        {filter.icon}
                    </span>
                )}
                <Text tag="span" size="xs" weight="semibold">{filter.label}</Text>
                <ChevronDown className="ml-1 h-4 w-4" />
            </Button>

            <Divider />

            {/* Operator dropdown */}
            <FilterOperatorSelect
                operator={operator}
                operators={operators}
                onOperatorChange={onOperatorChange}
                segmentResetClass={SEGMENT_RESET}
            />

            <Divider />

            {/* Value display with icons and count when multiple selected - explicitly non-interactive */}
            <div className="pointer-events-none flex flex-1 items-center px-2">
                <FilterValueDisplay filter={filter} value={value} />
            </div>

            <Divider />

            {/* Clear button */}
            <Button
                variant="secondary" buttonStyle="ghost"
                className={cn(SEGMENT_RESET, 'h-full w-8 px-0 rounded-r-md')}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onFilterClear();
                }}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">{strings.clear}</span>
            </Button>
        </div>
    );
}
