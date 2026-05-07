/**
 * Vite library-mode config — produces the publish artifact in `dist/`.
 *
 * Build: `npm run build:lib` runs this config. `vite-plugin-dts` emits
 * matching `.d.ts` for each `.js` entry. The output is what gets shipped
 * to npm — `dist/` mirrors the `src/` tree so each `.js` sits next to its
 * `.d.ts`.
 *
 * Externals: every `dependencies` and `peerDependencies` from package.json
 * is treated as external — we don't bundle React, recharts, lucide, etc.
 * The consumer resolves them at install time.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const externalDeps = new Set<string>([
	...Object.keys(pkg.dependencies ?? {}),
	...Object.keys(pkg.peerDependencies ?? {}),
]);

const externalPrefixes = [
	'react',
	'react-dom',
	'@base-ui/react',
	'@dnd-kit',
	'@tanstack',
	'@tiptap',
	'lucide-react',
	'recharts',
	'leaflet',
	'react-leaflet',
	'date-fns',
	'culori',
	'sonner',
	'qrcode',
	'cmdk',
	'tailwind-merge',
	'class-variance-authority',
	'clsx',
	'react-hook-form',
	'zustand',
];

const isExternal = (id: string): boolean => {
	if (externalDeps.has(id)) return true;
	for (const prefix of externalPrefixes) {
		if (id === prefix || id.startsWith(`${prefix}/`)) return true;
	}
	if (id.startsWith('@/') || id.startsWith('.') || id.startsWith('/')) return false;
	return /^[a-z@]/.test(id);
};

const assetFileNames = (asset: { name?: string }): string => {
	if (asset.name === 'style.css') return 'style.css';
	return 'assets/[name]-[hash][extname]';
};

/**
 * Entries mirror the src/ tree so the emitted `.js` and `.d.ts` files end
 * up at matching paths. This keeps the `exports` map clean: a single
 * `./base/*` mapping resolves both runtime and types.
 */
const entry: Record<string, string> = {
	'index': 'src/index.ts',
	'lib/ui-provider/index': 'src/lib/ui-provider/index.ts',
	'lib/strings': 'src/lib/strings.ts',
	'lib/utils': 'src/lib/utils.ts',

	// base
	'components/base/index': 'src/components/base/index.tsx',
	'components/base/accordion/index': 'src/components/base/accordion/index.ts',
	'components/base/badge/index': 'src/components/base/badge/index.ts',
	'components/base/buttons/index': 'src/components/base/buttons/index.tsx',
	'components/base/cards/index': 'src/components/base/cards/index.ts',
	'components/base/combobox/index': 'src/components/base/combobox/index.ts',
	'components/base/command/index': 'src/components/base/command/index.ts',
	'components/base/copyable/index': 'src/components/base/copyable/index.ts',
	'components/base/currency/index': 'src/components/base/currency/index.ts',
	'components/base/date-pickers/index': 'src/components/base/date-pickers/index.ts',
	'components/base/display/index': 'src/components/base/display/index.ts',
	'components/base/event-calendar/index': 'src/components/base/event-calendar/index.ts',
	'components/base/forms/index': 'src/components/base/forms/index.ts',
	'components/base/item/index': 'src/components/base/item/index.ts',
	'components/base/map/index': 'src/components/base/map/index.tsx',
	'components/base/navigation/index': 'src/components/base/navigation/index.ts',
	'components/base/popover/index': 'src/components/base/popover/index.ts',
	'components/base/popover-menu/index': 'src/components/base/popover-menu/index.ts',
	'components/base/sheet/index': 'src/components/base/sheet/index.ts',
	'components/base/sidebar/index': 'src/components/base/sidebar/index.ts',
	'components/base/spinner/index': 'src/components/base/spinner/index.ts',
	'components/base/table/index': 'src/components/base/table/index.tsx',
	'components/base/toaster/index': 'src/components/base/toaster/index.ts',

	// composed
	'components/composed/index': 'src/components/composed/index.ts',
	'components/composed/admin/index': 'src/components/composed/admin/index.ts',
	'components/composed/ai/index': 'src/components/composed/ai/index.ts',
	'components/composed/analytics/index': 'src/components/composed/analytics/index.ts',
	'components/composed/cards/index': 'src/components/composed/cards/index.ts',
	'components/composed/commerce/index': 'src/components/composed/commerce/index.ts',
	'components/composed/dark-surfaces/index': 'src/components/composed/dark-surfaces/index.ts',
	'components/composed/data-display/index': 'src/components/composed/data-display/index.ts',
	'components/composed/navigation/index': 'src/components/composed/navigation/index.ts',
	'components/composed/onboarding/index': 'src/components/composed/onboarding/index.ts',
	'components/composed/timelines/index': 'src/components/composed/timelines/index.ts',

	// features
	'components/features/index': 'src/components/features/index.ts',
	'components/features/activities/index': 'src/components/features/activities/index.ts',
	'components/features/ai-chat/index': 'src/components/features/ai-chat/index.ts',
	'components/features/card/index': 'src/components/features/card/index.ts',
	'components/features/comments/index': 'src/components/features/comments/index.ts',
	'components/features/event-log/index': 'src/components/features/event-log/index.ts',
	'components/features/filters/index': 'src/components/features/filters/index.ts',
	'components/features/global-search/index': 'src/components/features/global-search/index.ts',
	'components/features/kanban/index': 'src/components/features/kanban/index.ts',
	'components/features/mentions/index': 'src/components/features/mentions/index.ts',
	'components/features/overlays/index': 'src/components/features/overlays/index.ts',
	'components/features/rich-text-editor/index': 'src/components/features/rich-text-editor/index.ts',
	'components/features/suggestions/index': 'src/components/features/suggestions/index.ts',
	'components/features/sync/index': 'src/components/features/sync/index.ts',

	// layout
	'components/layout/index': 'src/components/layout/index.ts',
	'components/layout/containers/index': 'src/components/layout/containers/index.ts',
	'components/layout/page/index': 'src/components/layout/page/index.ts',
	'components/layout/header/index': 'src/components/layout/header/index.ts',
	'components/layout/sidebar/index': 'src/components/layout/sidebar/index.tsx',
	'components/layout/hooks/index': 'src/components/layout/hooks/index.ts',
};

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		dts({
			tsconfigPath: './tsconfig.lib.json',
			entryRoot: 'src',
			outDir: 'dist',
			rollupTypes: false,
			insertTypesEntry: false,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: true,
		minify: true,
		cssCodeSplit: true,
		lib: {
			entry,
		},
		rollupOptions: {
			external: isExternal,
			output: [
				{
					format: 'es',
					preserveModules: false,
					entryFileNames: '[name].js',
					chunkFileNames: '_shared/[name]-[hash].js',
					assetFileNames,
				},
				{
					format: 'cjs',
					preserveModules: false,
					entryFileNames: '[name].cjs',
					chunkFileNames: '_shared/[name]-[hash].cjs',
					assetFileNames,
					exports: 'named',
				},
			],
		},
	},
});
