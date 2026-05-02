/**
 * Caret-introspection helpers used by `<RichTextEditor>` to expose the
 * text before the caret and replace a leading run of characters with
 * inline HTML — the building blocks for `@`-mention chips and similar
 * inline triggers.
 */
import type { RichTextCaretContext, TiptapEditor } from '../rich-text-editor.types';

/**
 * Read the current selection's caret context.
 *
 * Walks back from the caret through the current text node and any
 * preceding sibling text nodes inside the same block-level container
 * (paragraph / list-item / heading) collecting plain text. Returns the
 * accumulated text plus the caret's bounding rect when available.
 *
 * Returns `null` when there is no live selection or the selection isn't
 * a text caret inside a contenteditable.
 */
export function readCaretContext(): RichTextCaretContext | null {
	if (typeof window === 'undefined') return null;
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return null;
	const range = sel.getRangeAt(0);
	if (!range.collapsed) return null;

	const startNode = range.startContainer;
	const startOffset = range.startOffset;

	let block: Node | null = startNode;
	while (block && block.nodeType !== Node.ELEMENT_NODE) {
		block = block.parentNode;
	}
	if (!block) return null;
	const editable =
		(block as Element).closest('[contenteditable="true"]') ??
		(block as Element).closest('.ProseMirror');
	if (!editable) return null;

	let text = '';
	if (startNode.nodeType === Node.TEXT_NODE) {
		text = (startNode.textContent ?? '').slice(0, startOffset);
	}

	let cursor: Node | null = startNode;
	while (cursor && cursor !== editable && cursor !== block) {
		let prev: Node | null = cursor.previousSibling;
		while (prev) {
			text = (prev.textContent ?? '') + text;
			prev = prev.previousSibling;
		}
		cursor = cursor.parentNode;
		if (cursor && (cursor as Element).matches?.('p, li, h1, h2, h3, h4, h5, h6, blockquote')) {
			break;
		}
	}

	let rect: RichTextCaretContext['rect'];
	const r = range.getBoundingClientRect();
	if (r && (r.top || r.left || r.right || r.bottom)) {
		rect = { top: r.top, left: r.left, bottom: r.bottom, right: r.right };
	}

	return { textBefore: text, rect };
}

/**
 * Extend the selection backwards by `length` characters, then insert
 * `html`. The selection extension means `editor.insertContent` (or the
 * fallback's `range.deleteContents()` + insert) replaces the trigger
 * range with the chip atomically — no manual text-content mutation, no
 * timing races between "delete" and "insert".
 */
export function replaceBeforeCaret(
	editor: TiptapEditor | null,
	length: number,
	html: string,
	notifyChange: (next: string) => void,
): void {
	if (typeof window === 'undefined') return;
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return;
	const caret = sel.getRangeAt(0);
	if (!caret.collapsed) return;

	let remaining = length;
	let startNode: Node = caret.startContainer;
	let startOffset = caret.startOffset;

	while (remaining > 0) {
		if (startNode.nodeType === Node.TEXT_NODE) {
			const take = Math.min(startOffset, remaining);
			startOffset -= take;
			remaining -= take;
			if (remaining === 0) break;
		}
		const prev = previousTextNode(startNode);
		if (!prev) break;
		startNode = prev;
		startOffset = prev.textContent?.length ?? 0;
	}

	const range = document.createRange();
	range.setStart(startNode, startOffset);
	range.setEnd(caret.endContainer, caret.endOffset);
	sel.removeAllRanges();
	sel.addRange(range);

	if (editor) {
		editor.chain().focus().insertContent(html).run();
		notifyChange(editor.getHTML());
		return;
	}

	range.deleteContents();
	const fragment = document.createRange().createContextualFragment(html);
	range.insertNode(fragment);
	sel.collapseToEnd();
	const editable =
		(startNode as Element | null)?.parentElement?.closest?.('[contenteditable="true"]') ?? null;
	if (editable) notifyChange((editable as HTMLElement).innerHTML);
}

export function insertHtmlIntoEditable(editable: HTMLElement | null, html: string): void {
	if (typeof window === 'undefined' || !editable) return;
	editable.focus();

	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) {
		editable.insertAdjacentHTML('beforeend', html);
		return;
	}

	const range = sel.getRangeAt(0);
	if (!editable.contains(range.commonAncestorContainer)) {
		editable.insertAdjacentHTML('beforeend', html);
		return;
	}

	range.deleteContents();
	const fragment = document.createRange().createContextualFragment(html);
	range.insertNode(fragment);
	range.collapse(false);
	sel.removeAllRanges();
	sel.addRange(range);
}

function previousTextNode(node: Node): Node | null {
	let current: Node | null = node;
	while (current) {
		if (current.previousSibling) {
			current = current.previousSibling;
			while (current && current.lastChild) {
				current = current.lastChild;
			}
			if (current && current.nodeType === Node.TEXT_NODE) return current;
			continue;
		}
		current = current.parentNode;
		if (!current || (current as Element).matches?.('p, li, h1, h2, h3, h4, h5, h6, blockquote, [contenteditable="true"]')) {
			return null;
		}
	}
	return null;
}
