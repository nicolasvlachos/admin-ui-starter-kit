import type { LucideIcon } from 'lucide-react';

export interface SubscriptionPerk {
	icon?: LucideIcon;
	label: string;
}

export interface SubscriptionSummaryStrings {
	title: string;
	plan: string;
	nextBilling: string;
	perks: string;
	manage: string;
	upgrade: string;
}

export const defaultSubscriptionSummaryStrings: SubscriptionSummaryStrings = {
	title: 'Subscription',
	plan: 'Plan',
	nextBilling: 'Next billing',
	perks: 'Included',
	manage: 'Manage',
	upgrade: 'Upgrade',
};

export interface SubscriptionSummaryCardProps {
	planName: string;
	priceLabel: string;
	cycleLabel: string;
	nextBillingDate: string;
	statusLabel?: string;
	perks?: SubscriptionPerk[];
	onManage?: () => void;
	onUpgrade?: () => void;
	className?: string;
	strings?: Partial<SubscriptionSummaryStrings>;
}
