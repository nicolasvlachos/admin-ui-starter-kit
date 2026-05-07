import type { ReactNode } from 'react';
import { Container, Section } from '@/components/layout/containers';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { Badge } from '@/components/base/badge';

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

/**
 * Layout primitives expect to live inside a real page shell with bounded
 * height. The docs preview pane is unbounded, so we wrap demos in a fixed
 * viewport so `width` clamps and section rhythm read as intended.
 */
function DemoViewport({ children, height = 320 }: { children: ReactNode; height?: number }) {
	return (
		<div
			className="layout-demo-viewport relative w-full overflow-auto rounded-md border border-dashed border-border bg-background"
			style={{ height }}
		>
			{children}
		</div>
	);
}

export function NarrowContainer() {
	return (
		<DemoViewport>
			<Container as="section" width="narrow" padding="sm" innerClassName="gap-3">
				<div className="flex items-center justify-between gap-3">
					<Text weight="semibold">Narrow container</Text>
					<Badge variant="info">padding sm</Badge>
				</div>
				<SampleCard title="Centered content" detail="Useful for forms, setup flows, and readable single-column pages." />
				<SampleCard title="Comfortable reading width" detail="`max-w-7xl` keeps line lengths sensible at desktop sizes." />
			</Container>
		</DemoViewport>
	);
}

export function WideContainer() {
	return (
		<DemoViewport>
			<Container as="section" width="wide" padding="default" innerClassName="grid gap-3 md:grid-cols-3">
				<SampleCard title="Card A" detail="Dashboard pages can keep cards aligned inside a max-width shell." />
				<SampleCard title="Card B" detail="`innerClassName` controls the inner column without breaking the outer wrapper." />
				<SampleCard title="Card C" detail="Use `as` to render the right semantic element for the surface." />
			</Container>
		</DemoViewport>
	);
}

export function BareContainer() {
	return (
		<DemoViewport height={260}>
			<Container width="full" bare className="bg-card">
				<div className="grid grid-cols-4 border-b border-border px-3 py-2">
					{['Name', 'Owner', 'Status', 'Updated'].map((h) => (
						<Text key={h} size="xxs" weight="semibold" type="secondary" className="uppercase tracking-wider">{h}</Text>
					))}
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
		</DemoViewport>
	);
}

export function SectionRhythm() {
	return (
		<div className="grid gap-5 md:grid-cols-3">
			{(['tight', 'default', 'loose'] as const).map((density) => (
				<Section key={density} density={density} className="rounded-md border border-dashed border-border p-4">
					<Text weight="semibold" className="capitalize">{density}</Text>
					<SampleCard title="Block one" detail="Section controls vertical rhythm only." />
					<SampleCard title="Block two" detail="Cards and headings remain separate composition concerns." />
				</Section>
			))}
		</div>
	);
}
