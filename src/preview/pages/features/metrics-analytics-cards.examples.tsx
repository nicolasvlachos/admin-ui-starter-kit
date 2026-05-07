// @ts-nocheck
import { MetricGradient, type MetricDataPoint } from '@/components/composed/analytics';

const data: MetricDataPoint[] = [
	{ label: 'Jan', value: 4200 }, { label: 'Feb', value: 3800 }, { label: 'Mar', value: 5100 },
	{ label: 'Apr', value: 4600 }, { label: 'May', value: 5800 }, { label: 'Jun', value: 6200 },
	{ label: 'Jul', value: 5900 }, { label: 'Aug', value: 7100 }, { label: 'Sep', value: 6800 },
	{ label: 'Oct', value: 7500 }, { label: 'Nov', value: 8200 }, { label: 'Dec', value: 9100 },
];

export function FourThemes() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								<MetricGradient
									title="Growth"
									value="32.4K"
									change={{ value: '15.2%', direction: 'up' }}
									data={data}
									theme="green"
									subtitle="vs last quarter"
								/>
								<MetricGradient
									title="Engagement"
									value="8,940"
									change={{ value: '4.7%', direction: 'up' }}
									data={data}
									theme="purple"
									subtitle="active users"
								/>
								<MetricGradient
									title="Conversions"
									value="4.8%"
									change={{ value: '0.3%', direction: 'down' }}
									data={data}
									theme="warm"
									subtitle="checkout rate"
								/>
								<MetricGradient
									title="Sessions"
									value="124K"
									change={{ value: '8.1%', direction: 'up' }}
									data={data}
									theme="ocean"
									subtitle="last 30 days"
								/>
							</div>
		</>
	);
}
