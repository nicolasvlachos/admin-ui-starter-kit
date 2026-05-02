import { useState } from 'react';

import { RichTextEditor } from '@/components/features/rich-text-editor';
import { Text } from '@/components/typography';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

const SAMPLE_HTML = `
<h3>Spa cleaning checklist</h3>
<p>Before each session:</p>
<ul>
  <li>Refill towels and bath products</li>
  <li>Wipe down all surfaces</li>
  <li>Top up the candles</li>
</ul>
<p>After each session:</p>
<ol>
  <li>Sanitise the tubs</li>
  <li>Restock guest amenities</li>
  <li>Reset the music</li>
</ol>
`.trim();

export default function RichTextEditorPage() {
	const [defaultValue, setDefaultValue] = useState<string>(SAMPLE_HTML);
	const [compactValue, setCompactValue] = useState<string>("<p>A short note about today's bookings.</p>");
	const [emptyValue, setEmptyValue] = useState<string>('');

	return (
		<PreviewPage
			title="Features · Rich text editor"
			description="Tiptap-backed editor with bold / italic / strike / lists / quote / undo-redo. Falls back to a non-editable preview when @tiptap/react is not bundled. Strings overridable via the `strings` prop."
		>
			<PreviewSection title="Production wiring">
				<Text type="secondary">
					{'Use '}<code className="rounded bg-muted px-1 py-0.5 text-xs">{'<RichTextEditor value={html} onChange={setHtml} showCounts maxLength={500} />'}</code>{' on any page that needs structured rich text input. The editor handles paste, undo/redo, and exposes a `strings` prop for toolbar i18n; consumers persist the resulting HTML string.'}
				</Text>
			</PreviewSection>

			<PreviewSection title="Default" span="full">
				<RichTextEditor
					value={defaultValue}
					onChange={setDefaultValue}
					showCounts
					maxLength={500}
				/>
			</PreviewSection>

			<PreviewSection title="Compact · smaller inline note" description="Tightened toolbar height for inline notes.">
				<RichTextEditor
					value={compactValue}
					onChange={setCompactValue}
					compact
					showCounts
					maxLength={140}
				/>
			</PreviewSection>

			<PreviewSection title="Empty / placeholder">
				<RichTextEditor
					value={emptyValue}
					onChange={setEmptyValue}
					placeholder="Write something…"
					hideSourceToggle
				/>
			</PreviewSection>

			<PreviewSection title="Disabled">
				<RichTextEditor
					value={SAMPLE_HTML}
					onChange={() => {}}
					disabled
					hideSourceToggle
				/>
			</PreviewSection>

			<PreviewSection title="Strings override" description="Per-instance toolbar i18n via the `strings` prop.">
				<RichTextEditor
					value={compactValue}
					onChange={setCompactValue}
					compact
					strings={{
						toolbar: {
							bold: 'Gras',
							italic: 'Italique',
							strike: 'Barré',
							bulletList: 'Liste',
							orderedList: 'Numérotée',
							blockquote: 'Citation',
							undo: 'Annuler',
							redo: 'Rétablir',
							sourceCode: 'Source',
						},
					}}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
