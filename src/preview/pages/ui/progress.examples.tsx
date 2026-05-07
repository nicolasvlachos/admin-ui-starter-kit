import { Progress } from '@/components/ui/progress';
import { Col } from '../../PreviewLayout';

export function Values() {
	return (
		<>
			<Col>
								{[0, 25, 50, 75, 100].map((v) => (
									<div key={v} className="space-y-1">
										<div className="text-xs text-muted-foreground">{v}%</div>
										<Progress value={v} />
									</div>
								))}
							</Col>
		</>
	);
}
