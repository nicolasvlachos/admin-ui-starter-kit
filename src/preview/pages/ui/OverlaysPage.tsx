import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PreviewPage, PreviewSection, Row } from '../../PreviewLayout';

export default function OverlaysPage() {
	const [open, setOpen] = useState(false);

	return (
		<TooltipProvider>
			<PreviewPage title="UI · Overlays" description="Dialog, Sheet, Popover, Tooltip, HoverCard.">
				<PreviewSection title="Dialog">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger render={(p) => <Button {...p}>Open dialog</Button>} />
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Confirm action</DialogTitle>
								<DialogDescription>This is a controlled dialog.</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
								<Button onClick={() => setOpen(false)}>Confirm</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</PreviewSection>

				<PreviewSection title="Sheet">
					<Sheet>
						<SheetTrigger render={(p) => <Button variant="outline" {...p}>Open sheet</Button>} />
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Sheet title</SheetTitle>
								<SheetDescription>Side-anchored panel.</SheetDescription>
							</SheetHeader>
							<div className="px-4 py-2 text-sm">Sheet body content.</div>
						</SheetContent>
					</Sheet>
				</PreviewSection>

				<PreviewSection title="Popover">
					<Popover>
						<PopoverTrigger render={(p) => <Button variant="outline" {...p}>Open popover</Button>} />
						<PopoverContent className="w-64 text-sm">
							Popover content with arbitrary children.
						</PopoverContent>
					</Popover>
				</PreviewSection>

				<PreviewSection title="Tooltip">
					<Row>
						<Tooltip>
							<TooltipTrigger render={(p) => <Button variant="outline" {...p}>Hover me</Button>} />
							<TooltipContent>Hello, I'm a tooltip.</TooltipContent>
						</Tooltip>
					</Row>
				</PreviewSection>

				<PreviewSection title="Hover card">
					<HoverCard>
						<HoverCardTrigger render={(p) => <Button variant="link" {...p}>@maria</Button>} />
						<HoverCardContent className="w-64 text-sm">
							<div className="font-medium">Sarah Smitha</div>
							<div className="text-muted-foreground">Account Manager</div>
							<div className="mt-2 text-xs text-muted-foreground">Joined Jan 2023.</div>
						</HoverCardContent>
					</HoverCard>
				</PreviewSection>
			</PreviewPage>
		</TooltipProvider>
	);
}
