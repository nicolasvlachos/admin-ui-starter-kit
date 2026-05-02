import { Toaster } from '@/components/base/toaster';
import { Copyable } from '@/components/base/copyable';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function CopyablePage() {
	return (
		<PreviewPage title="Base · Copyable" description="Click-to-copy span with toast feedback.">
			<Toaster />

			<PreviewSection title="Default">
				<Copyable value="GCT-A4B7-C9E2" />
			</PreviewSection>

			<PreviewSection title="Mono + truncate">
				<Copyable value="b3a8a5b6-9b0a-4f01-8b46-92aa1d6a1f7d" mono truncate />
			</PreviewSection>

			<PreviewSection title="With custom display">
				<Copyable value="hello@example.com" displayValue={<span className="text-primary underline">hello@example.com</span>} />
			</PreviewSection>

			<PreviewSection title="Custom toast message">
				<Col>
					<Copyable value="42" successMessage="The answer was copied!" />
					<div className="text-xs text-muted-foreground">Click to see the toast.</div>
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
