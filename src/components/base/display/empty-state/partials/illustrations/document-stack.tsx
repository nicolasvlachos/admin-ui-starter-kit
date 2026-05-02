import { cn } from '@/lib/utils';

/**
 * Two staggered document silhouettes — for "no documents", "no
 * invoices", "no reports" surfaces.
 */
export function DocumentStackIllustration({ className }: { className?: string }) {
	return (
		<div className={cn('relative h-24 w-32', className)} aria-hidden="true">
			<div className="bg-muted/70 dark:bg-muted/40 border-border/50 absolute left-1 top-1 flex h-20 w-20 -rotate-6 flex-col gap-1.5 rounded-md border p-2 shadow-sm">
				<div className="bg-muted h-2 w-12 rounded" />
				<div className="bg-muted/60 h-1.5 w-10 rounded" />
				<div className="bg-muted/60 h-1.5 w-9 rounded" />
			</div>
			<div className="bg-background border-border absolute right-1 top-2 flex h-20 w-20 rotate-3 flex-col gap-1.5 rounded-md border p-2 shadow-sm">
				<div className="bg-muted h-2 w-12 rounded" />
				<div className="bg-muted/60 h-1.5 w-10 rounded" />
				<div className="bg-muted/60 h-1.5 w-9 rounded" />
				<div className="mt-auto flex items-center gap-1">
					<div className="bg-success size-1.5 rounded-full" />
					<div className="bg-muted/60 h-1.5 w-8 rounded" />
				</div>
			</div>
		</div>
	);
}

DocumentStackIllustration.displayName = 'DocumentStackIllustration';
