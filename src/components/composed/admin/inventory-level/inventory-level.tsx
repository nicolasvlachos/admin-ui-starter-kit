/**
 * InventoryLevelCard — single-product inventory snapshot with stock total,
 * reorder threshold, and a status pill (Critical / Low Stock / In Stock).
 *
 * Status thresholds are computed from `stock`, `reorderLevel`, and the
 * critical threshold (50% of `reorderLevel`). Status pill labels flow via
 * the `strings` prop so consumers can localise without forking the file.
 */
import { Badge } from '@/components/base/badge/badge';
import { SmartCard } from '@/components/base/cards/smart-card';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/base/item';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultInventoryLevelCardStrings } from '../admin.strings';
import type { InventoryLevelCardProps } from './types';

export function InventoryLevelCard({
    productName,
    variant,
    stock,
    reorderLevel,
    maxStock,
    lastRestocked,
    className,
    strings: stringsProp,
}: InventoryLevelCardProps) {
    const strings = useStrings(defaultInventoryLevelCardStrings, stringsProp);
    const pct = Math.round((stock / maxStock) * 100);
    const isLow = stock <= reorderLevel;
    const isCritical = stock <= reorderLevel * 0.5;

    const badgeVariant = isCritical ? 'error' : isLow ? 'warning' : 'success';
    const badgeLabel = isCritical
        ? strings.statusCritical
        : isLow
            ? strings.statusLowStock
            : strings.statusInStock;

    return (
        <SmartCard className={className}>
            <Item size="xs" className="px-0">
                <ItemContent>
                    <ItemTitle>{productName}</ItemTitle>
                    {!!variant && (
                        <ItemDescription clamp={1}>
                            {strings.variantLabel}: {variant}
                        </ItemDescription>
                    )}
                </ItemContent>
                <ItemActions>
                    <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                </ItemActions>
            </Item>

            <Heading tag="h3" className="text-3xl tabular-nums tracking-tight border-none pb-0">{stock}</Heading>
            <Text size="xs" type="secondary">
                {strings.unitsAvailable}
            </Text>

            <div className="mt-4 space-y-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all',
                            isCritical ? 'bg-destructive' : isLow ? 'bg-warning' : 'bg-success',
                        )}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Text size="xs" type="secondary">
                        {strings.reorderAtLabel}: <Text tag="span" weight="medium" className="tabular-nums">{reorderLevel}</Text>
                    </Text>
                    {!!lastRestocked && (
                        <Text size="xs" type="secondary">
                            {strings.lastRestockedLabel}: {lastRestocked}
                        </Text>
                      )}
                </div>
            </div>
        </SmartCard>
    );
}

InventoryLevelCard.displayName = 'InventoryLevelCard';
