export interface CartLineItem {
	id: string;
	name: string;
	qty: number;
	price: string;
	imageUrl?: string;
}

export interface CartSummaryStrings {
	title: string;
	subtotal: string;
	tax: string;
	shipping: string;
	discount: string;
	total: string;
	checkout: string;
}

export const defaultCartSummaryStrings: CartSummaryStrings = {
	title: 'Cart',
	subtotal: 'Subtotal',
	tax: 'Tax',
	shipping: 'Shipping',
	discount: 'Discount',
	total: 'Total',
	checkout: 'Checkout',
};

export interface CartSummaryCardProps {
	items: CartLineItem[];
	subtotal?: string;
	tax?: string;
	shipping?: string;
	discount?: string;
	total: string;
	onCheckout?: () => void;
	className?: string;
	strings?: Partial<CartSummaryStrings>;
}
