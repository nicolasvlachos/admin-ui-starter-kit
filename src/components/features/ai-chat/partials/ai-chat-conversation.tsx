/**
 * AiChatConversation — scrollable list container for chat messages with
 * auto-stick-to-bottom behaviour. Renders each message via the consumer's
 * `renderMessage` slot (or the default `<AiChatMessage>` via the parent
 * `<AiChat>`). Surfaces a "Jump to latest" pill when the user scrolls away
 * from the bottom while content streams in.
 */
import { ArrowDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiChatConversationStrings,
	type AiChatConversationStrings,
} from '../ai-chat.strings';
import type {
	AiChatMessage as AiChatMessageType,
	AiChatRenderMessageContext,
} from '../ai-chat.types';
import { useAiChatScroll } from '../hooks/use-ai-chat-scroll';

export interface AiChatConversationProps {
	messages: ReadonlyArray<AiChatMessageType>;
	renderMessage: (
		message: AiChatMessageType,
		ctx: AiChatRenderMessageContext,
	) => ReactNode;
	/** Render before the messages list (intro card, agent greeting). */
	intro?: ReactNode;
	/** Render after the messages list (e.g. tip ribbon). */
	footer?: ReactNode;
	/** Replaces the empty state when `messages.length === 0`. */
	empty?: ReactNode;
	/** Pause auto-scroll-on-update. */
	disableAutoScroll?: boolean;
	className?: string;
	strings?: Partial<AiChatConversationStrings>;
}

export function AiChatConversation({
	messages,
	renderMessage,
	intro,
	footer,
	empty,
	disableAutoScroll,
	className,
	strings: stringsProp,
}: AiChatConversationProps) {
	const strings = useStrings(defaultAiChatConversationStrings, stringsProp);
	const { containerRef, endRef, isAtBottom, scrollToBottom } = useAiChatScroll({
		dependency: messages.length,
		disableAutoScroll,
	});

	const isEmpty = messages.length === 0 && !intro;

	return (
		<div className={cn('relative flex h-full min-h-0 flex-col', className)}>
			<div
				ref={containerRef}
				className="flex-1 overflow-y-auto px-3 py-4 sm:px-4"
			>
				{!!intro && <div className="mb-4">{intro}</div>}

				{isEmpty ? (
					empty ?? (
						<div className="flex h-full items-center justify-center px-6 py-12">
							<Text type="secondary">No messages yet.</Text>
						</div>
					)
				) : (
					<ol className="space-y-4">
						{messages.map((message, idx) => {
							const ctx: AiChatRenderMessageContext = {
								isLast: idx === messages.length - 1,
								index: idx,
							};
							return (
								<li key={message.id}>{renderMessage(message, ctx)}</li>
							);
						})}
					</ol>
				)}

				{!!footer && <div className="mt-4">{footer}</div>}

				<div ref={endRef} aria-hidden className="h-px" />
			</div>

			{!isAtBottom && (
				<div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
					<Button
						type="button"
						variant="secondary"
						buttonStyle="solid"
						aria-label={strings.scrollToBottomAria}
						onClick={() => scrollToBottom('smooth')}
						className={cn(
							'pointer-events-auto rounded-full shadow-md',
							'border border-border/60',
						)}
					>
						<ArrowDown className="size-3.5" />
						{strings.scrollToBottom}
					</Button>
				</div>
			)}
		</div>
	);
}

AiChatConversation.displayName = 'AiChatConversation';
