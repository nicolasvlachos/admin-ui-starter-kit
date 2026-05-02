export interface AiInlineCitationStrings {
	/** Tooltip prefix when only a number is rendered. */
	sourcePrefix: string;
	/** Aria label template — supports `{{n}}` and `{{title}}` placeholders. */
	openAria: string;
}

export const defaultAiInlineCitationStrings: AiInlineCitationStrings = {
	sourcePrefix: 'Source',
	openAria: 'Open source {{n}}: {{title}}',
};

export interface AiInlineCitationProps {
	/** 1-indexed citation number rendered inside the pill. */
	index: number;
	/** Title of the cited source — used in the tooltip / aria-label. */
	title?: string;
	/** Optional URL — when provided, the pill renders as a link. */
	url?: string;
	/** Click handler — preferred over `url` for SPA / virtual link routing. */
	onSelect?: () => void;
	className?: string;
	strings?: Partial<AiInlineCitationStrings>;
}
