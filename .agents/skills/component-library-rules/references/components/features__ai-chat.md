---
id: features/ai-chat
title: "AI Chat"
description: "Framework-agnostic AI chat surface. Ties together prompt input, conversation, message renderer, queue, and the full composed/ai/* palette (reasoning, tool calls, attachments, artifacts, confirmations)."
layer: features
family: "AI"
sourcePath: src/components/features/ai-chat
examples:
  - Counter
  - Default
  - Streaming
  - Empty
  - WithSlots
  - Headless
imports:
  - @/components/base/buttons
  - @/components/composed/ai/ai-code-block
  - @/components/composed/ai/ai-feedback
  - @/components/features/ai-chat
  - @/components/typography
tags:
  - features
  - ai
  - ai-chat
  - chat
  - framework
  - agnostic
  - surface
---

# AI Chat

Framework-agnostic AI chat surface. Ties together prompt input, conversation, message renderer, queue, and the full composed/ai/* palette (reasoning, tool calls, attachments, artifacts, confirmations).

**Layer:** `features`  
**Source:** `src/components/features/ai-chat`

## Examples

```tsx
import { useCallback, useState } from 'react';
import {
	BarChart3,
	Bot,
	Database,
	FileText,
	Lightbulb,
	Search,
} from 'lucide-react';

import {
	AiChat,
	AiChatConversation,
	AiChatEmptyState,
	AiChatPromptInput,
	useAiChatScroll,
	type AiChatAttachment,
	type AiChatMessage,
	type AiChatQueueItem,
	type AiChatSubmitValues,
	type AiChatSuggestion,
} from '@/components/features/ai-chat';
import { AiCodeBlock } from '@/components/composed/ai/ai-code-block';
import { AiFeedback } from '@/components/composed/ai/ai-feedback';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';

/* ------------------------------------------------------------------ */
/*  Shared seed data                                                  */
/* ------------------------------------------------------------------ */

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
				content:
					'Can you summarise yesterday’s bookings and flag anything unusual?',
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
					'You had 23 bookings yesterday totalling 4,820 USD. Two refunds were processed (one cancellation, one duplicate). The Spa package saw 2× the usual demand.',
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
				content:
					'Generate a Counter.tsx demo and queue an npm install for the deps.',
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

/* ------------------------------------------------------------------ */
/*  1. Default conversation                                            */
/* ------------------------------------------------------------------ */

export function Default() {
	const [messages, setMessages] = useState<AiChatMessage[]>(SEED_MESSAGES);
	const [input, setInput] = useState('');
	const [streaming, setStreaming] = useState(false);
	const [attachments, setAttachments] = useState<AiChatAttachment[]>([]);

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
											'Got it. (This is a demo — wire `onSubmit` to your model API in production.)',
									},
								],
							}
						: m,
				),
			);
			setStreaming(false);
		}, 1200);
	}, []);

	return (
		<div className="h-[640px]">
			<AiChat
				agent={AGENT}
				messages={messages}
				inputValue={input}
				onInputChange={setInput}
				onSubmit={handleSubmit}
				onStop={() => setStreaming(false)}
				streaming={streaming}
				attachments={attachments}
				onRemoveAttachment={(id) =>
					setAttachments((prev) => prev.filter((a) => a.id !== id))
				}
				onAttach={() =>
					setAttachments((prev) => [
						...prev,
						{
							id: `att-${Date.now()}`,
							name: 'sample-spec.md',
							meta: '32 KB · Markdown',
							kind: 'document',
						},
					])
				}
				suggestions={SUGGESTIONS}
				onPickSuggestion={(s) =>
					setInput(typeof s.label === 'string' ? s.label : '')
				}
				onMessageRegenerate={() => {}}
				onMessageCopy={() => {}}
			/>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  2. Streaming / pending assistant message                          */
/* ------------------------------------------------------------------ */

export function Streaming() {
	const messages: AiChatMessage[] = [
		{
			id: 'u',
			role: 'user',
			authorName: 'You',
			timestamp: '15:02',
			parts: [{ type: 'text', content: 'Draft a refund email for ORD-A219.' }],
		},
		{
			id: 'a',
			role: 'assistant',
			authorName: 'Atlas',
			pending: true,
			parts: [],
		},
	];
	return (
		<div className="h-[420px]">
			<AiChat
				agent={AGENT}
				messages={messages}
				inputValue=""
				onInputChange={() => {}}
				streaming
				onStop={() => {}}
			/>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  3. Empty state                                                     */
/* ------------------------------------------------------------------ */

export function Empty() {
	const [input, setInput] = useState('');
	return (
		<div className="h-[420px]">
			<AiChat
				agent={AGENT}
				messages={[]}
				inputValue={input}
				onInputChange={setInput}
				suggestions={SUGGESTIONS}
				onPickSuggestion={(s) =>
					setInput(typeof s.label === 'string' ? s.label : '')
				}
				strings={{
					emptyTitle: 'Start a conversation',
					emptyDescription:
						'Ask Atlas about bookings, refunds, KPIs, or paste a spec to review.',
				}}
			/>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  4. Slots — custom header, intro, queue                             */
/* ------------------------------------------------------------------ */

export function WithSlots() {
	const [input, setInput] = useState('');
	const [queue, setQueue] = useState<AiChatQueueItem[]>([
		{ id: 'q1', label: 'Generate weekly KPI digest', status: 'running' },
		{ id: 'q2', label: 'Draft refund email to customer #2941', status: 'queued' },
	]);
	return (
		<div className="h-[520px]">
			<AiChat
				messages={SEED_MESSAGES.slice(0, 2)}
				inputValue={input}
				onInputChange={setInput}
				queue={queue}
				onCancelQueueItem={(id) =>
					setQueue((prev) => prev.filter((q) => q.id !== id))
				}
				slots={{
					header: (
						<div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
							<Text weight="semibold">Atlas · workspace assistant</Text>
							<Button buttonStyle="ghost" size="xs">
								Settings
							</Button>
						</div>
					),
					belowMessages: (
						<div className="border-t border-border bg-muted/30 px-4 py-2">
							<Text size="xs" type="secondary">
								Replies are generated; double-check anything before acting.
							</Text>
						</div>
					),
				}}
			/>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  5. Headless — useAiChatScroll + custom layout                     */
/* ------------------------------------------------------------------ */

export function Headless() {
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<AiChatMessage[]>(
		SEED_MESSAGES.slice(0, 2),
	);
	const { containerRef, endRef, isAtBottom, scrollToBottom } = useAiChatScroll({
		dependency: messages.length,
	});

	return (
		<div className="flex h-[520px] flex-col overflow-hidden rounded-xl border border-border bg-background">
			<div className="flex items-center justify-between border-b border-border px-4 py-2">
				<Text weight="semibold">Custom shell — built from partials</Text>
				{!isAtBottom && (
					<Button
						buttonStyle="ghost"
						size="xs"
						onClick={() => scrollToBottom()}
					>
						Jump to latest
					</Button>
				)}
			</div>
			<div
				ref={containerRef}
				className="flex-1 overflow-y-auto px-4 py-3"
			>
				{messages.length === 0 ? (
					<AiChatEmptyState
						title="Nothing yet"
						description="Send a message to begin."
					/>
				) : (
					<AiChatConversation
						messages={messages}
						renderMessage={(m) => (
							<div className="rounded-md border border-border bg-card/60 p-3">
								<Text size="xs" type="secondary">
									{m.authorName} · {m.role}
								</Text>
								{m.parts.map((part, i) =>
									part.type === 'text' ? (
										<Text key={i} className="mt-1">
											{part.content}
										</Text>
									) : null,
								)}
							</div>
						)}
						disableAutoScroll
					/>
				)}
				<div ref={endRef} />
			</div>
			<div className="border-t border-border px-4 py-3">
				<AiChatPromptInput
					value={input}
					onChange={setInput}
					onSubmit={(values) => {
						if (!values.text.trim()) return;
						setMessages((prev) => [
							...prev,
							{
								id: `u-${Date.now()}`,
								role: 'user',
								authorName: 'You',
								parts: [{ type: 'text', content: values.text }],
							},
						]);
						setInput('');
					}}
				/>
			</div>
		</div>
	);
}
```

## Example exports

- `Counter`
- `Default`
- `Streaming`
- `Empty`
- `WithSlots`
- `Headless`

