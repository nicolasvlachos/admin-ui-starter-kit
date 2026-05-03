/**
 * AiCitation — expandable source list for AI-grounded responses. Renders an
 * inline footnote-style header (e.g. "3 sources") that toggles a list of
 * source rows: title link, snippet, publisher / date, and a relevance bar.
 * Use under `AiSummaryBlock` and `AiMessageBubble` to make AI claims
 * traceable. Strings overridable for i18n.
 *
 * Note: `strings.sourceCount` is a function (single / plural form) — pass an
 * override if your locale needs more complex pluralisation.
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Quote } from 'lucide-react';
import { Text } from '@/components/typography';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { mergeStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiCitationStrings,
	type AiCitationProps,
	type AiCitationSource,
} from './types';

export function AiCitation({
	sources,
	defaultExpanded = false,
	maxCollapsedRows = 0,
	className,
	strings: stringsProp,
}: AiCitationProps) {
	// `sourceCount` is a function so we cannot use `useStrings` deep-merge
	// (the merger replaces functions wholesale, which is what we want).
	const strings = mergeStrings(defaultAiCitationStrings, stringsProp);
	const [expanded, setExpanded] = useState(defaultExpanded);
	const visible = expanded ? sources : sources.slice(0, Math.max(0, maxCollapsedRows));
	const hidden = sources.length - visible.length;

	return (
		<div className={cn('ai-citation--component', 'space-y-2', className)}>
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className={cn(
					'inline-flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2',
					'text-muted-foreground hover:text-foreground hover:bg-muted/40',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
				)}
				aria-expanded={expanded}
				aria-label={expanded ? strings.collapse : strings.expand}
			>
				<Quote className="size-3.5" />
				<Text size="xs" weight="medium">
					{strings.title} · {strings.sourceCount(sources.length)}
				</Text>
				{expanded ? (
					<ChevronDown className="size-3.5" />
				) : (
					<ChevronRight className="size-3.5" />
				)}
			</button>

			{(expanded || maxCollapsedRows > 0) && (
				<ItemGroup>
					{visible.map((s, i) => (
						<CitationRow key={s.id} source={s} index={i + 1} strings={strings} />
					))}
					{!expanded && hidden > 0 && (
						<Text size="xxs" type="secondary">
							+{hidden} more
						</Text>
					)}
				</ItemGroup>
			)}
		</div>
	);
}

AiCitation.displayName = 'AiCitation';

function CitationRow({
	source,
	index,
	strings,
}: {
	source: AiCitationSource;
	index: number;
	strings: ReturnType<typeof mergeStrings<typeof defaultAiCitationStrings>>;
}) {
	const relevancePct =
		typeof source.relevance === 'number'
			? Math.round(Math.max(0, Math.min(1, source.relevance)) * 100)
			: null;

	const TitleEl = source.url ? 'a' : 'span';
	const titleProps = source.url
		? { href: source.url, target: '_blank' as const, rel: 'noopener noreferrer' }
		: {};

	return (
		<Item variant="outline" size="xs" className="items-start">
			<ItemMedia>
				<span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xxs font-semibold text-muted-foreground tabular-nums">
					{index}
				</span>
			</ItemMedia>
			<ItemContent>
				<ItemTitle className="truncate">
					<TitleEl
						{...titleProps}
						className={cn(
							'truncate',
							source.url && 'hover:text-primary hover:underline',
						)}
					>
						{source.title}
						{!!source.url && <ExternalLink className="ml-1 inline size-3 align-baseline" />}
					</TitleEl>
				</ItemTitle>
				{!!source.snippet && <ItemDescription clamp={2}>{source.snippet}</ItemDescription>}
				{(source.publisher || source.publishedAt) && (
					<ItemFooter className="mt-1 justify-start gap-1.5">
						{!!source.publisher && (
							<Text size="xxs" type="discrete">
								{source.publisher}
							</Text>
						)}
						{!!source.publisher && !!source.publishedAt && (
							<Text size="xxs" type="discrete">·</Text>
						)}
						{!!source.publishedAt && (
							<Text size="xxs" type="discrete" className="tabular-nums">
								{source.publishedAt}
							</Text>
						)}
					</ItemFooter>
				)}
			</ItemContent>
			{relevancePct !== null && (
				<ItemActions className="w-16 flex-col items-end gap-0.5">
					<Text size="xxs" type="secondary" weight="medium" className="tabular-nums">
						{relevancePct}%
					</Text>
					<div
						className="h-1 w-full overflow-hidden rounded-full bg-muted"
						aria-label={strings.relevance}
					>
						<div
							className="h-full rounded-full bg-primary"
							style={{ width: `${relevancePct}%` }}
						/>
					</div>
				</ItemActions>
			)}
		</Item>
	);
}
