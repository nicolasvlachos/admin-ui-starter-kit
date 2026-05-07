import type { LucideIcon } from 'lucide-react';

export interface BreadcrumbItemType {
	label: string;
	href?: string;
}

export interface NavItem {
	title: string;
	href: string;
	icon?: LucideIcon | string;
	badge?: string;
}
