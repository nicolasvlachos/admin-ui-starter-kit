import { CircleXIcon, Loader2Icon, type LucideIcon } from 'lucide-react';
import * as React from 'react';
import { useRef, useCallback, useMemo, memo } from 'react';
import { Text } from '@/components/typography';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { formControlSizeClasses, resolveFormControlSize } from '../form-sizing';
import { useFormFieldState } from './hooks';

export interface InputStrings {
    clear: string;
}

export const defaultInputStrings: InputStrings = {
    clear: 'Clear input',
};

/**
 * Helper function to get value with prefix/suffix
 */
const getValueWithAddons = (value: string, startAddon?: string, endAddon?: string): string => {
    let result = value || '';
    if (startAddon && result) result = startAddon + result;
    if (endAddon && result) result = result + endAddon;
    return result;
};

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'size'> {
    // Icon props
    startIcon?: LucideIcon;
    endIcon?: LucideIcon;

    // Add-on props (visual prefix/suffix inside input)
    startAddon?: string;
    endAddon?: string;

    // Character limit
    maxLength?: number;
    showCharacterCount?: boolean;

    // Clear button
    clearable?: boolean;
    onClear?: () => void;

    // Loading state
    isLoading?: boolean;

    // Return value with addons in onChange
    returnValueWithAddons?: boolean;

    // Error state for styling (passed from FormField)
    invalid?: boolean;

    // Visual size
    size?: FormControlSize;

    // Value props
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    defaultValue?: string;

    // String overrides (e.g. clear button aria-label)
    strings?: StringsProp<InputStrings>;
}

function InputImpl(
	{
		className,
		type = 'text',
		startIcon: StartIcon,
		endIcon: EndIcon,
		startAddon,
		endAddon,
		maxLength,
		showCharacterCount,
		clearable,
		onClear,
		isLoading,
		returnValueWithAddons,
		invalid,
		size: sizeProp,
		onChange,
		value: controlledValue,
		defaultValue,
		id: providedId,
		strings: stringsProp,
		...props
	}: InputProps,
	forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
    const inputRef = useRef<HTMLInputElement>(null);
    const strings = useStrings(defaultInputStrings, stringsProp);
    const { defaultControlSize } = useFormsConfig();
    const size = resolveFormControlSize(sizeProp, defaultControlSize);

    // Memoize ref callback to avoid recreation on every render
    const setRefs = useCallback(
        (node: HTMLInputElement | null) => {
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else if (forwardedRef) {
                forwardedRef.current = node;
            }
            inputRef.current = node;
        },
        [forwardedRef]
    );

    // Use shared form field state hook
    const {
        id,
        value: inputValue,
        isReactHookForm,
        characterCount,
        hasCharacterLimit,
        showCount,
        hasValue,
        updateValue,
        clearValue,
        wouldExceedLimit,
    } = useFormFieldState({
        controlledValue,
        defaultValue,
        maxLength,
        showCharacterCount,
        providedId,
        idPrefix: 'input',
        hasOnChange: onChange !== undefined,
    });

    // Derive display states (simple booleans, no need for useMemo)
    const isClearable = !!clearable;
    const isShowingLoading = !!isLoading;
    const hasEndIcon = !!EndIcon;
    const hasEndAddon = !!endAddon;
    const isFileInput = type === 'file';
    const hasError = !!invalid;

    // Memoize padding classes based on add-ons and icons
    // Addon padding sized so the value sits adjacent to the addon — `ps-3`
    // baseline + a measured space for addon text. Wider addons can override
    // via `className` (`ps-16` etc.) at the call site.
    const inputPaddingClasses = useMemo(() => {
        let paddingStart = 'px-3';
        let paddingEnd = 'px-3';

        if (StartIcon) paddingStart = 'ps-9';
        if (startAddon) paddingStart = 'ps-10';

        if (EndIcon) paddingEnd = 'pe-9';
        if (endAddon) paddingEnd = 'pe-10';
        if ((isClearable && hasValue) || isShowingLoading) paddingEnd = 'pe-9';
        if (showCount) paddingEnd = 'pe-14';

        return `${paddingStart} ${paddingEnd}`;
    }, [StartIcon, startAddon, EndIcon, endAddon, isClearable, hasValue, isShowingLoading, showCount]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;

            // Check character limit
            if (wouldExceedLimit(newValue)) {
                return;
            }

            // Update internal state if uncontrolled
            updateValue(newValue);

            // Call external onChange with modified event if addons are requested
            if (onChange) {
                if (returnValueWithAddons) {
                    const valueWithAddons = getValueWithAddons(newValue, startAddon, endAddon);
                    const modifiedEvent = {
                        ...e,
                        target: { ...e.target, value: valueWithAddons },
                        currentTarget: { ...e.currentTarget, value: valueWithAddons },
                    };
                    onChange(modifiedEvent as React.ChangeEvent<HTMLInputElement>);
                } else {
                    onChange(e);
                }
            }
        },
        [onChange, returnValueWithAddons, startAddon, endAddon, updateValue, wouldExceedLimit]
    );

    const handleClear = useCallback(() => {
        const clearValueWithAddons = returnValueWithAddons
            ? getValueWithAddons('', startAddon, endAddon)
            : '';
        const syntheticEvent = {
            target: { value: clearValueWithAddons },
            currentTarget: { value: clearValueWithAddons },
        } as React.ChangeEvent<HTMLInputElement>;

        // Clear internal state
        clearValue();

        // Notify parent
        onChange?.(syntheticEvent);

        // Execute optional onClear callback
        onClear?.();

        // Focus the input after clearing
        inputRef.current?.focus();
    }, [returnValueWithAddons, startAddon, endAddon, clearValue, onChange, onClear]);

    // Determine what to show in the end position (priority order)
    const showClearButton = isClearable && hasValue && !showCount && !isShowingLoading;
    const showLoadingSpinner = isShowingLoading && !showCount;
    const showEndIcon = hasEndIcon && !isClearable && !showCount && !isShowingLoading;
    const showEndAddon = hasEndAddon && !isClearable && !showCount && !isShowingLoading;

    return (
        <div className={cn('input--component', 'relative')}>
            <input
                ref={setRefs}
                id={id}
                type={type}
                {...(!isReactHookForm && { value: inputValue })}
                onChange={handleInputChange}
                maxLength={maxLength}
                aria-invalid={hasError || undefined}
                disabled={props.disabled || isLoading}
                className={cn(
                    // Base styles
                    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
                    'border-input flex w-full min-w-0 rounded-md border py-1',
                    'transition-[color,box-shadow] outline-none',
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    formControlSizeClasses[size],
                    // File input styles
                    'file:inline-flex file:h-7 file:border file:bg-transparent file:px-3 file:text-sm file:font-medium',
                    isFileInput
                        ? 'cursor-pointer bg-background text-foreground file:cursor-pointer file:rounded-md file:border-input file:bg-background file:text-foreground'
                        : 'bg-transparent',
                    // Focus styles
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    // Invalid/error styles — destructive border, ring, value text
                    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:text-destructive',
                    'aria-invalid:placeholder:text-destructive/40',
                    // Read-only styles
                    isFileInput
                        ? 'read-only:bg-background'
                        : 'read-only:bg-muted',
                    // Dynamic padding
                    inputPaddingClasses,
                    className
                )}
                {...props}
            />

            {/* Start Icon */}
            {!!StartIcon && (
                <div
                    className={cn(
                        'pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3',
                        props.disabled && 'opacity-50',
                        hasError ? 'text-destructive' : 'text-muted-foreground/80'
                    )}
                >
                    <StartIcon size={16} aria-hidden="true" />
                </div>
            )}

            {/* Start Add-on */}
            {!!startAddon && (
                <span
                    className={cn(
                        'pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm',
                        props.disabled && 'opacity-50',
                        hasError ? 'text-destructive' : 'text-muted-foreground'
                    )}
                >
                    {startAddon}
                </span>
            )}

            {/* End Icon */}
            {!!showEndIcon && !!EndIcon && (
                <div
                    className={cn(
                        'pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3',
                        props.disabled && 'opacity-50',
                        hasError ? 'text-destructive' : 'text-muted-foreground/80'
                    )}
                >
                    <EndIcon size={16} aria-hidden="true" />
                </div>
              )}

            {/* End Add-on */}
            {!!showEndAddon && (
                <span
                    className={cn(
                        'pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm',
                        props.disabled && 'opacity-50',
                        hasError ? 'text-destructive' : 'text-muted-foreground'
                    )}
                >
                    {endAddon}
                </span>
              )}

            {/* Character Count */}
            {!!showCount && (
                <div
                    className={cn(
                        'pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums',
                        props.disabled && 'opacity-50',
                        hasError ? 'text-destructive' : 'text-muted-foreground'
                    )}
                    aria-live="polite"
                    role="status"
                >
                    <Text tag="span" size="xs" type={hasError ? 'error' : 'secondary'}>
                        {characterCount}
                        {hasCharacterLimit ? `/${maxLength}` : ''}
                    </Text>
                </div>
              )}

            {/* Loading Spinner */}
            {!!showLoadingSpinner && (
                <div
                    className={cn(
                        'pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3',
                        hasError ? 'text-destructive' : 'text-muted-foreground/80'
                    )}
                >
                    <Loader2Icon size={16} className="animate-spin" aria-hidden="true" />
                </div>
              )}

            {/* Clear Button */}
            {!!showClearButton && (
                <button
                    type="button"
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={strings.clear}
                    onClick={handleClear}
                    disabled={isLoading}
                >
                    <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
        </div>
    );
}

// forwardRef + memo (needed for callers that require refs, e.g. segmented inputs)
const Input = memo(React.forwardRef<HTMLInputElement, InputProps>(InputImpl));
Input.displayName = 'Input';

export { Input };
