import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const exportsMap = pkg.exports ?? {};
const failures = [];
const viteLibConfig = fs.readFileSync(path.join(root, 'vite.lib.config.ts'), 'utf8');

function exists(relativePath) {
	return fs.existsSync(path.join(root, relativePath));
}

/**
 * Resolve a single exports-map entry. Accepts either a bare string
 * (legacy) or a conditional object with `import` / `require` / `types`
 * keys (current format). Returns the source path for existence checks —
 * for the conditional form we only sanity-check that the entry has the
 * shape we expect; the file-existence check happens via the wildcard
 * resolver below since the targets live in `dist/` after `npm run
 * build:lib`, not at lint time.
 */
function isConditional(target) {
	return target !== null && typeof target === 'object' && !Array.isArray(target);
}

for (const [key, target] of Object.entries(exportsMap)) {
	if (typeof target === 'string') {
		if (target.includes('*')) continue;
		// `./style.css` and similar literal targets — they live under dist/
		// after build, so don't assert during lint.
		continue;
	}
	if (isConditional(target)) {
		// Conditional export: at minimum require `import` and (optionally) `types`.
		if (!('import' in target)) {
			failures.push(`${key} conditional export missing "import" condition`);
		}
		// Targets all point into dist/, so we don't filesystem-check them
		// here — that's the job of `npm run build:lib`.
		continue;
	}
	failures.push(`${key} has an unrecognised export shape: ${JSON.stringify(target)}`);
}

const wildcardLayers = [
	{ key: './base/*', root: 'src/components/base' },
	{ key: './composed/*', root: 'src/components/composed' },
	{ key: './features/*', root: 'src/components/features' },
	{ key: './layout/*', root: 'src/components/layout' },
];

for (const layer of wildcardLayers) {
	const wildcardTarget = exportsMap[layer.key];
	if (wildcardTarget === undefined) {
		failures.push(`${layer.key} wildcard export is missing`);
		continue;
	}
	if (typeof wildcardTarget !== 'string' && !isConditional(wildcardTarget)) {
		failures.push(`${layer.key} wildcard export has an unrecognised shape`);
		continue;
	}

	for (const name of fs.readdirSync(path.join(root, layer.root))) {
		const dir = path.join(layer.root, name);
		const stat = fs.statSync(path.join(root, dir));
		if (!stat.isDirectory()) continue;

		const indexTs = `${dir}/index.ts`;
		const indexTsx = `${dir}/index.tsx`;
		const exactKey = `${layer.key.replace('/*', '')}/${name}`;
		const entryKey = `'components/${layer.key.slice(2, -2)}/${name}/index'`;

		if (!exists(indexTs) && !exists(indexTsx)) {
			failures.push(
				`${exactKey} is exposed by ${layer.key} but has no matching index.ts(x) source`,
			);
			continue;
		}

		if (!viteLibConfig.includes(entryKey)) {
			failures.push(
				`${exactKey} is exposed by ${layer.key} but is missing from vite.lib.config.ts entries`,
			);
		}
	}
}

if (failures.length > 0) {
	console.error('Package export check failed:');
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log('Package export check passed.');
