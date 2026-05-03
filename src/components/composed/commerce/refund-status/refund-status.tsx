/**
 * RefundStatusCard — refund-flow tracker. Shows the four canonical refund
 * stages (Requested → Approved → Processing → Completed) as a horizontal
 * progress bar, with refund amount as the lead figure and an optional reason
 * / method / ETA detail block. Strings overridable for i18n.
 */
import { Check, RotateCcw } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import Heading from '@/components/typography/heading';
import { InlineStat } from '@/components/base/display';
import { Separator } from '@/components/base/display/separator';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultRefundStatusStrings,
	type RefundStage,
	type RefundStatusCardProps,
} from './types';

const STAGE_ORDER: RefundStage[] = ['requested', 'approved', 'processing', 'completed'];

export function RefundStatusCard({
	stage,
	amount,
	reason,
	method,
	eta,
	requestedAt,
	className,
	strings: stringsProp,
}: RefundStatusCardProps) {
	const strings = useStrings(defaultRefundStatusStrings, stringsProp);
	const currentIdx = STAGE_ORDER.indexOf(stage);

	return (
		<SmartCard
			icon={<RotateCcw className="size-4" />}
			title={strings.title}
			className={cn('refund-status--component', className)}
		>
			<div className="rounded-lg bg-muted/40 px-4 py-3">
				<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">
					{strings.amount}
				</Text>
				<Heading tag="h3" className="text-3xl tabular-nums tracking-tight">
					{amount}
				</Heading>
				{!!requestedAt && (
					<Text size="xs" type="secondary" className="mt-0.5">
						{strings.requested}: {requestedAt}
					</Text>
				)}
			</div>

			{/* Stages */}
			<div className="mt-4 flex items-center justify-between">
				{STAGE_ORDER.map((s, i) => {
					const done = i <= currentIdx;
					const current = i === currentIdx;
					return (
						<div key={s} className="flex flex-1 flex-col items-center gap-1.5">
							<div className="flex w-full items-center">
								<div
									className={cn(
										'relative flex size-5 shrink-0 items-center justify-center rounded-full',
										done
											? 'bg-success text-success-foreground'
											: 'border border-border bg-card text-muted-foreground',
										current && 'ring-2 ring-success/30 ring-offset-2 ring-offset-background',
									)}
								>
									{done ? (
										<Check className="size-3" />
									) : (
										<Text tag="span" size="xxs" weight="medium" className="tabular-nums">{i + 1}</Text>
									)}
								</div>
								{i < STAGE_ORDER.length - 1 && (
									<div
										className={cn(
											'h-0.5 flex-1',
											i < currentIdx ? 'bg-success' : 'bg-border',
										)}
									/>
								)}
							</div>
							<Text
								size="xxs"
								weight={current ? 'semibold' : 'medium'}
								type={done ? 'main' : 'secondary'}
								className="text-center leading-tight"
							>
								{strings[s]}
							</Text>
						</div>
					);
				})}
			</div>

			{(reason || method || eta) && (
				<>
					<Separator className="my-4" />
					<div className="space-y-2">
						{!!reason && (
							<InlineStat label={strings.reason} value={reason} className="items-start" valueClassName="text-sm font-medium text-right" />
						)}
						{!!method && (
							<InlineStat label={strings.method} value={method} valueClassName="text-sm font-medium" />
						)}
						{!!eta && (
							<InlineStat label={strings.eta} value={eta} mono valueClassName="text-sm font-medium" />
						)}
					</div>
				</>
			)}
		</SmartCard>
	);
}

RefundStatusCard.displayName = 'RefundStatusCard';
