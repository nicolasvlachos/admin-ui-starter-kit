#!/usr/bin/env node
/**
 * Walks src/components/{base,composed,features,layout,typography}/**\/*.tsx,
 * extracts component prop docs via react-docgen-typescript, and writes a
 * single JSON file consumed by <PropsTable> at runtime.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';
import docgen from 'react-docgen-typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const tsconfigPath = resolve(ROOT, 'tsconfig.app.json');
const parser = docgen.withCustomConfig(tsconfigPath, {
	savePropValueAsString: true,
	shouldExtractLiteralValuesFromEnum: true,
	propFilter: (prop) => {
		if (prop.parent && /node_modules/.test(prop.parent.fileName)) return false;
		return true;
	},
});

const PATTERNS = [
	'src/components/base/**/*.tsx',
	'src/components/composed/**/*.tsx',
	'src/components/features/**/*.tsx',
	'src/components/layout/**/*.tsx',
	'src/components/typography/**/*.tsx',
];

const files = PATTERNS.flatMap((p) => globSync(p, { cwd: ROOT, absolute: true }))
	.filter((f) => !f.endsWith('.test.tsx') && !f.endsWith('.examples.tsx'));

console.log(`Parsing ${files.length} files…`);
const allComponents = parser.parse(files);

const byName = {};
for (const c of allComponents) {
	if (!c.displayName) continue;
	byName[c.displayName] = {
		displayName: c.displayName,
		description: c.description ?? '',
		filePath: c.filePath?.replace(ROOT + '/', '') ?? '',
		props: Object.fromEntries(
			Object.entries(c.props ?? {}).map(([name, prop]) => [
				name,
				{
					name,
					required: prop.required,
					description: prop.description ?? '',
					defaultValue: prop.defaultValue?.value ?? null,
					type: prop.type?.name ?? 'unknown',
				},
			]),
		),
	};
}

const outDir = resolve(ROOT, 'src/preview/_docs');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'props.generated.json');
writeFileSync(outFile, JSON.stringify(byName, null, 2) + '\n');
console.log(`Wrote ${Object.keys(byName).length} components → ${outFile}`);
