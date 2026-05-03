/**
 * CategoryNavCard — vertical icon + label list with optional count badge per row.
 * Use as a sidebar nav for filtering or category browsing.
 */
import { ChevronRight } from 'lucide-react';
import { SmartCard } from '@/components/base/cards';
import { Badge } from '@/components/base/badge';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { cn } from '@/lib/utils';

import type { CategoryNavCardProps } from './types';

export function CategoryNavCard({ title, items, activeId, onSelect, className }: CategoryNavCardProps) {
	return (
		<SmartCard title={title} padding="sm" className={cn('category-nav--component', className)}>
			<ItemGroup>
				{items.map((it) => {
					const Icon = it.icon;
					const active = it.id === activeId;
					return (
						<Item
							key={it.id}
							size="xs"
							onClick={() => onSelect?.(it.id)}
							data-state={active ? 'active' : 'inactive'}
							className={cn(
								'cursor-pointer transition-colors',
								active ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50',
							)}
						>
							{!!Icon && (
								<ItemMedia variant="icon" className={cn(active ? 'text-primary' : 'text-muted-foreground')}>
									<Icon />
								</ItemMedia>
							)}
							<ItemContent>
								<ItemTitle bold={active}>{it.label}</ItemTitle>
								{!!it.hint && <ItemDescription clamp={1}>{it.hint}</ItemDescription>}
							</ItemContent>
							<ItemActions>
								{typeof it.count === 'number' && (
									<Badge variant={active ? 'primary' : 'secondary'} className="tabular-nums">
										{it.count}
									</Badge>
								)}
								<ChevronRight
									className={cn('size-4 shrink-0 text-muted-foreground/60', active && 'text-primary')}
								/>
							</ItemActions>
						</Item>
					);
				})}
			</ItemGroup>
		</SmartCard>
	);
}

CategoryNavCard.displayName = 'CategoryNavCard';
