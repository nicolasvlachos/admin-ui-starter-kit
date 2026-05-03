/**
 * MiniKpiRow — inline divider-separated KPI strip. Each item shows a value
 * (sm semibold) and a tiny secondary label below. Use as a header / footer
 * accent on dashboards where a full StatCard grid would be too heavy.
 */
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';

import type { MiniKpiRowProps } from './types';

const glass = 'ring-1 ring-border/50 shadow-sm';

export function MiniKpiRow({ kpis, className }: MiniKpiRowProps) {
    return (
        <div className={cn('mini-kpi--component', 'inline-flex items-center divide-x divide-border/50 rounded-xl bg-card px-2 py-2', glass, className)}>
            {kpis.map((kpi) => (
                <div key={kpi.label} className="flex flex-col items-center px-4">
                    <Text weight="bold" className="tabular-nums">
                        {kpi.value}
                    </Text>
                    <Text size="xs" type="secondary" className="text-xxs">
                        {kpi.label}
                    </Text>
                </div>
            ))}
        </div>
    );
}

MiniKpiRow.displayName = 'MiniKpiRow';
