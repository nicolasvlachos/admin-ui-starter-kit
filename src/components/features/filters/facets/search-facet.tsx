import { Loader2, X } from 'lucide-react';
import React, {
    type ChangeEvent,
    useState,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import { Input } from '@/components/base/forms/fields/input';
import { Button } from '@/components/base/buttons';
import { cn } from '@/lib/utils';
import { useFilters } from '../filter-context';
import { interpolateFilterString } from '../filters.strings';
import { FILTER_ELEMENT_HEIGHT, type FilterConfig } from '../filters.types';

interface SearchFacetProps {
    filter: FilterConfig;
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

/**
 * Search Filter Facet
 *
 * This component implements a text search filter that allows users to:
 * - Enter search terms
 * - Configure search behavior (contains, equals, etc.)
 * - Set debounce delay for performance
 * - Customize placeholder text and appearance
 *
 * The component integrates with the filter context to manage the search value
 * and provides a responsive search input interface.
 */

function SearchFacetComponent({
    filter,
    value,
    onChange,
    className,
}: SearchFacetProps) {
    const { strings, isNavigating } = useFilters();

    // Use local state for the input value - initialized from value prop
    const [inputValue, setInputValue] = useState(value[0] || '');
    // Ref mirror of inputValue so the sync effect can read it without depending on it
    const inputValueRef = useRef(inputValue);
    inputValueRef.current = inputValue;
    // Track if the component is mounted to avoid unwanted effects
    const mounted = useRef(false);
    // Keep track of timeout ID for cleanup
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Tracking the last value we emitted to prevent duplicate emissions
    const lastEmittedValue = useRef<string | null>(value[0] || null);
    // Track if we're currently handling user input to prevent interference
    const isUserTypingRef = useRef(false);

    // Set mounted flag on initial render
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            // Clear any pending timeout on unmount
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Update input value when props change (for URL sync/refresh)
    // Guarded by isNavigating to prevent stale prop overwrites during the
    // gap between debounce-fire and Inertia response arriving.
    useEffect(() => {
        // Skip if user is actively typing or navigation is in-flight
        if (isUserTypingRef.current || isNavigating) {
            return;
        }

        const currentInput = inputValueRef.current;

        // Handle empty value array - this happens when filters are cleared
        if (!value.length || value[0] === '') {
            if (currentInput !== '') {
                setInputValue('');
                lastEmittedValue.current = '';
            }
            return;
        }

        // Only update if the value is different from what we have
        // and different from what we last emitted
        if (
            value[0] !== undefined &&
            value[0] !== currentInput &&
            value[0] !== lastEmittedValue.current
        ) {
            setInputValue(value[0]);
            lastEmittedValue.current = value[0];
        }
    }, [value, isNavigating]);

    // Debounced update function that consistently handles ALL input changes
    const debouncedUpdate = useCallback(
        (newValue: string) => {
            // Don't emit the same value twice
            if (lastEmittedValue.current === newValue) {
                return;
            }

            // Clear previous timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            // Set new timeout for debouncing
            timeoutRef.current = setTimeout(() => {
                if (mounted.current) {
                    lastEmittedValue.current = newValue;
                    isUserTypingRef.current = false;
                    onChange([newValue]);
                }
            }, filter.delay ?? 500);
        },
        [onChange, filter.delay],
    );

    // Handle input change - works for both typing and deleting characters
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        isUserTypingRef.current = true;
        const newValue = e.target.value;
        setInputValue(newValue);
        debouncedUpdate(newValue);
    };

    // Handle focusing the input
    const handleFocus = () => {
        isUserTypingRef.current = true;
    };

    // Handle blurring the input
    const handleBlur = () => {
        // Set a small delay before clearing the typing flag
        // This prevents immediate sync which could cause issues
        setTimeout(() => {
            isUserTypingRef.current = false;
        }, 100);
    };

    // Handle clear button click
    const handleClear = () => {
        isUserTypingRef.current = true;
        setInputValue('');
        debouncedUpdate('');
    };

    return (
        <div className={cn('search-facet bg-background relative min-w-80', className)}>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={
                    filter.placeholder ??
                    (() => {
                        const label = filter.label.trim().toLowerCase();
                        if (!label || label === 'search') {
                            // Collapse "Search …" stray space when the
                            // filter label would otherwise duplicate the
                            // template's leading "Search" word.
                            return interpolateFilterString(
                                strings.searchPlaceholder,
                                { filterLabel: '' },
                            )
                                .replace(/\s+([….?!])/g, '$1')
                                .replace(/\s{2,}/g, ' ')
                                .trim();
                        }
                        return interpolateFilterString(
                            strings.searchPlaceholder,
                            { filterLabel: label },
                        );
                    })()
                }
                className={`w-full px-3 py-1 pr-9 placeholder:leading-1 text-xs md:text-xs placeholder:text-xs ${FILTER_ELEMENT_HEIGHT}`}
            />
            {inputValue.trim() !== '' && !isNavigating && (
                <Button
                    type="button"
                    variant="secondary"
                    buttonStyle="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                    aria-label={strings.clearSearch}
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            )}
            {!!isNavigating && (
                <span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              )}
        </div>
    );
}

export const SearchFacet = React.memo(SearchFacetComponent);
SearchFacet.displayName = 'SearchFacet';
