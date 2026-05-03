import { useCallback } from 'react';
import { DatePicker } from '@/components/base/date-pickers/date-picker';
import type { DateOutput } from '@/components/base/date-pickers/datepicker.types';

export interface DateTimeInputProps {
    /** Controlled value (ISO string) */
    value?: string;

    /** Change handler */
    onChange?: (value: string | undefined) => void;

    /** Placeholder text */
    placeholder?: string;

    /** Display format for the date */
    readableFormat?: string;

    /** Step for time selection in minutes */
    stepMinutes?: number;

    /** Use modal for picker */
    modal?: boolean;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Disabled state */
    disabled?: boolean;
}

export function DateTimeInput({
    value,
    onChange,
    placeholder,
    readableFormat = 'dd-MM-yyyy HH:mm',
    stepMinutes = 30,
    modal = true,
    invalid,
    disabled,
}: DateTimeInputProps) {
    const dateValue = value ? new Date(value) : undefined;
	const errorValue = invalid ? ' ' : undefined;

    const handleChange = useCallback(
        (output: DateOutput) => {
            onChange?.(output.date ? output.date.toISOString() : undefined);
        },
        [onChange]
    );

    return (
        <DatePicker className="date-time-input--component"
            mode="single"
            disabled={disabled}
            error={errorValue}
            placeholder={placeholder}
            value={dateValue}
            onChange={handleChange}
            readableFormat={readableFormat}
            withTime={{ enabled: true, format: '24', step: stepMinutes }}
            modal={modal}
        />
    );
}

DateTimeInput.displayName = 'DateTimeInput';
