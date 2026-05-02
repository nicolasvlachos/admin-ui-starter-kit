import { Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/base/buttons';
import {
    Popover,
    PopoverTrigger,
} from '@/components/base/popover';
import { FILTER_ELEMENT_HEIGHT, type FilterConfig } from '../filters.types';
import { FilterPopoverContent } from './filter-popover-content';
// import { useFilters } from '../filter-context'; // Currently unused

interface FiltersButtonProps {
    availableFilters: FilterConfig[];
    activeFilters: FilterConfig[];
    activeFilterInPopover: FilterConfig | null;
    getFilterValue: (key: string) => string[];
    setFilterValue: (key: string, value: string[]) => void;
    setActiveFilterInPopover: (filter: FilterConfig | null) => void;
    locale?: string;
}

/**
 * Filters Button Component
 *
 * This component provides the main button for adding and managing filters.
 * It handles:
 * - Opening the filter popover
 * - Managing filter selection state
 * - Handling filter actions (select, back, close)
 * - Supporting internationalization
 *
 * The component is used as the primary entry point for users to
 * add and configure filters in the application.
 */

export function FiltersButton({
    availableFilters,
    activeFilters,
    activeFilterInPopover,
    getFilterValue,
    setFilterValue,
    setActiveFilterInPopover,
}: FiltersButtonProps) {
    // Control popover state explicitly
    const [isOpen, setIsOpen] = useState(false);

    // const { t } = useFilters(); // Currently unused

    // Handle filter selection - keep popover open
    const handleFilterSelect = (filter: FilterConfig) => {
        // Set the selected filter without closing the popover
        setActiveFilterInPopover(filter);
    };

    // Handle back to filter list action
    const handleBackToFilterList = () => {
        setActiveFilterInPopover(null);
    };

    // Handle complete close action - reset everything
    const handleClose = () => {
        setActiveFilterInPopover(null);
        setIsOpen(false);
    };

    // Reset active filter when popover closes
    useEffect(() => {
        if (!isOpen) {
            // Reset to filters view when popover is closed
            setActiveFilterInPopover(null);
        }
    }, [isOpen, setActiveFilterInPopover]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="secondary" buttonStyle="outline"
                        className={`flex ${FILTER_ELEMENT_HEIGHT} items-center gap-1.5`}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                }
            />
            <FilterPopoverContent
                activeFilterInPopover={activeFilterInPopover}
                availableFilters={availableFilters}
                activeFilters={activeFilters}
                getFilterValue={getFilterValue}
                setFilterValue={setFilterValue}
                onFilterSelect={handleFilterSelect}
                onBackToFilterList={handleBackToFilterList}
                onClose={handleClose}
                isFromMainFilterButton={true}
            />
        </Popover>
    );
}
