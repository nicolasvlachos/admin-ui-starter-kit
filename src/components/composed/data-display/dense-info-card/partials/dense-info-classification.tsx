import { SmartCard } from '@/components/base/cards/smart-card';
import { Badge } from '@/components/base/badge/badge';
import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { cn } from '@/lib/utils';
import { type DenseInfoClassificationProps } from '../types';

export function DenseInfoClassification({
	title,
	description,
	stats,
	items,
	totalLabel,
	totalValue,
	footerBadges,
	footerText,
	actions,
	className,
}: DenseInfoClassificationProps) {
	return (
		<SmartCard
			title={title}
			description={description}
			actions={actions}
			className={className}
		>
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-center"
						>
							<Heading tag="h4" className="text-lg font-bold tabular-nums border-none pb-0">
								{stat.value}
							</Heading>
							<Text size="xxs" type="secondary" weight="medium" className="mt-0.5">
								{stat.label}
							</Text>
							{!!stat.trendBadge && (
								<div className="mt-1">
									<Badge variant={stat.trendVariant ?? 'secondary'}>
										{stat.trendBadge}
									</Badge>
								</div>
							)}
						</div>
					))}
				</div>

				<Separator />

				<ItemGroup>
					{items.map((item) => (
						<Item key={item.label} size="xs" className="px-0">
							<ItemMedia>
								<span className={cn('h-2 w-2 shrink-0 rounded-full', item.dotColor)} />
							</ItemMedia>
							<ItemContent>
								<ItemTitle bold={false} className="gap-2">
									{item.label}
									{!!item.badge && (
										<Badge variant={item.badgeVariant ?? 'secondary'}>
											{item.badge}
										</Badge>
									)}
								</ItemTitle>
							</ItemContent>
							<ItemActions>
								<Text size="xs" weight="semibold" className="tabular-nums">
									{item.value}
								</Text>
							</ItemActions>
						</Item>
					))}
				</ItemGroup>

				{!!totalValue && (
					<>
						<Separator />
						<InlineStat
							label={totalLabel ?? 'Total'}
							value={totalValue}
							mono
							labelClassName="text-sm font-bold"
							valueClassName="text-sm font-bold"
						/>
					</>
				)}

				{(!!footerBadges || !!footerText) && (
					<div className="flex flex-wrap items-center gap-2 border-t pt-2">
						{!!footerBadges && footerBadges.map((b) => (
							<Badge key={b.label} variant={b.variant} className="text-xxs">
								{b.label}
							</Badge>
						))}
						{!!footerText && (
							<Text size="xs" className="text-muted-foreground">
								{footerText}
							</Text>
						)}
					</div>
				)}
			</div>
		</SmartCard>
	);
}

DenseInfoClassification.displayName = 'DenseInfoClassification';
