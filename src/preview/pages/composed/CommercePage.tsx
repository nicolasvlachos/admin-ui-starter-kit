import {
	UpcomingBookingRow,
	LoyaltyPointsCard,
	DiscountStackPreview,
	ShipmentTrackingCard,
} from '@/components/composed/commerce';
import { SmartCard } from '@/components/base/cards';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function CommercePage() {
	return (
		<PreviewPage title="Composed · Commerce" description="Bookings, loyalty, discount stacks, shipment tracking.">
			<PreviewSection title="Upcoming bookings" span="full">
				<SmartCard>
					<UpcomingBookingRow
						bookings={[
							{ id: '1', date: new Date(2026, 2, 28), service: 'Wine Tasting Tour', customer: 'Daniel Smith', time: '14:00', amount: '370 USD' },
							{ id: '2', date: new Date(2026, 3, 3), service: 'Luxury Spa Day', customer: 'Emma Garcia', time: '10:00', amount: '320 USD' },
							{ id: '3', date: new Date(2026, 3, 7), service: 'Hot Air Balloon', customer: 'David Williams', time: '06:30', amount: '580 USD' },
						]}
					/>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Loyalty points">
				<LoyaltyPointsCard
					balance="4,830"
					tier="Gold Tier"
					history={[
						{ label: 'Spa booking', points: '+250', date: 'Mar 24', positive: true },
						{ label: 'Redeemed coupon', points: '-500', date: 'Mar 18', positive: false },
						{ label: 'Wine tasting order', points: '+180', date: 'Mar 12', positive: true },
					]}
					onRedeem={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="Discount stack">
				<DiscountStackPreview
					discounts={[
						{ type: 'Coupon', label: 'SPRING2026 — 25% off', amount: '-88.40 USD', badge: 'info' },
						{ type: 'Loyalty', label: 'Gold tier — 5% extra', amount: '-17.68 USD', badge: 'warning' },
						{ type: 'Promo', label: 'Free shipping over 500 USD', amount: '-12.00 USD', badge: 'success' },
					]}
					totalSavings="-118.08 USD"
				/>
			</PreviewSection>

			<PreviewSection title="Shipment tracking" span="full">
				<ShipmentTrackingCard
					trackingNumber="TRK-9847261035"
					carrier="Speedy"
					status="In Transit"
					steps={[
						{ label: 'Picked up', done: true },
						{ label: 'In transit', done: true },
						{ label: 'Out for delivery', done: false },
						{ label: 'Delivered', done: false },
					]}
					details={[
						{ label: 'Est. Delivery', value: 'Mar 29, 2026' },
						{ label: 'Recipient', value: 'Daniel Smith' },
					]}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
