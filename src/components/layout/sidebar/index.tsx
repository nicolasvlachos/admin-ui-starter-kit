 
export { Sidebar, defaultSidebarStrings, type SidebarProps, type SidebarStrings } from './sidebar';
export {
	SidebarProvider,
	useSidebar,
	type SidebarContext,
	type SidebarProviderProps,
} from './sidebar.context';

export { AppSidebar } from './app-sidebar';

export { SidebarLogo, type SidebarLogoProps } from './components/sidebar-logo';
export { SidebarWorkspaceDropdown } from './components/sidebar-workspace-dropdown';
export {
	SidebarNavigation,
	DynamicIcon,
	Icon,
	type SidebarNavigationItem,
} from './components/sidebar-navigation';
export { SidebarGroupedNavigation } from './components/sidebar-grouped-navigation';
export { SidebarNavigationFooter } from './components/sidebar-navigation-footer';
export {
	SidebarNavigationUser,
	defaultSidebarNavigationUserStrings,
	type SidebarNavigationUserProps,
	type SidebarNavigationUserStrings,
	type SidebarUserData,
} from './components/sidebar-navigation-user';

export {
	toPath,
	isPathMatch,
	getNavLabel,
	getNavKey,
	DynamicIcon as SidebarIcon,
	NavBadge,
	resolveNavBadge,
} from './sidebar.utils';

export {
	defaultSidebarWorkspaceDropdownStrings,
	type AppSidebarProps,
	type SidebarNavItem,
	type SidebarFlatNavItem,
	type SidebarRenderItemContext,
	type SidebarSlots,
	type SidebarFlatNavigationProps,
	type SidebarGroupedNavigationProps,
	type SidebarFooterNavigationItem,
	type SidebarNavigationFooterProps,
	type WorkspaceLink,
	type SidebarWorkspaceDropdownProps,
	type SidebarWorkspaceDropdownStrings,
} from './sidebar.types';
