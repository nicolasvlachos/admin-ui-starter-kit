import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';

import type { PaymentTimelineCardProps } from './types';

export function PaymentTimelineCard({ events, className }: PaymentTimelineCardProps) {
    return (
        <SmartCard title="Payment Timeline" className={className}>
            <div className="mt-5 space-y-0">
                {events.map((evt, i) => {
                    const Icon = evt.icon;
                    return (
                        <div key={evt.label} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        'flex size-8 items-center justify-center rounded-full',
                                        evt.done ? 'bg-success/20' : 'bg-muted',
                                    )}
                                >
                                    <Icon className={cn('size-3.5', evt.done ? 'text-success' : 'text-muted-foreground')} />
                                </div>
                                {i < events.length - 1 && (
                                    <div className={cn('mt-1 h-8 w-px', evt.done ? 'bg-success/30' : 'bg-border')} />
                                )}
                            </div>
                            <div className="pb-6">
                                <Text weight="medium">
                                    {evt.label}
                                </Text>
                                <Text size="xs" type="secondary">
                                    {evt.date}
                                </Text>
                                {!!evt.amount && (
                                    <Text size="xs" weight="medium" className="mt-0.5 tabular-nums text-success">
                                        {evt.amount}
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
