import { Badge } from '@/components/base/badge/badge';
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

import type { TeamMemberRowProps } from './types';

export function TeamMemberRow({ members, className }: TeamMemberRowProps) {
    return (
        <ItemGroup className={className}>
            {members.map((m) => (
                <Item key={m.name}>
                    <ItemMedia>
                        <IconBadge tone="primary" solid size="md">
                            <Text size="xs" weight="semibold" className="text-inherit">
                                {m.initials}
                            </Text>
                        </IconBadge>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{m.name}</ItemTitle>
                        <ItemDescription clamp={1}>{m.role}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Badge variant="secondary">{m.dept}</Badge>
                        <Text size="xs" type="secondary" className="shrink-0 tabular-nums">
                            {m.active}
                        </Text>
                    </ItemActions>
                </Item>
            ))}
        </ItemGroup>
    );
}

TeamMemberRow.displayName = 'TeamMemberRow';
