import { Badge } from '@/components/ui/badge';
import { PreviewPage, PreviewSection, Row } from '../../PreviewLayout';

export default function UiBadgePage() {
	return (
		<PreviewPage title="UI · Badge" description="shadcn badge primitive (no theming wrapper).">
			<PreviewSection title="Variants" span="full">
				<Row>
					<Badge>default</Badge>
					<Badge variant="secondary">secondary</Badge>
					<Badge variant="destructive">destructive</Badge>
					<Badge variant="outline">outline</Badge>
				</Row>
			</PreviewSection>

			<PreviewSection title="In context">
				<Row>
					<span className="text-sm">Status: <Badge variant="secondary">draft</Badge></span>
					<span className="text-sm">Status: <Badge>live</Badge></span>
					<span className="text-sm">Status: <Badge variant="destructive">expired</Badge></span>
				</Row>
			</PreviewSection>
		</PreviewPage>
	);
}
