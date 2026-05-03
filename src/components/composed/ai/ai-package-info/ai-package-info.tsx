/**
 * AiPackageInfo — compact card describing an npm / library package referenced
 * by the model. Header: name + version chip; body: description + optional
 * meta (license, published date, weekly downloads) and keyword chips. Footer
 * exposes homepage / repository links when provided.
 */
import { Code2, ExternalLink, Globe, Package } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultAiPackageInfoStrings, type AiPackageInfoProps } from './types';

export function AiPackageInfo({
	name,
	version,
	description,
	license,
	publishedAt,
	homepage,
	repository,
	weeklyDownloads,
	keywords,
	onSelect,
	className,
	strings: stringsProp,
}: AiPackageInfoProps) {
	const strings = useStrings(defaultAiPackageInfoStrings, stringsProp);

	const Wrapper = onSelect ? 'button' : 'div';
	const wrapperProps = onSelect
		? {
				type: 'button' as const,
				onClick: onSelect,
			}
		: {};

	return (
		<Wrapper
			{...wrapperProps}
			className={cn('ai-package-info--component', 
				'block w-full rounded-lg border border-border/60 bg-card text-left',
				onSelect &&
					'transition-[border-color,background] duration-150 hover:border-foreground/20 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
				className,
			)}
		>
			<div className="flex items-start gap-3 px-3.5 py-3">
				<span
					aria-hidden
					className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
				>
					<Package className="size-4" />
				</span>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<Text weight="semibold" className="truncate font-mono">
							{name}
						</Text>
						{!!version && (
							<Badge variant="secondary" className="font-mono tabular-nums">
								v{version.replace(/^v/, '')}
							</Badge>
						)}
					</div>
					{!!description && (
						<Text size="xs" type="secondary" className="mt-1 line-clamp-2">
							{description}
						</Text>
					)}

					{(license || publishedAt || weeklyDownloads !== undefined) && (
						<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
							{!!license && (
								<MetaItem label={strings.licenseLabel} value={license} />
							)}
							{!!publishedAt && (
								<MetaItem label={strings.publishedLabel} value={publishedAt} />
							)}
							{weeklyDownloads !== undefined && (
								<MetaItem
									label={strings.weeklyDownloadsLabel}
									value={String(weeklyDownloads)}
								/>
							)}
						</div>
					)}

					{!!keywords?.length && (
						<div className="mt-2 flex flex-wrap gap-1">
							{keywords.slice(0, 6).map((kw) => (
								<Badge key={kw} variant="secondary">
									{kw}
								</Badge>
							))}
						</div>
					)}
				</div>
			</div>

			{(homepage || repository) && (
				<div className="flex items-center gap-2 border-t border-border/60 bg-muted/20 px-3.5 py-2">
					{!!homepage && (
						<a
							href={homepage}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							aria-label={strings.homepageAria}
							className="inline-flex items-center gap-1 rounded text-muted-foreground hover:text-foreground"
						>
							<Globe className="size-3.5" />
							<Text tag="span" size="xxs" weight="medium">
								Homepage
							</Text>
							<ExternalLink className="size-3" />
						</a>
					)}
					{!!homepage && !!repository && (
						<span aria-hidden className="text-muted-foreground/40">
							·
						</span>
					)}
					{!!repository && (
						<a
							href={repository}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							aria-label={strings.repositoryAria}
							className="inline-flex items-center gap-1 rounded text-muted-foreground hover:text-foreground"
						>
							<Code2 className="size-3.5" />
							<Text tag="span" size="xxs" weight="medium">
								Repository
							</Text>
							<ExternalLink className="size-3" />
						</a>
					)}
				</div>
			)}
		</Wrapper>
	);
}

AiPackageInfo.displayName = 'AiPackageInfo';

function MetaItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="inline-flex items-baseline gap-1">
			<Text size="xxs" type="discrete">
				{label}
			</Text>
			<Text size="xxs" type="secondary" weight="medium" className="tabular-nums">
				{value}
			</Text>
		</div>
	);
}
