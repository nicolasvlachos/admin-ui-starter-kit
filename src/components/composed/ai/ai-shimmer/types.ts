import type { ReactNode } from 'react';

export interface AiShimmerProps {
	/** Children rendered with the shimmer gradient. Defaults to a placeholder string. */
	children?: ReactNode;
	/** Disable animation (renders the text in muted-foreground). */
	paused?: boolean;
	/** Animation duration in seconds. */
	duration?: number;
	className?: string;
}
