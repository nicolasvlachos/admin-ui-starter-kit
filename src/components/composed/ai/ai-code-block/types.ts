import type { ReactNode } from 'react';

export interface AiCodeBlockStrings {
	copy: string;
	copied: string;
	copyAria: string;
	/** Header label when no language is provided. */
	defaultLanguageLabel: string;
}

export const defaultAiCodeBlockStrings: AiCodeBlockStrings = {
	copy: 'Copy',
	copied: 'Copied',
	copyAria: 'Copy code',
	defaultLanguageLabel: 'Code',
};

export interface AiCodeBlockProps {
	/** The code to render. Pre-formatted text. */
	code: string;
	/** Display label for the language (e.g. "TypeScript", "shell"). */
	language?: string;
	/** Optional filename rendered in the header next to the language label. */
	filename?: string;
	/** Render with line numbers. */
	showLineNumbers?: boolean;
	/** Highlight specific 1-indexed line numbers. */
	highlightLines?: ReadonlyArray<number>;
	/** Hide the header strip entirely. */
	hideHeader?: boolean;
	/** Force max-height before scroll. */
	maxHeight?: number | string;
	/** Trailing slot inside the header (e.g. extra action button). */
	headerActions?: ReactNode;
	/** Fired when the user copies (after the navigator.clipboard write). */
	onCopy?: () => void;
	className?: string;
	strings?: Partial<AiCodeBlockStrings>;
}
