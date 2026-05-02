/**
 * useMentions — picker state + caret-trigger detection bound to an editor.
 *
 * Composes `useMentionsSearch` (suggestion state) with caret-watch
 * logic. The editor it binds to must implement the minimal handle
 * surface in `MentionEditorHandle` — `<RichTextEditor>` from
 * `features/rich-text-editor` already does. Other editors (Slate,
 * Lexical, ProseMirror, plain contenteditable, …) can be plugged in by
 * implementing the same four methods on their imperative handle.
 *
 * Behaviour summary:
 *   - On every editor `onCaretChange`, the hook reads `getCaretContext()`
 *     and looks for a registered trigger char (`@`, `#`, …) preceded by
 *     start-of-line / whitespace and followed by `\p{L}\p{N}_-` chars.
 *   - On match, the picker opens, `activeKind` is seeded from the
 *     trigger char (only on a *fresh* trigger session — manual tab
 *     switches survive subsequent keystrokes), and `query` syncs from
 *     the typed needle.
 *   - All registered kinds are searched in parallel; the active kind
 *     auto-switches to the first kind with results when the current
 *     active is empty (skipped if `manualKindOverride` is true).
 *   - `pickSuggestion` deletes the trigger range and inserts the chip
 *     atomically via `replaceBeforeCaret` — selection-extension means
 *     no manual text mutation, no race between delete + insert.
 *   - When opened via the manual button (no trigger detected), the
 *     selection runs `insertHTML` instead — caret stays where it was.
 *
 * Returned API:
 *   pickerOpen, setPickerOpen, triggerActive,
 *   kinds, activeKind, setActiveKind, manualKindOverride, setManualKindOverride,
 *   query, setQuery, suggestions, suggestionsByKind, isLoading,
 *   mentions, addMention, removeMention, setMentions, reset,
 *   handleCaretChange()  — wire to the editor's `onCaretChange`
 *   pickSuggestion(s)    — convert suggestion → Mention + insert chip
 *
 * @example
 *   const editorRef = useRef<RichTextEditorHandle>(null);
 *   const mentions = useMentions<'user' | 'order'>({ editorRef });
 *
 *   <RichTextEditor ref={editorRef} onCaretChange={mentions.handleCaretChange} />
 *   <MentionInlineSuggestions
 *     open={mentions.triggerActive && mentions.pickerOpen}
 *     activeKind={mentions.activeKind}
 *     setActiveKind={mentions.setActiveKind}
 *     onManualKindChange={() => mentions.setManualKindOverride(true)}
 *     {...mentions}
 *     onSelect={mentions.pickSuggestion}
 *   />
 */
import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';

import type {
    Mention,
    MentionResource,
    MentionSuggestion,
    MentionsResourceSearch,
} from '../mentions.types';
import { buildMentionHtml } from '../utils/build-mention-html';
import {
    useMentionsSearch,
    type UseMentionsSearchOptions,
    type UseMentionsSearchReturn,
} from './use-mentions-search';

/**
 * Minimal editor handle the trigger detector needs. Compatible with the
 * library's `<RichTextEditor>` handle — implement these on any custom
 * editor to plug in.
 */
export interface MentionEditorHandle {
    getCaretContext(): { textBefore: string } | null;
    insertHTML(html: string): void;
    replaceBeforeCaret(length: number, html: string): void;
    focus(): void;
}

export interface UseMentionsOptions<TResource extends string = string>
    extends UseMentionsSearchOptions<TResource> {
    /** Ref to the editor surface the trigger detector reads from. */
    editorRef?: RefObject<MentionEditorHandle | null>;
}

export interface UseMentionsReturn<TResource extends string = string>
    extends UseMentionsSearchReturn<TResource> {
    pickerOpen: boolean;
    setPickerOpen: (open: boolean) => void;
    /** True while the picker is open from an inline `@`/`#` trigger. */
    triggerActive: boolean;
    /** Wire to the editor's `onCaretChange` to enable inline triggers. */
    handleCaretChange: () => void;
    /**
     * Convert a suggestion into a Mention, register it, insert the chip
     * into the editor (replacing the trigger range when one is active),
     * and close the picker. Returns the Mention.
     */
    pickSuggestion: (
        suggestion: MentionSuggestion<TResource>,
    ) => Mention<TResource>;
}

interface TriggerState {
    kind: string;
    triggerChar: string;
    consumedLength: number;
}

export function useMentions<TResource extends string = string>(
    options: UseMentionsOptions<TResource> = {},
): UseMentionsReturn<TResource> {
    const resources = options.resources;
    const onResourceSearch: MentionsResourceSearch<TResource> | undefined =
        options.onResourceSearch;

    const search = useMentionsSearch<TResource>({
        ...options,
        resources,
        onResourceSearch,
    });

    const [pickerOpen, setPickerOpenState] = useState(false);
    const [triggerActive, setTriggerActive] = useState(false);
    const triggerStateRef = useRef<TriggerState | null>(null);
    /** Tracks the trigger char from the most recent detection — lets us
     *  set the initial active kind on a fresh trigger without overriding
     *  the user's manual tab switch on every subsequent keystroke. */
    const lastTriggerCharRef = useRef<string | null>(null);

    const setPickerOpen = useCallback((open: boolean) => {
        setPickerOpenState(open);
        if (!open) {
            triggerStateRef.current = null;
            lastTriggerCharRef.current = null;
            setTriggerActive(false);
            search.setManualKindOverride(false);
        }
    }, [search]);

    const editorRef = options.editorRef;

    const handleCaretChange = useCallback(() => {
        if (!resources) return;
        const triggerMap: Record<string, string> = {};
        for (const [kind, cfg] of Object.entries(resources)) {
            const trig = (cfg as MentionResource | undefined)?.trigger;
            if (typeof trig === 'string' && trig.length > 0) {
                triggerMap[trig] = kind;
            }
        }
        if (Object.keys(triggerMap).length === 0) return;

        const ctx = editorRef?.current?.getCaretContext();
        if (!ctx) {
            if (triggerStateRef.current) {
                triggerStateRef.current = null;
                setPickerOpen(false);
            }
            return;
        }
        const triggers = Object.keys(triggerMap)
            .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('');
        const re = new RegExp(`(?:^|\\s)([${triggers}])([\\p{L}\\p{N}_-]*)$`, 'u');
        const match = ctx.textBefore.match(re);
        if (!match) {
            if (triggerStateRef.current) {
                triggerStateRef.current = null;
                setPickerOpen(false);
            }
            return;
        }
        const triggerChar = match[1];
        const needle = match[2] ?? '';
        const kind = triggerMap[triggerChar];
        const consumedLength = triggerChar.length + needle.length;

        triggerStateRef.current = { kind, triggerChar, consumedLength };
        setTriggerActive(true);

        // Only seed the initial active kind on a *fresh* trigger session.
        // If the user has already picked a tab in the panel,
        // `manualKindOverride` is true and we skip — their choice sticks
        // even as they keep typing or deleting characters.
        const isNewTriggerSession = lastTriggerCharRef.current !== triggerChar;
        if (isNewTriggerSession) {
            if (search.activeKind !== kind) {
                search.setActiveKind(kind as TResource);
            }
            search.setManualKindOverride(false);
            lastTriggerCharRef.current = triggerChar;
        }

        if (search.query !== needle) {
            search.setQuery(needle);
        }
        setPickerOpenState(true);
    }, [editorRef, resources, search, setPickerOpen]);

    const pickSuggestion = useCallback(
        (suggestion: MentionSuggestion<TResource>) => {
            const mention = search.selectSuggestion(suggestion);
            const trigger = triggerStateRef.current;
            const tone = (resources?.[mention.kind] as MentionResource | undefined)?.tone;
            const html = buildMentionHtml(mention, {
                triggerChar: trigger?.triggerChar,
                tone,
            });

            if (trigger && trigger.consumedLength > 0 && editorRef?.current) {
                editorRef.current.replaceBeforeCaret(trigger.consumedLength, html);
                triggerStateRef.current = null;
            } else if (editorRef?.current) {
                editorRef.current.insertHTML(html);
            }
            setPickerOpen(false);
            return mention;
        },
        [editorRef, resources, search, setPickerOpen],
    );

    return {
        ...search,
        pickerOpen,
        setPickerOpen,
        triggerActive,
        handleCaretChange,
        pickSuggestion,
    };
}
