// @vitest-environment jsdom

/**
 * Verifies the headless picker-state machine. The hook is the most
 * critical seam in the mentions module — it's what consumers rebuild
 * custom UIs against (slash menus, command palettes, …).
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
    useMentionsSearch,
    type UseMentionsSearchOptions,
} from '../hooks/use-mentions-search';
import type { MentionResource } from '../mentions.types';

type Kind = 'user' | 'booking' | 'order';

const PEOPLE = [
    { id: 'maria', label: 'Maria Petrova', description: 'Operations' },
    { id: 'ivana', label: 'Ivana Todorova', description: 'Refunds' },
    { id: 'stefan', label: 'Stefan Kolev', description: 'Customer' },
];
const BOOKINGS = [
    { id: 'BKG-1', label: 'BKG-1', description: 'Stefan Kolev · Apr 12' },
    { id: 'BKG-2', label: 'BKG-2', description: 'Maria Petrova · Apr 19' },
];
const ORDERS = [
    { id: 'INV-A', label: 'INV-A', description: '€420 · Paid' },
];

function makeResources(): UseMentionsSearchOptions<Kind>['resources'] {
    return {
        user:    { trigger: '@', label: 'Person',  suggestions: PEOPLE.map((p) => ({ ...p, kind: 'user' as Kind })) },
        booking: { trigger: '#', label: 'Booking', suggestions: BOOKINGS.map((b) => ({ ...b, kind: 'booking' as Kind })) },
        order:   { trigger: '$', label: 'Order',   suggestions: ORDERS.map((o) => ({ ...o, kind: 'order' as Kind })) },
    } satisfies Record<Kind, MentionResource<Kind>>;
}

const NOOP_DEBOUNCE = 0;

describe('useMentionsSearch', () => {
    it('exposes registered kinds and defaults the active kind to the first one', () => {
        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: makeResources(),
                debounceMs: NOOP_DEBOUNCE,
            }),
        );
        expect(result.current.kinds).toEqual(['user', 'booking', 'order']);
        expect(result.current.activeKind).toBe('user');
    });

    it('filters per-kind static suggestions by the typed query', async () => {
        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: makeResources(),
                debounceMs: NOOP_DEBOUNCE,
            }),
        );

        act(() => result.current.setQuery('mar'));
        await waitFor(() => {
            const ids = result.current.suggestions.map(
                (s: { id: string }) => s.id,
            );
            expect(ids).toEqual(['maria']);
        });
    });

    it('runs every kind in parallel and exposes per-kind buckets', async () => {
        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: makeResources(),
                debounceMs: NOOP_DEBOUNCE,
            }),
        );

        act(() => result.current.setQuery('a'));
        await waitFor(() => {
            const userBucket = result.current.suggestionsByKind.user ?? [];
            const bookingBucket = result.current.suggestionsByKind.booking ?? [];
            expect(userBucket.length).toBeGreaterThan(0);
            expect(bookingBucket.length).toBe(0);
        });
    });

    it('falls back to the global onResourceSearch when per-kind config is empty', async () => {
        const onResourceSearch = vi
            .fn()
            .mockImplementation((needle: string, kind: Kind) =>
                kind === 'user' && needle === 'm'
                    ? [{ id: 'm', label: 'Mock' }]
                    : [],
            );

        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: { user: { trigger: '@' }, booking: { trigger: '#' } },
                onResourceSearch,
                debounceMs: NOOP_DEBOUNCE,
            }),
        );

        act(() => result.current.setQuery('m'));
        await waitFor(() => {
            expect(result.current.suggestions).toHaveLength(1);
            expect(result.current.suggestions[0].id).toBe('m');
        });
        // Both kinds were searched.
        expect(onResourceSearch).toHaveBeenCalledWith('m', 'user');
        expect(onResourceSearch).toHaveBeenCalledWith('m', 'booking');
    });

    it('auto-switches the active kind when the current one has no matches and another does', async () => {
        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: makeResources(),
                debounceMs: NOOP_DEBOUNCE,
            }),
        );
        // user is the default active kind. Type a needle only Booking matches.
        act(() => result.current.setQuery('bkg'));
        await waitFor(() => {
            expect(result.current.activeKind).toBe('booking');
            expect(result.current.suggestions).toHaveLength(2);
        });
    });

    it('preserves the user-picked kind once `manualKindOverride` is true', async () => {
        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: makeResources(),
                debounceMs: NOOP_DEBOUNCE,
            }),
        );
        act(() => {
            result.current.setActiveKind('order');
            result.current.setManualKindOverride(true);
        });
        // Even though "bkg" only matches Booking, the override pins Order.
        act(() => result.current.setQuery('bkg'));
        await waitFor(() => {
            expect(result.current.suggestionsByKind.booking?.length).toBe(2);
        });
        expect(result.current.activeKind).toBe('order');
    });

    it('selectSuggestion adds a Mention with `kind:id` shape and dedupes', () => {
        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: makeResources(),
                debounceMs: NOOP_DEBOUNCE,
            }),
        );
        let mention;
        act(() => {
            mention = result.current.selectSuggestion({
                id: 'maria',
                label: 'Maria Petrova',
                kind: 'user',
            });
        });
        expect(mention).toMatchObject({ id: 'user:maria', kind: 'user' });
        expect(result.current.mentions).toHaveLength(1);

        // Re-selecting the same suggestion is a no-op.
        act(() => {
            result.current.selectSuggestion({
                id: 'maria',
                label: 'Maria Petrova',
                kind: 'user',
            });
        });
        expect(result.current.mentions).toHaveLength(1);
    });

    it('reset clears mentions, query, and the manual-override flag', () => {
        const { result } = renderHook(() =>
            useMentionsSearch<Kind>({
                resources: makeResources(),
                debounceMs: NOOP_DEBOUNCE,
            }),
        );
        act(() => {
            result.current.setQuery('m');
            result.current.setManualKindOverride(true);
            result.current.selectSuggestion({ id: 'maria', label: 'Maria', kind: 'user' });
        });
        expect(result.current.mentions).toHaveLength(1);

        act(() => result.current.reset());
        expect(result.current.mentions).toHaveLength(0);
        expect(result.current.query).toBe('');
        expect(result.current.manualKindOverride).toBe(false);
    });
});
