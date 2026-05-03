import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import * as baseui from '@/components/ui/select';
import { Label } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';
import { formControlSizeClasses, resolveFormControlSize } from '../form-sizing';
import { DecimalInput } from './decimal-input';

export type WeightUnit = 'g' | 'kg' | 'lb' | 'oz';

export interface WeightInputStrings {
    /** Above-field label for the unit selector. Empty string hides it. */
    unitLabel: string;
    /** Placeholder shown in the unit selector. */
    unitPlaceholder: string;
}

export const defaultWeightInputStrings: WeightInputStrings = {
    unitLabel: '',
    unitPlaceholder: '',
};

export interface WeightInputProps {
    /** Controlled value */
    value?: string;

    /** Default value for uncontrolled mode */
    defaultValue?: string;

    /** Current unit */
    unit?: WeightUnit;

    /** Default unit for uncontrolled mode */
    defaultUnit?: WeightUnit;

    /** Value change handler */
    onChange?: (e: { target: { value: string } }) => void;

    /** Unit change handler */
    onUnitChange?: (unit: WeightUnit) => void;

    /** Number of decimal places */
    decimalPlaces?: number;

    /** Minimum value */
    min?: number;

    /** Maximum value */
    max?: number;

    /** Show unit selector */
    showUnitSelector?: boolean;

    /** Disable unit selector */
    disableUnitSelector?: boolean;

    /** @deprecated Use `strings.unitLabel`. */
    unitLabel?: string;

    /** @deprecated Use `strings.unitPlaceholder`. */
    unitPlaceholder?: string;

    /** Override default strings (unit selector label + placeholder). */
    strings?: StringsProp<WeightInputStrings>;

    /** Width of unit selector */
    unitWidth?: string;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Disabled state */
    disabled?: boolean;

    /** Form control size — flows through `useFormsConfig().defaultControlSize`. */
    size?: FormControlSize;

    /** Additional class names */
    className?: string;
}

const UNIT_OPTIONS: Array<{ value: WeightUnit; label: string }> = [
    { value: 'g', label: 'g' },
    { value: 'kg', label: 'kg' },
    { value: 'lb', label: 'lb' },
    { value: 'oz', label: 'oz' },
];

export function WeightInput({
    value: controlledValue,
    defaultValue,
    unit: controlledUnit,
    defaultUnit = 'g',
    onChange,
    onUnitChange,
    decimalPlaces = 2,
    min = 0,
    max,
    showUnitSelector = true,
    disableUnitSelector = false,
    unitLabel,
    unitPlaceholder,
    unitWidth = 'w-24',
    strings: stringsProp,
    invalid,
    disabled = false,
    size: sizeProp,
    className,
}: WeightInputProps) {
    const { defaultControlSize } = useFormsConfig();
    const size = resolveFormControlSize(sizeProp, defaultControlSize);
    const strings = useStrings(defaultWeightInputStrings, {
        ...(unitLabel !== undefined ? { unitLabel } : {}),
        ...(unitPlaceholder !== undefined ? { unitPlaceholder } : {}),
        ...stringsProp,
    });
    const isValueControlled = controlledValue !== undefined;
    const isUnitControlled = controlledUnit !== undefined;

    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const [internalUnit, setInternalUnit] = useState<WeightUnit>(controlledUnit ?? defaultUnit);

    const value = isValueControlled ? controlledValue ?? '' : internalValue;
    const unit = isUnitControlled ? controlledUnit ?? defaultUnit : internalUnit;

    const handleValueChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!isValueControlled) {
                setInternalValue(e.target.value);
            }
            onChange?.({ target: { value: e.target.value } });
        },
        [isValueControlled, onChange]
    );

    const handleUnitChange = useCallback(
        (nextUnit: string | null) => {
            if (nextUnit === null) return;
            const weightUnit = nextUnit as WeightUnit;
            if (!isUnitControlled) {
                setInternalUnit(weightUnit);
            }
            onUnitChange?.(weightUnit);
        },
        [isUnitControlled, onUnitChange]
    );

    const unitOptions = useMemo(() => UNIT_OPTIONS, []);
    const hasUnitLabel = strings.unitLabel !== '';

    return (
        <div className={cn('flex items-start gap-2', className)}>
            <div className="flex-1">
                <DecimalInput
                    size={size}
                    value={value}
                    onChange={handleValueChange}
                    decimalPlaces={decimalPlaces}
                    allowNegative={false}
                    min={min}
                    max={max}
                    disabled={disabled}
                    invalid={invalid}
                />
            </div>
            {!!showUnitSelector && (
                <div className="space-y-2">
                    {!!hasUnitLabel && <Label className="leading-6">{strings.unitLabel}</Label>}
                    <baseui.Select value={unit} onValueChange={(value) => handleUnitChange(value)} disabled={disabled || disableUnitSelector}>
                        <baseui.SelectTrigger
                            aria-invalid={invalid || undefined}
                            className={cn(
                                'border-input bg-transparent !shadow-none',
                                formControlSizeClasses[size],
                                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                                (disabled || disableUnitSelector) && 'opacity-50 cursor-not-allowed',
                                unitWidth
                            )}
                        >
                            <baseui.SelectValue placeholder={strings.unitPlaceholder || undefined} />
                        </baseui.SelectTrigger>
                        <baseui.SelectContent>
                            <baseui.SelectGroup>
                                {unitOptions.map((option) => (
                                    <baseui.SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </baseui.SelectItem>
                                ))}
                            </baseui.SelectGroup>
                        </baseui.SelectContent>
                    </baseui.Select>
                </div>
              )}
        </div>
    );
}

WeightInput.displayName = 'WeightInput';
