import { forwardRef, useMemo, useCallback, memo, type ReactNode } from 'react';
import * as baseui from '@/components/ui/select';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { formControlSizeClasses, resolveFormControlSize } from '../form-sizing';

export interface SelectStrings {
    placeholder: string;
}

export const defaultSelectStrings: SelectStrings = {
    placeholder: 'Select an option',
};

export interface SelectOption {
    value: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
}

export interface SelectProps {
    /** Available options */
    options: SelectOption[];

    /** Placeholder text — overrides `strings.placeholder` when provided. */
    placeholder?: string;

    /** String overrides (e.g. placeholder). */
    strings?: StringsProp<SelectStrings>;

    /** Allow clearing the selection */
    allowClear?: boolean;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Visual size */
    size?: FormControlSize;

    /** Additional class names for the trigger */
    className?: string;

    /** Change handler - returns undefined when cleared */
    onChange?: (value: string | undefined) => void;

    /** Current value */
    value?: string | null;

    /** Default value */
    defaultValue?: string | null;

    /** Disabled state */
    disabled?: boolean;

    /** Field name */
    name?: string;

    /** Required state */
    required?: boolean;

    /** Open state (controlled) */
    open?: boolean;

    /** Default open state */
    defaultOpen?: boolean;

    /** Open change handler */
    onOpenChange?: (open: boolean) => void;
}

// Internal value for "empty" selection (base-ui doesn't allow empty string)
const EMPTY_VALUE = '__select_empty__';

// Pure helper functions - moved outside component to avoid recreation
const toInternal = (val?: string | null): string | undefined => {
    if (val === '' || val === null) return EMPTY_VALUE;
    return val ?? undefined;
};

const toExternal = (val: string): string | undefined => {
    if (val === EMPTY_VALUE) return undefined;
    return val;
};

/**
 * Simplified Select component for use with FormField wrapper.
 * Handles options, placeholder, and allowClear functionality.
 * Chrome (label, hint, error) handled by FormField.
 */
export const Select = memo(
    forwardRef<HTMLButtonElement, SelectProps>(
        (
            {
                options,
                placeholder,
                strings: stringsProp,
                allowClear = false,
                invalid,
                size: sizeProp,
                className,
                onChange,
                disabled,
                defaultOpen,
                open,
                onOpenChange,
                name,
                required,
                value,
                defaultValue,
            },
            ref
        ) => {
            const strings = useStrings(defaultSelectStrings, stringsProp);
            const { defaultControlSize } = useFormsConfig();
            const size = resolveFormControlSize(sizeProp, defaultControlSize);
            const resolvedPlaceholder = placeholder ?? strings.placeholder;
            // Memoize normalized options
            const normalizedOptions = useMemo(() => {
                const mapped: SelectOption[] = options.map((opt) => ({
                    ...opt,
                    value: toInternal(opt.value) ?? '',
                }));

                // Add clear option at the start if allowClear is enabled
                if (allowClear) {
                    const hasClearOption = mapped.some((opt) => opt.value === EMPTY_VALUE);
                    if (!hasClearOption) {
                        mapped.unshift({
                            label: resolvedPlaceholder,
                            value: EMPTY_VALUE,
                        });
                    }
                }

                return mapped;
            }, [options, allowClear, resolvedPlaceholder]);

            const normalizedValue = useMemo(() => toInternal(value), [value]);
            const normalizedDefaultValue = useMemo(() => toInternal(defaultValue), [defaultValue]);
            const selectedLabel = useMemo(() => {
                const selectedValue = normalizedValue ?? normalizedDefaultValue;
                if (selectedValue === undefined) {
                    return undefined;
                }

                return normalizedOptions.find(
                    (option) => option.value === selectedValue,
                )?.label;
            }, [normalizedDefaultValue, normalizedOptions, normalizedValue]);

            const handleValueChange = useCallback(
                (nextValue: string | null) => {
                    if (nextValue !== null) {
                        onChange?.(toExternal(nextValue));
                    }
                },
                [onChange]
            );

            const resolvedInvalid = Boolean(invalid);

        return (
            <baseui.Select
                onValueChange={(value) => handleValueChange(value)}
                disabled={disabled}
                defaultOpen={defaultOpen}
                open={open}
                onOpenChange={onOpenChange}
                name={name}
                required={required}
                value={normalizedValue}
                defaultValue={normalizedDefaultValue}
            >
                <baseui.SelectTrigger
                    ref={ref}
                    aria-invalid={resolvedInvalid || undefined}
                    className={cn(
                        'select--component',
                        // Base styles matching Input — `!shadow-none` strips the
                        // shadcn primitive's baked-in `shadow-xs` so the trigger
                        // matches our flat Input chrome.
                        'flex w-full items-center justify-between rounded-md border px-3 py-1 !shadow-none',
                        'transition-[color,box-shadow] outline-none',
                        formControlSizeClasses[size],
                        // Background
                        'bg-transparent dark:bg-input/30',
                        // Placeholder styling
                        'data-[placeholder]:text-muted-foreground',
                        // Focus styles
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        // Invalid/error styles
                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        // Disabled styles
                        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                >
                    <baseui.SelectValue placeholder={resolvedPlaceholder}>
                        {selectedLabel}
                    </baseui.SelectValue>
                </baseui.SelectTrigger>
                <baseui.SelectContent>
                    <baseui.SelectGroup>
                        {normalizedOptions.map((option) => (
                            <baseui.SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {!!option.icon && (
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 shrink-0">{option.icon}</span>
                                        {option.label}
                                    </div>
                                  )}
                                {!option.icon && option.label}
                            </baseui.SelectItem>
                        ))}
                    </baseui.SelectGroup>
                </baseui.SelectContent>
            </baseui.Select>
        );
        }
    )
);

Select.displayName = 'Select';
