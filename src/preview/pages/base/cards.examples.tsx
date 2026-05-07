import { ArrowUpRight, BellRing, CreditCard, MoreVertical, Pencil, Plus, Sparkles, Trash2, Check, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import {
	SmartCard,
	SmartCardSkeleton,
	CardShell,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/base/cards';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/base/badge';

export function Default() {
	return (
		<SmartCard className="w-full max-w-md" title="Simple card" description="Just a title and a description.">
			<Text>Card content goes here.</Text>
		</SmartCard>
	);
}

export function WithIconTooltipFooter() {
	return (
		<SmartCard
			className="w-full max-w-md"
			icon={<Sparkles className="size-4" />}
			title="Insights"
			titleSuffix={<Badge variant="success">New</Badge>}
			description="High-level summary of recent activity."
			tooltip="Updated every 15 minutes"
			footerText="Last refreshed 2 minutes ago"
		>
			<Text>Lorem ipsum dolor sit amet.</Text>
		</SmartCard>
	);
}

export function WithActions() {
	return (
		<SmartCard
			className="w-full max-w-md"
			title="Order #ORD-2026-0412"
			description="Sarah Smith — 2,450 USD"
			actions={[
				{ id: 'edit', label: 'Edit', icon: <Pencil className="size-3.5" />, onClick: () => {} },
				{ id: 'delete', label: 'Delete', icon: <Trash2 className="size-3.5" />, onClick: () => {} },
			]}
			headerEnd={<Badge variant="info" size="sm">Pending</Badge>}
		>
			<Text type="secondary">3 vouchers — wellness, food, adventure.</Text>
		</SmartCard>
	);
}

export function AlertVariants() {
	return (
		<div className="grid w-full max-w-md gap-3">
			<SmartCard title="Default alert" alert="An informational message.">
				<Text>Body content.</Text>
			</SmartCard>
			<SmartCard title="Info" alertVariant="info" alert="Heads up — info-style.">
				<Text>Body content.</Text>
			</SmartCard>
			<SmartCard title="Warning" alertVariant="warning" alert="Heads up — warning.">
				<Text>Body content.</Text>
			</SmartCard>
			<SmartCard title="Success" alertVariant="success" alert="All systems go.">
				<Text>Body content.</Text>
			</SmartCard>
			<SmartCard title="Destructive" alertVariant="destructive" alert="This action cannot be undone.">
				<Text>Body content.</Text>
			</SmartCard>
		</div>
	);
}

export function PaddingSizes() {
	return (
		<div className="grid w-full max-w-md gap-3">
			{(['sm', 'base', 'lg'] as const).map((p) => (
				<SmartCard key={p} title={`padding="${p}"`} padding={p}>
					<Text>Card body with {p} padding.</Text>
				</SmartCard>
			))}
		</div>
	);
}

export function SurfaceVariants() {
	return (
		<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
			<SmartCard surface="card" title="Card (default)" description="Bordered + soft shadow.">
				<Text type="secondary">Canonical card chrome.</Text>
			</SmartCard>
			<SmartCard surface="flat" title="Flat" description="No border, no shadow.">
				<Text type="secondary">Use when nesting inside another surface.</Text>
			</SmartCard>
			<SmartCard surface="framed" title="Framed" description="Matted polaroid look.">
				<Text type="secondary">5px outer border + 1px hairline inner.</Text>
			</SmartCard>
		</div>
	);
}

export function HeaderSlots() {
	return (
		<SmartCard
			className="w-full max-w-md"
			title="Header composition"
			headerStart={<Badge variant="primary">Start</Badge>}
			headerEnd={<Badge variant="secondary">End</Badge>}
			headerAction={<Plus className="size-4 text-muted-foreground" />}
		>
			<Text>headerStart, headerEnd & headerAction.</Text>
		</SmartCard>
	);
}

export function HeaderAndFooterDividers() {
	return (
		<SmartCard
			className="w-full max-w-sm"
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
			description="Short description of the integration in one line."
			footerSlot={
				<Button variant="secondary" className="w-full justify-center">
					Open
				</Button>
			}
		>
			<div className="flex items-center -space-x-2 pt-2">
				{['SC', 'MR', 'EW'].map((init) => (
					<Avatar key={init} className="ring-2 ring-background">
						<AvatarFallback>{init}</AvatarFallback>
					</Avatar>
				))}
				<span className="ml-2 inline-flex size-6 items-center justify-center rounded-full border border-background bg-muted text-xs text-muted-foreground">
					+3
				</span>
			</div>
		</SmartCard>
	);
}

export function ExpandableUncontrolled() {
	return (
		<SmartCard
			className="w-full max-w-md"
			expandable
			title="3 days remaining in cycle"
			headerEnd={<Button variant="secondary" buttonStyle="ghost">Billing</Button>}
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
	);
}

export function ExpandableCustomLabels() {
	return (
		<SmartCard
			className="w-full max-w-md"
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
	);
}

export function Skeleton() {
	return (
		<div className="w-full max-w-md">
			<SmartCardSkeleton />
		</div>
	);
}

export function MetricKPICard() {
	return (
		<SmartCard
			className="w-full max-w-xs"
			icon={<TrendingUp className="size-4" />}
			title="Monthly revenue"
			headerEnd={<Badge variant="success">+12.4%</Badge>}
			footerText="Updated 5 minutes ago"
		>
			<div className="space-y-1">
				<Text size="xl" weight="semibold" lineHeight="none" className="text-3xl tabular-nums">
					$48,290
				</Text>
				<Text size="xs" type="secondary">vs. $42,950 last month</Text>
			</div>
		</SmartCard>
	);
}

export function NotificationCard() {
	return (
		<SmartCard
			className="w-full max-w-md"
			icon={<BellRing className="size-4" />}
			title="Backup ready to restore"
			alert="A snapshot from 12 minutes ago is available."
			alertVariant="info"
			footerSlot={
				<div className="flex justify-end gap-2">
					<Button variant="secondary" buttonStyle="ghost">Dismiss</Button>
					<Button variant="primary">Restore</Button>
				</div>
			}
		>
			<Text type="secondary">
				Restoring will replace the current state with the snapshot. This action
				can be undone within 24 hours.
			</Text>
		</SmartCard>
	);
}

export function PrimitiveComposition() {
	return (
		<CardShell className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Primitive composition</CardTitle>
				<CardDescription>
					When `SmartCard` is too opinionated, drop down to the exported primitive
					parts and assemble the chrome yourself.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Text type="secondary">
					`CardShell`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`,
					and `CardFooter` are all exported from `base/cards` for advanced layouts.
				</Text>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button variant="secondary" buttonStyle="ghost">Cancel</Button>
				<Button variant="primary">Save</Button>
			</CardFooter>
		</CardShell>
	);
}

export function StatRowClickable() {
	return (
		<div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
			<SmartCard
				icon={<Users className="size-4" />}
				title="Active customers"
				headerEnd={<ArrowUpRight className="size-4 text-muted-foreground" />}
				className="cursor-pointer transition-colors hover:bg-muted/40"
			>
				<Text size="xl" weight="semibold" className="tabular-nums">2,194</Text>
			</SmartCard>
			<SmartCard
				icon={<CreditCard className="size-4" />}
				title="Pending invoices"
				headerEnd={<ArrowUpRight className="size-4 text-muted-foreground" />}
				className="cursor-pointer transition-colors hover:bg-muted/40"
			>
				<Text size="xl" weight="semibold" className="tabular-nums">$12,840</Text>
			</SmartCard>
			<SmartCard
				icon={<Sparkles className="size-4" />}
				title="New signups"
				headerEnd={<ArrowUpRight className="size-4 text-muted-foreground" />}
				className="cursor-pointer transition-colors hover:bg-muted/40"
			>
				<Text size="xl" weight="semibold" className="tabular-nums">87</Text>
			</SmartCard>
		</div>
	);
}
