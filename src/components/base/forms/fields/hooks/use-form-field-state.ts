import { useState, useCallback, useMemo, useId } from 'react';

export interface UseFormFieldStateOptions {
    /** Controlled value from parent */
    controlledValue?: string;
    /** Default value for uncontrolled mode */
    defaultValue?: string;
    /** Maximum character length */
    maxLength?: number;
    /** Whether to show character count */
    showCharacterCount?: boolean;
    /** Provided ID or auto-generate */
    providedId?: string;
    /** Prefix for auto-generated ID */
    idPrefix?: string;
    /** Whether onChange is provided (for react-hook-form detection) */
    hasOnChange?: boolean;
}

export interface UseFormFieldStateReturn {
    /** Generated or provided ID */
    id: string;
    /** Current value (controlled or internal) */
    value: string;
    /** Whether component is in controlled mode */
    isControlled: boolean;
    /** Whether using react-hook-form (has onChange but no controlled value) */
    isReactHookForm: boolean;
    /** Current character count */
    characterCount: number;
    /** Whether a character limit is set */
    hasCharacterLimit: boolean;
    /** Whether to show character count UI */
    showCount: boolean;
    /** Whether the field has a value */
    hasValue: boolean;
    /** Update value - returns false if blocked by character limit */
    updateValue: (newValue: string) => boolean;
    /** Clear the value */
    clearValue: () => void;
    /** Check if a new value would exceed the character limit */
    wouldExceedLimit: (newValue: string) => boolean;
}

/**
 * Shared hook for managing form field state including:
 * - Controlled vs uncontrolled value handling
 * - Character counting and limits
 * - React Hook Form compatibility detection
 * - ID generation
 */
export function useFormFieldState({
    controlledValue,
    defaultValue,
    maxLength,
    showCharacterCount,
    providedId,
    idPrefix = 'field',
    hasOnChange,
}: UseFormFieldStateOptions): UseFormFieldStateReturn {
    // Generate stable ID using React 18's useId (SSR-safe)
    const reactId = useId();
    const id = providedId || `${idPrefix}${reactId}`;

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    // Determine control mode
    const isControlled = controlledValue !== undefined;

    // Normalize value (handle null from backend)
    const rawValue = isControlled ? controlledValue : internalValue;
    const value = rawValue ?? '';

    // React Hook Form detection: has onChange but no controlled value or defaultValue
    const isReactHookForm = Boolean(hasOnChange && !isControlled && !defaultValue);

    // Character counting
    const characterCount = value.length;
    const hasCharacterLimit = maxLength !== undefined;
    const showCount = showCharacterCount === false ? false : Boolean(showCharacterCount || hasCharacterLimit);
    const hasValue = value !== '';

    // Check if value would exceed limit
    const wouldExceedLimit = useCallback(
        (newValue: string) => {
            return hasCharacterLimit && newValue.length > maxLength;
        },
        [hasCharacterLimit, maxLength]
    );

    // Update value (respects character limit, updates internal state if uncontrolled)
    const updateValue = useCallback(
        (newValue: string): boolean => {
            if (wouldExceedLimit(newValue)) {
                return false;
            }
            if (!isControlled) {
                setInternalValue(newValue);
            }
            return true;
        },
        [isControlled, wouldExceedLimit]
    );

    // Clear value
    const clearValue = useCallback(() => {
        if (!isControlled) {
            setInternalValue('');
        }
    }, [isControlled]);

    return useMemo(
        () => ({
            id,
            value,
            isControlled,
            isReactHookForm,
            characterCount,
            hasCharacterLimit,
            showCount,
            hasValue,
            updateValue,
            clearValue,
            wouldExceedLimit,
        }),
        [
            id,
            value,
            isControlled,
            isReactHookForm,
            characterCount,
            hasCharacterLimit,
            showCount,
            hasValue,
            updateValue,
            clearValue,
            wouldExceedLimit,
        ]
    );
}
