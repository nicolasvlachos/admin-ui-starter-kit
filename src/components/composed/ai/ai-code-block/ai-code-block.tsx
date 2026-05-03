/**
 * AiCodeBlock — code surface used inside AI responses and artifacts.
 * Renders a header (language label, optional filename, copy button), a
 * scrollable `<pre>` body, and optional line numbers / highlighted ranges.
 * No syntax highlighting is performed here — that belongs to a consumer-side
 * highlighter pass; we focus on the chrome, layout, and copy UX.
 */
import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultAiCodeBlockStrings, type AiCodeBlockProps } from './types';

export function AiCodeBlock({
	code,
	language,
	filename,
	showLineNumbers = false,
	highlightLines,
	hideHeader = false,
	maxHeight,
	headerActions,
	onCopy,
	className,
	strings: stringsProp,
}: AiCodeBlockProps) {
	const strings = useStrings(defaultAiCodeBlockStrings, stringsProp);
	const [copied, setCopied] = useState(false);

	const lines = useMemo(() => code.split('\n'), [code]);
	const highlightSet = useMemo(
		() => new Set(highlightLines ?? []),
		[highlightLines],
	);

	const handleCopy = () => {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			void navigator.clipboard.writeText(code);
		}
		setCopied(true);
		onCopy?.();
		window.setTimeout(() => setCopied(false), 1500);
	};

	const headerLabel = filename || language || strings.defaultLanguageLabel;

	return (
		<div
			className={cn('ai-code-block--component', 
				'overflow-hidden rounded-lg border border-border/60 bg-card',
				className,
			)}
		>
			{!hideHeader && (
				<div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-1.5">
					<Text
						size="xxs"
						type="secondary"
						weight="medium"
						className="font-mono uppercase tracking-wider"
					>
						{headerLabel}
					</Text>
					{!!filename && !!language && (
						<>
							<span aria-hidden className="text-muted-foreground/60">
								·
							</span>
							<Text size="xxs" type="discrete" className="font-mono lowercase">
								{language}
							</Text>
						</>
					)}
					<div className="ml-auto flex items-center gap-1">
						{headerActions}
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							size="icon-xs"
							aria-label={strings.copyAria}
							onClick={handleCopy}
						>
							{copied ? (
								<Check className="size-3.5 text-success" />
							) : (
								<Copy className="size-3.5" />
							)}
						</Button>
					</div>
				</div>
			)}
			<div
				className="overflow-auto"
				style={
					maxHeight !== undefined
						? {
								maxHeight:
									typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
							}
						: undefined
				}
			>
				<pre className="m-0 px-3 py-2.5 font-mono text-xs leading-relaxed">
					{showLineNumbers ? (
						<table className="w-full border-collapse">
							<tbody>
								{lines.map((line, idx) => {
									const lineNum = idx + 1;
									const highlighted = highlightSet.has(lineNum);
									return (
										<tr
											key={idx}
											className={cn(
												highlighted && 'bg-primary/10',
											)}
										>
											<td
												className={cn(
													'select-none pr-3 text-right tabular-nums text-muted-foreground/70',
													'w-[2.25rem] min-w-[2.25rem]',
												)}
											>
												{lineNum}
											</td>
											<td className="whitespace-pre">{line || ' '}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<code className="block whitespace-pre">{code}</code>
					)}
				</pre>
			</div>
		</div>
	);
}

AiCodeBlock.displayName = 'AiCodeBlock';
