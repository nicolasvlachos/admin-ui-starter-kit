/**
 * AiShimmer — gradient text shimmer for streaming / loading copy. Renders
 * children with a moving highlight band that draws the eye while a model is
 * thinking. Use anywhere a static "Loading…" feels too inert: agent typing,
 * tool warm-up, awaiting first token.
 */
import type { CSSProperties } from 'react';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type { AiShimmerProps } from './types';

export function AiShimmer({
	children = 'Thinking…',
	paused = false,
	duration = 2.4,
	className,
}: AiShimmerProps) {
	if (paused) {
		return (
			<Text type="secondary" className={className}>
				{children}
			</Text>
		);
	}

	const style: CSSProperties = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		['--ai-shimmer-duration' as any]: `${duration}s`,
	};

	return (
		<span
			data-ai-shimmer
			role="status"
			aria-live="polite"
			className={cn(
				'inline-block bg-clip-text text-sm font-medium text-transparent',
				// foreground -> muted -> foreground gradient swept across
				'bg-[linear-gradient(110deg,var(--ai-shimmer-base)_30%,var(--ai-shimmer-highlight)_50%,var(--ai-shimmer-base)_70%)]',
				'bg-[length:200%_100%]',
				'animate-[ai-shimmer-sweep_var(--ai-shimmer-duration,2.4s)_linear_infinite]',
				className,
			)}
			style={style}
		>
			{children}
		</span>
	);
}

AiShimmer.displayName = 'AiShimmer';
