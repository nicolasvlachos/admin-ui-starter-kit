import { SmartCard } from '@/components/base/cards/smart-card';
import { Badge } from '@/components/base/badge/badge';
import { Text } from '@/components/typography/text';
import { Separator } from '@/components/base/display/separator';
import { type DenseInfoDashboardProps } from '../types';
import { KVRow, ScaleBar } from '../helpers';

export function DenseInfoDashboard({
	title,
	description,
	statusBadges,
	rows,
	secondaryRows,
	scale,
	footerBadges,
	footerText,
	actions,
	className,
}: DenseInfoDashboardProps) {
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

				<div className="space-y-2">
					{rows.map((row) => (
						<KVRow
							key={row.label}
							{...row}
						/>
					))}
				</div>

				{!!scale && (
					<div className="flex items-center justify-between">
						<Text
							size="xs"
							className="text-muted-foreground"
						>
							{scale.label}
						</Text>
						<ScaleBar
							value={scale.value}
							max={scale.max}
							label={`${String(scale.value)}/${String(scale.max ?? 5)}`}
						/>
					</div>
				)}

				{!!secondaryRows && secondaryRows.length > 0 && (
					<>
						<Separator />
						<div className="space-y-2">
							{secondaryRows.map((row) => (
								<KVRow
									key={row.label}
									{...row}
								/>
							))}
						</div>
					</>
				)}

				{(!!footerBadges || !!footerText) && (
					<div className="flex flex-wrap items-center gap-2 border-t pt-2">
						{!!footerBadges &&
							footerBadges.map((b) => (
								<Badge
									key={b.label}
									variant={b.variant}
									className="text-xxs"
								>
									{b.label}
								</Badge>
							))}
						{!!footerText && (
							<Text
								size="xs"
								className="text-muted-foreground"
							>
								{footerText}
							</Text>
						)}
					</div>
				)}
			</div>
		</SmartCard>
	);
}

DenseInfoDashboard.displayName = 'DenseInfoDashboard';
