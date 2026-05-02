import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, ShoppingBag, Calendar, Mail } from 'lucide-react';
import { DataTable } from '@/components/base/table';
import { Pagination } from '@/components/base/table/pagination';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

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

export default function TablePage() {
	// Cells use `size="inherit"` so they pick up the table's `text-xs/sm/base`
	// via CSS inheritance — that's how the `<DataTable size="...">` prop
	// actually changes the visual density across columns.
	const columns: ColumnDef<Order>[] = useMemo(
		() => [
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
		],
		[],
	);

	return (
		<PreviewPage title="Base · Table" description="DataTable + Pagination — sorting, row actions, sticky header. Cell renderers use Text size='inherit' so the DataTable size prop propagates via CSS.">
			<PreviewSection title="Basic (default size = xs, compact)" span="full">
				<DataTable<Order> columns={columns} data={data} />
			</PreviewSection>

			<PreviewSection title="size='sm'" span="full">
				<DataTable<Order> size="sm" columns={columns} data={data} />
			</PreviewSection>

			<PreviewSection title="size='base'" span="full">
				<DataTable<Order> size="base" columns={columns} data={data} />
			</PreviewSection>

			<PreviewSection title="With sorting + row actions" span="full">
				<DataTable<Order>
					columns={columns}
					data={data}
					enableSorting
					rowActions={() => [
						{ id: 'edit', label: 'Edit', icon: <Edit className="size-3.5" />, onClick: () => {} },
						{ id: 'delete', label: 'Delete', icon: <Trash2 className="size-3.5" />, variant: 'destructive', onClick: () => {} },
					]}
				/>
			</PreviewSection>

			<PreviewSection title="Pagination" span="full">
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
			</PreviewSection>
		</PreviewPage>
	);
}
