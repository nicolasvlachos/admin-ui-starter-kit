/**
 * EventLog — unified, mixed-source timeline.
 *
 * Renders a chronological feed mixing different log kinds — comments,
 * audit events, system messages, automated activity — under one
 * feature surface. Each entry carries its `kind` and the renderer dispatches
 * to the right partial. All entries flow through the shared mentions
 * registry, so inline `@user` / `#booking` references render the same
 * way whether they live in a comment body or in an audit event
 * description.
 */
import type { LucideIcon } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

import type {
    CommentData,
    CommentUser,
    CommentsAccessors,
    CommentsConfig,
    CommentsStrings,
} from '@/components/features/comments';
import type {
    Mention,
    MentionsConfig,
} from '@/components/features/mentions';
import type { StringsProp } from '@/lib/strings';

import type { EventLogStrings } from './event-log.strings';

/* ------------------------------------------------------------------ */
/*  Entry shapes                                                       */
/* ------------------------------------------------------------------ */

/** Visual tone for non-comment events — drives the leading icon chip. */
export type EventLogTone =
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'secondary';

/** Comment entry — wraps the existing comments feature payload. */
export interface EventLogCommentEntry<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> {
    id: string;
    kind: 'comment';
    /** ISO timestamp — used for chronological sorting. */
    timestamp: string;
    comment: CommentData<TUser, TMeta, TResource>;
}

/**
 * Activity / audit event entry. The `description` field is HTML and
 * may contain inline `<span data-ref-id="…">` mentions which will be
 * resolved against the resource registry.
 */
export interface EventLogActivityEntry<TResource extends string = string> {
    id: string;
    kind: 'event' | 'system' | 'audit' | string;
    timestamp: string;
    /** Lucide icon — defaults to a small dot when absent. */
    icon?: LucideIcon;
    /** Tone for the icon chip. */
    tone?: EventLogTone;
    /** Optional actor — short label rendered before the description. */
    actor?: string;
    /** Optional action verb — bridge between actor and target ("commented on"). */
    action?: string;
    /** Optional target — short label rendered after the action. */
    target?: ReactNode;
    /** Plain headline rendered when `description` is absent. */
    headline?: ReactNode;
    /** Rich description (HTML) — supports inline mentions. */
    description?: string;
    /** Mentions referenced inside `description` — resolved to chips at render time. */
    mentions?: ReadonlyArray<Mention<TResource>>;
    /** Inline metadata pills rendered under the description. */
    metadata?: ReadonlyArray<{ label: string; value: ReactNode }>;
    /** Free-form payload for consumer logic. */
    data?: unknown;
}

export type EventLogEntry<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> =
    | EventLogCommentEntry<TUser, TMeta, TResource>
    | EventLogActivityEntry<TResource>;

/* ------------------------------------------------------------------ */
/*  Renderer overrides                                                  */
/* ------------------------------------------------------------------ */

export interface EventLogRendererContext<TResource extends string = string> {
    resources?: MentionsConfig<TResource>['resources'];
    accessors?: CommentsAccessors;
    strings?: Partial<CommentsStrings>;
}

export type EventLogRenderer<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> = (
    entry: EventLogEntry<TUser, TMeta, TResource>,
    ctx: EventLogRendererContext<TResource>,
) => ReactNode;

/* ------------------------------------------------------------------ */
/*  Composer config                                                    */
/* ------------------------------------------------------------------ */

/**
 * Optional inline composer at the top/bottom of the log. When present
 * the EventLog renders a `<CommentComposer>` and forwards submits to
 * `onSubmit` — produces a new comment entry the consumer typically
 * appends to `entries`.
 */
export interface EventLogComposerConfig<TResource extends string = string> {
    enabled: boolean;
    position?: 'top' | 'bottom';
    /** Identifies the thread; passed to `CommentComposer.context`. */
    context: { id: string; type: string; moduleKey?: string };
    onSubmit?: NonNullable<
        CommentsConfig<CommentUser, unknown, TResource>['onSubmit']
    >;
    placeholder?: string;
    autoFocus?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Top-level props                                                    */
/* ------------------------------------------------------------------ */

export interface EventLogProps<
    TUser extends CommentUser = CommentUser,
    TMeta = unknown,
    TResource extends string = string,
> extends CommentsAccessors {
    entries: ReadonlyArray<EventLogEntry<TUser, TMeta, TResource>>;
    /** Order — `desc` (newest first, default) or `asc` (oldest first). */
    order?: 'asc' | 'desc';
    /** Resource catalogue — passed at the call site. */
    resources?: MentionsConfig<TResource>['resources'];
    /** Global search callback for inline triggers. */
    onResourceSearch?: MentionsConfig<TResource>['onResourceSearch'];
    /** Comment lifecycle callbacks — same shape as `<Comments>`. */
    canModerate?: boolean;
    onCommentDelete?: (commentId: string) => void;
    onCommentReact?: (commentId: string, emoji: string) => void;
    onCommentReply?: (commentId: string) => void;
    onCommentPinToggle?: (
        comment: CommentData<TUser, TMeta, TResource>,
    ) => void;
    /** Comment-specific strings (delegated to `<CommentItem>`). */
    strings?: Partial<CommentsStrings>;
    /** Timeline-level strings (list aria label, empty state).
     *  Comment-row copy is overridden via `strings` (above). */
    eventLogStrings?: StringsProp<EventLogStrings>;
    /** Override the per-kind renderer table. Built-ins keyed by `kind`. */
    renderers?: Partial<
        Record<string, EventLogRenderer<TUser, TMeta, TResource>>
    >;
    /** Inline composer config. */
    composer?: EventLogComposerConfig<TResource>;
    /** Card chrome — set false to drop the SmartCard wrapper. */
    bare?: boolean;
    /** Card title (when not bare). */
    title?: ReactNode;
    /** Optional avatar component override (for comment rows). */
    avatarComponent?: ComponentType<{
        user: TUser | undefined;
        size: 'sm' | 'md' | 'lg';
    }>;
    className?: string;
}
