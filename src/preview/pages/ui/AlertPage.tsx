import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@/components/ui/alert';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function AlertPage() {
	return (
		<PreviewPage title="UI · Alert" description="shadcn alert primitive: variants, with title/description/action.">
			<PreviewSection title="Variants" span="full">
				<Col>
					<Alert>
						<Info />
						<AlertTitle>Default</AlertTitle>
						<AlertDescription>This is a default informational alert.</AlertDescription>
					</Alert>
					<Alert variant="success">
						<CheckCircle />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>Your changes have been saved.</AlertDescription>
					</Alert>
					<Alert variant="warning">
						<AlertTriangle />
						<AlertTitle>Warning</AlertTitle>
						<AlertDescription>Be careful with this action.</AlertDescription>
					</Alert>
					<Alert variant="destructive">
						<XCircle />
						<AlertTitle>Destructive</AlertTitle>
						<AlertDescription>This cannot be undone.</AlertDescription>
					</Alert>
				</Col>
			</PreviewSection>

			<PreviewSection title="With AlertAction">
				<Alert>
					<Info />
					<AlertTitle>New version available</AlertTitle>
					<AlertDescription>Reload the page to update.</AlertDescription>
					<AlertAction>
						<button className="text-xs font-medium text-primary underline-offset-4 hover:underline">Reload</button>
					</AlertAction>
				</Alert>
			</PreviewSection>

			<PreviewSection title="Title only">
				<Alert variant="success">
					<CheckCircle />
					<AlertTitle>Saved successfully.</AlertTitle>
				</Alert>
			</PreviewSection>
		</PreviewPage>
	);
}
