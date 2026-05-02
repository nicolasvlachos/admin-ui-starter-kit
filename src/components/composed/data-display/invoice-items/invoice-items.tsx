import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { IconBadge, InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import { Badge } from '@/components/base/badge/badge';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from '@/components/base/item';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import { type InvoiceItemsProps } from './types';

/* ─── Layout A: Table-style rows ───────────────────────────────────────────── */

export function InvoiceItemsTable({
    items,
    subtotal,
    tax,
    discount,
    total,
    className,
}: InvoiceItemsProps) {
    return (
        <div className={cn('rounded-xl bg-card shadow-sm overflow-hidden', className)}>
            {/* Header row */}
            <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 bg-muted/50 px-6 py-3">
                <Text size="xs" type="secondary" weight="medium">Item</Text>
                <Text size="xs" type="secondary" weight="medium" align="center">Qty</Text>
                <Text size="xs" type="secondary" weight="medium" align="right">Price</Text>
                <Text size="xs" type="secondary" weight="medium" align="right">Total</Text>
            </div>

            {/* Items */}
            {items.map((item, idx) => (
                <div key={item.id}>
                    <div className="grid grid-cols-[1fr_80px_100px_100px] items-center gap-4 px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <Text weight="medium">{item.title}</Text>
                                {!!item.badge && (
                                    <Badge variant={item.badgeVariant ?? 'secondary'}>
                                        {item.badge}
                                    </Badge>
                                )}
                            </div>
                            {!!item.description && (
                                <Text size="xs" type="secondary" className="line-clamp-1">
                                    {item.description}
                                </Text>
                            )}
                        </div>
                        <Text align="center" type="secondary" className="tabular-nums">
                            {item.quantity ?? 1}
                        </Text>
                        <Text align="right" className="tabular-nums">
                            {item.unitPrice ?? item.total}
                        </Text>
                        <Text align="right" weight="semibold" className="tabular-nums">
                            {item.total}
                        </Text>
                    </div>
                    {idx < items.length - 1 && <Separator className="mx-6 !w-auto" />}
                </div>
            ))}

            {/* Totals */}
            {!!(subtotal || tax || discount || total) && (
                <div className="border-t border-border bg-muted/30 px-6 py-4 space-y-2">
                    {!!subtotal && (
                        <InlineStat label="Subtotal" value={subtotal} mono labelClassName="text-sm" valueClassName="text-sm" />
                    )}
                    {!!discount && (
                        <InlineStat label="Discount" value={`-${discount}`} mono labelClassName="text-sm" valueClassName="text-sm text-success" />
                    )}
                    {!!tax && (
                        <InlineStat label="Tax" value={tax} mono labelClassName="text-sm" valueClassName="text-sm" />
                    )}
                    {!!total && (
                        <>
                            <Separator />
                            <InlineStat
                                className="pt-1"
                                label="Total"
                                value={<Heading tag="h5" className="text-base tabular-nums border-none pb-0">{total}</Heading>}
                                labelClassName="text-sm font-semibold"
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Layout B: Compact card rows ──────────────────────────────────────────── */

export function InvoiceItemsCompact({
    items,
    total,
    className,
}: InvoiceItemsProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <ItemGroup>
                {items.map((item) => (
                    <Item key={item.id} className="bg-card shadow-sm">
                        <ItemMedia>
                            <IconBadge tone="muted" size="sm" shape="square">
                                {item.icon ?? <Package />}
                            </IconBadge>
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>
                                {item.title}
                                {!!item.badge && (
                                    <Badge variant={item.badgeVariant ?? 'secondary'}>
                                        {item.badge}
                                    </Badge>
                                )}
                            </ItemTitle>
                            {!!item.description && <ItemDescription clamp={1}>{item.description}</ItemDescription>}
                        </ItemContent>
                        <ItemActions>
                            {!!item.quantity && item.quantity > 1 && (
                                <Text size="xs" type="secondary" className="shrink-0 tabular-nums">
                                    x{item.quantity}
                                </Text>
                            )}
                            <Text weight="semibold" className="shrink-0 tabular-nums">
                                {item.total}
                            </Text>
                        </ItemActions>
                    </Item>
                ))}
            </ItemGroup>

            {!!total && (
                <InlineStat
                    className="rounded-lg bg-primary/5 px-4 py-3"
                    label="Total"
                    value={<Heading tag="h5" className="text-base tabular-nums border-none pb-0">{total}</Heading>}
                    labelClassName="text-sm font-semibold"
                />
            )}
        </div>
    );
}

/* ─── Layout C: Detailed breakdown ─────────────────────────────────────────── */

export function InvoiceItemsDetailed({
    items,
    subtotal,
    tax,
    discount,
    total,
    className,
}: InvoiceItemsProps) {
    return (
        <div className={cn('rounded-xl bg-card shadow-sm overflow-hidden', className)}>
            <div className="divide-y divide-border">
                {items.map((item) => (
                    <div key={item.id} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary mt-0.5">
                                    {item.icon ?? <Package className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Text weight="semibold">{item.title}</Text>
                                        {!!item.badge && (
                                            <Badge variant={item.badgeVariant ?? 'secondary'}>
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    {!!item.description && (
                                        <Text size="xs" type="secondary" className="line-clamp-2">
                                            {item.description}
                                        </Text>
                                    )}
                                    <div className="flex items-center gap-3 pt-0.5">
                                        {!!item.quantity && (
                                            <Text size="xs" type="discrete">
                                                Qty: {item.quantity}
                                            </Text>
                                        )}
                                        {!!item.unitPrice && (
                                            <Text size="xs" type="discrete" className="tabular-nums">
                                                @ {item.unitPrice}
                                            </Text>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <Text size="base" weight="semibold" className="tabular-nums">
                                    {item.total}
                                </Text>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary footer */}
            {!!total && (
                <div className="border-t border-border bg-muted/30 px-6 py-4">
                    <div className="space-y-2">
                        {!!subtotal && (
                            <InlineStat label="Subtotal" value={subtotal} mono labelClassName="text-sm" valueClassName="text-sm" />
                        )}
                        {!!discount && (
                            <InlineStat label="Discount" value={`-${discount}`} mono labelClassName="text-sm" valueClassName="text-sm text-success" />
                        )}
                        {!!tax && (
                            <InlineStat label="Tax (20%)" value={tax} mono labelClassName="text-sm" valueClassName="text-sm" />
                        )}
                        <Separator />
                        <InlineStat
                            className="pt-1"
                            label="Total Due"
                            value={<Heading tag="h4" className="text-xl tabular-nums border-none pb-0">{total}</Heading>}
                            labelClassName="text-base font-semibold"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

InvoiceItemsTable.displayName = 'InvoiceItemsTable';
InvoiceItemsCompact.displayName = 'InvoiceItemsCompact';
InvoiceItemsDetailed.displayName = 'InvoiceItemsDetailed';
