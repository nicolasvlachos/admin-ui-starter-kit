/**
 * DarkPaymentConfirmation — dark-themed success confirmation with hero
 * amount, expandable payment-details list, and an optional help row.
 *
 * Strings flow via `strings` prop (`successTitle`, `successDescription`,
 * `detailsToggle`).
 */
import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, ChevronUp, HelpCircle } from 'lucide-react';

import { Button } from '@/components/base/buttons';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { IconBadge, InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultDarkPaymentConfirmationStrings } from '../dark-surfaces.strings';
import type { DarkPaymentConfirmationProps } from './types';

export function DarkPaymentConfirmation({
    amount,
    details = [],
    helpText,
    onHelp,
    className,
    strings: stringsProp,
}: DarkPaymentConfirmationProps) {
    const strings = useStrings(defaultDarkPaymentConfirmationStrings, stringsProp);
    const [expanded, setExpanded] = useState(true);

    return (
        <div className={cn('dark-payment--component', 'dark rounded-3xl bg-card text-card-foreground p-6 shadow-lg ring-1 ring-border', className)}>
                <div className="flex flex-col items-center text-center">
                    <IconBadge icon={Check} tone="success" size="lg" className="size-14 [&>svg]:size-7" />
                    <Heading tag="h5" className="mt-3 !border-0 !pb-0">{strings.successTitle}</Heading>
                    <Text size="xs" type="secondary">{strings.successDescription}</Text>
                    <Heading tag="h3" className="text-3xl tabular-nums tracking-tight border-none pb-0">{amount}</Heading>
                </div>

                {details.length > 0 && (
                    <>
                        <Separator className="my-5" />

                        <Button
                            variant="light"
                            buttonStyle="ghost"
                            onClick={() => setExpanded(!expanded)}
                            className="flex w-full items-center justify-between border-0 p-0 h-auto text-muted-foreground hover:text-foreground"
                        >
                            <Text weight="medium">{strings.detailsToggle}</Text>
                            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </Button>

                        {!!expanded && (
                            <div className="mt-3 space-y-2.5">
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
                    </>
                )}

                {!!helpText && (
                    <Item
                        variant="muted"
                        className={cn('mt-5', onHelp && 'cursor-pointer')}
                        onClick={onHelp}
                    >
                        <ItemMedia variant="icon" className="text-muted-foreground">
                            <HelpCircle />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle bold={false} className="text-muted-foreground">{helpText}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRight className="size-4 text-muted-foreground" />
                        </ItemActions>
                    </Item>
                  )}
        </div>
    );
}

DarkPaymentConfirmation.displayName = 'DarkPaymentConfirmation';
