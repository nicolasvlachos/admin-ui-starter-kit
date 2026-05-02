import { Sparkles, Plus, Pencil, Trash2 } from 'lucide-react';
import { SmartCard, SmartCardSkeleton } from '@/components/base/cards';
import Text from '@/components/typography/text';
import { Badge } from '@/components/base/badge';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function CardsPage() {
	return (
		<PreviewPage title="Cards" description="SmartCard — composed card with header, actions, alert, footer.">
			<PreviewSection title="Basic">
				<SmartCard title="Simple card" description="Just a title and a description.">
					<Text>Card content goes here.</Text>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="With icon, tooltip & footer">
				<SmartCard
					icon={<Sparkles className="size-4" />}
					title="Insights"
					titleSuffix={<Badge variant="success">New</Badge>}
					description="High-level summary of recent activity."
					tooltip="Updated every 15 minutes"
					footerText="Last refreshed 2 minutes ago"
				>
					<Text>Lorem ipsum dolor sit amet.</Text>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="With actions">
				<SmartCard
					title="Order #ORD-2026-0412"
					description="Sarah Smitha — 2,450 USD"
					actions={[
						{ id: 'edit', label: 'Edit', icon: <Pencil className="size-3.5" />, onClick: () => {} },
						{ id: 'delete', label: 'Delete', icon: <Trash2 className="size-3.5" />, onClick: () => {} },
					]}
					headerEnd={<Badge variant="info" size="sm">Pending</Badge>}
				>
					<Text type="secondary">3 vouchers — wellness, food, adventure.</Text>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="With alert (default / warning / destructive)" span="full">
				<Col>
					<SmartCard title="Default alert" alert="An informational message about this card.">
						<Text>Body content.</Text>
					</SmartCard>
					<SmartCard title="Warning" alertVariant="warning" alert="Heads up — something might need attention.">
						<Text>Body content.</Text>
					</SmartCard>
					<SmartCard title="Destructive" alertVariant="destructive" alert="This action cannot be undone.">
						<Text>Body content.</Text>
					</SmartCard>
				</Col>
			</PreviewSection>

			<PreviewSection title="Padding sizes" span="full">
				<Col>
					{(['sm', 'base', 'lg'] as const).map((p) => (
						<SmartCard key={p} title={`padding="${p}"`} padding={p}>
							<Text>Card body with {p} padding.</Text>
						</SmartCard>
					))}
				</Col>
			</PreviewSection>

			<PreviewSection title="Transparent">
				<SmartCard transparent title="Transparent" description="No background.">
					<Text>Useful when nesting.</Text>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Header slots">
				<SmartCard
					title="Header composition"
					headerStart={<Badge variant="primary">Start</Badge>}
					headerEnd={<Badge variant="secondary">End</Badge>}
					headerAction={<Plus className="size-4 text-muted-foreground" />}
				>
					<Text>headerStart, headerEnd & headerAction.</Text>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Skeleton">
				<SmartCardSkeleton />
			</PreviewSection>
		</PreviewPage>
	);
}
