/**
 * Breadcrumbs — page hierarchy trail. Last item is rendered as the current
 * page (non-link); preceding items become links when an `href` is provided.
 * Three sizes (xs / sm / md) drive font scale, list gap, and separator gap.
 */
import { Fragment, type ReactNode } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export interface BreadcrumbItemType {
	label: ReactNode;
	href?: string;
	handle?: string;
}

type BreadcrumbSize = 'xs' | 'sm' | 'md';

type BreadcrumbLinkRenderer = (props: {
	href?: string;
	children: ReactNode;
	className?: string;
	'aria-label'?: string;
}) => ReactNode;

type BreadcrumbsProps = {
	breadcrumbs: BreadcrumbItemType[];
	size?: BreadcrumbSize;
	className?: string;
	renderLink?: BreadcrumbLinkRenderer;
};

const hashString = (value: string): string => {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}

	return Math.abs(hash).toString(36);
};

const labelToKey = (label: ReactNode): string => {
	if (typeof label === 'string' || typeof label === 'number') return String(label);
	return 'breadcrumb';
};

const defaultRenderLink: BreadcrumbLinkRenderer = ({ href, children, ...props }) => (
	<a href={href} {...props}>{children}</a>
);

const sizeConfig: Record<BreadcrumbSize, { item: string; list: string; separator: string; color: string }> = {
	xs: {
		item: 'text-xs',
		list: '!gap-0.5 sm:!gap-1',
		separator: '!mx-0.5 sm:!mx-1',
		color: 'text-muted-foreground/70',
	},
	sm: {
		item: 'text-sm',
		list: '!gap-1 sm:!gap-1.5',
		separator: '!mx-1 sm:!mx-1.5',
		color: 'text-muted-foreground',
	},
	md: {
		item: 'text-base',
		list: '!gap-2 sm:!gap-2.5',
		separator: '!mx-2 sm:!mx-2.5',
		color: 'text-muted-foreground',
	},
};

export function Breadcrumbs({ breadcrumbs, size = 'md', className, renderLink = defaultRenderLink }: BreadcrumbsProps) {
	if (breadcrumbs.length === 0) {
		return null;
	}

	const { item: itemSizeClass, list: listSpacingClass, separator: separatorSpacingClass, color: baseColorClass } =
		sizeConfig[size] ?? sizeConfig.md;

	return (
		<Breadcrumb className={cn(baseColorClass, className)}>
			<BreadcrumbList className={cn('flex flex-wrap items-center break-words', listSpacingClass)}>
				{breadcrumbs.map((item, index) => {
					const isLast = index === breadcrumbs.length - 1;
					const itemKey = item.handle ?? item.href ?? `crumb-${hashString(labelToKey(item.label))}-${index}`;

					return (
						<Fragment key={itemKey}>
							<BreadcrumbItem className={cn(itemSizeClass, 'font-medium')}>
								{isLast || !item.href ? (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										{renderLink({ href: item.href, children: item.label })}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && (
								<BreadcrumbSeparator className={cn(separatorSpacingClass)} />
							)}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

Breadcrumbs.displayName = 'Breadcrumbs';
