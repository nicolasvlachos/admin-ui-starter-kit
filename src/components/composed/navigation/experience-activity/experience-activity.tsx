import { Plus } from 'lucide-react';

import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards/smart-card';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from '@/components/base/item';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';

import type { ExperienceActivityCardProps } from './types';

export function ExperienceActivityCard({
    completed,
    total,
    activities,
    onAdd,
    className,
}: ExperienceActivityCardProps) {
    return (
        <SmartCard
            title={`${completed} out of ${total}`}
            description="Experiences completed this week"
            headerEnd={
                !!onAdd && (
                    <Button variant="light" buttonStyle="ghost" onClick={onAdd} className="size-8 rounded-full bg-primary/10 p-0">
                        <Plus className="size-4" />
                    </Button>
                  )
            }
            className={cn('experience-activity--component', 'bg-gradient-to-b from-muted/30 to-card', className)}
        >
            <ItemGroup>
                {activities.map((a, i) => (
                    <div key={a.title}>
                        {i > 0 && <ItemSeparator />}
                        <Item size="xs" className="px-0 items-start">
                            <ItemMedia>
                                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                                    <a.icon className="size-5 text-primary" />
                                </div>
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>{a.title}</ItemTitle>
                                <ItemDescription clamp={1}>{a.time}</ItemDescription>
                                <div className="mt-2.5 grid grid-cols-2 gap-2">
                                    {a.metrics.map((m) => (
                                        <div key={m.label} className="rounded-lg bg-muted/30 px-2.5 py-1.5">
                                            <Text size="xs" type="secondary">{m.label}</Text>
                                            <Text size="xs" weight="bold">{m.value}</Text>
                                        </div>
                                    ))}
                                </div>
                            </ItemContent>
                        </Item>
                    </div>
                ))}
            </ItemGroup>
        </SmartCard>
    );
}

ExperienceActivityCard.displayName = 'ExperienceActivityCard';
