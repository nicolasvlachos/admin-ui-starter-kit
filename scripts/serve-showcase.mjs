#!/usr/bin/env node
/**
 * admin-ui-starter-kit-showcase — serves the bundled component showcase
 * locally so consumers can browse the docs site shipped with the package.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const PKG_ROOT = resolve(dirname(__filename), '..');
const SHOWCASE_ROOT = join(PKG_ROOT, 'dist', 'showcase');

const args = process.argv.slice(2);
const flag = (name) => {
	const i = args.findIndex((a) => a === name || a.startsWith(name + '='));
	if (i === -1) return undefined;
	const a = args[i];
	return a.includes('=') ? a.split('=').slice(1).join('=') : args[i + 1];
};

if (args.includes('--help') || args.includes('-h')) {
	console.log(`Usage: admin-ui-starter-kit-showcase [--port <n>] [--host <h>]

Serves the bundled component showcase from this package's dist/showcase/.

Options:
  --port <n>   port to listen on (default: 7654; falls through if busy)
  --host <h>   host to bind to (default: 127.0.0.1)
  --no-open    do not auto-open a browser
  -h, --help   show this help
`);
	process.exit(0);
}

const port = Number(flag('--port') ?? 7654);
const host = flag('--host') ?? '127.0.0.1';
const noOpen = args.includes('--no-open');

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'application/javascript; charset=utf-8',
	'.mjs': 'application/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.map': 'application/json; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
};

async function exists(p) {
	try { await stat(p); return true; } catch { return false; }
}

if (!(await exists(join(SHOWCASE_ROOT, 'index.html')))) {
	console.error('ERROR: showcase bundle not found at', SHOWCASE_ROOT);
	console.error('This binary expects dist/showcase/ to be present in the installed package.');
	console.error('If you are running from a source checkout, first run: npm run build:showcase');
	process.exit(1);
}

const server = createServer(async (req, res) => {
	try {
		const url = new URL(req.url ?? '/', `http://${host}:${port}`);
		let pathname = decodeURIComponent(url.pathname);
		if (pathname === '/') pathname = '/index.html';
		const candidate = join(SHOWCASE_ROOT, pathname);
		// Disallow path traversal.
		if (!candidate.startsWith(SHOWCASE_ROOT)) {
			res.writeHead(403); res.end('Forbidden'); return;
		}
		const target = (await exists(candidate)) ? candidate : join(SHOWCASE_ROOT, 'index.html');
		const data = await readFile(target);
		const type = MIME[extname(target).toLowerCase()] ?? 'application/octet-stream';
		res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
		res.end(data);
	} catch (err) {
		res.writeHead(500); res.end(String(err));
	}
});

server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`Port ${port} is busy. Pass --port <n> to choose another.`);
	} else {
		console.error(err);
	}
	process.exit(1);
});

server.listen(port, host, () => {
	const url = `http://${host}:${port}/`;
	console.log(`admin-ui-starter-kit showcase → ${url}`);
	console.log('Press Ctrl+C to stop.');
	if (!noOpen) {
		const opener = process.platform === 'darwin' ? 'open'
			: process.platform === 'win32' ? 'start ""'
			: 'xdg-open';
		import('node:child_process').then(({ exec }) => exec(`${opener} ${url}`));
	}
});
