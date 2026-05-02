import { useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import { BaseButton, type BaseButtonProps } from './base-button';

type ShopifyResource =
	| 'orders'
	| 'products'
	| 'product_variants'
	| 'customers'
	| 'draft_orders'
	| 'collections'
	| 'discounts';

type ShopifyButtonProps =
	| (Omit<BaseButtonProps, 'children'> & {
			resource: Exclude<ShopifyResource, 'product_variants'>;
			id: string | number;
			text: string;
			adminUrl?: string;
		})
	| (Omit<BaseButtonProps, 'children'> & {
			resource: 'product_variants';
			productId: string | number;
			id: string | number;
			text: string;
			adminUrl?: string;
		});

export function ShopifyButton(props: ShopifyButtonProps) {
	const { resource, id, text, fullWidth, className, adminUrl } = props;
	const buttonProps = { ...props };
	delete (buttonProps as Partial<typeof props>).resource;
	delete (buttonProps as Partial<typeof props>).id;
	delete (buttonProps as Partial<typeof props>).text;
	delete (buttonProps as Partial<typeof props>).fullWidth;
	delete (buttonProps as Partial<typeof props>).className;
	delete (buttonProps as { adminUrl?: string }).adminUrl;

	const productId = props.resource === 'product_variants' ? props.productId : null;
	if (props.resource === 'product_variants') {
		delete (buttonProps as { productId?: unknown }).productId;
	}

	const href = useMemo(() => {
		const base = (adminUrl ?? '').replace(/\/$/, '');
		const map: Record<ShopifyResource, string> = {
			orders: `${base}/orders/${id}`,
			products: `${base}/products/${id}`,
			product_variants: productId ? `${base}/products/${productId}/variants/${id}` : `${base}/products/${id}`,
			customers: `${base}/customers/${id}`,
			draft_orders: `${base}/draft_orders/${id}`,
			collections: `${base}/collections/${id}`,
			discounts: `${base}/discounts/${id}`,
		};
		return map[resource];
	}, [adminUrl, resource, id, productId]);

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`flex ${fullWidth ? 'w-full' : ''}`}
		>
			<BaseButton
				{...buttonProps}
				className={className}
				icon={ShoppingBag}
				iconPosition="left"
			>
				{text}
			</BaseButton>
		</a>
	);
}

export default ShopifyButton;

ShopifyButton.displayName = 'ShopifyButton';
