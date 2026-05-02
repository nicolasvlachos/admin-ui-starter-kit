/**
 * GiftcardCardDark — premium dark variant. Header with chart-2 gift icon,
 * status chip, balance + strike-through line, code strip, metadata rows
 * (recipient / expires), and an outline call-to-action footer. Strings
 * overridable for i18n.
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
import { Gift, Copy, Eye } from 'lucide-react';
import {
	type GiftcardCommonProps,
	type GiftcardData,
	defaultGiftcardStrings,
	giftcardStatusVariant,
} from '../types';

export function GiftcardCardDark({
	code,
	amount,
	remainingAmount,
	status,
	recipientName,
	expiresAt,
	onView,
	className,
	strings: stringsProp,
}: GiftcardData & GiftcardCommonProps & { className?: string }) {
	const strings = useStrings(defaultGiftcardStrings, stringsProp);
	const statusLabel = strings.status[status];
	const statusVariant = giftcardStatusVariant[status];
	const isPartiallyUsed = !!remainingAmount && remainingAmount !== amount;
	const displayAmount = isPartiallyUsed ? remainingAmount : amount;

	return (
		<div
			className={cn(
				'dark w-full max-w-sm rounded-2xl bg-card text-card-foreground overflow-hidden shadow-lg ring-1 ring-border',
				className,
			)}
		>
			<Item size="xs" className="px-6 pt-6 pb-2">
				<ItemMedia>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/15">
						<Gift className="h-4 w-4 text-warning" />
					</div>
				</ItemMedia>
				<ItemContent>
					<ItemTitle bold={false} className="text-muted-foreground">{strings.giftCard}</ItemTitle>
				</ItemContent>
				<ItemActions>
					<Badge variant={statusVariant}>{statusLabel}</Badge>
				</ItemActions>
			</Item>

			{/* Amount */}
			<div className="px-6 pt-4 pb-4">
				<div className="flex items-baseline gap-2">
					<Heading tag="h2" className="text-4xl border-none pb-0 tabular-nums">
						{displayAmount}
					</Heading>
					{!!isPartiallyUsed && (
						<Text type="discrete" className="line-through tabular-nums">
							{amount}
						</Text>
					)}
				</div>
			</div>

			{/* Code strip */}
			<div className="mx-6 flex items-center gap-2 rounded-lg bg-muted px-3.5 py-2.5 border border-border">
				<Text weight="medium" className="font-mono tracking-[0.15em] flex-1">
					{code}
				</Text>
				<Button
					variant="secondary"
					buttonStyle="ghost"
					onClick={() => {}}
					className="p-1 h-auto"
					aria-label={strings.copyCode}
				>
					<Copy className="h-3.5 w-3.5" />
				</Button>
			</div>

			{/* Metadata rows */}
			<div className="px-6 pt-4 pb-2 space-y-2.5">
				{!!recipientName && (
					<InlineStat label={strings.recipient} value={recipientName} valueClassName="text-sm font-medium" />
				)}
				{!!expiresAt && (
					<InlineStat label={strings.expires} value={expiresAt} valueClassName="text-sm font-medium" />
				)}
			</div>

			{/* Footer — solid white-ish button on the dark surface
			    so the label always reads (outline-on-dark with the
			    warning text token blended into the dark card and
			    looked invisible). */}
			{!!onView && (
				<div className="px-6 pt-2 pb-5">
					<Button
						variant="light"
						buttonStyle="solid"
						icon={Eye}
						fullWidth
						onClick={onView}
						className="bg-white text-zinc-900 hover:bg-white/90 hover:text-zinc-900"
					>
						{strings.viewDetails}
					</Button>
				</div>
			)}
		</div>
	);
}

GiftcardCardDark.displayName = 'GiftcardCardDark';
