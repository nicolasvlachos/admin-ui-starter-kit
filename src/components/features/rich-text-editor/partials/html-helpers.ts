/**
 * Plain HTML normalization shared by the TipTap and contenteditable
 * fallback editors. Keeping these out of the React tree means the
 * editor partials stay focused on rendering.
 */

export function normalizeHtml(value: string): string {
	const trimmed = value.trim();

	if (trimmed === '' || trimmed === '<p></p>' || trimmed === '<p><br></p>') {
		return '';
	}

	return trimmed;
}

export function toEditorContent(value: string): string {
	const normalized = normalizeHtml(value);
	return normalized === '' ? '<p></p>' : normalized;
}
