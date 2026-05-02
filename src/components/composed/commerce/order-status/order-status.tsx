/**
 * OrderStatusCard — order number + status badge + horizontal step ribbon
 * (each step shows its label, optional timestamp, and a connector line to
 * the next step). Ideal for dashboards / receipt summaries. Strings
 * overridable for i18n.
 */
import { Package, Check } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { Badge } from '@/components/base/badge';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultOrderStatusStrings,
	type OrderStatusCardProps,
	type OrderStatusKind,
} from './types';

const VARIANT_BY_STATUS: Record<OrderStatusKind, 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary'> = {
	pending: 'warning',
	paid: 'info',
	fulfilled: 'info',
	shipped: 'primary',
	delivered: 'success',
	cancelled: 'error',
};

export function OrderStatusCard({
	orderNumber,
	status,
	statusVariant,
	events,
	currentEta,
	className,
	strings: stringsProp,
}: OrderStatusCardProps) {
	const strings = useStrings(defaultOrderStatusStrings, stringsProp);
	const variant = statusVariant ?? VARIANT_BY_STATUS[status];
	const lastCompleteIdx = events.reduce((acc, e, i) => (e.complete ? i : acc), -1);

	return (
		<SmartCard
			icon={<Package className="size-4" />}
			title={strings.title}
			titleSuffix={<Badge variant={variant} className="capitalize">{status}</Badge>}
			description={`#${orderNumber}`}
			className={className}
		>
			<div className="overflow-x-auto pb-1">
				<div className="flex min-w-full items-start">
					{events.map((e, i) => {
						const isLast = i === events.length - 1;
						const connectorActive = i < lastCompleteIdx;
						const isCurrent = i === lastCompleteIdx + 1 || (e.complete && i === lastCompleteIdx);
						return (
							<div key={`${e.label}-${i}`} className="flex flex-1 flex-col items-center gap-1.5">
								{/* Dot + connector row */}
								<div className="relative flex w-full items-center">
									{/* leading half-line */}
									{i > 0 && (
										<div
											className={cn(
												'h-0.5 flex-1',
												i <= lastCompleteIdx ? 'bg-success' : 'bg-border',
											)}
										/>
									)}
									{i === 0 && <div className="flex-1" aria-hidden="true" />}
									<div
										className={cn(
											'relative flex size-6 shrink-0 items-center justify-center rounded-full',
											e.complete
												? 'bg-success text-success-foreground'
												: 'border-2 border-border bg-card text-muted-foreground',
											isCurrent && !e.complete && 'border-primary text-primary',
										)}
									>
										{e.complete ? (
											<Check className="size-3.5" strokeWidth={2.5} />
										) : (
											<span className="size-1.5 rounded-full bg-current" />
										)}
									</div>
									{/* trailing half-line */}
									{!isLast ? (
										<div
											className={cn(
												'h-0.5 flex-1',
												connectorActive ? 'bg-success' : 'bg-border',
											)}
										/>
									) : (
										<div className="flex-1" aria-hidden="true" />
									)}
								</div>
								<Text
									size="xxs"
									weight={e.complete || isCurrent ? 'semibold' : 'medium'}
									className={cn(
										'whitespace-nowrap text-center',
										!e.complete && !isCurrent && 'text-muted-foreground',
									)}
								>
									{e.label}
								</Text>
								{!!e.timestamp && (
									<Text size="xxs" type="discrete" className="tabular-nums">{e.timestamp}</Text>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{!!currentEta && (
				<div className="mt-3 flex items-center justify-between rounded-lg border border-border/50 bg-primary/5 px-3 py-2">
					<Text size="xs" type="secondary" weight="medium" className="uppercase tracking-wider">{strings.eta}</Text>
					<Text tag="span" weight="semibold">{currentEta}</Text>
				</div>
			)}
		</SmartCard>
	);
}

OrderStatusCard.displayName = 'OrderStatusCard';
