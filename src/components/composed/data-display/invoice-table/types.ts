import type { ReactNode } from 'react';

/** Backwards-compatible default line item shape. */
export interface InvoiceLineItem {
	description: string;
	qty: number;
	price: number;
	total: number;
}

/**
 * Per-column definition. Each column declares how to render its header label
 * and a row's cell. Generic over the row type so consumers can pass arbitrary
 * data without losing type safety.
 */
export interface InvoiceColumn<TItem = InvoiceLineItem> {
	id: string;
	header: ReactNode;
	/** Tailwind class for the column's grid track (e.g. `'1fr'`, `'80px'`). */
	width?: string;
	align?: 'left' | 'right' | 'center';
	cell: (item: TItem, index: number) => ReactNode;
	/** Class names appended to header cell. */
	headerClassName?: string;
	/** Class names appended to each row cell of this column. */
	cellClassName?: string;
}

/** A footer row (totals, taxes, etc.). Ordered as written. */
export interface InvoiceTableFooterRow {
	label: ReactNode;
	value: ReactNode;
	/** Emphasis for the row. `total` renders bold + thicker top spacing. */
	emphasis?: 'normal' | 'total';
}

export interface InvoiceTableStrings {
	subtotal: string;
	tax: string;
	total: string;
}

export const defaultInvoiceTableStrings: InvoiceTableStrings = {
	subtotal: 'Subtotal',
	tax: 'Tax',
	total: 'Total',
};

export interface InvoiceTableProps<TItem = InvoiceLineItem> {
	items: TItem[];
	/** Optional custom columns. Defaults to Description / Qty / Price / Total. */
	columns?: InvoiceColumn<TItem>[];
	/** Optional custom footer rows. When omitted and items match the default
	 * `InvoiceLineItem` shape, the legacy auto-computed subtotal / tax / total
	 * footer is used. */
	footerRows?: InvoiceTableFooterRow[];
	/** Legacy: tax rate for auto-computed footer (only used with default columns). */
	taxRate?: number;
	/** Legacy: currency symbol for auto-computed footer. */
	currency?: string;
	className?: string;
	strings?: Partial<InvoiceTableStrings>;
}
