import type { LucideIcon } from 'lucide-react';

export interface CategoryNavItem {
	id: string;
	label: string;
	icon?: LucideIcon;
	count?: number;
	hint?: string;
}

export interface CategoryNavCardProps {
	title?: string;
	items: CategoryNavItem[];
	activeId?: string;
	onSelect?: (id: string) => void;
	className?: string;
}
