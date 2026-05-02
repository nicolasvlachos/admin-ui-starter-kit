import { Progress } from '@/components/ui/progress';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function ProgressPage() {
	return (
		<PreviewPage title="UI · Progress" description="Linear progress bar at varying values.">
			<PreviewSection title="Values" span="full">
				<Col>
					{[0, 25, 50, 75, 100].map((v) => (
						<div key={v} className="space-y-1">
							<div className="text-xs text-muted-foreground">{v}%</div>
							<Progress value={v} />
						</div>
					))}
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
