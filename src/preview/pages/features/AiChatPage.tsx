import { useCallback, useState } from 'react';
import {
	BarChart3,
	Bot,
	Database,
	FileText,
	Lightbulb,
	Search,
	Sparkles,
	Wrench,
} from 'lucide-react';

import {
	AiChat,
	type AiChatAttachment,
	type AiChatMessage,
	type AiChatQueueItem,
	type AiChatSubmitValues,
	type AiChatSuggestion,
} from '@/components/features/ai-chat';
import { AiCodeBlock } from '@/components/composed/ai/ai-code-block';
import { AiFeedback } from '@/components/composed/ai/ai-feedback';
import { Heading, Text } from '@/components/typography';

const AGENT = {
	name: 'Atlas',
	subtitle: 'claude-4.7-1m · with tools',
	icon: Bot,
	tone: 'primary' as const,
	status: 'idle' as const,
};

const SAMPLE_CODE = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}`;

const SEED_MESSAGES: AiChatMessage[] = [
	{
		id: 'm1',
		role: 'user',
		authorName: 'You',
		timestamp: '14:31',
		parts: [
			{
				type: 'text',
				content: 'Can you summarise yesterday’s bookings and flag anything unusual?',
			},
			{
				type: 'attachments',
				items: [
					{
						id: 'a1',
						name: 'bookings-2026-04-30.csv',
						meta: '124 KB · CSV',
						kind: 'document',
					},
				],
			},
		],
	},
	{
		id: 'm2',
		role: 'assistant',
		authorName: 'Atlas',
		timestamp: '14:31',
		parts: [
			{
				type: 'reasoning',
				durationSeconds: 3.4,
				content:
					'Loading the CSV, grouping by date, computing totals and refund deltas. Spa package volume looked off so checked the prior 7-day baseline.',
			},
			{
				type: 'tool',
				name: 'analytics.query',
				status: 'success',
				durationMs: 320,
				args: '{ "from": "2026-04-30", "to": "2026-04-30", "metric": "bookings" }',
				result: '23 bookings · 4,820 USD · 2 refunds',
			},
			{
				type: 'text',
				content:
					'You had 23 bookings yesterday totalling 4,820 USD. Two refunds were processed (one for a cancellation, one duplicate). The Spa package saw 2× the usual demand.',
			},
			{
				type: 'sources',
				variant: 'avatars',
				items: [
					{ id: 's1', title: 'bookings.csv', publisher: 'attached file' },
					{ id: 's2', title: 'pricing.json', publisher: 'attached file' },
					{ id: 's3', title: 'refunds.tsv', publisher: 'attached file' },
				],
			},
		],
		trailing: <AiFeedback onVote={() => {}} onSubmitComment={() => {}} />,
	},
	{
		id: 'm3',
		role: 'user',
		authorName: 'You',
		timestamp: '14:33',
		parts: [
			{
				type: 'text',
				content: 'Can you generate a Counter.tsx demo and run npm install for the deps?',
			},
		],
	},
	{
		id: 'm4',
		role: 'assistant',
		authorName: 'Atlas',
		timestamp: '14:33',
		parts: [
			{
				type: 'chain-of-thought',
				steps: [
					{ id: '1', title: 'Pick a minimal example', status: 'completed' },
					{ id: '2', title: 'Write the component', status: 'completed' },
					{ id: '3', title: 'Verify dependencies', status: 'active' },
				],
			},
			{
				type: 'artifact',
				title: 'Counter.tsx',
				subtitle: 'React component · 12 lines',
				icon: FileText,
				copyText: SAMPLE_CODE,
				body: <AiCodeBlock code={SAMPLE_CODE} language="tsx" hideHeader />,
				onDownload: () => {},
				onOpen: () => {},
			},
			{
				type: 'confirmation',
				title: 'Run pnpm install in the workspace?',
				description: 'Atlas needs to install react-dom@19 to run the demo.',
				tone: 'info',
				onApprove: () => {},
				onReject: () => {},
			},
		],
	},
];

const SUGGESTIONS: AiChatSuggestion[] = [
	{ id: 'kpi', label: 'KPI digest', icon: BarChart3 },
	{ id: 'invoice', label: 'Overdue reminder draft', icon: FileText },
	{ id: 'lookup', label: 'Find similar customers', icon: Search },
	{ id: 'refund', label: 'Refund policy explainer', icon: Lightbulb },
	{ id: 'analytics', label: 'Build a SQL query', icon: Database },
];

export default function AiChatPage() {
	const [messages, setMessages] = useState<AiChatMessage[]>(SEED_MESSAGES);
	const [input, setInput] = useState('');
	const [streaming, setStreaming] = useState(false);
	const [attachments, setAttachments] = useState<AiChatAttachment[]>([]);
	const [queue, setQueue] = useState<AiChatQueueItem[]>([]);

	const handleSubmit = useCallback((values: AiChatSubmitValues) => {
		if (!values.text.trim() && values.attachments.length === 0) return;
		const userMsg: AiChatMessage = {
			id: `u-${Date.now()}`,
			role: 'user',
			authorName: 'You',
			timestamp: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			parts: [
				...(values.text.trim()
					? [{ type: 'text' as const, content: values.text }]
					: []),
				...(values.attachments.length > 0
					? [{ type: 'attachments' as const, items: values.attachments }]
					: []),
			],
		};
		const assistantPlaceholder: AiChatMessage = {
			id: `a-${Date.now()}`,
			role: 'assistant',
			authorName: 'Atlas',
			pending: true,
			parts: [],
		};
		setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
		setInput('');
		setAttachments([]);
		setStreaming(true);
		window.setTimeout(() => {
			setMessages((prev) =>
				prev.map((m) =>
					m.id === assistantPlaceholder.id
						? {
								...m,
								pending: false,
								parts: [
									{
										type: 'text',
										content:
											'Got it. (This is a demo; in your app, wire `onSubmit` to your model API.)',
									},
								],
							}
						: m,
				),
			);
			setStreaming(false);
		}, 1200);
	}, []);

	const handlePickSuggestion = useCallback((s: AiChatSuggestion) => {
		setInput(typeof s.label === 'string' ? s.label : '');
	}, []);

	const handleAttach = useCallback(() => {
		const id = `att-${Date.now()}`;
		setAttachments((prev) => [
			...prev,
			{
				id,
				name: 'sample-spec.md',
				meta: '32 KB · Markdown',
				kind: 'document',
			},
		]);
	}, []);

	const handleRemoveAttachment = useCallback((id: string) => {
		setAttachments((prev) => prev.filter((a) => a.id !== id));
	}, []);

	const handleQueueDemo = useCallback(() => {
		setQueue([
			{ id: 'q1', label: 'Generate weekly KPI digest', status: 'running' },
			{ id: 'q2', label: 'Draft refund email to customer #2941', status: 'queued' },
		]);
	}, []);

	return (
		<div className="space-y-6">
			<header className="border-b border-border pb-4">
				<Heading tag="h1">Features · AI Chat</Heading>
				<Text type="secondary" className="mt-1">
					Framework-agnostic chat surface. Ties together prompt input,
					conversation, message renderer, queue, and the full{' '}
					<code className="rounded bg-muted px-1 font-mono text-xs">
						composed/ai/*
					</code>{' '}
					palette (reasoning, tool calls, attachments, artifacts, confirmations).
				</Text>
			</header>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
				<div className="h-[720px] min-h-[480px]">
					<AiChat
						agent={AGENT}
						messages={messages}
						inputValue={input}
						onInputChange={setInput}
						onSubmit={handleSubmit}
						onStop={() => setStreaming(false)}
						streaming={streaming}
						attachments={attachments}
						onRemoveAttachment={handleRemoveAttachment}
						onAttach={handleAttach}
						suggestions={SUGGESTIONS}
						onPickSuggestion={handlePickSuggestion}
						queue={queue}
						onCancelQueueItem={(id) =>
							setQueue((prev) => prev.filter((q) => q.id !== id))
						}
						onMessageRegenerate={() => {}}
						onMessageCopy={() => {}}
					/>
				</div>

				<aside className="space-y-4">
					<section className="rounded-lg border border-border bg-card p-4">
						<Heading tag="h5">Try it</Heading>
						<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
							<li>Type a message and press Enter to submit.</li>
							<li>Click the paperclip to stage a sample attachment.</li>
							<li>Pick a suggestion to seed the input.</li>
							<li>
								<button
									type="button"
									onClick={handleQueueDemo}
									className="text-primary hover:underline"
								>
									Show queue
								</button>{' '}
								— demo a pending-message strip.
							</li>
						</ul>
					</section>

					<section className="rounded-lg border border-border bg-card p-4">
						<Heading tag="h5">What’s in the bundle</Heading>
						<ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
							<li>· Prompt input</li>
							<li>· Conversation</li>
							<li>· Message parts</li>
							<li>· Reasoning</li>
							<li>· Chain of thought</li>
							<li>· Tool calls</li>
							<li>· Code blocks</li>
							<li>· Attachments</li>
							<li>· Sources</li>
							<li>· Artifacts</li>
							<li>· Confirmations</li>
							<li>· Queue</li>
							<li>· Suggestions</li>
						</ul>
					</section>

					<section className="rounded-lg border border-border bg-card p-4">
						<Heading tag="h5">Featured icons</Heading>
						<div className="mt-2 flex items-center gap-2 text-muted-foreground">
							<Sparkles className="size-4" />
							<Wrench className="size-4" />
							<Bot className="size-4" />
							<Database className="size-4" />
							<FileText className="size-4" />
						</div>
					</section>
				</aside>
			</div>
		</div>
	);
}
