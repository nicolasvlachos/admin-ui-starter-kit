/**
 * AiChatEmptyState — default empty surface for `<AiChat>` when no messages
 * are present and no intro is provided. Centers a title + description with
 * an optional below-content slot for prompt-suggestion grids.
 */
import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { IconBadge } from '@/components/base/display';
import { Heading, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface AiChatEmptyStateProps {
	title?: ReactNode;
	description?: ReactNode;
	icon?: React.ElementType;
	below?: ReactNode;
	className?: string;
}

export function AiChatEmptyState({
	title = 'Start a conversation',
	description,
	icon: IconComponent = Sparkles,
	below,
	className,
}: AiChatEmptyStateProps) {
	return (
		<div className={cn('flex h-full flex-col items-center justify-center gap-3 px-4 py-10 text-center', className)}>
			<IconBadge icon={IconComponent} tone="primary" size="md" shape="square" />
			<div className="max-w-md space-y-1">
				<Heading tag="h4">{title}</Heading>
				{!!description && (
					<Text type="secondary">{description}</Text>
				)}
			</div>
			{!!below && <div className="mt-4 w-full max-w-2xl">{below}</div>}
		</div>
	);
}

AiChatEmptyState.displayName = 'AiChatEmptyState';
