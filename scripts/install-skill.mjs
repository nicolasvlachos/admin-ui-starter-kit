#!/usr/bin/env node
/**
 * install-skill — consumer-facing installer for the
 * `component-library-rules` skill that ships inside the
 * `admin-ui-starter-kit` npm package.
 *
 * Run from a consumer project (after `npm install admin-ui-starter-kit`):
 *
 *   npx admin-ui-starter-kit-install-skill [--target=claude|agents|both] [--force]
 *
 * Default behaviour: copies the skill into BOTH
 *   <cwd>/.claude/skills/component-library-rules/
 *   <cwd>/.agents/skills/component-library-rules/
 *
 * The script is idempotent. It refuses to run inside the library itself
 * (the maintainer has `scripts/publish-skill.mjs` for that workflow).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const SKILL_NAME = 'component-library-rules';
const PACKAGE_NAME = 'admin-ui-starter-kit';

const __filename = fileURLToPath(import.meta.url);
// scripts/install-skill.mjs lives at <pkg>/scripts/, so package root is one up.
const PACKAGE_ROOT = path.resolve(path.dirname(__filename), '..');
const SOURCE = path.join(PACKAGE_ROOT, '.agents', 'skills', SKILL_NAME);

const CWD = process.cwd();

function parseArgs(argv) {
	const opts = { target: 'both', force: false, help: false };
	for (const arg of argv.slice(2)) {
		if (arg === '--force' || arg === '-f') {
			opts.force = true;
		} else if (arg === '--help' || arg === '-h') {
			opts.help = true;
		} else if (arg.startsWith('--target=')) {
			const value = arg.slice('--target='.length);
			if (!['claude', 'agents', 'both'].includes(value)) {
				console.error(`✖ Invalid --target=${value}. Expected one of: claude, agents, both.`);
				process.exit(2);
			}
			opts.target = value;
		} else {
			console.error(`✖ Unknown argument: ${arg}`);
			opts.help = true;
		}
	}
	return opts;
}

function printHelp() {
	console.log(
		`Usage: npx ${PACKAGE_NAME}-install-skill [options]\n\n` +
			`Installs the "${SKILL_NAME}" skill into the current project.\n\n` +
			`Options:\n` +
			`  --target=claude|agents|both   Where to install (default: both)\n` +
			`  --force, -f                   Overwrite existing skill dir without prompting\n` +
			`  --help, -h                    Show this message\n`,
	);
}

async function exists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

async function readJson(p) {
	try {
		return JSON.parse(await fs.readFile(p, 'utf8'));
	} catch {
		return null;
	}
}

async function copyDir(src, dst) {
	await fs.mkdir(dst, { recursive: true });
	const entries = await fs.readdir(src, { withFileTypes: true });
	let count = 0;
	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const dstPath = path.join(dst, entry.name);
		if (entry.isDirectory()) {
			count += await copyDir(srcPath, dstPath);
		} else if (entry.isFile()) {
			await fs.copyFile(srcPath, dstPath);
			count += 1;
		}
	}
	return count;
}

function confirm(question) {
	return new Promise((resolve) => {
		const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
		rl.question(question, (answer) => {
			rl.close();
			resolve(/^y(es)?$/i.test(answer.trim()));
		});
	});
}

async function installInto(targetDir, force) {
	// Safety: the only thing we ever delete is the existing skill dir at the
	// exact target path. We never touch the parent directory or siblings.
	if (await exists(targetDir)) {
		if (!force) {
			const ok = await confirm(`Overwrite existing ${targetDir}? [y/N] `);
			if (!ok) {
				console.log(`  · skipped ${targetDir}`);
				return null;
			}
		}
		await fs.rm(targetDir, { recursive: true, force: true });
	}
	const count = await copyDir(SOURCE, targetDir);
	console.log(`  ✓ Installed ${SKILL_NAME} → ${targetDir} (${count} files)`);
	return count;
}

async function main() {
	const opts = parseArgs(process.argv);
	if (opts.help) {
		printHelp();
		return;
	}

	// Refuse to run inside the library itself.
	const cwdPkg = await readJson(path.join(CWD, 'package.json'));
	if (cwdPkg && cwdPkg.name === PACKAGE_NAME) {
		console.error(
			`✖ Refusing to run inside the "${PACKAGE_NAME}" repo itself.\n` +
				`  Use \`npm run publish:skill\` for the maintainer workflow, or run this command\n` +
				`  from a consumer project that has installed ${PACKAGE_NAME} as a dependency.`,
		);
		process.exit(2);
	}

	if (!(await exists(SOURCE))) {
		console.error(
			`✖ Source skill not found at ${SOURCE}\n` +
				`  This usually means the ${PACKAGE_NAME} package is missing the skill files.\n` +
				`  Try reinstalling: npm install ${PACKAGE_NAME}@latest`,
		);
		process.exit(1);
	}

	const targets = [];
	if (opts.target === 'claude' || opts.target === 'both') {
		targets.push(path.join(CWD, '.claude', 'skills', SKILL_NAME));
	}
	if (opts.target === 'agents' || opts.target === 'both') {
		targets.push(path.join(CWD, '.agents', 'skills', SKILL_NAME));
	}

	console.log(`Installing "${SKILL_NAME}" from ${PACKAGE_NAME}\n`);
	for (const target of targets) {
		try {
			await installInto(target, opts.force);
		} catch (err) {
			console.error(`  ✖ ${target}`);
			console.error(`    ${err instanceof Error ? err.message : String(err)}`);
			process.exitCode = 1;
		}
	}

	if (process.exitCode === 1) {
		console.error('\n✖ One or more targets failed.');
	} else {
		console.log('\n✓ Done. Restart your AI agent / Claude Code session to pick up the skill.');
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
