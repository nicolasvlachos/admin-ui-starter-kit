import { Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function MenusPage() {
	return (
		<PreviewPage title="UI · Menus" description="DropdownMenu, ContextMenu, Command palette.">
			<PreviewSection title="Dropdown menu">
				<DropdownMenu>
					<DropdownMenuTrigger render={(p) => <Button variant="outline" {...p}>Open menu</Button>} />
					<DropdownMenuContent>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem><Edit className="size-3.5" /> Edit</DropdownMenuItem>
						<DropdownMenuItem><Copy className="size-3.5" /> Duplicate</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive"><Trash2 className="size-3.5" /> Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</PreviewSection>

			<PreviewSection title="Context menu (right-click)">
				<ContextMenu>
					<ContextMenuTrigger>
						<div className="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
							Right-click here
						</div>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuLabel>File</ContextMenuLabel>
						<ContextMenuSeparator />
						<ContextMenuItem><Edit className="size-3.5" /> Rename</ContextMenuItem>
						<ContextMenuItem><Copy className="size-3.5" /> Copy</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem variant="destructive"><Trash2 className="size-3.5" /> Delete</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</PreviewSection>

			<PreviewSection title="Command palette" span="full">
				<Command className="rounded-md border border-border">
					<CommandInput placeholder="Type a command…" />
					<CommandList>
						<CommandEmpty>No results.</CommandEmpty>
						<CommandGroup heading="Actions">
							<CommandItem>Create order</CommandItem>
							<CommandItem>Add customer</CommandItem>
							<CommandItem>Generate invoice</CommandItem>
						</CommandGroup>
						<CommandGroup heading="Navigation">
							<CommandItem>Go to Orders</CommandItem>
							<CommandItem>Go to Settings</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PreviewSection>
		</PreviewPage>
	);
}
