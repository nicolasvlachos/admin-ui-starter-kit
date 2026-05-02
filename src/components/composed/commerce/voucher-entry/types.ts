export interface VoucherEntryStrings {
	title: string;
	placeholder: string;
	check: string;
	remove: string;
	balance: string;
	notFound: string;
}

export const defaultVoucherEntryStrings: VoucherEntryStrings = {
	title: 'Redeem a gift card',
	placeholder: 'Enter gift card code',
	check: 'Check balance',
	remove: 'Remove',
	balance: 'Available balance',
	notFound: 'That gift card code is not valid.',
};

export interface VoucherEntryCardProps {
	appliedCode?: string;
	balance?: string;
	error?: string;
	loading?: boolean;
	onCheck?: (code: string) => void;
	onRemove?: () => void;
	className?: string;
	strings?: Partial<VoucherEntryStrings>;
}
