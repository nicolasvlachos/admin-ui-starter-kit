import type { ComponentType, ReactNode } from 'react';
import type * as TiptapReact from '@tiptap/react';

import type { StringsProp } from '@/lib/strings';

import type { RichTextEditorStrings } from './rich-text-editor.strings';

export type TiptapEditor = NonNullable<ReturnType<typeof TiptapReact.useEditor>>;

/**
 * Snapshot of the text immediately before the caret — used by parents
 * who need to detect inline triggers like `@` mentions.
 */
export interface RichTextCaretContext {
	/** Plain text from the start of the current text node up to the caret. */
	textBefore: string;
	/** Bounding rect of the caret in viewport coordinates (when available). */
	rect?: { top: number; left: number; bottom: number; right: number };
}

/**
 * Imperative handle exposed via `ref` — lets the parent insert content,
 * focus, and read/write the underlying HTML without owning a TipTap
 * instance. Used by `<CommentComposer>` to insert reference chips inline.
 */
export interface RichTextEditorHandle {
	focus(): void;
	getHTML(): string;
	setHTML(html: string): void;
	/** Inserts raw HTML at the current selection. */
	insertHTML(html: string): void;
	/** True when the editor's text content is empty. */
	isEmpty(): boolean;
	/** Imperative clear — same as `setHTML('')`. */
	clear(): void;
	/** Read the text before the caret and (best-effort) the caret rect. */
	getCaretContext(): RichTextCaretContext | null;
	/**
	 * Delete the `length` characters immediately before the caret, then
	 * insert `html`. Used to swap a `@needle` trigger for a chip.
	 */
	replaceBeforeCaret(length: number, html: string): void;
}

export interface RichTextEditorToolbarItem {
	id: string;
	icon: ComponentType<{ className?: string }>;
	label: string;
	onClick: () => void;
	isActive?: () => boolean;
	disabled?: boolean;
}

export interface RichTextEditorProps {
	value: string;
	onChange: (html: string) => void;
	placeholder?: string;
	compact?: boolean;
	minHeight?: string;
	maxHeight?: string;
	disabled?: boolean;
	/** Show character and word counts in a footer bar. */
	showCounts?: boolean;
	/** Optional character limit — displayed as "X / max" when showCounts is true. */
	maxLength?: number;
	/** Additional toolbar buttons rendered after the built-ins. */
	extraToolbarItems?: ReadonlyArray<RichTextEditorToolbarItem>;
	/** Slot rendered at the right edge of the toolbar (e.g. submit button). */
	toolbarTrailing?: ReactNode;
	/** Slot rendered below the editor (e.g. attachment chips). */
	footerSlot?: ReactNode;
	/** Hide the built-in source-mode toggle. Default: false. */
	hideSourceToggle?: boolean;
	/** Auto-focus on mount. */
	autoFocus?: boolean;
	/** Override class on the outer wrapper. */
	className?: string;
	/**
	 * Fires after every input or selection change. The parent can call
	 * `ref.current?.getCaretContext()` to inspect the caret — used by the
	 * comment composer to detect `@`-style trigger characters.
	 */
	onCaretChange?: () => void;
	/** Per-instance string overrides (deep-merged over `defaultRichTextEditorStrings`). */
	strings?: StringsProp<RichTextEditorStrings>;
}

export interface ToolbarButtonConfig {
	id: string;
	icon: ComponentType<{ className?: string }>;
	label: string;
	isActive: () => boolean;
	run: () => void;
	disabled?: boolean;
}
