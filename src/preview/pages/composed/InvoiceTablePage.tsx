import { InvoiceTable } from '@/components/composed/data-display/invoice-table';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function InvoiceTablePage() {
	return (
		<PreviewPage title="Composed · Invoice table" description="Line items with qty / price / total.">
			<PreviewSection title="Default" span="full">
				<InvoiceTable
					items={[
						{ description: 'Wine Tasting x 2', qty: 2, price: 185, total: 370 },
						{ description: 'Luxury Spa Package', qty: 1, price: 420, total: 420 },
						{ description: 'Gift Basket (Large)', qty: 3, price: 94, total: 282 },
					]}
				/>
			</PreviewSection>

			<PreviewSection title="With tax rate" span="full">
				<InvoiceTable
					taxRate={20}
					items={[
						{ description: 'Hot Air Balloon', qty: 1, price: 580, total: 580 },
						{ description: 'Photo Tour', qty: 2, price: 120, total: 240 },
					]}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
