import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AiAgentStatus = 'idle' | 'thinking' | 'working' | 'done' | 'error' | 'offline';

export interface AiAgentStrings {
	statusLabels: Record<AiAgentStatus, string>;
}

export const defaultAiAgentStrings: AiAgentStrings = {
	statusLabels: {
		idle: 'Idle',
		thinking: 'Thinking',
		working: 'Working',
		done: 'Done',
		error: 'Error',
		offline: 'Offline',
	},
};

export interface AiAgentProps {
	/** Display name (e.g. "Atlas", "Claude"). */
	name: string;
	/** Avatar / mark — typically an icon or short emoji. */
	icon?: LucideIcon;
	/** Override avatar with arbitrary content (image, gradient mark, etc.). */
	avatar?: ReactNode;
	/** Short blurb / model identifier rendered under the name. */
	subtitle?: ReactNode;
	/** Tone color for the avatar wash. */
	tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral';
	/** Live status displayed as a pill next to the name. */
	status?: AiAgentStatus;
	/** Density variant — `inline` is a single-line chip, `card` is a tile. */
	variant?: 'inline' | 'card';
	/** Trailing slot — typically actions, badges. */
	trailing?: ReactNode;
	className?: string;
	strings?: Partial<AiAgentStrings>;
}
