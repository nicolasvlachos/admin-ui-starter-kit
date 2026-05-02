import { SmartCard } from '@/components/base/cards/smart-card';
import { Badge } from '@/components/base/badge/badge';
import Heading from '@/components/typography/heading';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import { cn } from '@/lib/utils';
import { type DenseInfoScoreCardProps } from '../types';

export function DenseInfoScoreCard({
	title,
	description,
	statusBadges,
	score,
	scoreLevel,
	scoreFilled,
	scoreTotal = 10,
	rows,
	footerBadges,
	actions,
	className,
}: DenseInfoScoreCardProps) {
	const barColor =
		scoreLevel === 'good'
			? 'bg-success'
			: scoreLevel === 'medium'
				? 'bg-warning'
				: 'bg-destructive';

	return (
		<SmartCard
			title={title}
			description={description}
			actions={actions}
			className={className}
		>
			<div className="space-y-3">
				<div className="flex flex-wrap items-center gap-1.5">
					{statusBadges.map((b) => (
						<Badge
							key={b.label}
							variant={b.variant}
						>
							{b.label}
						</Badge>
					))}
				</div>

				<div className="flex items-center justify-center py-2">
					<Heading
						tag="h2"
						className="text-4xl font-bold tabular-nums border-none pb-0"
					>
						{String(score)}
					</Heading>
				</div>

				<div className="flex items-center justify-center gap-1">
					{Array.from({ length: scoreTotal }, (_, i) => (
						<div
							key={i}
							className={cn(
								'h-5 w-2 rounded-sm',
								i < scoreFilled ? barColor : 'bg-muted',
							)}
						/>
					))}
				</div>

				<Separator />

				<div className="space-y-2">
					{rows.map((row) => (
						<InlineStat
							key={row.label}
							label={row.label}
							value={row.value}
							mono
							labelClassName="text-xs text-muted-foreground"
							valueClassName="text-sm font-semibold text-right"
						/>
					))}
				</div>

				{!!footerBadges && footerBadges.length > 0 && (
					<div className="flex flex-wrap items-center gap-2 border-t pt-2">
						{footerBadges.map((b) => (
							<Badge
								key={b.label}
								variant={b.variant}
								className="text-xxs"
							>
								{b.label}
							</Badge>
						))}
					</div>
				)}
			</div>
		</SmartCard>
	);
}

DenseInfoScoreCard.displayName = 'DenseInfoScoreCard';
