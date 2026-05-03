/**
 * SectionNav — sticky in-page anchor nav. Pass a list of section ids; the active one
 * is tracked via IntersectionObserver and the matching item is highlighted. Click to
 * scroll to that section. Pure JS — no router required.
 */
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface SectionNavItem {
	id: string;
	label: string;
	icon?: LucideIcon;
}

export interface SectionNavProps {
	items: SectionNavItem[];
	rootMargin?: string;
	className?: string;
	onSelect?: (id: string) => void;
}

export function SectionNav({ items, rootMargin = '-40% 0px -50% 0px', className, onSelect }: SectionNavProps) {
	const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

	useEffect(() => {
		const obs = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((e) => e.isIntersecting);
				if (visible?.target.id) setActive(visible.target.id);
			},
			{ rootMargin, threshold: 0 },
		);
		items.forEach((it) => {
			const el = document.getElementById(it.id);
			if (el) obs.observe(el);
		});
		return () => obs.disconnect();
	}, [items, rootMargin]);

	return (
		<nav className={cn('section-nav--component', 'flex flex-col gap-0.5', className)} aria-label="Section navigation">
			{items.map((it) => {
				const Icon = it.icon;
				const isActive = active === it.id;
				return (
					<a
						key={it.id}
						href={`#${it.id}`}
						onClick={(e) => {
							e.preventDefault();
							document.getElementById(it.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
							setActive(it.id);
							onSelect?.(it.id);
						}}
						className={cn(
							'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
							isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
						)}
					>
						{!!Icon && <Icon className="size-3.5 shrink-0" />}
						<Text tag="span" weight={isActive ? 'semibold' : 'medium'}>{it.label}</Text>
					</a>
				);
			})}
		</nav>
	);
}

SectionNav.displayName = 'SectionNav';
