import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import type { AiAgentProps } from '@/components/composed/ai/ai-agent';
import type {
	AiArtifactAction,
} from '@/components/composed/ai/ai-artifact';
import type {
	AiAttachmentKind,
} from '@/components/composed/ai/ai-attachment';
import type {
	AiChainStep,
} from '@/components/composed/ai/ai-chain-of-thought';
import type {
	AiConfirmationStatus,
	AiConfirmationTone,
} from '@/components/composed/ai/ai-confirmation';
import type { AiMessageRole } from '@/components/composed/ai/ai-message-bubble';
import type { AiSourceItem, AiSourcesVariant } from '@/components/composed/ai/ai-sources';
import type { AiTaskItem } from '@/components/composed/ai/ai-task';
import type { AiToolCallStatus } from '@/components/composed/ai/ai-tool-call';

/** A single attachment carried by a message (input or output). */
export interface AiChatAttachment {
	id: string;
	name: string;
	meta?: string;
	kind?: AiAttachmentKind;
	icon?: LucideIcon;
	thumbnailUrl?: string;
	/** Optional URL the consumer can use to open the attachment. */
	url?: string;
	/** In-flight upload progress (0..1) — surfaces a progress bar in the chip. */
	progress?: number;
	errored?: boolean;
}

/**
 * A single part inside a message. Messages can mix several parts to render
 * rich AI responses (text + tool call trace + code block + sources). Each
 * part is delegated to its dedicated `composed/ai/*` surface.
 */
export type AiChatMessagePart =
	| { type: 'text'; content: ReactNode; plain?: string }
	| {
			type: 'reasoning';
			content: ReactNode;
			streaming?: boolean;
			durationSeconds?: number;
		}
	| {
			type: 'chain-of-thought';
			steps: ReadonlyArray<AiChainStep>;
			streaming?: boolean;
		}
	| {
			type: 'tool';
			name: string;
			status: AiToolCallStatus;
			icon?: LucideIcon;
			args?: ReactNode;
			result?: ReactNode;
			error?: ReactNode;
			durationMs?: number;
			defaultExpanded?: boolean;
		}
	| {
			type: 'code';
			code: string;
			language?: string;
			filename?: string;
			showLineNumbers?: boolean;
			highlightLines?: ReadonlyArray<number>;
		}
	| { type: 'attachments'; items: ReadonlyArray<AiChatAttachment> }
	| {
			type: 'sources';
			items: ReadonlyArray<AiSourceItem>;
			variant?: AiSourcesVariant;
			defaultExpanded?: boolean;
		}
	| { type: 'task'; task: AiTaskItem }
	| {
			type: 'artifact';
			title: ReactNode;
			subtitle?: ReactNode;
			icon?: LucideIcon;
			copyText?: string;
			body?: ReactNode;
			actions?: ReadonlyArray<AiArtifactAction>;
			onOpen?: () => void;
			onDownload?: () => void;
		}
	| {
			type: 'confirmation';
			title: ReactNode;
			description?: ReactNode;
			tone?: AiConfirmationTone;
			status?: AiConfirmationStatus;
			details?: ReactNode;
			onApprove?: () => void;
			onReject?: () => void;
		}
	| { type: 'custom'; render: () => ReactNode };

/** A single message in a conversation. */
export interface AiChatMessage {
	id: string;
	role: AiMessageRole;
	/** Author name (e.g. "Claude", "Atlas", "You"). Defaults to role-derived label in the bubble. */
	authorName?: string;
	/** Display avatar override — typically the agent icon. */
	avatar?: ReactNode;
	/** Display timestamp. */
	timestamp?: ReactNode;
	/** Message body — one or more parts. */
	parts: ReadonlyArray<AiChatMessagePart>;
	/** Loading state — animates the bubble while content is streaming. */
	loading?: boolean;
	/** Render the shimmer "Thinking…" placeholder INSTEAD of any parts. */
	pending?: boolean;
	/** Trailing slot beneath the bubble (e.g. `<AiFeedback>`). */
	trailing?: ReactNode;
}

/** Quick suggestion shown above the prompt input. */
export interface AiChatSuggestion {
	id: string;
	label: ReactNode;
	icon?: LucideIcon;
	/** Free-form payload echoed to `onPickSuggestion`. */
	data?: unknown;
}

/** A pending entry in the queue (between submit and the assistant turn). */
export interface AiChatQueueItem {
	id: string;
	label: ReactNode;
	status?: 'queued' | 'running';
	onCancel?: () => void;
}

/** Identity of the agent powering the chat — drives the header strip. */
export type AiChatAgent = Pick<
	AiAgentProps,
	'name' | 'icon' | 'avatar' | 'subtitle' | 'tone' | 'status'
>;

/** Render-prop context for a custom `<AiChatMessage>` render. */
export interface AiChatRenderMessageContext {
	isLast: boolean;
	index: number;
}

/** Slot map — every consumer-overridable surface inside the chat. */
export interface AiChatSlots {
	/** Replaces the default header (agent strip + actions). */
	header?: ReactNode;
	/** Render before the messages list (welcome card, agent intro, …). */
	intro?: ReactNode;
	/** Render after messages but before the input (e.g. tip ribbon). */
	belowMessages?: ReactNode;
	/** Replaces the default empty state when no messages exist. */
	empty?: ReactNode;
	/** Replaces the queue strip above the input. */
	queue?: ReactNode;
	/** Replaces the suggestions strip above the input. */
	suggestions?: ReactNode;
	/** Replaces the prompt input entirely. */
	input?: ReactNode;
	/** Per-message custom rendering. Return `null` to skip the message. */
	renderMessage?: (
		message: AiChatMessage,
		ctx: AiChatRenderMessageContext,
	) => ReactNode;
}

/** Composer submit payload. */
export interface AiChatSubmitValues {
	text: string;
	attachments: ReadonlyArray<AiChatAttachment>;
}
