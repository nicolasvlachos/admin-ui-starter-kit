---
id: base/table
title: "Table"
description: "DataTable + Pagination — TanStack-React-Table-backed, with sorting, row actions, sticky header, three sizes, and three surface chromes."
layer: base
family: "Navigation & data"
sourcePath: src/components/base/table
examples:
  - BasicDefaultSizeXsCompact
  - SizeSm
  - SizeBase
  - SurfaceGlassHeaderTransparentCleanOutlineNoMutedHeader
  - SurfaceFlatInsideSmartCardTableRendersNoChrome
  - SizeSmGlassExplicitCellTextScaling
  - WithSortingRowActions
  - PaginationExample
  - RealisticOrdersTable
  - CellRenderers
  - WithRowSelection
  - WithColumnVisibility
  - WithCustomToolbar
  - StickyHeaderAndFirstColumn
  - EmptyState
imports:
  - @/components/base/badge
  - @/components/base/table
  - @/components/base/table/pagination
  - @/components/typography
  - @/preview/_mocks
tags:
  - base
  - navigation
  - data
  - table
  - datatable
  - pagination
  - tanstack
  - react
---

# Table

DataTable + Pagination — TanStack-React-Table-backed, with sorting, row actions, sticky header, three sizes, and three surface chromes.

**Layer:** `base`  
**Source:** `src/components/base/table`

## Examples

```tsx
import { useState } from 'react';
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
import { Edit, Trash2, ShoppingBag, Calendar, Mail, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react';
import {
	DataTable,
	StatusCell,
	DateCell,
	CurrencyCell,
	AvatarCell,
	type StatusCellEntry,
} from '@/components/base/table';
import { Pagination } from '@/components/base/table/pagination';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { MOCK_ORDERS, MOCK_CUSTOMERS } from '@/preview/_mocks';

type Order = {
	id: string;
	customer: string;
	amount: string;
	status: 'paid' | 'pending' | 'overdue';
	date: string;
};

const data: Order[] = [
	{ id: 'ORD-001', customer: 'Sarah Smitha', amount: '2,450 USD', status: 'paid', date: 'Mar 24' },
	{ id: 'ORD-002', customer: 'Daniel Smith', amount: '370 USD', status: 'pending', date: 'Mar 25' },
	{ id: 'ORD-003', customer: 'Emma Garcia', amount: '320 USD', status: 'paid', date: 'Mar 26' },
	{ id: 'ORD-004', customer: 'David Williams', amount: '580 USD', status: 'overdue', date: 'Mar 14' },
	{ id: 'ORD-005', customer: 'Nadia Kowalski', amount: '120 USD', status: 'paid', date: 'Mar 27' },
];

const columns: ColumnDef<Order>[] = [
	{
		accessorKey: 'id',
		header: 'Order',
		cell: ({ getValue }) => (
			<div className="flex items-center gap-2">
				<span className="inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
					<ShoppingBag className="size-3.5" />
				</span>
				<Text tag="span" size="inherit" weight="semibold" className="font-mono">
					{String(getValue())}
				</Text>
			</div>
		),
	},
	{
		accessorKey: 'customer',
		header: 'Customer',
		cell: ({ row }) => (
			<div className="flex items-center gap-1.5">
				<Mail className="size-3 text-muted-foreground" />
				<Text tag="span" size="inherit">{row.original.customer}</Text>
			</div>
		),
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ getValue }) => (
			<Text tag="span" size="inherit" weight="semibold" className="tabular-nums">
				{String(getValue())}
			</Text>
		),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ getValue }) => {
			const v = getValue() as Order['status'];
			const variant = v === 'paid' ? 'success' : v === 'pending' ? 'warning' : 'error';
			return <Badge variant={variant} dot>{v}</Badge>;
		},
	},
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ getValue }) => (
			<div className="flex items-center gap-1 text-muted-foreground">
				<Calendar className="size-3" />
				<Text tag="span" size="inherit" type="secondary" className="tabular-nums">
					{String(getValue())}
				</Text>
			</div>
		),
	},
];

export function BasicDefaultSizeXsCompact() {
	return (
		<>
			<DataTable<Order> columns={columns} data={data} />
		</>
	);
}

export function SizeSm() {
	return (
		<>
			<DataTable<Order> size="sm" columns={columns} data={data} />
		</>
	);
}

export function SizeBase() {
	return (
		<>
			<DataTable<Order> size="base" columns={columns} data={data} />
		</>
	);
}

export function SurfaceGlassHeaderTransparentCleanOutlineNoMutedHeader() {
	return (
		<>
			<DataTable<Order>
								columns={columns}
								data={data}
								surface="glass"
								headerTransparent
							/>
		</>
	);
}

export function SurfaceFlatInsideSmartCardTableRendersNoChrome() {
	return (
		<>
			<div className="rounded-lg border border-border bg-card p-1">
								<DataTable<Order>
									columns={columns}
									data={data}
									surface="flat"
									headerTransparent
								/>
							</div>
		</>
	);
}

export function SizeSmGlassExplicitCellTextScaling() {
	return (
		<>
			<DataTable<Order>
								columns={columns}
								data={data}
								size="sm"
								surface="glass"
								headerTransparent
							/>
		</>
	);
}

export function WithSortingRowActions() {
	return (
		<>
			<DataTable<Order>
								columns={columns}
								data={data}
								enableSorting
								rowActions={() => [
									{ id: 'edit', label: 'Edit', icon: <Edit className="size-3.5" />, onClick: () => {} },
									{ id: 'delete', label: 'Delete', icon: <Trash2 className="size-3.5" />, variant: 'destructive', onClick: () => {} },
								]}
							/>
		</>
	);
}

export function PaginationExample() {
	return (
		<Pagination
			pagination={{
				current_page: 3,
				last_page: 12,
				per_page: 10,
				total: 117,
				path: '/orders',
				prev_page_url: '/orders?page=2',
				next_page_url: '/orders?page=4',
			}}
			onPageChange={() => {}}
		/>
	);
}

type RealOrder = {
	id: string;
	number: string;
	customer: string;
	totalUsd: number;
	status: 'paid' | 'pending' | 'shipped' | 'cancelled';
};

const realData: RealOrder[] = MOCK_ORDERS.map((o) => ({
	id: o.id,
	number: o.number,
	customer: MOCK_CUSTOMERS.find((c) => c.id === o.customerId)?.name ?? '—',
	totalUsd: o.totalUsd,
	status: o.status as RealOrder['status'],
}));

const realColumns: ColumnDef<RealOrder>[] = [
	{ accessorKey: 'number', header: 'Order', cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span> },
	{ accessorKey: 'customer', header: 'Customer' },
	{
		accessorKey: 'totalUsd',
		header: 'Total',
		cell: ({ getValue }) => <span className="tabular-nums">${(getValue() as number).toLocaleString()}</span>,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ getValue }) => {
			const v = getValue() as RealOrder['status'];
			const variant = v === 'paid' ? 'success' : v === 'pending' ? 'warning' : v === 'cancelled' ? 'error' : 'info';
			return <Badge variant={variant} dot>{v}</Badge>;
		},
	},
];

export function RealisticOrdersTable() {
	return (
		<DataTable<RealOrder>
			columns={realColumns}
			data={realData}
			enableSorting
			rowActions={() => [
				{ id: 'edit', label: 'Edit', icon: <Edit className="size-3.5" />, onClick: () => {} },
				{ id: 'delete', label: 'Delete', icon: <Trash2 className="size-3.5" />, variant: 'destructive', onClick: () => {} },
			]}
		/>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cell renderers (StatusCell, DateCell, CurrencyCell, AvatarCell)
// ─────────────────────────────────────────────────────────────────────────────

type CellDemoRow = {
	id: string;
	customer: string;
	avatarUrl: string;
	createdAt: string;
	total: number;
	status: 'paid' | 'pending' | 'shipped' | 'cancelled';
};

const cellDemoData: CellDemoRow[] = [
	{ id: '1', customer: 'Sarah Smitha', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', createdAt: '2026-04-12', total: 2450, status: 'paid' },
	{ id: '2', customer: 'Daniel Smith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dan', createdAt: '2026-04-13', total: 370, status: 'pending' },
	{ id: '3', customer: 'Emma Garcia', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', createdAt: '2026-04-15', total: 1280, status: 'shipped' },
	{ id: '4', customer: 'David Williams', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', createdAt: '2026-04-09', total: 580, status: 'cancelled' },
];

const STATUS_MAP: Record<CellDemoRow['status'], StatusCellEntry> = {
	paid: { label: 'Paid', variant: 'success', icon: CheckCircle2 },
	pending: { label: 'Pending', variant: 'warning', icon: Clock },
	shipped: { label: 'Shipped', variant: 'info', icon: Truck },
	cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
};

const cellDemoColumns: ColumnDef<CellDemoRow>[] = [
	{
		accessorKey: 'customer',
		header: 'Customer',
		cell: ({ row }) => <AvatarCell name={row.original.customer} imageUrl={row.original.avatarUrl} subtitle={`#${row.original.id}`} />,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ getValue }) => <StatusCell value={getValue() as CellDemoRow['status']} map={STATUS_MAP} />,
	},
	{
		accessorKey: 'total',
		header: 'Total',
		cell: ({ getValue }) => <CurrencyCell value={getValue() as number} currency="USD" weight="semibold" />,
	},
	{
		accessorKey: 'createdAt',
		header: 'Created',
		cell: ({ getValue }) => <DateCell value={getValue() as string} />,
	},
];

export function CellRenderers() {
	return <DataTable<CellDemoRow> columns={cellDemoColumns} data={cellDemoData} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Row selection (with checkbox column)
// ─────────────────────────────────────────────────────────────────────────────

export function WithRowSelection() {
	const [selection, setSelection] = useState<RowSelectionState>({});
	return (
		<div className="flex flex-col gap-2">
			<DataTable<Order>
				columns={columns}
				data={data}
				enableRowSelection
				rowSelection={selection}
				onRowSelectionChange={setSelection}
				getRowId={(row) => row.id}
			/>
			<div className="text-xs text-muted-foreground">
				selected: {Object.keys(selection).length === 0 ? '—' : Object.keys(selection).join(', ')}
			</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Column visibility toggle (built-in toolbar)
// ─────────────────────────────────────────────────────────────────────────────

export function WithColumnVisibility() {
	return (
		<DataTable<Order>
			columns={columns}
			data={data}
			enableSorting
			enableColumnVisibility
		/>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom toolbar via topbarContent
// ─────────────────────────────────────────────────────────────────────────────

export function WithCustomToolbar() {
	return (
		<DataTable<Order>
			columns={columns}
			data={data}
			enableColumnVisibility
			topbarContent={
				<div className="flex items-center gap-2">
					<Text size="sm" weight="semibold">Orders</Text>
					<Badge variant="secondary">{data.length}</Badge>
				</div>
			}
		/>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sticky header & first column
// ─────────────────────────────────────────────────────────────────────────────

export function StickyHeaderAndFirstColumn() {
	return (
		<div className="h-64 overflow-auto rounded-md border border-border">
			<DataTable<Order>
				columns={columns}
				data={[...data, ...data, ...data]}
				stickyHeader
				stickyFirstColumn
			/>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────

export function EmptyState() {
	return (
		<DataTable<Order>
			columns={columns}
			data={[]}
			emptyStateMessage="No orders match the current filters."
		/>
	);
}
```

## Example exports

- `BasicDefaultSizeXsCompact`
- `SizeSm`
- `SizeBase`
- `SurfaceGlassHeaderTransparentCleanOutlineNoMutedHeader`
- `SurfaceFlatInsideSmartCardTableRendersNoChrome`
- `SizeSmGlassExplicitCellTextScaling`
- `WithSortingRowActions`
- `PaginationExample`
- `RealisticOrdersTable`
- `CellRenderers`
- `WithRowSelection`
- `WithColumnVisibility`
- `WithCustomToolbar`
- `StickyHeaderAndFirstColumn`
- `EmptyState`

