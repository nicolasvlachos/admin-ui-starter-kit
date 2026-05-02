/**
 * DiscountStackPreview — list of applied discounts (type chip + label +
 * amount) with a total-savings summary line. Strings overridable for i18n.
 */
import { Badge } from '@/components/base/badge/badge';
import { SmartCard } from '@/components/base/cards/smart-card';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
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
import { useStrings } from '@/lib/strings';

import { defaultDiscountStackStrings, type DiscountStackPreviewProps } from './types';

export function DiscountStackPreview({
	discounts,
	totalSavings,
	className,
	strings: stringsProp,
}: DiscountStackPreviewProps) {
	const strings = useStrings(defaultDiscountStackStrings, stringsProp);
	return (
		<SmartCard title={strings.title} className={className}>
			<ItemGroup className="mt-4">
				{discounts.map((d) => (
					<Item key={d.type} size="xs" className="px-0">
						<ItemMedia>
							<Badge variant={d.badge} className="w-16 justify-center text-xxs">
								{d.type}
							</Badge>
						</ItemMedia>
						<ItemContent>
							<ItemTitle bold={false}>{d.label}</ItemTitle>
						</ItemContent>
						<ItemActions>
							<Text weight="semibold" className="tabular-nums text-success">
								{d.amount}
							</Text>
						</ItemActions>
					</Item>
				))}
			</ItemGroup>

			<Separator className="my-4" />

			<InlineStat
				label={strings.totalSavings}
				value={
					<Heading tag="h4" className="text-xl tabular-nums tracking-tight text-success border-none pb-0">
						{totalSavings}
					</Heading>
				}
				labelClassName="text-sm font-semibold"
			/>
		</SmartCard>
	);
}

DiscountStackPreview.displayName = 'DiscountStackPreview';
