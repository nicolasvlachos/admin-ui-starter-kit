#!/usr/bin/env node
/**
 * publish-skill — copy the component-library-rules skill into the user's
 * `~/.claude/skills/` and `~/.agents/skills/` directories so any project on
 * the same machine sees the same library rules.
 *
 * Run via `npm run publish:skill`. Idempotent — overwrites existing copies.
 *
 * Skill source: `.claude/skills/component-library-rules/`. References, PLAN.md,
 * SKILL.md all copied recursively.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..');
const SKILL_NAME = 'component-library-rules';
const SOURCE = path.join(REPO_ROOT, '.claude', 'skills', SKILL_NAME);

const HOME = os.homedir();
const TARGETS = [
	path.join(HOME, '.claude', 'skills', SKILL_NAME),
	path.join(HOME, '.agents', 'skills', SKILL_NAME),
];

async function exists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

async function copyDir(src, dst) {
	await fs.mkdir(dst, { recursive: true });
	const entries = await fs.readdir(src, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const dstPath = path.join(dst, entry.name);
		if (entry.isDirectory()) {
			await copyDir(srcPath, dstPath);
		} else if (entry.isFile()) {
			await fs.copyFile(srcPath, dstPath);
		}
	}
}

async function main() {
	if (!(await exists(SOURCE))) {
		console.error(`✖ Source skill not found at ${SOURCE}`);
		process.exit(1);
	}

	console.log(`Publishing skill "${SKILL_NAME}" from ${path.relative(REPO_ROOT, SOURCE)}\n`);

	for (const target of TARGETS) {
		try {
			if (await exists(target)) {
				await fs.rm(target, { recursive: true, force: true });
			}
			await copyDir(SOURCE, target);
			console.log(`  ✓ ${target}`);
		} catch (err) {
			console.error(`  ✖ ${target}`);
			console.error(`    ${err instanceof Error ? err.message : String(err)}`);
			process.exitCode = 1;
		}
	}

	if (process.exitCode === 1) {
		console.error('\n✖ One or more targets failed.');
	} else {
		console.log('\n✓ Skill published.');
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
