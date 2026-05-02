/**
 * MentionInlineSuggestions — non-focus-stealing suggestion list.
 *
 * Used in the *inline-trigger* flow (user typed `@` / `#` / …): the
 * editor stays focused while this panel renders below the surface and
 * updates live as the user keeps typing. No popover, no focus trap,
 * no CommandInput — the editor IS the input, we read the needle from
 * the caret context and stream results in.
 *
 * Position is "anchored to a wrapping element" — the consumer puts this
 * inside a `relative`-positioned wrapper around the editor and we
 * absolute-position ourselves below it.
 */
import { Loader2 } from 'lucide-react';

import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
    defaultMentionInlineSuggestionsStrings,
    type MentionInlineSuggestionsStrings,
} from '../mentions.strings';
import type {
    MentionResource,
    MentionSuggestion,
} from '../mentions.types';

export type { MentionInlineSuggestionsStrings };

export interface MentionInlineSuggestionsProps<TResource extends string = string> {
    open: boolean;
    activeKind: TResource | null;
    setActiveKind: (kind: TResource | null) => void;
    kinds: ReadonlyArray<TResource>;
    resources?: Partial<Record<TResource, MentionResource<TResource>>>;
    /** Per-kind suggestion buckets — used to render result counts on tabs. */
    suggestionsByKind?: Readonly<Record<string, ReadonlyArray<MentionSuggestion<TResource>>>>;
    suggestions: ReadonlyArray<MentionSuggestion<TResource>>;
    isLoading: boolean;
    /** Live query the panel echoes in the header; the consumer owns the editor input. */
    query?: string;
    /**
     * Notifies the consumer that the user manually picked a tab, so it
     * can flip the `manualKindOverride` flag on `useMentionsSearch`.
     */
    onManualKindChange?: () => void;
    onSelect: (suggestion: MentionSuggestion<TResource>) => void;
    strings?: StringsProp<MentionInlineSuggestionsStrings>;
    className?: string;
}

export function MentionInlineSuggestions<TResource extends string = string>({
    open,
    activeKind,
    setActiveKind,
    kinds,
    resources,
    suggestionsByKind,
    suggestions,
    isLoading,
    query,
    onManualKindChange,
    onSelect,
    strings: stringsProp,
    className,
}: MentionInlineSuggestionsProps<TResource>) {
    const strings = useStrings(defaultMentionInlineSuggestionsStrings, stringsProp);
    if (!open) return null;

    return (
        <div
            // `mousedown.preventDefault` keeps focus in the editor when
            // the user clicks inside the panel — clicks still bubble to
            // the underlying button so selection works normally.
            onMouseDown={(e) => e.preventDefault()}
            className={cn(
                'bg-popover text-popover-foreground absolute left-0 top-full z-40 mt-1 w-80 max-w-[min(theme(spacing.96),100%)]',
                'border-border/60 rounded-md border shadow-md ring-1 ring-foreground/[0.04]',
                'overflow-hidden',
                className,
            )}
            role="listbox"
        >
            <div className="border-b border-border/60 px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                    <Text
                        size="xxs"
                        type="secondary"
                        weight="medium"
                        className="uppercase tracking-wide"
                    >
                        {strings.title}
                    </Text>
                    {query ? (
                        <Text
                            tag="span"
                            size="xxs"
                            type="secondary"
                            className="truncate font-mono"
                        >
                            “{query}”
                        </Text>
                    ) : null}
                </div>
                {kinds.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {kinds.map((kind) => {
                            const cfg = resources?.[kind];
                            const Icon = cfg?.icon;
                            const active = kind === activeKind;
                            const count = suggestionsByKind?.[kind as string]?.length ?? 0;
                            return (
                                <button
                                    key={kind}
                                    type="button"
                                    onClick={() => {
                                        setActiveKind(kind);
                                        onManualKindChange?.();
                                    }}
                                    className={cn(
                                        'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xxs font-medium ring-1 ring-inset transition-colors',
                                        active
                                            ? 'bg-primary text-primary-foreground ring-primary'
                                            : count > 0
                                              ? 'bg-muted text-foreground ring-border/60 hover:bg-muted/80'
                                              : 'bg-muted/40 text-muted-foreground ring-border/40 hover:bg-muted/60',
                                    )}
                                >
                                    {Icon ? <Icon className="size-3" /> : null}
                                    <span>{cfg?.label ?? String(kind)}</span>
                                    {count > 0 && (
                                        <span
                                            className={cn(
                                                'tabular-nums',
                                                active ? 'opacity-90' : 'opacity-70',
                                            )}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="max-h-72 overflow-y-auto py-1">
                {isLoading ? (
                    <div className="text-muted-foreground flex items-center justify-center gap-2 py-3">
                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                        <Text tag="span" size="xs" type="secondary">
                            {strings.loading}
                        </Text>
                    </div>
                ) : null}

                {!isLoading && suggestions.length === 0 ? (
                    <div className="px-3 py-3">
                        <Text size="xs" type="secondary">
                            {strings.empty}
                        </Text>
                    </div>
                ) : null}

                {suggestions.map((suggestion) => {
                    const kind = suggestion.kind ?? activeKind ?? '';
                    return (
                        <button
                            key={`${kind}:${suggestion.id}`}
                            type="button"
                            role="option"
                            data-ref-id={`${kind}:${suggestion.id}`}
                            onClick={() => onSelect(suggestion)}
                            className={cn(
                                'flex w-full min-w-0 items-start gap-2 px-3 py-1.5 text-left',
                                'hover:bg-muted/60 focus-visible:bg-muted/60 transition-colors',
                            )}
                        >
                            <div className="flex min-w-0 flex-1 flex-col leading-tight">
                                <Text
                                    tag="span"
                                    size="xs"
                                    weight="medium"
                                    className="truncate"
                                >
                                    {suggestion.label}
                                </Text>
                                {suggestion.description ? (
                                    <Text
                                        tag="span"
                                        size="xxs"
                                        type="secondary"
                                        className="mt-0.5 truncate"
                                    >
                                        {suggestion.description}
                                    </Text>
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
