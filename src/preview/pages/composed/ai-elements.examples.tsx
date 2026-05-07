import { Bot, Cpu, FileText, Wrench } from 'lucide-react';
import {
	AiAgent,
	AiArtifact,
	AiAttachment,
	AiChainOfThought,
	AiCodeBlock,
	AiConfirmation,
	AiFileTree,
	AiInlineCitation,
	AiPackageInfo,
	AiReasoning,
	AiShimmer,
	AiSources,
	AiTask,
} from '@/components/composed/ai';
import { Text } from '@/components/typography';

const REACT_SAMPLE = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}`;

const SHELL_SAMPLE = `pnpm install admin-ui-starter-kit
pnpm add -D tailwindcss@^4 @tailwindcss/vite`;

export function AiShimmerExample() {
	return (
		<>
			<div className="flex flex-col gap-3">
								<AiShimmer>Generating insights…</AiShimmer>
								<AiShimmer paused>Paused</AiShimmer>
							</div>
		</>
	);
}

export function AiAgentExample() {
	return (
		<>
			<div className="flex flex-col gap-3">
								<AiAgent name="Atlas" subtitle="claude-4.7-1m" status="thinking" icon={Bot} />
								<AiAgent
									name="Helios"
									subtitle="local · qwen-2.5-coder"
									tone="success"
									status="done"
									variant="card"
									icon={Cpu}
								/>
								<AiAgent name="Nova" subtitle="offline" tone="neutral" status="offline" icon={Bot} />
							</div>
		</>
	);
}

export function AiCodeBlockExample() {
	return (
		<>
			<div className="flex flex-col gap-3">
								<AiCodeBlock code={REACT_SAMPLE} language="tsx" filename="Counter.tsx" showLineNumbers />
								<AiCodeBlock code={SHELL_SAMPLE} language="shell" />
							</div>
		</>
	);
}

export function AiAttachmentExample() {
	return (
		<>
			<div className="flex flex-wrap gap-2">
								<AiAttachment
									name="quarterly-report.pdf"
									meta="2.4 MB · PDF"
									kind="document"
									onOpen={() => {}}
									onRemove={() => {}}
								/>
								<AiAttachment
									name="brand-mark.png"
									meta="312 KB · PNG"
									kind="image"
									thumbnailUrl="https://images.unsplash.com/photo-1520975918318-3a83a708bf26?w=80&h=80&fit=crop"
									onOpen={() => {}}
								/>
								<AiAttachment
									name="setup.sh"
									meta="Uploading… 60%"
									kind="code"
									progress={0.6}
								/>
								<AiAttachment
									name="readme.md"
									meta="Failed to upload"
									kind="document"
									errored
									onRemove={() => {}}
								/>
							</div>
		</>
	);
}

export function AiInlineCitationExample() {
	return (
		<>
			<Text>
								The framework supports zero-config TypeScript out of the box
								<AiInlineCitation index={1} title="Vite docs" url="https://vitejs.dev" />, and
								accepts arbitrary React components as plugins
								<AiInlineCitation index={2} title="React reference" />, including
								compound components
								<AiInlineCitation index={3} onSelect={() => {}} title="Custom hook patterns" />.
							</Text>
		</>
	);
}

export function AiSourcesExample() {
	return (
		<>
			<div className="flex flex-col gap-4">
								<AiSources
									sources={[
										{
											id: 'a',
											title: 'Vite — Next-gen tooling',
											publisher: 'vitejs.dev',
											url: 'https://vitejs.dev',
											faviconUrl: 'https://vitejs.dev/logo.svg',
										},
										{
											id: 'b',
											title: 'React documentation',
											publisher: 'react.dev',
											url: 'https://react.dev',
										},
										{
											id: 'c',
											title: 'TypeScript Handbook',
											publisher: 'typescriptlang.org',
											url: 'https://www.typescriptlang.org/docs',
										},
									]}
									defaultExpanded
								/>
								<AiSources
									variant="avatars"
									sources={[
										{ id: 'a', title: 'Site A' },
										{ id: 'b', title: 'Site B' },
										{ id: 'c', title: 'Site C' },
										{ id: 'd', title: 'Site D' },
										{ id: 'e', title: 'Site E' },
										{ id: 'f', title: 'Site F' },
									]}
								/>
							</div>
		</>
	);
}

export function AiReasoningExample() {
	return (
		<>
			<div className="flex flex-col gap-3">
								<AiReasoning streaming defaultExpanded>
									{`Looking at the schema, I need to:\n1. Group rows by booking date\n2. Sum totals per group\n3. Pull refund deltas from the parallel table…`}
								</AiReasoning>
								<AiReasoning durationSeconds={3.6}>
									{`Resolved query plan: bookings JOIN refunds ON booking_id, GROUP BY date(created_at). Skipped index on customer_id (not needed for the daily aggregate).`}
								</AiReasoning>
							</div>
		</>
	);
}

export function AiChainOfThoughtExample() {
	return (
		<>
			<AiChainOfThought
								streaming
								steps={[
									{
										id: '1',
										title: 'Parse the prompt',
										description: 'Identify entities and intent.',
										status: 'completed',
									},
									{
										id: '2',
										title: 'Lookup product catalog',
										description: 'Fetch SKUs, pricing, and availability.',
										status: 'completed',
									},
									{
										id: '3',
										title: 'Reconcile with inventory',
										description: 'Cross-check on-hand vs. reserved.',
										status: 'active',
									},
									{
										id: '4',
										title: 'Generate draft response',
										status: 'pending',
									},
								]}
							/>
		</>
	);
}

export function AiTaskExample() {
	return (
		<>
			<AiTask
								density="expanded"
								task={{
									id: 'root',
									title: 'Bootstrap a new Vite + React project',
									status: 'running',
									rightSlot: '12.4s',
									children: [
										{ id: '1', title: 'Resolve template', status: 'completed', rightSlot: '0.2s' },
										{
											id: '2',
											title: 'Install dependencies',
											status: 'completed',
											rightSlot: '8.1s',
											children: [
												{ id: '2a', title: 'react @ 19.1.0', status: 'completed' },
												{ id: '2b', title: 'vite @ 6.0.0', status: 'completed' },
												{ id: '2c', title: 'typescript @ 5.5.3', status: 'completed' },
											],
										},
										{ id: '3', title: 'Run dev server', status: 'running', rightSlot: '4.1s' },
										{ id: '4', title: 'Open browser', status: 'queued' },
										{ id: '5', title: 'Cleanup tmp', status: 'skipped' },
									],
								}}
							/>
		</>
	);
}

export function AiArtifactExample() {
	return (
		<>
			<AiArtifact
								title="Counter.tsx"
								subtitle="React component · 12 lines"
								icon={FileText}
								copyText={REACT_SAMPLE}
								onOpen={() => {}}
								onDownload={() => {}}
							>
								<AiCodeBlock code={REACT_SAMPLE} language="tsx" hideHeader />
							</AiArtifact>
		</>
	);
}

export function AiFileTreeExample() {
	return (
		<>
			<AiFileTree
								nodes={[
									{
										id: 'root',
										name: 'src',
										kind: 'directory',
										defaultExpanded: true,
										children: [
											{
												id: 'app',
												name: 'app',
												kind: 'directory',
												defaultExpanded: true,
												children: [
													{
														id: 'app/page.tsx',
														name: 'page.tsx',
														kind: 'file',
														status: 'modified',
													},
													{ id: 'app/layout.tsx', name: 'layout.tsx', kind: 'file' },
													{
														id: 'app/route.ts',
														name: 'route.ts',
														kind: 'file',
														status: 'added',
													},
												],
											},
											{
												id: 'components',
												name: 'components',
												kind: 'directory',
												children: [
													{ id: 'card.tsx', name: 'Card.tsx', kind: 'file' },
													{
														id: 'old-card.tsx',
														name: 'OldCard.tsx',
														kind: 'file',
														status: 'removed',
													},
												],
											},
											{ id: 'index.ts', name: 'index.ts', kind: 'file', status: 'renamed' },
										],
									},
								]}
							/>
		</>
	);
}

export function AiPackageInfoExample() {
	return (
		<>
			<AiPackageInfo
								name="admin-ui-starter-kit"
								version="1.4.2"
								description="Composable React component library with shadcn primitives, base wrappers, and AI surfaces."
								license="MIT"
								publishedAt="2 days ago"
								weeklyDownloads="1,240"
								homepage="https://example.com"
								repository="https://github.com/nicolasvlachos/admin-ui-starter-kit"
								keywords={['react', 'shadcn', 'tailwind', 'ai', 'components']}
							/>
		</>
	);
}

export function AiConfirmationExample() {
	return (
		<>
			<div className="flex flex-col gap-3">
								<AiConfirmation
									title="Run npm install in the workspace?"
									description="The agent will execute pnpm install with the lockfile pinned to the current commit."
									icon={Wrench}
									tone="info"
								/>
								<AiConfirmation
									title="Delete 4 obsolete branches"
									description="release/0.4, feat/old-router, fix/legacy-style, chore/unused-deps"
									tone="destructive"
								/>
								<AiConfirmation
									title="Publish v1.4.2 to npm"
									tone="primary"
									status="approved"
								/>
							</div>
		</>
	);
}
