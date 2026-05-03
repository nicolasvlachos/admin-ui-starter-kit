/**
 * PageHeader — section / page heading with optional eyebrow, breadcrumbs slot,
 * description, status badge, and a row of action buttons. Designed to sit at the top
 * of every dashboard or detail page for consistent vertical rhythm.
 */
import type { ReactNode } from 'react';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography';
import { Badge, type ComposedBadgeVariant } from '@/components/base/badge';
import { Separator } from '@/components/base/display/separator';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
	eyebrow?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	badge?: { label: string; variant?: ComposedBadgeVariant };
	breadcrumbs?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
	className?: string;
	withSeparator?: boolean;
}

export function PageHeader({
	eyebrow,
	title,
	description,
	badge,
	breadcrumbs,
	actions,
	children,
	className,
	withSeparator = true,
}: PageHeaderProps) {
	return (
		<header className={cn('page-header--component', 'w-full', className)}>
			{!!breadcrumbs && <div className="mb-3">{breadcrumbs}</div>}

			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 flex-1">
					{!!eyebrow && (
						<Text size="xxs" type="secondary" weight="semibold" className="mb-1 uppercase tracking-wider">
							{eyebrow}
						</Text>
					)}
					<div className="flex items-center gap-2">
						<Heading tag="h2" className="text-2xl border-0 pb-0">{title}</Heading>
						{!!badge && (
							<Badge variant={badge.variant ?? 'secondary'}>{badge.label}</Badge>
						)}
					</div>
					{!!description && (
						<Text type="secondary" className="mt-1 max-w-2xl">{description}</Text>
					)}
				</div>
				{!!actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
			</div>

			{!!children && <div className="mt-4">{children}</div>}

			{!!withSeparator && <Separator className="mt-4" />}
		</header>
	);
}

PageHeader.displayName = 'PageHeader';
