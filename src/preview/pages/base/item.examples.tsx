import { Bell, Home, Mail, Settings } from 'lucide-react';

import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from '@/components/base/item';
import { Switch } from '@/components/base/forms/fields/switch';

export function Basic() {
	return (
		<ItemGroup>
			<Item>
				<ItemMedia variant="icon">
					<Mail />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>kira@example.com</ItemTitle>
					<ItemDescription>Primary contact email</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button buttonStyle="ghost" variant="secondary">
						Copy
					</Button>
				</ItemActions>
			</Item>
			<ItemSeparator />
			<Item>
				<ItemMedia variant="icon">
					<Bell />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Notifications</ItemTitle>
					<ItemDescription>Receive email + in-app alerts</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Switch checked />
				</ItemActions>
			</Item>
		</ItemGroup>
	);
}

export function Variants() {
	return (
		<ItemGroup>
			<Item variant="default">
				<ItemMedia variant="icon">
					<Home />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Default</ItemTitle>
					<ItemDescription>No border, transparent background.</ItemDescription>
				</ItemContent>
			</Item>
			<Item variant="outline">
				<ItemMedia variant="icon">
					<Settings />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Outline</ItemTitle>
					<ItemDescription>Border + transparent background.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Badge variant="success">Active</Badge>
				</ItemActions>
			</Item>
			<Item variant="muted">
				<ItemMedia variant="icon">
					<Bell />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Muted</ItemTitle>
					<ItemDescription>Muted background — for inset lists.</ItemDescription>
				</ItemContent>
			</Item>
		</ItemGroup>
	);
}

export function PolymorphicLink() {
	return (
		<ItemGroup>
			<Item render={<a href="#" onClick={(e) => e.preventDefault()} />}>
				<ItemMedia variant="icon">
					<Home />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Dashboard</ItemTitle>
					<ItemDescription>Overview of your workspace and activity.</ItemDescription>
				</ItemContent>
			</Item>
			<Item render={<a href="#" onClick={(e) => e.preventDefault()} />}>
				<ItemMedia variant="icon">
					<Settings />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Settings</ItemTitle>
					<ItemDescription>Account, billing, notification preferences.</ItemDescription>
				</ItemContent>
			</Item>
		</ItemGroup>
	);
}
