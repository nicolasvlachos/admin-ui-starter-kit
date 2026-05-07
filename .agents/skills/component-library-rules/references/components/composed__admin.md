---
id: composed/admin
title: "Composed · Admin"
description: "Team list, permissions, conversations, settings, inventory."
layer: composed
family: "Admin"
examples:
  - TeamMembers
  - RolePermissions
  - RecentConversations
  - SettingsToggles
  - InventoryLevel
imports:
  - @/components/base/cards
  - @/components/composed/admin/conversation-row
  - @/components/composed/admin/inventory-level
  - @/components/composed/admin/role-permission
  - @/components/composed/admin/settings-toggle
  - @/components/composed/admin/team-member
tags:
  - composed
  - admin
  - team
  - list
  - permissions
  - conversations
---

# Composed · Admin

Team list, permissions, conversations, settings, inventory.

**Layer:** `composed`  

## Examples

```tsx
// @ts-nocheck
import { MessageSquare, Shield, Settings, Zap } from 'lucide-react';
import { TeamMemberRow } from '@/components/composed/admin/team-member';
import { RolePermissionCard } from '@/components/composed/admin/role-permission';
import { RecentConversationRow } from '@/components/composed/admin/conversation-row';
import { SettingsToggleRow } from '@/components/composed/admin/settings-toggle';
import { InventoryLevelCard } from '@/components/composed/admin/inventory-level';
import { SmartCard } from '@/components/base/cards';

export function TeamMembers() {
	return (
		<>
			<SmartCard>
								<TeamMemberRow
									members={[
										{ initials: 'EM', name: 'Emma Garcia', role: 'Product Manager', dept: 'Operations', active: '2h ago' },
										{ initials: 'SP', name: 'Daniel Smith', role: 'Lead Developer', dept: 'Engineering', active: '15m ago' },
										{ initials: 'ID', name: 'David Williams', role: 'Designer', dept: 'Design', active: '1d ago' },
									]}
								/>
							</SmartCard>
		</>
	);
}

export function RolePermissions() {
	return (
		<>
			<RolePermissionCard
								roleName="Editor"
								description="Can manage content and view users."
								memberCount={12}
								sections={[
									{ name: 'Content', permissions: [{ label: 'Create', active: true }, { label: 'Read', active: true }, { label: 'Update', active: true }, { label: 'Delete', active: false }] },
									{ name: 'Users', permissions: [{ label: 'Invite', active: true }, { label: 'View', active: true }, { label: 'Edit', active: false }, { label: 'Remove', active: false }] },
								]}
								onEdit={() => {}}
							/>
		</>
	);
}

export function RecentConversations() {
	return (
		<>
			<SmartCard>
								<RecentConversationRow
									conversations={[
										{ initials: 'EM', name: 'Emma Garcia', preview: 'Thanks for the quick response! I wanted to ask about the delivery timeline...', time: '2m', unread: 3 },
										{ initials: 'SP', name: 'Daniel Smith', preview: 'The new product photos look great. Can we schedule a meeting...', time: '15m', unread: 0 },
										{ initials: 'NK', name: 'Nadia Kowalski', preview: 'I noticed the voucher codes are not applying correctly...', time: '1h', unread: 1 },
									]}
								/>
							</SmartCard>
		</>
	);
}

export function SettingsToggles() {
	return (
		<>
			<SettingsToggleRow
								settings={[
									{ key: 'notifications', icon: MessageSquare, name: 'Push Notifications', desc: 'Receive alerts for new orders and messages', defaultValue: true },
									{ key: 'twoFactor', icon: Shield, name: 'Two-Factor Auth', desc: 'Add an extra layer of security' },
									{ key: 'darkMode', icon: Settings, name: 'Dark Mode', desc: 'Use dark theme across all admin pages', defaultValue: true },
									{ key: 'analytics', icon: Zap, name: 'Usage Analytics', desc: 'Help us improve by sharing anonymous usage data', defaultValue: true },
								]}
							/>
		</>
	);
}

export function InventoryLevel() {
	return (
		<>
			<InventoryLevelCard productName="Luxury Gift Basket" variant="Large / Gold" stock={23} reorderLevel={20} maxStock={100} lastRestocked="Mar 15" />
		</>
	);
}
```

## Example exports

- `TeamMembers`
- `RolePermissions`
- `RecentConversations`
- `SettingsToggles`
- `InventoryLevel`

