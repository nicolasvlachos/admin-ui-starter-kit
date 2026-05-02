import { Badge, type ComposedBadgeVariant } from '@/components/base/badge';
import { PreviewPage, PreviewSection, Row } from '../../PreviewLayout';

const VARIANTS: ComposedBadgeVariant[] = [
	'primary', 'secondary', 'success', 'info', 'warning', 'error', 'destructive', 'main',
];
const SIZES = ['xs', 'sm', 'md'] as const;

export default function BadgePage() {
	return (
		<PreviewPage title="Badge" description="Composed Badge — variants, sizes, dot, important.">
			<PreviewSection title="Variants" span="full">
				<Row>
					{VARIANTS.map((v) => (
						<Badge key={v} variant={v}>{v}</Badge>
					))}
				</Row>
			</PreviewSection>

			<PreviewSection title="Sizes">
				<Row>
					{SIZES.map((s) => (
						<Badge key={s} size={s}>size={s}</Badge>
					))}
				</Row>
			</PreviewSection>

			<PreviewSection title="With dot">
				<Row>
					{VARIANTS.map((v) => (
						<Badge key={v} variant={v} dot>{v}</Badge>
					))}
				</Row>
			</PreviewSection>

			<PreviewSection title="Pulsing & pending dot">
				<Row>
					<Badge variant="success" dot pulse>Live</Badge>
					<Badge variant="warning" dot pending>Pending</Badge>
					<Badge variant="info" dot pulse pending>Pending pulse</Badge>
				</Row>
			</PreviewSection>

			<PreviewSection title="Important">
				<Row>
					<Badge variant="warning" important>Attention</Badge>
					<Badge variant="error" important>Critical</Badge>
				</Row>
			</PreviewSection>

			<PreviewSection title="Inline">
				<p className="text-sm">
					Some inline copy with a <Badge inline variant="primary">new</Badge> badge and a <Badge inline variant="success">live</Badge> indicator.
				</p>
			</PreviewSection>
		</PreviewPage>
	);
}
