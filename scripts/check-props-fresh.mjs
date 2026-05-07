#!/usr/bin/env node
/**
 * CI guard: re-runs the props generator and confirms the on-disk
 * `src/preview/_docs/props.generated.json` matches what the generator would
 * produce right now. Works before the file is first committed (no `git show`
 * dependency).
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const TARGET = 'src/preview/_docs/props.generated.json';

if (!existsSync(TARGET)) {
	console.error(`\n${TARGET} does not exist.`);
	console.error('Run `npm run docs:generate-props` first.\n');
	process.exit(1);
}

const before = readFileSync(TARGET, 'utf8');

execSync('node scripts/generate-props-tables.mjs', { stdio: 'inherit' });

const after = readFileSync(TARGET, 'utf8');

if (before.trim() !== after.trim()) {
	console.error('\nprops.generated.json was OUT OF DATE.');
	console.error('The generator just regenerated it — review the diff and commit when ready.\n');
	// Restore the previous on-disk content so a verify run leaves the working tree
	// in the state the user had before. The user can re-run `docs:generate-props`
	// explicitly when they actually want to update.
	writeFileSync(TARGET, before);
	process.exit(1);
}

console.log('props.generated.json is up to date.');
