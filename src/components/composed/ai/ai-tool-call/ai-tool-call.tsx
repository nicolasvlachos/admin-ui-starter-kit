/**
 * AiToolCall — collapsible trace for a model-invoked tool / function. Header
 * shows the tool name, status pill, and an expand/collapse toggle. Expanded
 * content reveals JSON-style `args` and `result` blocks (or an error block
 * when status is `error`) plus an optional duration. Use to surface tool-use
 * transparency in chat / agent UIs. Strings overridable for i18n.
 */
import { useState, type ReactNode } from 'react';
import {
	AlertCircle,
	ChevronDown,
	ChevronRight,
	CircleDot,
	Loader2,
	Wrench,
	type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { IconBadge } from '@/components/base/display';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiToolCallStrings,
	type AiToolCallProps,
	type AiToolCallStatus,
} from './types';

const STATUS_BADGE: Record<
	AiToolCallStatus,
	{ variant: 'secondary' | 'primary' | 'success' | 'error'; icon?: LucideIcon }
> = {
	pending: { variant: 'secondary', icon: CircleDot },
	running: { variant: 'primary', icon: Loader2 },
	success: { variant: 'success' },
	error: { variant: 'error', icon: AlertCircle },
};

function formatDuration(ms: number): string {
	if (ms < 1000) return `${Math.round(ms)}ms`;
	return `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)}s`;
}

export function AiToolCall({
	name,
	status,
	icon: IconComponent = Wrench,
	args,
	result,
	error,
	durationMs,
	defaultExpanded = false,
	className,
	strings: stringsProp,
}: AiToolCallProps) {
	const strings = useStrings(defaultAiToolCallStrings, stringsProp);
	const [expanded, setExpanded] = useState(defaultExpanded);
	const labelByStatus: Record<AiToolCallStatus, string> = {
		pending: strings.pending,
		running: strings.running,
		success: strings.success,
		error: strings.error,
	};
	const StatusIcon = STATUS_BADGE[status].icon;

	const hasDetails = Boolean(args || result || error);

	return (
		<div
			className={cn('ai-tool-call--component', 
				'overflow-hidden rounded-lg border border-border/60 bg-card',
				status === 'error' && 'border-destructive/40 bg-destructive/5',
				className,
			)}
		>
			<button
				type="button"
				onClick={() => hasDetails && setExpanded((v) => !v)}
				className={cn(
					'flex w-full items-center gap-2 px-3 py-2 text-left',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
					hasDetails ? 'cursor-pointer hover:bg-muted/40' : 'cursor-default',
				)}
				aria-expanded={hasDetails ? expanded : undefined}
				aria-label={hasDetails ? (expanded ? strings.collapse : strings.expand) : undefined}
			>
				<IconBadge icon={IconComponent} tone="muted" size="sm" shape="square" />
				<div className="min-w-0 flex-1">
					<Text weight="medium" className="truncate font-mono">
						{name}
					</Text>
				</div>
				<Badge variant={STATUS_BADGE[status].variant} className="gap-1">
					{!!StatusIcon && (
						<StatusIcon
							className={cn('size-3', status === 'running' && 'animate-spin')}
						/>
					)}
					{labelByStatus[status]}
				</Badge>
				{!!durationMs && (
					<Text size="xxs" type="secondary" className="tabular-nums">
						{strings.durationLabel} {formatDuration(durationMs)}
					</Text>
				)}
				{hasDetails &&
					(expanded ? (
						<ChevronDown className="size-3.5 text-muted-foreground" />
					) : (
						<ChevronRight className="size-3.5 text-muted-foreground" />
					))}
			</button>

			{!!expanded && hasDetails && (
				<div className="border-t border-border/60 bg-muted/20 px-3 py-2 space-y-2">
					{!!args && (
						<DetailBlock label={strings.args}>{args}</DetailBlock>
					)}
					{status === 'error' && !!error ? (
						<DetailBlock label={strings.error} tone="error">
							{error}
						</DetailBlock>
					) : (
						!!result && <DetailBlock label={strings.result}>{result}</DetailBlock>
					)}
				</div>
			)}
		</div>
	);
}

AiToolCall.displayName = 'AiToolCall';

function DetailBlock({
	label,
	children,
	tone = 'neutral',
}: {
	label: string;
	children: ReactNode;
	tone?: 'neutral' | 'error';
}) {
	return (
		<div className="space-y-1">
			<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">
				{label}
			</Text>
			<pre
				className={cn(
					'overflow-x-auto rounded-md bg-card px-2.5 py-2 font-mono text-xs leading-relaxed',
					tone === 'error' && 'text-destructive bg-destructive/5',
				)}
			>
				{children}
			</pre>
		</div>
	);
}
