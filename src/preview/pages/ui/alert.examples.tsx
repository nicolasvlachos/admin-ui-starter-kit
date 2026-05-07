import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@/components/ui/alert';
import { Col } from '../../PreviewLayout';

export function Variants() {
	return (
		<>
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
		</>
	);
}

export function WithAlertAction() {
	return (
		<>
			<Alert>
								<Info />
								<AlertTitle>New version available</AlertTitle>
								<AlertDescription>Reload the page to update.</AlertDescription>
								<AlertAction>
									<button className="text-xs font-medium text-primary underline-offset-4 hover:underline">Reload</button>
								</AlertAction>
							</Alert>
		</>
	);
}

export function TitleOnly() {
	return (
		<>
			<Alert variant="success">
								<CheckCircle />
								<AlertTitle>Saved successfully.</AlertTitle>
							</Alert>
		</>
	);
}
