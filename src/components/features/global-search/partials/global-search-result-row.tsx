/**
 * GlobalSearchResultRow — single rich result card.
 *
 * Layout: [thumbnail] [title + status pill / muted secondary line / meta] [right-value column] [chevron].
 *
 * Exported as a partial so consumers can:
 *   1. Override an individual row via `slots.renderResult` and reuse this component for the others.
 *   2. Use it standalone in custom search UIs that don't need the full GlobalSearch shell.
 */
import { ArrowRight } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/base/display/avatar';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type {
    GlobalSearchResult,
    GlobalSearchTone,
} from '../global-search.types';
import {
    DEFAULT_TONE_AVATAR,
    DEFAULT_TONE_BG,
} from './tone-palettes';

export interface GlobalSearchResultRowProps<TGroup extends string = string> {
    result: GlobalSearchResult<TGroup>;
    /** Highlighted via keyboard nav. */
    isActive?: boolean;
    query?: string;
    onSelect?: () => void;
    onMouseEnter?: () => void;
    /** Override tone palette. Keys not provided fall back to defaults. */
    toneBg?: Partial<Record<GlobalSearchTone, string>>;
    toneAvatar?: Partial<Record<GlobalSearchTone, string>>;
    className?: string;
}

function highlightMatch(text: string, query: string | undefined): React.ReactNode {
    const q = (query ?? '').trim();
    if (!q) return text;
    const lower = text.toLowerCase();
    const ql = q.toLowerCase();
    const i = lower.indexOf(ql);
    if (i < 0) return text;
    return (
        <>
            {text.slice(0, i)}
            <mark className="rounded-sm bg-warning/40 px-0.5 text-foreground">
                {text.slice(i, i + q.length)}
            </mark>
            {text.slice(i + q.length)}
        </>
    );
}

export function GlobalSearchResultRow<TGroup extends string = string>({
    result,
    isActive = false,
    query = '',
    onSelect,
    onMouseEnter,
    toneBg,
    toneAvatar,
    className,
}: GlobalSearchResultRowProps<TGroup>) {
    const ThumbIcon = result.thumbnail?.icon;
    const bg = { ...DEFAULT_TONE_BG, ...toneBg };
    const av = { ...DEFAULT_TONE_AVATAR, ...toneAvatar };

    return (
        <button
            type="button"
            onMouseEnter={onMouseEnter}
            onClick={onSelect}
            className={cn(
                'group/row relative flex w-full items-center gap-3 rounded-lg px-3 py-(--row-py) text-left transition-colors',
                'focus-visible:outline-none',
                isActive ? 'bg-muted/60' : 'hover:bg-muted/40',
                className,
            )}
        >
            {/* Thumbnail / Avatar */}
            <div className="flex shrink-0 items-center">
                {result.avatar ? (
                    <Avatar className={cn('size-8', av[result.avatar.tone ?? 'default'])}>
                        {result.avatar.src && (
                            <AvatarImage src={result.avatar.src} alt={result.title} />
                        )}
                        <AvatarFallback
                            className={cn('text-xs font-semibold', av[result.avatar.tone ?? 'default'])}
                        >
                            {result.avatar.initials}
                        </AvatarFallback>
                    </Avatar>
                ) : ThumbIcon ? (
                    <span
                        className={cn(
                            'inline-flex size-8 items-center justify-center rounded-md',
                            bg[result.thumbnail?.tone ?? 'default'],
                        )}
                    >
                        <ThumbIcon className="size-4" aria-hidden="true" />
                    </span>
                ) : null}
            </div>

            {/* Body */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 leading-tight">
                    <Text tag="span" weight="semibold" className="truncate">
                        {highlightMatch(result.title, query)}
                    </Text>
                    {!!result.badge && (
                        <Badge
                            variant={
                                result.badge.tone === 'destructive'
                                    ? 'error'
                                    : result.badge.tone
                            }
                        >
                            {result.badge.label}
                        </Badge>
                    )}
                </div>
                {(() => {
                    const pieces: Array<{ key: string; node: React.ReactNode }> = [];
                    if (result.subtitle)
                        pieces.push({
                            key: 'subtitle',
                            node: <span>{highlightMatch(result.subtitle, query)}</span>,
                        });
                    result.meta?.forEach((m, i) => {
                        const Icon = m.icon;
                        pieces.push({
                            key: `m-${i}`,
                            node: (
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1',
                                        m.mono && 'font-mono tabular-nums',
                                    )}
                                >
                                    {!!Icon && <Icon className="size-3 shrink-0" aria-hidden="true" />}
                                    {m.label}
                                </span>
                            ),
                        });
                    });
                    if (result.timestamp)
                        pieces.push({
                            key: 'ts',
                            node: <span className="tabular-nums">{result.timestamp}</span>,
                        });
                    result.tags?.forEach((tag) =>
                        pieces.push({ key: `t-${tag}`, node: <span>{tag}</span> }),
                    );
                    if (result.rightValue) {
                        pieces.push({
                            key: 'rv',
                            node: (
                                <span className="font-medium tabular-nums text-foreground">
                                    {result.rightValue}
                                    {!!result.rightLabel && (
                                        <span className="ml-1 font-normal text-muted-foreground">
                                            {result.rightLabel.toLowerCase()}
                                        </span>
                                    )}
                                </span>
                            ),
                        });
                    }
                    if (pieces.length === 0) return null;
                    return (
                        <Text size="xs" type="secondary" className="mt-0.5 truncate">
                            {pieces.map((p, i) => (
                                <span key={p.key}>
                                    {i > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className="mx-1.5 text-muted-foreground/60"
                                        >
                                            ·
                                        </span>
                                    )}
                                    {p.node}
                                </span>
                            ))}
                        </Text>
                    );
                })()}
            </div>

            {/* Right value column — only when value/label set */}
            {!!(result.rightValue || result.rightLabel) && (
                <div className="hidden shrink-0 items-center self-stretch border-l border-border/60 pl-3 md:flex">
                    <div className="flex flex-col items-end gap-0 text-right leading-tight">
                        {!!result.rightValue && (
                            <Text
                                tag="span"
                                weight="semibold"
                                className="whitespace-nowrap tabular-nums"
                            >
                                {result.rightValue}
                            </Text>
                        )}
                        {!!result.rightLabel && (
                            <Text
                                tag="span"
                                size="xxs"
                                type="secondary"
                                className="mt-0.5 whitespace-nowrap"
                            >
                                {result.rightLabel}
                            </Text>
                        )}
                    </div>
                </div>
            )}

            {/* Trailing chevron */}
            <span
                aria-hidden="true"
                className={cn(
                    'inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-all',
                    isActive
                        ? 'bg-foreground text-background opacity-100'
                        : 'text-muted-foreground opacity-0 group-hover/row:opacity-100',
                )}
            >
                <ArrowRight className="size-3.5" />
            </span>
        </button>
    );
}
