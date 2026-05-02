import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('rich-text-editor barrel', () => {
	it('exposes the canonical exports', async () => {
		const source = await readFile(
			'src/components/features/rich-text-editor/index.ts',
			'utf8',
		);

		expect(source).toContain("export { RichTextEditor } from './rich-text-editor';");
		expect(source).toContain('FormRichTextEditor');
		expect(source).toContain('defaultRichTextEditorStrings');
	});
});

describe('rich-text-editor compact defaults', () => {
	it('uses the denser compact min-height and prose spacing overrides in the TipTap variant', async () => {
		const source = await readFile(
			'src/components/features/rich-text-editor/partials/rich-text-editor-tiptap.tsx',
			'utf8',
		);

		expect(source).toContain("compact ? '2rem' : '12rem'");
		expect(source).toContain('prose-p:my-0.5');
		expect(source).toContain('prose-headings:my-1');
		expect(source).toContain("import * as TiptapReact from '@tiptap/react';");
		expect(source).not.toContain("import { EditorContent, useEditor } from '@tiptap/react';");
		expect(source).not.toContain("compact ? '8rem' : '12rem'");
		expect(source).not.toContain("compact ? '5rem' : '12rem'");
	});

	it('keeps the same compact spacing in the fallback variant', async () => {
		const source = await readFile(
			'src/components/features/rich-text-editor/partials/rich-text-editor-fallback.tsx',
			'utf8',
		);

		expect(source).toContain("compact ? '2rem' : '12rem'");
		expect(source).toContain('prose-p:my-0.5');
	});
});
