#!/usr/bin/env node
/**
 * Walks every MDX page under src/preview/pages/**, plus its sibling
 * .examples.tsx, and writes a markdown reference file per page into
 * .agents/skills/component-library-rules/references/components/.
 *
 * Per-component .md files include YAML front-matter so agents can read
 * structured metadata without parsing the prose. A flat INDEX.json sits
 * alongside INDEX.md as the agent-friendly discovery surface.
 *
 * --check : exits non-zero if the generated content differs from what's on
 *           disk (used in `npm run verify`).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, '.agents/skills/component-library-rules/references/components');
const CHECK = process.argv.includes('--check');

const STOPWORDS = new Set([
	'the', 'and', 'for', 'a', 'an', 'of', 'to', 'in', 'with', 'on', 'by',
	'or', 'is', 'as', 'at', 'be', 'this', 'that', 'it', 'are', 'from',
	'into', 'over', 'per', 'via', 'so', 'if', 'no', 'not', 'but', 'use',
	'used', 'using', 'their', 'these', 'those', 'any', 'each', 'every',
	'all', 'one', 'two', 'three', 'your', 'you', 'our',
]);

const mdxFiles = globSync('src/preview/pages/**/*.mdx', { cwd: ROOT, absolute: true });

const generated = {};

function parseFrontmatter(mdx) {
	// We don't use real frontmatter; we read the <DocsPage … > attributes.
	const m = mdx.match(/<DocsPage\s+([^>]*)>/s);
	if (!m) return {};
	const attrs = m[1];
	const get = (k) => attrs.match(new RegExp(`${k}="([^"]*)"`))?.[1];
	return {
		title: get('title') ?? '',
		description: get('description') ?? '',
		layer: get('layer') ?? '',
		status: get('status') ?? '',
		sourcePath: get('sourcePath') ?? '',
	};
}

function inferIdFromPath(absPath) {
	// src/preview/pages/<section>/<slug>.mdx → <section>/<slug>
	const rel = relative(resolve(ROOT, 'src/preview/pages'), absPath);
	return rel.replace(/\.mdx$/, '');
}

/**
 * Parse the registry to map preview-page slug → { label, family, section }.
 * Each REGISTRY entry imports './pages/<section>/<slug>.mdx'; we extract the
 * import path along with id/label/family.
 */
function buildRegistryMap() {
	const registryPath = resolve(ROOT, 'src/preview/registry.tsx');
	const src = readFileSync(registryPath, 'utf8');
	const out = new Map();
	const re = /\{\s*id:\s*'([^']+)'\s*,\s*label:\s*'([^']+)'\s*,\s*section:\s*'([^']+)'\s*,\s*family:\s*'([^']+)'\s*,\s*component:\s*lazy\(\s*\(\s*\)\s*=>\s*import\(\s*'([^']+)'\s*\)/g;
	let m;
	while ((m = re.exec(src))) {
		const [, , label, section, family, importPath] = m;
		// Normalize: './pages/<section>/<slug>.mdx' or '.tsx'
		const norm = importPath
			.replace(/^\.\//, '')
			.replace(/^pages\//, '')
			.replace(/\.(mdx|tsx|ts|jsx|js)$/, '');
		out.set(norm, { label, section, family });
	}
	return out;
}

const REGISTRY_MAP = buildRegistryMap();

function discoverImports(examplesSource) {
	const out = new Set();
	const re = /from\s+['"](@\/(?:components|preview)\/[^'"]+)['"]/g;
	let m;
	while ((m = re.exec(examplesSource))) out.add(m[1]);
	return [...out].sort();
}

function importToSourcePath(specifier) {
	if (!specifier.startsWith('@/components/') && !specifier.startsWith('@/preview/')) {
		return '';
	}
	return `src/${specifier.slice(2)}`;
}

function commonDirectory(paths) {
	if (paths.length === 0) return '';
	const split = paths.map((p) => p.split('/').filter(Boolean));
	const out = [];
	for (let i = 0; i < split[0].length; i++) {
		const segment = split[0][i];
		if (split.every((parts) => parts[i] === segment)) out.push(segment);
		else break;
	}
	return out.length >= 3 ? out.join('/') : '';
}

function inferSourcePath({ id, layer, imports }) {
	const candidates = imports
		.map(importToSourcePath)
		.filter(Boolean)
		.filter((p) => !p.startsWith('src/components/typography'));

	if (candidates.length === 0) return '';

	const idParts = id.split('/');
	const idSection = idParts[0];
	const preferredLayer = layer || idSection;
	const layerCandidates = candidates.filter((p) =>
		p.startsWith(`src/components/${preferredLayer}/`),
	);
	const scoped = layerCandidates.length > 0 ? layerCandidates : candidates;

	const slug = idParts[1] ?? '';
	const slugCandidates = slug
		? scoped.filter((p) => p.split('/').includes(slug))
		: [];
	const narrowed = slugCandidates.length > 0 ? slugCandidates : scoped;

	return commonDirectory(narrowed) || narrowed[0] || '';
}

function discoverExampleNames(examplesSource) {
	const out = [];
	const re = /export\s+function\s+([A-Za-z0-9_]+)\s*\(/g;
	let m;
	while ((m = re.exec(examplesSource))) out.push(m[1]);
	return out;
}

function deriveTags({ layer, family, sourcePath, title, description }) {
	const tags = new Set();
	if (layer) tags.add(layer.toLowerCase());
	if (family) {
		for (const part of family.toLowerCase().split(/[\s&/,-]+/)) {
			if (part) tags.add(part);
		}
	}
	if (sourcePath) {
		const last = sourcePath.split('/').filter(Boolean).pop();
		if (last) tags.add(last.toLowerCase());
	}
	const text = `${title} ${description}`.toLowerCase();
	const tokens = text
		.split(/[^a-z0-9]+/)
		.filter((t) => t.length > 2 && !STOPWORDS.has(t));
	// Take up to 4 distinct keyword tags (not already present).
	let added = 0;
	for (const t of tokens) {
		if (added >= 4) break;
		if (tags.has(t)) continue;
		tags.add(t);
		added += 1;
	}
	return [...tags];
}

function buildMarkdown({ id, fm, family, examplesSource, exampleNames, imports, tags }) {
	const lines = [];

	// YAML front-matter — agent-friendly structured header.
	lines.push('---');
	lines.push(`id: ${id}`);
	lines.push(`title: ${JSON.stringify(fm.title || id)}`);
	if (fm.description) lines.push(`description: ${JSON.stringify(fm.description)}`);
	if (fm.layer) lines.push(`layer: ${fm.layer}`);
	if (family) lines.push(`family: ${JSON.stringify(family)}`);
	if (fm.sourcePath) lines.push(`sourcePath: ${fm.sourcePath}`);
	lines.push('examples:');
	for (const n of exampleNames) lines.push(`  - ${n}`);
	lines.push('imports:');
	for (const i of imports) lines.push(`  - ${i}`);
	lines.push('tags:');
	for (const t of tags) lines.push(`  - ${t}`);
	lines.push('---');
	lines.push('');

	lines.push(`# ${fm.title || id}`);
	lines.push('');
	if (fm.description) lines.push(fm.description, '');
	if (fm.layer) lines.push(`**Layer:** \`${fm.layer}\`  `);
	if (fm.sourcePath) lines.push(`**Source:** \`${fm.sourcePath}\``);
	lines.push('');

	if (examplesSource) {
		lines.push('## Examples');
		lines.push('');
		lines.push('```tsx');
		lines.push(examplesSource.trim());
		lines.push('```');
		lines.push('');
	}

	if (exampleNames.length > 0) {
		lines.push('## Example exports');
		lines.push('');
		for (const n of exampleNames) lines.push(`- \`${n}\``);
		lines.push('');
	}

	return lines.join('\n') + '\n';
}

const indexEntries = [];

for (const abs of mdxFiles) {
	const id = inferIdFromPath(abs);
	const mdx = readFileSync(abs, 'utf8');
	const fm = parseFrontmatter(mdx);

	const examplesPath = abs.replace(/\.mdx$/, '.examples.tsx');
	let examplesSource = '';
	let exampleNames = [];
	let imports = [];
	if (existsSync(examplesPath)) {
		examplesSource = readFileSync(examplesPath, 'utf8');
		exampleNames = discoverExampleNames(examplesSource);
		imports = discoverImports(examplesSource);
	}

	const reg = REGISTRY_MAP.get(id) ?? {};
	const family = reg.family ?? '';
	const sourcePath = fm.sourcePath || inferSourcePath({ id, layer: fm.layer, imports });
	const resolvedFm = { ...fm, sourcePath };
	const tags = deriveTags({
		layer: resolvedFm.layer,
		family,
		sourcePath: resolvedFm.sourcePath,
		title: resolvedFm.title,
		description: resolvedFm.description,
	});

	const docFile = `${id.replace(/\//g, '__')}.md`;
	const md = buildMarkdown({ id, fm: resolvedFm, family, examplesSource, exampleNames, imports, tags });
	const outPath = resolve(OUT_DIR, docFile);
	generated[outPath] = md;

	indexEntries.push({
		id,
		title: resolvedFm.title || id,
		description: resolvedFm.description || '',
		layer: resolvedFm.layer || '',
		family,
		tags,
		sourcePath: resolvedFm.sourcePath || '',
		examples: exampleNames,
		doc: `./${docFile}`,
	});
}

// INDEX.md — human-readable.
const indexLines = ['# Component reference index', '', 'Auto-generated. Do not edit by hand — run `npm run docs:sync-skill`.', '', 'Agents: prefer `INDEX.json` (structured) for discovery; this file is for humans.', ''];
const grouped = {};
for (const entry of indexEntries) {
	const section = entry.id.split('/')[0];
	(grouped[section] ??= []).push(entry);
}
for (const section of Object.keys(grouped).sort()) {
	indexLines.push(`## ${section}`, '');
	for (const e of grouped[section].sort((a, b) => a.id.localeCompare(b.id))) {
		indexLines.push(`- [${e.title}](${e.doc}) — ${e.description}`);
	}
	indexLines.push('');
}
generated[resolve(OUT_DIR, 'INDEX.md')] = indexLines.join('\n') + '\n';

// INDEX.json — agent-friendly.
const sortedEntries = [...indexEntries].sort((a, b) => a.id.localeCompare(b.id));
// Compact one-entry-per-line for grep-friendliness without ballooning size.
generated[resolve(OUT_DIR, 'INDEX.json')] =
	'[\n' + sortedEntries.map((e) => '  ' + JSON.stringify(e)).join(',\n') + '\n]\n';

// README.md (one-time content; only created if missing)
const readmePath = resolve(OUT_DIR, 'README.md');
const readmeContent = `# Component reference

This directory is generated from the MDX showcase pages under
\`src/preview/pages/\`. AI agents using the \`component-library-rules\`
skill should read \`INDEX.json\` (small, structured) to find candidate
components, then load the matching per-component \`.md\` (linked via
the \`doc\` field) for full prose + verbatim example source.

To regenerate: \`npm run docs:sync-skill\`
To verify freshness in CI: \`npm run docs:sync-skill -- --check\`
`;

if (CHECK) {
	let stale = false;
	if (!existsSync(readmePath)) { console.error('Missing README.md'); stale = true; }
	for (const [path, content] of Object.entries(generated)) {
		const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
		if (current !== content) {
			stale = true;
			console.error(`Stale: ${relative(ROOT, path)}`);
		}
	}
	// Detect orphan files (on disk but no longer generated).
	if (existsSync(OUT_DIR)) {
		const onDisk = readdirSync(OUT_DIR).filter((f) => (f.endsWith('.md') || f.endsWith('.json')) && f !== 'README.md');
		const expected = new Set(Object.keys(generated).map((p) => basename(p)));
		for (const f of onDisk) {
			if (!expected.has(f)) {
				stale = true;
				console.error(`Orphan: ${f}`);
			}
		}
	}
	if (stale) {
		console.error('\nrun `npm run docs:sync-skill` to regenerate.');
		process.exit(1);
	}
	console.log('skill components are up to date.');
} else {
	mkdirSync(OUT_DIR, { recursive: true });
	if (!existsSync(readmePath)) writeFileSync(readmePath, readmeContent);
	// Wipe any orphan files first so the directory always matches generated set.
	const onDisk = readdirSync(OUT_DIR).filter((f) => (f.endsWith('.md') || f.endsWith('.json')) && f !== 'README.md');
	const expectedFilenames = new Set(Object.keys(generated).map((p) => basename(p)));
	for (const f of onDisk) {
		if (!expectedFilenames.has(f)) rmSync(resolve(OUT_DIR, f));
	}
	for (const [path, content] of Object.entries(generated)) {
		writeFileSync(path, content);
	}
	console.log(`Wrote ${Object.keys(generated).length} files to ${relative(ROOT, OUT_DIR)}`);
}
