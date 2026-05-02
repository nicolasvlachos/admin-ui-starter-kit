import type { ComposedBadgeVariant as BadgeVariant } from '@/components/base/badge/badge';

export interface InvoiceParty {
    name: string;
    location?: string;
}

export interface InvoiceHeaderStrings {
    title: string;
    billFrom: string;
    billTo: string;
    issued: string;
    due: string;
    amountDue: string;
}

export const defaultInvoiceHeaderStrings: InvoiceHeaderStrings = {
    title: 'Invoice',
    billFrom: 'Bill From',
    billTo: 'Bill To',
    issued: 'Issued',
    due: 'Due',
    amountDue: 'Amount Due',
};

export interface InvoiceHeaderCardProps {
    invoiceNumber: string;
    status: string;
    statusVariant?: BadgeVariant;
    from: InvoiceParty;
    to: InvoiceParty;
    issuedDate?: string;
    dueDate?: string;
    amount: string;
    className?: string;
    strings?: Partial<InvoiceHeaderStrings>;
}
