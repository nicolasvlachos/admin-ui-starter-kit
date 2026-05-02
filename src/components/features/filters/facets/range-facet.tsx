import { useState, useEffect, useId, useRef, type ChangeEvent } from 'react';
import { Input } from '@/components/base/forms';
import { Label } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useFilters } from '../filter-context';
import type { FilterConfig } from '../filters.types';

interface RangeFacetProps {
    filter: FilterConfig;
    value: { min?: number; max?: number };
    onChange: (value: { min?: number; max?: number }) => void;
    className?: string;
}

/**
 * Range Filter Facet
 *
 * This component implements a numeric range filter that allows users to:
 * - Set minimum and maximum values
 * - Configure step size and precision
 * - Set value constraints (min/max allowed values)
 * - Customize the range input appearance
 *
 * The component integrates with the filter context to manage the range values
 * and provides a user-friendly interface for range selection.
 */

export function RangeFacet({
    filter,
    value,
    onChange,
    className,
}: RangeFacetProps) {
    const { strings } = useFilters();

    const [minValue, setMinValue] = useState<string>(
        value.min?.toString() ?? '',
    );
    const [maxValue, setMaxValue] = useState<string>(
        value.max?.toString() ?? '',
    );
    const instanceId = useId(); // Keep ids unique when multiple range facets render

    // Stabilize callback and value refs to keep the effect dep-light
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const valueRef = useRef(value);
    valueRef.current = value;

    useEffect(() => {
        const timeout = setTimeout(() => {
            const currentValue = valueRef.current;
            const newValue = {
                min: minValue ? Number(minValue) : undefined,
                max: maxValue ? Number(maxValue) : undefined,
            };
            if (newValue.min !== currentValue.min || newValue.max !== currentValue.max) {
                onChangeRef.current(newValue);
            }
        }, filter.delay ?? 500);

        return () => clearTimeout(timeout);
    }, [minValue, maxValue, filter.delay]);

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^\d*\.?\d*$/.test(val)) {
            setMinValue(val);
        }
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^\d*\.?\d*$/.test(val)) {
            setMaxValue(val);
        }
    };

    return (
        <div className={cn('space-y-2', className)}>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label htmlFor={`${instanceId}-min`}>
                        {strings.min}
                    </Label>
                    <Input
                        id={`${instanceId}-min`}
                        type="text"
                        value={minValue}
                        onChange={handleMinChange}
                        placeholder={strings.min}
                        className="w-full"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor={`${instanceId}-max`}>
                        {strings.max}
                    </Label>
                    <Input
                        id={`${instanceId}-max`}
                        type="text"
                        value={maxValue}
                        onChange={handleMaxChange}
                        placeholder={strings.max}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
