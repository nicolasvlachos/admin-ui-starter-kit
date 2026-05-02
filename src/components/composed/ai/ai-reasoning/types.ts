import type { ReactNode } from 'react';

export interface AiReasoningStrings {
	/** Header label when collapsed and reasoning is in progress. */
	thinking: string;
	/** Header label when reasoning is complete (uses `{{seconds}}` placeholder). */
	thoughtFor: string;
	/** Header label when no duration is available. */
	thoughtDone: string;
	expandAria: string;
	collapseAria: string;
}

export const defaultAiReasoningStrings: AiReasoningStrings = {
	thinking: 'Thinking…',
	thoughtFor: 'Thought for {{seconds}}s',
	thoughtDone: 'Reasoning complete',
	expandAria: 'Expand reasoning',
	collapseAria: 'Collapse reasoning',
};

export interface AiReasoningProps {
	/** Reasoning trace — typically streamed plaintext. */
	children?: ReactNode;
	/** Show the live "Thinking…" header with shimmer. */
	streaming?: boolean;
	/** Total elapsed time in seconds — shown in the collapsed-done header. */
	durationSeconds?: number;
	/** Auto-expand while streaming. */
	expandWhileStreaming?: boolean;
	/** Initial expanded state. */
	defaultExpanded?: boolean;
	/** Controlled expanded state. */
	expanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	className?: string;
	strings?: Partial<AiReasoningStrings>;
}
