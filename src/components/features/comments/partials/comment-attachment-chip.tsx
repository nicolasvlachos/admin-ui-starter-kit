/**
 * CommentAttachmentChip — small attachment pill used in the composer draft
 * and the timeline. Single inline row: icon + name · size, with progress /
 * error states overlaid on the same line. Editable mode reveals a remove
 * button; failed uploads expose a retry pill.
 */
import { File, FileText, Image as ImageIcon, Loader2, Paperclip, X } from 'lucide-react';
import type { FC } from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type {
    CommentAttachment,
    CommentsAccessors,
} from '../comments.types';
import {
    defaultCommentsStrings,
    type CommentsStrings,
} from '../comments.strings';

export interface CommentAttachmentChipProps {
    attachment: CommentAttachment;
    /** Editable mode shows a remove button. */
    editable?: boolean;
    onRemove?: (id: string) => void;
    onRetry?: (id: string) => void;
    accessors?: CommentsAccessors;
    strings?: Partial<CommentsStrings>;
    /** Compact chips have smaller text and tighter padding. */
    compact?: boolean;
    className?: string;
}

function formatBytes(bytes?: number): string | null {
    if (typeof bytes !== 'number' || bytes <= 0) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function pickIcon(att: CommentAttachment) {
    if (att.mimeType?.startsWith('image/')) return ImageIcon;
    if (att.mimeType === 'application/pdf') return FileText;
    if (att.mimeType?.startsWith('text/')) return FileText;
    if (att.mimeType) return File;
    return Paperclip;
}

export const CommentAttachmentChip: FC<CommentAttachmentChipProps> = ({
    attachment,
    editable = false,
    onRemove,
    onRetry,
    accessors,
    strings: stringsProp,
    compact = false,
    className,
}) => {
    const strings: CommentsStrings = {
        ...defaultCommentsStrings,
        ...stringsProp,
    };

    const url = accessors?.getMediaUrl?.(attachment) ?? attachment.url;
    const name =
        accessors?.getMediaName?.(attachment) ??
        attachment.name ??
        strings.attachmentFallback;
    const Icon = pickIcon(attachment);

    const isUploading = attachment.status === 'uploading';
    const isFailed = attachment.status === 'failed';
    const sizeLabel = formatBytes(attachment.size);

    const meta = isUploading
        ? strings.attachmentUploadingLabel +
          (typeof attachment.progress === 'number'
              ? ` ${Math.round(attachment.progress)}%`
              : '')
        : isFailed
          ? attachment.error ?? strings.attachmentFailedLabel
          : sizeLabel;

    const surface = cn(
        'relative inline-flex min-w-0 max-w-[20rem] items-center gap-1.5 rounded-md',
        'ring-1 ring-inset transition-colors',
        compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1 text-xs',
        isFailed
            ? 'bg-destructive/[0.04] ring-destructive/30 hover:bg-destructive/[0.08]'
            : 'bg-foreground/[0.03] ring-border/60 hover:bg-foreground/[0.06]',
        className,
    );

    const iconNode = isUploading ? (
        <Loader2
            className={cn('shrink-0 animate-spin text-muted-foreground', 'size-3.5')}
            aria-hidden
        />
    ) : (
        <Icon
            className={cn(
                'shrink-0',
                'size-3.5',
                isFailed ? 'text-destructive' : 'text-muted-foreground',
            )}
            aria-hidden
        />
    );

    const labelRow = (
        <span className="inline-flex min-w-0 items-baseline gap-1.5">
            <Text
                tag="span"
                size="xs"
                weight="medium"
                className={cn('truncate', isFailed && 'text-destructive')}
            >
                {name}
            </Text>
            {meta ? (
                <Text
                    tag="span"
                    size="xxs"
                    type="secondary"
                    className="shrink-0 tabular-nums"
                >
                    {meta}
                </Text>
            ) : null}
        </span>
    );

    const isInteractive = !!url && !isUploading && !isFailed;

    return (
        <div className={surface}>
            {iconNode}
            {isInteractive ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-w-0 flex-1 items-baseline gap-1.5 hover:underline"
                    aria-label={strings.attachmentDownloadLabel}
                >
                    {labelRow}
                </a>
            ) : (
                labelRow
            )}

            {isUploading && typeof attachment.progress === 'number' && (
                <div className="bg-primary/15 absolute bottom-0 left-2 right-2 h-px overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full transition-[width]"
                        style={{
                            width: `${Math.min(100, Math.max(0, attachment.progress))}%`,
                        }}
                    />
                </div>
            )}

            {isFailed && onRetry && (
                <button
                    type="button"
                    onClick={() => onRetry(attachment.id)}
                    className="text-destructive ring-destructive/30 hover:ring-destructive/60 shrink-0 rounded px-1.5 py-px text-xxs font-medium ring-1 ring-inset transition-colors"
                >
                    {strings.attachmentRetryLabel}
                </button>
            )}

            {editable && onRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(attachment.id)}
                    className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground -mr-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:ring-ring/40"
                    aria-label={strings.attachmentRemoveLabel}
                    title={strings.attachmentRemoveLabel}
                >
                    <X className="size-3" />
                </button>
            )}
        </div>
    );
};
