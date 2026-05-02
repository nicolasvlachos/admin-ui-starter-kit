/**
 * Comments feature — type system.
 *
 * Generic in three axes:
 *   - TUser     — author shape (id/name/avatar by default; consumer can extend)
 *   - TMeta     — free-form per-comment payload (analytics, custom flags)
 *   - TResource — string union of resource kinds the consumer wires up
 *                 (e.g. `'user' | 'booking' | 'order'`)
 *
 * The feature is framework-agnostic: routing / i18n / data fetching arrive
 * via callback props at the call site (`onSubmit`, `onDelete`, `onReact`, …).
 * The library itself never imports any framework integration package
 * (`@inertiajs/*`, `@tanstack/react-query`, `next/*`, `react-router*`,
 * `vite-bundled-i18n/*`, `ziggy-js`). Library-wide display defaults
 * (composer position, max attachments) come from `<UIProvider>` —
 * see `@/lib/ui-provider`.
 */
import type { ComponentType, ReactNode } from 'react';

import type { CommentsStrings } from './comments.strings';

/* ------------------------------------------------------------------ */
/*  Author                                                             */
/* ------------------------------------------------------------------ */

export interface CommentUser {
    id?: string | number;
    name?: string;
    avatar?: string;
}

/* ------------------------------------------------------------------ */
/*  Attachments                                                        */
/* ------------------------------------------------------------------ */

export type CommentAttachmentStatus = 'uploading' | 'uploaded' | 'failed';

export interface CommentAttachment {
    id: string;
    /** Display name. */
    name: string;
    /** Permalink. Optional while uploading. */
    url?: string;
    /** Size in bytes. */
    size?: number;
    /** Mime type — drives icon/preview pickers. */
    mimeType?: string;
    /** Optional thumbnail URL for image attachments. */
    thumbnailUrl?: string;
    /** Upload state — useful while a file is in flight. */
    status?: CommentAttachmentStatus;
    /** 0–100 progress for in-flight uploads. */
    progress?: number;
    /** Error message if `status === 'failed'`. */
    error?: string;
}

/** Legacy alias kept for back-compat — older consumers used `CommentMedia`. */
export type CommentMedia = CommentAttachment;

/* ------------------------------------------------------------------ */
/*  Resource references (mentions, tagging, linking)                   */
/*                                                                     */
/*  These are now thin aliases over the shared `features/mentions`     */
/*  types — the same `Mention`/`MentionResource`/`MentionSuggestion`   */
/*  shapes power inline references in comments AND event logs.         */
/*  The `Comment*` names are kept as aliases                           */
/*  for back-compat; new code can import from `features/mentions`      */
/*  directly.                                                          */
/* ------------------------------------------------------------------ */

import type {
    Mention,
    MentionResource,
    MentionSuggestion,
    MentionTone,
    MentionsResourceSearch,
} from '../mentions/mentions.types';

export type CommentReference<TKind extends string = string, TData = unknown> = Mention<TKind, TData>;
export type CommentResourceSuggestion<TKind extends string = string, TData = unknown> = MentionSuggestion<TKind, TData>;
export type CommentResourceType<TKind extends string = string, TData = unknown> = MentionResource<TKind, TData>;
export type CommentTone = MentionTone;

/* ------------------------------------------------------------------ */
/*  Reactions (optional, opt-in)                                       */
/* ------------------------------------------------------------------ */

export interface CommentReaction {
    /** Emoji or short token ("👍", "rocket"). */
    emoji: string;
    count: number;
    /** True when the current user reacted with this emoji. */
    mine?: boolean;
    /** Optional list of user names for the tooltip. */
    users?: string[];
}

/* ------------------------------------------------------------------ */
/*  The comment payload                                                */
/* ------------------------------------------------------------------ */

export type CommentContentType = 'text' | 'html' | 'rich' | (string & {});

export interface CommentData<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> {
    id?: string;
    /** HTML, rich-JSON, or plain text — controlled by `contentType`. */
    content?: string;
    contentType?: CommentContentType;
    createdAt?: string;
    updatedAt?: string;
    user?: TUser;
    /** Optional moderation/state hint shown next to the timestamp. */
    status?: string;
    isPinned?: boolean;
    isEdited?: boolean;
    /** Per-comment override — when false, the moderator menu is suppressed. */
    canDelete?: boolean;
    /** Per-comment override — when false, the edit affordance is suppressed. */
    canEdit?: boolean;
    /** Inline tags rendered as small pills. */
    tagsArray?: string[] | Record<string, string>;
    /** Attachments. `media` is the legacy field name — kept for back-compat. */
    attachments?: Array<CommentAttachment | null>;
    media?: Array<CommentAttachment | null>;
    /** Resource references rendered as badges and persisted alongside content. */
    references?: ReadonlyArray<CommentReference<TResource>>;
    /** Reactions on the comment. */
    reactions?: ReadonlyArray<CommentReaction>;
    /** Threading — id of the parent comment if this is a reply. */
    replyToId?: string;
    /** Free-form per-comment payload for consumer use. */
    meta?: TMeta;
}

/* ------------------------------------------------------------------ */
/*  Form value                                                         */
/* ------------------------------------------------------------------ */

export interface CommentableContext {
    id: string;
    type: string;
    moduleKey?: string;
}

export interface CommentFormValues<TResource extends string = string> {
    /** HTML body produced by the rich text editor. */
    content: string;
    commentableId: string;
    commentableType: string;
    contentType?: CommentContentType;
    /** Resource references collected via the picker. */
    references?: ReadonlyArray<CommentReference<TResource>>;
    /** Attachments — already uploaded by the consumer's `onUpload`. */
    attachments?: ReadonlyArray<CommentAttachment>;
    /** Optional id of the comment being replied-to. */
    replyToId?: string;
    /** Optional id of the comment being edited (when in edit mode). */
    editingId?: string;
}

export interface CommentSubmitHelpers {
    setErrors: (errors: Record<string, string>) => void;
    reset: () => void;
    setSubmitting: (submitting: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

/** Where the composer sits relative to the timeline. */
export type CommentsComposerPosition = 'top' | 'bottom';

/* ------------------------------------------------------------------ */
/*  Accessors — the small "domain mapper" surface                       */
/* ------------------------------------------------------------------ */

export interface CommentsAccessors {
    /** Resolve an attachment to a clickable URL. Defaults to `attachment.url`. */
    getMediaUrl?: (media: CommentAttachment | null | undefined) => string | undefined;
    /** Resolve an attachment to a display name. */
    getMediaName?: (media: CommentAttachment | null | undefined) => string | undefined;
    /** Resolve `comment.status` to a localised label. */
    getStatusLabel?: (status: string) => string | undefined;
    /** Format an ISO timestamp into a relative string. */
    formatRelativeTime?: (iso: string) => string;
}

/* ------------------------------------------------------------------ */
/*  Attachment uploader contract                                       */
/* ------------------------------------------------------------------ */

export interface CommentAttachmentUploadContext {
    /** The original file the user picked / dropped. */
    file: File;
    /** Throttled progress callback the uploader can call. */
    onProgress: (progress: number) => void;
    /** AbortSignal — aborted when the user removes the chip mid-upload. */
    signal: AbortSignal;
}

export interface CommentsAttachmentsConfig {
    /**
     * Async uploader. Resolves to a fully-formed `CommentAttachment` with
     * a permanent `url`. Required to enable the attachment button.
     */
    onUpload?: (ctx: CommentAttachmentUploadContext) => Promise<CommentAttachment>;
    /** Maximum file size in bytes. */
    maxSize?: number;
    /** Maximum simultaneous attachments per draft. */
    maxFiles?: number;
    /** Mime-type / extension filter passed to the file input. */
    accept?: string;
    /** Disable the attachment button entirely (default: false unless `onUpload` is missing). */
    disabled?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Provider config (mass configuration)                                */
/* ------------------------------------------------------------------ */

export interface CommentsConfig<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> extends CommentsAccessors {
    /** Where the composer sits. Default: 'top'. */
    composerPosition?: CommentsComposerPosition;
    /** Strings deep-merged into descendant components. */
    strings?: Partial<CommentsStrings>;
    /** Resource catalogue used by the inline picker. */
    resources?: Partial<Record<TResource, CommentResourceType<TResource>>>;
    /**
     * Global "rich suggestions" callback. Used when:
     *   1. The user types one of the registered triggers (e.g. `@`, `#`)
     *      followed by a needle — the picker opens automatically and calls
     *      `onResourceSearch(needle, kind)` to populate results.
     *   2. A `resources[kind]` entry is missing both `search` and
     *      `suggestions` — the picker falls back to this callback.
     *
     * Per-kind `search` / `suggestions` always take precedence when present.
     */
    onResourceSearch?: MentionsResourceSearch<TResource>;
    /** Attachment uploader config. */
    attachments?: CommentsAttachmentsConfig;
    /** Default permission flags. */
    canComment?: boolean;
    canModerate?: boolean;
    /** Lifecycle callbacks — bubble through to descendants. */
    onSubmit?: (
        values: CommentFormValues<TResource>,
        helpers: CommentSubmitHelpers,
    ) => void;
    onDelete?: (commentId: string) => void;
    onUpdate?: (
        commentId: string,
        values: CommentFormValues<TResource>,
        helpers: CommentSubmitHelpers,
    ) => void;
    onPinToggle?: (comment: CommentData<TUser, TMeta, TResource>) => void;
    onReact?: (commentId: string, emoji: string) => void;
    onReply?: (commentId: string) => void;
    /** Optional sanitizer — runs on HTML before render. */
    sanitizer?: (html: string) => string;
}

/* ------------------------------------------------------------------ */
/*  Slots                                                              */
/* ------------------------------------------------------------------ */

export interface CommentRenderItemContext<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> {
    comment: CommentData<TUser, TMeta, TResource>;
    canModerate: boolean;
    onDelete?: (commentId: string) => void;
    /** Render the default item — useful when wrapping. */
    defaultItem: ReactNode;
}

export interface CommentsSlots<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> {
    /** Replaces the entire composer. */
    composerSlot?: ReactNode;
    /** Replaces the empty-state. */
    emptySlot?: ReactNode;
    /** Rendered above the composer + timeline. */
    headerSlot?: ReactNode;
    /** Rendered below the timeline. */
    footerSlot?: ReactNode;
    /** Per-comment custom rendering. */
    renderItem?: (
        ctx: CommentRenderItemContext<TUser, TMeta, TResource>,
    ) => ReactNode;
    /** Per-attachment custom rendering. */
    renderAttachment?: (attachment: CommentAttachment) => ReactNode;
    /** Per-reference custom rendering — overrides the resource type's `renderChip`. */
    renderReference?: (reference: CommentReference<TResource>) => ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component prop shapes                                               */
/* ------------------------------------------------------------------ */

export interface CommentsProps<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> extends CommentsAccessors,
        CommentsSlots<TUser, TMeta, TResource> {
    /** Identifies the thread; passed to `onSubmit`. */
    context: CommentableContext;
    comments: ReadonlyArray<CommentData<TUser, TMeta, TResource>>;
    canComment?: boolean;
    canModerate?: boolean;

    /** Composer position — overrides provider's `composerPosition`. */
    composerPosition?: CommentsComposerPosition;
    /** Hide the card chrome (title, padding) — render bare list+composer. */
    bare?: boolean;
    /** Override card title via strings; passing false hides it entirely. */
    title?: ReactNode;

    /** Lifecycle — overrides provider. */
    onSubmit?: CommentsConfig<TUser, TMeta, TResource>['onSubmit'];
    onDelete?: CommentsConfig<TUser, TMeta, TResource>['onDelete'];
    onUpdate?: CommentsConfig<TUser, TMeta, TResource>['onUpdate'];
    onPinToggle?: CommentsConfig<TUser, TMeta, TResource>['onPinToggle'];
    onReact?: CommentsConfig<TUser, TMeta, TResource>['onReact'];
    onReply?: CommentsConfig<TUser, TMeta, TResource>['onReply'];

    /** Resource registry override. */
    resources?: CommentsConfig<TUser, TMeta, TResource>['resources'];
    /** Global suggestion callback — overrides provider's `onResourceSearch`. */
    onResourceSearch?: CommentsConfig<TUser, TMeta, TResource>['onResourceSearch'];
    /** Attachment uploader override. */
    attachments?: CommentsAttachmentsConfig;

    strings?: Partial<CommentsStrings>;
    /** Optional className applied to the outer card. */
    className?: string;
    /** Optional avatar fallback component (renders initials by default). */
    avatarComponent?: ComponentType<{ user: TUser | undefined; size: 'sm' | 'md' | 'lg' }>;
}

/** Back-compat alias — `CommentsCard` was the previous name of `Comments`. */
export type CommentsCardProps<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> = CommentsProps<TUser, TMeta, TResource>;

export interface CommentTimelineProps<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> extends CommentsAccessors,
        Pick<
            CommentsSlots<TUser, TMeta, TResource>,
            'renderItem' | 'renderAttachment' | 'renderReference' | 'emptySlot'
        > {
    comments: ReadonlyArray<CommentData<TUser, TMeta, TResource>>;
    canModerate?: boolean;
    onDelete?: (commentId: string) => void;
    onPinToggle?: (comment: CommentData<TUser, TMeta, TResource>) => void;
    onReact?: (commentId: string, emoji: string) => void;
    onReply?: (commentId: string) => void;
    strings?: Partial<CommentsStrings>;
    resources?: CommentsConfig<TUser, TMeta, TResource>['resources'];
}

export interface CommentItemProps<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> extends CommentsAccessors,
        Pick<
            CommentsSlots<TUser, TMeta, TResource>,
            'renderAttachment' | 'renderReference'
        > {
    comment: CommentData<TUser, TMeta, TResource>;
    canModerate?: boolean;
    onDelete?: (commentId: string) => void;
    onPinToggle?: (comment: CommentData<TUser, TMeta, TResource>) => void;
    onReact?: (commentId: string, emoji: string) => void;
    onReply?: (commentId: string) => void;
    strings?: Partial<CommentsStrings>;
    resources?: CommentsConfig<TUser, TMeta, TResource>['resources'];
}

export interface CommentComposerProps<TResource extends string = string> {
    context: CommentableContext;
    canComment?: boolean;
    isSubmitting?: boolean;
    errors?: Record<string, string>;
    /** Bumping this number resets the form. */
    resetKey?: number;
    onSubmit: (values: CommentFormValues<TResource>) => void;
    onCancel?: () => void;
    /** When set, the composer is in edit mode for that comment. */
    editingComment?: CommentData<CommentUser, unknown, TResource>;
    strings?: Partial<CommentsStrings>;
    resources?: CommentsConfig<CommentUser, unknown, TResource>['resources'];
    onResourceSearch?: CommentsConfig<CommentUser, unknown, TResource>['onResourceSearch'];
    attachments?: CommentsAttachmentsConfig;
    /** Initial draft values. */
    initialValues?: Partial<CommentFormValues<TResource>>;
    /** Auto-focus the editor on mount. Default: false. */
    autoFocus?: boolean;
    /** Render the submit button on the toolbar (true, default) or as an explicit footer row (false). */
    inlineSubmit?: boolean;
    /** Placeholder override (also overridable via strings). */
    placeholder?: string;
}
