// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Row } from '../../PreviewLayout';

export function Variants() {
	return (
		<>
			<Row>
								<Badge>default</Badge>
								<Badge variant="secondary">secondary</Badge>
								<Badge variant="destructive">destructive</Badge>
								<Badge variant="outline">outline</Badge>
							</Row>
		</>
	);
}

export function InContext() {
	return (
		<>
			<Row>
								<span className="text-sm">Status: <Badge variant="secondary">draft</Badge></span>
								<span className="text-sm">Status: <Badge>live</Badge></span>
								<span className="text-sm">Status: <Badge variant="destructive">expired</Badge></span>
							</Row>
		</>
	);
}
