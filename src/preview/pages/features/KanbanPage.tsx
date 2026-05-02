import { ArrowUp } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';
import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanColumnContent,
	KanbanItem,
	KanbanOverlay,
	type KanbanValue,
} from '@/components/features/kanban';
import { Heading, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { Col, PreviewPage, PreviewSection } from '../../PreviewLayout';

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
		<SmartCard padding="sm" className="cursor-grab gap-2">
			<Text weight="semibold" tag="div" className="text-sm">
				{feature.title}
			</Text>
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

export default function KanbanPage() {
	const [columns, setColumns] = useState(INITIAL);

	return (
		<PreviewPage
			title="Features · Kanban"
			description="Drag-and-drop board with multi-column item sorting and cross-column moves. Generic in T — pass your domain shape + a `getItemValue` accessor. Headless via `useKanban`; slots: KanbanBoard / KanbanColumn / KanbanColumnContent / KanbanItem / KanbanItemHandle / KanbanOverlay."
		>
			<PreviewSection title="Roadmap board" span="full">
				<Col>
					<Kanban<Feature>
						value={columns}
						onValueChange={setColumns}
						getItemValue={(f) => f.id}
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
			</PreviewSection>
		</PreviewPage>
	);
}
