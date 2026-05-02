export type AiFeedbackVote = 'up' | 'down' | null;

export interface AiFeedbackStrings {
	prompt: string;
	thumbsUpAria: string;
	thumbsDownAria: string;
	commentPlaceholder: string;
	submit: string;
	thanks: string;
}

export const defaultAiFeedbackStrings: AiFeedbackStrings = {
	prompt: 'Was this helpful?',
	thumbsUpAria: 'Mark as helpful',
	thumbsDownAria: 'Mark as not helpful',
	commentPlaceholder: 'Tell us more (optional)',
	submit: 'Send feedback',
	thanks: 'Thanks for your feedback.',
};

export interface AiFeedbackProps {
	value?: AiFeedbackVote;
	onVote?: (vote: AiFeedbackVote) => void;
	onSubmitComment?: (comment: string, vote: AiFeedbackVote) => void;
	allowComment?: boolean;
	submitted?: boolean;
	className?: string;
	strings?: Partial<AiFeedbackStrings>;
}
