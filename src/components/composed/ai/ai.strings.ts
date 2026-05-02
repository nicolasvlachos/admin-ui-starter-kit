/**
 * Shared default strings for `composed/ai` components.
 *
 * Each component accepts a `strings` prop deep-merged over the default subset
 * it reads. Consumers wire backend i18n at the call site:
 *
 *   <AiSummaryBlock strings={{ title: t('ai.summary.title') }} … />
 */

export interface AiSummaryStrings {
	/** Card title rendered in the header. */
	title: string;
	/** Suffix badge label (e.g. "AI"). */
	badgeLabel: string;
	/** Footer regenerate button label. */
	regenerate: string;
	/** Confidence-bar level labels. */
	confidenceLevels: { low: string; medium: string; high: string };
}

export const defaultAiSummaryStrings: AiSummaryStrings = {
	title: 'AI Summary',
	badgeLabel: 'AI',
	regenerate: 'Regenerate',
	confidenceLevels: { low: 'low', medium: 'medium', high: 'high' },
};

export interface AiClassificationStrings {
	/** Card title rendered in the header. */
	title: string;
	/** Inline-stat row labels. */
	complexityLabel: string;
	flagsLabel: string;
	nextStepLabel: string;
	/** Confidence pill prefix (e.g. "Confidence: High"). */
	confidencePrefix: string;
	/** Confidence band labels. */
	confidenceBands: { low: string; medium: string; high: string };
}

export const defaultAiClassificationStrings: AiClassificationStrings = {
	title: 'Classification',
	complexityLabel: 'Complexity',
	flagsLabel: 'Flags',
	nextStepLabel: 'Next Step',
	confidencePrefix: 'Confidence',
	confidenceBands: { low: 'Low', medium: 'Medium', high: 'High' },
};
