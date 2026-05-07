import { useState } from 'react';
import { BarChart3, Database, FileText, MessageSquare, Search } from 'lucide-react';
import {
	AiCitation,
	AiConfidenceCard,
	AiFeedback,
	AiMessageBubble,
	AiPromptSuggestions,
	AiTokenUsageCard,
	AiToolCall,
	type AiFeedbackVote,
} from '@/components/composed/ai';

export function AiConfidenceCardExample() {
	return (
		<>
			<AiConfidenceCard
								score={0.84}
								model="Claude 4.7"
								factors={[
									{ label: 'Source quality', score: 0.92 },
									{ label: 'Context coverage', score: 0.78 },
									{ label: 'Prompt specificity', score: 0.81 },
								]}
							/>
		</>
	);
}

export function AiPromptSuggestionsExample() {
	return (
		<>
			<AiPromptSuggestions
								suggestions={[
									{ id: 'kpi', label: 'Summarise this month KPIs', description: 'Get a digest of revenue, orders, refunds.', icon: BarChart3 },
									{ id: 'invoice', label: 'Draft an overdue reminder', description: 'Polite + firm copy for unpaid invoices.', icon: FileText },
									{ id: 'lookup', label: 'Find similar customers', description: 'Pattern-match by spend and category.', icon: Search },
									{ id: 'help', label: 'Answer a refund question', description: 'Explain refund policy in plain English.', icon: MessageSquare },
								]}
								onPick={() => {}}
							/>
		</>
	);
}

export function AiTokenUsageCardExample() {
	return (
		<>
			<AiTokenUsageCard
								model="Claude 4.7"
								inputTokens={3240}
								outputTokens={812}
								cost="$0.082"
								maxTokens={20000}
							/>
		</>
	);
}

export function AiMessageBubbleExample() {
	return (
		<>
			<div className="flex flex-col gap-3">
								<AiMessageBubble
									role="user"
									authorName="You"
									timestamp="14:31"
								>
									Can you summarise yesterday's bookings and flag anything unusual?
								</AiMessageBubble>
								<AiMessageBubble
									role="assistant"
									authorName="Claude 4.7"
									timestamp="14:31"
									plainText="You had 23 bookings yesterday totalling 4,820 USD. Two refunds were processed (one for a cancellation, one duplicate). The Spa package saw 2× the usual demand."
									onRegenerate={() => {}}
								>
									You had 23 bookings yesterday totalling 4,820 USD. Two refunds were processed
									(one for a cancellation, one duplicate). The Spa package saw 2× the usual
									demand.
								</AiMessageBubble>
							</div>
		</>
	);
}

export function AiToolCallExample() {
	return (
		<>
			<div className="flex flex-col gap-2">
								<AiToolCall
									name="search_bookings"
									status="success"
									durationMs={420}
									args="{ from: '2026-04-01', to: '2026-04-28', status: 'paid' }"
									result="[ { id: 'B-1402', amount: 250.00, … }, …42 more ]"
								/>
								<AiToolCall
									name="fetch_customer"
									status="running"
									durationMs={120}
									icon={Database}
								/>
								<AiToolCall
									name="send_email"
									status="error"
									durationMs={2150}
									args="{ to: 'maria@example.com', subject: '…' }"
									error="SMTP timeout after 2.0s. Retry suggested."
								/>
							</div>
		</>
	);
}

export function AiCitationExample() {
	return (
		<>
			<AiCitation
								defaultExpanded
								sources={[
									{
										id: 's1',
										title: 'Refund policy — Q2 2026 update',
										url: 'https://example.com/refund-policy',
										snippet:
											'Refunds for bookings cancelled at least 48 hours in advance are processed within 5 business days.',
										publisher: 'Internal Wiki',
										publishedAt: 'Apr 12, 2026',
										relevance: 0.93,
									},
									{
										id: 's2',
										title: 'Customer service playbook',
										url: 'https://example.com/playbook',
										snippet:
											'When a customer disputes a charge, acknowledge first, then check the booking record.',
										publisher: 'Operations',
										publishedAt: 'Mar 30, 2026',
										relevance: 0.78,
									},
									{
										id: 's3',
										title: 'Bookings API reference',
										url: 'https://example.com/api/bookings',
										snippet: 'GET /bookings/{id} returns the full booking record including refund history.',
										publisher: 'Engineering Docs',
										publishedAt: 'Feb 18, 2026',
										relevance: 0.55,
									},
								]}
							/>
		</>
	);
}

export function AiFeedbackExample() {
	const [vote, setVote] = useState<AiFeedbackVote>(null);
	return (
		<>
			<div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
								<AiFeedback value={vote} onVote={setVote} />
							</div>
		</>
	);
}
