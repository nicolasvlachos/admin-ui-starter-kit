export { CommentItem } from './comment-item';
export { CommentTimeline } from './comment-timeline';
export {
    CommentComposer,
    type CommentComposerHandle,
    makeReplyEyebrow,
} from './comment-composer';
export { CommentContent, renderCommentContent } from './comment-content';
export { CommentAttachmentChip } from './comment-attachment-chip';
export type { CommentAttachmentChipProps } from './comment-attachment-chip';
export { CommentEmpty } from './comment-empty';
export type { CommentEmptyProps } from './comment-empty';

// Back-compat: `CommentReferenceChip` is now an alias for the shared
// `MentionChip` from `features/mentions`. New code should import from
// `@/components/features/mentions` directly.
export {
    MentionChip as CommentReferenceChip,
    type MentionChipProps as CommentReferenceChipProps,
} from '@/components/features/mentions';
