/**
 * CouponInputCard — promo / coupon code entry with an applied state and
 * inline error messaging.
 *
 * Empty state — leading-icon input + apply button, helper line for
 * placeholders or errors. Applied state — success-tinted row with a check
 * medallion, monospaced code, discount delta, and a destructive remove icon.
 */
import { useState } from 'react';
import { Check, Sparkles, TicketPercent, X } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Button } from '@/components/base/buttons';
import { IconBadge } from '@/components/base/display';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { Text } from '@/components/typography';
import { Input } from '@/components/base/forms/fields';
import { useStrings } from '@/lib/strings';

import { defaultCouponInputStrings, type CouponInputCardProps } from './types';

const stripLeadingMinus = (value: string): string => value.replace(/^[\s−-]+/, '');

export function CouponInputCard({
	appliedCode,
	appliedDiscount,
	error,
	onApply,
	onRemove,
	loading,
	className,
	strings: stringsProp,
}: CouponInputCardProps) {
	const strings = useStrings(defaultCouponInputStrings, stringsProp);
	const [code, setCode] = useState('');

	if (appliedCode) {
		return (
			<SmartCard icon={<TicketPercent className="size-4" />} title={strings.title} className={className}>
				<Item variant="muted" className="border border-success/30 bg-success/8">
					<ItemMedia>
						<IconBadge icon={Check} tone="success" size="md" className="ring-1 ring-success/20" />
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="font-mono tracking-wider">{appliedCode}</ItemTitle>
						<ItemDescription className="uppercase tracking-wide" clamp={1}>
							{strings.applied}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						{!!appliedDiscount && (
							<Text
								tag="span"
								size="base"
								weight="semibold"
								type="success"
								className="tabular-nums shrink-0"
							>
								−{stripLeadingMinus(appliedDiscount)}
							</Text>
						)}
						{!!onRemove && (
							<Button
								type="button"
								variant="error"
								buttonStyle="ghost"
								size="icon-xs"
								onClick={onRemove}
								aria-label={strings.remove}
								className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
							>
								<X className="size-3.5" />
							</Button>
						)}
					</ItemActions>
				</Item>
			</SmartCard>
		);
	}

	return (
		<SmartCard icon={<TicketPercent className="size-4" />} title={strings.title} className={className}>
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<Input
						value={code}
						onChange={(e) => setCode((e.target as HTMLInputElement).value)}
						placeholder={strings.placeholder}
						startIcon={Sparkles}
						className="flex-1 font-mono uppercase tracking-wider"
						invalid={Boolean(error)}
					/>
					<Button onClick={() => onApply?.(code)} loading={loading} disabled={!code.trim()}>
						{strings.apply}
					</Button>
				</div>
				{!!error && (
					<Text size="xs" type="error">{error || strings.invalid}</Text>
				)}
			</div>
		</SmartCard>
	);
}

CouponInputCard.displayName = 'CouponInputCard';
