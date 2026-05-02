import { SmartCard } from '@/components/base/cards/smart-card';
import { Badge } from '@/components/base/badge/badge';
import { Text } from '@/components/typography/text';
import { InlineStat } from '@/components/base/display';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
} from '@/components/base/item';
import { type DenseInfoFinancialProps } from '../types';

export function DenseInfoFinancial({
	title,
	description,
	headerBadges,
	lineItems,
	totalLabel = 'Total',
	totalAmount,
	footerBadges,
	footerText,
	actions,
	className,
}: DenseInfoFinancialProps) {
	return (
		<SmartCard
			title={title}
			description={description}
			actions={actions}
			className={className}
		>
			<div className="space-y-3">
				<div className="flex flex-wrap items-center gap-1.5">
					{headerBadges.map((b) => (
						<Badge
							key={b.label}
							variant={b.variant}
						>
							{b.label}
						</Badge>
					))}
				</div>

				<ItemGroup>
					{lineItems.map((item, idx) => (
						<div key={item.label}>
							{idx > 0 && <ItemSeparator className="my-0" />}
							<Item size="xs" className="px-0">
								<ItemContent>
									<ItemTitle className="gap-2">
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
										{item.amount}
									</Text>
								</ItemActions>
							</Item>
						</div>
					))}
				</ItemGroup>

				{!!totalAmount && (
					<InlineStat
						className="rounded-lg bg-muted/50 px-3 py-2.5"
						label={totalLabel}
						value={totalAmount}
						mono
						labelClassName="text-sm font-bold"
						valueClassName="text-base font-bold"
					/>
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

DenseInfoFinancial.displayName = 'DenseInfoFinancial';
