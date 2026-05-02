// @vitest-environment jsdom

/**
 * Verifies the combined picker + caret-trigger detection hook with a
 * mock editor handle. The mock satisfies `MentionEditorHandle` and
 * records the calls the hook makes — proves the integration surface is
 * editor-agnostic and can be plugged into custom RTEs.
 */
import { act, renderHook } from '@testing-library/react';
import { useMemo, useRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
    useMentions,
    type MentionEditorHandle,
} from '../hooks/use-mentions';
import type { MentionResource } from '../mentions.types';

type Kind = 'user' | 'booking';

const RESOURCES: Record<Kind, MentionResource<Kind>> = {
    user: {
        trigger: '@',
        suggestions: [
            { id: 'maria', label: 'Maria Petrova', kind: 'user' },
            { id: 'stefan', label: 'Stefan Kolev', kind: 'user' },
        ],
    },
    booking: {
        trigger: '#',
        suggestions: [
            { id: 'BKG-1', label: 'BKG-1', kind: 'booking' },
        ],
    },
};

interface CallRecord {
    method: string;
    args: unknown[];
}

interface MockHarness {
    handle: MentionEditorHandle;
    calls: CallRecord[];
    state: { textBefore: string };
}

/**
 * Tiny mock that satisfies `MentionEditorHandle`. Records every call so
 * tests can assert exactly what the hook drove on the editor surface.
 */
function makeMockEditor(initialText: string): MockHarness {
    const state = { textBefore: initialText };
    const calls: CallRecord[] = [];
    const handle: MentionEditorHandle = {
        focus: () => {
            calls.push({ method: 'focus', args: [] });
        },
        insertHTML: (html: string) => {
            calls.push({ method: 'insertHTML', args: [html] });
        },
        replaceBeforeCaret: (length: number, html: string) => {
            calls.push({ method: 'replaceBeforeCaret', args: [length, html] });
            // Mock effect: drop the trigger range from textBefore.
            state.textBefore = state.textBefore.slice(0, -length);
        },
        getCaretContext: () => ({ textBefore: state.textBefore }),
    };
    return { handle, calls, state };
}

/**
 * Stabilises the harness across renders via `useMemo` — without this
 * `renderHook` would mint a new mock object every re-render, hiding
 * the calls pushed by the hook on the previous render.
 */
function useHookWithEditor(textBefore: string) {
    const harness = useMemo(() => makeMockEditor(textBefore), [textBefore]);
    const editorRef = useRef<MentionEditorHandle>(harness.handle);
    return {
        ...useMentions<Kind>({ resources: RESOURCES, editorRef, debounceMs: 0 }),
        harness,
    };
}

describe('useMentions', () => {
    it('opens the picker and seeds the active kind on a fresh `@` trigger', () => {
        const { result } = renderHook(() => useHookWithEditor('Hello @ma'));
        act(() => result.current.handleCaretChange());
        expect(result.current.pickerOpen).toBe(true);
        expect(result.current.triggerActive).toBe(true);
        expect(result.current.activeKind).toBe('user');
        expect(result.current.query).toBe('ma');
    });

    it('keeps the user-picked tab as the user keeps typing or deleting', () => {
        const { result } = renderHook(() => useHookWithEditor('Hello @ma'));
        act(() => result.current.handleCaretChange());

        act(() => {
            result.current.setActiveKind('booking');
            result.current.setManualKindOverride(true);
        });

        // Caret detector re-fires on every keystroke; the manual override
        // must survive each pass.
        act(() => {
            result.current.harness.state.textBefore = 'Hello @mar';
            result.current.handleCaretChange();
        });
        expect(result.current.activeKind).toBe('booking');

        act(() => {
            result.current.harness.state.textBefore = 'Hello @m';
            result.current.handleCaretChange();
        });
        expect(result.current.activeKind).toBe('booking');
    });

    it('replaces the trigger range with the chip HTML on selection', () => {
        const { result } = renderHook(() => useHookWithEditor('Hello @ma'));
        act(() => result.current.handleCaretChange());
        // `@ma` = trigger char + 2 word chars → consumedLength 3
        act(() => {
            result.current.pickSuggestion({
                id: 'maria',
                label: 'Maria Petrova',
                kind: 'user',
            });
        });
        const replace = result.current.harness.calls.find(
            (c) => c.method === 'replaceBeforeCaret',
        );
        expect(replace).toBeDefined();
        expect(replace?.args[0]).toBe(3);
        expect(replace?.args[1]).toMatch(/data-ref-id="user:maria"/);
        expect(result.current.pickerOpen).toBe(false);
        expect(result.current.triggerActive).toBe(false);
    });

    it('uses insertHTML (no trigger range) when picker was opened manually', () => {
        const { result } = renderHook(() =>
            useHookWithEditor('Hello plain text'),
        );
        // No trigger detected — picker opened via the toolbar button.
        act(() => result.current.setPickerOpen(true));
        act(() => {
            result.current.pickSuggestion({
                id: 'maria',
                label: 'Maria Petrova',
                kind: 'user',
            });
        });
        const insert = result.current.harness.calls.find(
            (c) => c.method === 'insertHTML',
        );
        const replace = result.current.harness.calls.find(
            (c) => c.method === 'replaceBeforeCaret',
        );
        expect(insert).toBeDefined();
        expect(replace).toBeUndefined();
    });

    it('closes the picker when the trigger pattern is broken (whitespace after needle)', () => {
        const { result } = renderHook(() => useHookWithEditor('Hello @m'));
        act(() => result.current.handleCaretChange());
        expect(result.current.pickerOpen).toBe(true);

        // Simulate the user typing a space — breaks the trigger regex.
        act(() => {
            result.current.harness.state.textBefore = 'Hello @m ';
            result.current.handleCaretChange();
        });
        expect(result.current.pickerOpen).toBe(false);
        expect(result.current.triggerActive).toBe(false);
    });

    it('stays closed when no resources are registered (graceful degradation)', () => {
        const harness = makeMockEditor('Hello @ma');
        const { result } = renderHook(() => {
            const editorRef = useRef<MentionEditorHandle>(harness.handle);
            return useMentions<Kind>({ editorRef, debounceMs: 0 });
        });
        act(() => result.current.handleCaretChange());
        expect(result.current.pickerOpen).toBe(false);
    });
});
