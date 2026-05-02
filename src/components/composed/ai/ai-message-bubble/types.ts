import type { ReactNode } from 'react';

export type AiMessageRole = 'assistant' | 'user' | 'system';

export interface AiMessageBubbleStrings {
	copyAria: string;
	copied: string;
	regenerateAria: string;
}

export const defaultAiMessageBubbleStrings: AiMessageBubbleStrings = {
	copyAria: 'Copy message',
	copied: 'Copied',
	regenerateAria: 'Regenerate response',
};

export interface AiMessageBubbleProps {
	role?: AiMessageRole;
	avatar?: ReactNode;
	avatarLabel?: string;
	authorName?: ReactNode;
	timestamp?: ReactNode;
	children?: ReactNode;
	/** Plain-text version of the message content; used for the copy action. */
	plainText?: string;
	loading?: boolean;
	onCopy?: () => void;
	onRegenerate?: () => void;
	className?: string;
	strings?: Partial<AiMessageBubbleStrings>;
}
