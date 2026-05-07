---
id: features/kanban
title: "Features · Kanban"
description: "Drag-and-drop board, generic in T. Pass `itemActions` (static array or per-item factory) for the ⋮ menu, `onItemClick` for whole-card click. Headless via `useKanban`; slots: KanbanBoard / KanbanColumn / KanbanColumnContent / KanbanItem / KanbanItemHandle / KanbanItemActions / KanbanOverlay."
layer: features
family: "Boards"
sourcePath: src/components/features/kanban
examples:
  - RoadmapBoardWithActionsOnItemClick
imports:
  - @/components/base/badge
  - @/components/base/cards
  - @/components/features/kanban
  - @/components/typography
tags:
  - features
  - boards
  - kanban
  - drag
  - drop
  - board
  - generic
---

# Features · Kanban

Drag-and-drop board, generic in T. Pass `itemActions` (static array or per-item factory) for the ⋮ menu, `onItemClick` for whole-card click. Headless via `useKanban`; slots: KanbanBoard / KanbanColumn / KanbanColumnContent / KanbanItem / KanbanItemHandle / KanbanItemActions / KanbanOverlay.

**Layer:** `features`  
**Source:** `src/components/features/kanban`

## Examples

```tsx
import { ArrowUp, Copy, Edit3, Eye, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';
import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanColumnContent,
	KanbanItem,
	KanbanItemActions,
	KanbanOverlay,
	type KanbanItemAction,
	type KanbanValue,
} from '@/components/features/kanban';
import { Heading, Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { Col } from '../../PreviewLayout';

interface Feature {
	id: string;
	title: string;
	description: string;
	progress: number;
	votes: number;
}

const COLUMN_META: Record<string, { title: string; tone: string }> = {
	planned: { title: 'Planned', tone: 'bg-info' },
	building: { title: 'Building', tone: 'bg-warning' },
	testing: { title: 'Testing', tone: 'bg-primary' },
	shipped: { title: 'Shipped', tone: 'bg-success' },
};

const INITIAL: KanbanValue<Feature> = {
	planned: [
		{ id: 'f1', title: 'AI-powered search', description: 'Natural language search across all content', progress: 0, votes: 142 },
		{ id: 'f2', title: 'Custom webhooks', description: 'User-configurable webhook endpoints', progress: 0, votes: 98 },
	],
	building: [
		{ id: 'f3', title: 'Real-time collaboration', description: 'Multi-user editing with presence indicators', progress: 65, votes: 234 },
		{ id: 'f4', title: 'API v2 migration', description: 'RESTful API with OpenAPI 3.0 spec', progress: 40, votes: 176 },
	],
	testing: [
		{ id: 'f5', title: 'Two-factor auth', description: 'TOTP + WebAuthn support', progress: 90, votes: 312 },
	],
	shipped: [
		{ id: 'f6', title: 'Dark mode', description: 'System-aware theme with manual override', progress: 100, votes: 456 },
		{ id: 'f7', title: 'Export to CSV', description: 'Bulk data export with custom fields', progress: 100, votes: 189 },
	],
};

function FeatureCard({ feature }: { feature: Feature }) {
	return (
		<SmartCard padding="sm" className="gap-2">
			<div className="flex items-start gap-2">
				<Text weight="semibold" tag="div" className="text-sm flex-1 min-w-0">
					{feature.title}
				</Text>
				<KanbanItemActions />
			</div>
			<Text size="xs" type="secondary" className="line-clamp-2">
				{feature.description}
			</Text>
			<div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
				<div
					className="h-full bg-primary transition-[width] duration-150"
					style={{ width: `${feature.progress}%` }}
				/>
			</div>
			<div className="flex items-center justify-between">
				<Text size="xxs" type="secondary" className="tabular-nums">
					{feature.progress}% complete
				</Text>
				<div className="inline-flex items-center gap-1 text-muted-foreground">
					<ArrowUp className="size-3" />
					<Text tag="span" size="xs" type="secondary" className="tabular-nums">
						{feature.votes}
					</Text>
				</div>
			</div>
		</SmartCard>
	);
}

export function RoadmapBoardWithActionsOnItemClick() {
	const [columns, setColumns] = useState(INITIAL);
	const [lastEvent, setLastEvent] = useState<string>('—');
	const removeFeature = useCallback((target: Feature) => {
		setColumns((current) => {
			const next: KanbanValue<Feature> = {};
			for (const [col, items] of Object.entries(current)) {
				next[col] = items.filter((f) => f.id !== target.id);
			}
			return next;
		});
		setLastEvent(`Deleted "${target.title}"`);
	}, []);
	const itemActions = useCallback(
			(_feature: Feature): KanbanItemAction<Feature>[] => [
				{
					id: 'view',
					label: 'View details',
					icon: <Eye className="size-3.5" />,
					onSelect: (f) => setLastEvent(`Viewed "${f.title}"`),
				},
				{
					id: 'edit',
					label: 'Edit',
					icon: <Edit3 className="size-3.5" />,
					onSelect: (f) => setLastEvent(`Edited "${f.title}"`),
				},
				{
					id: 'duplicate',
					label: 'Duplicate',
					icon: <Copy className="size-3.5" />,
					isDisabled: (f) => f.progress === 100,
					onSelect: (f) => setLastEvent(`Duplicated "${f.title}"`),
				},
				{
					id: 'delete',
					label: 'Delete',
					icon: <Trash2 className="size-3.5" />,
					variant: 'destructive',
					isVisible: (f) => f.progress < 100,
					onSelect: removeFeature,
				},
			],
			[removeFeature],
		);
	return (
		<>
			<Col>
								<div className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
									Last event: <span className="font-medium text-foreground">{lastEvent}</span>
								</div>
								<Kanban<Feature>
									value={columns}
									onValueChange={setColumns}
									getItemValue={(f) => f.id}
									onItemClick={(f) => setLastEvent(`Clicked "${f.title}"`)}
									itemActions={itemActions}
								>
									<KanbanBoard className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
										{Object.entries(columns).map(([colId, features]) => {
											const meta = COLUMN_META[colId];
											return (
												<KanbanColumn key={colId} value={colId} className="rounded-md border border-border bg-muted/20 p-2">
													<div className="mb-2 flex items-center gap-2 px-1">
														<span className={cn('size-2 rounded-full', meta.tone)} aria-hidden />
														<Heading tag="h4" className="border-0 pb-0 text-sm font-semibold">
															{meta.title}
														</Heading>
														<Badge variant="secondary" className="ml-auto">
															{features.length}
														</Badge>
													</div>
													<KanbanColumnContent value={colId} className="min-h-[40px]">
														{features.map((feature) => (
															<KanbanItem key={feature.id} value={feature.id}>
																<FeatureCard feature={feature} />
															</KanbanItem>
														))}
													</KanbanColumnContent>
												</KanbanColumn>
											);
										})}
									</KanbanBoard>
									<KanbanOverlay />
								</Kanban>
							</Col>
		</>
	);
}
```

## Example exports

- `RoadmapBoardWithActionsOnItemClick`

