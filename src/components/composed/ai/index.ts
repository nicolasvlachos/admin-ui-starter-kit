export type { ConfidenceLevel, AiSummaryData, AiSummaryBlockProps } from './ai-summary';
export { AiSummaryBlock } from './ai-summary';

export type { AiClassificationData, AiClassificationPanelProps } from './ai-classification';
export { AiClassificationPanel } from './ai-classification';

export {
	AiConfidenceCard,
	defaultAiConfidenceCardStrings,
	type AiConfidenceCardProps,
	type AiConfidenceCardStrings,
	type AiConfidenceFactor,
} from './ai-confidence';

export {
	AiPromptSuggestions,
	defaultAiPromptSuggestionsStrings,
	type AiPromptSuggestionsProps,
	type AiPromptSuggestionsStrings,
	type AiPromptSuggestion,
} from './ai-prompt-suggestions';

export {
	AiTokenUsageCard,
	defaultAiTokenUsageStrings,
	type AiTokenUsageCardProps,
	type AiTokenUsageStrings,
} from './ai-token-usage';

// Phase C — chat / agent surfaces

export {
	AiFeedback,
	defaultAiFeedbackStrings,
	type AiFeedbackProps,
	type AiFeedbackStrings,
	type AiFeedbackVote,
} from './ai-feedback';

export {
	AiMessageBubble,
	defaultAiMessageBubbleStrings,
	type AiMessageBubbleProps,
	type AiMessageBubbleStrings,
	type AiMessageRole,
} from './ai-message-bubble';

export {
	AiToolCall,
	defaultAiToolCallStrings,
	type AiToolCallProps,
	type AiToolCallStrings,
	type AiToolCallStatus,
} from './ai-tool-call';

export {
	AiCitation,
	defaultAiCitationStrings,
	type AiCitationProps,
	type AiCitationSource,
	type AiCitationStrings,
} from './ai-citation';

// Phase D — elements.ai-sdk.dev parity surfaces

export { AiShimmer, type AiShimmerProps } from './ai-shimmer';

export {
	AiCodeBlock,
	defaultAiCodeBlockStrings,
	type AiCodeBlockProps,
	type AiCodeBlockStrings,
} from './ai-code-block';

export {
	AiAttachment,
	defaultAiAttachmentStrings,
	type AiAttachmentKind,
	type AiAttachmentProps,
	type AiAttachmentStrings,
} from './ai-attachment';

export {
	AiInlineCitation,
	defaultAiInlineCitationStrings,
	type AiInlineCitationProps,
	type AiInlineCitationStrings,
} from './ai-inline-citation';

export {
	AiAgent,
	defaultAiAgentStrings,
	type AiAgentProps,
	type AiAgentStatus,
	type AiAgentStrings,
} from './ai-agent';

export {
	AiPackageInfo,
	defaultAiPackageInfoStrings,
	type AiPackageInfoProps,
	type AiPackageInfoStrings,
} from './ai-package-info';

export {
	AiConfirmation,
	defaultAiConfirmationStrings,
	type AiConfirmationProps,
	type AiConfirmationStatus,
	type AiConfirmationStrings,
	type AiConfirmationTone,
} from './ai-confirmation';

export {
	AiSources,
	defaultAiSourcesStrings,
	type AiSourceItem,
	type AiSourcesProps,
	type AiSourcesStrings,
	type AiSourcesVariant,
} from './ai-sources';

export {
	AiReasoning,
	defaultAiReasoningStrings,
	type AiReasoningProps,
	type AiReasoningStrings,
} from './ai-reasoning';

export {
	AiChainOfThought,
	defaultAiChainOfThoughtStrings,
	type AiChainOfThoughtProps,
	type AiChainOfThoughtStrings,
	type AiChainStep,
	type AiChainStepStatus,
} from './ai-chain-of-thought';

export {
	AiTask,
	defaultAiTaskStrings,
	type AiTaskItem,
	type AiTaskProps,
	type AiTaskStatus,
	type AiTaskStrings,
} from './ai-task';

export {
	AiArtifact,
	defaultAiArtifactStrings,
	type AiArtifactAction,
	type AiArtifactProps,
	type AiArtifactStrings,
} from './ai-artifact';

export {
	AiFileTree,
	defaultAiFileTreeStrings,
	type AiFileTreeChangeStatus,
	type AiFileTreeNode,
	type AiFileTreeNodeKind,
	type AiFileTreeProps,
	type AiFileTreeStrings,
} from './ai-file-tree';
