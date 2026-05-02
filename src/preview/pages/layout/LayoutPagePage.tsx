import { Plus, RefreshCw, Trash2 } from 'lucide-react';

import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { Page, PageActions, PageContent, PageHeader, type PageAction } from '@/components/layout/page';
import type { LayoutLinkRenderProps } from '@/components/layout';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

const actions: PageAction[] = [
	{ id: 'new', label: 'New customer', icon: Plus, variant: 'primary', href: '#/customers/new', placement: 'inline' },
	{ id: 'sync', label: 'Sync records', icon: RefreshCw, group: 'Data', placement: 'menu' },
	{ id: 'delete', label: 'Delete saved view', icon: Trash2, variant: 'destructive', group: 'Danger', placement: 'menu' },
];

const queue = [
	{ label: 'Open invoices', value: '24', detail: '8 need manual review' },
	{ label: 'Active customers', value: '1,284', detail: '+4.8% this month' },
	{ label: 'Draft contracts', value: '16', detail: '3 waiting on finance' },
];

function renderPreviewLink({ href, children, className, target, rel }: LayoutLinkRenderProps) {
	return <a href={href ?? '#'} className={className} target={target} rel={rel}>{children}</a>;
}

function CustomerOverview() {
	return (
		<div className="space-y-4">
			<div className="grid gap-3 md:grid-cols-3">
				{queue.map((item) => (
					<SmartCard key={item.label} padding="sm" className="border-border/80 shadow-sm">
						<div className="space-y-1">
							<Text size="xs" type="secondary">{item.label}</Text>
							<Text weight="semibold">{item.value}</Text>
							<Text size="xs" type="secondary">{item.detail}</Text>
						</div>
					</SmartCard>
				))}
			</div>

			<SmartCard padding="sm" className="border-border/80 shadow-sm">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="space-y-1">
						<Text weight="semibold">Review queue</Text>
						<Text size="xs" type="secondary">A compact body area that stays owned by the consuming app.</Text>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="warning">8 urgent</Badge>
						<Badge variant="info">12 assigned</Badge>
						<Button variant="secondary">Open queue</Button>
					</div>
				</div>
			</SmartCard>
		</div>
	);
}

export default function LayoutPagePage() {
	return (
		<PreviewPage title="Layout · Page" description="Page shell, header partials, actions, and content regions with framework-neutral links.">
			<PreviewSection title="Production page shell" span="full">
				<div className="rounded-2xl border border-border bg-background p-3">
					<Page
						width="full"
						renderLink={renderPreviewLink}
						className="min-h-[34rem] overflow-hidden rounded-xl border border-border bg-background shadow-sm"
						bodyClassName="space-y-4"
						header={{
							title: 'Customers',
							description: 'Manage accounts, contacts, lifecycle state, and billing risk from one focused workspace.',
							headingTag: 'h2',
							backHref: '#/base/navigation',
							titleBadges: [{ label: 'Live', variant: 'success' }],
							actions: <PageActions actions={actions} display="auto" renderLink={renderPreviewLink} />,
							actionsClassName: 'pt-1',
						}}
					>
						<CustomerOverview />
					</Page>
				</div>
			</PreviewSection>

			<PreviewSection title="Composable partials" span="full">
				<div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
					<div className="rounded-xl border border-border bg-background p-5 shadow-sm">
						<PageHeader
							title="Invoice review"
							description="Use PageHeader directly when an app already owns the surrounding shell."
							headingTag="h4"
							titleBadges={[{ label: '42 queued', variant: 'info' }, { label: '3 overdue', variant: 'warning' }]}
							actions={<PageActions actions={actions} display="flat" renderLink={renderPreviewLink} />}
							renderLink={renderPreviewLink}
						/>
					</div>

					<PageContent maxWidth="full" className="rounded-xl border border-border bg-background p-5 shadow-sm">
						<div className="space-y-2">
							<Text weight="semibold">Standalone main region</Text>
							<Text size="xs" type="secondary">PageContent supplies body padding and width clamps when Header and Sidebar are composed manually.</Text>
							<Button variant="secondary">Open content</Button>
						</div>
					</PageContent>
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
