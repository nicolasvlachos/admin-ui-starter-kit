// @ts-nocheck
import { InvoiceHeaderCard } from '@/components/composed/data-display/invoice-header';

export function Paid() {
	return (
		<>
			<InvoiceHeaderCard
								invoiceNumber="#INV-2026-0392"
								status="Paid"
								statusVariant="success"
								from={{ name: 'Gift Come True Ltd.', location: 'New York, NY' }}
								to={{ name: 'Daniel Smith', location: 'Los Angeles, USA' }}
								issuedDate="Mar 20, 2026"
								dueDate="Apr 20, 2026"
								amount="2,480.00 USD"
							/>
		</>
	);
}

export function Overdue() {
	return (
		<>
			<InvoiceHeaderCard
								invoiceNumber="#INV-2026-0114"
								status="Overdue"
								statusVariant="error"
								from={{ name: 'Gift Come True Ltd.' }}
								to={{ name: 'Adventure Park Bansko' }}
								issuedDate="Feb 14, 2026"
								dueDate="Mar 14, 2026"
								amount="3,120.00 USD"
							/>
		</>
	);
}
