/**
 * SmartCardSkeleton — placeholder shell rendered while a SmartCard's
 * data is loading. Picks up the canonical card surface so the loading
 * state visually matches the eventual `SmartCard` it'll replace.
 */
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { SURFACE_CLASSES } from '../smart-card.tokens';

import {
	CardContent,
	CardHeader,
	CardShell,
	CardTitle,
} from './card-primitives';

export interface SmartCardSkeletonProps {
	title?: ReactNode;
	lines?: number;
	className?: string;
}

export function SmartCardSkeleton({
	title,
	lines = 2,
	className,
}: SmartCardSkeletonProps) {
	const SkeletonBar = ({ barClassName }: { barClassName?: string }) => (
		<div className={cn('animate-pulse rounded bg-muted', barClassName)} />
	);

	return (
		<CardShell className={cn(SURFACE_CLASSES.card, 'gap-4 py-6', className)}>
			<CardHeader className="flex-col gap-1.5 px-6 pb-0">
				{title ? <CardTitle>{title}</CardTitle> : <SkeletonBar barClassName="h-4 w-32" />}
			</CardHeader>
			<CardContent className="space-y-3 px-6 py-0">
				{Array.from({ length: lines }, (_, i) => (
					<SkeletonBar
						key={`skel-${String(i)}`}
						barClassName={cn('h-4', i === 0 ? 'w-full' : 'w-3/4')}
					/>
				))}
			</CardContent>
		</CardShell>
	);
}

SmartCardSkeleton.displayName = 'SmartCardSkeleton';
