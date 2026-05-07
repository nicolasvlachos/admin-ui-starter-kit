// @ts-nocheck
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export function Default() {
	return (
		<>
			<Table>
								<TableCaption>Recent orders</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Order</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>ORD-001</TableCell>
										<TableCell>Sarah Smitha</TableCell>
										<TableCell>2,450 USD</TableCell>
										<TableCell>Paid</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>ORD-002</TableCell>
										<TableCell>Daniel Smith</TableCell>
										<TableCell>370 USD</TableCell>
										<TableCell>Pending</TableCell>
									</TableRow>
								</TableBody>
							</Table>
		</>
	);
}
