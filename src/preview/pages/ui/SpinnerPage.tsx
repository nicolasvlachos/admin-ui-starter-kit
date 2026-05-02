import { Spinner } from '@/components/ui/spinner';
import { PreviewPage, PreviewSection, Row } from '../../PreviewLayout';

export default function SpinnerPage() {
	return (
		<PreviewPage title="UI · Spinner" description="Loading spinner — sized via className.">
			<PreviewSection title="Sizes">
				<Row>
					<Spinner className="size-3" />
					<Spinner className="size-4" />
					<Spinner className="size-5" />
					<Spinner className="size-6" />
					<Spinner className="size-8" />
				</Row>
			</PreviewSection>

			<PreviewSection title="Color via className">
				<Row>
					<Spinner className="size-5 text-primary" />
					<Spinner className="size-5 text-destructive" />
					<Spinner className="size-5 text-chart-2" />
					<Spinner className="size-5 text-muted-foreground" />
				</Row>
			</PreviewSection>
		</PreviewPage>
	);
}
