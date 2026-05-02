import { ActivityHeatmap, type ActivityHeatmapDay } from '@/components/composed/analytics';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

function generate(): ActivityHeatmapDay[] {
	const days: ActivityHeatmapDay[] = [];
	const now = new Date();
	for (let i = 89; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(d.getDate() - i);
		const r = Math.random();
		const level: 0 | 1 | 2 | 3 | 4 = r < 0.15 ? 0 : r < 0.35 ? 1 : r < 0.6 ? 2 : r < 0.8 ? 3 : 4;
		days.push({ date: d.toISOString().slice(0, 10), level });
	}
	return days;
}

const data = generate();

export default function MetricsHeatmapPage() {
	return (
		<PreviewPage title="Features · Metrics · Activity heatmap" description="`ActivityHeatmap` — GitHub-style daily-activity calendar with success-tinted intensity cells.">
			<PreviewSection title="Order Activity" span="full">
				<div className="max-w-2xl">
					<ActivityHeatmap title="Order Activity" description="Last 90 days" data={data} />
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
