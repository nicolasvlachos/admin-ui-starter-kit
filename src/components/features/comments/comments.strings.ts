/**
 * Strings for the Comments feature. Consumers override via the `strings`
 * prop on `<Comments>` / `<CommentsCard>` / sub-components — values are
 * deep-merged over these defaults.
 */
export interface CommentsStrings {
    /** Card title — usually "Comments". Set to "" to hide. */
    title: string;
    /** Subtitle under the card title — optional. */
    subtitle: string;
    /** Empty-state copy for the timeline. */
    empty: string;
    /** Empty-state secondary copy. */
    emptyHint: string;

    // Composer ---------------------------------------------------------
    /** Composer rich-text placeholder. */
    composerPlaceholder: string;
    /** Submit label for new comments. */
    composerSubmit: string;
    /** Submit label while pending. */
    composerSubmitting: string;
    /** Submit label when editing. */
    composerSave: string;
    /** Required-content error. */
    invalidContent: string;
    /** Cancel/dismiss draft. */
    composerCancel: string;
    /** "Edit comment" eyebrow shown above the composer in edit mode. */
    composerEditingEyebrow: string;
    /** "Reply to {{name}}" eyebrow shown above the composer in reply mode. */
    composerReplyingEyebrow: string;

    // Toolbar buttons --------------------------------------------------
    composerAttachmentLabel: string;
    composerReferenceLabel: string;
    composerReferenceMenuTitle: string;
    composerReferenceSearchPlaceholder: string;
    composerReferenceEmpty: string;
    composerReferenceLoading: string;

    // Item -------------------------------------------------------------
    fallbackAuthor: string;
    pinned: string;
    edited: string;
    /** Trash button aria-label / tooltip. */
    deleteLabel: string;
    /** Edit button label. */
    editLabel: string;
    /** Reply button label. */
    replyLabel: string;
    /** Pin/unpin button label. */
    pinLabel: string;
    unpinLabel: string;
    /** "More actions" trigger aria-label. */
    moreActionsLabel: string;
    /** Confirm-delete button label inside the action menu. */
    confirmDeleteLabel: string;

    // Attachments ------------------------------------------------------
    attachmentFallback: string;
    attachmentRemoveLabel: string;
    attachmentUploadingLabel: string;
    attachmentFailedLabel: string;
    attachmentTooLargeError: string;
    attachmentTooManyError: string;
    attachmentRetryLabel: string;
    attachmentDownloadLabel: string;

    // Reactions --------------------------------------------------------
    addReactionLabel: string;

    // Misc -------------------------------------------------------------
    showRepliesLabel: string;
    hideRepliesLabel: string;
}

export const defaultCommentsStrings: CommentsStrings = {
    title: 'Comments',
    subtitle: '',
    empty: 'No comments yet.',
    emptyHint: 'Start the conversation — your team will see it instantly.',

    composerPlaceholder: 'Write a comment…',
    composerSubmit: 'Post comment',
    composerSubmitting: 'Posting…',
    composerSave: 'Save changes',
    invalidContent: 'Comment cannot be empty.',
    composerCancel: 'Cancel',
    composerEditingEyebrow: 'Editing comment',
    composerReplyingEyebrow: 'Replying to {{name}}',

    composerAttachmentLabel: 'Attach file',
    composerReferenceLabel: 'Mention or link',
    composerReferenceMenuTitle: 'Insert reference',
    composerReferenceSearchPlaceholder: 'Search…',
    composerReferenceEmpty: 'No matches.',
    composerReferenceLoading: 'Searching…',

    fallbackAuthor: 'Anonymous',
    pinned: 'Pinned',
    edited: 'edited',
    deleteLabel: 'Delete',
    editLabel: 'Edit',
    replyLabel: 'Reply',
    pinLabel: 'Pin',
    unpinLabel: 'Unpin',
    moreActionsLabel: 'More actions',
    confirmDeleteLabel: 'Delete comment',

    attachmentFallback: 'Attachment',
    attachmentRemoveLabel: 'Remove attachment',
    attachmentUploadingLabel: 'Uploading…',
    attachmentFailedLabel: 'Upload failed',
    attachmentTooLargeError: 'File is too large.',
    attachmentTooManyError: 'Too many attachments.',
    attachmentRetryLabel: 'Retry',
    attachmentDownloadLabel: 'Download',

    addReactionLabel: 'Add reaction',

    showRepliesLabel: 'Show replies',
    hideRepliesLabel: 'Hide replies',
};

/**
 * Tiny `{{token}}` interpolator used by templated strings like
 * `composerReplyingEyebrow`. No HTML escaping — treat values as plain text.
 */
export function interpolateString(
    template: string,
    values: Record<string, string | number | undefined>,
): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
        const value = values[key];
        return value === undefined || value === null ? '' : String(value);
    });
}
