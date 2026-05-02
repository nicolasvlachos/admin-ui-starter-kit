import { type ReactNode } from 'react';
import type { ComposedBadgeVariant as BadgeVariant } from '@/components/base/badge/badge';

export interface InvoiceItem {
    id: string;
    title: string;
    description?: string;
    quantity?: number;
    unitPrice?: string;
    total: string;
    badge?: string;
    badgeVariant?: BadgeVariant;
    icon?: ReactNode;
}

export interface InvoiceItemsProps {
    items: InvoiceItem[];
    subtotal?: string;
    tax?: string;
    discount?: string;
    total?: string;
    currency?: string;
    className?: string;
}
