---
id: base/navigation
title: "Navigation"
description: "The navigation primitives — PageHeader, Breadcrumbs, ActionMenu, LanguageSwitcher, SectionNav, SideNav, AsideNavigationMenu, TabNavigationMenu, NavigationTabs, OverflowTabBar."
layer: base
family: "Navigation & data"
sourcePath: src/components/base/navigation
examples:
  - PageHeaderExample
  - SectionNavSticky
  - BreadcrumbsSizes
  - ActionMenuExample
  - LanguageSwitcherButtons
  - LanguageSwitcherInline
  - AsideNavigationMenuExample
  - TabNavigationMenuExample
  - NavigationTabsRound
  - SideNavCollapsibleGroups
  - OverflowTabBarResponsiveWithMoreMenu
imports:
  - @/components/base/buttons
  - @/components/base/navigation/action-menu
  - @/components/base/navigation/aside-navigation-menu
  - @/components/base/navigation/breadcrumbs
  - @/components/base/navigation/language-switcher
  - @/components/base/navigation/navigation-tabs
  - @/components/base/navigation/overflow-tab-bar
  - @/components/base/navigation/page-header
  - @/components/base/navigation/section-nav
  - @/components/base/navigation/side-nav
  - @/components/base/navigation/tab-navigation-menu
tags:
  - base
  - navigation
  - data
  - primitives
  - pageheader
  - breadcrumbs
  - actionmenu
---

# Navigation

The navigation primitives — PageHeader, Breadcrumbs, ActionMenu, LanguageSwitcher, SectionNav, SideNav, AsideNavigationMenu, TabNavigationMenu, NavigationTabs, OverflowTabBar.

**Layer:** `base`  
**Source:** `src/components/base/navigation`

## Examples

```tsx
import { useState } from 'react';
import {
	Home, FolderOpen, Settings, Users, Edit, Trash2, MoreHorizontal, Plus,
	Inbox, Star, Shield, BarChart3, MessageSquare, Bell, CreditCard, Database, FileText,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/base/navigation/breadcrumbs';
import { ActionMenu, MenuAction } from '@/components/base/navigation/action-menu';
import { LanguageSwitcher } from '@/components/base/navigation/language-switcher';
import AsideNavigationMenu from '@/components/base/navigation/aside-navigation-menu';
import TabNavigationMenu from '@/components/base/navigation/tab-navigation-menu';
import NavigationTabs from '@/components/base/navigation/navigation-tabs';
import { PageHeader } from '@/components/base/navigation/page-header';
import { SectionNav } from '@/components/base/navigation/section-nav';
import { SideNav } from '@/components/base/navigation/side-nav';
import { OverflowTabBar } from '@/components/base/navigation/overflow-tab-bar';
import { Button } from '@/components/base/buttons';

export function PageHeaderExample() {
	return (
		<>
			<PageHeader
								eyebrow="Settings"
								title="Team & Permissions"
								description="Invite teammates, set roles, and audit recent activity."
								badge={{ label: 'Beta', variant: 'info' }}
								actions={(
									<>
										<Button icon={Plus}>Invite</Button>
									</>
								)}
							/>
		</>
	);
}

export function SectionNavSticky() {
	return (
		<>
			<div className="grid gap-6 md:grid-cols-[200px_1fr]">
								<aside className="md:sticky md:top-24 md:self-start">
									<SectionNav
										items={[
											{ id: 'overview', label: 'Overview', icon: Home },
											{ id: 'orders', label: 'Orders', icon: FolderOpen },
											{ id: 'team', label: 'Team', icon: Users },
											{ id: 'preferences', label: 'Preferences', icon: Settings },
										]}
									/>
								</aside>
								<div className="space-y-6">
									<section id="overview" className="rounded-md border border-border p-4 min-h-[140px]"><strong>Overview</strong> — section anchor target.</section>
									<section id="orders" className="rounded-md border border-border p-4 min-h-[140px]"><strong>Orders</strong> — section anchor target.</section>
									<section id="team" className="rounded-md border border-border p-4 min-h-[140px]"><strong>Team</strong> — section anchor target.</section>
									<section id="preferences" className="rounded-md border border-border p-4 min-h-[140px]"><strong>Preferences</strong> — section anchor target.</section>
								</div>
							</div>
		</>
	);
}

export function BreadcrumbsSizes() {
	return (
		<>
			<div className="space-y-2">
								{(['xs', 'sm', 'md'] as const).map((s) => (
									<Breadcrumbs
										key={s}
										size={s}
										breadcrumbs={[
											{ label: 'Dashboard', href: '#/' },
											{ label: 'Orders', href: '#/orders' },
											{ label: 'INV-2026-0392' },
										]}
									/>
								))}
							</div>
		</>
	);
}

export function ActionMenuExample() {
	return (
		<>
			<ActionMenu align="end">
								<MenuAction icon={Edit} label="Edit" onClick={() => {}} />
								<MenuAction icon={MoreHorizontal} label="Duplicate" onClick={() => {}} />
								<MenuAction icon={Trash2} label="Delete" variant="error" onClick={() => {}} />
							</ActionMenu>
		</>
	);
}

export function LanguageSwitcherButtons() {
	return (
		<>
			<LanguageSwitcher
								locales={[
									{ value: 'en', label: 'English', nativeLabel: 'English', active: true },
									{ value: 'bg', label: 'USAn', nativeLabel: 'Български', active: false },
								]}
								onSelect={() => {}}
							/>
		</>
	);
}

export function LanguageSwitcherInline() {
	return (
		<>
			<LanguageSwitcher
								variant="inline"
								locales={[
									{ value: 'en', label: 'English', nativeLabel: 'EN', active: true },
									{ value: 'bg', label: 'USAn', nativeLabel: 'БГ', active: false },
									{ value: 'de', label: 'German', nativeLabel: 'DE', active: false },
								]}
								onSelect={() => {}}
							/>
		</>
	);
}

export function AsideNavigationMenuExample() {
	const [path] = useState('/dashboard/orders');
	return (
		<>
			<div className="max-w-xs rounded-md border border-border bg-card p-2">
								<AsideNavigationMenu
									currentPath={path}
									items={[
										{ title: 'Home', href: '#/', icon: Home },
										{ title: 'Orders', href: '#/dashboard/orders', icon: FolderOpen },
										{ title: 'Customers', href: '#/customers', icon: Users },
										{ title: 'Settings', href: '#/settings', icon: Settings },
									]}
								/>
							</div>
		</>
	);
}

export function TabNavigationMenuExample() {
	return (
		<>
			<TabNavigationMenu
								currentPath="#/orders"
								items={[
									{ title: 'Overview', href: '#/overview' },
									{ title: 'Orders', href: '#/orders', badge: '12' },
									{ title: 'Invoices', href: '#/invoices' },
								]}
							/>
		</>
	);
}

export function NavigationTabsRound() {
	return (
		<>
			<NavigationTabs
								currentUrl="#/orders"
								items={[
									{ url: '#/overview', label: 'Overview', active: false },
									{ url: '#/orders', label: 'Orders', active: true },
									{ url: '#/invoices', label: 'Invoices', active: false },
								]}
							/>
		</>
	);
}

export function SideNavCollapsibleGroups() {
	const [path] = useState('/dashboard/orders');
	return (
		<>
			<div className="max-w-xs rounded-md border border-border bg-card p-3">
								<SideNav
									currentPath={path}
									groups={[
										{
											id: 'main',
											label: 'Main',
											items: [
												{ label: 'Inbox', href: '#/inbox', icon: Inbox, badge: '12' },
												{ label: 'Orders', href: '#/dashboard/orders', icon: FolderOpen, badge: '3' },
												{ label: 'Customers', href: '#/customers', icon: Users },
												{ label: 'Reviews', href: '#/reviews', icon: Star },
											],
										},
										{
											id: 'admin',
											label: 'Admin',
											items: [
												{ label: 'Permissions', href: '#/admin/permissions', icon: Shield },
												{ label: 'Reports', href: '#/admin/reports', icon: BarChart3 },
												{ label: 'Settings', href: '#/admin/settings', icon: Settings, disabled: true },
											],
										},
									]}
								/>
							</div>
		</>
	);
}

export function OverflowTabBarResponsiveWithMoreMenu() {
	const [tab, setTab] = useState('overview');
	return (
		<>
			<OverflowTabBar
								value={tab}
								onChange={setTab}
								items={[
									{ id: 'overview', label: 'Overview', icon: Home },
									{ id: 'orders', label: 'Orders', icon: FolderOpen, badge: '12' },
									{ id: 'invoices', label: 'Invoices', icon: FileText },
									{ id: 'customers', label: 'Customers', icon: Users },
									{ id: 'messages', label: 'Messages', icon: MessageSquare, badge: '4' },
									{ id: 'alerts', label: 'Alerts', icon: Bell },
									{ id: 'billing', label: 'Billing', icon: CreditCard },
									{ id: 'data', label: 'Data', icon: Database },
								]}
							/>
		</>
	);
}
```

## Example exports

- `PageHeaderExample`
- `SectionNavSticky`
- `BreadcrumbsSizes`
- `ActionMenuExample`
- `LanguageSwitcherButtons`
- `LanguageSwitcherInline`
- `AsideNavigationMenuExample`
- `TabNavigationMenuExample`
- `NavigationTabsRound`
- `SideNavCollapsibleGroups`
- `OverflowTabBarResponsiveWithMoreMenu`

