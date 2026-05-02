/**
 * AiChat — framework-agnostic AI chat surface. Tie-together component for
 * the `features/ai-chat/*` partials. Renders an optional agent header, the
 * scrollable conversation, an optional queue + suggestions row, and the
 * prompt input.
 *
 * Composition seams:
 *   - `slots`         — replace any region (header, intro, empty, queue,
 *                       suggestions, input, belowMessages) or per-message
 *                       (`renderMessage`).
 *   - `strings`       — deep-partial override of every default copy line
 *                       (prompt, conversation, queue, suggestions, message).
 *   - Partials        — every partial is exported individually so a consumer
 *                       can build a custom layout against the same data shape.
 *
 * Headless usage:
 *   - The `useAiChatScroll` hook is exported for consumers building a
 *     custom conversation layout while keeping auto-stick-to-bottom.
 *
 * Framework-agnostic:
 *   - No router, no i18n SDK, no fetcher. Submission is a callback
 *     (`onSubmit`); messages, queue, attachments are all controlled props.
 */
import { useCallback, useState, type ReactNode } from 'react';
import { AiAgent } from '@/components/composed/ai/ai-agent';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiChatStrings,
	type AiChatStrings,
} from './ai-chat.strings';
import type {
	AiChatAgent,
	AiChatAttachment,
	AiChatMessage as AiChatMessageType,
	AiChatQueueItem,
	AiChatSlots,
	AiChatSubmitValues,
	AiChatSuggestion,
} from './ai-chat.types';
import {
	AiChatConversation,
	AiChatEmptyState,
	AiChatMessage,
	AiChatPromptInput,
	AiChatQueue,
	AiChatSuggestionsRow,
} from './partials';

export interface AiChatProps {
	/** Conversation messages — order is significant. */
	messages: ReadonlyArray<AiChatMessageType>;

	/** Controlled prompt input value. */
	inputValue: string;
	/** Prompt input change callback. */
	onInputChange: (value: string) => void;
	/** Fired on submit (Enter or send button). */
	onSubmit?: (values: AiChatSubmitValues) => void;
	/** Fired when the user clicks the stop button while `streaming`. */
	onStop?: () => void;
	/** Streaming flag — controls submit/stop UI in the prompt input. */
	streaming?: boolean;
	/** Disable composer entirely. */
	disabled?: boolean;

	/** Currently staged attachments. */
	attachments?: ReadonlyArray<AiChatAttachment>;
	/** Remove a staged attachment. */
	onRemoveAttachment?: (id: string) => void;
	/** Fires when the user clicks the attach button. */
	onAttach?: () => void;
	/** Toggles the attach button visibility. Defaults to `true` when `onAttach` is provided. */
	showAttach?: boolean;

	/** Agent identity — drives the optional header strip. Pass `null` to hide. */
	agent?: AiChatAgent | null;
	/** Trailing slot inside the header (e.g. settings button). */
	headerActions?: ReactNode;

	/** Pending message queue (rendered above the input). */
	queue?: ReadonlyArray<AiChatQueueItem>;
	/** Cancel callback — fires per-item when the queue chip's × is clicked. */
	onCancelQueueItem?: (id: string) => void;

	/** Inline quick suggestions (rendered above the input). */
	suggestions?: ReadonlyArray<AiChatSuggestion>;
	/** Suggestion select callback. */
	onPickSuggestion?: (s: AiChatSuggestion) => void;

	/** Per-message copy callback. */
	onMessageCopy?: (message: AiChatMessageType) => void;
	/** Per-message regenerate callback (assistant only). */
	onMessageRegenerate?: (message: AiChatMessageType) => void;
	/** Per-message attachment open callback. */
	onAttachmentOpen?: (messageId: string, attachmentId: string) => void;

	/** Disable auto-stick-to-bottom in the conversation. */
	disableAutoScroll?: boolean;

	/** Slot map for replacing default surfaces. */
	slots?: AiChatSlots;
	/** String overrides. */
	strings?: Partial<AiChatStrings>;
	className?: string;
}

export function AiChat({
	messages,
	inputValue,
	onInputChange,
	onSubmit,
	onStop,
	streaming = false,
	disabled = false,
	attachments = [],
	onRemoveAttachment,
	onAttach,
	showAttach,
	agent,
	headerActions,
	queue = [],
	onCancelQueueItem,
	suggestions = [],
	onPickSuggestion,
	onMessageCopy,
	onMessageRegenerate,
	onAttachmentOpen,
	disableAutoScroll,
	slots,
	strings: stringsProp,
	className,
}: AiChatProps) {
	const strings = useStrings(defaultAiChatStrings, stringsProp);
	const [, force] = useState(0);

	const renderMessage = useCallback(
		(
			message: AiChatMessageType,
			ctx: { isLast: boolean; index: number },
		): ReactNode => {
			if (slots?.renderMessage) {
				return slots.renderMessage(message, ctx);
			}
			return (
				<AiChatMessage
					message={message}
					strings={strings.message}
					onCopy={
						onMessageCopy ? () => onMessageCopy(message) : undefined
					}
					onRegenerate={
						onMessageRegenerate
							? () => onMessageRegenerate(message)
							: undefined
					}
					onAttachmentOpen={
						onAttachmentOpen
							? (attachmentId) => onAttachmentOpen(message.id, attachmentId)
							: undefined
					}
				/>
			);
		},
		[
			onAttachmentOpen,
			onMessageCopy,
			onMessageRegenerate,
			slots,
			strings.message,
		],
	);

	const Header: ReactNode =
		slots?.header ??
		(agent ? (
			<div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2 sm:px-4">
				<AiAgent
					name={agent.name}
					icon={agent.icon}
					avatar={agent.avatar}
					subtitle={agent.subtitle}
					tone={agent.tone}
					status={agent.status}
					variant="inline"
				/>
				{!!headerActions && (
					<div className="ml-auto flex items-center gap-1">{headerActions}</div>
				)}
			</div>
		) : null);

	const Empty: ReactNode =
		slots?.empty ??
		(messages.length === 0 ? (
			<AiChatEmptyState
				title={strings.emptyTitle}
				description={strings.emptyDescription}
			/>
		) : null);

	const Queue: ReactNode =
		slots?.queue ??
		(queue.length > 0 ? (
			<AiChatQueue
				items={queue}
				onCancel={onCancelQueueItem}
				strings={strings.queue}
			/>
		) : null);

	const Suggestions: ReactNode =
		slots?.suggestions ??
		(suggestions.length > 0 ? (
			<AiChatSuggestionsRow
				suggestions={suggestions}
				onPick={onPickSuggestion}
				strings={strings.suggestions}
			/>
		) : null);

	const Input: ReactNode =
		slots?.input ?? (
			<AiChatPromptInput
				value={inputValue}
				onChange={onInputChange}
				onSubmit={(values) => {
					onSubmit?.(values);
					// Force re-render so consumers that read inputValue/attachments
					// from controlled state see the freshly cleared values they
					// pushed in their onSubmit handler.
					force((v) => v + 1);
				}}
				onStop={onStop}
				streaming={streaming}
				disabled={disabled}
				attachments={attachments}
				onRemoveAttachment={onRemoveAttachment}
				onAttach={onAttach}
				showAttach={showAttach}
				strings={strings.prompt}
			/>
		);

	return (
		<div
			className={cn(
				'flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background',
				className,
			)}
		>
			{Header}

			<AiChatConversation
				messages={messages}
				renderMessage={renderMessage}
				intro={slots?.intro}
				footer={slots?.belowMessages}
				empty={Empty}
				disableAutoScroll={disableAutoScroll}
				strings={strings.conversation}
			/>

			{(Queue || Suggestions || Input) && (
				<div className="border-t border-border bg-card/60">
					{Queue && (
						<div className="px-3 pb-2 pt-3 sm:px-4">{Queue}</div>
					)}
					{Suggestions && (
						<div className={cn('px-3 sm:px-4', !Queue && 'pt-3', 'pb-2')}>
							{Suggestions}
						</div>
					)}
					{Input && (
						<div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4">{Input}</div>
					)}
				</div>
			)}

			{disabled && (
				<Text className="sr-only" aria-live="polite">
					Chat is disabled
				</Text>
			)}
		</div>
	);
}

AiChat.displayName = 'AiChat';
