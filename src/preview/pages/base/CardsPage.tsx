import { Sparkles, Plus, Pencil, Trash2, Check, MoreVertical } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { SmartCard, SmartCardSkeleton } from '@/components/base/cards';
import { Avatar } from '@/components/ui/avatar';
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

			<PreviewSection title="headerDivider + footerSlot + footerDivider — three-band layout">
				<SmartCard
					className="max-w-sm"
					headerDivider
					footerDivider
					headerStart={
						<Badge variant="secondary">
							<Check className="size-3" /> Live
						</Badge>
					}
					headerEnd={
						<Button variant="secondary" buttonStyle="ghost" aria-label="More options">
							<MoreVertical className="size-4" />
						</Button>
					}
					title="Integration name"
					titleSuffix={<Badge variant="success">Installed</Badge>}
					description="Short description of the integration and what it does in one line."
					footerSlot={
						<Button variant="secondary" className="w-full justify-center">
							Open
						</Button>
					}
				>
					<div className="flex items-center -space-x-1.5 pt-2">
						{['SC', 'MR', 'EW'].map((init) => (
							<Avatar
								key={init}
								className="size-6 border border-background bg-muted text-[11px] font-medium text-muted-foreground inline-flex items-center justify-center"
							>
								{init}
							</Avatar>
						))}
						<span className="ml-1 inline-flex size-6 items-center justify-center rounded-full border border-background bg-muted text-[10px] text-muted-foreground">
							+3
						</span>
					</div>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Expandable — uncontrolled">
				<SmartCard
					className="max-w-md"
					expandable
					title="3 days remaining in cycle"
					headerEnd={
						<Button variant="secondary" buttonStyle="ghost">
							Billing
						</Button>
					}
				>
					<div className="space-y-5">
						<div className="rounded-lg bg-muted/60 p-4 space-y-2">
							<div className="flex justify-between text-xs text-muted-foreground font-medium">
								<span>Included credit</span>
								<span>On-demand charges</span>
							</div>
							<div className="flex justify-between font-semibold">
								<span>$18.08 / $20</span>
								<span>$0</span>
							</div>
						</div>
						<dl className="grid gap-3 text-sm">
							{[
								['Requests', '$210.84'],
								['Active CPU', '$21.95'],
								['Events', '$21.20'],
								['Storage usage', '$20.45'],
								['Bandwidth', '$0.00'],
							].map(([k, v]) => (
								<div key={k} className="flex justify-between">
									<Text tag="span" weight="medium">{k}</Text>
									<Text tag="span" type="secondary">{v}</Text>
								</div>
							))}
						</dl>
					</div>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Expandable — custom collapsed height + localized labels">
				<SmartCard
					className="max-w-md"
					expandable={{ collapsedMaxHeight: '6rem' }}
					title="Release notes — v0.4.2"
					strings={{ expandLabel: 'Show full notes', collapseLabel: 'Hide details' }}
				>
					<Text type="secondary" className="leading-relaxed">
						Tightened the admin density tokens, added the new
						<code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">expandable</code>
						and <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">headerDivider</code>
						flags on SmartCard, and aligned the empty-state primitive with the
						sibling features. See the changelog for the full story.
					</Text>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Skeleton">
				<SmartCardSkeleton />
			</PreviewSection>
		</PreviewPage>
	);
}
