/**
 * CommentEmpty — default empty state for the timeline. Replaceable via
 * the `emptySlot` prop on `<Comments>` / `<CommentTimeline>`.
 */
import { MessageCircle } from 'lucide-react';
import type { FC, ReactNode } from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useResolvedStrings } from '../comments-provider';
import type { CommentsStrings } from '../comments.strings';

export interface CommentEmptyProps {
    strings?: Partial<CommentsStrings>;
    icon?: ReactNode;
    className?: string;
}

export const CommentEmpty: FC<CommentEmptyProps> = ({
    strings: stringsProp,
    icon,
    className,
}) => {
    const strings = useResolvedStrings(stringsProp);

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-8 text-center',
                className,
            )}
        >
            <div className="bg-muted/50 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                {icon ?? (
                    <MessageCircle className="text-muted-foreground/60 h-5 w-5" />
                )}
            </div>
            <Text weight="medium">
                {strings.empty}
            </Text>
            {strings.emptyHint ? (
                <Text size="xs" type="secondary" className="mt-1 max-w-[28ch]">
                    {strings.emptyHint}
                </Text>
            ) : null}
        </div>
    );
};
