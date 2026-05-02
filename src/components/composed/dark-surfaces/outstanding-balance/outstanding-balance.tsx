/**
 * OutstandingBalanceCard — dark-themed card surface for an unpaid amount with
 * due-date pulse, customer name, and two CTA buttons.
 *
 * Strings overridable via `strings` prop (`title`, `dueDateLabel`,
 * `customerLabel`, `sendReminder`, `recordPayment`).
 */
import { Button } from '@/components/base/buttons';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { InlineStat } from '@/components/base/display';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { CreditCard, Send } from 'lucide-react';

import { defaultOutstandingBalanceCardStrings } from '../dark-surfaces.strings';
import type { OutstandingBalanceCardProps } from './types';

export function OutstandingBalanceCard({
    amount,
    amountColor = 'text-warning',
    dueDate,
    customer,
    onSendReminder,
    onRecordPayment,
    className,
    strings: stringsProp,
}: OutstandingBalanceCardProps) {
    const strings = useStrings(defaultOutstandingBalanceCardStrings, stringsProp);
    return (
        <div className={cn('dark rounded-3xl bg-card text-card-foreground p-6 shadow-lg ring-1 ring-border', className)}>
                <Text size="xs" weight="medium" type="secondary" className="uppercase tracking-wider">
                    {strings.title}
                </Text>

                <Heading tag="h3" className={cn('text-3xl tabular-nums tracking-tight border-none pb-0', amountColor)}>{amount}</Heading>

                <div className="mt-4 space-y-2">
                    <InlineStat
                        label={strings.dueDateLabel}
                        value={
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-destructive animate-pulse" />
                                <Text tag="span" weight="medium">{dueDate}</Text>
                            </span>
                        }
                        labelClassName="text-xs"
                    />
                    <InlineStat
                        label={strings.customerLabel}
                        value={customer}
                        labelClassName="text-xs"
                        valueClassName="text-sm font-medium"
                    />
                </div>

                <div className="mt-5 flex gap-2">
                    <Button variant="warning" className="flex-1 rounded-full" onClick={onSendReminder}>
                        <Send className="mr-1.5 size-3.5" />
                        {strings.sendReminder}
                    </Button>
                    <Button variant="success" className="flex-1 rounded-full" onClick={onRecordPayment}>
                        <CreditCard className="mr-1.5 size-3.5" />
                        {strings.recordPayment}
                    </Button>
                </div>
        </div>
    );
}

OutstandingBalanceCard.displayName = 'OutstandingBalanceCard';
