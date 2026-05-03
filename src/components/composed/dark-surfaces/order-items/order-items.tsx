/**
 * OrderItemsCard — dark-themed order line-item list with vendor metadata,
 * optional badges, summary rows, and a total. Strings overridable via
 * `strings` prop.
 */
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { InlineStat } from '@/components/base/display';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemHeader,
    ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultOrderItemsCardStrings } from '../dark-surfaces.strings';
import type { OrderItemsCardProps } from './types';

export function OrderItemsCard({
    items,
    summary = [],
    total,
    className,
    strings: stringsProp,
}: OrderItemsCardProps) {
    const strings = useStrings(defaultOrderItemsCardStrings, stringsProp);
    return (
        <div className={cn('order-items--component', 'dark rounded-3xl bg-card text-card-foreground p-5 shadow-lg ring-1 ring-border', className)}>
                <Heading tag="h6" className="!border-0 !pb-0">{strings.title}</Heading>

                <ItemGroup className="mt-4 gap-3">
                    {items.map((item) => (
                        <Item key={item.name} variant="muted" className="flex-col items-stretch gap-2">
                            <ItemHeader>
                                <Text size="xs" type="secondary">{item.vendor}</Text>
                                {!!item.badge && (
                                    <Text size="xs" weight="medium" className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                                        {item.badge}
                                    </Text>
                                )}
                            </ItemHeader>
                            <div className="flex w-full items-center justify-between gap-3">
                                <ItemContent>
                                    <ItemTitle>{item.name}</ItemTitle>
                                    <ItemDescription clamp={1}>
                                        <span className="inline-flex items-center gap-1.5">
                                            {!!item.color && <span className={cn('size-2.5 rounded-full', item.color)} />}
                                            x{item.qty}
                                        </span>
                                    </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Text weight="bold">{item.price}</Text>
                                </ItemActions>
                            </div>
                        </Item>
                    ))}
                </ItemGroup>

                {!!(summary.length > 0 || total) && (
                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                        {summary.map((line) => (
                            <InlineStat
                                key={line.label}
                                label={line.label}
                                value={line.value}
                                labelClassName="text-sm text-muted-foreground"
                                valueClassName="text-sm text-muted-foreground"
                            />
                        ))}
                        {!!total && (
                            <InlineStat
                                className="border-t border-dashed border-border pt-2"
                                label={strings.totalLabel}
                                value={total}
                                labelClassName="text-sm font-semibold"
                                valueClassName="text-sm font-semibold"
                            />
                        )}
                    </div>
                  )}
        </div>
    );
}

OrderItemsCard.displayName = 'OrderItemsCard';
