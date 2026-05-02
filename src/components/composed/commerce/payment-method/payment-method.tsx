/**
 * PaymentMethodCard — saved-card surface. The hero block is rendered as a
 * mini credit-card mock with a soft gradient, brand chip top-right, masked
 * PAN center, and holder + expiry on the bottom row. Trailing actions sit
 * in a footer below the mock so the hierarchy is "card → details → CTA".
 */
import { CreditCard } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { Badge } from '@/components/base/badge';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultPaymentMethodStrings, type PaymentBrand, type PaymentMethodCardProps } from './types';

const BRAND_LABEL: Record<PaymentBrand, string> = {
	visa: 'VISA',
	mastercard: 'MasterCard',
	amex: 'AMEX',
	paypal: 'PayPal',
	applepay: 'Apple Pay',
	googlepay: 'Google Pay',
	unknown: 'Card',
};

const BRAND_GRADIENT: Record<PaymentBrand, string> = {
	visa: 'from-blue-700 via-blue-800 to-indigo-900',
	mastercard: 'from-orange-600 via-rose-700 to-rose-900',
	amex: 'from-sky-600 via-cyan-700 to-cyan-900',
	paypal: 'from-blue-600 via-indigo-700 to-blue-900',
	applepay: 'from-zinc-700 via-zinc-800 to-zinc-950',
	googlepay: 'from-emerald-600 via-teal-700 to-teal-900',
	unknown: 'from-zinc-700 via-zinc-800 to-zinc-950',
};

export function PaymentMethodCard({
	brand,
	last4,
	expiry,
	holderName,
	isDefault,
	onChange,
	className,
	strings: stringsProp,
}: PaymentMethodCardProps) {
	const strings = useStrings(defaultPaymentMethodStrings, stringsProp);
	const brandLabel = BRAND_LABEL[brand];
	const gradient = BRAND_GRADIENT[brand];

	return (
		<SmartCard
			icon={<CreditCard className="size-4" />}
			title={strings.title}
			titleSuffix={isDefault ? <Badge variant="primary">{strings.default}</Badge> : null}
			className={className}
		>
			{/* Mini card mock */}
			<div
				className={cn(
					'relative flex flex-col gap-5 rounded-xl bg-gradient-to-br p-4 text-white shadow-md ring-1 ring-white/10 overflow-hidden',
					gradient,
				)}
			>
				{/* Decorative chip + glow */}
				<div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/[0.08] blur-xl" aria-hidden="true" />
				<div className="absolute -bottom-6 -left-6 size-24 rounded-full bg-white/[0.06] blur-lg" aria-hidden="true" />

				<div className="relative flex items-start justify-between">
					<div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-yellow-300/90 to-yellow-500/80 shadow-sm">
						<div className="size-4 rounded-sm border border-yellow-700/30 bg-yellow-200/60" />
					</div>
					<Text
						tag="span"
						weight="bold"
						className="rounded bg-white/15 px-2 py-0.5 tracking-[0.15em] text-white backdrop-blur-sm"
					>
						{brandLabel}
					</Text>
				</div>

				<div className="relative">
					<Text
						tag="span"
						size="lg"
						weight="semibold"
						className="block font-mono tracking-[0.25em] text-white"
					>
						•••• •••• •••• {last4}
					</Text>
				</div>

				<div className="relative flex items-end justify-between gap-3">
					<div className="min-w-0">
						{!!holderName && (
							<>
								<Text size="xxs" className="block uppercase tracking-wider text-white/60">{strings.cardHolder}</Text>
								<Text weight="semibold" className="truncate text-white">{holderName}</Text>
							</>
						)}
					</div>
					{!!expiry && (
						<div className="text-right shrink-0">
							<Text size="xxs" className="block uppercase tracking-wider text-white/60">{strings.expires}</Text>
							<Text tag="span" weight="semibold" className="tabular-nums text-white">{expiry}</Text>
						</div>
					)}
				</div>
			</div>

			{!!onChange && (
				<div className="mt-3 flex justify-end">
					<Button buttonStyle="ghost" variant="secondary" onClick={onChange}>
						{strings.change}
					</Button>
				</div>
			)}
		</SmartCard>
	);
}

PaymentMethodCard.displayName = 'PaymentMethodCard';
