/**
 * SubscriptionSummaryCard — at-a-glance subscription card with the active
 * plan name as the hero heading, an inline price + cycle, the next billing
 * date in a meta row, an optional perks list, and trailing
 * Manage / Upgrade actions. Strings overridable for i18n.
 */
import { Calendar, Check, ChevronRight, Repeat } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import { IconBadge } from '@/components/base/display';
import {
	Item,
	ItemContent,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';

import {
	defaultSubscriptionSummaryStrings,
	type SubscriptionSummaryCardProps,
} from './types';

import { cn } from '@/lib/utils';
export function SubscriptionSummaryCard({
	planName,
	priceLabel,
	cycleLabel,
	nextBillingDate,
	statusLabel,
	perks = [],
	onManage,
	onUpgrade,
	className,
	strings: stringsProp,
}: SubscriptionSummaryCardProps) {
	const strings = useStrings(defaultSubscriptionSummaryStrings, stringsProp);

	return (
		<SmartCard
			icon={<Repeat className="size-4" />}
			title={strings.title}
			headerEnd={statusLabel ? <Badge variant="success">{statusLabel}</Badge> : null}
			className={cn('subscription-summary--component', className)}
		>
			<div className="rounded-lg border border-border/60 bg-muted/30 p-4">
				<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">
					{strings.plan}
				</Text>
				<Heading tag="h3" className="mt-1 text-xl font-semibold tracking-tight border-none pb-0">
					{planName}
				</Heading>
				<div className="mt-1 flex items-baseline gap-1">
					<Text tag="span" size="xl" weight="bold" className="tabular-nums">
						{priceLabel}
					</Text>
					<Text type="secondary">
						{cycleLabel}
					</Text>
				</div>
			</div>

			<div className="mt-3 flex items-center justify-between rounded-md bg-card px-1">
				<div className="flex items-center gap-2">
					<Calendar className="size-3.5 text-muted-foreground" />
					<Text size="xs" type="secondary">{strings.nextBilling}</Text>
				</div>
				<Text size="xs" weight="semibold" className="tabular-nums">{nextBillingDate}</Text>
			</div>

			{perks.length > 0 && (
				<div className="mt-4 space-y-2">
					<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">
						{strings.perks}
					</Text>
					<ItemGroup>
						{perks.map((perk, i) => {
							const Icon = perk.icon ?? Check;
							return (
								<Item key={`${perk.label}-${i}`} size="xs" className="px-0">
									<ItemMedia>
										<IconBadge icon={Icon} tone="success" size="xs" />
									</ItemMedia>
									<ItemContent>
										<ItemTitle bold={false}>{perk.label}</ItemTitle>
									</ItemContent>
								</Item>
							);
						})}
					</ItemGroup>
				</div>
			)}

			{(onManage || onUpgrade) && (
				<div className="mt-4 flex items-center gap-2">
					{!!onManage && (
						<Button
							variant="secondary"
							buttonStyle="outline"
							onClick={onManage}
							className="flex-1"
						>
							{strings.manage}
						</Button>
					)}
					{!!onUpgrade && (
						<Button
							variant="primary"
							onClick={onUpgrade}
							className="flex-1"
						>
							{strings.upgrade}
							<ChevronRight className="ml-1 size-3.5" />
						</Button>
					)}
				</div>
			)}
		</SmartCard>
	);
}

SubscriptionSummaryCard.displayName = 'SubscriptionSummaryCard';
