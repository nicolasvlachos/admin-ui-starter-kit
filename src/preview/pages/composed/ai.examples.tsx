import { AiSummaryBlock, AiClassificationPanel } from '@/components/composed/ai';

export function AISummary() {
	return (
		<>
			<AiSummaryBlock
								data={{
									summary: 'Customer requested a birthday experience booking for two adults near Los Angeles, preferring a weekend slot in early April.',
									entities: ['Birthday', 'Outdoor', 'Los Angeles', '2 Adults'],
									confidence: 'high',
									model: 'Claude 3.5 Sonnet',
									generatedAt: 'Mar 27, 2026 — 14:32',
									onRegenerate: () => {},
								}}
							/>
		</>
	);
}

export function AIClassification() {
	return (
		<>
			<AiClassificationPanel
								data={{
									requestType: 'Product Inquiry',
									urgency: 'Medium',
									urgencyVariant: 'warning',
									tone: 'Professional',
									toneVariant: 'info',
									flags: ['Gift Purchase', 'Wellness'],
									complexityScore: 3,
									suggestedAction: 'Auto-respond',
									summary: 'Standard product inquiry for a spa gift package.',
									confidence: 0.92,
									model: 'Claude 3.5 Sonnet',
								}}
							/>
		</>
	);
}
