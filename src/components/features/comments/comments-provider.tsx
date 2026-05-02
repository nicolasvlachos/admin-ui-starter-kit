/**
 * Comments — internal helper hooks for resolving strings and accessors.
 *
 * Rationale: the previous `<CommentsProvider>` is gone. Library-wide
 * defaults now live in `<UIProvider>` (`useMediaConfig` / `useDatesConfig`).
 * Per-mount overrides flow as direct props on `<Comments>` and its
 * partials. These helpers just centralize the merge order.
 *
 * Resolution order everywhere:
 *
 *     props.strings      ← deep-merged over `defaultCommentsStrings`
 *     props.accessor.X   ← falls back to UIProvider's media/dates resolvers,
 *                          then to a built-in default at the call site.
 */
import { useMemo } from 'react';

import { useDatesConfig, useMediaConfig } from '@/lib/ui-provider';

import {
    defaultCommentsStrings,
    type CommentsStrings,
} from './comments.strings';
import type { CommentAttachment, CommentsAccessors } from './comments.types';

/**
 * Resolve final strings by merging defaults → component prop. Stable
 * identity when the prop reference is unchanged.
 */
export function useResolvedStrings(
    propStrings?: Partial<CommentsStrings>,
): CommentsStrings {
    return useMemo(
        () => ({
            ...defaultCommentsStrings,
            ...(propStrings ?? {}),
        }),
        [propStrings],
    );
}

/**
 * Resolve accessors. Order:
 *   1. explicit prop accessor
 *   2. matching UIProvider slot (`useMediaConfig().resolveUrl`, etc.)
 *   3. caller's own fallback when neither is present (handled at call site)
 */
export function useResolvedAccessors(
    propAccessors?: CommentsAccessors,
): CommentsAccessors {
    const media = useMediaConfig();
    const dates = useDatesConfig();
    return useMemo<CommentsAccessors>(
        () => ({
            getMediaUrl:
                propAccessors?.getMediaUrl ??
                ((m: CommentAttachment | null | undefined) =>
                    media.resolveUrl?.((m ?? {}) as { url?: string; key?: string })),
            getMediaName:
                propAccessors?.getMediaName ??
                ((m: CommentAttachment | null | undefined) =>
                    media.resolveName?.((m ?? {}) as { name?: string })),
            getStatusLabel: propAccessors?.getStatusLabel,
            formatRelativeTime:
                propAccessors?.formatRelativeTime ?? dates.formatRelativeTime,
        }),
        [propAccessors, media, dates.formatRelativeTime],
    );
}
