import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AiChainStepStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface AiChainStep {
	id: string;
	title: ReactNode;
	/** Optional rationale rendered under the title. */
	description?: ReactNode;
	/** Step status — drives the marker style. */
	status?: AiChainStepStatus;
	/** Custom icon override for the step marker. */
	icon?: LucideIcon;
	/** Free-form children rendered inside the step body (substeps, code, …). */
	body?: ReactNode;
}

export interface AiChainOfThoughtStrings {
	title: string;
	streamingHint: string;
}

export const defaultAiChainOfThoughtStrings: AiChainOfThoughtStrings = {
	title: 'Reasoning',
	streamingHint: 'Working through the steps…',
};

export interface AiChainOfThoughtProps {
	/** Step list — order is significant. */
	steps: ReadonlyArray<AiChainStep>;
	/** Hide the header strip. */
	hideHeader?: boolean;
	/** Show the streaming hint under the header. */
	streaming?: boolean;
	className?: string;
	strings?: Partial<AiChainOfThoughtStrings>;
}
