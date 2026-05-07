---
id: layout/layout-users
title: "Layout · Users & avatars"
description: "User identity surfaces used by layout headers, sidebars, menus, avatar groups, and status badges."
layer: layout
family: "Building blocks"
examples:
  - AvatarStates
  - HeaderUserMenuExample
  - SidebarUserMenu
  - CustomTriggerCustomContent
imports:
  - @/components/base/badge
  - @/components/base/buttons
  - @/components/base/display/avatar
  - @/components/layout
  - @/components/layout/header
  - @/components/layout/sidebar
  - @/components/typography
tags:
  - layout
  - building
  - blocks
  - users
  - avatars
  - user
  - identity
---

# Layout · Users & avatars

User identity surfaces used by layout headers, sidebars, menus, avatar groups, and status badges.

**Layer:** `layout`  

## Examples

```tsx
// @ts-nocheck
import { LogOut, Settings, User, UserPlus } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@/components/base/display/avatar';
import { Text } from '@/components/typography';
import { Badge } from '@/components/base/badge';
import { HeaderUserMenu } from '@/components/layout/header';
import { SidebarNavigationUser, SidebarProvider } from '@/components/layout/sidebar';
import type { LayoutUser } from '@/components/layout';
import { Row } from '../../PreviewLayout';

const users: LayoutUser[] = [
	{ name: 'Sarah Smitha', email: 'maria@example.com', avatar: 'https://i.pravatar.cc/96?img=5' },
	{ name: 'Daniel Kowalski', email: 'stefan@example.com', avatar: 'https://i.pravatar.cc/96?img=12' },
	{ name: 'Emma Markova', email: 'elena@example.com' },
];

function initials(name: string) {
	return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export function AvatarStates() {
	return (
		<>
			<Row>
								{users.map((user, index) => (
									<Avatar key={user.name} size={index === 0 ? 'lg' : 'default'}>
										{!!user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
										<AvatarFallback>{initials(user.name)}</AvatarFallback>
										<AvatarBadge className={index === 1 ? 'bg-warning' : 'bg-success'} />
									</Avatar>
								))}
								<AvatarGroup>
									{users.map((user) => (
										<Avatar key={user.name}>
											{!!user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
											<AvatarFallback>{initials(user.name)}</AvatarFallback>
										</Avatar>
									))}
									<AvatarGroupCount>+8</AvatarGroupCount>
								</AvatarGroup>
							</Row>
		</>
	);
}

export function HeaderUserMenuExample() {
	return (
		<>
			<div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
								<div>
									<Text weight="semibold">Account switcher surface</Text>
									<Text size="xs" type="secondary">Default trigger renders avatar, name, email, and dropdown actions.</Text>
								</div>
								<HeaderUserMenu user={users[0]} onProfile={() => {}} onSettings={() => {}} onLogout={() => {}} />
							</div>
		</>
	);
}

export function SidebarUserMenu() {
	return (
		<>
			<SidebarProvider>
								<div className="max-w-sm rounded-xl border border-border bg-sidebar p-2 text-sidebar-foreground">
									<SidebarNavigationUser user={users[1]} onProfile={() => {}} onSettings={() => {}} onLogout={() => {}} />
								</div>
							</SidebarProvider>
		</>
	);
}

export function CustomTriggerCustomContent() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-2">
								<HeaderUserMenu
									user={users[2]}
									renderTrigger={(user) => (
										<Button type="button" variant="secondary" buttonStyle="outline" className="h-auto gap-3 rounded-full px-3 py-2">
											<Avatar size="sm">
												<AvatarFallback>{initials(user.name)}</AvatarFallback>
											</Avatar>
											<Text tag="span" size="xs" weight="medium">{user.name}</Text>
											<Badge variant="info">Admin</Badge>
										</Button>
									)}
									customContent={(
										<div className="space-y-1">
											<Button variant="secondary" buttonStyle="ghost" icon={User} className="w-full justify-start">Profile</Button>
											<Button variant="secondary" buttonStyle="ghost" icon={Settings} className="w-full justify-start">Preferences</Button>
											<Button variant="secondary" buttonStyle="ghost" icon={LogOut} className="w-full justify-start">Sign out</Button>
										</div>
									)}
								/>

								<div className="flex items-center gap-3 rounded-xl border border-border p-4">
									<Button variant="primary" icon={UserPlus}>Invite user</Button>
									<Text size="xs" type="secondary">Pair user menus with base buttons and badges for app-specific account controls.</Text>
								</div>
							</div>
		</>
	);
}
```

## Example exports

- `AvatarStates`
- `HeaderUserMenuExample`
- `SidebarUserMenu`
- `CustomTriggerCustomContent`

