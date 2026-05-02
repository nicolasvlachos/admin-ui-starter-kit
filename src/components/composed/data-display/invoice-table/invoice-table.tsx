/**
 * InvoiceTable — flexible invoice line-item table.
 *
 * Generic over the row type. Pass custom `columns` and `footerRows` for any
 * shape of data. Without those, falls back to the legacy default
 * `InvoiceLineItem` shape (description / qty / price / total) with an
 * auto-computed subtotal / tax / total footer.
 */
import { Text } from '@/components/typography/text';
import { Separator } from '@/components/base/display/separator';
import { useStrings } from '@/lib/strings';
import { useMoneyConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

import {
	defaultInvoiceTableStrings,
	type InvoiceColumn,
	type InvoiceLineItem,
	type InvoiceTableFooterRow,
	type InvoiceTableProps,
} from './types';

const wrapperGlass = 'ring-1 ring-border/50 shadow-sm';

const ALIGN_CLASS = {
	left: 'text-left justify-start',
	right: 'text-right justify-end',
	center: 'text-center justify-center',
} as const;

function buildDefaultColumns(currency: string): InvoiceColumn<InvoiceLineItem>[] {
	return [
		{
			id: 'description',
			header: 'Description',
			width: '1fr',
			cell: (item) => <Text>{item.description}</Text>,
		},
		{
			id: 'qty',
			header: 'Qty',
			width: '60px',
			align: 'left',
			cell: (item) => <Text className="tabular-nums">{item.qty}</Text>,
		},
		{
			id: 'price',
			header: 'Price',
			width: '90px',
			align: 'right',
			cell: (item) => (
				<Text className="tabular-nums font-mono">
					{currency}{item.price.toFixed(2)}
				</Text>
			),
		},
		{
			id: 'total',
			header: 'Total',
			width: '90px',
			align: 'right',
			cell: (item) => (
				<Text weight="medium" className="tabular-nums font-mono">
					{currency}{item.total.toFixed(2)}
				</Text>
			),
		},
	];
}

function buildDefaultFooterRows(
	items: InvoiceLineItem[],
	taxRate: number,
	currency: string,
	strings: typeof defaultInvoiceTableStrings,
): InvoiceTableFooterRow[] {
	const subtotal = items.reduce((s, i) => s + i.total, 0);
	const tax = Math.round(subtotal * taxRate * 100) / 100;
	const taxPct = Math.round(taxRate * 100);
	const total = subtotal + tax;
	const fmt = (n: number) => `${currency}${n.toFixed(2)}`;
	return [
		{ label: strings.subtotal, value: fmt(subtotal) },
		{ label: `${strings.tax} (${taxPct}%)`, value: fmt(tax) },
		{ label: strings.total, value: fmt(total), emphasis: 'total' },
	];
}

export function InvoiceTable<TItem = InvoiceLineItem>({
	items,
	columns,
	footerRows,
	taxRate = 0.2,
	currency,
	className,
	strings: stringsProp,
}: InvoiceTableProps<TItem>) {
	const strings = useStrings(defaultInvoiceTableStrings, stringsProp);
	const { defaultCurrency } = useMoneyConfig();
	const resolvedCurrency = currency ?? defaultCurrency ?? '€';

	// Boundary casts: the default builders are intentionally non-generic and
	// only fire in legacy default mode where the consumer didn't pass
	// `columns`. In that mode the runtime row shape IS `InvoiceLineItem` —
	// the cast is the documented bridge between the generic `<TItem>` API
	// and the concrete default shape.
	const resolvedColumns: InvoiceColumn<TItem>[] =
		columns ?? (buildDefaultColumns(resolvedCurrency) as unknown as InvoiceColumn<TItem>[]);

	const resolvedFooterRows: InvoiceTableFooterRow[] = footerRows
		?? (columns
			? []
			: buildDefaultFooterRows(items as unknown as InvoiceLineItem[], taxRate, resolvedCurrency, strings));

	const gridTemplate = resolvedColumns.map((c) => c.width ?? '1fr').join(' ');

	return (
		<div className={cn('overflow-hidden rounded-3xl bg-card', wrapperGlass, className)}>
			{/* Header */}
			<div
				className="grid gap-2 bg-muted/50 px-5 py-3"
				style={{ gridTemplateColumns: gridTemplate }}
			>
				{resolvedColumns.map((col) => (
					<div
						key={col.id}
						className={cn(
							'flex',
							ALIGN_CLASS[col.align ?? 'left'],
							col.headerClassName,
						)}
					>
						<Text size="xs" weight="medium" type="secondary" className="uppercase tracking-wider">
							{col.header}
						</Text>
					</div>
				))}
			</div>

			{/* Rows */}
			{items.map((item, i) => (
				<div
					key={i}
					className={cn('grid gap-2 px-5 py-3', i % 2 === 1 && 'bg-muted/20')}
					style={{ gridTemplateColumns: gridTemplate }}
				>
					{resolvedColumns.map((col) => (
						<div
							key={col.id}
							className={cn('flex items-center', ALIGN_CLASS[col.align ?? 'left'], col.cellClassName)}
						>
							{col.cell(item, i)}
						</div>
					))}
				</div>
			))}

			{/* Footer */}
			{resolvedFooterRows.length > 0 && (
				<>
					<Separator />
					<div className="space-y-2 px-5 py-4">
						{resolvedFooterRows.map((row, idx) => (
							<div
								key={idx}
								className={cn(
									'flex justify-between',
									row.emphasis === 'total' && 'pt-2',
								)}
							>
								<Text
									type={row.emphasis === 'total' ? undefined : 'secondary'}
									weight={row.emphasis === 'total' ? 'bold' : 'regular'}
								>
									{row.label}
								</Text>
								<Text
									weight={row.emphasis === 'total' ? 'bold' : 'regular'}
									className="tabular-nums font-mono"
								>
									{row.value}
								</Text>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}

InvoiceTable.displayName = 'InvoiceTable';
