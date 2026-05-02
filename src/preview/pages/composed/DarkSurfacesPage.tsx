import {
	DarkPaymentConfirmation,
	BookingReceiptDark,
	DarkInfoPanel,
	OrderItemsCard,
	OutstandingBalanceCard,
} from '@/components/composed/dark-surfaces';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function DarkSurfacesPage() {
	return (
		<PreviewPage title="Composed · Dark surfaces" description="Dark-wrapped components — payment, receipt, info panel, order items, outstanding balance.">
			<PreviewSection title="Payment confirmation">
				<DarkPaymentConfirmation
					amount="249.00 USD"
					details={[
						{ label: 'Method', value: 'Visa •••• 4242' },
						{ label: 'Reference', value: 'GCT-2026-0847' },
						{ label: 'Date', value: 'Mar 27, 2026' },
					]}
					helpText="Need help with this transaction?"
				/>
			</PreviewSection>

			<PreviewSection title="Booking receipt">
				<BookingReceiptDark
					referenceCode="GCT-BK-2026-0392"
					details={[
						{ label: 'Vendor', value: 'BG Spa Retreat' },
						{ label: 'Service', value: 'Deep Tissue Massage' },
						{ label: 'Date', value: 'Apr 2, 2026 — 15:00' },
					]}
					amountPaid="135.00 USD"
				/>
			</PreviewSection>

			<PreviewSection title="Info panel">
				<DarkInfoPanel
					title="Voucher Breakdown"
					items={[
						{ label: 'Base price', value: '200 USD' },
						{ label: 'Platform fee (5%)', value: '10 USD' },
						{ label: 'VAT (20%)', value: '40 USD' },
						{ label: 'Discount', value: '-25 USD', highlight: true },
					]}
					totalLabel="Total Charged"
					totalValue="225 USD"
				/>
			</PreviewSection>

			<PreviewSection title="Order items">
				<OrderItemsCard
					items={[
						{ vendor: 'Artisan Chocolates', badge: 'Express', name: 'Luxury Truffle Box', qty: 2, price: '48 USD', color: 'bg-amber-400' },
						{ vendor: 'BG Spa Retreat', badge: 'Standard', name: 'Couples Massage Voucher', qty: 1, price: '120 USD', color: 'bg-sky-400' },
					]}
					summary={[
						{ label: 'Subtotal', value: '216 USD' },
						{ label: 'Shipping', value: '5.99 USD' },
					]}
					total="265.19 USD"
				/>
			</PreviewSection>

			<PreviewSection title="Outstanding balance">
				<OutstandingBalanceCard
					amount="4,920 USD"
					dueDate="Apr 15, 2026"
					customer="David Williams"
					onSendReminder={() => {}}
					onRecordPayment={() => {}}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
