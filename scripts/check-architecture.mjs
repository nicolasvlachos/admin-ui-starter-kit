/**
 * check-architecture — enforces the layer order documented in
 * `.claude/skills/component-library-rules/SKILL.md` rule 2.
 *
 *   ui/        ← shadcn primitives                  (leaf)
 *   base/      ← typography-aware wrappers          (imports ui only)
 *   composed/  ← domain rows + cards                (imports base + ui)
 *   features/  ← provider-driven feature surfaces   (imports composed + base + ui)
 *   layout/    ← app-shell scaffolds                (imports anything below)
 *
 * Each layer can only import from layers below it. This script greps
 * every `.ts`/`.tsx` file under each layer for forbidden import paths
 * and fails CI if any cross-layer leak is found. Run via
 * `npm run lint:architecture`. Part of the `npm run verify` pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

const checks = [
	{
		label: 'base must not import composed/features/layout',
		dir: 'src/components/base',
		forbidden: [
			'src/components/composed',
			'src/components/features',
			'src/components/layout',
		],
	},
	{
		label: 'composed must not import features',
		dir: 'src/components/composed',
		forbidden: ['src/components/features'],
	},
	{
		label: 'default feature paths must stay framework-agnostic',
		dir: 'src/components/features',
		forbiddenPackages: [
			/@inertiajs\//,
			/@tanstack\/react-query/,
			/@tanstack\/react-router/,
			/react-router/,
			/next\//,
			/vite-bundled-i18n/,
			/ziggy-js/,
		],
		allowPath: /\/adapters\//,
	},
];

function walk(dir, files = []) {
	for (const name of fs.readdirSync(dir)) {
		const full = path.join(dir, name);
		const stat = fs.statSync(full);
		if (stat.isDirectory()) {
			if (name === 'node_modules' || name === 'dist') continue;
			walk(full, files);
			continue;
		}
		if (/\.(ts|tsx)$/.test(name)) files.push(full);
	}
	return files;
}

function getImportSpecifiers(source) {
	const specifiers = [];
	const patterns = [
		/\bimport\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g,
		/\bexport\s+(?:type\s+)?[^'"]*?\s+from\s+['"]([^'"]+)['"]/g,
		/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
	];
	for (const pattern of patterns) {
		for (const match of source.matchAll(pattern)) specifiers.push(match[1]);
	}
	return specifiers;
}

function resolveSpecifier(fromFile, specifier) {
	if (specifier.startsWith('@/')) {
		return path.join(root, 'src', specifier.slice(2));
	}
	if (specifier.startsWith('.')) {
		return path.resolve(path.dirname(fromFile), specifier);
	}
	return null;
}

function isInside(candidate, target) {
	const relative = path.relative(path.join(root, target), candidate);
	return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

for (const check of checks) {
	const absDir = path.join(root, check.dir);
	if (!fs.existsSync(absDir)) continue;
	for (const file of walk(absDir)) {
		const relative = path.relative(root, file);
		if (check.allowPath?.test(relative)) continue;
		const source = fs.readFileSync(file, 'utf8');
		for (const specifier of getImportSpecifiers(source)) {
			const resolved = resolveSpecifier(file, specifier);
			for (const forbidden of check.forbidden ?? []) {
				if (resolved && isInside(resolved, forbidden)) {
					failures.push(`${relative}: ${check.label} (${specifier})`);
				}
			}
			for (const pattern of check.forbiddenPackages ?? []) {
				if (pattern.test(specifier)) {
					failures.push(`${relative}: ${check.label} (${specifier})`);
				}
			}
		}
	}
}

if (failures.length > 0) {
	console.error('Architecture check failed:');
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log('Architecture check passed.');
