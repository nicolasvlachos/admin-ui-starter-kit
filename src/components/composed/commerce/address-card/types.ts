export type AddressKind = 'shipping' | 'billing' | 'pickup';

export interface AddressCardStrings {
	defaultBadge: string;
	edit: string;
	remove: string;
	makeDefault: string;
	shipping: string;
	billing: string;
	pickup: string;
}

export const defaultAddressCardStrings: AddressCardStrings = {
	defaultBadge: 'Default',
	edit: 'Edit',
	remove: 'Remove',
	makeDefault: 'Make default',
	shipping: 'Shipping address',
	billing: 'Billing address',
	pickup: 'Pickup address',
};

export interface AddressCardProps {
	kind?: AddressKind;
	name: string;
	line1: string;
	line2?: string;
	city: string;
	region?: string;
	postalCode?: string;
	country: string;
	phone?: string;
	isDefault?: boolean;
	onEdit?: () => void;
	onRemove?: () => void;
	onMakeDefault?: () => void;
	className?: string;
	strings?: Partial<AddressCardStrings>;
}
