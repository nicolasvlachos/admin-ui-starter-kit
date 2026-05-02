import { Skeleton } from '@/components/ui/skeleton';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function SkeletonPage() {
	return (
		<PreviewPage title="UI · Skeleton" description="Animated loading placeholders.">
			<PreviewSection title="Lines">
				<Col>
					<Skeleton className="h-4 w-[80%]" />
					<Skeleton className="h-4 w-[60%]" />
					<Skeleton className="h-4 w-[40%]" />
				</Col>
			</PreviewSection>

			<PreviewSection title="Card placeholder">
				<div className="flex items-center gap-3">
					<Skeleton className="size-10 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-48" />
					</div>
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
