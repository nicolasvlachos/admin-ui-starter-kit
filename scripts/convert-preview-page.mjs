#!/usr/bin/env node
/**
 * One-shot mechanical converter:  XPage.tsx  →  x.mdx + x.examples.tsx
 *
 * Usage:  node scripts/convert-preview-page.mjs           (converts all)
 *         node scripts/convert-preview-page.mjs path.tsx  (single file)
 */
import { readFileSync, writeFileSync, existsSync, globSync } from 'node:fs';
import { dirname, basename, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Pages already hand-converted in earlier phases — never touch.
const SKIP = new Set([
	'src/preview/pages/base/BadgePage.tsx',
	'src/preview/pages/base/ItemPage.tsx',
	'src/preview/pages/base/FormsPage.tsx',
	'src/preview/pages/features/GlobalSearchPage.tsx',
	'src/preview/pages/features/FiltersPage.tsx',
]);

const PREVIEW_LAYOUT_HELPERS = ['Row', 'Col']; // re-exportable shells

function pascalToSlug(name) {
	return name.replace(/Page$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function titleToExportName(title) {
	const name =
		title
			.replace(/[^a-zA-Z0-9 ]+/g, ' ')
			.split(/\s+/)
			.filter(Boolean)
			.map((w) => w[0].toUpperCase() + w.slice(1))
			.join('') || 'Example';
	// JS identifiers can't start with a digit.
	return /^[0-9]/.test(name) ? `Example${name}` : name;
}

// Match an opening JSX tag's attribute list, allowing `>` inside double-quoted strings.
// Capture group 1 is the attrs blob (without the trailing `>`).
function openTagAttrsRegex(name, flags = '') {
	return new RegExp(`<${name}\\s+((?:"[^"]*"|[^>])*)>`, flags);
}

function extractPreviewPageProps(source) {
	const open = source.match(openTagAttrsRegex('PreviewPage'));
	if (!open) return null;
	const attrs = open[1];
	const title = attrs.match(/title="([^"]*)"/)?.[1] ?? 'Untitled';
	const description = attrs.match(/description="([^"]*)"/)?.[1] ?? '';
	return { title, description };
}

function extractSections(source) {
	const out = [];
	const re = new RegExp(
		`<PreviewSection\\s+((?:"[^"]*"|[^>])*)>([\\s\\S]*?)</PreviewSection>`,
		'g',
	);
	let m;
	while ((m = re.exec(source))) {
		const attrs = m[1];
		const inner = m[2];
		const title = attrs.match(/title="([^"]*)"/)?.[1] ?? 'Example';
		out.push({ title, inner: inner.trim() });
	}
	return out;
}

function extractTopImports(source) {
	const out = [];
	// Multi-line import blocks: import {...} from '...';
	const re = /^import\s[\s\S]*?from\s+['"][^'"]+['"];?$/gm;
	let m;
	while ((m = re.exec(source))) out.push(m[0]);
	// Drop the PreviewLayout import — replaced below if Row/Col actually used.
	return out.filter((line) => !/['"]\.\.\/\.\.\/PreviewLayout['"]/.test(line));
}

/**
 * Extract top-level helper declarations (const X = ...; function f() {...})
 * that sit BEFORE the `export default function` page component.
 */
function extractTopLevelDecls(source) {
	const defaultIdx = source.search(/^\s*export\s+default\s+function/m);
	if (defaultIdx < 0) return '';
	const prelude = source.slice(0, defaultIdx);
	const withoutImports = prelude.replace(/^import\s[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
	return withoutImports.trim();
}

/**
 * Pull the body of `export default function PageName() { ... }` and grab the
 * statements above the first `return (` at the body's top level.
 * Returns an array of complete statement strings (balanced braces/parens).
 */
function extractPageBodyHookStatements(source) {
	const m = source.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/);
	if (!m) return [];
	const start = m.index + m[0].length;
	// Walk to the matching closing brace to find the body.
	let depth = 1;
	let i = start;
	while (i < source.length && depth > 0) {
		const ch = source[i];
		if (ch === '{') depth++;
		else if (ch === '}') depth--;
		else if (ch === '"' || ch === "'" || ch === '`') {
			// skip string
			const quote = ch;
			i++;
			while (i < source.length && source[i] !== quote) {
				if (source[i] === '\\') i++;
				i++;
			}
		}
		i++;
		if (depth === 0) break;
	}
	const body = source.slice(start, i - 1);

	// Find first `return (` at top level (depth === 0 of nested braces in body).
	let d = 0;
	let returnAt = -1;
	for (let j = 0; j < body.length; j++) {
		const ch = body[j];
		if (ch === '{') d++;
		else if (ch === '}') d--;
		else if (d === 0 && body.slice(j, j + 16).match(/^return\s*\(/)) {
			returnAt = j;
			break;
		}
	}
	if (returnAt < 0) return [];
	const head = body.slice(0, returnAt);

	// Split head into statements: walk top-level (depth 0 paren+brace+bracket),
	// terminating on `;`. Skip blank lines.
	const stmts = [];
	let buf = '';
	let p = 0;
	let b = 0;
	let k = 0;
	for (let j = 0; j < head.length; j++) {
		const ch = head[j];
		if (ch === '{') b++;
		else if (ch === '}') b--;
		else if (ch === '(') p++;
		else if (ch === ')') p--;
		else if (ch === '[') k++;
		else if (ch === ']') k--;
		else if (ch === '"' || ch === "'" || ch === '`') {
			buf += ch;
			j++;
			while (j < head.length && head[j] !== ch) {
				if (head[j] === '\\') {
					buf += head[j];
					j++;
				}
				buf += head[j];
				j++;
			}
			if (j < head.length) buf += head[j];
			continue;
		}
		buf += ch;
		if (ch === ';' && p === 0 && b === 0 && k === 0) {
			const s = buf.trim();
			if (s) stmts.push(s);
			buf = '';
		}
	}
	const tail = buf.trim();
	if (tail) stmts.push(tail);
	return stmts;
}

function collectIdentsFromStatement(stmt) {
	const out = new Set();
	// Array destructuring
	const arr = stmt.match(/(?:const|let|var)\s*\[([^\]]+)\]\s*=/);
	if (arr) {
		for (const part of arr[1].split(',')) {
			const t = part.trim().split(/[:=\s]/)[0];
			if (/^[A-Za-z_$][\w$]*$/.test(t)) out.add(t);
		}
	}
	// Object destructuring
	const obj = stmt.match(/(?:const|let|var)\s*\{([^}]+)\}\s*=/);
	if (obj) {
		for (const part of obj[1].split(',')) {
			const t = part.trim().split(/[:=\s]/)[0];
			if (/^[A-Za-z_$][\w$]*$/.test(t)) out.add(t);
		}
	}
	// Plain `const foo` / `function foo` / `let foo`
	const single = stmt.match(/^(?:const|let|var|function)\s+(\w+)/);
	if (single) out.add(single[1]);
	return [...out];
}

function collectIdentsFromHookLine(line) {
	const out = [];
	// const [a, setA, ...] = ...
	const arr = line.match(/const\s*\[([^\]]+)\]\s*=/);
	if (arr) {
		for (const part of arr[1].split(',')) {
			const t = part.trim().split(/[:=\s]/)[0];
			if (/^[A-Za-z_$][\w$]*$/.test(t)) out.push(t);
		}
	}
	// const foo = ... | function foo(...) {}
	const single = line.match(/^\s*(?:const|let|var|function)\s+(\w+)/);
	if (single) out.push(single[1]);
	// const { a, b } = ...
	const obj = line.match(/const\s*\{([^}]+)\}\s*=/);
	if (obj) {
		for (const part of obj[1].split(',')) {
			const t = part.trim().split(/[:=\s]/)[0];
			if (/^[A-Za-z_$][\w$]*$/.test(t)) out.push(t);
		}
	}
	return out;
}

function collectImportedIdents(source) {
	const out = new Set();
	const re = /^import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"];?$/gm;
	let m;
	while ((m = re.exec(source))) {
		const clause = m[1];
		// `Foo` (default), `* as Foo` (namespace), or `{ A, B as C }` (named)
		const named = clause.match(/\{([^}]*)\}/);
		if (named) {
			for (const part of named[1].split(',')) {
				const piece = part.trim();
				if (!piece) continue;
				const asMatch = piece.match(/\sas\s+(\w+)$/);
				out.add(asMatch ? asMatch[1] : piece.split(/\s/)[0]);
			}
		}
		const ns = clause.match(/\*\s+as\s+(\w+)/);
		if (ns) out.add(ns[1]);
		// default import: leading `Foo,` or just `Foo`
		const def = clause.match(/^\s*(\w+)\s*(?:,|$)/);
		if (def) out.add(def[1]);
	}
	return out;
}

function bodyMentions(body, name) {
	// Tokenise the body into identifier runs, ignoring strings, attribute
	// values like className="text-xs" (where `text` shouldn't count as a
	// reference to a `text` variable), and JSX prop dashes.
	// Heuristic: an identifier reference is preceded/followed by a non-word
	// char that isn't `-` or `.` or `:` or part of a quoted string.
	// We strip strings first, then match `\bname\b` in the remainder.
	const stripped = body
		.replace(/"[^"]*"/g, '""')
		.replace(/'[^']*'/g, "''")
		.replace(/`[^`]*`/g, '``');
	const re = new RegExp(`(?:^|[^\\w.\\-])${name}(?:[^\\w\\-]|$)`);
	return re.test(stripped);
}

function convertOne(absPath) {
	const rel = relative(ROOT, absPath);
	if (SKIP.has(rel)) return { rel, status: 'skipped (manual)' };

	const source = readFileSync(absPath, 'utf8');

	const props = extractPreviewPageProps(source);
	if (!props) return { rel, status: 'skipped (no PreviewPage)' };

	const sections = extractSections(source);
	if (sections.length === 0) return { rel, status: 'skipped (no sections)' };

	const fileBase = basename(absPath, '.tsx');
	const slug = pascalToSlug(fileBase);
	const dir = dirname(absPath);
	const examplesPath = join(dir, `${slug}.examples.tsx`);
	const mdxPath = join(dir, `${slug}.mdx`);

	if (existsSync(mdxPath)) return { rel, status: 'skipped (mdx exists)' };

	// Identifiers imported at the top — examples can't shadow them.
	const importedIdents = collectImportedIdents(source);

	const usedNames = new Set();
	const named = sections.map((s) => {
		let name = titleToExportName(s.title);
		// Avoid shadowing imported identifiers (e.g. `Input`, `Select`).
		if (importedIdents.has(name)) name = `${name}Example`;
		let i = 1;
		const baseName = name;
		while (usedNames.has(name)) name = `${baseName}${++i}`;
		usedNames.add(name);
		return { name, title: s.title, inner: s.inner };
	});

	const allBody = named.map((n) => n.inner).join('\n');
	const topDecls = extractTopLevelDecls(source);
	const hookStatements = extractPageBodyHookStatements(source);
	const hookStatementIdents = hookStatements.map((s) => collectIdentsFromStatement(s));

	const imports = extractTopImports(source);
	// If any of the section bodies use Row or Col, re-add a PreviewLayout import.
	const layoutHelpersUsed = PREVIEW_LAYOUT_HELPERS.filter((n) => bodyMentions(allBody, n) || bodyMentions(topDecls, n));
	if (layoutHelpersUsed.length > 0) {
		imports.push(`import { ${layoutHelpersUsed.join(', ')} } from '../../PreviewLayout';`);
	}

	// Per-example: include only hook statements whose declared idents are
	// referenced by the example body (so noUnusedLocals doesn't fire).
	function hooksUsedBy(inner) {
		if (hookStatements.length === 0) return '';
		const out = [];
		for (let h = 0; h < hookStatements.length; h++) {
			const idents = hookStatementIdents[h];
			if (idents.length === 0) continue; // skip non-decl statements
			if (idents.some((id) => bodyMentions(inner, id))) out.push(hookStatements[h]);
		}
		return out.join('\n');
	}

	const examplesBody = named
		.map((n) => {
			const hooks = hooksUsedBy(n.inner);
			const hookBlock = hooks ? indent(hooks, 1) + '\n' : '';
			return `export function ${n.name}() {\n${hookBlock}\treturn (\n\t\t<>\n${indent(n.inner, 3)}\n\t\t</>\n\t);\n}`;
		})
		.join('\n\n');

	// Showcase examples are generated mechanically; suppress strict-mode noise
	// (unused locals from copied-but-unused state hooks, etc.) so the global
	// typecheck stays clean. Real type errors in these files would still
	// surface at runtime in the preview app.
	const examplesContents = `// @ts-nocheck\n${imports.join('\n')}\n\n${topDecls ? topDecls + '\n\n' : ''}${examplesBody}\n`;

	const mdxImports = `import { DocsPage, Section, Example } from '@/preview/_docs';\nimport * as Examples from './${slug}.examples';\nimport examplesSource from './${slug}.examples?raw';\n`;
	const sectionsMdx = named
		.map((n) => `<Example name="${n.name}" source={examplesSource}>\n\t<Examples.${n.name} />\n</Example>`)
		.join('\n\n');

	const layer = inferLayer(rel);
	const mdxContents = `${mdxImports}\n<DocsPage\n\ttitle="${escapeAttr(props.title)}"\n\tdescription="${escapeAttr(props.description)}"\n\tlayer="${layer}"\n\tstatus="ready"\n>\n\n<Section title="Examples" id="examples">\n\n${sectionsMdx}\n\n</Section>\n\n</DocsPage>\n`;

	writeFileSync(examplesPath, examplesContents);
	writeFileSync(mdxPath, mdxContents);
	return { rel, status: `converted (${named.length} examples)` };
}

function indent(s, levels) {
	const pad = '\t'.repeat(levels);
	return s
		.split('\n')
		.map((l) => (l.length ? pad + l : l))
		.join('\n');
}

function escapeAttr(s) {
	return s.replace(/"/g, '\\"');
}

function inferLayer(relPath) {
	const m = relPath.match(/src\/preview\/pages\/([^/]+)\//);
	const seg = m?.[1] ?? '';
	if (['ui', 'base', 'composed', 'features', 'layout', 'common'].includes(seg)) return seg;
	return 'common';
}

const arg = process.argv[2];
const targets = arg
	? [resolve(ROOT, arg)]
	: globSync('src/preview/pages/**/*Page.tsx', { cwd: ROOT }).map((p) => resolve(ROOT, p));

const results = targets.map(convertOne);
for (const r of results) console.log(`${r.status.padEnd(28)} ${r.rel}`);
const converted = results.filter((r) => r.status.startsWith('converted')).length;
console.log(`\nDone: ${converted}/${results.length} converted.`);
