import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AiToolCallStatus = 'pending' | 'running' | 'success' | 'error';

export interface AiToolCallStrings {
	pending: string;
	running: string;
	success: string;
	error: string;
	expand: string;
	collapse: string;
	args: string;
	result: string;
	durationLabel: string;
}

export const defaultAiToolCallStrings: AiToolCallStrings = {
	pending: 'Queued',
	running: 'Running',
	success: 'Success',
	error: 'Failed',
	expand: 'Show details',
	collapse: 'Hide details',
	args: 'Arguments',
	result: 'Result',
	durationLabel: 'Took',
};

export interface AiToolCallProps {
	name: string;
	status: AiToolCallStatus;
	icon?: LucideIcon;
	args?: ReactNode;
	result?: ReactNode;
	error?: ReactNode;
	/** Duration in ms; rendered as "Took 1.2s". */
	durationMs?: number;
	defaultExpanded?: boolean;
	className?: string;
	strings?: Partial<AiToolCallStrings>;
}
