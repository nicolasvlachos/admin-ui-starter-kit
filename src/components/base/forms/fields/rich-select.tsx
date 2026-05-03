import {
    forwardRef,
    type ReactNode,
    useMemo,
    useCallback,
    useState,
} from 'react';
import * as baseui from '@/components/ui/select';
import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';
import { formControlMinHeightClasses, formControlSizeClasses, resolveFormControlSize } from '../form-sizing';

export interface RichSelectStrings {
    placeholder: string;
}

export const defaultRichSelectStrings: RichSelectStrings = {
    placeholder: 'Select an item',
};

export interface RichSelectOption {
    value: string;
    label: string;
    description?: string;
    icon?: ReactNode;
    disabled?: boolean;
}

export interface RichSelectProps {
    /** Available options */
    options: RichSelectOption[];

    /** Change handler */
    onChange?: (value: string | undefined) => void;

    /** Additional class names */
    className?: string;

    /** Placeholder text — overrides `strings.placeholder` when provided. */
    placeholder?: string;

    /** String overrides (e.g. placeholder) merged over defaults. */
    strings?: StringsProp<RichSelectStrings>;

    /** Allow clearing the selection */
    allowClear?: boolean;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

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

    /** Form control size — flows through `useFormsConfig().defaultControlSize`. */
    size?: FormControlSize;
}

// Internal value for "empty" selection
const EMPTY_OPTION_VALUE = '__rich_select_empty__';

/**
 * RichSelect - Select with description and icon support
 */
export const RichSelect = forwardRef<HTMLButtonElement, RichSelectProps>(
    (
        {
            options,
            placeholder,
            strings: stringsProp,
            onChange,
            className,
            disabled,
            defaultOpen,
            open,
            onOpenChange,
            name,
            required,
            value,
            defaultValue,
            allowClear = false,
            invalid,
            size: sizeProp,
        },
        ref
    ) => {
        const { defaultControlSize } = useFormsConfig();
        const size = resolveFormControlSize(sizeProp, defaultControlSize);
        const strings = useStrings(defaultRichSelectStrings, stringsProp);
        const resolvedPlaceholder = placeholder ?? strings.placeholder;
        const mapToInternalValue = useCallback(
            (optionValue?: string | null) => {
                if (optionValue === EMPTY_OPTION_VALUE) {
                    return undefined;
                }

                if (optionValue === '' || optionValue === null || optionValue === undefined) {
                    return allowClear ? EMPTY_OPTION_VALUE : undefined;
                }

                return optionValue;
            },
            [allowClear],
        );

        const mapFromInternalValue = useCallback((optionValue: string): string | undefined => {
            if (optionValue === EMPTY_OPTION_VALUE) {
                return undefined;
            }
            return optionValue;
        }, []);

        const normalizedOptions = useMemo(() => {
            const mapped = options.map((option) => ({
                ...option,
                value: mapToInternalValue(option.value) ?? '',
            }));

            if (allowClear) {
                const hasExplicitPlaceholder = mapped.some((option) => option.label === resolvedPlaceholder);
                if (!hasExplicitPlaceholder) {
                    mapped.unshift({
                        label: resolvedPlaceholder,
                        value: EMPTY_OPTION_VALUE,
                    });
                }
            }

            return mapped;
        }, [options, allowClear, resolvedPlaceholder, mapToInternalValue]);

        const normalizedValue = useMemo(() => mapToInternalValue(value ?? undefined), [value, mapToInternalValue]);
        const normalizedDefaultValue = useMemo(() => mapToInternalValue(defaultValue ?? undefined), [defaultValue, mapToInternalValue]);
        const isControlled = value !== undefined;
        const [internalValue, setInternalValue] = useState<string | undefined>(
            normalizedDefaultValue,
        );
        const effectiveValue = isControlled ? normalizedValue : internalValue;
        const selectedOption = useMemo(
            () =>
                normalizedOptions.find(
                    (option) => option.value === effectiveValue,
                ),
            [effectiveValue, normalizedOptions],
        );

        const handleValueChange = useCallback(
            (nextValue: string | null | undefined) => {
                if (nextValue !== null && nextValue !== undefined) {
                    if (!isControlled) {
                        setInternalValue(nextValue);
                    }
                    onChange?.(mapFromInternalValue(nextValue));
                }
            },
            [isControlled, onChange, mapFromInternalValue]
        );

        // Trigger chrome aligned with `Select`'s canonical shape:
        //   - `border-input bg-transparent rounded-md` (was raw `neutral-300`
        //     palette + `rounded-lg`).
        //   - `formControlSizeClasses[size]` so density flows through
        //     `<UIProvider forms={{ defaultControlSize }}>` (rule 17).
        //   - `focus-visible:border-ring + ring-ring/50 + ring-[3px]` (was a
        //     bespoke `outline-3 outline-primary-400` pattern).
        //   - `aria-invalid:` selectors for invalid chrome (was a manual
        //     `invalid && '…'` conditional with raw `error-100/300/600`
        //     palette tokens — rule 6 violation).
        //   - `disabled:opacity-50 disabled:cursor-not-allowed` to match
        //     every other field (was `opacity-40 grayscale`).
        const inputClassNames = cn(
            'border-input bg-transparent w-full rounded-md border outline-none transition-[color,box-shadow] !shadow-none',
            formControlSizeClasses[size],
            formControlMinHeightClasses[size],
            'h-auto py-2',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-destructive',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
        );
        const valueProps = isControlled
            ? { value: normalizedValue }
            : {};

        return (
            <baseui.Select
                onValueChange={(value) => handleValueChange(value)}
                disabled={disabled}
                defaultOpen={defaultOpen}
                open={open}
                onOpenChange={onOpenChange}
                name={name}
                required={required}
                defaultValue={normalizedDefaultValue}
                {...valueProps}
            >
                <baseui.SelectTrigger ref={ref} className={inputClassNames} aria-invalid={invalid}>
                    {selectedOption ? (
                        <Text tag="span" className="text-left break-words whitespace-normal">
                            {selectedOption.label}
                        </Text>
                    ) : (
                        <baseui.SelectValue placeholder={resolvedPlaceholder} />
                    )}
                </baseui.SelectTrigger>
                <baseui.SelectContent>
                    <baseui.SelectGroup>
                        {normalizedOptions.map((option) => (
                            <baseui.SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                <div className="flex w-full items-center gap-2">
                                    {!!option.icon && (
                                        <span className="w-4 h-4 shrink-0 flex items-center justify-center self-start mt-0.5">
                                            {option.icon}
                                        </span>
                                      )}
                                    <div className="flex flex-col min-w-0 text-left flex-1">
                                        <Text tag="span" weight="medium">{option.label}</Text>
                                        {!!option.description && (
                                            <Text tag="span" size="xs" type="secondary" lineHeight="tight" className="mt-0.5 line-clamp-2">
                                                {option.description}
                                            </Text>
                                          )}
                                    </div>
                                </div>
                            </baseui.SelectItem>
                        ))}
                    </baseui.SelectGroup>
                </baseui.SelectContent>
            </baseui.Select>
        );
    }
);

RichSelect.displayName = 'RichSelect';
