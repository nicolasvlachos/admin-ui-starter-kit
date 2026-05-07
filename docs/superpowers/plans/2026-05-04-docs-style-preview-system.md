# Docs-style preview system Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the in-repo showcase under `src/preview/` into a docs-grade reference site (MDX pages with live + Code tabs, props tables, realistic mock data, refreshed navigation) and expose every component as a markdown reference inside the `component-library-rules` skill.

**Architecture:** New `src/preview/_docs/` primitives (`<DocsPage>`, `<Section>`, `<Example>`, `<PropsTable>`, `<CodeBlock>`) drive every page. Pages are `.mdx` with co-located `<name>.examples.tsx` files; the Code tab pulls source via Vite `?raw` so render and source can never drift. Props tables come from a JSON sidecar generated once by `react-docgen-typescript`. A small mock-API layer in `src/preview/_mocks/` powers realistic async examples. Five reference pages get hand-written prose; the other 87 are converted by a one-shot script. A separate sync script emits per-component markdown into the rules skill so AI agents can look up canonical usage.

**Tech Stack:** Vite 8, React 19, TypeScript 6, MDX (`@mdx-js/rollup`), `react-docgen-typescript`, Tailwind v4, existing shadcn primitives. No new runtime dependencies in the published library.

**Spec:** [docs/superpowers/specs/2026-05-04-docs-style-preview-system-design.md](../specs/2026-05-04-docs-style-preview-system-design.md)

---

## Phase 0 — Worktree & branch setup

### Task 0.1: Confirm clean working tree and create branch

**Files:** none (git only)

- [ ] **Step 1: Verify clean working tree**

Run: `git status`
Expected: `nothing to commit, working tree clean`

- [ ] **Step 2: Create the feature branch**

Run: `git checkout -b feat/docs-style-preview`
Expected: `Switched to a new branch 'feat/docs-style-preview'`

- [ ] **Step 3: Confirm baseline build is green**

Run: `npm run typecheck`
Expected: exits 0 (existing pre-existing errors are tolerated; the `verify` script is the bar)

Run: `npm run lint:architecture`
Expected: exits 0

---

## Phase 1 — MDX wiring + minimal `<DocsPage>` shell, proven on one page

Goal at end of phase: `base/badge` is rendered through an `.mdx` page using a tiny `<DocsPage>` shell. No code tab yet, no props table — just MDX-rendering working end to end.

### Task 1.1: Add MDX support to Vite

**Files:**
- Modify: `package.json` (add devDependency)
- Modify: `vite.config.ts`

- [ ] **Step 1: Install MDX**

Run: `npm install --save-dev @mdx-js/rollup @types/mdx`
Expected: `added N packages` with no errors

- [ ] **Step 2: Wire the plugin into Vite**

Edit `vite.config.ts`:

```ts
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
```

- [ ] **Step 3: Install `@mdx-js/react`**

Run: `npm install --save-dev @mdx-js/react`
Expected: `added 1 package`

- [ ] **Step 4: Add MDX module typing**

Create `src/mdx.d.ts`:

```ts
declare module '*.mdx' {
	import type { ComponentType } from 'react';
	const Component: ComponentType;
	export default Component;
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/mdx.d.ts
git commit -m "preview: add MDX support to Vite dev/build"
```

### Task 1.2: Scaffold `_docs/` folder with minimal `<DocsPage>` and `<Section>`

**Files:**
- Create: `src/preview/_docs/docs-page.tsx`
- Create: `src/preview/_docs/section.tsx`
- Create: `src/preview/_docs/index.ts`
- Create: `src/preview/_docs/types.ts`

- [ ] **Step 1: Define the docs-page types**

Create `src/preview/_docs/types.ts`:

```ts
import type { ReactNode } from 'react';

export type DocsLayer = 'ui' | 'base' | 'composed' | 'features' | 'layout' | 'common';

export interface DocsPageProps {
	title: string;
	description?: string;
	layer?: DocsLayer;
	status?: 'ready' | 'wip' | 'broken';
	sourcePath?: string;
	children: ReactNode;
}

export interface SectionProps {
	title: string;
	id: string;
	description?: string;
	children: ReactNode;
}
```

- [ ] **Step 2: Implement `<DocsPage>`**

Create `src/preview/_docs/docs-page.tsx`:

```tsx
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/base/badge';
import { cn } from '@/lib/utils';
import type { DocsPageProps } from './types';

export function DocsPage({
	title,
	description,
	layer,
	status,
	sourcePath,
	children,
}: DocsPageProps) {
	return (
		<article className={cn('docs-page--component mx-auto w-full max-w-4xl pb-24')}>
			<header className="docs-page--header border-b border-border pb-6">
				<div className="flex flex-wrap items-center gap-2">
					{!!layer && (
						<Badge variant="muted" size="xs">{layer}</Badge>
					)}
					{status === 'wip' && <Badge variant="warning" size="xs">WIP</Badge>}
					{status === 'broken' && <Badge variant="destructive" size="xs">Broken</Badge>}
				</div>
				<Heading tag="h1" className="mt-2">{title}</Heading>
				{!!description && (
					<Text type="secondary" className="mt-1">{description}</Text>
				)}
				{!!sourcePath && (
					<Text size="xs" type="discrete" className="mt-3 font-mono">{sourcePath}</Text>
				)}
			</header>
			<div className="docs-page--body mt-8 space-y-12">{children}</div>
		</article>
	);
}
```

- [ ] **Step 3: Implement `<Section>`**

Create `src/preview/_docs/section.tsx`:

```tsx
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import type { SectionProps } from './types';

export function Section({ title, id, description, children }: SectionProps) {
	return (
		<section id={id} className={cn('section--component scroll-mt-24 space-y-4')}>
			<div className="section--header">
				<Heading tag="h2">{title}</Heading>
				{!!description && (
					<Text size="xs" type="secondary" className="mt-1">{description}</Text>
				)}
			</div>
			<div className="section--body space-y-4">{children}</div>
		</section>
	);
}
```

- [ ] **Step 4: Add the barrel export**

Create `src/preview/_docs/index.ts`:

```ts
export { DocsPage } from './docs-page';
export { Section } from './section';
export type { DocsPageProps, SectionProps, DocsLayer } from './types';
```

- [ ] **Step 5: Verify the project still type-checks**

Run: `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0`
Expected: no new errors in files we just created (pre-existing errors elsewhere are tolerated)

- [ ] **Step 6: Commit**

```bash
git add src/preview/_docs
git commit -m "preview: scaffold _docs primitives (DocsPage, Section)"
```

### Task 1.3: Author the first MDX page (`base/badge.mdx`) — render-only, no Code tab yet

**Files:**
- Create: `src/preview/pages/base/badge.examples.tsx`
- Create: `src/preview/pages/base/badge.mdx`
- Modify: `src/preview/registry.tsx`

- [ ] **Step 1: Create the examples module**

Create `src/preview/pages/base/badge.examples.tsx`:

```tsx
import { Badge } from '@/components/base/badge';

export function Default() {
	return <Badge>New</Badge>;
}

export function Variants() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="primary">Primary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="muted">Muted</Badge>
		</div>
	);
}

export function WithDot() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="success" dot>Live</Badge>
			<Badge variant="warning" dot pending>Pending</Badge>
		</div>
	);
}
```

- [ ] **Step 2: Author the MDX page**

Create `src/preview/pages/base/badge.mdx`:

```mdx
import { DocsPage, Section } from '@/preview/_docs';
import * as Examples from './badge.examples';

<DocsPage
	title="Badge"
	description="Status pills and chips for tags, counts, and inline state."
	layer="base"
	status="ready"
	sourcePath="src/components/base/badge"
>

<Section title="Default" id="default">
	<Examples.Default />
</Section>

<Section title="Variants" id="variants">
	<Examples.Variants />
</Section>

<Section title="With dot" id="with-dot">
	<Examples.WithDot />
</Section>

</DocsPage>
```

- [ ] **Step 3: Point the registry at the new MDX page**

In `src/preview/registry.tsx`, replace the `base/badge` entry's `component` import with the MDX file. Find:

```ts
{ id: 'base/badge', label: 'Badge', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/BadgePage')), status: 'ready' },
```

Replace with:

```ts
{ id: 'base/badge', label: 'Badge', section: 'Base', family: 'Foundations', component: lazy(() => import('./pages/base/badge.mdx')), status: 'ready' },
```

- [ ] **Step 4: Run the dev server and verify the page renders**

Run: `npm run dev` (in background)
Open: `http://localhost:5173/#/base/badge`
Expected: the new MDX page renders with title, description, and three sections of badges. Old `BadgePage.tsx` is no longer used by the registry but remains on disk.

- [ ] **Step 5: Commit**

```bash
git add src/preview/pages/base/badge.mdx src/preview/pages/base/badge.examples.tsx src/preview/registry.tsx
git commit -m "preview: author base/badge MDX page (no Code tab yet)"
```

---

## Phase 2 — `<Example>` block with Preview/Code tabs (source via `?raw`)

Goal at end of phase: every `<Example>` block in `badge.mdx` shows a working Preview/Code tab pair where the Code tab pulls the relevant function out of `badge.examples.tsx?raw`.

### Task 2.1: Build the example-source slicer

**Files:**
- Create: `src/preview/_docs/extract-example.ts`
- Create: `src/preview/_docs/extract-example.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/preview/_docs/extract-example.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { extractExample } from './extract-example';

const SOURCE = `import { Badge } from '@/components/base/badge';

export function Default() {
	return <Badge>New</Badge>;
}

export function Variants() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="primary">Primary</Badge>
		</div>
	);
}
`;

describe('extractExample', () => {
	it('returns just the named function body', () => {
		expect(extractExample(SOURCE, 'Default')).toBe(
			`export function Default() {\n\treturn <Badge>New</Badge>;\n}`,
		);
	});

	it('returns multi-line bodies including their closing brace', () => {
		const result = extractExample(SOURCE, 'Variants');
		expect(result.startsWith('export function Variants()')).toBe(true);
		expect(result.endsWith('}')).toBe(true);
		expect(result).toContain('<Badge variant="primary">Primary</Badge>');
	});

	it('returns the full source when name is not found', () => {
		expect(extractExample(SOURCE, 'Missing')).toBe(SOURCE);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/preview/_docs/extract-example.test.ts`
Expected: FAIL — `extractExample` does not exist yet

- [ ] **Step 3: Implement the slicer**

Create `src/preview/_docs/extract-example.ts`:

```ts
/**
 * Slice a single named export (`export function <name>() { … }`) out of a
 * raw source file. Brace-balanced — handles multi-line bodies. Falls back
 * to the full source when the name is not found.
 */
export function extractExample(source: string, name: string): string {
	const headerPattern = new RegExp(`export\\s+function\\s+${name}\\s*\\(`);
	const headerMatch = source.match(headerPattern);
	if (!headerMatch) return source;

	const start = headerMatch.index ?? 0;
	const openBraceIdx = source.indexOf('{', start);
	if (openBraceIdx === -1) return source;

	let depth = 1;
	let i = openBraceIdx + 1;
	while (i < source.length && depth > 0) {
		const ch = source[i];
		if (ch === '{') depth++;
		else if (ch === '}') depth--;
		i++;
	}

	if (depth !== 0) return source;
	return source.slice(start, i);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/preview/_docs/extract-example.test.ts`
Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add src/preview/_docs/extract-example.ts src/preview/_docs/extract-example.test.ts
git commit -m "preview: add extractExample slicer for Code-tab source"
```

### Task 2.2: Build `<CodeBlock>` (syntax-tinted, copy button)

**Files:**
- Create: `src/preview/_docs/code-block.tsx`

- [ ] **Step 1: Implement the code block**

Create `src/preview/_docs/code-block.tsx`:

```tsx
import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
	code: string;
	language?: 'tsx' | 'ts' | 'mdx' | 'bash' | 'json';
	className?: string;
}

export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const onCopy = useCallback(() => {
		void navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		});
	}, [code]);

	return (
		<div className={cn('code-block--component group relative overflow-hidden rounded-md border border-border bg-muted/40', className)}>
			<div className="code-block--toolbar flex items-center justify-between border-b border-border bg-card/40 px-3 py-1.5">
				<span className="text-xxs font-medium uppercase tracking-wider text-muted-foreground">{language}</span>
				<Button
					buttonStyle="ghost"
					size="xs"
					onClick={onCopy}
					aria-label={copied ? 'Copied' : 'Copy code'}
				>
					{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
				</Button>
			</div>
			<pre className="code-block--pre overflow-x-auto px-4 py-3 text-xs leading-5">
				<code>{code}</code>
			</pre>
		</div>
	);
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0 2>&1 | grep code-block`
Expected: no output (no errors in this file)

- [ ] **Step 3: Commit**

```bash
git add src/preview/_docs/code-block.tsx
git commit -m "preview: add CodeBlock with copy button"
```

### Task 2.3: Build `<Example>` with Preview/Code tabs

**Files:**
- Create: `src/preview/_docs/example.tsx`
- Modify: `src/preview/_docs/index.ts`

- [ ] **Step 1: Implement `<Example>`**

Create `src/preview/_docs/example.tsx`:

```tsx
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/typography/text';
import { CodeBlock } from './code-block';
import { extractExample } from './extract-example';

type Tab = 'preview' | 'code';

export interface ExampleProps {
	name: string;
	source: string;
	description?: string;
	defaultTab?: Tab;
	children: ReactNode;
}

export function Example({ name, source, description, defaultTab = 'preview', children }: ExampleProps) {
	const [tab, setTab] = useState<Tab>(defaultTab);
	const code = extractExample(source, name);

	return (
		<div className={cn('example--component overflow-hidden rounded-lg border border-border bg-card')}>
			<div className="example--header flex items-center justify-between border-b border-border px-4 py-2.5">
				<div className="min-w-0">
					<Text weight="semibold">{name}</Text>
					{!!description && (
						<Text size="xs" type="secondary" className="mt-0.5 truncate">{description}</Text>
					)}
				</div>
				<div className="example--tabs flex items-center gap-1 rounded-md bg-muted/60 p-0.5 text-xs">
					<TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>Preview</TabButton>
					<TabButton active={tab === 'code'} onClick={() => setTab('code')}>Code</TabButton>
				</div>
			</div>
			{tab === 'preview' ? (
				<div className="example--preview flex min-h-[120px] items-center justify-center px-6 py-8">
					{children}
				</div>
			) : (
				<div className="example--code">
					<CodeBlock code={code} language="tsx" className="rounded-none border-0" />
				</div>
			)}
		</div>
	);
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'rounded-sm px-2.5 py-1 transition-colors',
				active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
			)}
		>
			{children}
		</button>
	);
}
```

- [ ] **Step 2: Re-export from the barrel**

Edit `src/preview/_docs/index.ts`:

```ts
export { DocsPage } from './docs-page';
export { Section } from './section';
export { Example } from './example';
export { CodeBlock } from './code-block';
export { extractExample } from './extract-example';
export type { DocsPageProps, SectionProps, DocsLayer } from './types';
export type { ExampleProps } from './example';
export type { CodeBlockProps } from './code-block';
```

- [ ] **Step 3: Commit**

```bash
git add src/preview/_docs
git commit -m "preview: add Example block with Preview/Code tabs"
```

### Task 2.4: Wire `<Example>` into `badge.mdx`

**Files:**
- Modify: `src/preview/pages/base/badge.mdx`

- [ ] **Step 1: Rewrite the MDX page to use `<Example>`**

Replace the contents of `src/preview/pages/base/badge.mdx` with:

```mdx
import { DocsPage, Section, Example } from '@/preview/_docs';
import * as Examples from './badge.examples';
import examplesSource from './badge.examples?raw';

<DocsPage
	title="Badge"
	description="Status pills and chips for tags, counts, and inline state."
	layer="base"
	status="ready"
	sourcePath="src/components/base/badge"
>

<Section title="Examples" id="examples">

<Example name="Default" source={examplesSource}>
	<Examples.Default />
</Example>

<Example name="Variants" source={examplesSource}>
	<Examples.Variants />
</Example>

<Example name="WithDot" source={examplesSource}>
	<Examples.WithDot />
</Example>

</Section>

</DocsPage>
```

- [ ] **Step 2: Verify in the browser**

If the dev server isn't already running, run: `npm run dev` (in background)
Open: `http://localhost:5173/#/base/badge`
Expected: three Example cards with Preview/Code tabs. Switching to Code shows the matching `export function …` body verbatim.

- [ ] **Step 3: Commit**

```bash
git add src/preview/pages/base/badge.mdx
git commit -m "preview: wire badge MDX page through Example tabs"
```

---

## Phase 3 — Right-rail TOC + per-page `<DocsPage>` polish

Goal at end of phase: every page has an auto-generated table of contents in a right rail (sticky on `lg+`), and the page header renders a layer/status row matching docs-site conventions.

### Task 3.1: TOC context + collector

**Files:**
- Create: `src/preview/_docs/toc-context.tsx`
- Modify: `src/preview/_docs/section.tsx`
- Modify: `src/preview/_docs/index.ts`

- [ ] **Step 1: Create the TOC context**

Create `src/preview/_docs/toc-context.tsx`:

```tsx
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface TocEntry {
	id: string;
	title: string;
}

interface TocContextValue {
	entries: TocEntry[];
	register: (entry: TocEntry) => void;
}

const TocContext = createContext<TocContextValue | null>(null);

export function TocProvider({ children }: { children: ReactNode }) {
	const [entries, setEntries] = useState<TocEntry[]>([]);

	const register = useCallback((entry: TocEntry) => {
		setEntries((prev) => {
			if (prev.some((e) => e.id === entry.id)) return prev;
			return [...prev, entry];
		});
	}, []);

	const value = useMemo(() => ({ entries, register }), [entries, register]);
	return <TocContext.Provider value={value}>{children}</TocContext.Provider>;
}

export function useToc(): TocContextValue {
	const ctx = useContext(TocContext);
	if (!ctx) {
		// Outside a DocsPage — return a no-op so Section is safe to render anywhere.
		return { entries: [], register: () => {} };
	}
	return ctx;
}
```

- [ ] **Step 2: Update `<Section>` to register itself**

Replace `src/preview/_docs/section.tsx`:

```tsx
import { useEffect } from 'react';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import type { SectionProps } from './types';
import { useToc } from './toc-context';

export function Section({ title, id, description, children }: SectionProps) {
	const { register } = useToc();

	useEffect(() => {
		register({ id, title });
	}, [id, title, register]);

	return (
		<section id={id} className={cn('section--component scroll-mt-24 space-y-4')}>
			<div className="section--header">
				<Heading tag="h2">{title}</Heading>
				{!!description && (
					<Text size="xs" type="secondary" className="mt-1">{description}</Text>
				)}
			</div>
			<div className="section--body space-y-4">{children}</div>
		</section>
	);
}
```

- [ ] **Step 3: Re-export from barrel**

Edit `src/preview/_docs/index.ts` — add:

```ts
export { TocProvider, useToc } from './toc-context';
export type { TocEntry } from './toc-context';
```

- [ ] **Step 4: Commit**

```bash
git add src/preview/_docs
git commit -m "preview: add TocProvider/useToc and self-registering Section"
```

### Task 3.2: Build `<TocRail>` and embed in `<DocsPage>`

**Files:**
- Create: `src/preview/_docs/toc-rail.tsx`
- Modify: `src/preview/_docs/docs-page.tsx`
- Modify: `src/preview/_docs/index.ts`

- [ ] **Step 1: Implement the rail**

Create `src/preview/_docs/toc-rail.tsx`:

```tsx
import { Text } from '@/components/typography/text';
import { useToc } from './toc-context';

export function TocRail() {
	const { entries } = useToc();
	if (entries.length === 0) return null;

	return (
		<aside className="toc-rail--component sticky top-[88px] hidden h-[calc(100vh-88px-2rem)] w-56 shrink-0 overflow-y-auto pl-6 lg:block">
			<Text size="xxs" type="secondary" className="font-semibold uppercase tracking-wider">
				On this page
			</Text>
			<ul className="toc-rail--list mt-3 space-y-1.5 border-l border-border">
				{entries.map((entry) => (
					<li key={entry.id} className="toc-rail--item">
						<a
							href={`#${entry.id}`}
							className="block -ml-px border-l border-transparent pl-3 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
						>
							{entry.title}
						</a>
					</li>
				))}
			</ul>
		</aside>
	);
}
```

- [ ] **Step 2: Wrap `<DocsPage>` with provider + rail layout**

Replace `src/preview/_docs/docs-page.tsx`:

```tsx
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/base/badge';
import { cn } from '@/lib/utils';
import type { DocsPageProps } from './types';
import { TocProvider } from './toc-context';
import { TocRail } from './toc-rail';

export function DocsPage({
	title,
	description,
	layer,
	status,
	sourcePath,
	children,
}: DocsPageProps) {
	return (
		<TocProvider>
			<div className="docs-page--component flex w-full gap-8">
				<article className="docs-page--main mx-auto w-full min-w-0 max-w-3xl pb-24">
					<header className={cn('docs-page--header border-b border-border pb-6')}>
						<div className="flex flex-wrap items-center gap-2">
							{!!layer && (
								<Badge variant="muted" size="xs">{layer}</Badge>
							)}
							{status === 'wip' && <Badge variant="warning" size="xs">WIP</Badge>}
							{status === 'broken' && <Badge variant="destructive" size="xs">Broken</Badge>}
						</div>
						<Heading tag="h1" className="mt-2">{title}</Heading>
						{!!description && (
							<Text type="secondary" className="mt-1">{description}</Text>
						)}
						{!!sourcePath && (
							<Text size="xs" type="discrete" className="mt-3 font-mono">{sourcePath}</Text>
						)}
					</header>
					<div className="docs-page--body mt-8 space-y-12">{children}</div>
				</article>
				<TocRail />
			</div>
		</TocProvider>
	);
}
```

- [ ] **Step 3: Re-export from barrel**

Edit `src/preview/_docs/index.ts` — add:

```ts
export { TocRail } from './toc-rail';
```

- [ ] **Step 4: Verify in the browser**

Reload `http://localhost:5173/#/base/badge`
Expected: right-rail TOC with three entries (`Examples` … wait — we only have one Section, "Examples"). To verify TOC works with multiple sections, manually expand `badge.mdx` to two sections temporarily, confirm both appear, then revert. Skip this verification step if confident.

- [ ] **Step 5: Commit**

```bash
git add src/preview/_docs
git commit -m "preview: add TOC right rail to DocsPage"
```

---

## Phase 4 — `<PropsTable>` from generated JSON sidecar

Goal at end of phase: `badge.mdx` has a working `<PropsTable component="Badge" />` block populated from a JSON file generated by `react-docgen-typescript`.

### Task 4.1: Install `react-docgen-typescript` and write generator script

**Files:**
- Modify: `package.json`
- Create: `scripts/generate-props-tables.mjs`

- [ ] **Step 1: Install dependency**

Run: `npm install --save-dev react-docgen-typescript`
Expected: `added N packages`

- [ ] **Step 2: Write the generator**

Create `scripts/generate-props-tables.mjs`:

```js
#!/usr/bin/env node
/**
 * Walks src/components/{base,composed,features,layout,typography}/**\/*.tsx,
 * extracts component prop docs via react-docgen-typescript, and writes a
 * single JSON file consumed by <PropsTable> at runtime.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';
import docgen from 'react-docgen-typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const tsconfigPath = resolve(ROOT, 'tsconfig.app.json');
const parser = docgen.withCustomConfig(tsconfigPath, {
	savePropValueAsString: true,
	shouldExtractLiteralValuesFromEnum: true,
	propFilter: (prop) => {
		if (prop.parent && /node_modules/.test(prop.parent.fileName)) return false;
		return true;
	},
});

const PATTERNS = [
	'src/components/base/**/*.tsx',
	'src/components/composed/**/*.tsx',
	'src/components/features/**/*.tsx',
	'src/components/layout/**/*.tsx',
	'src/components/typography/**/*.tsx',
];

const files = PATTERNS.flatMap((p) => globSync(p, { cwd: ROOT, absolute: true }))
	.filter((f) => !f.endsWith('.test.tsx') && !f.endsWith('.examples.tsx'));

console.log(`Parsing ${files.length} files…`);
const allComponents = parser.parse(files);

const byName = {};
for (const c of allComponents) {
	if (!c.displayName) continue;
	byName[c.displayName] = {
		displayName: c.displayName,
		description: c.description ?? '',
		filePath: c.filePath?.replace(ROOT + '/', '') ?? '',
		props: Object.fromEntries(
			Object.entries(c.props ?? {}).map(([name, prop]) => [
				name,
				{
					name,
					required: prop.required,
					description: prop.description ?? '',
					defaultValue: prop.defaultValue?.value ?? null,
					type: prop.type?.name ?? 'unknown',
				},
			]),
		),
	};
}

const outDir = resolve(ROOT, 'src/preview/_docs');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'props.generated.json');
writeFileSync(outFile, JSON.stringify(byName, null, 2) + '\n');
console.log(`Wrote ${Object.keys(byName).length} components → ${outFile}`);
```

- [ ] **Step 3: Add npm script**

Edit `package.json` `"scripts"` — add:

```json
"docs:generate-props": "node scripts/generate-props-tables.mjs",
```

- [ ] **Step 4: Run the generator**

Run: `npm run docs:generate-props`
Expected: console output `Parsing N files…` then `Wrote M components → …/props.generated.json`. The file `src/preview/_docs/props.generated.json` exists and contains `Badge` (verify with `grep -c '"Badge"' src/preview/_docs/props.generated.json` — expect ≥ 1).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json scripts/generate-props-tables.mjs src/preview/_docs/props.generated.json
git commit -m "preview: generate component props JSON via react-docgen-typescript"
```

### Task 4.2: Build `<PropsTable>` reading the generated JSON

**Files:**
- Create: `src/preview/_docs/props-table.tsx`
- Modify: `src/preview/_docs/index.ts`

- [ ] **Step 1: Implement the table**

Create `src/preview/_docs/props-table.tsx`:

```tsx
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import propsData from './props.generated.json';

interface PropDoc {
	name: string;
	required: boolean;
	description: string;
	defaultValue: string | null;
	type: string;
}

interface ComponentDoc {
	displayName: string;
	description: string;
	filePath: string;
	props: Record<string, PropDoc>;
}

const PROPS_BY_NAME = propsData as Record<string, ComponentDoc>;

export interface PropsTableProps {
	component: string;
	className?: string;
}

export function PropsTable({ component, className }: PropsTableProps) {
	const doc = PROPS_BY_NAME[component];

	if (!doc) {
		return (
			<div className={cn('props-table--component rounded-md border border-warning/30 bg-warning/5 p-3', className)}>
				<Text size="xs" type="secondary">
					No props metadata for <code className="font-mono">{component}</code>. Run{' '}
					<code className="font-mono">npm run docs:generate-props</code>.
				</Text>
			</div>
		);
	}

	const propEntries = Object.values(doc.props).sort((a, b) => {
		if (a.required && !b.required) return -1;
		if (!a.required && b.required) return 1;
		return a.name.localeCompare(b.name);
	});

	if (propEntries.length === 0) {
		return (
			<Text size="xs" type="secondary" className={cn('props-table--component', className)}>
				This component has no documented props.
			</Text>
		);
	}

	return (
		<div className={cn('props-table--component overflow-x-auto rounded-md border border-border', className)}>
			<table className="w-full border-collapse text-xs">
				<thead className="props-table--head bg-muted/40 text-left">
					<tr>
						<th className="px-3 py-2 font-semibold">Prop</th>
						<th className="px-3 py-2 font-semibold">Type</th>
						<th className="px-3 py-2 font-semibold">Default</th>
						<th className="px-3 py-2 font-semibold">Description</th>
					</tr>
				</thead>
				<tbody className="props-table--body">
					{propEntries.map((p) => (
						<tr key={p.name} className="border-t border-border align-top">
							<td className="px-3 py-2 font-mono">
								{p.name}
								{p.required && <span className="ml-0.5 text-destructive">*</span>}
							</td>
							<td className="px-3 py-2 font-mono text-muted-foreground">{p.type}</td>
							<td className="px-3 py-2 font-mono text-muted-foreground">{p.defaultValue ?? '—'}</td>
							<td className="px-3 py-2 text-muted-foreground">{p.description || '—'}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
```

- [ ] **Step 2: Re-export from barrel**

Edit `src/preview/_docs/index.ts` — add:

```ts
export { PropsTable } from './props-table';
export type { PropsTableProps } from './props-table';
```

- [ ] **Step 3: Add JSON-import typing if needed**

If the build complains about importing `props.generated.json`, add to `tsconfig.app.json` (under `compilerOptions`): `"resolveJsonModule": true`. Verify the option already exists; if so, skip this step.

Run: `grep resolveJsonModule tsconfig.app.json`
Expected: present. If absent, add it.

- [ ] **Step 4: Add an API section to badge.mdx**

Edit `src/preview/pages/base/badge.mdx` — append before `</DocsPage>`:

```mdx
<Section title="API" id="api">

<PropsTable component="Badge" />

</Section>
```

And add `PropsTable` to the imports at the top:

```mdx
import { DocsPage, Section, Example, PropsTable } from '@/preview/_docs';
```

- [ ] **Step 5: Verify in the browser**

Reload `http://localhost:5173/#/base/badge`
Expected: a new "API" section with a props table for Badge. Table rows for `variant`, `size`, `dot`, `pulse`, etc. The right-rail TOC now has two entries (`Examples`, `API`).

- [ ] **Step 6: Commit**

```bash
git add src/preview/_docs/props-table.tsx src/preview/_docs/index.ts src/preview/pages/base/badge.mdx tsconfig.app.json
git commit -m "preview: add PropsTable backed by generated JSON sidecar"
```

### Task 4.3: Hide the props.generated.json file from accidental commits going stale

**Files:**
- Modify: `package.json`
- Create: `scripts/check-props-fresh.mjs`

- [ ] **Step 1: Write the freshness checker**

Create `scripts/check-props-fresh.mjs`:

```js
#!/usr/bin/env node
/**
 * CI guard: regenerates props.generated.json into a temp file and diffs it
 * against the committed copy. Exits non-zero if they differ.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const tmp = mkdtempSync(join(tmpdir(), 'props-check-'));
process.env.PROPS_OUT_DIR = tmp;

execSync('node scripts/generate-props-tables.mjs', { stdio: 'inherit' });

const fresh = readFileSync('src/preview/_docs/props.generated.json', 'utf8');
// The generator always overwrites the committed file; restore from git if changed.
const committed = execSync('git show HEAD:src/preview/_docs/props.generated.json').toString();

if (fresh.trim() !== committed.trim()) {
	console.error('\nprops.generated.json is OUT OF DATE.');
	console.error('Run `npm run docs:generate-props` and commit the result.\n');
	// Restore the committed copy so CI's working tree stays clean.
	writeFileSync('src/preview/_docs/props.generated.json', committed);
	process.exit(1);
}
console.log('props.generated.json is up to date.');
```

- [ ] **Step 2: Add npm script and wire into verify**

Edit `package.json` `"scripts"`:

```json
"docs:check-props": "node scripts/check-props-fresh.mjs",
"verify": "npm run lint:architecture && npm run test:exports && npm run docs:check-props && npm run typecheck && npm run lint && npm run test -- --pool=threads --maxWorkers=1",
```

- [ ] **Step 3: Verify locally**

Run: `npm run docs:check-props`
Expected: `props.generated.json is up to date.`

- [ ] **Step 4: Commit**

```bash
git add scripts/check-props-fresh.mjs package.json
git commit -m "preview: add CI guard for props.generated.json freshness"
```

---

## Phase 5 — Mock-API layer (`_mocks/`) + first async reference page

Goal at end of phase: a fictional admin app's seed data (orders, customers, vouchers, …) lives in `src/preview/_mocks/`, and `features/global-search.mdx` showcases it through the `GlobalSearch` feature with a working mock fetcher.

### Task 5.1: Seed data files

**Files:**
- Create: `src/preview/_mocks/types.ts`
- Create: `src/preview/_mocks/customers.ts`
- Create: `src/preview/_mocks/orders.ts`
- Create: `src/preview/_mocks/vouchers.ts`
- Create: `src/preview/_mocks/team.ts`
- Create: `src/preview/_mocks/index.ts`

- [ ] **Step 1: Define mock types**

Create `src/preview/_mocks/types.ts`:

```ts
export interface MockCustomer {
	id: string;
	name: string;
	email: string;
	avatarSeed: string;
	city: string;
	country: string;
	totalSpentUsd: number;
}

export interface MockOrder {
	id: string;
	number: string;
	customerId: string;
	status: 'pending' | 'paid' | 'shipped' | 'cancelled';
	totalUsd: number;
	itemCount: number;
	createdAt: string;
}

export interface MockVoucher {
	id: string;
	code: string;
	categoryId: 'wellness' | 'food' | 'adventure' | 'tech';
	valueUsd: number;
	expiresAt: string;
}

export interface MockTeamMember {
	id: string;
	name: string;
	email: string;
	role: 'owner' | 'admin' | 'manager' | 'support';
	avatarSeed: string;
}
```

- [ ] **Step 2: Author customers**

Create `src/preview/_mocks/customers.ts`:

```ts
import type { MockCustomer } from './types';

export const MOCK_CUSTOMERS: MockCustomer[] = [
	{ id: 'c-1', name: 'Sarah Smith', email: 'sarah@northwind.io', avatarSeed: 'sarah', city: 'Berlin', country: 'DE', totalSpentUsd: 12_450 },
	{ id: 'c-2', name: 'Marcus Lee', email: 'marcus@coldroast.com', avatarSeed: 'marcus', city: 'Brooklyn', country: 'US', totalSpentUsd: 8_120 },
	{ id: 'c-3', name: 'Aiko Tanaka', email: 'aiko@kyotostudio.jp', avatarSeed: 'aiko', city: 'Kyoto', country: 'JP', totalSpentUsd: 4_980 },
	{ id: 'c-4', name: 'Diego Ramos', email: 'diego@sierra.cl', avatarSeed: 'diego', city: 'Santiago', country: 'CL', totalSpentUsd: 21_300 },
	{ id: 'c-5', name: 'Priya Patel', email: 'priya@maitra.in', avatarSeed: 'priya', city: 'Mumbai', country: 'IN', totalSpentUsd: 1_640 },
	{ id: 'c-6', name: 'Elena Rossi', email: 'elena@vinoteca.it', avatarSeed: 'elena', city: 'Florence', country: 'IT', totalSpentUsd: 6_890 },
	{ id: 'c-7', name: 'Theo Carter', email: 'theo@bluffworks.us', avatarSeed: 'theo', city: 'Portland', country: 'US', totalSpentUsd: 3_220 },
	{ id: 'c-8', name: 'Nadia Haddad', email: 'nadia@oasisco.ae', avatarSeed: 'nadia', city: 'Dubai', country: 'AE', totalSpentUsd: 17_500 },
];
```

- [ ] **Step 3: Author orders**

Create `src/preview/_mocks/orders.ts`:

```ts
import type { MockOrder } from './types';

export const MOCK_ORDERS: MockOrder[] = [
	{ id: 'o-1', number: 'ORD-2026-0412', customerId: 'c-1', status: 'pending', totalUsd: 2_450, itemCount: 3, createdAt: '2026-04-12T09:14:00Z' },
	{ id: 'o-2', number: 'ORD-2026-0418', customerId: 'c-4', status: 'paid', totalUsd: 8_900, itemCount: 12, createdAt: '2026-04-18T14:02:00Z' },
	{ id: 'o-3', number: 'ORD-2026-0421', customerId: 'c-2', status: 'shipped', totalUsd: 320, itemCount: 1, createdAt: '2026-04-21T11:48:00Z' },
	{ id: 'o-4', number: 'ORD-2026-0425', customerId: 'c-8', status: 'paid', totalUsd: 5_640, itemCount: 7, createdAt: '2026-04-25T16:30:00Z' },
	{ id: 'o-5', number: 'ORD-2026-0429', customerId: 'c-3', status: 'cancelled', totalUsd: 980, itemCount: 2, createdAt: '2026-04-29T10:11:00Z' },
	{ id: 'o-6', number: 'ORD-2026-0501', customerId: 'c-6', status: 'pending', totalUsd: 1_280, itemCount: 4, createdAt: '2026-05-01T08:22:00Z' },
];
```

- [ ] **Step 4: Author vouchers**

Create `src/preview/_mocks/vouchers.ts`:

```ts
import type { MockVoucher } from './types';

export const MOCK_VOUCHERS: MockVoucher[] = [
	{ id: 'v-1', code: 'WELL-1240', categoryId: 'wellness', valueUsd: 100, expiresAt: '2026-12-31' },
	{ id: 'v-2', code: 'FOOD-8821', categoryId: 'food', valueUsd: 75, expiresAt: '2026-09-30' },
	{ id: 'v-3', code: 'ADVN-0099', categoryId: 'adventure', valueUsd: 250, expiresAt: '2027-03-15' },
	{ id: 'v-4', code: 'TECH-4410', categoryId: 'tech', valueUsd: 500, expiresAt: '2026-08-01' },
];
```

- [ ] **Step 5: Author team**

Create `src/preview/_mocks/team.ts`:

```ts
import type { MockTeamMember } from './types';

export const MOCK_TEAM: MockTeamMember[] = [
	{ id: 't-1', name: 'Nicolas V.', email: 'nicolas@northwind.io', role: 'owner', avatarSeed: 'nicolas' },
	{ id: 't-2', name: 'Hana K.', email: 'hana@northwind.io', role: 'admin', avatarSeed: 'hana' },
	{ id: 't-3', name: 'Omar R.', email: 'omar@northwind.io', role: 'manager', avatarSeed: 'omar' },
	{ id: 't-4', name: 'Ines M.', email: 'ines@northwind.io', role: 'support', avatarSeed: 'ines' },
];
```

- [ ] **Step 6: Barrel**

Create `src/preview/_mocks/index.ts`:

```ts
export type { MockCustomer, MockOrder, MockVoucher, MockTeamMember } from './types';
export { MOCK_CUSTOMERS } from './customers';
export { MOCK_ORDERS } from './orders';
export { MOCK_VOUCHERS } from './vouchers';
export { MOCK_TEAM } from './team';
```

- [ ] **Step 7: Commit**

```bash
git add src/preview/_mocks
git commit -m "preview: add mock seed data (customers, orders, vouchers, team)"
```

### Task 5.2: Mock fetchers

**Files:**
- Create: `src/preview/_mocks/fetchers.ts`
- Modify: `src/preview/_mocks/index.ts`

- [ ] **Step 1: Implement helpers**

Create `src/preview/_mocks/fetchers.ts`:

```ts
import { MOCK_CUSTOMERS } from './customers';
import { MOCK_ORDERS } from './orders';
import { MOCK_VOUCHERS } from './vouchers';
import { MOCK_TEAM } from './team';
import type { MockCustomer, MockOrder, MockTeamMember, MockVoucher } from './types';

export function mockDelay(ms = 280): Promise<void> {
	return new Promise((res) => window.setTimeout(res, ms));
}

export interface MockSearchResult {
	id: string;
	type: 'customer' | 'order' | 'voucher' | 'team';
	title: string;
	subtitle: string;
}

function matchesQuery(haystacks: string[], query: string): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return haystacks.some((h) => h.toLowerCase().includes(q));
}

export async function mockSearch(query: string): Promise<MockSearchResult[]> {
	await mockDelay();

	const customers = MOCK_CUSTOMERS
		.filter((c) => matchesQuery([c.name, c.email, c.city, c.country], query))
		.map<MockSearchResult>((c) => ({ id: c.id, type: 'customer', title: c.name, subtitle: `${c.email} — ${c.city}` }));

	const orders = MOCK_ORDERS
		.filter((o) => matchesQuery([o.number, o.status], query))
		.map<MockSearchResult>((o) => ({ id: o.id, type: 'order', title: o.number, subtitle: `${o.status} — $${o.totalUsd.toLocaleString()}` }));

	const vouchers = MOCK_VOUCHERS
		.filter((v) => matchesQuery([v.code, v.categoryId], query))
		.map<MockSearchResult>((v) => ({ id: v.id, type: 'voucher', title: v.code, subtitle: `${v.categoryId} — $${v.valueUsd}` }));

	const team = MOCK_TEAM
		.filter((t) => matchesQuery([t.name, t.email, t.role], query))
		.map<MockSearchResult>((t) => ({ id: t.id, type: 'team', title: t.name, subtitle: `${t.role} — ${t.email}` }));

	return [...customers, ...orders, ...vouchers, ...team];
}

export async function mockListCustomers(): Promise<MockCustomer[]> {
	await mockDelay();
	return MOCK_CUSTOMERS;
}

export async function mockListOrders(): Promise<MockOrder[]> {
	await mockDelay();
	return MOCK_ORDERS;
}

export async function mockListVouchers(): Promise<MockVoucher[]> {
	await mockDelay();
	return MOCK_VOUCHERS;
}

export async function mockListTeam(): Promise<MockTeamMember[]> {
	await mockDelay();
	return MOCK_TEAM;
}
```

- [ ] **Step 2: Update barrel**

Edit `src/preview/_mocks/index.ts` — append:

```ts
export {
	mockDelay,
	mockSearch,
	mockListCustomers,
	mockListOrders,
	mockListVouchers,
	mockListTeam,
} from './fetchers';
export type { MockSearchResult } from './fetchers';
```

- [ ] **Step 3: Commit**

```bash
git add src/preview/_mocks
git commit -m "preview: add mock fetchers (search + list helpers)"
```

### Task 5.3: First async reference page — `features/global-search.mdx`

**Files:**
- Create: `src/preview/pages/features/global-search.examples.tsx`
- Create: `src/preview/pages/features/global-search.mdx`
- Modify: `src/preview/registry.tsx`

- [ ] **Step 1: Inspect the GlobalSearch API**

Run: `cat src/components/features/global-search/index.ts`
Note the exported names. The example below assumes `GlobalSearch`, `useGlobalSearch`, and a `fetcher` prop. If the actual API differs, adjust example imports/props before continuing — do not invent props.

- [ ] **Step 2: Create the examples module**

Create `src/preview/pages/features/global-search.examples.tsx`:

```tsx
import { GlobalSearch } from '@/components/features/global-search';
import { mockSearch, type MockSearchResult } from '@/preview/_mocks';

export function Default() {
	return (
		<div className="w-full max-w-md">
			<GlobalSearch
				fetcher={(query: string) => mockSearch(query)}
				renderResult={(result: MockSearchResult) => (
					<div className="flex flex-col">
						<span className="text-sm font-medium">{result.title}</span>
						<span className="text-xs text-muted-foreground">{result.subtitle}</span>
					</div>
				)}
				onResultSelect={(result: MockSearchResult) => {
					if (import.meta.env?.DEV) {
						console.info('selected', result);
					}
				}}
			/>
		</div>
	);
}
```

> **Note for the engineer:** Open `src/components/features/global-search/global-search.types.ts` and confirm prop names. Adjust this example to match the real API. The intent is to demonstrate the mock-fetcher pattern, not to invent an API.

- [ ] **Step 3: Author the MDX page**

Create `src/preview/pages/features/global-search.mdx`:

```mdx
import { DocsPage, Section, Example, PropsTable } from '@/preview/_docs';
import * as Examples from './global-search.examples';
import examplesSource from './global-search.examples?raw';

<DocsPage
	title="GlobalSearch"
	description="Async search palette with slots, render-props, and a headless useGlobalSearch hook."
	layer="features"
	status="ready"
	sourcePath="src/components/features/global-search"
>

<Section title="Overview" id="overview">

`GlobalSearch` is a callback-driven search palette. The library does not
fetch anything — the consumer wires a `fetcher(query)` that returns the
results. The example below uses the in-repo mock fetcher in
`src/preview/_mocks/fetchers.ts`, which simulates an API with a 280ms delay.

</Section>

<Section title="Examples" id="examples">

<Example name="Default" source={examplesSource}>
	<Examples.Default />
</Example>

</Section>

<Section title="API" id="api">

<PropsTable component="GlobalSearch" />

</Section>

</DocsPage>
```

- [ ] **Step 4: Update registry**

In `src/preview/registry.tsx`, find the existing `features/global-search` entry and replace its `component` import with the MDX file:

```ts
{ id: 'features/global-search', label: 'Global search', section: 'Features', family: 'Discovery', component: lazy(() => import('./pages/features/global-search.mdx')), status: 'ready' },
```

(Match the existing entry's `family` value — adjust if it differs.)

- [ ] **Step 5: Verify in the browser**

Reload `http://localhost:5173/#/features/global-search`
Expected: docs page renders. Typing in the search input triggers a 280ms-delayed result list pulled from mock data. Code tab on the example shows the source.

- [ ] **Step 6: Commit**

```bash
git add src/preview/pages/features/global-search.examples.tsx src/preview/pages/features/global-search.mdx src/preview/registry.tsx
git commit -m "preview: convert features/global-search to MDX with mock fetcher"
```

---

## Phase 6 — Three more reference pages (`base/item`, `base/forms`, `features/filters`)

Each follows the same shape as `base/badge` and `features/global-search`. The plan repeats the pattern fully because the engineer may execute tasks out of order.

### Task 6.1: `base/item.mdx`

**Files:**
- Create: `src/preview/pages/base/item.examples.tsx`
- Create: `src/preview/pages/base/item.mdx`
- Modify: `src/preview/registry.tsx`

- [ ] **Step 1: Read the existing ItemPage to crib realistic JSX**

Run: `cat src/preview/pages/base/ItemPage.tsx`
Expected: source listing. Identify 3-5 of the most useful examples to port.

- [ ] **Step 2: Create examples**

Create `src/preview/pages/base/item.examples.tsx`:

```tsx
import { Mail, Home, Settings } from 'lucide-react';
import {
	Item, ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions,
} from '@/components/base/item';
import { Button } from '@/components/base/buttons';

export function Basic() {
	return (
		<ItemGroup className="w-full max-w-md">
			<Item>
				<ItemMedia variant="icon"><Mail /></ItemMedia>
				<ItemContent>
					<ItemTitle>kira@example.com</ItemTitle>
					<ItemDescription>Primary contact</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button buttonStyle="ghost" variant="secondary">Copy</Button>
				</ItemActions>
			</Item>
		</ItemGroup>
	);
}

export function PolymorphicLink() {
	return (
		<ItemGroup className="w-full max-w-md">
			<Item render={<a href="#dashboard" />}>
				<ItemMedia variant="icon"><Home /></ItemMedia>
				<ItemContent>
					<ItemTitle>Dashboard</ItemTitle>
					<ItemDescription>Overview of your workspace</ItemDescription>
				</ItemContent>
			</Item>
			<Item render={<a href="#settings" />}>
				<ItemMedia variant="icon"><Settings /></ItemMedia>
				<ItemContent>
					<ItemTitle>Settings</ItemTitle>
					<ItemDescription>Manage workspace preferences</ItemDescription>
				</ItemContent>
			</Item>
		</ItemGroup>
	);
}
```

- [ ] **Step 3: Author MDX**

Create `src/preview/pages/base/item.mdx`:

```mdx
import { DocsPage, Section, Example, PropsTable } from '@/preview/_docs';
import * as Examples from './item.examples';
import examplesSource from './item.examples?raw';

<DocsPage
	title="Item"
	description="The canonical row primitive — icon/avatar/image media + title/description text-stack + optional actions."
	layer="base"
	status="ready"
	sourcePath="src/components/base/item"
>

<Section title="Overview" id="overview">

Use `Item` for any row that follows the "media + title-stack + actions"
shape: settings menus, contact rows, navigation rows, popover items.
Sizing and variants resolve through `<UIProvider item>`.

</Section>

<Section title="Examples" id="examples">

<Example name="Basic" source={examplesSource}>
	<Examples.Basic />
</Example>

<Example name="PolymorphicLink" source={examplesSource}>
	<Examples.PolymorphicLink />
</Example>

</Section>

<Section title="API" id="api">

<PropsTable component="Item" />

</Section>

</DocsPage>
```

- [ ] **Step 4: Update registry**

Find the `base/item` entry in `src/preview/registry.tsx` and update its `component` to import the MDX file (mirroring the badge change in Task 1.3).

- [ ] **Step 5: Verify in browser**

Reload `http://localhost:5173/#/base/item`
Expected: page renders, both examples work, PropsTable populated.

- [ ] **Step 6: Commit**

```bash
git add src/preview/pages/base/item.mdx src/preview/pages/base/item.examples.tsx src/preview/registry.tsx
git commit -m "preview: convert base/item to MDX reference page"
```

### Task 6.2: `base/forms.mdx`

**Files:**
- Create: `src/preview/pages/base/forms.examples.tsx`
- Create: `src/preview/pages/base/forms.mdx`
- Modify: `src/preview/registry.tsx`

- [ ] **Step 1: Read existing FormsPage**

Run: `cat src/preview/pages/base/FormsPage.tsx`
Expected: source. Identify a couple representative examples (FormField + Input, ControlledFormField + react-hook-form binding).

- [ ] **Step 2: Create examples**

Create `src/preview/pages/base/forms.examples.tsx`:

```tsx
import { useState } from 'react';
import { FormField } from '@/components/base/forms';
import { Input } from '@/components/base/forms/fields';

export function BasicField() {
	const [value, setValue] = useState('');
	return (
		<div className="w-full max-w-sm">
			<FormField label="Email" required hint="We never share this">
				<Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="you@example.com" />
			</FormField>
		</div>
	);
}

export function WithError() {
	return (
		<div className="w-full max-w-sm">
			<FormField label="Email" required error="Email is invalid">
				<Input value="not-an-email" invalid />
			</FormField>
		</div>
	);
}
```

- [ ] **Step 3: Author MDX**

Create `src/preview/pages/base/forms.mdx`:

```mdx
import { DocsPage, Section, Example, PropsTable } from '@/preview/_docs';
import * as Examples from './forms.examples';
import examplesSource from './forms.examples?raw';

<DocsPage
	title="FormField"
	description="The canonical form-row primitive: label + control + hint/helper/error."
	layer="base"
	status="ready"
	sourcePath="src/components/base/forms"
>

<Section title="Overview" id="overview">

`FormField` is the presentational form row. It owns label rendering
(`htmlFor`, required asterisk), the standard label/control/error rhythm,
and the error/hint/helperText precedence. For react-hook-form binding,
use `ControlledFormField` from the same module.

</Section>

<Section title="Examples" id="examples">

<Example name="BasicField" source={examplesSource}>
	<Examples.BasicField />
</Example>

<Example name="WithError" source={examplesSource}>
	<Examples.WithError />
</Example>

</Section>

<Section title="API" id="api">

<PropsTable component="FormField" />

</Section>

</DocsPage>
```

- [ ] **Step 4: Update registry**

Find the `base/forms` entry and change its `component` import to the MDX file.

- [ ] **Step 5: Verify**

Reload the page. Confirm both examples render and the API table populates.

- [ ] **Step 6: Commit**

```bash
git add src/preview/pages/base/forms.mdx src/preview/pages/base/forms.examples.tsx src/preview/registry.tsx
git commit -m "preview: convert base/forms to MDX reference page"
```

### Task 6.3: `features/filters.mdx`

**Files:**
- Create: `src/preview/pages/features/filters.examples.tsx`
- Create: `src/preview/pages/features/filters.mdx`
- Modify: `src/preview/registry.tsx`

- [ ] **Step 1: Read existing FiltersPage and filters API**

Run: `cat src/preview/pages/features/FiltersPage.tsx`
Run: `cat src/components/features/filters/index.ts`
Expected: source listings. Identify the simplest example: a `<FilterProvider>` with one search facet and one async-select facet that uses a mock fetcher.

- [ ] **Step 2: Create examples**

Create `src/preview/pages/features/filters.examples.tsx`:

```tsx
import { FilterProvider, FilterLayout } from '@/components/features/filters';
import { mockListCustomers } from '@/preview/_mocks';

export function Default() {
	return (
		<div className="w-full max-w-2xl">
			<FilterProvider
				facets={[
					{ id: 'q', type: 'search', label: 'Search' },
					{
						id: 'customer',
						type: 'async-select',
						label: 'Customer',
						loadOptions: async () => {
							const rows = await mockListCustomers();
							return rows.map((c) => ({ value: c.id, label: c.name }));
						},
					},
				]}
				onChange={() => {}}
			>
				<FilterLayout />
			</FilterProvider>
		</div>
	);
}
```

> **Note for the engineer:** the `facets` shape above mirrors what `features/filters` currently expects; if the real prop names differ, fix this example before finalizing — never invent an API.

- [ ] **Step 3: Author MDX**

Create `src/preview/pages/features/filters.mdx`:

```mdx
import { DocsPage, Section, Example, PropsTable } from '@/preview/_docs';
import * as Examples from './filters.examples';
import examplesSource from './filters.examples?raw';

<DocsPage
	title="Filters"
	description="Provider-driven filters with composable partials and a peer-dep-free useAsyncOptions hook."
	layer="features"
	status="ready"
	sourcePath="src/components/features/filters"
>

<Section title="Overview" id="overview">

Wrap your filter UI in `<FilterProvider>` and either drop in
`<FilterLayout>` for the default shape, or compose the exported
partials (`<ActiveFilterItem>`, `<FilterOperatorSelect>`,
`<FiltersButton>`) yourself. Async options flow through `loadOptions`
callbacks — no `react-query` peer dep required.

</Section>

<Section title="Examples" id="examples">

<Example name="Default" source={examplesSource}>
	<Examples.Default />
</Example>

</Section>

<Section title="API" id="api">

<PropsTable component="FilterProvider" />

</Section>

</DocsPage>
```

- [ ] **Step 4: Update registry**

Find the `features/filters` entry and update its `component` import.

- [ ] **Step 5: Verify**

Reload the page. Open the customer filter — it should fetch via the mock and populate after ≈280ms.

- [ ] **Step 6: Commit**

```bash
git add src/preview/pages/features/filters.mdx src/preview/pages/features/filters.examples.tsx src/preview/registry.tsx
git commit -m "preview: convert features/filters to MDX reference page"
```

---

## Phase 7 — Conversion script + bulk migration of remaining 87 pages

Goal at end of phase: every `*.tsx` page under `src/preview/pages/**` (except those already converted in Phases 1, 5, 6) has a sibling `.mdx` and `.examples.tsx` and the registry points at the MDX. Old `.tsx` page files remain on disk for visual-parity checking; deleted in Task 7.4.

### Task 7.1: Implement the conversion script

**Files:**
- Create: `scripts/convert-preview-page.mjs`

- [ ] **Step 1: Author the script**

Create `scripts/convert-preview-page.mjs`:

```js
#!/usr/bin/env node
/**
 * One-shot mechanical converter:  XPage.tsx  →  x.mdx + x.examples.tsx
 *
 * Strategy (deliberately conservative — leaves the original .tsx in place):
 *   1. Parse the file as text (no TS AST). Find the default-exported function.
 *   2. Extract the <PreviewPage title="…" description="…">…</PreviewPage> block.
 *   3. Inside, find each <PreviewSection title="…">…</PreviewSection>.
 *      For each, slugify the title for an export name (e.g. "With dot" → "WithDot")
 *      and emit:
 *          export function <Name>() {
 *              return (
 *                  <>{…inner JSX…}</>
 *              );
 *          }
 *      into <name>.examples.tsx.
 *   4. Emit a sibling <name>.mdx that imports * as Examples and the source via ?raw,
 *      and renders one <Section> + <Example> per converted PreviewSection.
 *   5. Print a one-line summary per file. If any file's structure can't be parsed,
 *      log it and skip — leave the .tsx untouched.
 *
 * Usage:  node scripts/convert-preview-page.mjs           (converts all)
 *         node scripts/convert-preview-page.mjs path.tsx  (single file)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, basename, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PAGES_ROOT = resolve(ROOT, 'src/preview/pages');

// Pages already hand-converted in earlier phases — never touch.
const SKIP = new Set([
	'src/preview/pages/base/BadgePage.tsx',
	'src/preview/pages/base/ItemPage.tsx',
	'src/preview/pages/base/FormsPage.tsx',
	'src/preview/pages/features/GlobalSearchPage.tsx',
	'src/preview/pages/features/FiltersPage.tsx',
]);

function pascalToSlug(name) {
	return name.replace(/Page$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function titleToExportName(title) {
	return title
		.replace(/[^a-zA-Z0-9 ]+/g, ' ')
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join('') || 'Example';
}

function extractPreviewPageProps(source) {
	// <PreviewPage title="…" description="…">
	const open = source.match(/<PreviewPage\s+([^>]*)>/);
	if (!open) return null;
	const attrs = open[1];
	const title = attrs.match(/title="([^"]*)"/)?.[1] ?? 'Untitled';
	const description = attrs.match(/description="([^"]*)"/)?.[1] ?? '';
	return { title, description };
}

function extractSections(source) {
	// Greedy walk: find each <PreviewSection title="…" …> … </PreviewSection>
	const out = [];
	const re = /<PreviewSection\s+([^>]*)>([\s\S]*?)<\/PreviewSection>/g;
	let m;
	while ((m = re.exec(source))) {
		const attrs = m[1];
		const inner = m[2];
		const title = attrs.match(/title="([^"]*)"/)?.[1] ?? 'Example';
		out.push({ title, inner: inner.trim() });
	}
	return out;
}

function extractTopImports(source) {
	const out = [];
	const re = /^import[^;]+;$/gm;
	let m;
	while ((m = re.exec(source))) out.push(m[0]);
	// Drop the PreviewLayout import — we don't need it in examples.
	return out.filter((line) => !/['"]\.\.\/\.\.\/PreviewLayout['"]/.test(line));
}

function convertOne(absPath) {
	const rel = relative(ROOT, absPath);
	if (SKIP.has(rel)) return { rel, status: 'skipped (manual)' };

	const source = readFileSync(absPath, 'utf8');

	const props = extractPreviewPageProps(source);
	if (!props) return { rel, status: 'skipped (no PreviewPage)' };

	const sections = extractSections(source);
	if (sections.length === 0) return { rel, status: 'skipped (no sections)' };

	const fileBase = basename(absPath, '.tsx');
	const slug = pascalToSlug(fileBase);
	const dir = dirname(absPath);
	const examplesPath = join(dir, `${slug}.examples.tsx`);
	const mdxPath = join(dir, `${slug}.mdx`);

	if (existsSync(mdxPath)) return { rel, status: 'skipped (mdx exists)' };

	// Build examples file
	const usedNames = new Set();
	const named = sections.map((s) => {
		let name = titleToExportName(s.title);
		let i = 1;
		while (usedNames.has(name)) name = `${titleToExportName(s.title)}${++i}`;
		usedNames.add(name);
		return { name, title: s.title, inner: s.inner };
	});

	const imports = extractTopImports(source).join('\n');
	const examplesBody = named
		.map((n) => `export function ${n.name}() {\n\treturn (\n\t\t<>\n${indent(n.inner, 3)}\n\t\t</>\n\t);\n}`)
		.join('\n\n');
	const examplesContents = `${imports}\n\n${examplesBody}\n`;

	// Build MDX
	const mdxImports = `import { DocsPage, Section, Example } from '@/preview/_docs';\nimport * as Examples from './${slug}.examples';\nimport examplesSource from './${slug}.examples?raw';\n`;
	const sectionsMdx = named
		.map((n) => `<Example name="${n.name}" source={examplesSource}>\n\t<Examples.${n.name} />\n</Example>`)
		.join('\n\n');

	const layer = inferLayer(rel);
	const mdxContents = `${mdxImports}\n<DocsPage\n\ttitle="${escapeAttr(props.title)}"\n\tdescription="${escapeAttr(props.description)}"\n\tlayer="${layer}"\n\tstatus="ready"\n>\n\n<Section title="Examples" id="examples">\n\n${sectionsMdx}\n\n</Section>\n\n</DocsPage>\n`;

	writeFileSync(examplesPath, examplesContents);
	writeFileSync(mdxPath, mdxContents);
	return { rel, status: `converted (${named.length} examples)` };
}

function indent(s, levels) {
	const pad = '\t'.repeat(levels);
	return s.split('\n').map((l) => (l.length ? pad + l : l)).join('\n');
}

function escapeAttr(s) { return s.replace(/"/g, '\\"'); }

function inferLayer(relPath) {
	const m = relPath.match(/src\/preview\/pages\/([^/]+)\//);
	const seg = m?.[1] ?? '';
	if (['ui', 'base', 'composed', 'features', 'layout', 'common'].includes(seg)) return seg;
	return 'common';
}

const arg = process.argv[2];
const targets = arg
	? [resolve(ROOT, arg)]
	: globSync('src/preview/pages/**/*Page.tsx', { cwd: ROOT, absolute: true });

const results = targets.map(convertOne);
for (const r of results) console.log(`${r.status.padEnd(28)} ${r.rel}`);
const converted = results.filter((r) => r.status.startsWith('converted')).length;
console.log(`\nDone: ${converted}/${results.length} converted.`);
```

- [ ] **Step 2: Add npm script**

Edit `package.json` `"scripts"` — add:

```json
"docs:convert-pages": "node scripts/convert-preview-page.mjs",
```

- [ ] **Step 3: Dry-run on a single page first**

Run: `node scripts/convert-preview-page.mjs src/preview/pages/base/AccordionPage.tsx`
Expected: `converted (N examples)` and two new files (`accordion.mdx`, `accordion.examples.tsx`).

Open `src/preview/pages/base/accordion.mdx` and `accordion.examples.tsx` and eyeball them. They should compile.

- [ ] **Step 4: Type-check the new files**

Run: `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0 2>&1 | grep accordion`
Expected: no errors.

- [ ] **Step 5: Commit script + sample conversion**

```bash
git add scripts/convert-preview-page.mjs package.json src/preview/pages/base/accordion.mdx src/preview/pages/base/accordion.examples.tsx
git commit -m "preview: add convert-preview-page script and convert AccordionPage"
```

### Task 7.2: Run the script on all remaining pages

**Files:**
- Generated: 80+ new `.mdx` and `.examples.tsx` files across `src/preview/pages/**`

- [ ] **Step 1: Run the converter**

Run: `npm run docs:convert-pages`
Expected: a status line per page; mostly `converted (N examples)`. Anything `skipped (…)` is logged for manual handling.

- [ ] **Step 2: Type-check the entire app**

Run: `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0 2>&1 | tail -30`
Expected: any new errors flagged. If a converted file fails to compile, open it, fix the JSX (most often: a stray helper function defined inside the original Page that the converter missed), and re-run.

- [ ] **Step 3: For each converter-skipped file, hand-convert**

For each page reported as `skipped (no sections)` or `skipped (no PreviewPage)`:
1. Open the original `XPage.tsx`.
2. Manually create `<x>.examples.tsx` and `<x>.mdx` following the badge template.
3. Verify it renders.

- [ ] **Step 4: Commit converted pages**

```bash
git add src/preview/pages
git commit -m "preview: bulk-convert remaining showcase pages to MDX"
```

### Task 7.3: Repoint registry at all converted MDX pages

**Files:**
- Modify: `src/preview/registry.tsx`

- [ ] **Step 1: Update the registry**

For every entry in `src/preview/registry.tsx` whose current `component` imports `./pages/**/XPage`, change the import path to the converted MDX file.

A regex-driven replace (manual or via `sed`) that turns:

```ts
component: lazy(() => import('./pages/base/AccordionPage'))
```

into:

```ts
component: lazy(() => import('./pages/base/accordion.mdx'))
```

The slug-from-Page-name rule is identical to the converter's `pascalToSlug`. Walk every entry; do not skip.

- [ ] **Step 2: Type-check**

Run: `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0 2>&1 | grep registry`
Expected: no errors.

- [ ] **Step 3: Smoke-test in the browser**

Reload the dev server. Click through 5–10 random pages across UI, Base, Composed, Features, Layout. Each should render through the new docs shell.

- [ ] **Step 4: Commit**

```bash
git add src/preview/registry.tsx
git commit -m "preview: point registry at MDX pages"
```

### Task 7.4: Delete old `XPage.tsx` files after parity check

**Files:**
- Delete: every `src/preview/pages/**/*Page.tsx` whose MDX sibling exists

- [ ] **Step 1: List candidates**

Run: `find src/preview/pages -name "*Page.tsx"`
Expected: a list of every legacy page file.

- [ ] **Step 2: For each, confirm an MDX sibling exists**

Run:

```bash
for f in $(find src/preview/pages -name "*Page.tsx"); do
  base=$(basename "$f" .tsx)
  slug=$(echo "$base" | sed -E 's/Page$//' | sed -E 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
  dir=$(dirname "$f")
  if [ -f "$dir/$slug.mdx" ]; then
    echo "DELETE $f (has $slug.mdx)"
  else
    echo "KEEP   $f (no MDX)"
  fi
done
```

- [ ] **Step 3: Delete the ones marked DELETE**

Run:

```bash
for f in $(find src/preview/pages -name "*Page.tsx"); do
  base=$(basename "$f" .tsx)
  slug=$(echo "$base" | sed -E 's/Page$//' | sed -E 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
  dir=$(dirname "$f")
  if [ -f "$dir/$slug.mdx" ]; then
    git rm "$f"
  fi
done
```

- [ ] **Step 4: Type-check + smoke-test**

Run: `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0 2>&1 | tail`
Expected: no new errors.

Reload the dev server, click 5 random pages.

- [ ] **Step 5: Commit**

```bash
git commit -m "preview: remove legacy XPage.tsx files (replaced by MDX)"
```

---

## Phase 8 — Navigation overhaul (sidebar + topbar + breadcrumb)

Goal at end of phase: PreviewApp's chrome looks like a real docs site — collapsible sidebar by family, search input, breadcrumb in the topbar.

### Task 8.1: Add breadcrumb to the topbar

**Files:**
- Modify: `src/preview/PreviewApp.tsx`

- [ ] **Step 1: Add the breadcrumb component**

In `src/preview/PreviewApp.tsx`, inside the topbar, add a breadcrumb showing `<Section> / <Family> / <Label>` using the active entry. The simplest implementation:

Replace the existing `<span className="shrink-0 text-sm font-semibold">Component Preview</span>` block with:

```tsx
<div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
	<span className="text-foreground font-semibold">Components</span>
	{active && (
		<>
			<span>/</span>
			<span>{active.section}</span>
			<span>/</span>
			<span>{active.family}</span>
			<span>/</span>
			<span className="text-foreground font-medium">{active.label}</span>
		</>
	)}
</div>
```

- [ ] **Step 2: Verify in browser**

Reload. Navigate between pages — the breadcrumb updates on each page.

- [ ] **Step 3: Commit**

```bash
git add src/preview/PreviewApp.tsx
git commit -m "preview: add breadcrumb to PreviewApp topbar"
```

### Task 8.2: Sidebar — collapsible families with counts

**Files:**
- Modify: `src/preview/PreviewApp.tsx`

- [ ] **Step 1: Convert each family group to a `<details>` element**

In `PreviewApp.tsx`, in the sidebar map over `filteredFamilies`, replace the family `<div>` with:

```tsx
<details key={family} className="mb-2 group" open>
	<summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1 text-xxs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
		<span>{family}</span>
		<span className="rounded-full bg-muted px-1.5 text-xxs tabular-nums">{entries.length}</span>
	</summary>
	<ul className="mt-1 space-y-0.5">
		{entries.map((entry) => {
			const isActive = entry.id === active?.id;
			return (
				<li key={entry.id}>
					<a
						href={`#/${entry.id}`}
						className={
							'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ' +
							(isActive
								? 'bg-muted font-medium text-foreground'
								: 'text-muted-foreground hover:bg-muted/60 hover:text-foreground')
						}
					>
						{statusDot(entry.status)}
						<span className="truncate">{entry.label}</span>
					</a>
				</li>
			);
		})}
	</ul>
</details>
```

- [ ] **Step 2: Verify in browser**

Reload. Each family group is collapsible; counts visible.

- [ ] **Step 3: Commit**

```bash
git add src/preview/PreviewApp.tsx
git commit -m "preview: make sidebar families collapsible with counts"
```

---

## Phase 9 — Skill integration: `references/components/`

Goal at end of phase: `.agents/skills/component-library-rules/references/components/` exists with an `INDEX.md` and one `<id>.md` per registered component, generated from the MDX. CI fails if it goes stale.

### Task 9.1: Build the sync script

**Files:**
- Create: `scripts/sync-skill-components.mjs`

- [ ] **Step 1: Author the script**

Create `scripts/sync-skill-components.mjs`:

```js
#!/usr/bin/env node
/**
 * Walks every MDX page under src/preview/pages/**, plus its sibling
 * .examples.tsx, and writes a markdown reference file per page into
 * .agents/skills/component-library-rules/references/components/.
 *
 * Also writes INDEX.md grouping by section.
 *
 * --check : exits non-zero if the generated content differs from what's on
 *           disk (used in `npm run verify`).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, '.agents/skills/component-library-rules/references/components');
const CHECK = process.argv.includes('--check');

const mdxFiles = globSync('src/preview/pages/**/*.mdx', { cwd: ROOT, absolute: true });

const generated = {};

function parseFrontmatter(mdx) {
	// We don't use real frontmatter; we read the <DocsPage … > attributes.
	const m = mdx.match(/<DocsPage\s+([^>]*)>/s);
	if (!m) return {};
	const attrs = m[1];
	const get = (k) => attrs.match(new RegExp(`${k}="([^"]*)"`))?.[1];
	return {
		title: get('title') ?? '',
		description: get('description') ?? '',
		layer: get('layer') ?? '',
		status: get('status') ?? '',
		sourcePath: get('sourcePath') ?? '',
	};
}

function inferIdFromPath(absPath) {
	// src/preview/pages/<section>/<slug>.mdx → <section>/<slug>
	const rel = relative(resolve(ROOT, 'src/preview/pages'), absPath);
	return rel.replace(/\.mdx$/, '');
}

function buildMarkdown({ id, fm, examplesSource, exampleNames }) {
	const lines = [];
	lines.push(`# ${fm.title || id}`);
	lines.push('');
	if (fm.description) lines.push(fm.description, '');
	if (fm.layer) lines.push(`**Layer:** \`${fm.layer}\`  `);
	if (fm.sourcePath) lines.push(`**Source:** \`${fm.sourcePath}\``);
	lines.push('');

	if (examplesSource) {
		lines.push('## Examples');
		lines.push('');
		lines.push('```tsx');
		lines.push(examplesSource.trim());
		lines.push('```');
		lines.push('');
	}

	if (exampleNames.length > 0) {
		lines.push('## Example exports');
		lines.push('');
		for (const n of exampleNames) lines.push(`- \`${n}\``);
		lines.push('');
	}

	return lines.join('\n') + '\n';
}

function discoverExampleNames(examplesSource) {
	const out = [];
	const re = /export\s+function\s+([A-Za-z0-9_]+)\s*\(/g;
	let m;
	while ((m = re.exec(examplesSource))) out.push(m[1]);
	return out;
}

for (const abs of mdxFiles) {
	const id = inferIdFromPath(abs);
	const mdx = readFileSync(abs, 'utf8');
	const fm = parseFrontmatter(mdx);

	const examplesPath = abs.replace(/\.mdx$/, '.examples.tsx');
	let examplesSource = '';
	let exampleNames = [];
	if (existsSync(examplesPath)) {
		examplesSource = readFileSync(examplesPath, 'utf8');
		exampleNames = discoverExampleNames(examplesSource);
	}

	const md = buildMarkdown({ id, fm, examplesSource, exampleNames });
	const outPath = resolve(OUT_DIR, `${id.replace(/\//g, '__')}.md`);
	generated[outPath] = md;
}

// INDEX.md
const indexLines = ['# Component reference index', '', 'Auto-generated. Do not edit by hand — run `npm run docs:sync-skill`.', ''];
const grouped = {};
for (const abs of mdxFiles) {
	const id = inferIdFromPath(abs);
	const fm = parseFrontmatter(readFileSync(abs, 'utf8'));
	const section = id.split('/')[0];
	(grouped[section] ??= []).push({ id, fm });
}
for (const section of Object.keys(grouped).sort()) {
	indexLines.push(`## ${section}`, '');
	for (const { id, fm } of grouped[section].sort((a, b) => a.id.localeCompare(b.id))) {
		const file = `${id.replace(/\//g, '__')}.md`;
		indexLines.push(`- [${fm.title || id}](./${file}) — ${fm.description || ''}`);
	}
	indexLines.push('');
}
generated[resolve(OUT_DIR, 'INDEX.md')] = indexLines.join('\n') + '\n';

// README.md (one-time content; only created if missing)
const readmePath = resolve(OUT_DIR, 'README.md');
const readmeContent = `# Component reference

This directory is generated from the MDX showcase pages under
\`src/preview/pages/\`. AI agents using the \`component-library-rules\`
skill should read \`INDEX.md\` to find the canonical usage example for
each component.

To regenerate: \`npm run docs:sync-skill\`
To verify freshness in CI: \`npm run docs:sync-skill -- --check\`
`;

if (CHECK) {
	let stale = false;
	if (!existsSync(readmePath)) { console.error('Missing README.md'); stale = true; }
	for (const [path, content] of Object.entries(generated)) {
		const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
		if (current !== content) {
			stale = true;
			console.error(`Stale: ${relative(ROOT, path)}`);
		}
	}
	// Detect orphan files (on disk but no longer generated).
	if (existsSync(OUT_DIR)) {
		const onDisk = readdirSync(OUT_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'INDEX.md');
		const expected = new Set(Object.keys(generated).map((p) => basename(p)));
		for (const f of onDisk) {
			if (!expected.has(f)) {
				stale = true;
				console.error(`Orphan: ${f}`);
			}
		}
	}
	if (stale) {
		console.error('\nrun `npm run docs:sync-skill` to regenerate.');
		process.exit(1);
	}
	console.log('skill components are up to date.');
} else {
	mkdirSync(OUT_DIR, { recursive: true });
	if (!existsSync(readmePath)) writeFileSync(readmePath, readmeContent);
	// Wipe any orphan files first so the directory always matches generated set.
	const onDisk = readdirSync(OUT_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md');
	const expectedFilenames = new Set(Object.keys(generated).map((p) => basename(p)));
	for (const f of onDisk) {
		if (!expectedFilenames.has(f)) rmSync(resolve(OUT_DIR, f));
	}
	for (const [path, content] of Object.entries(generated)) {
		writeFileSync(path, content);
	}
	console.log(`Wrote ${Object.keys(generated).length} files to ${relative(ROOT, OUT_DIR)}`);
}
```

- [ ] **Step 2: Add npm scripts and wire into verify**

Edit `package.json` `"scripts"`:

```json
"docs:sync-skill": "node scripts/sync-skill-components.mjs",
"verify": "npm run lint:architecture && npm run test:exports && npm run docs:check-props && npm run docs:sync-skill -- --check && npm run typecheck && npm run lint && npm run test -- --pool=threads --maxWorkers=1",
```

- [ ] **Step 3: Run sync**

Run: `npm run docs:sync-skill`
Expected: `Wrote N files to .agents/skills/component-library-rules/references/components`. Verify the directory exists and contains INDEX.md, README.md, and per-component .md files.

- [ ] **Step 4: Verify the freshness check passes**

Run: `npm run docs:sync-skill -- --check`
Expected: `skill components are up to date.`

- [ ] **Step 5: Commit**

```bash
git add scripts/sync-skill-components.mjs package.json .agents/skills/component-library-rules/references/components
git commit -m "skill: generate references/components from MDX showcase"
```

### Task 9.2: Update SKILL.md to point at the components index

**Files:**
- Modify: `.agents/skills/component-library-rules/SKILL.md`

- [ ] **Step 1: Add a new section near the top of SKILL.md**

Open `.agents/skills/component-library-rules/SKILL.md`. After the "Conditional sub-guides" section table, add:

```md
## Component reference index

Every component documented in the showcase has a generated markdown
reference at
[`references/components/INDEX.md`](references/components/INDEX.md). Each
entry links to a per-component `.md` with:

- The component's title, description, layer, and source path
- Verbatim example code (from the matching `*.examples.tsx` in the showcase)
- The list of named example exports

When designing a new feature, **read the relevant component file first**
to see how the library uses it before writing fresh code.

The references are generated from the MDX showcase by
`npm run docs:sync-skill`; CI runs the freshness check via `npm run verify`.
```

- [ ] **Step 2: Commit**

```bash
git add .agents/skills/component-library-rules/SKILL.md
git commit -m "skill: link SKILL.md to generated component references"
```

---

## Phase 10 — Final verification + cleanup

### Task 10.1: Full verify pass

**Files:** none

- [ ] **Step 1: Run full verify**

Run: `npm run verify`
Expected: exits 0. If anything fails, fix in place. Most likely failures:
- `docs:check-props` — run `npm run docs:generate-props` and commit.
- `docs:sync-skill -- --check` — run `npm run docs:sync-skill` and commit.

- [ ] **Step 2: Click-through smoke test**

In the running dev server, visit at least one page from each section
(UI, Base, Composed, Features, Layout, Common). Each must render through
the new docs shell, with at least one Example and tab-toggle working.

- [ ] **Step 3: Commit any verify-driven regenerations**

```bash
git add -A
git commit -m "preview: regenerate props + skill references for verify"
```

### Task 10.2: Push branch and confirm

**Files:** none

- [ ] **Step 1: Push (only if user explicitly authorized; otherwise stop here)**

If — and only if — the user explicitly says "push", run:

```bash
git push -u origin feat/docs-style-preview
```

Otherwise, stop here and report completion.

---

## Self-review

**Spec coverage check** (against `2026-05-04-docs-style-preview-system-design.md`):

- [x] `<DocsPage>`, `<Section>`, `<Example>`, `<CodeBlock>`, `<PropsTable>` primitives — Phases 1–4
- [x] MDX wiring in Vite — Task 1.1
- [x] `?raw` source extraction — Task 2.1 / Task 2.4
- [x] `react-docgen-typescript` JSON sidecar — Task 4.1
- [x] Mock-API helpers — Task 5.1, 5.2
- [x] Five reference pages — Phases 1, 5, 6 (badge, global-search, item, forms, filters)
- [x] Conversion script + bulk migration — Phase 7
- [x] Navigation overhaul (breadcrumb, collapsible families) — Phase 8 (TOC right rail done in Phase 3)
- [x] `references/components/` + sync script + SKILL.md update — Phase 9
- [x] CI freshness checks added to `npm run verify` — Tasks 4.3, 9.1
- [x] Old `.tsx` page files deleted — Task 7.4

**Placeholder scan:** none — every step has either a code block or an exact command + expected output.

**Type/name consistency:** `extractExample`, `<Example name="…" source={…}>`, `props.generated.json`, `docs:sync-skill`, `docs:generate-props`, `docs:check-props`, `docs:convert-pages` — all referenced consistently across tasks.

**Known soft spots that the executing engineer must verify in-flight (not bugs in the plan):**

1. The `GlobalSearch` and `Filters` example code in Tasks 5.3 and 6.3 mirrors what those features *appear* to expose. The engineer is instructed to open the actual `.types.ts` and adjust prop names rather than ship a fictional API.
2. The conversion script in Task 7.1 is conservative regex-based parsing. If a converted page fails to compile, the script intentionally leaves the original `.tsx` in place; the engineer falls back to a manual conversion using the badge template.
3. `react-docgen-typescript` will not document every component on the first run. Components without a doc entry render the yellow "regenerate" placeholder — non-blocking for this iteration, fixable by adding JSDoc to the component or by cycling the script.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-04-docs-style-preview-system.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
