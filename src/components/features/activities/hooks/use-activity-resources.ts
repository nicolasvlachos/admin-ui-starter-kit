/**
 * useActivityResources — registry hook for the rich-resource feature.
 *
 * The registry maps `key → ActivityResourceConfig`. Activity items reference
 * resources by `key`; the row renderer looks up the live config so badges,
 * icons, and links can be edited globally without touching individual rows.
 *
 * The hook re-seeds whenever the `resources` prop reference changes and emits
 * the full registry on every mutation via `onResourcesChange`. Wire that
 * callback to localStorage / a backend mutation to persist the user's
 * resource customisations across sessions.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import type {
    ActivityResourceConfig,
    ActivityResourceRef,
} from '../activities.types';

export type ActivityResourceRegistry = Readonly<
    Record<string, ActivityResourceConfig>
>;

export interface UseActivityResourcesOptions {
    resources?: ActivityResourceRegistry;
    onResourcesChange?: (registry: ActivityResourceRegistry) => void;
}

export interface UseActivityResourcesReturn {
    registry: ActivityResourceRegistry;
    /** Look up a resource by ref or key. */
    get: (
        ref: ActivityResourceRef | string,
    ) => ActivityResourceConfig | undefined;
    /** Replace a resource entry wholesale (or insert new). */
    register: (key: string, config: ActivityResourceConfig) => void;
    /** Shallow-merge a partial update over an existing entry. */
    update: (key: string, partial: Partial<ActivityResourceConfig>) => void;
    /** Remove an entry. */
    remove: (key: string) => void;
    /** Replace the entire registry. */
    setAll: (registry: ActivityResourceRegistry) => void;
    /** Reset to the original `resources` prop (or empty if none). */
    reset: () => void;
}

export function useActivityResources({
    resources,
    onResourcesChange,
}: UseActivityResourcesOptions = {}): UseActivityResourcesReturn {
    const [registry, setRegistry] = useState<ActivityResourceRegistry>(
        () => resources ?? {},
    );

    const seedRef = useRef(resources);
    useEffect(() => {
        if (resources !== seedRef.current) {
            seedRef.current = resources;
            setRegistry(resources ?? {});
        }
    }, [resources]);

    const onChangeRef = useRef(onResourcesChange);
    useEffect(() => {
        onChangeRef.current = onResourcesChange;
    }, [onResourcesChange]);

    const emit = useCallback((next: ActivityResourceRegistry) => {
        onChangeRef.current?.(next);
    }, []);

    const register = useCallback(
        (key: string, config: ActivityResourceConfig) => {
            setRegistry((current) => {
                const next = { ...current, [key]: config };
                emit(next);
                return next;
            });
        },
        [emit],
    );

    const update = useCallback(
        (key: string, partial: Partial<ActivityResourceConfig>) => {
            setRegistry((current) => {
                const existing = current[key];
                if (!existing) return current;
                const next = {
                    ...current,
                    [key]: { ...existing, ...partial },
                };
                emit(next);
                return next;
            });
        },
        [emit],
    );

    const remove = useCallback(
        (key: string) => {
            setRegistry((current) => {
                if (!(key in current)) return current;
                const next = { ...current };
                delete next[key];
                emit(next);
                return next;
            });
        },
        [emit],
    );

    const setAll = useCallback(
        (next: ActivityResourceRegistry) => {
            setRegistry(next);
            emit(next);
        },
        [emit],
    );

    const reset = useCallback(() => {
        const next = seedRef.current ?? {};
        setRegistry(next);
        emit(next);
    }, [emit]);

    const get = useCallback(
        (ref: ActivityResourceRef | string) => {
            const key = typeof ref === 'string' ? ref : ref.key;
            return registry[key];
        },
        [registry],
    );

    return { registry, get, register, update, remove, setAll, reset };
}
