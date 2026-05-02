export interface CouponInputStrings {
	title: string;
	placeholder: string;
	apply: string;
	remove: string;
	applied: string;
	invalid: string;
}

export const defaultCouponInputStrings: CouponInputStrings = {
	title: 'Have a code?',
	placeholder: 'Enter coupon code',
	apply: 'Apply',
	remove: 'Remove',
	applied: 'Applied',
	invalid: 'That code is not valid',
};

export interface CouponInputCardProps {
	appliedCode?: string;
	appliedDiscount?: string;
	error?: string;
	onApply?: (code: string) => void;
	onRemove?: () => void;
	loading?: boolean;
	className?: string;
	strings?: Partial<CouponInputStrings>;
}
