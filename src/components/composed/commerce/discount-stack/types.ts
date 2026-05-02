import type { ComposedBadgeVariant as BadgeVariant } from '@/components/base/badge/badge';

export interface Discount {
    type: string;
    label: string;
    amount: string;
    badge: BadgeVariant;
}

export interface DiscountStackStrings {
    title: string;
    totalSavings: string;
}

export const defaultDiscountStackStrings: DiscountStackStrings = {
    title: 'Applied Discounts',
    totalSavings: 'Total Savings',
};

export interface DiscountStackPreviewProps {
    discounts: Discount[];
    totalSavings: string;
    className?: string;
    strings?: Partial<DiscountStackStrings>;
}
