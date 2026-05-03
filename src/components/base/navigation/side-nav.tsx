/**
 * SideNav — collapsible vertical sidebar navigation. Items can be grouped
 * with a heading and optionally collapsed; each item supports an icon, badge,
 * and active-state highlight. The active item is matched by deepest path
 * prefix so nested routes still highlight their parent group.
 *
 * Use this when AsideNavigationMenu (flat) is not enough — e.g. settings
 * panes with multiple sections, or a primary app nav with collapsible groups.
 */
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface SideNavItem {
	label: ReactNode;
	href: string;
	icon?: LucideIcon;
	badge?: ReactNode;
	disabled?: boolean;
}

export interface SideNavGroup {
	id: string;
	label?: ReactNode;
	items: SideNavItem[];
	defaultCollapsed?: boolean;
	collapsible?: boolean;
}

export interface SideNavProps {
	/** Groups of items. Pass a single group with no `label` for an ungrouped list. */
	groups: SideNavGroup[];
	currentPath?: string;
	className?: string;
	itemClassName?: string;
	activeItemClassName?: string;
	ariaLabel?: string;
}

function normalizePath(rawUrl: string): string {
	if (rawUrl.length === 0) return '/';
	try {
		const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
		const parsed = new URL(rawUrl, baseOrigin);
		const trimmed = parsed.pathname.replace(/\/+$/, '');
		return trimmed.length > 0 ? trimmed : '/';
	} catch {
		const clean = rawUrl.split('?')[0] ?? rawUrl;
		const trimmed = clean.replace(/\/+$/, '');
		return trimmed.length > 0 ? trimmed : '/';
	}
}

export function SideNav({
	groups,
	currentPath,
	className,
	itemClassName,
	activeItemClassName,
	ariaLabel = 'Side navigation',
}: SideNavProps) {
	const rawActivePath = currentPath ?? (typeof window !== 'undefined' ? window.location.pathname : '');
	const activePath = normalizePath(rawActivePath);

	const allNormalized = useMemo(() => {
		return groups.flatMap((g) =>
			g.items.map((item) => ({ groupId: g.id, normalizedPath: normalizePath(item.href) })),
		);
	}, [groups]);

	const activeNormalized =
		allNormalized
			.filter(
				({ normalizedPath }) =>
					activePath === normalizedPath || activePath.startsWith(`${normalizedPath}/`),
			)
			.sort((a, b) => b.normalizedPath.length - a.normalizedPath.length)[0]?.normalizedPath ??
		null;

	const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(groups.map((g) => [g.id, Boolean(g.defaultCollapsed)])),
	);

	const toggleGroup = (id: string) =>
		setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

	const resolvedActive =
		activeItemClassName && activeItemClassName.length > 0
			? activeItemClassName
			: 'bg-primary/5 text-primary';

	return (
		<nav className={cn('side-nav--component', 'flex flex-col gap-4', className)} aria-label={ariaLabel}>
			{groups.map((group) => {
				const isCollapsed = group.collapsible !== false && collapsed[group.id];
				const showLabel = !!group.label;
				const shouldRenderItems = !isCollapsed;

				return (
					<div key={group.id} className="flex flex-col gap-1">
						{!!showLabel && (
							group.collapsible !== false ? (
								<button
									type="button"
									onClick={() => toggleGroup(group.id)}
									className={cn(
										'flex w-full items-center justify-between px-3 py-1.5 rounded-md',
										'text-xs font-medium uppercase tracking-wider text-muted-foreground',
										'hover:text-foreground transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
									)}
									aria-expanded={!isCollapsed}
								>
									<span>{group.label}</span>
									<ChevronDown
										className={cn(
											'size-3.5 transition-transform',
											isCollapsed && '-rotate-90',
										)}
										aria-hidden="true"
									/>
								</button>
							) : (
								<Text
									tag="div"
									size="xs"
									type="secondary"
									weight="medium"
									className="px-3 py-1.5 uppercase tracking-wider"
								>
									{group.label}
								</Text>
							)
						)}
						{!!shouldRenderItems && (
							<div className="flex flex-col gap-0.5">
								{group.items.map((item) => {
									const Icon = item.icon;
									const itemPath = normalizePath(item.href);
									const isActive = itemPath === activeNormalized;
									return (
										<a
											key={item.href}
											href={item.disabled ? undefined : item.href}
											aria-current={isActive ? 'page' : undefined}
											aria-disabled={item.disabled || undefined}
											className={cn(
												'group flex items-center gap-2.5 rounded-md px-3 py-1.5',
												'text-sm transition-colors',
												'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
												'hover:bg-muted/60',
												item.disabled && 'pointer-events-none opacity-50',
												isActive && resolvedActive,
												itemClassName,
											)}
										>
											{!!Icon && (
												<Icon
													className={cn(
														'size-4 shrink-0',
														isActive ? 'text-primary' : 'text-muted-foreground',
													)}
												/>
											)}
											<span className="min-w-0 flex-1 truncate">{item.label}</span>
											{!!item.badge && (
												<Badge
													variant={isActive ? 'primary' : 'secondary'}
													className="shrink-0"
												>
													{item.badge}
												</Badge>
											)}
										</a>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</nav>
	);
}

SideNav.displayName = 'SideNav';
