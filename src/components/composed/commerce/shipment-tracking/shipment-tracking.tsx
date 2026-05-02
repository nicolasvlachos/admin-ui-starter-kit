/**
 * ShipmentTrackingCard — tracking number + carrier header, current status
 * with pulse dot, horizontal step progress bar, and an optional details row
 * grid (e.g. weight, ETA, recipient). All copy is consumer-supplied via
 * `steps[].label` / `details[].label`.
 */
import { Badge } from '@/components/base/badge/badge';
import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import { cn } from '@/lib/utils';

import type { ShipmentTrackingCardProps } from './types';

export function ShipmentTrackingCard({
    trackingNumber,
    carrier,
    status,
    steps,
    details = [],
    className,
}: ShipmentTrackingCardProps) {
    return (
        <SmartCard className={className}>
            <div className="flex items-center justify-between">
                <Text size="xs" weight="medium" className="font-mono text-muted-foreground tracking-wide">
                    {trackingNumber}
                </Text>
                {!!carrier && <Badge variant="info">{carrier}</Badge>}
            </div>

            <div className="mt-4 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                <Text weight="semibold">
                    {status}
                </Text>
            </div>

            <div className="mt-5 flex items-center justify-between">
                {steps.map((step, i) => (
                    <div key={step.label} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex w-full items-center">
                            <div className={cn('size-3 shrink-0 rounded-full', step.done ? 'bg-success' : 'bg-muted')} />
                            {i < steps.length - 1 && (
                                <div className={cn('h-0.5 flex-1', step.done ? 'bg-success' : 'bg-muted')} />
                            )}
                        </div>
                        <Text size="xs" type="secondary" className="text-center leading-tight">
                            {step.label}
                        </Text>
                    </div>
                ))}
            </div>

            {details.length > 0 && (
                <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                        {details.map((detail) => (
                            <InlineStat
                                key={detail.label}
                                label={detail.label}
                                value={detail.value}
                                labelClassName="text-xs"
                                valueClassName="text-sm font-medium truncate max-w-[180px]"
                            />
                        ))}
                    </div>
                </>
            )}
        </SmartCard>
    );
}

ShipmentTrackingCard.displayName = 'ShipmentTrackingCard';
