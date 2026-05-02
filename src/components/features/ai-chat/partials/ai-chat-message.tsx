/**
 * AiChatMessage — message renderer that wraps `<AiMessageBubble>` and routes
 * each `parts[]` entry to its dedicated `composed/ai/*` surface (text, code,
 * tool calls, reasoning, sources, attachments, …).
 *
 * Most surfaces sit BELOW the bubble (artifact, sources, task) since they
 * carry their own chrome; plain text and inline citations render INSIDE the
 * bubble. Custom-typed parts call `render()` directly.
 */
import type { ReactNode } from 'react';
import { AiArtifact } from '@/components/composed/ai/ai-artifact';
import { AiChainOfThought } from '@/components/composed/ai/ai-chain-of-thought';
import { AiCodeBlock } from '@/components/composed/ai/ai-code-block';
import { AiConfirmation } from '@/components/composed/ai/ai-confirmation';
import { AiMessageBubble } from '@/components/composed/ai/ai-message-bubble';
import { AiReasoning } from '@/components/composed/ai/ai-reasoning';
import { AiShimmer } from '@/components/composed/ai/ai-shimmer';
import { AiSources } from '@/components/composed/ai/ai-sources';
import { AiTask } from '@/components/composed/ai/ai-task';
import { AiToolCall } from '@/components/composed/ai/ai-tool-call';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiChatMessageStrings,
	type AiChatMessageStrings,
} from '../ai-chat.strings';
import type {
	AiChatMessage as AiChatMessageType,
	AiChatMessagePart,
} from '../ai-chat.types';
import { AiChatAttachmentsStrip } from './ai-chat-attachments-strip';

export interface AiChatMessageProps {
	message: AiChatMessageType;
	/** Copy callback forwarded to the underlying bubble. */
	onCopy?: () => void;
	/** Regenerate callback forwarded to the underlying bubble (assistant only). */
	onRegenerate?: () => void;
	/** Open handler for attachment chips inside the message. */
	onAttachmentOpen?: (attachmentId: string) => void;
	className?: string;
	strings?: Partial<AiChatMessageStrings>;
}

export function AiChatMessage({
	message,
	onCopy,
	onRegenerate,
	onAttachmentOpen,
	className,
	strings: stringsProp,
}: AiChatMessageProps) {
	const strings = useStrings(defaultAiChatMessageStrings, stringsProp);

	// Split parts: in-bubble (text) vs below-bubble (everything else).
	const inBubble: AiChatMessagePart[] = [];
	const below: AiChatMessagePart[] = [];
	for (const part of message.parts) {
		if (part.type === 'text') inBubble.push(part);
		else below.push(part);
	}

	const plainText =
		inBubble
			.map((p) => (p.type === 'text' ? p.plain ?? extractPlain(p.content) : ''))
			.filter(Boolean)
			.join('\n') || undefined;

	const bubbleContent: ReactNode = message.pending ? (
		<AiShimmer>{strings.pending}</AiShimmer>
	) : inBubble.length === 0 && below.length > 0 ? null : (
		<div className="space-y-2">
			{inBubble.map((part, idx) =>
				part.type === 'text' ? (
					<div key={idx} className="whitespace-pre-wrap">
						{part.content}
					</div>
				) : null,
			)}
		</div>
	);

	return (
		<div className={cn('space-y-2', className)}>
			{(bubbleContent !== null || message.pending) && (
				<AiMessageBubble
					role={message.role}
					avatar={message.avatar}
					authorName={message.authorName}
					timestamp={message.timestamp}
					plainText={plainText}
					loading={message.loading}
					onCopy={plainText ? onCopy ?? (() => undefined) : undefined}
					onRegenerate={onRegenerate}
				>
					{bubbleContent}
				</AiMessageBubble>
			)}

			{below.length > 0 && (
				<div
					className={cn(
						'space-y-2',
						message.role === 'user'
							? 'pr-9 sm:pl-12'
							: 'pl-9 sm:pr-12',
					)}
				>
					{below.map((part, idx) => (
						<PartRenderer
							key={idx}
							part={part}
							onAttachmentOpen={onAttachmentOpen}
						/>
					))}
				</div>
			)}

			{!!message.trailing && (
				<div
					className={cn(
						message.role === 'user' ? 'pr-9 sm:pl-12' : 'pl-9 sm:pr-12',
					)}
				>
					{message.trailing}
				</div>
			)}
		</div>
	);
}

AiChatMessage.displayName = 'AiChatMessage';

function PartRenderer({
	part,
	onAttachmentOpen,
}: {
	part: AiChatMessagePart;
	onAttachmentOpen?: (id: string) => void;
}) {
	switch (part.type) {
		case 'text':
			// In-bubble. Should not reach here.
			return <Text>{part.content}</Text>;
		case 'reasoning':
			return (
				<AiReasoning
					streaming={part.streaming}
					durationSeconds={part.durationSeconds}
				>
					{part.content}
				</AiReasoning>
			);
		case 'chain-of-thought':
			return <AiChainOfThought steps={part.steps} streaming={part.streaming} />;
		case 'tool':
			return (
				<AiToolCall
					name={part.name}
					status={part.status}
					icon={part.icon}
					args={part.args}
					result={part.result}
					error={part.error}
					durationMs={part.durationMs}
					defaultExpanded={part.defaultExpanded}
				/>
			);
		case 'code':
			return (
				<AiCodeBlock
					code={part.code}
					language={part.language}
					filename={part.filename}
					showLineNumbers={part.showLineNumbers}
					highlightLines={part.highlightLines}
				/>
			);
		case 'attachments':
			return (
				<AiChatAttachmentsStrip
					attachments={part.items}
					onOpen={onAttachmentOpen ? (att) => onAttachmentOpen(att.id) : undefined}
				/>
			);
		case 'sources':
			return (
				<AiSources
					sources={part.items}
					variant={part.variant}
					defaultExpanded={part.defaultExpanded}
				/>
			);
		case 'task':
			return <AiTask task={part.task} />;
		case 'artifact':
			return (
				<AiArtifact
					title={part.title}
					subtitle={part.subtitle}
					icon={part.icon}
					copyText={part.copyText}
					actions={part.actions}
					onOpen={part.onOpen}
					onDownload={part.onDownload}
				>
					{part.body}
				</AiArtifact>
			);
		case 'confirmation':
			return (
				<AiConfirmation
					title={part.title}
					description={part.description}
					tone={part.tone}
					status={part.status}
					details={part.details}
					onApprove={part.onApprove}
					onReject={part.onReject}
				/>
			);
		case 'custom':
			return <>{part.render()}</>;
		default:
			return null;
	}
}

function extractPlain(node: ReactNode): string {
	if (typeof node === 'string' || typeof node === 'number') return String(node);
	if (Array.isArray(node)) return node.map(extractPlain).join('');
	return '';
}
