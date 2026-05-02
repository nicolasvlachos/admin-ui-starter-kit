/**
 * Default user-facing strings for `<RichTextEditor>`.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <RichTextEditor strings={{ toolbar: { bold: t('editor.bold') } }} … />
 */

export interface RichTextEditorStrings {
	/** Toolbar button labels (used for `aria-label` and tooltip `title`). */
	toolbar: {
		bold: string;
		italic: string;
		strike: string;
		bulletList: string;
		orderedList: string;
		blockquote: string;
		undo: string;
		redo: string;
		sourceCode: string;
	};
	/** Footer count labels — `{n}` is replaced with the count. */
	counts: {
		characters: string;
		words: string;
		max: string;
	};
}

export const defaultRichTextEditorStrings: RichTextEditorStrings = {
	toolbar: {
		bold: 'Bold',
		italic: 'Italic',
		strike: 'Strike',
		bulletList: 'Bullet list',
		orderedList: 'Ordered list',
		blockquote: 'Quote',
		undo: 'Undo',
		redo: 'Redo',
		sourceCode: 'Source code',
	},
	counts: {
		characters: 'characters',
		words: 'words',
		max: 'max',
	},
};
