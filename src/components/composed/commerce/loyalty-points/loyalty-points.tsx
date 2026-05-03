/**
 * LoyaltyPointsCard — current balance, tier badge, recent history rows
 * (label / date / signed-points), and a redemption CTA. Strings overridable
 * for i18n.
 */
import { Badge } from '@/components/base/badge/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards/smart-card';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { Gift, Trophy } from 'lucide-react';

import { defaultLoyaltyPointsStrings, type LoyaltyPointsCardProps } from './types';

export function LoyaltyPointsCard({
	balance,
	tier = 'Gold Tier',
	tierVariant: _tierVariant,
	history = [],
	redeemLabel,
	onRedeem,
	className,
	strings: stringsProp,
}: LoyaltyPointsCardProps) {
	const strings = useStrings(defaultLoyaltyPointsStrings, {
		...(redeemLabel !== undefined ? { redeem: redeemLabel } : {}),
		...stringsProp,
	});
	return (
		<SmartCard className={cn('loyalty-points--component', className)}>
			<InlineStat
				label={strings.balanceLabel}
				value={
					<Badge variant="warning">
						<Trophy className="mr-1 inline size-3" />
						{tier}
					</Badge>
				}
				labelClassName="text-xs font-medium uppercase tracking-wider text-muted-foreground"
			/>

			<Heading tag="h3" className="text-4xl tabular-nums tracking-tight">
				{typeof balance === 'number' ? balance.toLocaleString() : balance}
			</Heading>
			<Text size="xs" type="secondary">
				{strings.pointsAvailable}
			</Text>

			<Separator className="my-4" />

			<ItemGroup>
				{history.map((entry) => (
					<Item key={entry.date + entry.label} size="xs" className="px-0">
						<ItemContent>
							<ItemTitle bold={false}>{entry.label}</ItemTitle>
							<ItemDescription clamp={1}>{entry.date}</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Text
								weight="semibold"
								className={cn(
									'tabular-nums',
									entry.positive ? 'text-success' : 'text-destructive',
								)}
							>
								{entry.points}
							</Text>
						</ItemActions>
					</Item>
				))}
			</ItemGroup>

			<Button
				variant="dark"
				className="mt-5 w-full rounded-full"
				onClick={onRedeem}
			>
				<Gift className="mr-1.5 size-3.5" />
				{strings.redeem}
			</Button>
		</SmartCard>
	);
}

LoyaltyPointsCard.displayName = 'LoyaltyPointsCard';
