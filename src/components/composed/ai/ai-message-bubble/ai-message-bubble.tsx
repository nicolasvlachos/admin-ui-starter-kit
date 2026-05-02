/**
 * AiMessageBubble — chat bubble surface with an avatar slot, role-aware
 * styling (assistant / user / system), an optional author + timestamp meta
 * row, and a trailing action toolbar (copy, regenerate). Use as the building
 * block for AI chat transcripts; pair with `AiThinking`, `AiFeedback`, and
 * `AiCitation` for richer turns. Strings overridable for i18n.
 */
import { useState, type ReactNode } from 'react';
import { Bot, Copy, RotateCcw, User } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiMessageBubbleStrings,
	type AiMessageBubbleProps,
	type AiMessageRole,
} from './types';

const ROLE_TONE: Record<AiMessageRole, { wrap: string; avatar: string; bubble: string }> = {
	assistant: {
		wrap: 'flex-row',
		avatar: 'bg-primary/15 text-primary',
		bubble: 'bg-card border border-border/60',
	},
	user: {
		wrap: 'flex-row-reverse text-right',
		avatar: 'bg-muted text-foreground',
		bubble: 'bg-primary text-primary-foreground',
	},
	system: {
		wrap: 'flex-row',
		avatar: 'bg-muted text-muted-foreground',
		bubble: 'bg-muted/40 border border-dashed border-border/60',
	},
};

const ROLE_FALLBACK_ICON = {
	assistant: Bot,
	user: User,
	system: Bot,
} as const;

export function AiMessageBubble({
	role = 'assistant',
	avatar,
	avatarLabel,
	authorName,
	timestamp,
	children,
	plainText,
	loading = false,
	onCopy,
	onRegenerate,
	className,
	strings: stringsProp,
}: AiMessageBubbleProps) {
	const strings = useStrings(defaultAiMessageBubbleStrings, stringsProp);
	const [copied, setCopied] = useState(false);
	const tone = ROLE_TONE[role];
	const FallbackIcon = ROLE_FALLBACK_ICON[role];

	const handleCopy = () => {
		const text = plainText ?? (typeof children === 'string' ? children : '');
		if (text && typeof navigator !== 'undefined' && navigator.clipboard) {
			void navigator.clipboard.writeText(text);
		}
		setCopied(true);
		onCopy?.();
		window.setTimeout(() => setCopied(false), 1500);
	};

	const renderedAvatar: ReactNode = avatar ?? (
		<span
			aria-label={avatarLabel}
			className={cn(
				'inline-flex size-7 shrink-0 items-center justify-center rounded-full',
				tone.avatar,
			)}
		>
			<FallbackIcon className="size-3.5" />
		</span>
	);

	return (
		<div className={cn('flex w-full items-start gap-2', tone.wrap, className)}>
			{renderedAvatar}

			<div className="flex max-w-[80%] flex-col gap-1">
				{(authorName || timestamp) && (
					<div className="flex items-baseline gap-2">
						{!!authorName && (
							<Text size="xs" weight="medium">
								{authorName}
							</Text>
						)}
						{!!timestamp && (
							<Text size="xxs" type="secondary" className="tabular-nums">
								{timestamp}
							</Text>
						)}
					</div>
				)}

				<div
					className={cn(
						'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
						tone.bubble,
						loading && 'animate-pulse',
					)}
				>
					{children}
				</div>

				{(onCopy !== undefined || plainText || onRegenerate) && role === 'assistant' && (
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							size="icon-xs"
							aria-label={strings.copyAria}
							onClick={handleCopy}
						>
							<Copy className="size-3.5" />
						</Button>
						{copied && (
							<Text size="xxs" type="success">
								{strings.copied}
							</Text>
						)}
						{!!onRegenerate && (
							<Button
								type="button"
								variant="secondary"
								buttonStyle="ghost"
								size="icon-xs"
								aria-label={strings.regenerateAria}
								onClick={onRegenerate}
							>
								<RotateCcw className="size-3.5" />
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

AiMessageBubble.displayName = 'AiMessageBubble';
