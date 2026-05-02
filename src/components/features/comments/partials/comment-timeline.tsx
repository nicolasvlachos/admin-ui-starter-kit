import type { FC } from 'react';

import type { CommentTimelineProps, CommentUser } from '../comments.types';
import { CommentEmpty } from './comment-empty';
import { CommentItem } from './comment-item';

export const CommentTimeline = function CommentTimeline<
    TResource extends string = string,
>({
    comments,
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
    renderItem,
    renderAttachment,
    renderReference,
    emptySlot,
}: CommentTimelineProps<CommentUser, unknown, TResource>) {
    if (!comments.length) {
        return (
            <>
                {emptySlot ?? <CommentEmpty strings={stringsProp} />}
            </>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {comments.map((comment, index) => {
                const defaultItem = (
                    <CommentItem
                        comment={comment}
                        canModerate={canModerate}
                        onDelete={onDelete}
                        onPinToggle={onPinToggle}
                        onReact={onReact}
                        onReply={onReply}
                        strings={stringsProp}
                        getMediaUrl={getMediaUrl}
                        getMediaName={getMediaName}
                        getStatusLabel={getStatusLabel}
                        formatRelativeTime={formatRelativeTime}
                        resources={resources}
                        renderAttachment={renderAttachment}
                        renderReference={renderReference}
                    />
                );

                if (renderItem) {
                    return (
                        <div key={comment.id ?? `comment-${index}`}>
                            {renderItem({
                                comment,
                                canModerate: canModerate ?? false,
                                onDelete,
                                defaultItem,
                            })}
                        </div>
                    );
                }

                return (
                    <div key={comment.id ?? `comment-${index}`}>
                        {defaultItem}
                    </div>
                );
            })}
        </div>
    );
} as <TResource extends string = string>(
    props: CommentTimelineProps<CommentUser, unknown, TResource>,
) => ReturnType<FC>;
