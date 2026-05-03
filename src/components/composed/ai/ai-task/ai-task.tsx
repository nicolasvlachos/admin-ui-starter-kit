/**
 * AiTask — single task (with optional sub-tasks) used by agent surfaces to
 * surface long-running plans: scaffolding, package installs, multi-file
 * edits. Each row carries a status marker, a title, and optional body /
 * right-slot. Children render nested under the parent and are auto-
 * collapsed by default in the `compact` density.
 */
import { useState } from 'react';
import {
	AlertCircle,
	Check,
	ChevronDown,
	ChevronRight,
	Circle,
	Loader2,
	MinusCircle,
	XCircle,
	type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiTaskStrings,
	type AiTaskItem,
	type AiTaskProps,
	type AiTaskStatus,
} from './types';

const STATUS_ICON: Record<AiTaskStatus, { icon: LucideIcon; cls: string; spin?: boolean }> = {
	queued: { icon: Circle, cls: 'text-muted-foreground/60' },
	running: { icon: Loader2, cls: 'text-primary', spin: true },
	completed: { icon: Check, cls: 'text-success' },
	failed: { icon: AlertCircle, cls: 'text-destructive' },
	cancelled: { icon: XCircle, cls: 'text-muted-foreground' },
	skipped: { icon: MinusCircle, cls: 'text-muted-foreground' },
};

const STATUS_VARIANT: Record<
	AiTaskStatus,
	'secondary' | 'primary' | 'success' | 'error' | 'warning'
> = {
	queued: 'secondary',
	running: 'primary',
	completed: 'success',
	failed: 'error',
	cancelled: 'secondary',
	skipped: 'secondary',
};

export function AiTask({
	task,
	density = 'compact',
	indent = 18,
	className,
	strings: stringsProp,
}: AiTaskProps) {
	const strings = useStrings(defaultAiTaskStrings, stringsProp);
	return (
		<div className={cn('ai-task--component', 'rounded-lg border border-border/60 bg-card', className)}>
			<TaskRow
				item={task}
				depth={0}
				density={density}
				indent={indent}
				strings={strings}
			/>
		</div>
	);
}

AiTask.displayName = 'AiTask';

function TaskRow({
	item,
	depth,
	density,
	indent,
	strings,
}: {
	item: AiTaskItem;
	depth: number;
	density: 'compact' | 'expanded';
	indent: number;
	strings: ReturnType<typeof useStrings<typeof defaultAiTaskStrings>>;
}) {
	const status: AiTaskStatus = item.status ?? 'queued';
	const visual = STATUS_ICON[status];
	const Icon = item.icon ?? visual.icon;
	const hasChildren = !!item.children?.length;
	const [open, setOpen] = useState(density === 'expanded' || depth === 0 ? true : false);

	return (
		<>
			<div
				className={cn(
					'flex items-start gap-2 px-3 py-2',
					depth > 0 && 'border-t border-border/60',
				)}
				style={{ paddingLeft: 12 + depth * indent }}
			>
				{hasChildren ? (
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-expanded={open}
						aria-label={open ? 'Collapse subtasks' : 'Expand subtasks'}
						className="-ml-1 mt-0.5 flex size-4 items-center justify-center rounded text-muted-foreground hover:text-foreground"
					>
						{open ? (
							<ChevronDown className="size-3.5" />
						) : (
							<ChevronRight className="size-3.5" />
						)}
					</button>
				) : (
					<span aria-hidden className="mt-0.5 size-4" />
				)}
				<Icon
					className={cn('mt-[3px] size-3.5 shrink-0', visual.cls, visual.spin && 'animate-spin')}
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<Text
							weight={status === 'running' ? 'semibold' : 'medium'}
							className={cn(
								'flex-1 truncate',
								status === 'queued' && 'text-muted-foreground',
								status === 'cancelled' && 'line-through text-muted-foreground',
								status === 'skipped' && 'text-muted-foreground/70',
							)}
						>
							{item.title}
						</Text>
						<Badge variant={STATUS_VARIANT[status]}>
							{strings.statusLabels[status]}
						</Badge>
						{!!item.rightSlot && (
							<Text
								tag="span"
								size="xxs"
								type="secondary"
								className="tabular-nums"
							>
								{item.rightSlot}
							</Text>
						)}
					</div>
					{!!item.body && <div className="mt-2">{item.body}</div>}
				</div>
			</div>
			{hasChildren && open && (
				<div>
					{item.children!.map((child) => (
						<TaskRow
							key={child.id}
							item={child}
							depth={depth + 1}
							density={density}
							indent={indent}
							strings={strings}
						/>
					))}
				</div>
			)}
		</>
	);
}
