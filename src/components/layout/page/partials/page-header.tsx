/**
 * PageHeader — page title, back control, title badges, and actions.
 *
 * Navigation goes through `renderLink`; consumer apps wire framework links at
 * the boundary. Slots let consumers replace any structural region without
 * forking the page wrapper.
 */
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Separator } from '@/components/base/display/separator';
import { Heading, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useLayoutLinkRenderer } from '../../hooks';
import type { PageHeaderProps, PageHeadingTag } from '../page.types';

const PAGE_TITLE_CLASS: Record<PageHeadingTag, string> = {
	h1: 'border-0 pb-0 text-xl',
	h2: 'border-0 pb-0 text-lg',
	h3: 'text-base',
	h4: 'text-sm',
	h5: 'text-sm',
	h6: 'text-sm',
};

export function PageHeader({
	title,
	description,
	headingTag = 'h3',
	backHref,
	onBack,
	backLabel = 'Back',
	titleBadges = [],
	actions,
	slots,
	renderLink,
	LinkComponent,
	className,
	contentClassName,
	actionsClassName,
	titleClassName,
	descriptionClassName,
}: PageHeaderProps) {
	const resolvedRenderLink = useLayoutLinkRenderer({ renderLink, LinkComponent });
	const hasBack = !!backHref || !!onBack;

	const defaultBack = hasBack ? (
		<div className="flex items-center gap-1.5 pt-1">
			{backHref && !onBack ? (
				resolvedRenderLink({
					href: backHref,
					'aria-label': backLabel,
					children: (
						<Button
							variant="secondary"
							buttonStyle="ghost"
							size="icon-xs"
							className="h-7 w-7 rounded p-1"
						>
							<ArrowLeft className="size-4" aria-hidden="true" />
							<span className="sr-only">{backLabel}</span>
						</Button>
					),
				})
			) : (
				<Button
					type="button"
					variant="secondary"
					buttonStyle="ghost"
					size="icon-xs"
					className="h-7 w-7 rounded p-1"
					onClick={onBack}
					aria-label={backLabel}
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
				</Button>
			)}
			<Separator orientation="vertical" className="h-7" />
		</div>
	) : null;

	return (
		<header
			className={cn(
				'flex w-full flex-col gap-4 md:flex-row md:items-start md:justify-between',
				className,
			)}
		>
			<div className="flex min-w-0 flex-1 items-start gap-3">
				{slots?.back ?? defaultBack}

				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					{slots?.beforeTitle}
					<div className={cn('flex max-w-[475px] flex-col gap-0.5', contentClassName)}>
						<div className="flex flex-wrap items-center gap-3">
							<Heading
								tag={headingTag}
								containerClassName="space-y-0"
								className={cn(PAGE_TITLE_CLASS[headingTag], titleClassName)}
							>
								{title}
							</Heading>
							{titleBadges.length > 0 && (
								<div className="flex items-center gap-1.5">
									{titleBadges.map((badge, index) => (
										<Badge
											key={badge.key ?? index}
											variant={badge.variant ?? 'secondary'}
										>
											{badge.label}
										</Badge>
									))}
								</div>
							)}
						</div>
						{!!description && (
							<Text size="xs" type="secondary" className={descriptionClassName}>
								{description}
							</Text>
						)}
						{slots?.afterDescription}
					</div>
				</div>
			</div>

			{slots?.actions ?? (
				!!actions && <div className={cn('shrink-0', actionsClassName)}>{actions}</div>
			)}
		</header>
	);
}
