/**
 * HighlightedText Component
 */

import * as React from 'react';

export interface HighlightedTextProps {
	text: string;
	highlight: string;
	highlightClassName?: string;
}

function escapeRegExp(str: string): string {
	return str.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');
}

export function HighlightedText({
	text,
	highlight,
	highlightClassName = 'bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5',
}: HighlightedTextProps): React.ReactNode {
	if (!highlight.trim()) {
		return text;
	}

	const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
	const parts = text.split(regex);
	let cursor = 0;

	return (
		<>
			{parts.map((part, index) => {
				const isMatch = index % 2 === 1;
				const key = String(cursor);
				cursor += part.length;

				if (isMatch) {
					return (
						<mark key={key} className={highlightClassName}>
							{part}
						</mark>
					);
				}

				return <span key={key}>{part}</span>;
			})}
		</>
	);
}

HighlightedText.displayName = 'HighlightedText';
