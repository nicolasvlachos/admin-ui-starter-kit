import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: [
            { find: /^@\/components\/ui\/primitives\/shadcn$/, replacement: path.resolve(__dirname, './src/components/ui') },
            { find: /^@\/components\/ui\/primitives\/shadcn\/(.*)$/, replacement: path.resolve(__dirname, './src/components/ui') + '/$1' },
            { find: /^@\/components\/ui\/base$/, replacement: path.resolve(__dirname, './src/components/base') },
            { find: /^@\/components\/ui\/base\/(.*)$/, replacement: path.resolve(__dirname, './src/components/base') + '/$1' },
            { find: /^@\/components\/ui\/typography$/, replacement: path.resolve(__dirname, './src/components/base/typography') },
            { find: /^@\/components\/ui\/typography\/(.*)$/, replacement: path.resolve(__dirname, './src/components/base/typography') + '/$1' },
            { find: '@', replacement: path.resolve(__dirname, './src') },
        ],
    },
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        exclude: [
            'node_modules/**',
            'dist/**',
            'dist-ssr/**',
            '.claude/**',
            'references/**',
        ],
    },
});
