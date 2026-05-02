import { Container, Section } from '@/components/layout/containers';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { Badge } from '@/components/base/badge';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

function SampleCard({ title, detail }: { title: string; detail: string }) {
	return (
		<SmartCard padding="sm" className="border-dashed">
			<div className="space-y-1">
				<Text weight="semibold">{title}</Text>
				<Text size="xs" type="secondary">{detail}</Text>
			</div>
		</SmartCard>
	);
}

export default function LayoutContainersPage() {
	return (
		<PreviewPage
			title="Layout · Containers"
			description="Container and Section primitives for page structure, width clamps, padding density, and semantic wrappers."
		>
			<PreviewSection title="Width + padding presets" span="full">
				<Col>
					<Container as="section" width="narrow" padding="sm" className="min-h-0 rounded-xl border border-border bg-muted/30" innerClassName="gap-3">
						<div className="flex items-center justify-between gap-3">
							<Text weight="semibold">Narrow container</Text>
							<Badge variant="info">padding sm</Badge>
						</div>
						<SampleCard title="Centered content" detail="Useful for forms, setup flows, and readable single-column pages." />
					</Container>

					<Container as="section" width="wide" padding="default" className="min-h-0 rounded-xl border border-border bg-muted/30" innerClassName="grid gap-3 md:grid-cols-3">
						<SampleCard title="Wide content" detail="Dashboard pages can keep cards aligned inside a max-width shell." />
						<SampleCard title="Inner class seam" detail="Consumers can control the inner column without breaking outer layout behavior." />
						<SampleCard title="Semantic element" detail="Use as main, section, or div depending on the app shell." />
					</Container>
				</Col>
			</PreviewSection>

			<PreviewSection title="Bare container" span="full" description="Use bare mode for edge-to-edge children such as tables or virtual lists.">
				<Container width="full" bare className="min-h-0 rounded-xl border border-border bg-card">
					<div className="grid grid-cols-4 border-b border-border px-3 py-2">
						<Text size="xxs" weight="semibold" type="secondary" className="uppercase tracking-wider">Name</Text>
						<Text size="xxs" weight="semibold" type="secondary" className="uppercase tracking-wider">Owner</Text>
						<Text size="xxs" weight="semibold" type="secondary" className="uppercase tracking-wider">Status</Text>
						<Text size="xxs" weight="semibold" type="secondary" className="uppercase tracking-wider">Updated</Text>
					</div>
					{['Billing portal', 'Customer records', 'Sync monitor'].map((name, index) => (
						<div key={name} className="grid grid-cols-4 px-3 py-2">
							<Text weight="medium">{name}</Text>
							<Text type="secondary">Operations</Text>
							<Badge variant={index === 2 ? 'warning' : 'success'}>{index === 2 ? 'Review' : 'Healthy'}</Badge>
							<Text size="xs" type="secondary">Today</Text>
						</div>
					))}
				</Container>
			</PreviewSection>

			<PreviewSection title="Section rhythm" span="full">
				<div className="grid gap-5 md:grid-cols-3">
					{(['tight', 'default', 'loose'] as const).map((density) => (
						<Section key={density} density={density} className="rounded-xl border border-border bg-muted/20 p-4">
							<Text weight="semibold">{density}</Text>
							<SampleCard title="Block one" detail="Section controls vertical rhythm only." />
							<SampleCard title="Block two" detail="Cards and headings remain separate composition concerns." />
						</Section>
					))}
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
