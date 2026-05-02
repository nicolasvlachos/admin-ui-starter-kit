export interface OrderItem {
    vendor: string;
    badge?: string;
    name: string;
    qty: number;
    price: string;
    color?: string;
}

export interface OrderSummaryLine {
    label: string;
    value: string;
}

import type { StringsProp } from '@/lib/strings';
import type { OrderItemsCardStrings } from '../dark-surfaces.strings';

export interface OrderItemsCardProps {
    items: OrderItem[];
    summary?: OrderSummaryLine[];
    total?: string;
    className?: string;
    strings?: StringsProp<OrderItemsCardStrings>;
}
