export interface AiConfidenceFactor {
	label: string;
	score: number; // 0–1
}

export interface AiConfidenceCardStrings {
	title: string;
	confidenceLabel: string;
	factorsLabel: string;
}

export const defaultAiConfidenceCardStrings: AiConfidenceCardStrings = {
	title: 'AI Confidence',
	confidenceLabel: 'Overall',
	factorsLabel: 'Contributing factors',
};

export interface AiConfidenceCardProps {
	score: number; // 0–1
	model?: string;
	factors?: AiConfidenceFactor[];
	className?: string;
	strings?: Partial<AiConfidenceCardStrings>;
}
