import { Separator } from '@/components/ui/separator';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function SeparatorPage() {
	return (
		<PreviewPage title="UI · Separator" description="Horizontal & vertical dividers.">
			<PreviewSection title="Horizontal" span="full">
				<div>
					<div className="text-sm">Above</div>
					<Separator className="my-3" />
					<div className="text-sm">Below</div>
				</div>
			</PreviewSection>

			<PreviewSection title="Vertical">
				<div className="flex h-10 items-center">
					<span className="text-sm">Item A</span>
					<Separator orientation="vertical" className="mx-3" />
					<span className="text-sm">Item B</span>
					<Separator orientation="vertical" className="mx-3" />
					<span className="text-sm">Item C</span>
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
