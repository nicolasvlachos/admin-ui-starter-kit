/**
 * TagsInput — generic typed tag picker with optional recommendation list,
 * paste-to-bulk, validation, max-tag enforcement, and customizable rendering.
 * Supports both string tags and complex objects (via the `field` prop pointing
 * at the display key). Strings overridable for i18n via `strings`.
 *
 * Ref note: `TagsInput` is generic over `T` and does not use `forwardRef`
 * (generic-+-forwardRef is awkward in TS). Consumers wire RHF via `value` /
 * `onChange` props directly. To focus the inner input from a parent, render
 * a wrapping element with `data-tags-input` and call `.querySelector('input').focus()`.
 */
import { X, Check } from 'lucide-react';
import * as React from 'react';
import { useState, useRef, useCallback, useMemo } from 'react';
import { TextButton } from '@/components/base/buttons';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { Input } from './input';

export interface TagsInputStrings {
	placeholder: string;
	emptyRecommendations: string;
	clearAll: string;
	/** Summary line shown when `maxTags` + `showMaxTags` are set. Receives
	 *  `current` (number of tags entered) and `max` (the limit). The
	 *  default is English `"{current} / {max} tags"` — override for i18n. */
	summary: (current: number, max: number) => string;
}

export const defaultTagsInputStrings: TagsInputStrings = {
	placeholder: 'Add a tag…',
	emptyRecommendations: 'No recommendations found.',
	clearAll: 'Clear all',
	summary: (current, max) => `${current} / ${max} tags`,
};

export interface TagsInputProps<T = string> {
    /** Current value (array of T) */
    value?: T[];

    /** Callback when value changes */
    onChange?: (value: T[]) => void;

    /** Placeholder text for the input */
    placeholder?: string;

    /** Array of recommendations to suggest */
    recommendations?: Array<T | { value: T; label: string }>;

    /** Maximum number of tags allowed */
    maxTags?: number;

    /** Show the label for the maximum tags */
    showMaxTags?: boolean;

    /** Whether duplicate tags are allowed */
    allowDuplicates?: boolean;

    /** Custom validation function */
    validate?: (value: T) => boolean;

    /** Whether the input is disabled */
    disabled?: boolean;

    /** Whether to show the clear all button */
    showClearAll?: boolean;

    /** Custom tag component */
    renderTag?: (tag: T, index: number, onRemove: (index: number) => void) => React.ReactNode;

    /** Delimiter for separating tags when pasting */
    delimiter?: string | RegExp;

    /** Whether to trigger add on blur */
    addOnBlur?: boolean;

    /** Minimum length for a tag */
    minLength?: number;

    /** Maximum length for a tag */
    maxLength?: number;

    /** @deprecated Use `strings.emptyRecommendations` instead. */
    emptyMessage?: string;

    /** Override default English strings (placeholder, empty list, clear-all). */
    strings?: Partial<TagsInputStrings>;

    /** Whether tags should be sorted */
    sortTags?: boolean;

    /** Case sensitivity for duplicate checking */
    caseSensitive?: boolean;

    /** Field to extract display value from an object (required when T is not string) */
    field?: T extends string ? never : keyof T;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Additional class names */
    className?: string;
}

export function TagsInput<T = string>({
    value = [],
    onChange,
    placeholder,
    recommendations,
    maxTags,
    showMaxTags = false,
    allowDuplicates = false,
    validate,
    disabled = false,
    showClearAll = false,
    renderTag,
    delimiter = /[\n,]/,
    addOnBlur = true,
    minLength = 1,
    maxLength,
    emptyMessage,
    sortTags = false,
    caseSensitive = false,
    field,
    invalid,
    className,
    strings: stringsProp,
}: TagsInputProps<T>) {
    const strings = useStrings(defaultTagsInputStrings, {
        ...(placeholder ? { placeholder } : {}),
        ...(emptyMessage ? { emptyRecommendations: emptyMessage } : {}),
        ...stringsProp,
    });
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    // Helper function to get display value from tag
    const getDisplayValue = useCallback(
        (tag: T): string => {
            if (typeof tag === 'string') {
                return tag;
            }

            if (field && typeof tag === 'object' && tag !== null) {
                const record = tag as Record<string | number | symbol, unknown>;
                const candidate = record[field];
                if (typeof candidate === 'string') {
                    return candidate;
                }
                if (candidate === undefined || candidate === null) {
                    return '';
                }
                return String(candidate);
            }

            return String(tag);
        },
        [field]
    );

    // Helper function to create tag from string input
    const createTagFromString = useCallback(
        (input: string): T => {
            if (typeof value[0] === 'string' || value.length === 0) {
                return input as T;
            }
            if (field) {
                return { [field]: input } as T;
            }
            return input as unknown as T;
        },
        [field, value]
    );

    // Normalize recommendations to always be objects
    const normalizedRecommendations = useMemo(() => {
        if (!recommendations) return [];
        return recommendations.map((rec) => {
            if (rec && typeof rec === 'object' && 'value' in rec && 'label' in rec) {
                return rec as { value: T; label: string };
            }
            const displayValue = getDisplayValue(rec);
            return { value: rec, label: displayValue };
        });
    }, [recommendations, getDisplayValue]);

    // Filter recommendations based on input and existing tags
    const filteredRecommendations = useMemo(() => {
        if (!normalizedRecommendations.length || !inputValue) return normalizedRecommendations;

        const search = caseSensitive ? inputValue : inputValue.toLowerCase();
        const existingValues = new Set(
            value.map((v) => {
                const displayVal = getDisplayValue(v);
                return caseSensitive ? displayVal : displayVal.toLowerCase();
            })
        );

        return normalizedRecommendations.filter((rec) => {
            const label = caseSensitive ? rec.label : rec.label.toLowerCase();
            const displayVal = getDisplayValue(rec.value);
            const val = caseSensitive ? displayVal : displayVal.toLowerCase();

            return (label.includes(search) || val.includes(search)) && (allowDuplicates || !existingValues.has(val));
        });
    }, [normalizedRecommendations, inputValue, value, allowDuplicates, caseSensitive, getDisplayValue]);

    // Sort tags if needed
    const displayValue = useMemo(() => {
        if (!sortTags) return value;
        return [...value].sort((a, b) => {
            const aStr = getDisplayValue(a);
            const bStr = getDisplayValue(b);
            return aStr.localeCompare(bStr);
        });
    }, [value, sortTags, getDisplayValue]);

    const addTag = useCallback(
        (tag: T | string) => {
            const actualTag = typeof tag === 'string' ? createTagFromString(tag) : tag;
            const displayVal = getDisplayValue(actualTag);
            const trimmedDisplayVal = displayVal.trim();

            // Validation checks
            if (!trimmedDisplayVal) return;
            if (trimmedDisplayVal.length < minLength) return;
            if (maxLength && trimmedDisplayVal.length > maxLength) return;
            if (maxTags && value.length >= maxTags) return;

            if (!allowDuplicates) {
                const exists = value.some((v) => {
                    const existingDisplayVal = getDisplayValue(v);
                    return caseSensitive
                        ? existingDisplayVal === trimmedDisplayVal
                        : existingDisplayVal.toLowerCase() === trimmedDisplayVal.toLowerCase();
                });
                if (exists) return;
            }

            if (validate && !validate(actualTag)) return;

            const newValue = [...value, actualTag];
            onChange?.(newValue);
            setInputValue('');
            setOpen(false);
            setSelectedIndex(-1);
        },
        [value, onChange, maxTags, allowDuplicates, validate, minLength, maxLength, caseSensitive, getDisplayValue, createTagFromString]
    );

    const removeTag = useCallback(
        (index: number) => {
            const newValue = value.filter((_, i) => i !== index);
            onChange?.(newValue);
        },
        [value, onChange]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            setSelectedIndex(-1);

            if (recommendations && recommendations.length > 0) {
                setOpen(true);
            }
        },
        [recommendations]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (disabled) return;

            if (e.key === 'Enter') {
                e.preventDefault();
                if (open && selectedIndex >= 0 && selectedIndex < filteredRecommendations.length) {
                    addTag(filteredRecommendations[selectedIndex].value);
                    setSelectedIndex(-1);
                } else if (inputValue.trim()) {
                    addTag(inputValue);
                }
            } else if (e.key === 'Tab') {
                if (inputValue) {
                    e.preventDefault();
                    addTag(inputValue);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (open) {
                    setSelectedIndex((prev) => (prev < filteredRecommendations.length - 1 ? prev + 1 : prev));
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (open) {
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                }
            } else if (e.key === 'Escape') {
                setOpen(false);
                setSelectedIndex(-1);
            } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
                removeTag(value.length - 1);
            }
        },
        [disabled, open, selectedIndex, filteredRecommendations, inputValue, addTag, removeTag, value.length]
    );

    const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
            if (disabled) return;

            e.preventDefault();
            const pastedText = e.clipboardData.getData('text');
            const tags = pastedText
                .split(delimiter)
                .map((t) => t.trim())
                .filter(Boolean);

            tags.forEach((tag) => addTag(tag));
        },
        [disabled, delimiter, addTag]
    );

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            setOpen(false);
            if (addOnBlur && inputValue) {
                addTag(inputValue);
            }
        }, 200);
    }, [addOnBlur, inputValue, addTag]);

    const clearAll = useCallback(() => {
        onChange?.([]);
        setInputValue('');
    }, [onChange]);

    const defaultRenderTag = useCallback(
        (tag: T, index: number, onRemove: (index: number) => void) => {
            const tagKey = `${getDisplayValue(tag)}-${index}`;
            return (
                <Badge key={tagKey} variant="secondary" className="gap-1 pr-1 font-normal">
                    {getDisplayValue(tag)}
                    <button
                        type="button"
                        aria-label={`Remove ${getDisplayValue(tag)}`}
                        className={cn(
                            'inline-flex size-3.5 items-center justify-center rounded-full',
                            'text-muted-foreground/70 hover:bg-foreground/10 hover:text-foreground',
                            'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                            'disabled:opacity-50 disabled:pointer-events-none',
                        )}
                        onClick={() => onRemove(index)}
                        disabled={disabled}
                    >
                        <X className="size-3" aria-hidden="true" />
                    </button>
                </Badge>
            );
        },
        [getDisplayValue, disabled]
    );

    const resolvedInvalid = Boolean(invalid);

    return (
        <div className={cn('w-full relative', className)}>
            <div className="relative">
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={strings.placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onBlur={handleBlur}
                    onFocus={() => {
                        if (recommendations && filteredRecommendations.length > 0) {
                            setOpen(true);
                        }
                    }}
                    disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
                    invalid={resolvedInvalid}
                    maxLength={maxLength}
                    className="w-full"
                />

                {/* Recommendations dropdown — mirrors PopoverContent + CommandItem
                    surface tokens (bg-popover, text-popover-foreground, ring-1
                    ring-foreground/10, shadow-md, rounded-md) so it reads
                    identically to a real popover. The hand-rolled wrapper
                    stays because the dropdown is tightly bound to the
                    Input's keyboard handler (selectedIndex, arrow nav). */}
                {!!recommendations && !!open && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[200px] overflow-y-auto rounded-md bg-popover text-popover-foreground p-1 text-sm shadow-md ring-1 ring-foreground/10">
                        {filteredRecommendations.length > 0 ? (
                            filteredRecommendations.map((rec, idx) => {
                                const recommendationKey = getDisplayValue(rec.value);
                                const isPicked = value.some(
                                    (v) => getDisplayValue(v) === getDisplayValue(rec.value),
                                );
                                return (
                                    <button
                                        key={recommendationKey}
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            addTag(rec.value);
                                            setSelectedIndex(-1);
                                            inputRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        className={cn(
                                            'relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-(--row-py) text-[length:var(--text-xs)]',
                                            'hover:bg-accent hover:text-accent-foreground',
                                            'focus-visible:outline-none',
                                            selectedIndex === idx && 'bg-accent text-accent-foreground',
                                        )}
                                    >
                                        <span>{rec.label}</span>
                                        <Check
                                            className={cn(
                                                'ml-auto size-4',
                                                isPicked ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                    </button>
                                );
                            })
                        ) : (
                            <Text tag="div" size="xs" type="secondary" className="px-2 py-(--row-py)">
                                {strings.emptyRecommendations}
                            </Text>
                        )}
                    </div>
                  )}
            </div>

            {/* Tags container */}
            {displayValue.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {displayValue.map((tag, index) =>
                        renderTag ? renderTag(tag, index, removeTag) : defaultRenderTag(tag, index, removeTag)
                    )}

                    {!!showClearAll && value.length > 0 && !disabled && (
                        <TextButton
                            type="button"
                            size="sm"
                            onClick={clearAll}
                            className="ml-auto"
                        >
                            {strings.clearAll}
                        </TextButton>
                      )}
                </div>
            )}

            {!!maxTags && !!showMaxTags && (
                <Text size="xs" type="secondary" className="mt-1">
                    {strings.summary(value.length, maxTags)}
                </Text>
              )}
        </div>
    );
}

TagsInput.displayName = 'TagsInput';
