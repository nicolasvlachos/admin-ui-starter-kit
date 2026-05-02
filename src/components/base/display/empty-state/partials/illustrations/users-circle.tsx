import { cn } from '@/lib/utils';

/**
 * Three overlapping avatar circles — for "no team members", "no
 * customers", "no contributors" surfaces.
 */
export function UsersCircleIllustration({ className }: { className?: string }) {
	return (
		<div className={cn('relative flex h-24 w-32 items-center justify-center', className)} aria-hidden="true">
			<div className="bg-muted/70 border-border absolute left-2 size-12 rounded-full border-2" />
			<div className="bg-muted border-border z-10 size-14 rounded-full border-2 shadow-sm" />
			<div className="bg-muted/60 border-border absolute right-2 size-10 rounded-full border-2" />
		</div>
	);
}

UsersCircleIllustration.displayName = 'UsersCircleIllustration';
