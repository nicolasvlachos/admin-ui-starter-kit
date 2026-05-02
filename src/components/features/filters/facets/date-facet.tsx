import { isValid } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import {
    DatePicker,
    type DateOutput,
    type DateRangeOutput,
    type PresetDateRange,
} from '@/components/base/date-pickers';
import { cn } from '@/lib/utils';
import { useFilters } from '../filter-context';
import type { FilterConfig } from '../filters.types';

const EMPTY_PRESETS: PresetDateRange[] = [];

interface DateFacetProps {
    filter: FilterConfig;
    value: { start?: Date; end?: Date };
    onChange: (value: { start?: Date; end?: Date }) => void;
    className?: string;
}

export function DateFacet({
    filter,
    value,
    onChange,
    className,
}: DateFacetProps) {
    const { strings } = useFilters();

    const isRangeMode =
        filter.operators?.some((op) => op.value === 'between') ||
        filter.operator === 'between' ||
        filter.key.toLowerCase().includes('range') ||
        filter.key.toLowerCase().includes('between');

    const dateFormat = filter.dateFormat?.param ?? 'yyyy-MM-dd';
    const readableFormat = filter.dateFormat?.display ?? 'PPP';
    const placeholder = isRangeMode
        ? (filter.datePickerConfig?.noRangePlaceholder ??
          filter.placeholder ??
          strings.calendar.notDateRangeSelected)
        : (filter.datePickerConfig?.noDatePlaceholder ??
          filter.placeholder ??
          strings.calendar.notDateSelected);
    const withConfirm = Boolean(filter.datePickerConfig?.showConfirmButton);
    const closeOnSelect = filter.datePickerConfig?.autoApply ?? !withConfirm;
    const showShortcuts = filter.datePickerConfig?.showShortcuts ?? true;

    const rangeValue: DateRange | undefined =
        isRangeMode && (value.start || value.end)
            ? { from: value.start, to: value.end }
            : undefined;

    const singleValue =
        !isRangeMode && value.start && isValid(value.start)
            ? value.start
            : undefined;

    const commonProps = {
        format: dateFormat,
        readableFormat,
        placeholder,
        disablePortal: true,
        numberOfMonths: 1,
        className: cn('w-full', className),
    };

    const handleSingleChange = (output: DateOutput) => {
        onChange({ start: output.date ?? undefined, end: undefined });
    };

    const handleRangeChange = (output: DateRangeOutput) => {
        onChange({
            start: output.range?.from ?? undefined,
            end: output.range?.to ?? undefined,
        });
    };

    if (isRangeMode) {
        const presetsProp = showShortcuts ? undefined : EMPTY_PRESETS;
        return (
            <DatePicker
                mode="range"
                value={rangeValue}
                onChange={handleRangeChange}
                withConfirm={withConfirm}
                closeOnSelect={closeOnSelect}
                presets={presetsProp}
                {...commonProps}
            />
        );
    }

    return (
        <DatePicker
            mode="single"
            value={singleValue}
            onChange={handleSingleChange}
            closeOnSelect={closeOnSelect}
            {...commonProps}
        />
    );
}
