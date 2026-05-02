export { AiChat, type AiChatProps } from './ai-chat';
export {
	defaultAiChatStrings,
	defaultAiChatConversationStrings,
	defaultAiChatMessageStrings,
	defaultAiChatPromptInputStrings,
	defaultAiChatQueueStrings,
	defaultAiChatSuggestionsStrings,
	interpolateString,
	type AiChatConversationStrings,
	type AiChatMessageStrings,
	type AiChatPromptInputStrings,
	type AiChatQueueStrings,
	type AiChatStrings,
	type AiChatSuggestionsStrings,
} from './ai-chat.strings';
export type {
	AiChatAgent,
	AiChatAttachment,
	AiChatMessage,
	AiChatMessagePart,
	AiChatQueueItem,
	AiChatRenderMessageContext,
	AiChatSlots,
	AiChatSubmitValues,
	AiChatSuggestion,
} from './ai-chat.types';

// Partials — exported individually so consumers can build a custom layout
// against the same data model.
export {
	AiChatAttachmentsStrip,
	AiChatConversation,
	AiChatEmptyState,
	AiChatMessage as AiChatMessageView,
	AiChatPromptInput,
	AiChatQueue,
	AiChatSuggestionsRow,
	type AiChatAttachmentsStripProps,
	type AiChatConversationProps,
	type AiChatEmptyStateProps,
	type AiChatMessageProps,
	type AiChatPromptInputProps,
	type AiChatQueueProps,
	type AiChatSuggestionsRowProps,
} from './partials';

// Hooks — headless building blocks.
export {
	useAiChatScroll,
	type UseAiChatScrollOptions,
	type UseAiChatScrollReturn,
} from './hooks';
