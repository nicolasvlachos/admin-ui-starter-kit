// @ts-nocheck
import { InlineMetricBadge } from '@/components/composed/data-display/inline-metric';

export function MixedSizesDirections() {
	return (
		<>
			<InlineMetricBadge
								metrics={[
									{ label: 'Revenue', value: '52.3K', change: '+12%', up: true, size: 'md' },
									{ label: 'Orders', value: '1,284', change: '+8%', up: true, size: 'md' },
									{ label: 'Returns', value: '23', change: '-5%', up: false, size: 'sm' },
									{ label: 'AOV', value: '351 USD', change: '+3%', up: true, size: 'lg' },
								]}
							/>
		</>
	);
}
