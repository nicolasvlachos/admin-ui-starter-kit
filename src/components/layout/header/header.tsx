/** Header — sticky top bar with breadcrumbs and slot-driven content regions. */
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../hooks';
import { HeaderBreadcrumbs } from './partials/header-breadcrumbs';
import type { HeaderProps } from './header.types';

export function Header({
	showBreadcrumbs = true,
	breadcrumbs = [],
	homeBreadcrumb = null,
	showSidebarTrigger = true,
	brand,
	leftContent,
	centerContent,
	rightContent,
	slots,
	renderLink,
	LinkComponent,
	className,
	contentClassName,
	leftClassName,
	centerClassName,
	rightClassName,
	breadcrumbsClassName,
}: HeaderProps) {
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });

	return (
		<header
			className={cn(
				'sticky top-0 z-40 flex min-h-[var(--topbar-height)] items-center border-b bg-background/70 px-4 py-2 backdrop-blur-md transition-[width,height] ease-linear md:px-5',
				'dark:bg-topbar',
				className,
			)}
		>
			<div className={cn('flex min-h-9 min-w-0 flex-1 items-stretch gap-4', contentClassName)}>
				{!!(slots?.brand ?? brand) && (
					<div className="hidden min-w-0 shrink-0 items-center md:flex">
						{slots?.brand ?? brand}
					</div>
				)}

				{!!showBreadcrumbs && (slots?.breadcrumbs ?? (
					<div className="min-w-0 flex-1">
						<HeaderBreadcrumbs
							breadcrumbs={breadcrumbs}
							homeBreadcrumb={homeBreadcrumb}
							showSidebarTrigger={showSidebarTrigger}
							renderLink={resolvedRenderLink}
							className={breadcrumbsClassName}
						/>
					</div>
				))}

				{!!(slots?.left ?? leftContent) && (
					<div className={cn('flex min-w-0 items-center', leftClassName)}>
						{slots?.left ?? leftContent}
					</div>
				)}

				{!!(slots?.center ?? centerContent) && (
					<div className={cn('hidden min-w-0 shrink-0 items-center justify-center lg:flex', centerClassName)}>
						{slots?.center ?? centerContent}
					</div>
				)}

				{!!(slots?.right ?? rightContent) && (
					<div className={cn('ml-auto flex shrink-0 items-center gap-2', rightClassName)}>
						{slots?.right ?? rightContent}
					</div>
				)}
			</div>
		</header>
	);
}
