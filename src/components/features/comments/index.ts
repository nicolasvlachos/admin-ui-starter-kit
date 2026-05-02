// Main entry — `CommentsCard` is kept as a back-compat alias for `Comments`.
export { Comments, CommentsCard } from './comments';

// Internal helper hooks. Library-wide defaults live in `<UIProvider>`
// (see `@/lib/ui-provider`); these just merge `defaults → props`.
export {
    useResolvedAccessors,
    useResolvedStrings,
} from './comments-provider';

// Partials — every internal piece is composable from outside.
export {
    CommentItem,
    CommentTimeline,
    CommentComposer,
    CommentContent,
    renderCommentContent,
    CommentAttachmentChip,
    CommentReferenceChip,
    CommentEmpty,
    makeReplyEyebrow,
} from './partials';
export type {
    CommentAttachmentChipProps,
    CommentReferenceChipProps,
    CommentEmptyProps,
    CommentComposerHandle,
} from './partials';

// Hooks — headless state machines for fully custom UIs.
export {
    useAttachmentUpload,
    useReferencePicker,
    useComments,
} from './hooks';
export type {
    UseAttachmentUploadOptions,
    UseAttachmentUploadReturn,
    UseReferencePickerOptions,
    UseReferencePickerReturn,
    UseCommentsOptions,
    UseCommentsReturn,
    ComposerMode,
} from './hooks';

// Strings + interpolation helper.
export {
    defaultCommentsStrings,
    interpolateString,
    type CommentsStrings,
} from './comments.strings';

// Types — generics, references, attachments, config.
export type {
    CommentableContext,
    CommentAttachment,
    CommentAttachmentStatus,
    CommentAttachmentUploadContext,
    CommentComposerProps,
    CommentContentType,
    CommentData,
    CommentFormValues,
    CommentItemProps,
    CommentMedia,
    CommentReaction,
    CommentReference,
    CommentRenderItemContext,
    CommentResourceSuggestion,
    CommentResourceType,
    CommentSubmitHelpers,
    CommentTimelineProps,
    CommentTone,
    CommentUser,
    CommentsAccessors,
    CommentsAttachmentsConfig,
    CommentsCardProps,
    CommentsComposerPosition,
    CommentsConfig,
    CommentsProps,
    CommentsSlots,
} from './comments.types';

// NOTE: this feature is framework-agnostic. The library no longer ships
// `adapters/$framework/` folders. Consumers wire routing / data /
// optimistic-update / i18n at the call site by passing `onSubmit`,
// `onDelete`, `onAfterMutate`, `onError`, `accessors`, and `strings`
// directly to `<Comments>` / `<CommentsCard>`.
