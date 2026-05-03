import { useState, useEffect, useCallback } from 'react';
import * as baseui from '@/components/ui/select';
import { Label, Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';
import { formControlSizeClasses, resolveFormControlSize } from '../form-sizing';
import { DecimalInput } from './decimal-input';

export interface DimensionObject {
    width?: string;
    height?: string;
    depth?: string;
}

export type DimensionValue = string | DimensionObject;

export interface DimensionsInputStrings {
    width: string;
    height: string;
    depth: string;
    unit: string;
    widthPlaceholder: string;
    heightPlaceholder: string;
    depthPlaceholder: string;
}

export const defaultDimensionsInputStrings: DimensionsInputStrings = {
    width: 'Width',
    height: 'Height',
    depth: 'Depth',
    unit: 'Unit',
    widthPlaceholder: '0.00',
    heightPlaceholder: '0.00',
    depthPlaceholder: '0.00',
};

export interface DimensionsInputProps {
    /** Current value (string "WxHxD" or object { width, height, depth }) */
    value?: DimensionValue;

    /** Default value for uncontrolled mode */
    defaultValue?: DimensionValue;

    /** Format type: 'string' for "WxHxD" or 'object' for { width, height, depth } */
    format?: 'string' | 'object';

    /** Current unit value */
    unit?: 'g' | 'kg';

    /** Default unit for uncontrolled mode */
    defaultUnit?: 'g' | 'kg';

    /** Label for width input (sub-label) */
    widthLabel?: string;

    /** Label for height input (sub-label) */
    heightLabel?: string;

    /** Label for depth/length input (sub-label) */
    depthLabel?: string;

    /** Label for unit selector (sub-label) */
    unitLabel?: string;

    /** Placeholder for the unit select */
    unitPlaceholder?: string;

    /** Placeholder for width */
    widthPlaceholder?: string;

    /** Placeholder for height */
    heightPlaceholder?: string;

    /** Placeholder for depth */
    depthPlaceholder?: string;

    /** Form control size — flows through `useFormsConfig().defaultControlSize`. */
    size?: FormControlSize;

    /** Callback when value changes */
    onChange?: (e: { target: { value: DimensionValue } }) => void;

    /** Callback when unit changes */
    onUnitChange?: (unit: 'g' | 'kg') => void;

    /** Number of decimal places. Defaults to 2 */
    decimalPlaces?: number;

    /** Minimum value for all dimensions */
    min?: number;

    /** Maximum value for all dimensions */
    max?: number;

    /** Show unit selector. Defaults to true */
    showUnitSelector?: boolean;

    /** Disable unit selector */
    disableUnitSelector?: boolean;

    /** Layout orientation. Defaults to 'horizontal' */
    layout?: 'horizontal' | 'vertical';

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Disabled state */
    disabled?: boolean;

    /** Additional CSS classes */
    className?: string;

    /** String overrides merged over defaults. Direct props (e.g. `widthLabel`) win over `strings` keys. */
    strings?: StringsProp<DimensionsInputStrings>;
}

// Unit options
const UNIT_OPTIONS = [
    { value: 'g', label: 'g (grams)' },
    { value: 'kg', label: 'kg (kilograms)' },
] as const;

const parseDimensionValue = (
    value: DimensionValue | undefined,
    format: 'string' | 'object'
): { width: string; height: string; depth: string } => {
    if (!value) {
        return { width: '', height: '', depth: '' };
    }

    if (format === 'string' && typeof value === 'string') {
        const parts = value.split('x').map((p) => p.trim());
        return {
            width: parts[0] || '',
            height: parts[1] || '',
            depth: parts[2] || '',
        };
    }

    if (format === 'object' && typeof value === 'object') {
        return {
            width: value.width || '',
            height: value.height || '',
            depth: value.depth || '',
        };
    }

    return { width: '', height: '', depth: '' };
};

const formatDimensionValue = (
    width: string,
    height: string,
    depth: string,
    format: 'string' | 'object'
): DimensionValue => {
    if (format === 'string') {
        return `${width}x${height}x${depth}`;
    }
    return { width, height, depth };
};

export function DimensionsInput({
    value: controlledValue,
    defaultValue,
    format = 'string',
    unit: controlledUnit,
    defaultUnit = 'g',
    widthLabel,
    heightLabel,
    depthLabel,
    unitLabel,
    unitPlaceholder,
    widthPlaceholder,
    heightPlaceholder,
    depthPlaceholder,
    onChange,
    onUnitChange,
    decimalPlaces = 2,
    min = 0,
    max,
    showUnitSelector = true,
    disableUnitSelector = false,
    layout = 'horizontal',
    invalid,
    disabled = false,
    className,
    size: sizeProp,
    strings: stringsProp,
}: DimensionsInputProps) {
    const { defaultControlSize } = useFormsConfig();
    const size = resolveFormControlSize(sizeProp, defaultControlSize);
    const strings = useStrings(defaultDimensionsInputStrings, stringsProp);
    const resolvedWidthLabel = widthLabel ?? strings.width;
    const resolvedHeightLabel = heightLabel ?? strings.height;
    const resolvedDepthLabel = depthLabel ?? strings.depth;
    const resolvedUnitPlaceholder = unitPlaceholder ?? strings.unit;
    const resolvedWidthPlaceholder = widthPlaceholder ?? strings.widthPlaceholder;
    const resolvedHeightPlaceholder = heightPlaceholder ?? strings.heightPlaceholder;
    const resolvedDepthPlaceholder = depthPlaceholder ?? strings.depthPlaceholder;
    const shouldShowInlineLabels = layout === 'horizontal';
    const shouldShowVerticalLabels = layout === 'vertical';
    const shouldShowUnitSelector = showUnitSelector === true;
    const hasUnitLabel = (unitLabel ?? '').length > 0;
    const widthFieldLabel = shouldShowVerticalLabels ? resolvedWidthLabel : '';
    const heightFieldLabel = shouldShowVerticalLabels ? resolvedHeightLabel : '';
    const depthFieldLabel = shouldShowVerticalLabels ? resolvedDepthLabel : '';

    // Determine if value is controlled
    const isValueControlled = controlledValue !== undefined;
    const isUnitControlled = controlledUnit !== undefined;

    // Parse initial value
    const initialParsed = parseDimensionValue(
        isValueControlled ? controlledValue : defaultValue,
        format
    );

    // Internal state for uncontrolled mode
    const [internalWidth, setInternalWidth] = useState(initialParsed.width);
    const [internalHeight, setInternalHeight] = useState(initialParsed.height);
    const [internalDepth, setInternalDepth] = useState(initialParsed.depth);
    const [internalUnit, setInternalUnit] = useState(controlledUnit || defaultUnit);

    // Get current values
    const parsedValue = parseDimensionValue(controlledValue, format);
    const widthValue = isValueControlled ? parsedValue.width : internalWidth;
    const heightValue = isValueControlled ? parsedValue.height : internalHeight;
    const depthValue = isValueControlled ? parsedValue.depth : internalDepth;
    const unitValue = isUnitControlled ? controlledUnit : internalUnit;

    // Sync internal state when controlled value changes
    useEffect(() => {
        if (isValueControlled) {
            const parsed = parseDimensionValue(controlledValue, format);
            setInternalWidth(parsed.width);
            setInternalHeight(parsed.height);
            setInternalDepth(parsed.depth);
        }
    }, [controlledValue, format, isValueControlled]);

    // Handle dimension changes
    const handleDimensionChange = useCallback(
        (dimension: 'width' | 'height' | 'depth', newValue: string) => {
            let updatedWidth = widthValue;
            let updatedHeight = heightValue;
            let updatedDepth = depthValue;

            if (dimension === 'width') updatedWidth = newValue;
            if (dimension === 'height') updatedHeight = newValue;
            if (dimension === 'depth') updatedDepth = newValue;

            if (!isValueControlled) {
                setInternalWidth(updatedWidth);
                setInternalHeight(updatedHeight);
                setInternalDepth(updatedDepth);
            }

            const formattedValue = formatDimensionValue(updatedWidth, updatedHeight, updatedDepth, format);
            onChange?.({ target: { value: formattedValue } });
        },
        [widthValue, heightValue, depthValue, isValueControlled, format, onChange]
    );

    const handleUnitChange = useCallback(
        (newUnit: string | null) => {
            if (newUnit === null) return;
            const typedUnit = newUnit as 'g' | 'kg';
            if (!isUnitControlled) {
                setInternalUnit(typedUnit);
            }
            onUnitChange?.(typedUnit);
        },
        [isUnitControlled, onUnitChange]
    );

    const unitSelector = (
        <div className="space-y-2">
            {!!hasUnitLabel && <Label className="leading-6">{unitLabel}</Label>}
            <baseui.Select
                value={unitValue}
                onValueChange={(value) => handleUnitChange(value)}
                disabled={disabled || disableUnitSelector}
            >
                <baseui.SelectTrigger
                    aria-invalid={invalid || undefined}
                    className={cn(
                        'border-input bg-transparent',
                        formControlSizeClasses[size],
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        'w-32',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <baseui.SelectValue placeholder={resolvedUnitPlaceholder} />
                </baseui.SelectTrigger>
                <baseui.SelectContent>
                    <baseui.SelectGroup>
                        {UNIT_OPTIONS.map((unit) => (
                            <baseui.SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                            </baseui.SelectItem>
                        ))}
                    </baseui.SelectGroup>
                </baseui.SelectContent>
            </baseui.Select>
        </div>
    );

    return (
        <div className={cn('space-y-2', className)}>
            {/* Dimensions Inputs */}
            <div
                className={cn(
                    'flex gap-2',
                    layout === 'vertical' ? 'flex-col' : 'flex-row items-start'
                )}
            >
                {/* Width */}
                <div className="flex-1 space-y-1">
                    {!!shouldShowVerticalLabels && !!widthFieldLabel && <Label>{widthFieldLabel}</Label>}
                    <DecimalInput
                        size={size}
                        value={widthValue}
                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                        placeholder={resolvedWidthPlaceholder}
                        decimalPlaces={decimalPlaces}
                        min={min}
                        max={max}
                        disabled={disabled}
                        invalid={invalid}
                        aria-label={resolvedWidthLabel}
                    />
                    {!!shouldShowInlineLabels && (
                        <Text size="xs" type="secondary" className="text-center">
                            {resolvedWidthLabel}
                        </Text>
                      )}
                </div>

                {/* Separator */}
                {layout === 'horizontal' && (
                    <div className="flex items-center pt-2">
                        <Text tag="span" type="secondary">×</Text>
                    </div>
                )}

                {/* Height */}
                <div className="flex-1 space-y-1">
                    {!!shouldShowVerticalLabels && !!heightFieldLabel && <Label>{heightFieldLabel}</Label>}
                    <DecimalInput
                        size={size}
                        value={heightValue}
                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                        placeholder={resolvedHeightPlaceholder}
                        decimalPlaces={decimalPlaces}
                        min={min}
                        max={max}
                        disabled={disabled}
                        invalid={invalid}
                        aria-label={resolvedHeightLabel}
                    />
                    {!!shouldShowInlineLabels && (
                        <Text size="xs" type="secondary" className="text-center">
                            {resolvedHeightLabel}
                        </Text>
                      )}
                </div>

                {/* Separator */}
                {layout === 'horizontal' && (
                    <div className="flex items-center pt-2">
                        <Text tag="span" type="secondary">×</Text>
                    </div>
                )}

                {/* Depth */}
                <div className="flex-1 space-y-1">
                    {!!shouldShowVerticalLabels && !!depthFieldLabel && <Label>{depthFieldLabel}</Label>}
                    <DecimalInput
                        size={size}
                        value={depthValue}
                        onChange={(e) => handleDimensionChange('depth', e.target.value)}
                        placeholder={resolvedDepthPlaceholder}
                        decimalPlaces={decimalPlaces}
                        min={min}
                        max={max}
                        disabled={disabled}
                        invalid={invalid}
                        aria-label={resolvedDepthLabel}
                    />
                    {!!shouldShowInlineLabels && (
                        <Text size="xs" type="secondary" className="text-center">
                            {resolvedDepthLabel}
                        </Text>
                      )}
                </div>

                {/* Unit Selector */}
                {!!shouldShowUnitSelector && (
                    <div className={cn(layout === 'vertical' ? 'w-full' : 'w-32 pt-0')}>
                        {unitSelector}
                        {!!shouldShowInlineLabels && !hasUnitLabel && (
                            <Text size="xs" type="secondary" className="mt-1 text-center">
                                {resolvedUnitPlaceholder}
                            </Text>
                          )}
                    </div>
                  )}
            </div>
        </div>
    );
}

DimensionsInput.displayName = 'DimensionsInput';
