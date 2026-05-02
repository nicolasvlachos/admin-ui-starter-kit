/**
 * base/sidebar — thin pass-through wrapper around the shadcn `Sidebar`
 * compound component.
 *
 * Why it exists: rule 1/2 forbid importing `@/components/ui/*` outside the
 * matching base wrapper. The layout/sidebar package and its consumers
 * compose this re-export so the layering rule holds and the next shadcn
 * upgrade can't silently change the API at every call site.
 *
 * All parts are re-exported untouched — the shadcn compound-component
 * pattern keeps working.
 */
export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
