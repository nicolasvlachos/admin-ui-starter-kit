/**
 * GlobalSearchInput — search row at the top of the popover.
 *
 * Just the input + clear button + optional loading spinner. Keyboard
 * navigation is handled by the consumer wiring `useGlobalSearch`'s
 * `onKeyDown` handler.
 */
import { Loader2, Search, X } from 'lucide-react';
import * as React from 'react';

export interface GlobalSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    placeholder?: string;
    clearLabel?: string;
    loading?: boolean;
    autoFocus?: boolean;
}

export const GlobalSearchInput = React.forwardRef<HTMLInputElement, GlobalSearchInputProps>(
    function GlobalSearchInput(
        {
            value,
            onChange,
            onKeyDown,
            placeholder,
            clearLabel = 'Clear search',
            loading = false,
            autoFocus = false,
        },
        ref,
    ) {
        const innerRef = React.useRef<HTMLInputElement | null>(null);
        React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

        React.useEffect(() => {
            if (autoFocus) innerRef.current?.focus();
        }, [autoFocus]);

        return (
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                    ref={innerRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {loading && (
                    <Loader2
                        className="size-4 shrink-0 animate-spin text-muted-foreground"
                        aria-hidden="true"
                    />
                )}
                {!loading && !!value && (
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        aria-label={clearLabel}
                        className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X className="size-3.5" />
                    </button>
                )}
            </div>
        );
    },
);
