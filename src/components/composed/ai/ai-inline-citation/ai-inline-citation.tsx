/**
 * AiInlineCitation — small footnote-style pill rendered inline inside AI
 * response prose. The number references a position in the parent
 * sources/AiCitation list. Hover to see the source title; click to jump.
 */
import { Text } from '@/components/typography';
import { mergeStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiInlineCitationStrings,
	type AiInlineCitationProps,
} from './types';

function interpolate(template: string, params: Record<string, string | number>): string {
	return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => {
		const v = params[k];
		return v === undefined ? m : String(v);
	});
}

export function AiInlineCitation({
	index,
	title,
	url,
	onSelect,
	className,
	strings: stringsProp,
}: AiInlineCitationProps) {
	const strings = mergeStrings(defaultAiInlineCitationStrings, stringsProp);
	const ariaLabel = interpolate(strings.openAria, {
		n: index,
		title: title ?? '',
	});
	const tooltip = title ? `${strings.sourcePrefix} ${index}: ${title}` : `${strings.sourcePrefix} ${index}`;

	const baseCls = cn(
		'inline-flex h-[1.25em] min-w-[1.25em] -translate-y-px items-center justify-center rounded px-1',
		'align-middle text-[0.75em] font-medium tabular-nums',
		'bg-muted text-muted-foreground',
		'hover:bg-primary/10 hover:text-primary',
		'transition-colors duration-150',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
		className,
	);

	if (url) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				title={tooltip}
				aria-label={ariaLabel}
				className={baseCls}
			>
				<Text tag="span" size="xxs" weight="medium" className="leading-none">
					{index}
				</Text>
			</a>
		);
	}

	if (onSelect) {
		return (
			<button
				type="button"
				onClick={onSelect}
				title={tooltip}
				aria-label={ariaLabel}
				className={baseCls}
			>
				<Text tag="span" size="xxs" weight="medium" className="leading-none">
					{index}
				</Text>
			</button>
		);
	}

	return (
		<span title={tooltip} aria-label={ariaLabel} className={baseCls}>
			<Text tag="span" size="xxs" weight="medium" className="leading-none">
				{index}
			</Text>
		</span>
	);
}

AiInlineCitation.displayName = 'AiInlineCitation';
