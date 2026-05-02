/**
 * AiChatAttachmentsStrip — flex-wrap row of `<AiAttachment>` chips. Used both
 * in the prompt input (staged uploads — pass `onRemove` to enable a remove
 * button) and inside messages (read-only attachment list).
 */
import { AiAttachment } from '@/components/composed/ai/ai-attachment';
import { cn } from '@/lib/utils';

import type { AiChatAttachment } from '../ai-chat.types';

export interface AiChatAttachmentsStripProps {
	attachments: ReadonlyArray<AiChatAttachment>;
	/** When set, each chip gets a remove button wired to this handler. */
	onRemove?: (id: string) => void;
	/** When set, click on a chip calls this. */
	onOpen?: (att: AiChatAttachment) => void;
	className?: string;
}

export function AiChatAttachmentsStrip({
	attachments,
	onRemove,
	onOpen,
	className,
}: AiChatAttachmentsStripProps) {
	if (attachments.length === 0) return null;
	return (
		<div className={cn('flex flex-wrap gap-2', className)}>
			{attachments.map((att) => (
				<AiAttachment
					key={att.id}
					name={att.name}
					meta={att.meta}
					kind={att.kind}
					icon={att.icon}
					thumbnailUrl={att.thumbnailUrl}
					progress={att.progress}
					errored={att.errored}
					onOpen={onOpen ? () => onOpen(att) : undefined}
					onRemove={onRemove ? () => onRemove(att.id) : undefined}
				/>
			))}
		</div>
	);
}

AiChatAttachmentsStrip.displayName = 'AiChatAttachmentsStrip';
