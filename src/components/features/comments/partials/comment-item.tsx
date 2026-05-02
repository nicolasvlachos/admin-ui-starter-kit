import { formatDistanceToNow } from 'date-fns';
import {
    CornerDownRight,
    Pencil,
    Pin,
    Smile,
    Trash2,
} from 'lucide-react';
import type { FC } from 'react';
import { memo, useMemo } from 'react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/base/display/avatar';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/base/display/tooltip';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import {
    useResolvedAccessors,
    useResolvedStrings,
} from '../comments-provider';
import type {
    CommentAttachment,
    CommentItemProps,
} from '../comments.types';
import { CommentAttachmentChip } from './comment-attachment-chip';
import { CommentContent } from './comment-content';

const FALLBACK_INITIAL = '?';

const defaultGetMediaUrl = (m: CommentAttachment | null | undefined) => m?.url;
const defaultGetMediaName = (m: CommentAttachment | null | undefined) => m?.name;
const defaultGetStatusLabel = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
const defaultFormatRelativeTime = (iso: string) => {
    try {
        return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
        return '—';
    }
};

export const CommentItem = memo(function CommentItem<TResource extends string = string>({
    comment,
    canModerate,
    onDelete,
    onPinToggle,
    onReact,
    onReply,
    strings: stringsProp,
    getMediaUrl,
    getMediaName,
    getStatusLabel,
    formatRelativeTime,
    resources,
    renderAttachment,
    renderReference,
}: CommentItemProps<import('../comments.types').CommentUser, unknown, TResource>) {
    const strings = useResolvedStrings(stringsProp);
    const accessors = useResolvedAccessors({
        getMediaUrl,
        getMediaName,
        getStatusLabel,
        formatRelativeTime,
    });

    const resolvedGetMediaUrl = accessors.getMediaUrl ?? defaultGetMediaUrl;
    const resolvedGetMediaName = accessors.getMediaName ?? defaultGetMediaName;
    const resolvedGetStatusLabel =
        accessors.getStatusLabel ?? defaultGetStatusLabel;
    const resolvedFormatRelativeTime =
        accessors.formatRelativeTime ?? defaultFormatRelativeTime;

    const authorName = comment.user?.name ?? strings.fallbackAuthor;
    const avatarUrl = comment.user?.avatar ?? undefined;

    const relativeTime = useMemo(() => {
        if (!comment.createdAt) return '—';
        return resolvedFormatRelativeTime(comment.createdAt);
    }, [comment.createdAt, resolvedFormatRelativeTime]);

    const fallbackInitial = useMemo(() => {
        if (!authorName) return FALLBACK_INITIAL;
        const trimmed = authorName.trim();
        return trimmed === ''
            ? FALLBACK_INITIAL
            : trimmed.charAt(0).toUpperCase();
    }, [authorName]);

    const tagList = useMemo(() => {
        if (Array.isArray(comment.tagsArray)) {
            return comment.tagsArray.filter(
                (tag): tag is string => typeof tag === 'string',
            );
        }
        if (comment.tagsArray && typeof comment.tagsArray === 'object') {
            return Object.values(comment.tagsArray).filter(
                (value): value is string => typeof value === 'string',
            );
        }
        return [];
    }, [comment.tagsArray]);

    const attachments = useMemo(() => {
        const list = comment.attachments ?? comment.media ?? [];
        return list.filter(
            (a): a is CommentAttachment => !!a && typeof a === 'object',
        );
    }, [comment.attachments, comment.media]);

    const reactions = comment.reactions ?? [];

    const isPinned = comment.isPinned === true;
    const isEdited = comment.isEdited === true;
    const showStatus = comment.status && comment.status !== 'active';
    const statusLabel =
        showStatus && comment.status ? resolvedGetStatusLabel(comment.status) : null;
    const canDeleteComment =
        comment.canDelete === true || canModerate === true;
    const canEditComment = comment.canEdit === true || canModerate === true;

    const hasAttachments = attachments.length > 0;

    return (
        <article
            className={cn(
                'group relative overflow-hidden rounded-lg border transition-colors',
                'border-border/60 bg-card hover:bg-muted/30 px-3 py-2.5',
            )}
            data-comment-id={comment.id}
        >
            <div className="flex items-start gap-3">
                <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                    {!!avatarUrl && (
                        <AvatarImage src={avatarUrl} alt={authorName} />
                    )}
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                        {fallbackInitial}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-baseline gap-2">
                        <Text
                            tag="span"
                            weight="semibold"
                            className="truncate"
                        >
                            {authorName}
                        </Text>

                        {!!isPinned && (
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger render={<span className="inline-flex shrink-0 self-center" />}>
                                        <Pin className="text-warning size-3" aria-hidden />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="text-xs"
                                    >
                                        {strings.pinned}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <Text
                            tag="span"
                            size="xs"
                            type="secondary"
                            className="shrink-0 tabular-nums"
                        >
                            {relativeTime}
                        </Text>

                        {!!isEdited && (
                            <Text
                                tag="span"
                                size="xs"
                                type="secondary"
                                className="shrink-0"
                            >
                                {strings.edited}
                            </Text>
                        )}

                        {!!showStatus && !!statusLabel && (
                            <Badge variant="secondary" className="self-center uppercase tracking-wide">
                                {statusLabel}
                            </Badge>
                        )}
                    </div>

                    <div className="mt-1 text-sm leading-relaxed">
                        <CommentContent
                            comment={comment}
                            resources={resources}
                            renderReference={renderReference}
                        />
                    </div>

                    {tagList.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {tagList.map((tag) => (
                                <Badge key={tag} variant="secondary" className="uppercase tracking-wide">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {hasAttachments && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {attachments.map((attachment) => {
                                if (renderAttachment) {
                                    return (
                                        <div key={attachment.id ?? attachment.name}>
                                            {renderAttachment(attachment)}
                                        </div>
                                    );
                                }
                                return (
                                    <CommentAttachmentChip
                                        key={attachment.id ?? attachment.name}
                                        attachment={attachment}
                                        accessors={{
                                            getMediaUrl: resolvedGetMediaUrl,
                                            getMediaName: resolvedGetMediaName,
                                        }}
                                        strings={stringsProp}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {reactions.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1">
                            {reactions.map((reaction) => (
                                <button
                                    key={reaction.emoji}
                                    type="button"
                                    onClick={() =>
                                        onReact && comment.id
                                            ? onReact(comment.id, reaction.emoji)
                                            : undefined
                                    }
                                    title={reaction.users?.join(', ')}
                                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                >
                                    <Badge
                                        variant={reaction.mine ? 'primary' : 'secondary'}
                                        className="cursor-pointer transition-colors hover:opacity-90"
                                    >
                                        <span aria-hidden className="leading-none">
                                            {reaction.emoji}
                                        </span>
                                        <span className="tabular-nums">{reaction.count}</span>
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trailing action cluster — single low-contrast group, hover/focus revealed. */}
                <div
                    className={cn(
                        'shrink-0 self-start opacity-0 transition-opacity',
                        'group-hover:opacity-100 focus-within:opacity-100',
                        '-mr-1 inline-flex items-center gap-0.5',
                    )}
                >
                    {!!onReply && (
                        <Button
                            type="button"
                            size="icon-xs"
                            variant="secondary"
                            buttonStyle="ghost"
                            onClick={() =>
                                comment.id && onReply(comment.id)
                            }
                            title={strings.replyLabel}
                            aria-label={strings.replyLabel}
                        >
                            <CornerDownRight className="size-3.5" />
                        </Button>
                    )}
                    {!!onReact && (
                        <Button
                            type="button"
                            size="icon-xs"
                            variant="secondary"
                            buttonStyle="ghost"
                            onClick={() =>
                                comment.id && onReact(comment.id, '👍')
                            }
                            title={strings.addReactionLabel}
                            aria-label={strings.addReactionLabel}
                        >
                            <Smile className="size-3.5" />
                        </Button>
                    )}
                    {!!onPinToggle && canModerate && (
                        <Button
                            type="button"
                            size="icon-xs"
                            variant="secondary"
                            buttonStyle="ghost"
                            onClick={() => onPinToggle(comment)}
                            title={isPinned ? strings.unpinLabel : strings.pinLabel}
                            aria-label={isPinned ? strings.unpinLabel : strings.pinLabel}
                        >
                            <Pin
                                className={cn(
                                    'size-3.5',
                                    isPinned && 'text-warning',
                                )}
                            />
                        </Button>
                    )}
                    {!!canEditComment && !!comment.id && (
                        <Button
                            type="button"
                            size="icon-xs"
                            variant="secondary"
                            buttonStyle="ghost"
                            title={strings.editLabel}
                            aria-label={strings.editLabel}
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                    )}
                    {!!canDeleteComment &&
                        !!onDelete &&
                        !!comment.id && (
                            <Button
                                type="button"
                                size="icon-xs"
                                variant="secondary"
                                buttonStyle="ghost"
                                className="hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                    onDelete(comment.id as string)
                                }
                                title={strings.deleteLabel}
                                aria-label={strings.deleteLabel}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        )}
                </div>
            </div>
        </article>
    );
}) as <TResource extends string = string>(
    props: CommentItemProps<import('../comments.types').CommentUser, unknown, TResource>,
) => ReturnType<FC>;
