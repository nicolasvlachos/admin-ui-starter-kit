import { Heart, Star, Sparkles, Zap } from 'lucide-react';
import {
	KanbanMicroBoard,
	TabSwitcherCard,
	TimeDistributionRuler,
	VendorPerformanceCard,
	ExperienceActivityCard,
} from '@/components/composed/navigation';
import { SmartCard } from '@/components/base/cards';

export function KanbanMicroBoardExample() {
	return (
		<>
			<KanbanMicroBoard
								columns={[
									{ title: 'Draft', items: [{ title: 'Spa Package v2', color: 'chart-4' }, { title: 'Wine Tour', color: 'chart-3' }] },
									{ title: 'Active', items: [{ title: 'Cooking Class', color: 'chart-1' }, { title: 'Paragliding', color: 'chart-1' }] },
									{ title: 'Review', items: [{ title: 'Horse Riding', color: 'chart-3' }] },
									{ title: 'Done', items: [{ title: 'Balloon Ride', color: 'chart-1' }, { title: 'Photo Tour', color: 'chart-1' }] },
								]}
							/>
		</>
	);
}

export function TabSwitcherCardExample() {
	return (
		<>
			<TabSwitcherCard
								title="Gift Cards"
								tabs={{
									recent: [
										{ name: 'Luxury Spa Voucher', value: '150 USD', icon: Heart },
										{ name: 'Adventure Day Pass', value: '85 USD', icon: Zap },
									],
									popular: [
										{ name: 'Wine Tasting for Two', value: '95 USD', icon: Star },
										{ name: 'Hot Air Balloon', value: '280 USD', icon: Sparkles },
									],
								}}
							/>
		</>
	);
}

export function TimeDistributionRulerExample() {
	return (
		<>
			<SmartCard title="Booking Density Today">
								<TimeDistributionRuler hours={[0, 0, 0, 0, 0, 0, 1, 3, 8, 12, 15, 10, 14, 11, 16, 18, 12, 8, 5, 3, 2, 1, 0, 0]} currentHour={14} />
							</SmartCard>
		</>
	);
}

export function VendorPerformance() {
	return (
		<>
			<VendorPerformanceCard
								vendorName="Spa Retreat New York"
								rating={5}
								metrics={{ bookings: 342, revenue: '89,200 USD', avgRating: 4.8, responseTime: '1.2 hrs' }}
								performanceScore={94}
								lastActive="2 hours ago"
								joinedDate="Jan 2023"
							/>
		</>
	);
}

export function ExperienceActivity() {
	return (
		<>
			<ExperienceActivityCard
								completed={2}
								total={5}
								activities={[
									{ icon: Heart, title: 'Couples Spa Day', time: 'Mar 25, 14:00', metrics: [{ label: 'Duration', value: '3h' }, { label: 'Value', value: '180 USD' }, { label: 'Bookings', value: '12' }, { label: 'Score', value: '9.4' }] },
									{ icon: Star, title: 'Wine & Dine Tour', time: 'Mar 24, 18:30', metrics: [{ label: 'Duration', value: '4h' }, { label: 'Value', value: '220 USD' }] },
								]}
								onAdd={() => {}}
							/>
		</>
	);
}
