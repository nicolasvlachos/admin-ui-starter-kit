/**
 * AiReasoning — collapsible "thinking" trace shown above the assistant's
 * final answer. While `streaming` is true the header runs the shimmer label
 * and the body is auto-expanded; once streaming ends, the header switches
 * to "Thought for Ns" and the body collapses to a peek.
 *
 * Accept the trace as `children` so the consumer can stream raw text, JSX
 * blocks (substeps, code), or Markdown via their own renderer.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { AiShimmer } from '../ai-shimmer/ai-shimmer';
import { defaultAiReasoningStrings, type AiReasoningProps } from './types';

function interpolate(template: string, params: Record<string, string | number>): string {
	return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => {
		const v = params[k];
		return v === undefined ? m : String(v);
	});
}

export function AiReasoning({
	children,
	streaming = false,
	durationSeconds,
	expandWhileStreaming = true,
	defaultExpanded = false,
	expanded: expandedProp,
	onExpandedChange,
	className,
	strings: stringsProp,
}: AiReasoningProps) {
	const strings = useStrings(defaultAiReasoningStrings, stringsProp);
	const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
	const expanded = expandedProp ?? internalExpanded;
	const setExpanded = (next: boolean) => {
		if (expandedProp === undefined) setInternalExpanded(next);
		onExpandedChange?.(next);
	};

	useEffect(() => {
		if (streaming && expandWhileStreaming && !expanded) {
			setExpanded(true);
		}
		if (!streaming && expandWhileStreaming && expanded && !defaultExpanded && expandedProp === undefined) {
			// auto-collapse only once when streaming flips off and consumer hasn't pinned state
			setExpanded(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [streaming]);

	const headerLabel: ReactNode = streaming ? (
		<AiShimmer>{strings.thinking}</AiShimmer>
	) : durationSeconds !== undefined ? (
		<Text size="sm" weight="medium">
			{interpolate(strings.thoughtFor, { seconds: durationSeconds.toFixed(1) })}
		</Text>
	) : (
		<Text size="sm" weight="medium">
			{strings.thoughtDone}
		</Text>
	);

	return (
		<div
			className={cn(
				'overflow-hidden rounded-lg border border-border/60 bg-muted/20',
				className,
			)}
		>
			<button
				type="button"
				onClick={() => setExpanded(!expanded)}
				aria-expanded={expanded}
				aria-label={expanded ? strings.collapseAria : strings.expandAria}
				className={cn(
					'flex w-full items-center gap-2 px-3 py-2 text-left',
					'hover:bg-muted/30',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
				)}
			>
				<Brain className="size-3.5 text-muted-foreground" />
				<div className="flex-1">{headerLabel}</div>
				{expanded ? (
					<ChevronDown className="size-3.5 text-muted-foreground" />
				) : (
					<ChevronRight className="size-3.5 text-muted-foreground" />
				)}
			</button>

			{expanded && (
				<div className="border-t border-border/60 px-3 py-2.5">
					{typeof children === 'string' ? (
						<Text type="secondary" lineHeight="relaxed" className="whitespace-pre-wrap">
							{children}
						</Text>
					) : (
						<div className="whitespace-pre-wrap">{children}</div>
					)}
				</div>
			)}
		</div>
	);
}

AiReasoning.displayName = 'AiReasoning';
