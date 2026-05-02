import { useMemo, useCallback } from 'react';
import { Select, type SelectProps } from './select';

type RoundingMode = string;

export interface RoundingModeSelectProps extends Omit<SelectProps, 'options' | 'value' | 'onChange'> {
    /** Current rounding mode value */
    value?: RoundingMode;

    /** Change handler */
    onChange?: (value: RoundingMode | undefined) => void;

    /** Custom labels for rounding modes */
    labels?: Partial<Record<RoundingMode, string>>;
}

const ORDERED_MODES: RoundingMode[] = ['floor', 'half_up', 'ceil'];

export function RoundingModeSelect({ value, onChange, labels, placeholder, ...props }: RoundingModeSelectProps) {
    const options = useMemo(
        () =>
            ORDERED_MODES.map((mode) => ({
                value: mode,
                label: labels?.[mode] ?? mode,
            })),
        [labels]
    );

    const handleChange = useCallback(
        (next: string | undefined) => {
            onChange?.(next as RoundingMode | undefined);
        },
        [onChange]
    );

    return <Select options={options} value={value} onChange={handleChange} placeholder={placeholder} {...props} />;
}

RoundingModeSelect.displayName = 'RoundingModeSelect';
