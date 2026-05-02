import {
    AlertCircle,
    ArrowLeft,
    Check,
    Loader2,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { Button } from '@/components/base/buttons';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/base/command';
import { Text } from '@/components/typography';

import { useFilters } from '../filter-context';
import { interpolateFilterString } from '../filters.strings';
import type { FilterConfig, FilterOption } from '../filters.types';
import { useAsyncOptions } from '../hooks';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AsyncFilterContentProps {
    filter: FilterConfig;
    value: string[];
    onFilterChange: (value: string[]) => void;
    onBackToFilterList: () => void;
    onClose: () => void;
    isFromMainFilterButton?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Async Filter Content – renders inside the popover pipeline.
 *
 * Matches the layout of RegularFilterContent (header + command list + footer)
 * but fetches options asynchronously via TanStack Query.
 */
export function AsyncFilterContent({
    filter,
    value,
    onFilterChange,
    onBackToFilterList,
    onClose,
    isFromMainFilterButton = false,
}: AsyncFilterContentProps) {
    const { strings, cacheAsyncOptions, getAsyncOptionLabel } = useFilters();
    const [searchInput, setSearchInput] = useState('');
    const [tempValue, setTempValue] = useState<string[]>(value ?? []);

    // Sync tempValue when external value changes
    const prevValueRef = useRef(value);
    if (value !== prevValueRef.current) {
        prevValueRef.current = value;
        setTempValue(value ?? []);
    }

    const {
        options,
        isLoading,
        isFetching,
        isError,
        refetch,
        isBelowMinQuery,
        minQueryLength,
    } = useAsyncOptions(filter, searchInput, true);

    // Populate the shared async options cache for label resolution in FilterValueDisplay
    if (options.length > 0) {
        cacheAsyncOptions(filter.key, options);
    }

    const isMulti = filter.multiple !== false;
    const maxSelected = filter.maxSelected;
    const showBackButton = Boolean(isFromMainFilterButton);

    // Sort options: selected items first, then the rest.
    // Also include cached selected items that may not be in current search results.
    const sortedOptions = useMemo(() => {
        const selectedSet = new Set(tempValue);
        const optionValueSet = new Set(options.map((o) => o.value));

        // Resolve selected items missing from current results via the global cache
        const missingSelected: FilterOption[] = [];
        for (const val of tempValue) {
            if (!optionValueSet.has(val)) {
                const label = getAsyncOptionLabel(filter.key, val);
                if (label) {
                    missingSelected.push({ value: val, label, icon: filter.icon });
                }
            }
        }

        const all = [...missingSelected, ...options];
        return all.sort((a, b) => {
            const aSelected = selectedSet.has(a.value) ? 0 : 1;
            const bSelected = selectedSet.has(b.value) ? 0 : 1;
            return aSelected - bSelected;
        });
    }, [options, tempValue, filter.key, filter.icon, getAsyncOptionLabel]);

    const handleValueSelect = (optionValue: string) => {
        if (isMulti) {
            if (tempValue.includes(optionValue)) {
                setTempValue(tempValue.filter((v) => v !== optionValue));
            } else {
                if (maxSelected && tempValue.length >= maxSelected) return;
                setTempValue([...tempValue, optionValue]);
            }
        } else {
            setTempValue([optionValue]);
            if (filter.closeOnSelect === true) {
                onFilterChange([optionValue]);
                onClose();
            }
        }
    };

    const handleDone = () => {
        onFilterChange(tempValue);
        onClose();
    };

    // Render the status area inside CommandEmpty
    const emptyContent = useMemo(() => {
        if (isLoading || isFetching) {
            return (
                <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 className="text-muted-foreground size-4 animate-spin" />
                    <Text tag="span" size="xs" type="secondary">
                        {strings.searching}
                    </Text>
                </div>
            );
        }

        if (isError) {
            return (
                <div className="flex flex-col items-center gap-2 py-4">
                    <div className="flex items-center gap-1.5">
                        <AlertCircle className="text-destructive size-4" />
                        <Text tag="span" size="xs" type="secondary">
                            {strings.fetchError}
                        </Text>
                    </div>
                    <Button
                        variant="secondary"
                        buttonStyle="outline"
                        size="xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            void refetch();
                        }}
                    >
                        {strings.retryFetch}
                    </Button>
                </div>
            );
        }

        if (isBelowMinQuery) {
            return (
                <div className="text-muted-foreground flex items-center justify-center py-4">
                    <Text tag="span" size="xs" type="secondary">
                        {interpolateFilterString(strings.minQueryHint, {
                            min: minQueryLength,
                        })}
                    </Text>
                </div>
            );
        }

        return strings.noOptionsFound;
    }, [
        isLoading,
        isFetching,
        isError,
        isBelowMinQuery,
        minQueryLength,
        strings,
        refetch,
    ]);

    return (
        <>
            {/* Header – matches RegularFilterContent */}
            <div className="flex items-center border-b p-2">
                {Boolean(showBackButton) && (
                    <Button
                        variant="secondary"
                        buttonStyle="ghost"
                        className="mr-2 h-8 w-8 p-0"
                        onClick={onBackToFilterList}
                        aria-label={strings.backToFilters}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <div className="flex flex-col">
                    <Text tag="span" size="xs" weight="semibold">
                        {filter.label}
                    </Text>
                    <Text tag="span" size="xs" type="secondary">
                        {strings.selectValues}
                    </Text>
                </div>
            </div>

            {/* Command list with async search */}
            <Command shouldFilter={false}>
                <CommandInput
                    placeholder={interpolateFilterString(
                        strings.searchPlaceholder,
                        { filterLabel: filter.label.toLowerCase() },
                    )}
                    value={searchInput}
                    onValueChange={setSearchInput}
                />
                <CommandList>
                    {sortedOptions.length === 0 ? (
                        <CommandEmpty>{emptyContent}</CommandEmpty>
                    ) : (
                        <CommandGroup>
                            {Boolean(isFetching && !isLoading) && (
                                <div className="flex items-center gap-1.5 px-2 py-1">
                                    <Loader2 className="text-muted-foreground size-3 animate-spin" />
                                    <Text tag="span" size="xs" type="secondary">
                                        {strings.searching}
                                    </Text>
                                </div>
                            )}
                            {sortedOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleValueSelect(option.value)}
                                    disabled={
                                        option.disabled ||
                                        (!!maxSelected &&
                                            tempValue.length >= maxSelected &&
                                            !tempValue.includes(option.value))
                                    }
                                    className="flex items-center gap-2"
                                >
                                    {option.icon}
                                    <Text tag="span" size="xs">
                                        {option.label}
                                    </Text>
                                    {tempValue.includes(option.value) && (
                                        <span className="ml-auto">
                                            <Check className="h-4 w-4" />
                                        </span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>

            {/* Footer – matches RegularFilterContent */}
            <div className="flex justify-between border-t p-2">
                <Text tag="span" size="xs" type="secondary">
                    {interpolateFilterString(strings.selected, {
                        count: tempValue.length,
                        filterLabel: (tempValue.length > 1 ? filter.pluralLabel : filter.label) ?? filter.label,
                    })}
                </Text>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        buttonStyle="outline"
                        size="xs"
                        onClick={handleDone}
                    >
                        {strings.confirm}
                    </Button>
                </div>
            </div>
        </>
    );
}
