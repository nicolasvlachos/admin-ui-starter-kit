/** SidebarLogo — hides its logo content when the sidebar is icon-collapsed. */
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { useSidebar } from '../sidebar.context';

export interface SidebarLogoProps {
	logo: ReactNode;
	collapsedLogo?: ReactNode;
	className?: string;
}

export function SidebarLogo({ logo, collapsedLogo = null, className }: SidebarLogoProps) {
	const { state } = useSidebar();
	const isCollapsed = state === 'collapsed';
	const content = isCollapsed ? collapsedLogo : logo;
	if (!content) return null;
	return <div className={cn('min-w-0', className)}>{content}</div>;
}
