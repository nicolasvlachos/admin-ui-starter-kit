import {
	Bell,
	Folder,
	Home,
	Lock,
	Mail,
	MessageSquare,
	Settings,
	User,
} from 'lucide-react';

import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemGroup,
	ItemHeader,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from '@/components/base/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/base/display/avatar';
import { Switch } from '@/components/base/forms/fields/switch';

import { Col, PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function ItemPage() {
	return (
		<PreviewPage
			title="Base · Item"
			description="Row primitive — icon/avatar/image media, title + description content, optional actions. Use ItemGroup to compose lists. Drives library-wide row consistency (admin rows, contact details, search results, settings toggles)."
		>
			<PreviewSection title="Sizes" span="full">
				<Col>
					<ItemGroup>
						<Item size="default">
							<ItemMedia variant="icon">
								<Home />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Default size</ItemTitle>
								<ItemDescription>
									For settings pages and standalone rows where the row is the focus.
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button buttonStyle="ghost" variant="secondary">Open</Button>
							</ItemActions>
						</Item>
						<Item size="sm">
							<ItemMedia variant="icon">
								<MessageSquare />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Small (provider default)</ItemTitle>
								<ItemDescription>
									Library default — admin rows, contact details, dense lists.
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button buttonStyle="ghost" variant="secondary">Open</Button>
							</ItemActions>
						</Item>
						<Item size="xs">
							<ItemMedia variant="icon">
								<Bell />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Extra small</ItemTitle>
								<ItemDescription>
									Dropdown rows, compact menus, popover lists.
								</ItemDescription>
							</ItemContent>
						</Item>
					</ItemGroup>
				</Col>
			</PreviewSection>

			<PreviewSection title="Variants" span="full">
				<Col>
					<ItemGroup>
						<Item variant="default">
							<ItemMedia variant="icon">
								<User />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Default variant</ItemTitle>
								<ItemDescription>No border, transparent background.</ItemDescription>
							</ItemContent>
						</Item>
						<Item variant="outline">
							<ItemMedia variant="icon">
								<Settings />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Outline variant</ItemTitle>
								<ItemDescription>Border + transparent background — for cards-on-cards.</ItemDescription>
							</ItemContent>
						</Item>
						<Item variant="muted">
							<ItemMedia variant="icon">
								<Lock />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Muted variant</ItemTitle>
								<ItemDescription>No border, muted background — for inset lists.</ItemDescription>
							</ItemContent>
						</Item>
					</ItemGroup>
				</Col>
			</PreviewSection>

			<PreviewSection title="ItemMedia variants" span="full">
				<Col>
					<ItemGroup>
						<Item>
							<ItemMedia variant="icon">
								<Folder />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Icon media</ItemTitle>
								<ItemDescription>Lucide icons sized via the row's data-size group.</ItemDescription>
							</ItemContent>
						</Item>
						<Item>
							<ItemMedia variant="image">
								<img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=80&q=80" alt="" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Image media</ItemTitle>
								<ItemDescription>Square thumbnails, rounded-xl, scales with size.</ItemDescription>
							</ItemContent>
						</Item>
						<Item>
							<ItemMedia variant="avatar">
								<Avatar>
									<AvatarImage src="https://i.pravatar.cc/80?u=item-avatar" alt="" />
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Avatar media</ItemTitle>
								<ItemDescription>Round avatars at every size.</ItemDescription>
							</ItemContent>
						</Item>
					</ItemGroup>
				</Col>
			</PreviewSection>

			<PreviewSection title="ItemGroup with separators" span="full">
				<Col>
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
								<Button buttonStyle="ghost" variant="secondary" size="sm">Copy</Button>
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
				</Col>
			</PreviewSection>

			<PreviewSection title="Header + footer slots" span="full">
				<Col>
					<Item variant="outline" size="default">
						<ItemHeader>
							<ItemTitle>Acme Workspace</ItemTitle>
							<Badge variant="success">Active</Badge>
						</ItemHeader>
						<ItemMedia variant="image">
							<img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=120&q=80" alt="" />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Production environment</ItemTitle>
							<ItemDescription>
								Customer-facing storefront. Read-write access for admins, read-only for analysts.
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button buttonStyle="ghost" variant="secondary">Manage</Button>
						</ItemActions>
						<ItemFooter>
							<span className="text-muted-foreground text-xs">Last deploy 12 minutes ago</span>
							<span className="text-muted-foreground text-xs">3 collaborators</span>
						</ItemFooter>
					</Item>
				</Col>
			</PreviewSection>

			<PreviewSection title="As link (render prop)" span="full">
				<Col>
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
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
