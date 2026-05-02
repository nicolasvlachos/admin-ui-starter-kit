/**
 * BookingReceiptDark — dark-themed booking receipt with reference code,
 * status pill, optional metadata rows, and an emphasised amount-paid total.
 *
 * Strings flow via the `strings` prop (deep-merged over
 * `defaultBookingReceiptDarkStrings`); status pill text falls back to
 * `strings.statusConfirmed` when the consumer doesn't pass one.
 */
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { InlineStat } from '@/components/base/display';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultBookingReceiptDarkStrings } from '../dark-surfaces.strings';
import type { BookingReceiptDarkProps } from './types';

export function BookingReceiptDark({
    referenceCode,
    status,
    details = [],
    amountPaid,
    className,
    strings: stringsProp,
}: BookingReceiptDarkProps) {
    const strings = useStrings(defaultBookingReceiptDarkStrings, stringsProp);
    const resolvedStatus = status ?? strings.statusConfirmed;
    return (
        <div className={cn('dark rounded-3xl bg-card text-card-foreground p-6 shadow-lg ring-1 ring-border', className)}>
                <div className="flex items-center justify-between">
                    <Heading tag="h6" className="!border-0 !pb-0">{strings.title}</Heading>
                    <Text size="xs" weight="medium" className="flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-success">
                        <span className="size-1.5 rounded-full bg-success" />
                        {resolvedStatus}
                    </Text>
                </div>

                {details.length > 0 && (
                    <div className="mt-5 space-y-3 text-sm">
                        {details.map((detail) => (
                            <InlineStat
                                key={detail.label}
                                label={detail.label}
                                value={detail.value}
                                labelClassName="text-sm"
                                valueClassName="text-sm font-medium"
                            />
                        ))}
                    </div>
                )}

                {!!referenceCode && (
                    <Text tag="div" size="xs" type="secondary" align="center" className="mt-4 rounded-xl bg-muted p-3 font-mono tracking-wider">
                        {referenceCode}
                    </Text>
                  )}

                <InlineStat
                    className="mt-4 border-t border-border pt-4"
                    label={strings.amountPaidLabel}
                    value={<Heading tag="h4" className="text-xl border-none pb-0">{amountPaid}</Heading>}
                    labelClassName="text-sm"
                />
        </div>
    );
}

BookingReceiptDark.displayName = 'BookingReceiptDark';
