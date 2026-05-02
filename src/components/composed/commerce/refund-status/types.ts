export type RefundStage = 'requested' | 'approved' | 'processing' | 'completed';

export interface RefundStatusStrings {
	title: string;
	requested: string;
	approved: string;
	processing: string;
	completed: string;
	amount: string;
	reason: string;
	eta: string;
	method: string;
}

export const defaultRefundStatusStrings: RefundStatusStrings = {
	title: 'Refund Status',
	requested: 'Requested',
	approved: 'Approved',
	processing: 'Processing',
	completed: 'Completed',
	amount: 'Refund amount',
	reason: 'Reason',
	eta: 'Expected by',
	method: 'Refund to',
};

export interface RefundStatusCardProps {
	stage: RefundStage;
	amount: string;
	reason?: string;
	method?: string;
	eta?: string;
	requestedAt?: string;
	className?: string;
	strings?: Partial<RefundStatusStrings>;
}
