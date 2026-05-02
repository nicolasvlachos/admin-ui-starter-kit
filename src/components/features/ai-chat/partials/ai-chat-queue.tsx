/**
 * AiChatQueue — pending message queue rendered above the prompt input. Used
 * to surface messages the user submitted faster than the assistant could
 * process — each item shows a status pill and an optional cancel control.
 */
import { Loader2, X } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiChatQueueStrings,
	type AiChatQueueStrings,
} from '../ai-chat.strings';
import type { AiChatQueueItem } from '../ai-chat.types';

export interface AiChatQueueProps {
	items: ReadonlyArray<AiChatQueueItem>;
	hideHeader?: boolean;
	onCancel?: (id: string) => void;
	className?: string;
	strings?: Partial<AiChatQueueStrings>;
}

export function AiChatQueue({
	items,
	hideHeader = false,
	onCancel,
	className,
	strings: stringsProp,
}: AiChatQueueProps) {
	const strings = useStrings(defaultAiChatQueueStrings, stringsProp);
	if (items.length === 0) return null;
	return (
		<div
			className={cn(
				'rounded-lg border border-border/60 bg-muted/20 px-2.5 py-2',
				className,
			)}
		>
			{!hideHeader && (
				<Text
					size="xxs"
					type="secondary"
					weight="medium"
					className="mb-1.5 px-1 uppercase tracking-wider"
				>
					{strings.header} · {items.length}
				</Text>
			)}
			<ul className="space-y-1">
				{items.map((item) => {
					const status = item.status ?? 'queued';
					return (
						<li
							key={item.id}
							className="flex items-center gap-2 rounded-md bg-card px-2 py-1.5"
						>
							{status === 'running' ? (
								<Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
							) : (
								<span
									aria-hidden
									className="size-2 shrink-0 rounded-full bg-muted-foreground/50"
								/>
							)}
							<Text size="xs" className="flex-1 truncate">
								{item.label}
							</Text>
							<Badge variant={status === 'running' ? 'primary' : 'secondary'}>
								{status === 'running' ? strings.runningLabel : strings.queuedLabel}
							</Badge>
							{(!!item.onCancel || !!onCancel) && (
								<Button
									type="button"
									variant="secondary"
									buttonStyle="ghost"
									size="icon-xs"
									aria-label={strings.cancelAria}
									onClick={() => {
										item.onCancel?.();
										onCancel?.(item.id);
									}}
								>
									<X className="size-3.5" />
								</Button>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

AiChatQueue.displayName = 'AiChatQueue';
