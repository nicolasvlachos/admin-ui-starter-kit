/**
 * Vite config — DEV / preview app only.
 *
 * `npm run dev` and `npm run build` both use this config to run/build the
 * in-repo showcase at `src/preview/`. It is NOT the publishable-library
 * config — for that, see `vite.lib.config.ts`.
 *
 * Plugins:
 *   - `@mdx-js/rollup`        — MDX support (must run BEFORE React plugin).
 *   - `@vitejs/plugin-react`  — Fast Refresh + JSX transform.
 *   - `@tailwindcss/vite`     — Tailwind v4 (compiles `src/App.css`).
 *
 * The `@/...` alias resolves to `src/...` so internal imports stay short.
 */
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		// MDX must run BEFORE the React plugin so JSX-from-MDX is transformed correctly.
		{ enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: [
			{ find: '@', replacement: path.resolve(__dirname, './src') },
		],
	},
});
