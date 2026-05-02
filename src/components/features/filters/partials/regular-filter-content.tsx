import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

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
import { FilterType, type FilterConfig } from '../filters.types';

interface RegularFilterContentProps {
    filter: FilterConfig;
    value: string[];
    onFilterChange: (value: string[]) => void;
    onBackToFilterList: () => void;
    onClose: () => void;
    isFromMainFilterButton?: boolean;
}

/**
 * RegularFilterContent — popover body for SELECT / MULTI_SELECT filters.
 *
 * Layout:
 *   - Compact header: optional back-arrow, label as small uppercase eyebrow.
 *   - Inline search input (only if the filter has more than 5 options).
 *   - Tight list of options (sm padding, xs font, ml-auto check on the right).
 *   - Compact footer: selected count on the leading edge, Confirm button on
 *     the trailing edge — only rendered when the user has changed selection.
 *
 * Sizes are tuned to feel like a native menu, not a card. Popover width
 * stays at ~260-300px so labels read at one glance.
 */
export function RegularFilterContent({
    filter,
    value,
    onFilterChange,
    onBackToFilterList,
    onClose,
    isFromMainFilterButton = false,
}: RegularFilterContentProps) {
    const { strings } = useFilters();

    const isMultiSelect =
        filter.multiple === true || filter.type === FilterType.MULTI_SELECT;
    const showBackButton = Boolean(isFromMainFilterButton);

    const [tempValue, setTempValue] = useState<string[]>(value || []);

    useEffect(() => {
        setTempValue(value || []);
    }, [value]);

    const handleValueSelect = (optionValue: string) => {
        if (isMultiSelect) {
            const newValue = tempValue.includes(optionValue)
                ? tempValue.filter((v) => v !== optionValue)
                : [...tempValue, optionValue];
            setTempValue(newValue);
        } else {
            setTempValue([optionValue]);

            if (filter.closeOnSelect === true) {
                onFilterChange([optionValue]);
                onClose();
            }
        }
    };

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
            {/* SECTION 1 — Label header */}
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

            <Command className="rounded-none p-0">
                {/* SECTION 2 — Search.
                    Same px-3 py-2.5 as the label section. */}
                <div className="border-b border-border/50 px-3 py-2.5">
                    <CommandInput
                        className="text-xs"
                        placeholder={interpolateFilterString(
                            strings.searchPlaceholder,
                            { filterLabel: filter.label.toLowerCase() },
                        )}
                    />
                </div>

                {/* SECTION 3 — Values list.
                    Same px-3 py-2.5 outer padding as the other two sections.
                    Items inside have ADDITIONAL inner padding (px-2) so option
                    labels are slightly more indented than the section frame —
                    that's what tells the eye "these are list rows, not header
                    text". Total label inset: 12px (section) + 8px (item) = 20px. */}
                <CommandList className="max-h-64 px-3 py-2">
                    <CommandEmpty>
                        <Text size="xs" type="secondary" align="center" className="py-4">
                            {strings.noOptionsFound}
                        </Text>
                    </CommandEmpty>
                    <CommandGroup className="p-0 [&_[cmdk-group]]:p-0">
                        {filter.options?.map((option) => {
                            const isSelected = tempValue.includes(option.value);
                            // data-checked toggles the CommandItem's built-in
                            // CheckIcon (rendered after children with ml-auto).
                            return (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleValueSelect(option.value)}
                                    data-checked={isSelected || undefined}
                                    disabled={option.disabled}
                                    className="flex items-start gap-2.5 rounded-md px-2 py-2 data-[checked=true]:**:[svg]:text-primary"
                                >
                                    {!!option.icon && (
                                        <span className="mt-0.5 shrink-0 text-muted-foreground">
                                            {option.icon}
                                        </span>
                                    )}
                                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                                        <Text
                                            tag="span"
                                            size="xs"
                                            weight={isSelected ? 'medium' : 'regular'}
                                            className="truncate"
                                        >
                                            {option.label}
                                        </Text>
                                        {!!option.description && (
                                            <Text
                                                tag="span"
                                                size="xxs"
                                                type="secondary"
                                                className="truncate mt-0.5"
                                            >
                                                {option.description}
                                            </Text>
                                        )}
                                    </div>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>

            {/* Compact footer — only shows when dirty */}
            {!!isDirty && (
                <div className="flex items-center justify-between gap-2 border-t border-border/60 px-2.5 py-1.5">
                    <Text tag="span" size="xxs" type="secondary" className="tabular-nums">
                        {interpolateFilterString(strings.selected, {
                            count: tempValue.length,
                            filterLabel: (tempValue.length > 1 ? filter.pluralLabel : filter.label) ?? filter.label,
                        })}
                    </Text>
                    <Button variant="primary" size="xs" onClick={handleDone}>
                        {strings.confirm}
                    </Button>
                </div>
            )}
        </div>
    );
}
