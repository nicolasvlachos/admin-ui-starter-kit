import { useState } from 'react';
import { Sparkles, Star, Zap } from 'lucide-react';
import {
	AddressCard,
	CartSummaryCard,
	CouponInputCard,
	OrderStatusCard,
	PaymentMethodCard,
	RefundStatusCard,
	SubscriptionSummaryCard,
	TaxBreakdownCard,
	VoucherEntryCard,
} from '@/components/composed/commerce';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function CommerceExtrasPage() {
	const [voucherApplied, setVoucherApplied] = useState(false);

	return (
		<PreviewPage
			title="Composed · Commerce (extras)"
			description="Cart, coupon, order status, payment, tax breakdown, subscription, refund, address, voucher."
		>
			<PreviewSection title="CartSummaryCard">
				<CartSummaryCard
					items={[
						{ id: '1', name: 'Wine Tasting Tour', qty: 2, price: '370 USD' },
						{ id: '2', name: 'Spa Day Voucher', qty: 1, price: '180 USD' },
						{ id: '3', name: 'Gift Wrap', qty: 1, price: '15 USD' },
					]}
					subtotal="565 USD"
					tax="113 USD"
					shipping="0 USD"
					discount="50 USD"
					total="628 USD"
					onCheckout={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="CouponInputCard — empty + applied" span="full">
				<div className="grid gap-4 md:grid-cols-2">
					<CouponInputCard onApply={() => {}} />
					<CouponInputCard appliedCode="SPRING2026" appliedDiscount="88.40 USD" onRemove={() => {}} />
				</div>
			</PreviewSection>

			<PreviewSection title="OrderStatusCard" span="full">
				<OrderStatusCard
					orderNumber="ORD-2026-0412"
					status="shipped"
					currentEta="Mar 29, 2026"
					events={[
						{ label: 'Placed', timestamp: 'Mar 24', complete: true },
						{ label: 'Paid', timestamp: 'Mar 24', complete: true },
						{ label: 'Fulfilled', timestamp: 'Mar 25', complete: true },
						{ label: 'Shipped', timestamp: 'Mar 26', complete: true },
						{ label: 'Delivered', complete: false },
					]}
				/>
			</PreviewSection>

			<PreviewSection title="PaymentMethodCard">
				<PaymentMethodCard brand="visa" last4="4242" expiry="04/27" holderName="Sarah Smitha" isDefault onChange={() => {}} />
			</PreviewSection>

			<PreviewSection title="TaxBreakdownCard">
				<TaxBreakdownCard
					subtotal="565.00 USD"
					taxes={[
						{ label: 'VAT (standard)', rate: '20%', amount: '94.20 USD' },
						{ label: 'Tourist tax', rate: '€1.50/night', amount: '4.50 USD' },
						{ label: 'Service charge', rate: '5%', amount: '14.30 USD' },
					]}
					totalTax="113.00 USD"
					total="678.00 USD"
				/>
			</PreviewSection>

			<PreviewSection title="SubscriptionSummaryCard">
				<SubscriptionSummaryCard
					planName="Pro Annual"
					priceLabel="€29"
					cycleLabel="/ month"
					nextBillingDate="May 12, 2026"
					statusLabel="Active"
					perks={[
						{ icon: Sparkles, label: 'AI assist included' },
						{ icon: Star, label: 'Priority support' },
						{ icon: Zap, label: 'Unlimited bookings' },
					]}
					onManage={() => {}}
					onUpgrade={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="RefundStatusCard" span="full">
				<RefundStatusCard
					stage="processing"
					amount="180.00 USD"
					reason="Customer cancelled within 48h window"
					method="Visa ending 4242"
					eta="Apr 14, 2026"
					requestedAt="Apr 8, 2026"
				/>
			</PreviewSection>

			<PreviewSection title="AddressCard" span="full">
				<div className="grid gap-3 md:grid-cols-2">
					<AddressCard
						kind="shipping"
						name="Sarah Smitha"
						line1="ul. Vitosha 24, ap. 5"
						city="New York"
						postalCode="1000"
						country="USA"
						phone="+1 888 123 456"
						isDefault
						onEdit={() => {}}
						onRemove={() => {}}
					/>
					<AddressCard
						kind="billing"
						name="Daniel Smith"
						line1="ul. Slavyanska 9"
						line2="floor 3"
						city="Los Angeles"
						postalCode="4000"
						country="USA"
						onEdit={() => {}}
						onRemove={() => {}}
						onMakeDefault={() => {}}
					/>
				</div>
			</PreviewSection>

			<PreviewSection title="VoucherEntryCard" span="full">
				<div className="grid gap-3 md:grid-cols-2">
					<VoucherEntryCard
						onCheck={() => setVoucherApplied(true)}
						{...(voucherApplied
							? { appliedCode: 'GCT-2026-PETROV', balance: '120.00 USD', onRemove: () => setVoucherApplied(false) }
							: {})}
					/>
					<VoucherEntryCard
						appliedCode="GCT-A4B7-C9E2"
						balance="250.00 USD"
						onRemove={() => {}}
					/>
				</div>
			</PreviewSection>

		</PreviewPage>
	);
}
