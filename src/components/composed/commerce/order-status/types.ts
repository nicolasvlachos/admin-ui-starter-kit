import type { ComposedBadgeVariant } from '@/components/base/badge/badge';

export type OrderStatusKind = 'pending' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusEvent {
	label: string;
	timestamp?: string;
	complete: boolean;
}

export interface OrderStatusStrings {
	title: string;
	statusLabel: string;
	eta: string;
}

export const defaultOrderStatusStrings: OrderStatusStrings = {
	title: 'Order status',
	statusLabel: 'Current status',
	eta: 'ETA',
};

export interface OrderStatusCardProps {
	orderNumber: string;
	status: OrderStatusKind;
	statusVariant?: ComposedBadgeVariant;
	events: OrderStatusEvent[];
	currentEta?: string;
	className?: string;
	strings?: Partial<OrderStatusStrings>;
}
