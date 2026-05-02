/**
 * FeatureAnnouncementCard — promotional surface for new-feature callouts.
 * Sparkles-style icon (configurable via `icon`) sits on the leading edge of
 * the header so the title / description block has a clear typographic anchor;
 * tag chips wrap below; the action is rendered as an inline ghost link with
 * a trailing chevron. All copy is consumer-supplied so no `strings` prop is
 * needed.
 */
import { ChevronRight, Sparkles } from 'lucide-react';

import { Badge } from '@/components/base/badge/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards/smart-card';
import { IconBadge } from '@/components/base/display';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { cn } from '@/lib/utils';

import type { FeatureAnnouncementCardProps } from './types';

export function FeatureAnnouncementCard({
	icon: Icon = Sparkles,
	title,
	description,
	tags = [],
	actionLabel,
	onAction,
	className,
}: FeatureAnnouncementCardProps) {
	return (
		<SmartCard className={cn('bg-gradient-to-b from-muted/30 to-card', className)}>
			<Item size="default" className="px-0 items-start">
				<ItemMedia>
					<IconBadge icon={Icon} tone="primary" size="lg" shape="square" className="rounded-xl ring-1 ring-primary/15" />
				</ItemMedia>
				<ItemContent>
					<ItemTitle className="text-base">{title}</ItemTitle>
					<ItemDescription clamp="none">{description}</ItemDescription>
				</ItemContent>
			</Item>

			{tags.length > 0 && (
				<div className="mt-4 flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<Badge key={tag} variant="info">
							{tag}
						</Badge>
					))}
				</div>
			)}

			{!!actionLabel && (
				<div className="mt-4">
					<Button
						variant="light"
						buttonStyle="ghost"
						onClick={onAction}
						className="-ml-2 h-auto px-2"
					>
						{actionLabel}
						<ChevronRight className="ml-1 size-3.5" />
					</Button>
				</div>
			)}
		</SmartCard>
	);
}

FeatureAnnouncementCard.displayName = 'FeatureAnnouncementCard';
