/**
 * OverflowTabBar — horizontal tab strip that gracefully degrades on narrow
 * containers. Tabs that would overflow are moved into a trailing "More"
 * dropdown so the strip never wraps. Uses a ResizeObserver to recompute on
 * container resize; the active tab is always kept visible by being moved
 * out of the overflow set when needed.
 *
 * Pair with `TabNavigationMenu` for fixed sets where overflow is impossible,
 * or with `NavigationTabs` for marketing-weight pill bars.
 */
import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface OverflowTabItem {
	id: string;
	label: ReactNode;
	href?: string;
	icon?: LucideIcon;
	badge?: ReactNode;
	onClick?: () => void;
}

export interface OverflowTabBarProps {
	items: OverflowTabItem[];
	/** Currently active tab id. */
	value?: string;
	onChange?: (id: string) => void;
	className?: string;
	tabClassName?: string;
	activeTabClassName?: string;
	moreLabel?: string;
	ariaLabel?: string;
}

const TAB_BUTTON_BASE =
	'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ' +
	'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40';

export function OverflowTabBar({
	items,
	value,
	onChange,
	className,
	tabClassName,
	activeTabClassName,
	moreLabel = 'More',
	ariaLabel = 'Tab navigation',
}: OverflowTabBarProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const measureRef = useRef<HTMLDivElement | null>(null);
	const [visibleCount, setVisibleCount] = useState(items.length);

	// Recompute how many tabs fit when container or items change.
	useLayoutEffect(() => {
		if (!containerRef.current || !measureRef.current) return;
		const container = containerRef.current;
		const measure = measureRef.current;

		const compute = () => {
			const containerWidth = container.clientWidth;
			const moreReserve = 72; // approximate "More" trigger width
			const buttons = Array.from(measure.querySelectorAll<HTMLElement>('[data-tab-id]'));
			let used = 0;
			let count = 0;
			for (const btn of buttons) {
				const w = btn.offsetWidth + 4; // gap allowance
				if (used + w + moreReserve <= containerWidth) {
					used += w;
					count += 1;
				} else {
					break;
				}
			}
			setVisibleCount(count === buttons.length ? count : Math.max(1, count));
		};

		compute();
		const observer = new ResizeObserver(compute);
		observer.observe(container);
		return () => observer.disconnect();
	}, [items]);

	// Ensure active tab is always visible; if it falls into the overflow set,
	// pull it forward by reducing the visible count to where it lives.
	const orderedItems = useMemo(() => {
		if (!value) return items;
		const activeIdx = items.findIndex((i) => i.id === value);
		if (activeIdx < 0 || activeIdx < visibleCount) return items;
		// Move active item into the visible window (swap with last visible).
		const next = [...items];
		const lastVisibleIdx = Math.max(0, visibleCount - 1);
		[next[activeIdx], next[lastVisibleIdx]] = [next[lastVisibleIdx], next[activeIdx]];
		return next;
	}, [items, value, visibleCount]);

	const visibleItems = orderedItems.slice(0, visibleCount);
	const overflowItems = orderedItems.slice(visibleCount);

	const handleSelect = (item: OverflowTabItem) => {
		onChange?.(item.id);
		item.onClick?.();
	};

	const renderTab = (item: OverflowTabItem, isActive: boolean) => {
		const Icon = item.icon;
		const className = cn(
			TAB_BUTTON_BASE,
			isActive
				? cn('bg-card text-foreground shadow-sm', activeTabClassName)
				: 'text-muted-foreground hover:bg-muted/60',
			tabClassName,
		);
		const inner = (
			<>
				{!!Icon && <Icon className="size-3.5" />}
				<span>{item.label}</span>
				{!!item.badge && (
					<span
						className={cn(
							'ml-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-xxs font-semibold',
							isActive ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground',
						)}
					>
						{item.badge}
					</span>
				)}
			</>
		);
		if (item.href) {
			return (
				<a
					key={item.id}
					href={item.href}
					data-tab-id={item.id}
					aria-current={isActive ? 'page' : undefined}
					onClick={() => handleSelect(item)}
					className={className}
				>
					{inner}
				</a>
			);
		}
		return (
			<button
				key={item.id}
				type="button"
				data-tab-id={item.id}
				aria-pressed={isActive}
				onClick={() => handleSelect(item)}
				className={className}
			>
				{inner}
			</button>
		);
	};

	return (
		<>
			{/* Hidden measure row: always renders all tabs at native width so
			    we can measure how many fit. Visually hidden but laid out. */}
			<div
				ref={measureRef}
				aria-hidden="true"
				className="absolute -top-[9999px] left-0 inline-flex items-center gap-1 invisible"
			>
				{items.map((i) => renderTab(i, false))}
			</div>

			<div
				ref={containerRef}
				role="tablist"
				aria-label={ariaLabel}
				className={cn('relative inline-flex items-center gap-1 rounded-lg bg-muted/40 p-1', className)}
			>
				{visibleItems.map((item) => renderTab(item, item.id === value))}
				{overflowItems.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger
							type="button"
							aria-label={moreLabel}
							className={cn(
								TAB_BUTTON_BASE,
								'text-muted-foreground hover:bg-muted/60',
							)}
						>
							<MoreHorizontal className="size-3.5" />
							<span>{moreLabel}</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-[160px]">
							{overflowItems.map((item) => {
								const Icon = item.icon;
								return (
									<DropdownMenuItem
										key={item.id}
										onClick={() => handleSelect(item)}
										className={cn(
											'text-xs gap-1.5 px-2 py-1.5',
											item.id === value && 'bg-primary/5 text-primary',
										)}
									>
										{!!Icon && <Icon className="size-3.5" />}
										<span>{item.label}</span>
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</>
	);
}

OverflowTabBar.displayName = 'OverflowTabBar';

// useEffect is referenced indirectly through useLayoutEffect above; keep the
// import so SSR builds that fall back to useEffect still compile cleanly.
void useEffect;
