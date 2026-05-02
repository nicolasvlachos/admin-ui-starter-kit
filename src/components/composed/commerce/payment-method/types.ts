export type PaymentBrand = 'visa' | 'mastercard' | 'amex' | 'paypal' | 'applepay' | 'googlepay' | 'unknown';

export interface PaymentMethodStrings {
	title: string;
	default: string;
	cardHolder: string;
	expires: string;
	change: string;
}

export const defaultPaymentMethodStrings: PaymentMethodStrings = {
	title: 'Payment method',
	default: 'Default',
	cardHolder: 'Card holder',
	expires: 'Expires',
	change: 'Change',
};

export interface PaymentMethodCardProps {
	brand: PaymentBrand;
	last4: string;
	expiry?: string; // MM/YY
	holderName?: string;
	isDefault?: boolean;
	onChange?: () => void;
	className?: string;
	strings?: Partial<PaymentMethodStrings>;
}
