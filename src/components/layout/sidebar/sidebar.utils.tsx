 
/** Sidebar utilities — pure path helpers, labels, icon rendering, badge pill. */
import * as React from 'react';

import { Badge } from '@/components/base/badge';
import { cn } from '@/lib/utils';

import type { LayoutIconSource, LayoutLinkRenderer } from '../layout.types';
import type { SidebarNavItem } from './sidebar.types';

export function toPath(href: string): string {
	if (href.startsWith('#/')) {
		return href.slice(1).split('?')[0]?.split('#')[0] || '/';
	}

	try {
		return new URL(href, 'http://local.invalid').pathname;
	} catch {
		return href;
	}
}

export function isPathMatch(currentUrl: string, path: string): boolean {
	const currentPath = toPath(currentUrl);
	return currentPath === path || currentPath.startsWith(path + '/') || currentPath.startsWith(path + '?');
}

export function getNavLabel(item: Pick<SidebarNavItem, 'label' | 'title'>): React.ReactNode {
	return item.label ?? item.title ?? '';
}

export function getNavKey(item: SidebarNavItem, fallbackIndex?: number): React.Key {
	const label = getNavLabel(item);
	return item.handle ?? item.href ?? (typeof label === 'string' || typeof label === 'number' ? label : `nav-${fallbackIndex ?? 0}`);
}

export function NavBadge({
	value,
	size = 'default',
}: {
	value: string | number;
	size?: 'default' | 'small';
}) {
	return (
		<Badge
			variant="secondary"
			className={cn(
				'ml-auto rounded-full tabular-nums text-sidebar-foreground',
				size === 'small' ? 'h-4 min-w-4 px-1.5' : 'h-5 min-w-5 px-1.5',
			)}
		>
			{value}
		</Badge>
	);
}

export function resolveNavBadge(
	handle: string | undefined,
	itemBadge: string | number | undefined,
	liveBadges: Record<string, string | number> | undefined,
): string | number | undefined {
	if (handle && liveBadges && liveBadges[handle] != null) {
		return liveBadges[handle];
	}
	return itemBadge;
}

export interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
	icon: LayoutIconSource;
	iconMap?: Record<string, React.ComponentType<{ className?: string }>>;
	size?: number;
	className?: string;
}

export function DynamicIcon({
	icon,
	iconMap = {},
	size = 20,
	className = 'size-4',
	...props
}: DynamicIconProps) {
	if (!icon) return null;

	if (typeof icon === 'string') {
		const IconComponent = iconMap[icon];
		return IconComponent ? <IconComponent className={className} /> : null;
	}

	if (React.isValidElement(icon)) {
		return React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
			className: cn(className, (icon.props as { className?: string }).className),
			...props,
		});
	}

	if (
		typeof icon === 'function'
		|| (typeof icon === 'object' && icon !== null && '$$typeof' in icon)
	) {
		const IconComponent = icon as React.ElementType<React.SVGProps<SVGSVGElement>>;
		return <IconComponent className={className} width={size} height={size} {...props} />;
	}

	return null;
}

export function renderSidebarLink(
	renderLink: LayoutLinkRenderer,
	item: SidebarNavItem,
	children: React.ReactNode,
	className?: string,
	active?: boolean,
) {
	return renderLink({
		href: item.href,
		children,
		className,
		active,
		disabled: item.disabled || !item.href,
		external: item.external,
	});
}
