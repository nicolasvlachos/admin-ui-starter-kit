export { useAttachmentUpload } from './use-attachment-upload';
export type {
    UseAttachmentUploadOptions,
    UseAttachmentUploadReturn,
} from './use-attachment-upload';

export { useComments } from './use-comments';
export type {
    ComposerMode,
    UseCommentsOptions,
    UseCommentsReturn,
} from './use-comments';

// Back-compat: `useReferencePicker` is now `useMentionsSearch` from the
// shared `features/mentions` module. New code should import from
// `@/components/features/mentions` directly.
export {
    useMentionsSearch as useReferencePicker,
    type UseMentionsSearchOptions as UseReferencePickerOptions,
    type UseMentionsSearchReturn as UseReferencePickerReturn,
} from '@/components/features/mentions';
