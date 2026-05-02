import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AiConfirmationTone = 'neutral' | 'destructive' | 'warning' | 'info' | 'primary';

export interface AiConfirmationStrings {
	approve: string;
	reject: string;
	pending: string;
	approved: string;
	rejected: string;
}

export const defaultAiConfirmationStrings: AiConfirmationStrings = {
	approve: 'Approve',
	reject: 'Reject',
	pending: 'Awaiting your approval',
	approved: 'Approved',
	rejected: 'Rejected',
};

export type AiConfirmationStatus = 'pending' | 'approved' | 'rejected';

export interface AiConfirmationProps {
	/** Title — short, action-oriented (e.g. "Run npm install"). */
	title: ReactNode;
	/** Body description / details. */
	description?: ReactNode;
	/** Decorative icon. */
	icon?: LucideIcon;
	/** Tone variant — drives accent colour. */
	tone?: AiConfirmationTone;
	/** Current status — when set, the action row is replaced with a result pill. */
	status?: AiConfirmationStatus;
	/** Approve callback. */
	onApprove?: () => void;
	/** Reject callback. */
	onReject?: () => void;
	/** Override the approve button label. */
	approveLabel?: ReactNode;
	/** Override the reject button label. */
	rejectLabel?: ReactNode;
	/** Render a "details" expandable area. */
	details?: ReactNode;
	className?: string;
	strings?: Partial<AiConfirmationStrings>;
}
