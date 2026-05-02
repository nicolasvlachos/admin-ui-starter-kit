/**
 * AiChatPromptInput — multi-line composer for the chat. Carries:
 *   - auto-resizing textarea
 *   - staged attachment chips above the field
 *   - leading actions slot (model picker, attach)
 *   - submit / stop buttons (stop replaces submit while `streaming` is true)
 *   - keyboard discipline: Enter to submit, Shift+Enter for newline
 *
 * Stateless: the consumer owns `value`, `attachments`, and `streaming`. The
 * component fires `onSubmit` with `{ text, attachments }` on submit.
 */
import { useCallback, useRef, type ReactNode } from 'react';
import { ArrowUp, Paperclip, Square } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Textarea } from '@/components/base/forms/fields';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiChatPromptInputStrings,
	interpolateString,
	type AiChatPromptInputStrings,
} from '../ai-chat.strings';
import type {
	AiChatAttachment,
	AiChatSubmitValues,
} from '../ai-chat.types';
import { AiChatAttachmentsStrip } from './ai-chat-attachments-strip';

export interface AiChatPromptInputProps {
	/** Current text value (controlled). */
	value: string;
	/** Text change callback. */
	onChange: (value: string) => void;
	/** Submit callback — fires on Enter or send-button click. */
	onSubmit?: (values: AiChatSubmitValues) => void;
	/** Stop callback — wired to the stop button while `streaming`. */
	onStop?: () => void;
	/** Streaming flag — flips submit ↔ stop and disables the submit button. */
	streaming?: boolean;
	/** Disable the entire composer (e.g. while waiting for an upload). */
	disabled?: boolean;
	/** Staged attachments (controlled). */
	attachments?: ReadonlyArray<AiChatAttachment>;
	/** Remove a staged attachment. */
	onRemoveAttachment?: (id: string) => void;
	/** Triggered when the attach button is pressed. */
	onAttach?: () => void;
	/** Show the attach button (default: when `onAttach` is provided). */
	showAttach?: boolean;
	/** Leading slot rendered before the attach button (typically a model picker). */
	leadingActions?: ReactNode;
	/** Trailing slot rendered before submit (custom action buttons). */
	trailingActions?: ReactNode;
	/** Hide the keyboard hint under the field. */
	hideHint?: boolean;
	/** Override the textarea minimum row count. */
	minRows?: number;
	/** Override the textarea maximum row count before scroll. */
	maxRows?: number;
	/** Auto-focus the textarea on mount. */
	autoFocus?: boolean;
	className?: string;
	strings?: Partial<AiChatPromptInputStrings>;
}

export function AiChatPromptInput({
	value,
	onChange,
	onSubmit,
	onStop,
	streaming = false,
	disabled = false,
	attachments = [],
	onRemoveAttachment,
	onAttach,
	showAttach,
	leadingActions,
	trailingActions,
	hideHint = false,
	minRows = 1,
	maxRows = 8,
	autoFocus = false,
	className,
	strings: stringsProp,
}: AiChatPromptInputProps) {
	const strings = useStrings(defaultAiChatPromptInputStrings, stringsProp);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const canSubmit =
		!streaming && !disabled && (value.trim().length > 0 || attachments.length > 0);

	const handleSubmit = useCallback(() => {
		if (!canSubmit) return;
		onSubmit?.({ text: value, attachments });
	}, [canSubmit, onSubmit, value, attachments]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
				e.preventDefault();
				handleSubmit();
			}
		},
		[handleSubmit],
	);

	const showAttachBtn = showAttach ?? Boolean(onAttach);
	const submitKeyLabel =
		typeof navigator !== 'undefined' && navigator.platform?.toLowerCase().includes('mac')
			? '⌘↩'
			: '↩';

	return (
		<div
			className={cn(
				'rounded-xl border border-border bg-card transition-colors duration-150',
				'focus-within:border-foreground/20 focus-within:ring-2 focus-within:ring-ring/30',
				disabled && 'opacity-60 pointer-events-none',
				className,
			)}
		>
			{attachments.length > 0 && (
				<div className="border-b border-border/60 p-2">
					<AiChatAttachmentsStrip
						attachments={attachments}
						onRemove={onRemoveAttachment}
					/>
				</div>
			)}

			<Textarea
				ref={textareaRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={strings.placeholder}
				autoResize
				minRows={minRows}
				maxRows={maxRows}
				autoFocus={autoFocus}
				disabled={disabled}
				className={cn(
					'!border-0 !bg-transparent !shadow-none focus-visible:!ring-0 resize-none px-3 py-2.5',
				)}
			/>

			<div className="flex items-center gap-1 border-t border-border/60 px-2 py-1.5">
				{leadingActions}
				{showAttachBtn && (
					<Button
						type="button"
						variant="secondary"
						buttonStyle="ghost"
						size="icon-sm"
						aria-label={strings.attachAria}
						onClick={onAttach}
						disabled={disabled}
					>
						<Paperclip className="size-4" />
					</Button>
				)}
				<div className="ml-auto flex items-center gap-1">
					{trailingActions}
					{streaming ? (
						<Button
							type="button"
							variant="secondary"
							buttonStyle="solid"
							size="icon-sm"
							aria-label={strings.stopAria}
							onClick={onStop}
						>
							<Square className="size-3.5 fill-current" />
						</Button>
					) : (
						<Button
							type="button"
							variant="primary"
							buttonStyle="solid"
							size="icon-sm"
							aria-label={strings.submitAria}
							onClick={handleSubmit}
							disabled={!canSubmit}
						>
							<ArrowUp className="size-4" />
						</Button>
					)}
				</div>
			</div>

			{!hideHint && (
				<div className="px-3 pb-2">
					<Text size="xxs" type="discrete">
						{interpolateString(strings.hint, {
							submitKey: submitKeyLabel,
							newlineKey: '⇧↩',
						})}
					</Text>
				</div>
			)}
		</div>
	);
}

AiChatPromptInput.displayName = 'AiChatPromptInput';
