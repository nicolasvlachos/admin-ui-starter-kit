import { cn } from '@/lib/utils';

/**
 * Open inbox tray with a soft check above — for "all caught up",
 * "no notifications", "inbox zero" surfaces.
 */
export function InboxCleanIllustration({ className }: { className?: string }) {
	return (
		<div className={cn('relative h-24 w-32', className)} aria-hidden="true">
			<div className="bg-success/12 border-success/30 absolute left-1/2 top-0 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border">
				<svg
					viewBox="0 0 16 16"
					className="text-success size-3.5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M3 8l3 3 7-7" />
				</svg>
			</div>
			<div className="bg-background border-border absolute inset-x-0 bottom-0 flex h-14 flex-col rounded-lg border shadow-sm">
				<div className="bg-muted/30 h-3 rounded-t-lg" />
				<div className="flex flex-1 items-center justify-between px-3">
					<div className="flex flex-col gap-1">
						<div className="bg-muted/60 h-1.5 w-12 rounded" />
						<div className="bg-muted/40 h-1.5 w-8 rounded" />
					</div>
					<div className="bg-muted/40 size-3 rounded-full" />
				</div>
			</div>
		</div>
	);
}

InboxCleanIllustration.displayName = 'InboxCleanIllustration';
