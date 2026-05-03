import { useCallback } from 'react';
import {
	Pagination as PaginationRoot,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Text } from '@/components/typography';
import { defaultDataTableStrings } from './table.strings';
import { type ServerPaginationProps } from './table.types';

import { cn } from '@/lib/utils';
/**
 * Generate a window of page numbers with ellipsis gaps.
 *
 * Always shows first page, last page, and up to 1 sibling
 * on each side of the current page.
 */
function generatePageNumbers(
	currentPage: number,
	lastPage: number,
): (number | 'ellipsis')[] {
	if (lastPage <= 7) {
		return Array.from({ length: lastPage }, (_, i) => i + 1);
	}

	const pages: (number | 'ellipsis')[] = [1];

	if (currentPage > 3) {
		pages.push('ellipsis');
	}

	const start = Math.max(2, currentPage - 1);
	const end = Math.min(lastPage - 1, currentPage + 1);

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	if (currentPage < lastPage - 2) {
		pages.push('ellipsis');
	}

	pages.push(lastPage);

	return pages;
}

function buildPageUrl(basePath: string, page: number, queryKey: string): string {
	// Build a URL without inheriting the current location's query string —
	// the library is framework-agnostic and must not read browser globals
	// to decide what to put in href. Consumers that need their own params
	// merged should compute and pass the URL via the pagination object.
	const params = new URLSearchParams();
	params.set(queryKey, String(page));
	return `${basePath}?${params.toString()}`;
}

export function Pagination({
	pagination,
	onPageChange,
	labels = {},
	pageQueryKey,
}: ServerPaginationProps) {
	const paginationLabels = {
		...defaultDataTableStrings.pagination,
		...labels,
	} as typeof defaultDataTableStrings.pagination;
	const queryKey = pageQueryKey ?? 'page';

	const firstItem = (pagination.current_page - 1) * pagination.per_page + 1;
	const lastItem = Math.min(
		pagination.current_page * pagination.per_page,
		pagination.total,
	);

	const navigateToPage = useCallback(
		(page: number, url: string | null) => {
			if (!url) return;
			// The library never navigates on its own. Consumers wire their
			// router (Inertia, Tanstack Router, RR7, Next, …) through
			// `onPageChange`. When it's absent the click is a no-op — the
			// `href` attribute on the underlying anchor remains the only
			// fallback path (browsers will navigate it if JS doesn't run).
			onPageChange?.(page, url, pagination.path || '');
		},
		[onPageChange, pagination.path],
	);

	const hasPrevious = pagination.prev_page_url !== null;
	const hasNext = pagination.next_page_url !== null;
	const pages = generatePageNumbers(pagination.current_page, pagination.last_page);

	return (
		<div className={cn('pagination--component', 'flex items-center justify-between px-5 py-3')}>
			<Text size="xs" type="secondary" className="tabular-nums tracking-tight">
				<Text tag="span" weight="medium" className="text-foreground">{firstItem}&ndash;{lastItem}</Text>{' '}
				{paginationLabels.of}{' '}
				<Text tag="span" weight="medium" className="text-foreground">{pagination.total}</Text>{' '}
				{paginationLabels.entries}
			</Text>

			<PaginationRoot aria-label={paginationLabels.ariaLabel} className="w-auto mx-0">
				<PaginationContent className="gap-0.5">
					<PaginationItem>
						<PaginationPrevious
							text={paginationLabels.previous}
							href="#"
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								navigateToPage(
									pagination.current_page - 1,
									pagination.prev_page_url,
								);
							}}
							aria-disabled={!hasPrevious}
							className={`h-8 text-xs ${!hasPrevious ? 'pointer-events-none opacity-40' : ''}`}
						/>
					</PaginationItem>

					{pages.map((page, index) => {
						const isEllipsis = page === 'ellipsis';
						const itemKey = isEllipsis
							? `ellipsis-${pagination.current_page}-${index}`
							: `page-${page}`;

						return (
						<PaginationItem key={itemKey}>
							{isEllipsis ? (
								<PaginationEllipsis className="size-8" />
							) : (
								<PaginationLink
									href="#"
									isActive={page === pagination.current_page}
									onClick={(e: React.MouseEvent) => {
										e.preventDefault();
										navigateToPage(
											page,
											buildPageUrl(pagination.path, page, queryKey),
										);
									}}
									className="size-8 text-xs"
								>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
						);
					})}

					<PaginationItem>
						<PaginationNext
							text={paginationLabels.next}
							href="#"
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								navigateToPage(
									pagination.current_page + 1,
									pagination.next_page_url,
								);
							}}
							aria-disabled={!hasNext}
							className={`h-8 text-xs ${!hasNext ? 'pointer-events-none opacity-40' : ''}`}
						/>
					</PaginationItem>
				</PaginationContent>
			</PaginationRoot>
		</div>
	);
}

Pagination.displayName = 'Pagination';
