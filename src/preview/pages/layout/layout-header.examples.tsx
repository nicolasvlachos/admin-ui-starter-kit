import { Bell, CheckCircle2, CircleAlert, Settings } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Separator } from '@/components/base/display/separator';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import {
	Header,
	HeaderBreadcrumbs,
	HeaderNotifications,
	HeaderSearch,
	HeaderUserMenu,
	type HeaderNotification,
} from '@/components/layout/header';
import { PageHeader } from '@/components/layout/page';
import type { LayoutLinkRenderProps, LayoutUser } from '@/components/layout';
import { SidebarProvider } from '@/components/layout/sidebar';

const user: LayoutUser = {
	name: 'Nicolas Vlachos',
	email: 'nicolas@example.com',
	avatar: 'https://i.pravatar.cc/96?img=11',
};

const notifications: HeaderNotification[] = [
	{
		id: 'sync',
		title: 'Catalog sync completed',
		description: '248 products updated across two markets.',
		time: '2 min ago',
		tone: 'success',
		href: '#/features/activities',
		read: false,
	},
	{
		id: 'risk',
		title: 'Payment risk changed',
		description: 'Three invoices moved to manual review.',
		time: '18 min ago',
		tone: 'warning',
		read: false,
	},
];

function renderPreviewLink({ href, children, className, target, rel }: LayoutLinkRenderProps) {
	return <a href={href ?? '#'} className={className} target={target} rel={rel}>{children}</a>;
}

export function AppHeaderComposition() {
	return (
		<>
			<SidebarProvider className="min-h-0">
								<div className="w-full overflow-hidden rounded-2xl border border-border bg-background p-3">
									<div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
										<Header
											renderLink={renderPreviewLink}
											breadcrumbs={[{ label: 'Operations', href: '#/features/activities' }, { label: 'Orders' }]}
											centerClassName="w-[32rem] max-w-[40vw]"
											slots={{
												center: <HeaderSearch className="w-full" onOpen={() => {}} />,
												right: (
													<>
														<HeaderNotifications notifications={notifications} unreadCount={2} viewAllHref="#/features/activities" renderLink={renderPreviewLink} />
														<Separator orientation="vertical" className="h-7" />
														<HeaderUserMenu
															user={user}
															showEmail={false}
															onProfile={() => {}}
															onSettings={() => {}}
															onLogout={() => {}}
														/>
													</>
												),
											}}
										/>
										<div className="space-y-5 p-5">
											<PageHeader
												title="Pending orders"
												description="The sidebar controls navigation only; the app owns routing and page content."
												headingTag="h3"
												titleBadges={[{ label: '8 pending', variant: 'warning' }]}
											/>
											<div className="grid gap-3 md:grid-cols-3">
												{[
													['Manual review', '8'],
													['Awaiting stock', '12'],
													['Ready to fulfill', '36'],
												].map(([label, value, detail]) => (
													<SmartCard key={label} padding="sm" className="shadow-sm">
														<Text size="xs" type="secondary">{label}</Text>
														<Text weight="semibold">{value}</Text>
														{!!detail && <Text size="xs" type="secondary">{detail}</Text>}
													</SmartCard>
												))}
											</div>
										</div>
									</div>
								</div>
							</SidebarProvider>
		</>
	);
}

export function HeaderPartials() {
	return (
		<>
			<SidebarProvider className="min-h-0">
								<div className="grid w-full gap-4 lg:grid-cols-2">
									<SmartCard padding="sm">
										<Text weight="semibold" className="mb-3">Breadcrumbs</Text>
										<div className="h-10 rounded-lg border border-border bg-background px-3">
											<HeaderBreadcrumbs
												showSidebarTrigger
												homeBreadcrumb={{ label: 'Admin', href: '#/admin' }}
												renderLink={renderPreviewLink}
												breadcrumbs={[{ label: 'Customers', href: '#/customers' }, { label: 'Sarah Smitha' }]}
											/>
										</div>
									</SmartCard>

									<SmartCard padding="sm">
										<Text weight="semibold" className="mb-3">Search</Text>
										<HeaderSearch className="w-full" strings={{ placeholder: 'Search customers, invoices, comments...' }} />
									</SmartCard>

									<SmartCard padding="sm">
										<Text weight="semibold" className="mb-3">Notifications</Text>
										<div className="flex items-center gap-3">
											<HeaderNotifications notifications={notifications} unreadCount={2} renderLink={renderPreviewLink} />
											<Badge variant="warning">Unread state</Badge>
										</div>
									</SmartCard>

									<SmartCard padding="sm">
										<Text weight="semibold" className="mb-3">Right action cluster</Text>
										<div className="flex items-center gap-2">
											<HeaderNotifications notifications={notifications} unreadCount={2} renderLink={renderPreviewLink} />
											<HeaderUserMenu user={user} showEmail={false} onProfile={() => {}} onSettings={() => {}} onLogout={() => {}} />
										</div>
									</SmartCard>
								</div>
							</SidebarProvider>
		</>
	);
}

export function CustomNotificationRenderer() {
	return (
		<>
			<div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
								<HeaderNotifications
									notifications={notifications}
									unreadCount={2}
									renderNotification={(item) => (
										<div className="flex items-start gap-3 rounded-md px-3 py-2">
											{item.tone === 'success' ? <CheckCircle2 className="mt-0.5 size-4 text-success" /> : <CircleAlert className="mt-0.5 size-4 text-warning" />}
											<div className="min-w-0">
												<Text weight="medium">{item.title}</Text>
												<Text size="xs" type="secondary">{item.description}</Text>
											</div>
										</div>
									)}
								/>
								<Button variant="secondary" icon={Bell}>Open bell</Button>
								<Button variant="secondary" icon={Settings}>Settings</Button>
							</div>
		</>
	);
}
