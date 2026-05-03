/**
 * Public `<RichTextEditor>` shell — picks the TipTap-backed editor when
 * the runtime is loaded and falls back to a plain `contenteditable`
 * surface otherwise. Both variants implement the same imperative
 * `RichTextEditorHandle`, so callers don't have to branch.
 *
 * Heavy lifting lives in `partials/`:
 *   - `partials/rich-text-editor-tiptap.tsx`   — TipTap variant
 *   - `partials/rich-text-editor-fallback.tsx` — contenteditable variant
 *   - `partials/rich-text-editor-toolbar.tsx`  — shared toolbar
 *   - `partials/counts-footer.tsx`             — char/word counts
 *   - `partials/caret-helpers.ts`              — caret introspection
 *   - `partials/html-helpers.ts`               — HTML normalization
 */
import { forwardRef } from 'react';

import {
	FallbackRichTextEditor,
	TiptapRichTextEditor,
	hasTiptapRuntime,
} from './partials';
import type {
	RichTextEditorHandle,
	RichTextEditorProps,
} from './rich-text-editor.types';

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor(
	props,
	ref,
) {
	if (!hasTiptapRuntime) {
		return <FallbackRichTextEditor className="rich-text-editor--component" {...props} ref={ref} />;
	}

	return <TiptapRichTextEditor {...props} ref={ref} />;
});

RichTextEditor.displayName = 'RichTextEditor';

export type {
	RichTextEditorProps,
	RichTextEditorHandle,
	RichTextEditorToolbarItem,
	RichTextCaretContext,
} from './rich-text-editor.types';
