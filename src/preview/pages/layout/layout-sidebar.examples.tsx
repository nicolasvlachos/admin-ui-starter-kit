// @ts-nocheck
import { BarChart3, Brain, CreditCard, ExternalLink, Home, Inbox, LifeBuoy, Package, Settings, Shield, SlidersHorizontal, Store, Users } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';
import { Separator } from '@/components/base/display/separator';
import { Text } from '@/components/typography';
import type { LayoutLinkRenderProps, LayoutUser } from '@/components/layout';
import { Header, HeaderSearch, HeaderNotifications, HeaderUserMenu } from '@/components/layout/header';
import { PageHeader } from '@/components/layout/page';
import {
	AppSidebar,
	Sidebar,
	SidebarGroupedNavigation,
	SidebarNavigation,
	SidebarNavigationFooter,
	SidebarProvider,
	SidebarWorkspaceDropdown,
	type SidebarNavItem,
} from '@/components/layout/sidebar';
import { SidebarMenuItem } from '@/components/base/sidebar';

const groups: Record<string, SidebarNavItem[]> = {
	Platform: [
		{ label: 'Dashboard', href: '#/layout/sidebar', icon: Home, handle: 'dashboard' },
		{ label: 'Customers', href: '#/customers', icon: Users, handle: 'customers', badge: 24 },
		{ label: 'Orders', href: '#/orders', icon: Package, handle: 'orders', children: [
			{ label: 'Pending', href: '#/orders/pending', handle: 'orders-pending', badge: 8 },
			{ label: 'Fulfilled', href: '#/orders/fulfilled', handle: 'orders-fulfilled' },
		] },
	],
	Finance: [
		{ label: 'Invoices', href: '#/invoices', icon: CreditCard, handle: 'invoices', badge: 12 },
		{ label: 'Reports', href: '#/reports', icon: BarChart3, handle: 'reports' },
	],
};

const footerItems = [
	{ label: 'Support', href: '#/support', icon: LifeBuoy, handle: 'support' },
	{ label: 'Security', href: '#/security', icon: Shield, handle: 'security' },
	{ label: 'External docs', href: 'https://example.com', icon: ExternalLink, handle: 'docs', external: true },
];

const utilityItems = [
	{ label: 'Settings', href: '#/settings', icon: SlidersHorizontal, handle: 'settings' },
	{ label: 'AI', href: '#/ai', icon: Brain, handle: 'ai' },
];

const user: LayoutUser = {
	name: 'Nicolas Vlachos',
	email: 'nicolas@example.com',
	avatar: 'https://i.pravatar.cc/96?img=11',
};

function renderPreviewLink({ href, children, className, target, rel }: LayoutLinkRenderProps) {
	return <a href={href ?? '#'} className={className} target={target} rel={rel}>{children}</a>;
}

function Brand() {
	return (
		<div className="flex min-w-0 items-center gap-2">
			<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
				<Store className="size-4" aria-hidden="true" />
			</div>
			<div className="min-w-0">
				<Text weight="semibold" className="truncate text-inherit">Atlas Admin</Text>
				<Text size="xxs" type="secondary" className="truncate">Production</Text>
			</div>
		</div>
	);
}

function CollapsedBrand() {
	return (
		<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
			<Store className="size-4" aria-hidden="true" />
		</div>
	);
}

export function AppSidebarShell() {
	return (
		<>
			<SidebarProvider defaultOpen className="min-h-0">
								<div className="flex h-[42rem] w-full overflow-hidden rounded-2xl border border-border bg-background p-3">
									<div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
										<AppSidebar
											className="h-full p-0"
											surfaceClassName="bg-background"
											headerClassName="px-4 pb-3 pt-4"
											logoClassName="px-0"
											logo={<Brand />}
											collapsedLogo={<CollapsedBrand />}
											workspaceLinks={[
												{ label: 'Production store', url: '#/workspaces/production', icon: Store, external: false },
												{ label: 'Sandbox', url: '#/workspaces/sandbox', icon: Store, external: false },
											]}
											workspaceStrings={{ label: 'Workspace', select: 'Switch workspace' }}
											navigationGroups={groups}
											footerNavItems={utilityItems}
											currentUrl="#/orders/pending"
											liveBadges={{ customers: 31, invoices: 14 }}
											renderLink={renderPreviewLink}
											slots={{
												afterNavigation: (
													<SidebarNavigationFooter items={footerItems} label="Help" currentUrl="#/orders/pending" renderLink={renderPreviewLink} />
												),
											}}
										/>
										<div className="flex min-w-0 flex-1 flex-col">
											<Header
												renderLink={renderPreviewLink}
												breadcrumbs={[{ label: 'Operations', href: '#/features/activities' }, { label: 'Orders' }]}
												centerClassName="justify-start"
												slots={{
													center: <HeaderSearch className="w-full max-w-sm" />,
													right: (
														<>
															<HeaderNotifications unreadCount={2} notifications={[]} />
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
											<main className="min-w-0 flex-1 space-y-4 p-5">
												<PageHeader
													title="Pending orders"
													description="The sidebar controls navigation only; the app owns routing and page content."
													headingTag="h3"
													titleBadges={[{ label: '8 pending', variant: 'warning' }]}
												/>
												<div className="grid gap-3 md:grid-cols-3">
													{['Manual review', 'Awaiting stock', 'Ready to fulfill'].map((label, index) => (
														<SmartCard key={label} padding="sm" className="shadow-sm">
															<Text size="xs" type="secondary">{label}</Text>
															<Text weight="semibold">{[8, 12, 36][index]}</Text>
														</SmartCard>
													))}
												</div>
											</main>
										</div>
									</div>
								</div>
							</SidebarProvider>
		</>
	);
}

export function NavigationPartials() {
	return (
		<>
			<SidebarProvider defaultOpen className="min-h-0">
								<div className="grid w-full gap-5 md:grid-cols-2">
									<div className="h-[30rem] overflow-hidden rounded-xl border border-border bg-sidebar text-sidebar-foreground shadow-sm">
										<Sidebar collapsible="none" className="w-full" surfaceClassName="bg-background">
											<SidebarWorkspaceDropdown
												logo={<Brand />}
												workspaceLinks={[
													{ label: 'Production store', url: '#/workspaces/production', icon: Store, external: false },
													{ label: 'Sandbox', url: '#/workspaces/sandbox', icon: Store, external: false },
												]}
												renderLink={renderPreviewLink}
											/>
											<SidebarGroupedNavigation navigationByGroups={groups} currentUrl="#/customers" liveBadges={{ customers: 9 }} renderLink={renderPreviewLink} />
										</Sidebar>
									</div>

									<div className="h-[30rem] overflow-hidden rounded-xl border border-border bg-sidebar p-2 text-sidebar-foreground shadow-sm">
										<SidebarNavigation
											label="Flat navigation"
											items={[
												{ label: 'Inbox', href: '#/inbox', icon: Inbox, badge: 6 },
												{ label: 'Settings', href: '#/settings', icon: Settings },
												{ label: 'Disabled item', href: '#/disabled', icon: Shield, disabled: true },
											]}
											currentUrl="#/inbox"
											renderLink={renderPreviewLink}
										/>
										<div className="mt-4 border-t border-sidebar-border pt-3">
											<SidebarNavigationFooter items={footerItems} label="Help" currentUrl="#/orders/pending" renderLink={renderPreviewLink} />
											<SidebarNavigationFooter items={utilityItems} currentUrl="#/orders/pending" renderLink={renderPreviewLink} />
										</div>
									</div>
								</div>
							</SidebarProvider>
		</>
	);
}

export function CustomRowRenderer() {
	return (
		<>
			<SidebarProvider defaultOpen className="min-h-0">
								<div className="rounded-xl border border-border bg-sidebar p-3 text-sidebar-foreground shadow-sm">
									<SidebarNavigation
										label="Custom renderItem"
										items={[
											{ label: 'Priority inbox', href: '#/priority', icon: Inbox, badge: 3 },
											{ label: 'Billing review', href: '#/billing', icon: CreditCard, badge: 11 },
										]}
										renderLink={renderPreviewLink}
										renderItem={(item, context) => (
											<SidebarMenuItem>
												<div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-sidebar-accent">
													<div>
														<Text weight="medium" className="text-inherit">{item.label}</Text>
														<Text size="xxs" type="secondary">active: {String(context.active)}</Text>
													</div>
													{!!context.badge && <Badge variant="primary">{context.badge}</Badge>}
												</div>
											</SidebarMenuItem>
										)}
									/>
								</div>
							</SidebarProvider>
		</>
	);
}
