import { IconBadge } from '@/components/base/display';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from '@/components/base/item';
import { Text } from '@/components/typography/text';

import type { RecentConversationRowProps } from './types';

import { cn } from '@/lib/utils';
export function RecentConversationRow({ conversations, className }: RecentConversationRowProps) {
    return (
        <ItemGroup className={cn('conversation-row--component', className)}>
            {conversations.map((c) => (
                <Item key={c.name} className="cursor-pointer">
                    <ItemMedia>
                        <IconBadge tone="primary" size="md">
                            <Text size="xs" weight="semibold" className="text-inherit">
                                {c.initials}
                            </Text>
                        </IconBadge>
                    </ItemMedia>
                    <ItemContent>
                        <div className="flex items-center justify-between gap-2">
                            <ItemTitle>{c.name}</ItemTitle>
                            <Text size="xs" type="secondary" className="shrink-0 tabular-nums">
                                {c.time}
                            </Text>
                        </div>
                        <ItemDescription clamp={1}>{c.preview}</ItemDescription>
                    </ItemContent>
                    {!!c.unread && (
                        <ItemActions>
                            <IconBadge tone="primary" solid size="xs">
                                <Text size="xxs" weight="bold" className="text-inherit tabular-nums">
                                    {c.unread}
                                </Text>
                            </IconBadge>
                        </ItemActions>
                    )}
                </Item>
            ))}
        </ItemGroup>
    );
}

RecentConversationRow.displayName = 'RecentConversationRow';
