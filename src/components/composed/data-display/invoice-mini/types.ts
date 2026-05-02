import type { ComposedBadgeVariant } from '@/components/base/badge/badge';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface InvoiceMiniData {
    invoiceNumber: string;
    customerName: string;
    lineItemsCount: number;
    totalAmount: string;
    status: InvoiceStatus;
    dueDate: string;
}

export interface InvoiceMiniStrings {
    paid: string;
    pending: string;
    overdue: string;
    items: (count: number) => string;
    due: string;
}

export const defaultInvoiceMiniStrings: InvoiceMiniStrings = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    items: (count) => (count === 1 ? '1 line item' : `${count} line items`),
    due: 'Due',
};

export interface InvoiceMiniCardProps {
    invoice: InvoiceMiniData;
    className?: string;
    strings?: Partial<InvoiceMiniStrings>;
}

export const invoiceStatusVariant: Record<InvoiceStatus, ComposedBadgeVariant> = {
    paid: 'success',
    pending: 'warning',
    overdue: 'error',
};

/** @deprecated Prefer `defaultInvoiceMiniStrings` for labels and `invoiceStatusVariant` for variants. */
export const invoiceStatusMap: Record<InvoiceStatus, { label: string; variant: ComposedBadgeVariant }> = {
    paid: { label: defaultInvoiceMiniStrings.paid, variant: 'success' },
    pending: { label: defaultInvoiceMiniStrings.pending, variant: 'warning' },
    overdue: { label: defaultInvoiceMiniStrings.overdue, variant: 'error' },
};
