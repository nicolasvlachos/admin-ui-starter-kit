#!/usr/bin/env node
/**
 * Empty dist/ without deleting the directory itself.
 *
 * macOS Finder can recreate `dist/.DS_Store` while a recursive directory
 * removal is in progress, causing `rm -rf dist` / `fs.rmSync('dist')` to fail
 * with ENOTEMPTY. Clearing the children is enough for a clean Vite build and
 * avoids that directory-removal race.
 */
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

if (!existsSync(DIST)) {
	mkdirSync(DIST);
	process.exit(0);
}

for (const entry of readdirSync(DIST)) {
	rmSync(join(DIST, entry), {
		recursive: true,
		force: true,
		maxRetries: 5,
		retryDelay: 100,
	});
}
