import { CircleXIcon, Loader2Icon } from 'lucide-react';
import * as React from 'react';
import { useRef, useCallback, useEffect } from 'react';
import { Text } from '@/components/typography';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { formTextareaSizeClasses, resolveFormControlSize } from '../form-sizing';
import { useFormFieldState } from './hooks';

export interface TextareaStrings {
    clear: string;
}

export const defaultTextareaStrings: TextareaStrings = {
    clear: 'Clear textarea',
};

export interface TextareaProps extends Omit<React.ComponentProps<'textarea'>, 'onChange'> {
    // String overrides (e.g. clear button aria-label)
    strings?: StringsProp<TextareaStrings>;
    // Character limit
    maxLength?: number;
    showCharacterCount?: boolean;

    // Clear button
    clearable?: boolean;
    onClear?: () => void;

    // Loading state
    isLoading?: boolean;

    // Error state for styling (passed from FormField)
    invalid?: boolean;

    // Visual size
    size?: FormControlSize;

    // Auto-resize functionality
    autoResize?: boolean;
    minRows?: number;
    maxRows?: number;

    // Value props
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value?: string;
    defaultValue?: string;
}

const TextareaImpl = (
    {
        className,
        maxLength,
        showCharacterCount,
        clearable,
        onClear,
        isLoading,
        invalid,
        size: sizeProp,
        autoResize = false,
        minRows = 2,
        maxRows,
        onChange,
        value: controlledValue,
        defaultValue,
        id: providedId,
        strings: stringsProp,
        ...props
    }: TextareaProps,
    forwardedRef: React.ForwardedRef<HTMLTextAreaElement>,
) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const strings = useStrings(defaultTextareaStrings, stringsProp);
    const { defaultControlSize } = useFormsConfig();
    const size = resolveFormControlSize(sizeProp, defaultControlSize);

    // Use shared form field state hook
    const {
        id,
        value: textareaValue,
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
        idPrefix: 'textarea',
        hasOnChange: onChange !== undefined,
    });

    // Derive display states
    const hasError = Boolean(invalid);

    // Cache lineHeight so we call getComputedStyle once instead of on every
    // keystroke — avoids a forced synchronous style recalculation per input.
    const lineHeightRef = useRef<number>(0);

    const adjustHeight = useCallback(() => {
        if (!autoResize || !textareaRef.current) return;

        const textarea = textareaRef.current;

        if (lineHeightRef.current === 0) {
            lineHeightRef.current = parseInt(getComputedStyle(textarea).lineHeight) || 20;
        }

        textarea.style.height = 'auto';

        const lineHeight = lineHeightRef.current;
        const minHeight = lineHeight * minRows;
        const maxHeight = maxRows ? lineHeight * maxRows : Infinity;

        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${newHeight}px`;
    }, [autoResize, maxRows, minRows]);

    useEffect(() => {
        adjustHeight();
    }, [textareaValue, autoResize, adjustHeight]);

    const handleTextareaChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;

            // Check character limit
            if (wouldExceedLimit(newValue)) {
                return;
            }

            // Update internal state if uncontrolled
            updateValue(newValue);

            // Call external onChange
            onChange?.(e);

            // Auto-resize if enabled
            if (autoResize) {
                setTimeout(adjustHeight, 0);
            }
        },
        [onChange, updateValue, wouldExceedLimit, autoResize, adjustHeight]
    );

    const handleClear = useCallback(() => {
        const syntheticEvent = {
            target: { value: '' },
            currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLTextAreaElement>;

        // Clear internal state
        clearValue();

        // Notify parent
        onChange?.(syntheticEvent);

        // Execute optional onClear callback
        onClear?.();

        // Focus the textarea after clearing
        textareaRef.current?.focus();

        // Auto-resize if enabled
        if (autoResize) {
            setTimeout(adjustHeight, 0);
        }
    }, [clearValue, onChange, onClear, autoResize, adjustHeight]);

    // Determine what to show in the end position
    const showClearButton = clearable && hasValue && !isLoading;

    return (
        <div className={cn('textarea--component', 'relative w-full')}>
            <textarea
                ref={(node) => {
                    if (typeof forwardedRef === 'function') {
                        forwardedRef(node);
                    } else if (forwardedRef) {
                        forwardedRef.current = node;
                    }
                    textareaRef.current = node;
                }}
                id={id}
                {...(!isReactHookForm && { value: textareaValue })}
                onChange={handleTextareaChange}
                maxLength={maxLength}
                aria-invalid={hasError || undefined}
                disabled={props.disabled || isLoading}
                rows={minRows}
                style={{
                    resize: autoResize ? 'none' : props.style?.resize,
                    overflow: autoResize && maxRows ? 'auto' : 'visible',
                    ...props.style,
                }}
                className={cn(
                    // Base styles
                    'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
                    'border-input flex w-full rounded-md border bg-transparent px-3 py-2',
                    'transition-[color,box-shadow] outline-none',
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    formTextareaSizeClasses[size],
                    // Focus styles
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    // Invalid/error styles
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    // Dynamic padding for overlays
                    showClearButton && 'pr-10',
                    showCount && 'pr-16',
                    className
                )}
                {...props}
            />

            {/* Character Count */}
            {!!showCount && (
                <div
                    className={cn(
                        'pointer-events-none absolute top-2 right-3 text-xs tabular-nums',
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
            {!!isLoading && !showCount && (
                <div
                    className={cn(
                        'pointer-events-none absolute top-2 right-3',
                        hasError ? 'text-destructive' : 'text-muted-foreground/80'
                    )}
                >
                    <Loader2Icon size={16} className="animate-spin" aria-hidden="true" />
                </div>
              )}

            {/* Clear Button */}
            {!!showClearButton && !showCount && (
                <button
                    type="button"
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={strings.clear}
                    onClick={handleClear}
                    disabled={isLoading}
                >
                    <CircleXIcon size={14} aria-hidden="true" />
                </button>
              )}
        </div>
    );
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(TextareaImpl);
Textarea.displayName = 'Textarea';

export { Textarea };
