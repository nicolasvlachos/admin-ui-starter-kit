import {
	AlertTriangle,
	CheckCircle,
	CreditCard,
	FileText,
	Heart,
	Mail,
	Receipt,
	ShoppingBag,
} from 'lucide-react';
import {
	ActivityStreamCard,
	ChangelogTimelineCard,
	MilestonesTimelineCard,
	OrderTimelineCard,
	PaymentTimelineCard,
	StepsCard,
	StepsHorizontal,
} from '@/components/composed/timelines';

const steps = [
	{ id: '1', title: 'Order Placed', description: 'Customer completed checkout', status: 'completed' as const, timestamp: 'Mar 24' },
	{ id: '2', title: 'Payment Confirmed', status: 'completed' as const, timestamp: 'Mar 24', badge: 'Verified', badgeVariant: 'success' as const },
	{ id: '3', title: 'Preparing Vouchers', description: 'Generating codes', status: 'current' as const },
	{ id: '4', title: 'Ready for Delivery', status: 'upcoming' as const },
	{ id: '5', title: 'Delivered', status: 'upcoming' as const },
];

export function StepsVertical() {
	return (
		<>
			<StepsCard title="Order Processing" description="Order #ORD-2026-0412" steps={steps} />
		</>
	);
}

export function StepsHorizontalExample() {
	return (
		<>
			<StepsHorizontal title="Delivery Pipeline" steps={steps} />
		</>
	);
}

export function OrderTimeline() {
	return (
		<>
			<OrderTimelineCard
								title="Order #ORD-2026-0415"
								description="Sarah Smitha — 2,450 USD"
								events={[
									{ id: '1', title: 'Order placed', timestamp: '10:24 AM', status: 'completed' },
									{ id: '2', title: 'Payment received', description: '2,450 USD', timestamp: '10:26 AM', status: 'completed' },
									{ id: '3', title: 'Vouchers generated', timestamp: '10:27 AM', status: 'completed' },
									{ id: '4', title: 'Email sent', timestamp: '10:28 AM', status: 'current' },
									{ id: '5', title: 'Delivery scheduled', timestamp: '—', status: 'pending' },
								]}
								footerText="Last updated 2 minutes ago"
							/>
		</>
	);
}

export function PaymentTimeline() {
	return (
		<>
			<PaymentTimelineCard
								events={[
									{ label: 'Invoice sent', date: 'Mar 20', amount: '2,480 USD', done: true, icon: FileText },
									{ label: 'Reminder sent', date: 'Apr 5', done: true, icon: Mail },
									{ label: 'Payment received', date: 'Apr 12', amount: '2,480 USD', done: true, icon: CreditCard },
									{ label: 'Receipt generated', date: 'Apr 12', done: false, icon: Receipt },
								]}
							/>
		</>
	);
}

export function ActivityStreamReadOnlyTracking() {
	return (
		<>
			<ActivityStreamCard
								items={[
									{ id: '1', icon: CheckCircle, iconVariant: 'success', actor: 'Sarah Smitha', action: 'paid invoice', target: '#INV-2026-0392', timestamp: '2 minutes ago' },
									{ id: '2', icon: ShoppingBag, iconVariant: 'primary', actor: 'Daniel Smith', action: 'placed order', target: '#ORD-2026-0413', timestamp: '15 minutes ago', metadata: [{ label: 'Items', value: '3' }, { label: 'Total', value: '370 USD' }] },
									{ id: '3', icon: Heart, iconVariant: 'warning', actor: 'Emma Garcia', action: 'favorited', target: 'Hot Air Balloon', timestamp: '1 hour ago' },
									{ id: '4', icon: AlertTriangle, iconVariant: 'error', action: 'Webhook failure on', target: 'shopify.payments.captured', timestamp: '3 hours ago' },
								]}
							/>
		</>
	);
}

export function Changelog() {
	return (
		<>
			<ChangelogTimelineCard
								entries={[
									{
										id: 'c1',
										kind: 'added',
										title: 'Voucher entry component',
										version: 'v2.4.0',
										timestamp: 'Apr 20',
										author: 'mp',
										description: 'New gift-card redemption surface; companion to coupon input.',
									},
									{
										id: 'c2',
										kind: 'fixed',
										title: 'Booking row dark-on-dark contrast',
										version: 'v2.3.4',
										timestamp: 'Apr 18',
										author: 'sp',
										description: 'Day numbers were invisible on the primary chip.',
									},
									{
										id: 'c3',
										kind: 'modified',
										title: 'InlineMetric typography rebalanced',
										version: 'v2.3.3',
										timestamp: 'Apr 16',
										author: 'em',
									},
									{
										id: 'c4',
										kind: 'removed',
										title: 'Legacy giftcardStatusMap',
										version: 'v2.3.0',
										timestamp: 'Apr 14',
										author: 'id',
										description: 'Use defaultGiftcardStrings.status + giftcardStatusVariant.',
									},
								]}
							/>
		</>
	);
}

export function Milestones() {
	return (
		<>
			<MilestonesTimelineCard
								milestones={[
									{
										id: 'm1',
										title: 'Phase A — cross-cutting infra',
										description: 'Strings helper, typography scale, conventions doc.',
										dueDate: 'Apr 28',
										status: 'completed',
									},
									{
										id: 'm2',
										title: 'Phase B — base primitives',
										description: 'Display, currency, forms, table, navigation, calendar.',
										dueDate: 'Apr 30',
										status: 'completed',
									},
									{
										id: 'm3',
										title: 'Phase C — composed redesign',
										description: 'Cards, charts, commerce, navigation, timelines, AI.',
										dueDate: 'May 4',
										status: 'in_progress',
										progress: 72,
									},
									{
										id: 'm4',
										title: 'Phase D — upload subsystem',
										description: 'Dropzone, AvatarUpload, MediaGallery, UploadProgressList.',
										dueDate: 'May 8',
										status: 'upcoming',
									},
									{
										id: 'm5',
										title: 'Public release v3.0',
										description: 'Tagged release, migration guide, codemod scripts.',
										dueDate: 'May 20',
										status: 'blocked',
									},
								]}
							/>
		</>
	);
}
