/**
 * AsideNavigationMenu — vertical list of navigation links with active-state
 * highlight. Active item is matched by deepest path prefix so nested routes
 * still highlight their parent. Pass `currentPath` explicitly when SSR-ing or
 * when the consuming router does not update `window.location` synchronously.
 */
import { BaseButton } from '@/components/base/buttons';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';

interface AsideNavigationMenuProps {
	items: NavItem[];
	currentPath?: string;
	activeClassName?: string;
	itemClassName?: string;
}

function normalizePath(rawUrl: string): string {
	if (rawUrl.length === 0) {
		return '/';
	}

	try {
		const baseOrigin =
			typeof window !== 'undefined'
				? window.location.origin
				: 'http://localhost';
		const parsed = new URL(rawUrl, baseOrigin);
		const trimmed = parsed.pathname.replace(/\/+$/, '');
		return trimmed.length > 0 ? trimmed : '/';
	} catch {
		const clean = rawUrl.split('?')[0] ?? rawUrl;
		const trimmed = clean.replace(/\/+$/, '');
		return trimmed.length > 0 ? trimmed : '/';
	}
}

export default function AsideNavigationMenu({
	items,
	currentPath,
	activeClassName,
	itemClassName,
}: AsideNavigationMenuProps) {
	const rawActivePath = currentPath ?? (typeof window !== 'undefined' ? window.location.pathname : '');
	const activePath = normalizePath(rawActivePath);
	const resolvedActiveClassName =
		typeof activeClassName === 'string' && activeClassName.length > 0
			? activeClassName
			: 'bg-muted';
	const normalizedItems = items.map((item) => ({
		item,
		normalizedPath: normalizePath(item.href),
	}));

	const activeItemPath =
		normalizedItems
			.filter(
				({ normalizedPath }) =>
					activePath === normalizedPath ||
					activePath.startsWith(`${normalizedPath}/`),
			)
			.sort((a, b) => b.normalizedPath.length - a.normalizedPath.length)[0]
			?.normalizedPath ?? null;

	return (
		<nav className="flex flex-col space-y-1 space-x-0">
			{normalizedItems.map(({ item, normalizedPath }) => {
				const isActive = normalizedPath === activeItemPath;

				return (
					<BaseButton
						key={item.href}
						variant="secondary"
						buttonStyle="ghost"
						size="sm"
						fullWidth
						className={cn(
							'justify-start',
							itemClassName,
							isActive ? resolvedActiveClassName : null,
						)}
						nativeButton={false}
						render={(renderProps) => (
							<a {...renderProps} href={item.href} />
						)}
					>
						{item.title}
					</BaseButton>
				);
			})}
		</nav>
	);
}

AsideNavigationMenu.displayName = 'AsideNavigationMenu';
