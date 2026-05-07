/**
 * Slice a single named export (`export function <name>() { … }`) out of a
 * raw source file. Brace-balanced — handles multi-line bodies. Falls back
 * to the full source when the name is not found.
 */
export function extractExample(source: string, name: string): string {
	const headerPattern = new RegExp(`export\\s+function\\s+${name}\\s*\\(`);
	const headerMatch = source.match(headerPattern);
	if (!headerMatch) return source;

	const start = headerMatch.index ?? 0;
	const openBraceIdx = source.indexOf('{', start);
	if (openBraceIdx === -1) return source;

	let depth = 1;
	let i = openBraceIdx + 1;
	while (i < source.length && depth > 0) {
		const ch = source[i];
		if (ch === '{') depth++;
		else if (ch === '}') depth--;
		i++;
	}

	if (depth !== 0) return source;
	return source.slice(start, i);
}
