import type { LucideIcon } from 'lucide-react';
import type { ComposedBadgeVariant } from '@/components/base/badge/badge';

export interface ActivityStreamItem {
	id: string;
	icon?: LucideIcon;
	iconVariant?: ComposedBadgeVariant;
	actor?: string;
	action: string;
	target?: string;
	timestamp: string;
	metadata?: { label: string; value: string }[];
}

export interface ActivityStreamStrings {
	title: string;
	empty: string;
}

export const defaultActivityStreamStrings: ActivityStreamStrings = {
	title: 'Activity',
	empty: 'No activity yet',
};

export interface ActivityStreamCardProps {
	items: ActivityStreamItem[];
	className?: string;
	strings?: Partial<ActivityStreamStrings>;
}
