// @ts-nocheck
import { Inbox, FileText, Settings } from 'lucide-react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { Col } from '../../PreviewLayout';

export function EmptyState() {
	return (
		<>
			<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon"><Inbox /></EmptyMedia>
									<EmptyTitle>No orders yet</EmptyTitle>
									<EmptyDescription>Start by creating your first order.</EmptyDescription>
								</EmptyHeader>
								<EmptyContent>
									<Button>Create order</Button>
								</EmptyContent>
							</Empty>
		</>
	);
}

export function ItemsList() {
	return (
		<>
			<Col>
								<Item>
									<ItemMedia variant="icon"><FileText /></ItemMedia>
									<ItemContent>
										<ItemTitle>Invoice INV-2026-0392</ItemTitle>
										<ItemDescription>Sarah Smitha — 2,450 USD</ItemDescription>
									</ItemContent>
									<ItemFooter>
										<Button size="sm" variant="outline">Open</Button>
									</ItemFooter>
								</Item>
								<Item>
									<ItemMedia variant="icon"><Settings /></ItemMedia>
									<ItemContent>
										<ItemTitle>Account preferences</ItemTitle>
										<ItemDescription>Notifications, security & integrations.</ItemDescription>
									</ItemContent>
								</Item>
							</Col>
		</>
	);
}
