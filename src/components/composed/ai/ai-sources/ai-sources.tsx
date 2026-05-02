/**
 * AiSources — light-weight source list rendered under streamed content. Two
 * shapes: `list` is a vertical stack of source rows (favicon + title + host);
 * `avatars` is a compact stacked-favicon strip used when space is tight (chat
 * footer, side panel header). For richer "expandable" footnote-style sources
 * with relevance bars and snippets, see `<AiCitation>`.
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Globe } from 'lucide-react';
import { Text } from '@/components/typography';
import { mergeStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiSourcesStrings,
	type AiSourceItem,
	type AiSourcesProps,
} from './types';

function interpolate(template: string, params: Record<string, string | number>): string {
	return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => {
		const v = params[k];
		return v === undefined ? m : String(v);
	});
}

export function AiSources({
	sources,
	variant = 'list',
	maxAvatars = 5,
	defaultExpanded = false,
	onSelect,
	className,
	strings: stringsProp,
}: AiSourcesProps) {
	const strings = mergeStrings(defaultAiSourcesStrings, stringsProp);
	const [expanded, setExpanded] = useState(defaultExpanded);
	const titleText = interpolate(strings.title, { count: sources.length });

	if (variant === 'avatars') {
		return (
			<AvatarStrip
				sources={sources}
				max={maxAvatars}
				title={titleText}
				onSelect={onSelect}
				className={className}
			/>
		);
	}

	const visible = expanded ? sources : sources.slice(0, 0);

	return (
		<div className={cn('rounded-lg border border-border/60 bg-card', className)}>
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				aria-expanded={expanded}
				aria-label={expanded ? strings.collapse : strings.expand}
				className={cn(
					'flex w-full items-center gap-2 px-3 py-2 text-left',
					'rounded-lg hover:bg-muted/40',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
				)}
			>
				<AvatarStack sources={sources.slice(0, 4)} />
				<Text size="xs" weight="medium" className="flex-1">
					{titleText}
				</Text>
				{expanded ? (
					<ChevronDown className="size-3.5 text-muted-foreground" />
				) : (
					<ChevronRight className="size-3.5 text-muted-foreground" />
				)}
			</button>

			{expanded && (
				<ol className="border-t border-border/60 px-2 py-2 space-y-0.5">
					{visible.map((source, idx) => (
						<SourceRow
							key={source.id}
							source={source}
							index={idx + 1}
							onSelect={onSelect ? () => onSelect(source, idx) : undefined}
							visitLabel={strings.visit}
						/>
					))}
				</ol>
			)}
		</div>
	);
}

AiSources.displayName = 'AiSources';

function AvatarStrip({
	sources,
	max,
	title,
	onSelect,
	className,
}: {
	sources: ReadonlyArray<AiSourceItem>;
	max: number;
	title: string;
	onSelect?: (source: AiSourceItem, index: number) => void;
	className?: string;
}) {
	const visible = sources.slice(0, max);
	const overflow = sources.length - visible.length;
	return (
		<div className={cn('inline-flex items-center gap-2', className)}>
			<AvatarStack sources={visible} onSelect={onSelect} />
			<Text size="xs" type="secondary">
				{title}
			</Text>
			{overflow > 0 && (
				<Text size="xxs" type="discrete" className="tabular-nums">
					+{overflow}
				</Text>
			)}
		</div>
	);
}

function AvatarStack({
	sources,
	onSelect,
}: {
	sources: ReadonlyArray<AiSourceItem>;
	onSelect?: (source: AiSourceItem, index: number) => void;
}) {
	return (
		<div className="flex -space-x-1.5">
			{sources.map((s, i) => {
				const visual = (
					<span
						key={s.id}
						aria-hidden
						title={typeof s.title === 'string' ? s.title : undefined}
						className="inline-flex size-5 items-center justify-center overflow-hidden rounded-full border border-card bg-muted text-muted-foreground ring-1 ring-border/60"
					>
						{s.faviconUrl ? (
							<img
								src={s.faviconUrl}
								alt=""
								className="size-full object-cover"
							/>
						) : (
							<Globe className="size-3" />
						)}
					</span>
				);
				if (onSelect) {
					return (
						<button
							key={s.id}
							type="button"
							onClick={() => onSelect(s, i)}
							className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
						>
							{visual}
						</button>
					);
				}
				return visual;
			})}
		</div>
	);
}

function SourceRow({
	source,
	index,
	onSelect,
	visitLabel,
}: {
	source: AiSourceItem;
	index: number;
	onSelect?: () => void;
	visitLabel: string;
}) {
	const TitleEl = source.url && !onSelect ? 'a' : onSelect ? 'button' : 'span';
	const titleProps =
		source.url && !onSelect
			? { href: source.url, target: '_blank' as const, rel: 'noopener noreferrer' }
			: onSelect
				? { type: 'button' as const, onClick: onSelect }
				: {};
	return (
		<li>
			<TitleEl
				{...titleProps}
				className={cn(
					'group flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left',
					(source.url || onSelect) &&
						'hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
				)}
				aria-label={source.url ? visitLabel : undefined}
			>
				<span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xxs font-semibold text-muted-foreground tabular-nums">
					{index}
				</span>
				<div className="min-w-0 flex-1">
					<Text weight="medium" className="truncate">
						{source.title}
						{!!source.url && (
							<ExternalLink className="ml-1 inline size-3 text-muted-foreground/70 align-baseline" />
						)}
					</Text>
					{!!source.publisher && (
						<Text size="xxs" type="secondary" className="truncate">
							{source.publisher}
						</Text>
					)}
					{!!source.snippet && (
						<Text size="xs" type="secondary" className="mt-1 line-clamp-2">
							{source.snippet}
						</Text>
					)}
				</div>
			</TitleEl>
		</li>
	);
}
