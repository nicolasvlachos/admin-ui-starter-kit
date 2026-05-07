---
id: features/rich-text-editor
title: "Features · Rich text editor"
description: "Tiptap-backed editor with bold / italic / strike / lists / quote / undo-redo. Falls back to a non-editable preview when @tiptap/react is not bundled. Strings overridable via the `strings` prop."
layer: features
family: "Inputs"
sourcePath: src/components/features/rich-text-editor
examples:
  - ProductionWiring
  - Default
  - CompactSmallerInlineNote
  - EmptyPlaceholder
  - Disabled
  - StringsOverride
imports:
  - @/components/features/rich-text-editor
  - @/components/typography
tags:
  - features
  - inputs
  - rich-text-editor
  - rich
  - text
  - editor
  - tiptap
---

# Features · Rich text editor

Tiptap-backed editor with bold / italic / strike / lists / quote / undo-redo. Falls back to a non-editable preview when @tiptap/react is not bundled. Strings overridable via the `strings` prop.

**Layer:** `features`  
**Source:** `src/components/features/rich-text-editor`

## Examples

```tsx
import { useState } from 'react';
import { RichTextEditor } from '@/components/features/rich-text-editor';
import { Text } from '@/components/typography';

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

export function ProductionWiring() {
	return (
		<>
			<Text type="secondary">
								{'Use '}<code className="rounded bg-muted px-1 py-0.5 text-xs">{'<RichTextEditor value={html} onChange={setHtml} showCounts maxLength={500} />'}</code>{' on any page that needs structured rich text input. The editor handles paste, undo/redo, and exposes a `strings` prop for toolbar i18n; consumers persist the resulting HTML string.'}
							</Text>
		</>
	);
}

export function Default() {
	const [defaultValue, setDefaultValue] = useState<string>(SAMPLE_HTML);
	return (
		<>
			<RichTextEditor
								value={defaultValue}
								onChange={setDefaultValue}
								showCounts
								maxLength={500}
							/>
		</>
	);
}

export function CompactSmallerInlineNote() {
	const [compactValue, setCompactValue] = useState<string>("<p>A short note about today's bookings.</p>");
	return (
		<>
			<RichTextEditor
								value={compactValue}
								onChange={setCompactValue}
								compact
								showCounts
								maxLength={140}
							/>
		</>
	);
}

export function EmptyPlaceholder() {
	const [emptyValue, setEmptyValue] = useState<string>('');
	return (
		<>
			<RichTextEditor
								value={emptyValue}
								onChange={setEmptyValue}
								placeholder="Write something…"
								hideSourceToggle
							/>
		</>
	);
}

export function Disabled() {
	return (
		<>
			<RichTextEditor
								value={SAMPLE_HTML}
								onChange={() => {}}
								disabled
								hideSourceToggle
							/>
		</>
	);
}

export function StringsOverride() {
	const [compactValue, setCompactValue] = useState<string>("<p>A short note about today's bookings.</p>");
	return (
		<>
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
		</>
	);
}
```

## Example exports

- `ProductionWiring`
- `Default`
- `CompactSmallerInlineNote`
- `EmptyPlaceholder`
- `Disabled`
- `StringsOverride`

