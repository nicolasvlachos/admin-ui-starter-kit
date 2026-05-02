import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function CollapsiblePage() {
	const [open, setOpen] = useState(false);
	return (
		<PreviewPage title="UI · Collapsible" description="Headless show/hide region.">
			<PreviewSection title="Default" span="full">
				<Collapsible open={open} onOpenChange={setOpen}>
					<CollapsibleTrigger
						render={(p) => (
							<Button variant="outline" {...p}>
								<ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
								{open ? 'Hide details' : 'Show details'}
							</Button>
						)}
					/>
					<CollapsibleContent className="mt-3 rounded-md border border-border p-3 text-sm">
						<p>Hidden content revealed.</p>
						<p className="text-muted-foreground">More text here.</p>
					</CollapsibleContent>
				</Collapsible>
			</PreviewSection>
		</PreviewPage>
	);
}
