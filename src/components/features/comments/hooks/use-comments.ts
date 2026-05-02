/**
 * useComments — headless state machine for the Comments feature.
 *
 * Tracks composer mode (idle | replying | editing), submit/delete
 * helpers, error state, and resetKey bumping. The default `<Comments>`
 * component composes this hook; consumers building a fully custom UI
 * can use it directly.
 */
import { useCallback, useState } from 'react';

import type {
    CommentData,
    CommentFormValues,
    CommentSubmitHelpers,
    CommentUser,
    CommentsConfig,
} from '../comments.types';

export type ComposerMode<TResource extends string = string> =
    | { kind: 'idle' }
    | { kind: 'editing'; comment: CommentData<CommentUser, unknown, TResource> }
    | { kind: 'replying'; commentId: string; authorName?: string };

export interface UseCommentsOptions<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> {
    onSubmit?: CommentsConfig<TUser, TMeta, TResource>['onSubmit'];
    onUpdate?: CommentsConfig<TUser, TMeta, TResource>['onUpdate'];
    onDelete?: CommentsConfig<TUser, TMeta, TResource>['onDelete'];
}

export interface UseCommentsReturn<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> {
    composerMode: ComposerMode<TResource>;
    isSubmitting: boolean;
    formErrors: Record<string, string>;
    resetKey: number;

    startReply: (comment: CommentData<TUser, TMeta, TResource>) => void;
    startEdit: (comment: CommentData<TUser, TMeta, TResource>) => void;
    cancelComposerMode: () => void;

    submit: (values: CommentFormValues<TResource>) => void;
    deleteComment: (id: string) => void;

    /** Imperative reset — bumps `resetKey` so the composer clears itself. */
    resetComposer: () => void;
    /** Helpers exposed to onSubmit/onUpdate. */
    helpers: CommentSubmitHelpers;
}

export function useComments<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
>(
    options: UseCommentsOptions<TUser, TMeta, TResource> = {},
): UseCommentsReturn<TUser, TMeta, TResource> {
    const { onSubmit, onUpdate, onDelete } = options;

    const [composerMode, setComposerMode] = useState<ComposerMode<TResource>>({
        kind: 'idle',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [resetKey, setResetKey] = useState(0);

    const helpers: CommentSubmitHelpers = {
        setErrors: (errors) => setFormErrors(errors),
        reset: () => {
            setResetKey((k) => k + 1);
            setComposerMode({ kind: 'idle' });
            setFormErrors({});
        },
        setSubmitting: setIsSubmitting,
    };

    const startReply = useCallback(
        (comment: CommentData<TUser, TMeta, TResource>) => {
            setComposerMode({
                kind: 'replying',
                commentId: comment.id ?? '',
                authorName: comment.user?.name,
            });
        },
        [],
    );

    const startEdit = useCallback(
        (comment: CommentData<TUser, TMeta, TResource>) => {
            setComposerMode({ kind: 'editing', comment });
        },
        [],
    );

    const cancelComposerMode = useCallback(() => {
        setComposerMode({ kind: 'idle' });
        setFormErrors({});
    }, []);

    const submit = useCallback(
        (values: CommentFormValues<TResource>) => {
            setIsSubmitting(true);
            setFormErrors({});

            if (composerMode.kind === 'editing' && composerMode.comment.id) {
                if (!onUpdate) {
                    setIsSubmitting(false);
                    return;
                }
                onUpdate(composerMode.comment.id, values, helpers);
                return;
            }

            if (!onSubmit) {
                setIsSubmitting(false);
                return;
            }

            const payload: CommentFormValues<TResource> =
                composerMode.kind === 'replying'
                    ? { ...values, replyToId: composerMode.commentId }
                    : values;

            onSubmit(payload, helpers);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [composerMode, onSubmit, onUpdate],
    );

    const deleteComment = useCallback(
        (id: string) => {
            if (!onDelete || !id) return;
            onDelete(id);
        },
        [onDelete],
    );

    const resetComposer = useCallback(() => {
        setResetKey((k) => k + 1);
        setComposerMode({ kind: 'idle' });
        setFormErrors({});
    }, []);

    return {
        composerMode,
        isSubmitting,
        formErrors,
        resetKey,
        startReply,
        startEdit,
        cancelComposerMode,
        submit,
        deleteComment,
        resetComposer,
        helpers,
    };
}
