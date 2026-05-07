// @ts-nocheck
import {
	DenseInfoDashboard,
	DenseInfoClassification,
	DenseInfoFinancial,
	DenseInfoProjectCard,
	DenseInfoScoreCard,
} from '@/components/composed/data-display/dense-info-card';

export function Dashboard() {
	return (
		<>
			<DenseInfoDashboard
								title="Order Summary"
								statusBadges={[
									{ label: 'Confirmed', variant: 'success' },
									{ label: 'Priority: High', variant: 'warning' },
								]}
								rows={[
									{ label: 'Customer', value: 'Sarah Smitha' },
									{ label: 'Order Total', value: '2,450 USD' },
									{ label: 'Items', value: '3 vouchers' },
								]}
								scale={{ label: 'Complexity', value: 3, max: 5 }}
								footerText="Order #ORD-2026-0412"
							/>
		</>
	);
}

export function ScoreCard() {
	return (
		<>
			<DenseInfoScoreCard
								title="Business Score"
								statusBadges={[{ label: 'Excellent', variant: 'success' }]}
								score={714}
								scoreLevel="good"
								scoreFilled={7}
								scoreTotal={10}
								rows={[
									{ label: 'Payment History', value: 'Excellent' },
									{ label: 'Credit Utilization', value: '32%' },
									{ label: 'Account Age', value: '8 years' },
								]}
								footerBadges={[{ label: 'Next review: Jun 2026', variant: 'info' }]}
							/>
		</>
	);
}

export function Classification() {
	return (
		<>
			<DenseInfoClassification
								title="Product Categories"
								description="Distribution by type"
								stats={[
									{ label: 'Total', value: '354', trendBadge: '+12%', trendVariant: 'success' },
									{ label: 'Active', value: '298' },
									{ label: 'Avg. Price', value: '142 USD' },
								]}
								items={[
									{ label: 'Wellness & Spa', value: '124', dotColor: 'bg-chart-1', badge: 'Top', badgeVariant: 'success' },
									{ label: 'Food & Drink', value: '89', dotColor: 'bg-chart-4' },
									{ label: 'Adventure', value: '67', dotColor: 'bg-chart-2' },
								]}
								totalLabel="All Categories"
								totalValue="354"
							/>
		</>
	);
}

export function Financial() {
	return (
		<>
			<DenseInfoFinancial
								title="Q1 Financial Summary"
								headerBadges={[
									{ label: 'On Track', variant: 'success' },
									{ label: 'Q1 2026', variant: 'secondary' },
								]}
								lineItems={[
									{ label: 'Product Sales', amount: '89,400 USD', badge: 'Primary', badgeVariant: 'success' },
									{ label: 'Gift Card Revenue', amount: '22,100 USD' },
									{ label: 'Service Fees', amount: '8,500 USD' },
								]}
								totalLabel="Total Revenue"
								totalAmount="124,500 USD"
							/>
		</>
	);
}

export function ProjectCards() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-3">
								<DenseInfoProjectCard title="Website Redesign" description="Complete overhaul of the marketing site." statusLabel="In Progress" statusVariant="warning" date="Mar 15 — Jun 15" priority="High" completedTasks={12} totalTasks={20} />
								<DenseInfoProjectCard title="Mobile App v2.0" description="Native iOS and Android app." statusLabel="On Track" statusVariant="success" date="Jan 10 — Jul 10" priority="Critical" completedTasks={34} totalTasks={48} />
								<DenseInfoProjectCard title="API Documentation" description="OpenAPI spec and dev portal." statusLabel="Planning" statusVariant="info" date="Apr 1 — Apr 14" priority="Medium" completedTasks={0} totalTasks={8} />
							</div>
		</>
	);
}
