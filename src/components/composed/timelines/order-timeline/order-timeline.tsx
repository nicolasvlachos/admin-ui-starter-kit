import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import { type OrderTimelineEvent, type OrderTimelineCardProps } from './types';

const timelineStatusDot: Record<OrderTimelineEvent['status'], string> = {
    completed: 'bg-success',
    current: 'bg-primary ring-3 ring-primary/20',
    pending: 'bg-muted',
};

export function OrderTimelineCard({ title, description, events, footerText, className }: OrderTimelineCardProps) {
    return (
        <SmartCard title={title} description={description} footerText={footerText} className={className}>
            <div className="relative space-y-0">
                {events.map((event, index) => {
                    const isLast = index === events.length - 1;

                    return (
                        <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                            {/* Connector line */}
                            {!isLast && (
                                <div className="absolute left-[5px] top-[14px] h-[calc(100%-6px)] w-px bg-border" />
                            )}

                            {/* Dot */}
                            <div className="relative z-10 mt-[5px] flex-shrink-0">
                                <div className={cn('h-[11px] w-[11px] rounded-full', timelineStatusDot[event.status])} />
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-baseline justify-between gap-2">
                                    <Text weight="medium" className="truncate">
                                        {event.title}
                                    </Text>
                                    <Text size="xxs" type="secondary" className="flex-shrink-0 font-mono tabular-nums">
                                        {event.timestamp}
                                    </Text>
                                </div>
                                {!!event.description && (
                                    <Text size="xs" type="secondary" className="mt-0.5">
                                        {event.description}
                                    </Text>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </SmartCard>
    );
}
