/** HeaderBreadcrumbs — breadcrumbs trail with optional sidebar trigger. */
import * as React from 'react';

import { Separator } from '@/components/base/display/separator';
import { Breadcrumbs } from '@/components/base/navigation/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import type { BreadcrumbItem } from '../../layout.types';
import type { HeaderBreadcrumbsProps } from '../header.types';

export function HeaderBreadcrumbs({
	breadcrumbs = [],
	homeBreadcrumb = null,
	showSidebarTrigger = true,
	triggerSlot,
	renderLink,
	LinkComponent,
	className,
}: HeaderBreadcrumbsProps) {
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });
	const items = React.useMemo<BreadcrumbItem[]>(() => {
		const out: BreadcrumbItem[] = [];
		if (homeBreadcrumb) out.push(homeBreadcrumb);
		out.push(...breadcrumbs);
		return out;
	}, [homeBreadcrumb, breadcrumbs]);

	const showCrumbs = items.length > 0;

	return (
		<div className={cn('relative flex min-h-9 items-stretch gap-3', className)}>
			{!!showSidebarTrigger && (
				<div className="relative flex min-h-9 items-center justify-center gap-2">
					{triggerSlot ?? <SidebarTrigger className="size-7 [&_svg]:size-4" />}
				</div>
			)}
			{!!showCrumbs && (
				<>
					{!!showSidebarTrigger && <Separator orientation="vertical" className="h-auto self-stretch" />}
					<div className="flex min-w-0 items-center">
						<Breadcrumbs breadcrumbs={items} size="xs" renderLink={resolvedRenderLink} />
					</div>
				</>
			)}
		</div>
	);
}
