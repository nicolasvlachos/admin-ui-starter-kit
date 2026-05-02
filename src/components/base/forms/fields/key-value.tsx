import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface KeyValueItem {
    id?: string;
    label: React.ReactNode;
    value?: React.ReactNode | null | undefined;
}

export interface KeyValueProps {
    /** Array of key-value items */
    items?: KeyValueItem[];

    /** Plain data object (alternative to items) */
    data?: Record<string, React.ReactNode | string | number | null | undefined>;

    /** Layout mode */
    layout?: 'grid' | 'inline';

    /** Number of columns */
    columns?: 1 | 2 | 3 | 4;

    /** Reduce spacing */
    dense?: boolean;

    /** Hide empty values */
    hideEmpty?: boolean;

    /** Text to show for empty values */
    emptyText?: React.ReactNode;

    /** Additional class names */
    className?: string;

    /** Class name for labels */
    labelClassName?: string;

    /** Class name for values */
    valueClassName?: string;
}

const hashString = (value: string): string => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(36);
};

const resolveItemKey = (item: KeyValueItem): string => {
    if (item.id) return item.id;

    if (typeof item.label === 'string' || typeof item.label === 'number') {
        return `label-${item.label}`;
    }

    if (typeof item.value === 'string' || typeof item.value === 'number') {
        return `value-${item.value}`;
    }

    const fallback = `${String(item.label)}|${String(item.value)}`;
    return `kv-${hashString(fallback)}`;
};

/**
 * KeyValue - A simple, accessible key-value (metadata) display component.
 * This is a display-only component, not a form field.
 */
export function KeyValue({
    items,
    data,
    layout = 'grid',
    columns = 2,
    dense = false,
    hideEmpty = false,
    emptyText = '—',
    className,
    labelClassName,
    valueClassName,
}: KeyValueProps) {
    const list = useMemo(() => {
        if (items && items.length) return items;
        if (!data) return [];
        return Object.entries(data).map(([label, value]) => ({ label, value }));
    }, [items, data]);

    const filtered = useMemo(() => {
        if (!hideEmpty) return list;
        return list.filter((i) => i.value !== null && i.value !== undefined && i.value !== '');
    }, [list, hideEmpty]);

    const gridCols = useMemo(() => {
        const c = Math.min(Math.max(columns, 1), 4);
        return c === 1
            ? 'grid-cols-1'
            : c === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : c === 3
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }, [columns]);

    if (filtered.length === 0) return null;

    const itemGap = dense ? 'gap-y-1.5' : 'gap-y-2.5';
    const blockGap = dense ? 'gap-2' : 'gap-3';

    const containerClass = cn(layout === 'grid' ? cn('grid', gridCols, blockGap) : 'space-y-3', className);

    const labelCls = cn('text-xs uppercase tracking-wide text-muted-foreground', dense ? 'mb-0.5' : 'mb-1', labelClassName);

    const valueCls = cn('text-sm text-foreground break-words', valueClassName);

    return (
        <dl className={containerClass}>
            {filtered.map((item) => (
                <div key={resolveItemKey(item)} className={cn('grid grid-cols-[auto,1fr]', itemGap)}>
                    <dt className={labelCls}>{item.label}</dt>
                    <dd className={valueCls}>{item.value ?? emptyText}</dd>
                </div>
            ))}
        </dl>
    );
}

KeyValue.displayName = 'KeyValue';
