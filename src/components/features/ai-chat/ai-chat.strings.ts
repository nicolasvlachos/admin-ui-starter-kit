/**
 * Strings for `<AiChat>` and its partials. Each interface is co-located so
 * partials and the feature root all read from one source of truth (rule 19).
 * Consumers override via the `strings` prop on the relevant component; values
 * are deep-merged over the defaults so partial overrides are safe.
 */

export interface AiChatPromptInputStrings {
	/** Placeholder copy for the textarea. */
	placeholder: string;
	/** Aria label for the attach button. */
	attachAria: string;
	/** Aria label for the submit button. */
	submitAria: string;
	/** Aria label for the stop button (replaces submit while streaming). */
	stopAria: string;
	/** Aria label for the model picker button (when `modelPicker` is provided). */
	modelPickerAria: string;
	/** Hint shown under the input. Supports `{{key}}` for the submit shortcut. */
	hint: string;
}

export const defaultAiChatPromptInputStrings: AiChatPromptInputStrings = {
	placeholder: 'Ask anything…',
	attachAria: 'Attach files',
	submitAria: 'Send message',
	stopAria: 'Stop generating',
	modelPickerAria: 'Choose model',
	hint: 'Press {{submitKey}} to send · {{newlineKey}} for newline',
};

export interface AiChatConversationStrings {
	scrollToBottom: string;
	scrollToBottomAria: string;
}

export const defaultAiChatConversationStrings: AiChatConversationStrings = {
	scrollToBottom: 'Jump to latest',
	scrollToBottomAria: 'Scroll to bottom',
};

export interface AiChatQueueStrings {
	header: string;
	cancelAria: string;
	queuedLabel: string;
	runningLabel: string;
}

export const defaultAiChatQueueStrings: AiChatQueueStrings = {
	header: 'In queue',
	cancelAria: 'Remove from queue',
	queuedLabel: 'Queued',
	runningLabel: 'Running',
};

export interface AiChatSuggestionsStrings {
	header: string;
}

export const defaultAiChatSuggestionsStrings: AiChatSuggestionsStrings = {
	header: 'Try',
};

export interface AiChatMessageStrings {
	pending: string;
}

export const defaultAiChatMessageStrings: AiChatMessageStrings = {
	pending: 'Thinking…',
};

export interface AiChatStrings {
	prompt: AiChatPromptInputStrings;
	conversation: AiChatConversationStrings;
	queue: AiChatQueueStrings;
	suggestions: AiChatSuggestionsStrings;
	message: AiChatMessageStrings;
	emptyTitle: string;
	emptyDescription: string;
}

export const defaultAiChatStrings: AiChatStrings = {
	prompt: defaultAiChatPromptInputStrings,
	conversation: defaultAiChatConversationStrings,
	queue: defaultAiChatQueueStrings,
	suggestions: defaultAiChatSuggestionsStrings,
	message: defaultAiChatMessageStrings,
	emptyTitle: 'Start a conversation',
	emptyDescription: 'Ask a question, share context, or attach a file to get going.',
};

/** Replace `{{key}}` tokens with values from `params`. */
export function interpolateString(
	template: string,
	params: Record<string, string | number>,
): string {
	return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => {
		const v = params[k];
		return v === undefined ? m : String(v);
	});
}
