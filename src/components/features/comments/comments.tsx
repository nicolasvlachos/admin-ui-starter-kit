/**
 * Comments — top-level entry for the Comments feature.
 *
 * Composes the composer + timeline + empty state behind a single API.
 * Generic in `<TUser, TMeta, TResource>` so consumers can type their
 * domain (user shape, custom meta payload, resource-kind union).
 *
 * Per-mount wiring (callbacks, resources, accessors) flows as direct
 * props. Library-wide display defaults (composer position, etc.) come
 * from `<UIProvider>` — see `@/lib/ui-provider`. Slots, render-props,
 * and the headless `useComments()` hook cover the composability
 * spectrum.
 *
 * `CommentsCard` is exported as a back-compat alias for the previous
 * name; the API shape is identical.
 */
import { useCallback, useState } from 'react';

import { SmartCard } from '@/components/base/cards';
import { useCommentsConfig as useCommentsUIDefaults } from '@/lib/ui-provider';

import { useResolvedStrings } from './comments-provider';
import type {
    CommentData,
    CommentFormValues,
    CommentSubmitHelpers,
    CommentUser,
    CommentsProps,
} from './comments.types';
import { CommentComposer } from './partials/comment-composer';
import { CommentEmpty } from './partials/comment-empty';
import { CommentTimeline } from './partials/comment-timeline';

import { cn } from '@/lib/utils';
export function Comments<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
>(props: CommentsProps<TUser, TMeta, TResource>) {
    const ui = useCommentsUIDefaults();

    const composerPosition =
        props.composerPosition ?? ui.composerPosition ?? 'top';

    const canComment = props.canComment ?? false;
    const canModerate = props.canModerate ?? false;

    const onSubmit = props.onSubmit;
    const onDelete = props.onDelete;
    const onPinToggle = props.onPinToggle;
    const onReact = props.onReact;
    const onReply = props.onReply;

    const resources = props.resources;
    const attachments = props.attachments;

    const strings = useResolvedStrings(props.strings);
    const cardTitle = props.title === undefined ? strings.title : props.title;

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const submitHelpers: CommentSubmitHelpers = {
        setErrors: (errors) => setFormErrors(errors),
        reset: () => {
            setResetKey((k) => k + 1);
            setFormErrors({});
            setIsSubmitting(false);
        },
        setSubmitting: setIsSubmitting,
    };

    const handleSubmit = useCallback(
        (values: CommentFormValues<TResource>) => {
            if (!onSubmit) return;
            setIsSubmitting(true);
            setFormErrors({});
            onSubmit(values, submitHelpers);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onSubmit],
    );

    const composer = props.composerSlot ?? (
        canComment ? (
            <CommentComposer
                context={props.context}
                canComment={canComment}
                isSubmitting={isSubmitting}
                errors={formErrors}
                resetKey={resetKey}
                /*
                 * Generic-erasure boundary: `<Comments<TResource>>` is
                 * generic but `<CommentComposer>` types its props
                 * against the default-string kind. Shapes are
                 * structurally identical — only the kind union differs.
                 */
                onSubmit={
                    handleSubmit as (values: CommentFormValues) => void
                }
                strings={props.strings}
                resources={resources as never}
                attachments={attachments}
            />
        ) : null
    );

    /*
     * Same generic-erasure boundary as the composer block above:
     * `<Comments<TUser, TMeta, TResource>>` is generic, but
     * `<CommentTimeline>` types its `comments` and `onPinToggle` props
     * against `CommentData<CommentUser, unknown, TResource>` (default
     * `TUser`/`TMeta`). The shapes are structurally identical — `TUser`
     * narrows the author union and `TMeta` narrows the metadata payload,
     * neither of which the timeline reads — so the widening cast is
     * safe. Keep the cast localised here; do not propagate into the
     * timeline body.
     */
    const timeline = (
        <CommentTimeline
            comments={props.comments as ReadonlyArray<CommentData<CommentUser, unknown, TResource>>}
            canModerate={canModerate}
            onDelete={onDelete}
            onPinToggle={onPinToggle as (c: CommentData<CommentUser, unknown, TResource>) => void}
            onReact={onReact}
            onReply={onReply}
            strings={props.strings}
            getMediaUrl={props.getMediaUrl}
            getMediaName={props.getMediaName}
            getStatusLabel={props.getStatusLabel}
            formatRelativeTime={props.formatRelativeTime}
            resources={resources}
            // `renderItem` is generic over the consumer's `<TUser, TMeta,
            // TResource>` triple; `<CommentTimeline>` types it against
            // the default `CommentUser, unknown, string` triple. The
            // structural signature is the same — boundary cast only.
            renderItem={props.renderItem as never}
            renderAttachment={props.renderAttachment}
            renderReference={props.renderReference}
            emptySlot={
                props.emptySlot ?? <CommentEmpty strings={props.strings} />
            }
        />
    );

    const composerBlock = composer ? <div>{composer}</div> : null;

    const inner = (
        <div className="flex flex-col gap-4">
            {props.headerSlot}
            {composerPosition === 'top' && composerBlock}
            {timeline}
            {composerPosition === 'bottom' && composerBlock}
            {props.footerSlot}
        </div>
    );

    if (props.bare) {
        return inner;
    }

    return (
        <SmartCard
            title={cardTitle === false ? undefined : cardTitle}
            description={strings.subtitle || undefined}
            padding="sm"
            className={cn('comments--component', props.className)}
        >
            {inner}
        </SmartCard>
    );
}

/** Back-compat alias — `CommentsCard` was the previous primary export. */
export const CommentsCard = Comments;
