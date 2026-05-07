import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/base/badge';
import { cn } from '@/lib/utils';
import type { DocsPageProps } from './types';

export function DocsPage({
	title,
	description,
	layer,
	status,
	sourcePath,
	children,
}: DocsPageProps) {
	return (
		<article className="docs-page--component w-full min-w-0 pb-24">
			<header className={cn('docs-page--header border-b border-border pb-6')}>
				<div className="flex flex-wrap items-center gap-2">
					{!!layer && (
						<Badge variant="secondary" size="xs">{layer}</Badge>
					)}
					{status === 'wip' && <Badge variant="warning" size="xs">WIP</Badge>}
					{status === 'broken' && <Badge variant="destructive" size="xs">Broken</Badge>}
				</div>
				<Heading tag="h1" className="mt-2">{title}</Heading>
				{!!description && (
					<Text type="secondary" className="mt-1">{description}</Text>
				)}
				{!!sourcePath && (
					<Text size="xs" type="discrete" className="mt-3 font-mono">{sourcePath}</Text>
				)}
			</header>
			<div className="docs-page--body mt-8 space-y-12">{children}</div>
		</article>
	);
}
