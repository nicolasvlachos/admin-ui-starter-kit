/**
 * TabNavigationMenu — pill-style horizontal navigation. Active tab gets the
 * elevated card background; inactive tabs hover into a translucent variant.
 * Supports optional badges and per-item icons (Lucide component or string).
 */
import { useMemo, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';

interface TabNavigationMenuProps {
	items: NavItem[];
	currentPath?: string;
	className?: string;
	ariaLabel?: string;
}

function TabNavigationMenu({ items, currentPath, className, ariaLabel = 'Tab navigation' }: TabNavigationMenuProps) {
	const activePath = currentPath ?? (typeof window !== 'undefined' ? window.location.pathname : '');

	const normalizedItems = useMemo(() => {
		return items.map((item) => {
			const isActive = activePath === item.href;
			let iconNode: ReactNode = null;

			if (typeof item.icon === 'string') {
				iconNode = <span className="text-inherit">{item.icon}</span>;
			} else if (item.icon) {
				const IconComp = item.icon;
				iconNode = <IconComp className="h-4 w-4" />;
			}

			return {
				key: item.href,
				item,
				isActive,
				iconNode,
				ariaCurrent: isActive ? ('page' as const) : undefined,
			};
		});
	}, [activePath, items]);

	return (
		<div className={cn('w-full', className)}>
			<nav className="inline-flex bg-muted rounded-full items-center gap-1 p-1" aria-label={ariaLabel}>
				{normalizedItems.map(({ key, item, isActive, iconNode, ariaCurrent }) => (
					<a
						key={key}
						href={item.href}
						className={cn(
							'whitespace-nowrap flex items-center gap-2',
							'rounded-full px-4 py-2',
							'text-sm font-medium',
							'transition-all duration-200',
							'focus-visible:outline-none focus-visible:ring-2',
							'focus-visible:ring-ring focus-visible:ring-offset-2',
							{
								'bg-background text-foreground shadow-sm': isActive,
								'text-muted-foreground hover:text-foreground hover:bg-background/50': !isActive,
							},
						)}
						aria-current={ariaCurrent}
					>
						{!!iconNode && (
							<span className="text-inherit">
								{iconNode}
							</span>
						)}
						{item.title}
						{!!item.badge && (
							<span
								className={cn(
									'ml-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
									isActive
										? 'bg-primary/10 text-primary'
										: 'bg-muted-foreground/10 text-muted-foreground',
								)}
							>
								{item.badge}
							</span>
						)}
					</a>
				))}
			</nav>
		</div>
	);
}

TabNavigationMenu.displayName = 'TabNavigationMenu';

export default TabNavigationMenu;

