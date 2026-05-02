import { Spinner } from '@/components/base/spinner';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function SpinnerPage() {
	return (
		<PreviewPage
			title="Features · Spinner"
			description="Branded loading indicator for full-section async states. Pairs with content placeholders or Suspense fallbacks."
		>
			<PreviewSection title="Default">
				<Spinner />
			</PreviewSection>

			<PreviewSection title="With label">
				<Spinner label="Loading bookings…" />
			</PreviewSection>

			<PreviewSection title="Custom colour" description="Pass any text-* class to recolour the spinner.">
				<Spinner label="Syncing inventory" className="text-success" />
			</PreviewSection>
		</PreviewPage>
	);
}
