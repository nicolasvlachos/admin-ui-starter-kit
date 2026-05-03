/**
 * EventLog — chronological feed mixing comment entries with audit /
 * system / activity events under one feature surface. It composes
 * `features/comments` (comment rows + composer) and `features/mentions`
 * (inline references in any kind of entry).
 *
 * Pass `entries` as a heterogeneous array; each entry's `kind` selects
 * the renderer. Built-ins:
 *   - `'comment'` → `<CommentItem>` row
 *   - everything else → activity-style row (`<EventLogEventRow>`)
 *
 * Override or extend per kind via the `renderers` prop.
 *
 * The composer is opt-in (`composer.enabled`) — when on, posting in
 * the composer fires `composer.onSubmit` with a `CommentFormValues`
 * payload the consumer typically appends as a new `EventLogCommentEntry`.
 */
import { useMemo } from 'react';
import type { FC, ReactNode } from 'react';

import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { useDatesConfig } from '@/lib/ui-provider';
import {
    CommentComposer,
    CommentItem,
    type CommentData,
    type CommentFormValues,
    type CommentSubmitHelpers,
    type CommentUser,
} from '@/components/features/comments';

import { defaultEventLogStrings } from './event-log.strings';
import { EventLogEventRow } from './partials/event-log-event-row';
import type {
    EventLogEntry,
    EventLogProps,
    EventLogRenderer,
} from './event-log.types';

/**
 * Bridge between `<CommentComposer onSubmit={(values) => …}>` (values
 * only) and the richer `EventLogComposerConfig.onSubmit` signature
 * (`values, helpers`). Synthesises noop helpers — consumers wanting
 * real helpers should disable the built-in composer and render
 * `<CommentComposer>` themselves.
 *
 * Typed against the default-`string` resource kind because
 * `<CommentComposer>` doesn't propagate the `TResource` generic
 * through. Localising the structural cast here keeps the rest of the
 * EventLog body free of `as never` boundary noise.
 */
function makeBridgedOnSubmit<TResource extends string = string>(
    onSubmit:
        | ((
              values: CommentFormValues<TResource>,
              helpers: CommentSubmitHelpers,
          ) => void)
        | undefined,
): (values: CommentFormValues) => void {
    if (!onSubmit) return () => {};
    const noopHelpers: CommentSubmitHelpers = {
        setErrors: () => {},
        reset: () => {},
        setSubmitting: () => {},
    };
    return (values) => {
        onSubmit(values as CommentFormValues<TResource>, noopHelpers);
    };
}

function sortEntries<T extends { timestamp?: string }>(
    entries: ReadonlyArray<T>,
    order: 'asc' | 'desc',
): ReadonlyArray<T> {
    const arr = [...entries];
    arr.sort((a, b) => {
        const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return order === 'asc' ? ta - tb : tb - ta;
    });
    return arr;
}

export function EventLog<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
>(props: EventLogProps<TUser, TMeta, TResource>) {
    const {
        entries,
        order = 'desc',
        resources: resourcesProp,
        onResourceSearch: onResourceSearchProp,
        canModerate,
        onCommentDelete,
        onCommentReact,
        onCommentReply,
        onCommentPinToggle,
        strings,
        eventLogStrings: eventLogStringsProp,
        renderers,
        composer,
        bare = false,
        title,
        getMediaUrl,
        getMediaName,
        getStatusLabel,
        formatRelativeTime,
        className,
    } = props;

    const resources = resourcesProp;
    const onResourceSearch = onResourceSearchProp;

    const sorted = useMemo(
        () => sortEntries(entries, order),
        [entries, order],
    );
    const eventLogStrings = useStrings(defaultEventLogStrings, eventLogStringsProp);

    const { formatRelativeTime: storeFormatRelative } = useDatesConfig();
    const formatRelative = formatRelativeTime ?? storeFormatRelative ?? ((iso: string) => iso);

    const renderEntry = (
        entry: EventLogEntry<TUser, TMeta, TResource>,
        index: number,
        total: number,
    ): ReactNode => {
        const isLast = index === total - 1;
        const custom = renderers?.[entry.kind] as
            | EventLogRenderer<TUser, TMeta, TResource>
            | undefined;
        if (custom) {
            return custom(entry, { resources, accessors: { getMediaUrl, getMediaName, getStatusLabel, formatRelativeTime: formatRelative }, strings });
        }

        if (entry.kind === 'comment') {
            const commentEntry = entry as Extract<
                EventLogEntry<TUser, TMeta, TResource>,
                { kind: 'comment' }
            >;
            return (
                <li
                    key={commentEntry.id}
                    className="relative"
                    data-event-id={commentEntry.id}
                >
                    <CommentItem
                        comment={
                            commentEntry.comment as CommentData<
                                CommentUser,
                                unknown,
                                TResource
                            >
                        }
                        canModerate={canModerate}
                        onDelete={onCommentDelete}
                        // Boundary cast: same generic-erasure as the
                        // `comment` cast above — `<CommentItem>` doesn't
                        // propagate the `<TUser, TMeta, TResource>`
                        // triple, so we widen the callback at the call
                        // site. Shape is identical.
                        onPinToggle={onCommentPinToggle as never}
                        onReact={onCommentReact}
                        onReply={onCommentReply}
                        strings={strings}
                        resources={resources}
                        getMediaUrl={getMediaUrl}
                        getMediaName={getMediaName}
                        getStatusLabel={getStatusLabel}
                        formatRelativeTime={formatRelative}
                    />
                </li>
            );
        }

        const eventEntry = entry as Extract<
            EventLogEntry<TUser, TMeta, TResource>,
            { kind: Exclude<string, 'comment'> }
        >;
        return (
            <EventLogEventRow
                key={eventEntry.id}
                // Boundary cast: `<EventLogEventRow>` is non-generic
                // (kind is `string`), but `entry` carries the
                // consumer's narrower `TResource`. Structural shape is
                // identical, so this is the standard widening cast.
                entry={eventEntry as never}
                resources={resources as never}
                formatRelativeTime={formatRelative}
                isLast={isLast}
            />
        );
    };

    const composerBlock = composer?.enabled ? (
        <div>
            <CommentComposer
                context={composer.context}
                canComment
                onSubmit={makeBridgedOnSubmit(composer.onSubmit)}
                /*
                 * `as never` here is the documented generic-erasure
                 * boundary: `<EventLog<TUser, TMeta, TResource>>` is
                 * generic in `TResource`, but `<CommentComposer>` types
                 * its `resources` prop with the default-string version
                 * of the registry. The shape is structurally identical
                 * — only the kind union differs — so we widen at the
                 * boundary. Keep the cast localised here; do not
                 * propagate it into `useMentions` or the hooks.
                 */
                resources={resources as never}
                onResourceSearch={onResourceSearch as never}
                placeholder={composer.placeholder}
                autoFocus={composer.autoFocus}
            />
        </div>
    ) : null;

    const composerPosition = composer?.position ?? 'top';

    const list =
        sorted.length === 0 ? (
            <Text type="secondary" className="py-2">
                {eventLogStrings.emptyMessage}
            </Text>
        ) : (
            <ul aria-label={eventLogStrings.listAriaLabel} className="flex flex-col gap-2.5">
                {sorted.map((entry, idx) => renderEntry(entry, idx, sorted.length))}
            </ul>
        );

    const inner = (
        <div className="flex flex-col gap-4">
            {composerPosition === 'top' && composerBlock}
            {list}
            {composerPosition === 'bottom' && composerBlock}
        </div>
    );

    if (bare) {
        return inner;
    }
    return (
        <SmartCard title={title} padding="sm" className={className}>
            {inner}
        </SmartCard>
    );
}

EventLog.displayName = 'EventLog';

export const EventLogComponent: FC<EventLogProps> = (props) => (
    <EventLog {...props} />
);
