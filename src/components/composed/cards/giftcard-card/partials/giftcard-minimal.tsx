/**
 * GiftcardCardMinimal — clean minimal layout. A small accent line (driven by
 * `color`) sits above the header icon + label, balance, code strip, and
 * metadata rows. Footer "View details" link uses an arrow affordance.
 * Strings overridable for i18n.
 */
import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { Badge } from '@/components/base/badge/badge';
import { Button } from '@/components/base/buttons';
import { InlineStat } from '@/components/base/display';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { Gift, Copy, ArrowRight } from 'lucide-react';
import {
	type AccentColor,
	type GiftcardCommonProps,
	type GiftcardData,
	accentColorMap,
	defaultGiftcardStrings,
	giftcardStatusVariant,
} from '../types';

export function GiftcardCardMinimal({
	code,
	amount,
	remainingAmount,
	status,
	recipientName,
	expiresAt,
	onView,
	color = 'green',
	className,
	strings: stringsProp,
}: GiftcardData & GiftcardCommonProps & { color?: AccentColor; className?: string }) {
	const strings = useStrings(defaultGiftcardStrings, stringsProp);
	const statusLabel = strings.status[status];
	const statusVariant = giftcardStatusVariant[status];
	const isPartiallyUsed = !!remainingAmount && remainingAmount !== amount;
	const displayAmount = isPartiallyUsed ? remainingAmount : amount;
	const accent = accentColorMap[color];

	return (
		<div
			className={cn(
				'w-full max-w-sm rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden',
				className,
			)}
		>
			<div className={cn('h-1 w-16 rounded-full mx-6 mt-5', accent.line)} />

			<Item size="xs" className="px-6 pt-4 pb-2">
				<ItemMedia>
					<div
						className={cn(
							'flex h-8 w-8 items-center justify-center rounded-full',
							accent.iconBg,
						)}
					>
						<Gift className="h-4 w-4" />
					</div>
				</ItemMedia>
				<ItemContent>
					<ItemTitle bold={false} className="text-muted-foreground">{strings.giftCard}</ItemTitle>
				</ItemContent>
				<ItemActions>
					<Badge variant={statusVariant}>{statusLabel}</Badge>
				</ItemActions>
			</Item>

			<div className="px-6 pt-2 pb-3">
				<div className="flex items-baseline gap-2">
					<Heading tag="h2" className="text-3xl border-none pb-0 tabular-nums">
						{displayAmount}
					</Heading>
					{!!isPartiallyUsed && (
						<Text type="discrete" className="line-through tabular-nums">
							{amount}
						</Text>
					)}
				</div>
			</div>

			<div className="mx-6 flex items-center gap-2 rounded-lg bg-muted/50 px-3.5 py-2.5 border border-border/30">
				<Text weight="medium" className="font-mono tracking-[0.15em] flex-1">
					{code}
				</Text>
				<Button
					variant="secondary"
					buttonStyle="ghost"
					size="icon-sm"
					className="shrink-0"
					aria-label={strings.copyCode}
				>
					<Copy className="h-3.5 w-3.5" />
				</Button>
			</div>

			<div className="px-6 pt-4 pb-2 space-y-2.5">
				{!!recipientName && (
					<InlineStat label={strings.recipient} value={recipientName} valueClassName="text-sm font-medium" />
				)}
				{!!expiresAt && (
					<InlineStat label={strings.expires} value={expiresAt} valueClassName="text-sm font-medium" />
				)}
			</div>

			{!!onView && (
				<div className="px-3 py-2 border-t border-border/30 mt-2">
					<Button
						variant="secondary"
						buttonStyle="ghost"
						onClick={onView}
						className="group/link"
					>
						{strings.viewDetails}
						<ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
					</Button>
				</div>
			)}
		</div>
	);
}

GiftcardCardMinimal.displayName = 'GiftcardCardMinimal';
