const ESCAPE: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};

export function sanitizeHtml(input: string): string {
	if (!input) return '';
	return input.replace(/[&<>"']/g, (ch) => ESCAPE[ch] ?? ch);
}

export default sanitizeHtml;
