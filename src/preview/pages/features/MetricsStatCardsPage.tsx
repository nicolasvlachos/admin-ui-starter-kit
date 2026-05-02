import { Metric, type MetricData } from '@/components/composed/analytics';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

const UP = [12, 18, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];
const DOWN = [40, 38, 35, 30, 28, 25, 22, 20, 18, 15, 12, 10];

const sales: MetricData = {
	id: 'sales',
	label: 'Total Sales',
	value: '52,340 USD',
	change: { value: '8.2%', direction: 'up' },
	subtitle: 'vs. last month',
	sparkline: UP,
};

const refunds: MetricData = {
	id: 'refunds',
	label: 'Refunds',
	value: '1,230 USD',
	change: { value: '15.4%', direction: 'down' },
	subtitle: '3 refunds',
	sparkline: DOWN,
	trend: 'negative',
};

const COLORED: { data: MetricData; scheme: 'primary' | 'success' | 'warning' | 'info'; progress: number }[] = [
	{ data: { id: 'rev', label: 'Revenue', value: '124.5K', subtitle: 'Projects', change: { value: '12.5%', direction: 'up' } }, scheme: 'primary', progress: 75 },
	{ data: { id: 'done', label: 'Completed', value: '892', subtitle: 'Tasks', change: { value: '5.3%', direction: 'up' } }, scheme: 'success', progress: 88 },
	{ data: { id: 'pend', label: 'Pending', value: '34', subtitle: 'Reviews', change: { value: '0%', direction: 'neutral' } }, scheme: 'warning', progress: 42 },
	{ data: { id: 'visits', label: 'Visits', value: '18.4K', subtitle: 'This week', change: { value: '2.1%', direction: 'down' } }, scheme: 'info', progress: 60 },
];

export default function StatCardsPage() {
	return (
		<PreviewPage
			title="Features · Metrics · Stat cards"
			description="Two stat tile flavors built from the unified `Metric` component — `accent` (dark surface + sparkline) and `colored` (segmented progress bar)."
		>
			<PreviewSection title="Metric · accent" span="full" description="Dark card with bottom-aligned area sparkline. Use for hero rows.">
				<div className="grid gap-4 md:grid-cols-2">
					<Metric data={sales} variant="accent" />
					<Metric data={refunds} variant="accent" />
				</div>
			</PreviewSection>

			<PreviewSection title="Metric · colored" span="full" description="Segmented progress bar driven by `progress` (0–100). Pair with `colorScheme`.">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{COLORED.map(({ data, scheme, progress }) => (
						<Metric key={data.id} data={data} variant="colored" colorScheme={scheme} progress={progress} />
					))}
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
