import type { ReactNode } from 'react';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

interface CellValueProps {
    /** The value to display. When falsy, renders fallback with muted styling. */
    value?: string | number | null | undefined;
    /** Text shown when value is missing. Defaults to '--'. */
    fallback?: string;
    /** Force missing state regardless of value truthiness. */
    missing?: boolean;
    /** Additional class names (e.g. 'tabular-nums', 'font-mono'). */
    className?: string;
    /** Children override — when provided, renders children directly with missing styling applied. */
    children?: ReactNode;
}

/**
 * Table cell value with automatic missing-value treatment.
 *
 * When the value is falsy (or `missing` is explicitly true), renders
 * the fallback text at reduced opacity. Otherwise renders the value
 * with inherited table cell styling.
 *
 * @example
 * // Auto-detect missing
 * <CellValue value={phone} fallback={t('shared.tables.ui.empty')} />
 *
 * // Explicit missing flag
 * <CellValue missing={!defaultBusiness} fallback={t('vendors.tables.ui.no_default_business')} />
 *
 * // With formatting class
 * <CellValue value={date} className="tabular-nums" />
 *
 * // Custom children with missing styling
 * <CellValue missing={!phone}>
 *   {phone || 'No items to display'}
 * </CellValue>
 */
export function CellValue({ value, fallback = '--', missing, className, children }: CellValueProps) {
    const isMissing = missing ?? (value === null || value === undefined || value === '');

    if (children !== undefined) {
        return (
            <Text
                tag="span"
                size="inherit"
                type={isMissing ? 'secondary' : 'main'}
                className={cn(isMissing && 'opacity-60', className)}
            >
                {children}
            </Text>
        );
    }

    if (isMissing) {
        return (
            <Text tag="span" size="inherit" type="secondary" className={cn('opacity-60', className)}>
                {fallback}
            </Text>
        );
    }

    return (
        <Text tag="span" size="inherit" className={className}>
            {String(value)}
        </Text>
    );
}

CellValue.displayName = 'CellValue';
