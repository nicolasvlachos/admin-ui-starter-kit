import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Magnifying-glass illustration centered on a soft tinted disk — for
 * "no search results", "nothing matches your filters" surfaces.
 */
export function SearchGlassIllustration({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'flex size-20 items-center justify-center rounded-full bg-muted/40 ring-8 ring-muted/20',
				className,
			)}
			aria-hidden="true"
		>
			<Search className="size-8 text-muted-foreground" />
		</div>
	);
}

SearchGlassIllustration.displayName = 'SearchGlassIllustration';
