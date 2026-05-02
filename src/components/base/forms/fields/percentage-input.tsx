/**
 * PercentageInput — DecimalInput configured for 0..100 percent values with a
 * trailing `%` add-on. Inherits stepper / rounding / normalisation features
 * from DecimalInput.
 */
import { forwardRef } from 'react';
import { DecimalInput, type DecimalInputProps } from './decimal-input';

export type PercentageInputProps = Omit<
    DecimalInputProps,
    'min' | 'max' | 'allowNegative' | 'endAddon'
> & {
    /** Minimum percentage value. Defaults to 0. */
    min?: number;
    /** Maximum percentage value. Defaults to 100. */
    max?: number;
};

export const PercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>(
    function PercentageInput({ decimalPlaces = 2, min = 0, max = 100, step, ...props }, ref) {
        return (
            <DecimalInput
                ref={ref}
                decimalPlaces={decimalPlaces}
                allowNegative={false}
                min={min}
                max={max}
                step={step}
                endAddon="%"
                {...props}
            />
        );
    },
);

PercentageInput.displayName = 'PercentageInput';
