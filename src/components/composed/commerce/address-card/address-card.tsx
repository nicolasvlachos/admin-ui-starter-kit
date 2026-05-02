/**
 * AddressCard — saved postal address surface. Title varies by `kind`
 * (shipping / billing / pickup); shows recipient name, address lines, phone,
 * and a "Default" badge when applicable.
 *
 * Edit / remove / make-default actions ride through SmartCard's actions menu
 * (the canonical card-actions affordance) instead of inline footer buttons —
 * keeps the surface consistent with every other card in the library.
 */
import { Edit2, MapPin, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { SmartCard, type SmartCardAction } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';

import {
	defaultAddressCardStrings,
	type AddressCardProps,
	type AddressKind,
} from './types';

export function AddressCard({
	kind = 'shipping',
	name,
	line1,
	line2,
	city,
	region,
	postalCode,
	country,
	phone,
	isDefault = false,
	onEdit,
	onRemove,
	onMakeDefault,
	className,
	strings: stringsProp,
}: AddressCardProps) {
	const strings = useStrings(defaultAddressCardStrings, stringsProp);
	const titleByKind: Record<AddressKind, string> = {
		shipping: strings.shipping,
		billing: strings.billing,
		pickup: strings.pickup,
	};

	const cityLine = [city, region, postalCode].filter(Boolean).join(', ');

	const actions: SmartCardAction[] = [];
	if (onEdit) {
		actions.push({
			id: 'edit',
			label: strings.edit,
			icon: <Edit2 className="size-3.5" />,
			onClick: onEdit,
		});
	}
	if (onMakeDefault && !isDefault) {
		actions.push({
			id: 'make-default',
			label: strings.makeDefault,
			icon: <Star className="size-3.5" />,
			onClick: onMakeDefault,
		});
	}
	if (onRemove) {
		actions.push({
			id: 'remove',
			label: strings.remove,
			icon: <Trash2 className="size-3.5" />,
			onClick: onRemove,
		});
	}

	return (
		<SmartCard
			icon={<MapPin className="size-4" />}
			title={titleByKind[kind]}
			headerEnd={
				isDefault ? <Badge variant="primary">{strings.defaultBadge}</Badge> : null
			}
			actions={actions.length > 0 ? actions : undefined}
			className={className}
		>
			<div className="space-y-0.5">
				<Text weight="semibold">{name}</Text>
				<Text>{line1}</Text>
				{!!line2 && <Text>{line2}</Text>}
				{!!cityLine && <Text>{cityLine}</Text>}
				<Text type="secondary">{country}</Text>
				{!!phone && (
					<Text size="xs" type="secondary" className="mt-1.5 tabular-nums">
						{phone}
					</Text>
				)}
			</div>
		</SmartCard>
	);
}

AddressCard.displayName = 'AddressCard';
