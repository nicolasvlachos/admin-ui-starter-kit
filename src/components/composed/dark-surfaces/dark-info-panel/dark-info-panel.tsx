/**
 * DarkInfoPanel — collapsible dark-themed key-value list with optional total.
 *
 * Header title falls back to `strings.defaultTitle` (`"Details"` in English)
 * when no `title` is passed. Pass `strings={{ defaultTitle: '…' }}` to localise.
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/base/buttons';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultDarkInfoPanelStrings } from '../dark-surfaces.strings';
import type { DarkInfoPanelProps } from './types';

export function DarkInfoPanel({
    title,
    items,
    totalLabel,
    totalValue,
    defaultOpen = true,
    className,
    strings: stringsProp,
}: DarkInfoPanelProps) {
    const strings = useStrings(defaultDarkInfoPanelStrings, stringsProp);
    const resolvedTitle = title ?? strings.defaultTitle;
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={cn('dark rounded-3xl bg-card text-card-foreground p-5 shadow-lg ring-1 ring-border', className)}>
                <Button
                    variant="light"
                    buttonStyle="ghost"
                    onClick={() => setOpen(!open)}
                    className="flex w-full items-center justify-between border-0 p-0 h-auto"
                >
                    <Heading tag="h6" className="!border-0 !pb-0">{resolvedTitle}</Heading>
                    {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </Button>

                {!!open && (
                    <div className="mt-4 space-y-3 text-sm">
                        {items.map((item) => (
                            <div key={item.label} className="flex justify-between">
                                <Text type="secondary">{item.label}</Text>
                                <Text weight="medium" className={cn(item.highlight && 'text-success')}>{item.value}</Text>
                            </div>
                        ))}
                        {!!totalLabel && !!totalValue && (
                            <div className="border-t border-dashed border-border pt-3">
                                <div className="flex justify-between">
                                    <Text weight="semibold" type="secondary">{totalLabel}</Text>
                                    <Text weight="semibold">{totalValue}</Text>
                                </div>
                            </div>
                          )}
                    </div>
                )}
        </div>
    );
}

DarkInfoPanel.displayName = 'DarkInfoPanel';
