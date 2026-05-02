/**
 * Default idle-state body — shown when the query is too short.
 * Renders consumer-supplied "Recent" + "Suggestions" sections.
 */
import { Clock, Search, Sparkles } from 'lucide-react';
import * as React from 'react';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type { GlobalSearchIdleSection } from '../global-search.types';

export interface GlobalSearchIdleStateProps {
    sections: ReadonlyArray<GlobalSearchIdleSection>;
    /** Optional override for the heading icon when missing on a section. */
    fallbackIcons?: { recent?: React.ElementType; suggestions?: React.ElementType };
}

export function GlobalSearchIdleState({
    sections,
    fallbackIcons,
}: GlobalSearchIdleStateProps) {
    return (
        <div className="space-y-4 px-2 py-3">
            {sections.map((section, idx) => {
                const HeadingIcon =
                    section.icon ??
                    (idx === 0
                        ? fallbackIcons?.recent ?? Clock
                        : fallbackIcons?.suggestions ?? Sparkles);
                return (
                    <div key={section.id}>
                        <div className="flex items-center gap-2 px-3 pb-1.5">
                            <HeadingIcon
                                className="size-3.5 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <Text
                                size="xxs"
                                type="secondary"
                                weight="medium"
                                className="uppercase tracking-wider"
                            >
                                {section.label}
                            </Text>
                        </div>
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const ItemIcon = item.icon ?? Search;
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={item.onSelect}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left transition-colors',
                                                'hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none',
                                            )}
                                        >
                                            <ItemIcon
                                                className="size-3.5 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                            <Text className="flex-1 truncate">
                                                {item.label}
                                            </Text>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
