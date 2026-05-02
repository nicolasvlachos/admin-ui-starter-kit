export interface AiTokenUsageStrings {
	title: string;
	input: string;
	output: string;
	total: string;
	cost: string;
}

export const defaultAiTokenUsageStrings: AiTokenUsageStrings = {
	title: 'Token usage',
	input: 'Input',
	output: 'Output',
	total: 'Total',
	cost: 'Estimated cost',
};

export interface AiTokenUsageCardProps {
	model?: string;
	inputTokens: number;
	outputTokens: number;
	cost?: string;
	maxTokens?: number;
	className?: string;
	strings?: Partial<AiTokenUsageStrings>;
}
