/**
 * useMentionsSearch — pure search state for the mention picker.
 *
 * Runs **all registered kinds in parallel** for the same needle so the
 * caller can render mixed results in tabs and the picker can auto-
 * switch when the active kind has zero matches but another does. The
 * caller still controls which kind is *active* (the one whose
 * suggestions render); manual switches are remembered and not
 * overridden by subsequent caret-driven re-detections.
 *
 * Suggestion lookup order per kind:
 *   1. `resources[kind].search(needle)` — per-kind callback
 *   2. `resources[kind].suggestions` — static catalogue
 *   3. global `onResourceSearch(needle, kind)` — fallback
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
    Mention,
    MentionResource,
    MentionSuggestion,
    MentionsResourceSearch,
} from '../mentions.types';

export interface UseMentionsSearchOptions<TResource extends string = string> {
    resources?: Partial<Record<TResource, MentionResource<TResource>>>;
    onResourceSearch?: MentionsResourceSearch<TResource>;
    initialMentions?: ReadonlyArray<Mention<TResource>>;
    /** Debounce window for async search. Default: 200ms. */
    debounceMs?: number;
}

export interface UseMentionsSearchReturn<TResource extends string = string> {
    kinds: ReadonlyArray<TResource>;
    activeKind: TResource | null;
    setActiveKind: (kind: TResource | null) => void;
    activeResource: MentionResource<TResource> | null;

    query: string;
    setQuery: (q: string) => void;

    /** Suggestions for the active kind (`suggestionsByKind[activeKind]`). */
    suggestions: ReadonlyArray<MentionSuggestion<TResource>>;
    /** Per-kind suggestion buckets — useful for cross-kind UIs. */
    suggestionsByKind: Readonly<Record<string, ReadonlyArray<MentionSuggestion<TResource>>>>;
    isLoading: boolean;

    mentions: ReadonlyArray<Mention<TResource>>;
    addMention: (mention: Mention<TResource>) => void;
    removeMention: (id: string) => void;
    setMentions: (next: ReadonlyArray<Mention<TResource>>) => void;
    reset: () => void;

    selectSuggestion: (
        suggestion: MentionSuggestion<TResource>,
    ) => Mention<TResource>;

    /** True if the consumer manually picked a tab. The trigger detector
     * checks this and refuses to override the active kind on next caret
     * change while it's true. Reset on `setManualKindOverride(false)` or
     * `reset()`. */
    manualKindOverride: boolean;
    setManualKindOverride: (override: boolean) => void;
}

export function useMentionsSearch<TResource extends string = string>(
    options: UseMentionsSearchOptions<TResource> = {},
): UseMentionsSearchReturn<TResource> {
    const { resources, onResourceSearch, initialMentions, debounceMs = 200 } = options;

    const kinds = useMemo<ReadonlyArray<TResource>>(
        () => (resources ? (Object.keys(resources) as TResource[]) : []),
        [resources],
    );

    const [activeKind, setActiveKindState] = useState<TResource | null>(
        () => kinds[0] ?? null,
    );
    const [manualKindOverride, setManualKindOverride] = useState(false);
    const [query, setQueryState] = useState('');
    const [suggestionsByKind, setSuggestionsByKind] = useState<
        Record<string, ReadonlyArray<MentionSuggestion<TResource>>>
    >({});
    const [isLoading, setIsLoading] = useState(false);
    const [mentions, setMentionsState] = useState<Mention<TResource>[]>(() =>
        initialMentions ? [...initialMentions] : [],
    );

    const requestIdRef = useRef(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (kinds.length === 0) {
            setActiveKindState(null);
            return;
        }
        if (!activeKind || !kinds.includes(activeKind)) {
            setActiveKindState(kinds[0]);
        }
    }, [activeKind, kinds]);

    const activeResource = useMemo(
        () => (activeKind && resources ? resources[activeKind] ?? null : null),
        [activeKind, resources],
    );

    /**
     * Search a single kind. Per-kind `search` wins, then static
     * `suggestions`, then the global `onResourceSearch` fallback.
     */
    const searchOneKind = useCallback(
        async (
            kind: TResource,
            q: string,
        ): Promise<ReadonlyArray<MentionSuggestion<TResource>>> => {
            const config = resources?.[kind];
            if (config?.search) {
                const result = await config.search(q);
                return result.map((s) => ({ ...s, kind }));
            }
            if (config?.suggestions) {
                const stat = config.suggestions;
                const filtered =
                    q.trim().length === 0
                        ? stat
                        : stat.filter((s) =>
                                s.label.toLowerCase().includes(q.toLowerCase()),
                            );
                return filtered.map((s) => ({ ...s, kind }));
            }
            if (onResourceSearch) {
                const result = await onResourceSearch(q, kind);
                return result.map((s) => ({ ...s, kind }));
            }
            return [];
        },
        [resources, onResourceSearch],
    );

    // Debounced cross-kind search runner. Populates `suggestionsByKind`
    // for every registered kind in parallel.
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        if (kinds.length === 0) {
            setSuggestionsByKind({});
            return;
        }

        const requestId = ++requestIdRef.current;
        const run = async () => {
            setIsLoading(true);
            try {
                const entries = await Promise.all(
                    kinds.map(async (kind) => {
                        try {
                            const list = await searchOneKind(kind, query);
                            return [kind, list] as const;
                        } catch {
                            return [kind, []] as const;
                        }
                    }),
                );
                if (requestId !== requestIdRef.current) return;
                const next: Record<string, ReadonlyArray<MentionSuggestion<TResource>>> = {};
                for (const [kind, list] of entries) {
                    next[kind] = list;
                }
                setSuggestionsByKind(next);
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsLoading(false);
                }
            }
        };

        debounceRef.current = setTimeout(() => {
            void run();
        }, debounceMs);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [kinds, query, searchOneKind, debounceMs]);

    /**
     * Auto-switch behaviour: when the active kind has zero results but
     * another kind has matches, jump to the first kind with results.
     * Skipped while `manualKindOverride` is true so the consumer's tab
     * choice sticks.
     */
    useEffect(() => {
        if (manualKindOverride) return;
        if (!activeKind) return;
        const activeList = suggestionsByKind[activeKind] ?? [];
        if (activeList.length > 0) return;
        const first = kinds.find((k) => (suggestionsByKind[k]?.length ?? 0) > 0);
        if (first && first !== activeKind) {
            setActiveKindState(first);
        }
    }, [activeKind, kinds, manualKindOverride, suggestionsByKind]);

    /**
     * Set the active kind. **Does not** toggle `manualKindOverride` —
     * the picker UI is responsible for calling
     * `setManualKindOverride(true)` when the user explicitly clicks a
     * tab so the auto-switch / auto-detect logic respects their choice.
     */
    const setActiveKind = useCallback((kind: TResource | null) => {
        setActiveKindState(kind);
    }, []);

    const setQuery = useCallback((q: string) => {
        setQueryState(q);
    }, []);

    const addMention = useCallback((mention: Mention<TResource>) => {
        setMentionsState((prev) => {
            if (prev.some((m) => m.id === mention.id)) return prev;
            return [...prev, mention];
        });
    }, []);

    const removeMention = useCallback((id: string) => {
        setMentionsState((prev) => prev.filter((m) => m.id !== id));
    }, []);

    const setMentions = useCallback(
        (next: ReadonlyArray<Mention<TResource>>) => {
            setMentionsState([...next]);
        },
        [],
    );

    const reset = useCallback(() => {
        setMentionsState([]);
        setQueryState('');
        setManualKindOverride(false);
        requestIdRef.current++;
    }, []);

    const selectSuggestion = useCallback(
        (suggestion: MentionSuggestion<TResource>) => {
            const kind = (suggestion.kind ?? activeKind) as TResource;
            const id = `${kind}:${suggestion.id}`;
            const cfg = resources?.[kind];
            const href = suggestion.href ?? cfg?.buildHref?.(suggestion);
            const mention: Mention<TResource> = {
                id,
                kind,
                label: suggestion.label,
                href,
                data: suggestion.data,
            };
            addMention(mention);
            return mention;
        },
        [activeKind, addMention, resources],
    );

    const suggestions = useMemo<ReadonlyArray<MentionSuggestion<TResource>>>(
        () => (activeKind ? suggestionsByKind[activeKind] ?? [] : []),
        [activeKind, suggestionsByKind],
    );

    return {
        kinds,
        activeKind,
        setActiveKind,
        activeResource,
        query,
        setQuery,
        suggestions,
        suggestionsByKind,
        isLoading,
        mentions,
        addMention,
        removeMention,
        setMentions,
        reset,
        selectSuggestion,
        manualKindOverride,
        setManualKindOverride,
    };
}
