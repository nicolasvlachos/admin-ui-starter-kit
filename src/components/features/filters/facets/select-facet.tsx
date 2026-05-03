import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PopoverMenu, type PopoverMenuItem } from '@/components/base/popover-menu';
import { Text } from '@/components/typography';
import { Button } from '@/components/base/buttons';
import { cn } from '@/lib/utils';

import { useFilters } from '../filter-context';
import { interpolateFilterString } from '../filters.strings';
import type { FilterConfig, FilterOption } from '../filters.types';

interface SelectFacetProps {
    filter: FilterConfig;
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

/**
 * SelectFacet — single/multi-select dropdown filter.
 *
 * Composes `PopoverMenu` for the popover + searchable list pattern.
 * Multi-select keeps the popover open after a tap; single-select closes
 * unless `closeOnSelect=false` is passed in the filter config.
 */
export function SelectFacet({
    filter,
    value,
    onChange,
    className,
}: SelectFacetProps) {
    const { strings } = useFilters();
    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [options, setOptions] = useState<FilterOption[] | undefined>(
        filter.options,
    );
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef<number | undefined>(undefined);
    const hasSelection = value.length > 0;

    const handleSelect = (selectedValue: string) => {
        if (filter.multiple) {
            if (value.includes(selectedValue)) {
                onChange(value.filter((v) => v !== selectedValue));
            } else {
                onChange([...value, selectedValue]);
            }
        } else {
            onChange([selectedValue]);
            if (filter.closeOnSelect !== false) {
                setOpen(false);
            }
        }
    };

    const getOptionLabel = (optionValue: string) =>
        (options || filter.options)?.find((opt) => opt.value === optionValue)
            ?.label ?? optionValue;

    // Load options (supports async fetchOptions with basic debounce on searchInput)
    const fetchOptionsFn = filter.fetchOptions;
    const fetchDelay = filter.delay;
    useEffect(() => {
        if (!open) return;
        if (!fetchOptionsFn) return; // static options mode

        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        const delay = typeof fetchDelay === 'number' ? fetchDelay : 300;
        debounceRef.current = window.setTimeout(async () => {
            setIsLoading(true);
            try {
                const fetched = await fetchOptionsFn({ q: [searchInput] });
                setOptions(fetched);
            } finally {
                setIsLoading(false);
            }
        }, delay);

        return () => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
        };
    }, [open, searchInput, fetchOptionsFn, fetchDelay]);

    const items = useMemo<PopoverMenuItem[]>(() => {
        const source = options || filter.options || [];
        return source.map((option) => ({
            value: option.value,
            label: option.label,
            description: option.description,
            icon: option.icon,
            selected: value.includes(option.value),
            disabled: option.disabled,
        }));
    }, [options, filter.options, value]);

    const placeholderInterpolated = interpolateFilterString(
        strings.searchPlaceholder,
        { filterLabel: filter.label.toLowerCase() },
    );

    const emptyMessage = isLoading
        ? interpolateFilterString(strings.loadingOptions, {
              filterLabel: filter.label,
          })
        : strings.noOptionsFound;

    return (
        <div className={cn('select-facet--component', 'relative', className)}>
            <PopoverMenu
                open={open}
                onOpenChange={setOpen}
                search
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                strings={{
                    searchPlaceholder: placeholderInterpolated,
                    empty: emptyMessage,
                }}
                contentClassName="w-(--radix-popover-trigger-width) min-w-56"
                trigger={
                    <Button
                        variant="secondary"
                        buttonStyle="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {hasSelection ? (
                            value.length === 1 ? (
                                <Text tag="span" size="xs" weight="semibold" className="truncate">
                                    {getOptionLabel(value[0])}
                                </Text>
                            ) : (
                                <Text tag="span" size="xs" weight="semibold">
                                    {interpolateFilterString(strings.selected, {
                                        count: value.length,
                                        filterLabel:
                                            (value.length > 1
                                                ? filter.pluralLabel
                                                : filter.label) ?? filter.label,
                                    })}
                                </Text>
                            )
                        ) : (
                            <Text tag="span" size="xs" type="secondary">
                                {filter.placeholder ?? strings.select}
                            </Text>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                }
                items={items}
                onSelect={(item) => handleSelect(item.value)}
            />
        </div>
    );
}
