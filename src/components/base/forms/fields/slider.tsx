import * as React from 'react';
import { useCallback, useId, useMemo, type ElementRef } from 'react';
import { Slider as SliderPrimitive } from '@/components/ui/slider';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface SliderImitationEvent {
    target: {
        name: string;
        value: number;
    };
}

export interface SliderProps {
    /** Field name for form integration */
    name?: string;

    /** Element id */
    id?: string;

    /** Current value (single thumb) */
    value?: number;

    /** Default value when uncontrolled */
    defaultValue?: number;

    /** Minimum value. Defaults to 0 */
    min?: number;

    /** Maximum value. Defaults to 100 */
    max?: number;

    /** Step increment. Defaults to 1 */
    step?: number;

    /** Whether the slider is disabled */
    disabled?: boolean;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Event-style change handler for react-hook-form compatibility */
    onChange?: (event: SliderImitationEvent) => void;

    /** Raw value change handler (alternative to onChange) */
    onValueChange?: (value: number) => void;

    /** Fires on pointer up / keyboard commit */
    onValueCommitted?: (value: number) => void;

    /** Show the current value next to the slider */
    showValue?: boolean;

    /** Format the displayed value */
    formatValue?: (value: number) => string;

    /** Unit suffix displayed after the value (e.g. "px", "%", "mm") */
    unit?: string;

    /** Additional class name for the root wrapper */
    className?: string;

    /** Orientation */
    orientation?: 'horizontal' | 'vertical';
}

type SliderElement = ElementRef<typeof SliderPrimitive>;

function SliderFieldImpl(
    {
        name,
        id,
        value,
        defaultValue,
        min = 0,
        max = 100,
        step = 1,
        disabled = false,
        invalid = false,
        onChange,
        onValueChange,
        onValueCommitted,
        showValue = false,
        formatValue,
        unit,
        className,
        orientation = 'horizontal',
    }: SliderProps,
    ref: React.ForwardedRef<SliderElement>,
) {
    const generatedId = useId();
    const resolvedId = id ?? `slider-${generatedId}`;
    const resolvedName = name ?? resolvedId;

    const handleValueChange = useCallback(
        (newValue: number | readonly number[]) => {
            const singleValue = Array.isArray(newValue) ? newValue[0] : newValue;

            onValueChange?.(singleValue);

            onChange?.({
                target: { name: resolvedName, value: singleValue },
            });
        },
        [resolvedName, onChange, onValueChange]
    );

    const handleValueCommitted = useCallback(
        (newValue: number | readonly number[]) => {
            const singleValue = Array.isArray(newValue) ? newValue[0] : newValue;
            onValueCommitted?.(singleValue);
        },
        [onValueCommitted]
    );

    const displayValue = useMemo(() => {
        if (!showValue) return null;

        const currentValue = value ?? defaultValue ?? min;

        if (formatValue) return formatValue(currentValue);

        return unit ? `${currentValue}${unit}` : String(currentValue);
    }, [showValue, value, defaultValue, min, formatValue, unit]);

    // Wrap single value in array for the primitive
    const sliderValue = value !== undefined ? [value] : undefined;
    const sliderDefaultValue = defaultValue !== undefined ? [defaultValue] : [min];

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <SliderPrimitive
                ref={ref}
                id={resolvedId}
                value={sliderValue}
                defaultValue={sliderDefaultValue}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                orientation={orientation}
                onValueChange={handleValueChange}
                onValueCommitted={handleValueCommitted}
                aria-invalid={invalid || undefined}
                className={cn(
                    'min-w-0 flex-1',
                    invalid && '[&_[data-slot=slider-range]]:bg-destructive [&_[data-slot=slider-thumb]]:border-destructive',
                )}
            />

            {!!showValue && displayValue !== null && (
                <Text
                    tag="span"
                    type={invalid ? 'error' : 'secondary'}
                    className="min-w-[3ch] shrink-0 text-right tabular-nums"
                >
                    {displayValue}
                </Text>
            )}
        </div>
    );
}

const SliderField = React.forwardRef<SliderElement, SliderProps>(SliderFieldImpl);
SliderField.displayName = 'SliderField';

export { SliderField };
