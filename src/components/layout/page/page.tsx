/**
 * Page — convenience wrapper that pairs `<PageHeader>` with `<Container>`.
 * For full control, compose `<PageHeader />`, `<PageContent />`, and
 * `<Container />` directly.
 */
import { Container } from '../containers/content-container';
import { PageHeader } from './partials/page-header';
import type { PageProps } from './page.types';
import { cn } from '@/lib/utils';

export function Page({
	header,
	width = 'narrow',
	children,
	className,
	bodyClassName,
	renderLink,
	LinkComponent,
}: PageProps) {
	return (
		<Container width={width} className={className}>
			{!!header && (
				<PageHeader
					{...header}
					renderLink={header.renderLink ?? renderLink}
					LinkComponent={header.LinkComponent ?? LinkComponent}
				/>
			)}
			{!!children && (
				<div className={cn('relative block w-full', bodyClassName)}>
					{children}
				</div>
			)}
		</Container>
	);
}
