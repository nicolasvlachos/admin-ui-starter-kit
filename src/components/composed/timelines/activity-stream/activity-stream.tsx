/**
 * ActivityStreamCard — chronological list of icon + actor + action + target items
 * with optional inline metadata. Designed for audit logs / "what happened" feeds.
 */
import { Activity, Circle } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultActivityStreamStrings,
	type ActivityStreamCardProps,
} from './types';

const VARIANT_CLASSES: Record<string, string> = {
	primary: 'bg-primary/10 text-primary',
	secondary: 'bg-secondary text-secondary-foreground',
	success: 'bg-success/15 text-success',
	info: 'bg-info/15 text-info',
	warning: 'bg-warning/30 text-warning-foreground',
	error: 'bg-destructive/15 text-destructive',
};

export function ActivityStreamCard({ items, className, strings: stringsProp }: ActivityStreamCardProps) {
	const strings = useStrings(defaultActivityStreamStrings, stringsProp);

	if (items.length === 0) {
		return (
			<SmartCard icon={<Activity className="size-4" />} title={strings.title} className={cn('activity-stream--component', className)}>
				<Text type="secondary" align="center" className="py-6">{strings.empty}</Text>
			</SmartCard>
		);
	}

	return (
		<SmartCard icon={<Activity className="size-4" />} title={strings.title} className={className}>
			<ul className="space-y-3">
				{items.map((it, idx) => {
					const Icon = it.icon ?? Circle;
					const isLast = idx === items.length - 1;
					return (
						<li key={it.id} className="relative flex gap-3">
							<div className="relative flex flex-col items-center">
								<div className={cn('flex size-7 items-center justify-center rounded-full', VARIANT_CLASSES[it.iconVariant ?? 'primary'])}>
									<Icon className="size-3.5" />
								</div>
								{!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
							</div>
							<div className="min-w-0 flex-1 pb-3">
								<div className="flex flex-wrap items-baseline gap-x-1.5">
									{!!it.actor && <Text tag="span" weight="semibold">{it.actor}</Text>}
									<Text tag="span" type="secondary">{it.action}</Text>
									{!!it.target && <Text tag="span" weight="medium">{it.target}</Text>}
								</div>
								{!!it.metadata && it.metadata.length > 0 && (
									<div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
										{it.metadata.map((m) => (
											<Text key={m.label} size="xs" type="secondary">
												<Text tag="span" size="xs" type="discrete">{m.label}: </Text>
												{m.value}
											</Text>
										))}
									</div>
								)}
								<Text size="xxs" type="discrete" className="mt-0.5 tabular-nums">{it.timestamp}</Text>
							</div>
						</li>
					);
				})}
			</ul>
		</SmartCard>
	);
}

ActivityStreamCard.displayName = 'ActivityStreamCard';
