import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/base/buttons';
import { TagsFacet } from '../facets/tags-facet';
import { Text } from '@/components/typography';
import { useFilters } from '../filter-context';
import type { FilterConfig } from '../filters.types';

interface TagsFilterContentProps {
    filter: FilterConfig;
    value: string[];
    onFilterChange: (value: string[]) => void;
    onBackToFilterList: () => void;
    onClose: () => void;
    isFromMainFilterButton?: boolean;
}

/**
 * Tags Filter Content Component
 *
 * This component provides the content for tags filter popovers.
 * It handles:
 * - Tag input and management
 * - Multiple tag selection
 * - Displaying and removing tags
 * - Applying filter changes
 *
 * The component wraps the TagsFacet component and provides
 * the popover-specific UI elements like header and action buttons.
 */

export function TagsFilterContent({
    filter,
    value,
    onFilterChange,
    onBackToFilterList,
    onClose,
    isFromMainFilterButton = false,
}: TagsFilterContentProps) {
    const { strings } = useFilters();

    // Use local state to track temporary values before committing
    const [tempValue, setTempValue] = useState<string[]>(value || []);
    const showBackButton = Boolean(isFromMainFilterButton);
    const tagCountLabel =
        tempValue.length === 1 ? strings.tag : strings.tags;

    // Update tempValue when value changes (for initial or external updates)
    useEffect(() => {
        setTempValue(value || []);
    }, [value]);

    // Apply changes when Done is clicked
    const handleDone = () => {
        try {
            onFilterChange(tempValue);
            onClose();
        } catch (error) {
            if (import.meta.env?.DEV) {
	            console.error('Error applying filter:', error);
            }
        }
    };

    const isDirty = JSON.stringify(tempValue.slice().sort()) !== JSON.stringify((value ?? []).slice().sort());

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
                {!!showBackButton && (
                    <Button
                        type="button"
                        variant="secondary"
                        buttonStyle="ghost"
                        size="icon-xs"
                        onClick={onBackToFilterList}
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={strings.backToFilters}
                    >
                        <ArrowLeft className="size-3.5" />
                    </Button>
                )}
                <Text tag="span" weight="semibold" className="truncate">
                    {filter.label}
                </Text>
            </div>

            <div className="p-2">
                <TagsFacet
                    filter={filter}
                    value={tempValue}
                    onChange={setTempValue}
                />
            </div>

            {!!isDirty && (
                <div className="flex items-center justify-between gap-2 border-t border-border/60 px-2.5 py-1.5">
                    <Text tag="span" size="xxs" type="secondary" className="tabular-nums">
                        {tempValue.length} {tagCountLabel}
                    </Text>
                    <Button variant="primary" size="xs" onClick={handleDone}>
                        {strings.confirm}
                    </Button>
                </div>
            )}
        </div>
    );
}
